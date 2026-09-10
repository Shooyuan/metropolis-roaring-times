#!/usr/bin/env python3
"""Convert a Figma handoff ZIP into a compact, deterministic runtime package."""

from __future__ import annotations

import argparse
import copy
import hashlib
import html
import json
import math
import re
import shutil
import sys
import tempfile
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path
from zipfile import ZipFile

from PIL import Image, ImageDraw, ImageFont


SVG_NS = "http://www.w3.org/2000/svg"
XLINK_NS = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG_NS)
ET.register_namespace("xlink", XLINK_NS)

PRICE_BANDS = {
    "cheap": (6_000, 10_000),
    "medium": (11_000, 18_000),
    "expensive": (19_000, 26_000),
}
PRICE_STEP = 500
DEFAULT_PRICE_SEED = "metropolis_map_v001_price_seed_2026_09_08"
PIXELS_PER_MAP_UNIT = 4.0
MAX_IMAGE_EDGE = 2048
WEBP_QUALITY = 92

KNOWN_LANDMARK_IDS = {
    "Little Ch. Around the Corner": "landmark_little_church_around_the_corner",
    "St. Patrick’s Cathedral": "landmark_st_patricks_cathedral",
}


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize_id(value: str, prefix: str) -> str:
    value = value.strip()
    value = re.sub(r"(?i)[-_ ]transparent$", "", value)
    value = value.replace("’", "'")
    value = re.sub(r"'s\b", "s", value, flags=re.IGNORECASE)
    value = re.sub(r"[^A-Za-z0-9]+", "_", value).strip("_").lower()
    value = re.sub(r"_+", "_", value)
    if not value.startswith(prefix + "_"):
        value = prefix + "_" + value
    return value


def runtime_landmark_id(source_name: str) -> str:
    if source_name in KNOWN_LANDMARK_IDS:
        return KNOWN_LANDMARK_IDS[source_name]
    value = normalize_id(source_name, "landmark")
    value = value.replace("landmark_st__", "landmark_st_")
    value = value.replace("landmark_little_ch_around_the_corner", "landmark_little_church_around_the_corner")
    return value


def walk(node: dict):
    yield node
    for child in node.get("children", []):
        yield from walk(child)


def find_node(root: dict, node_id: str) -> dict:
    for node in walk(root):
        if node.get("id") == node_id:
            return node
    raise KeyError(f"Figma node not found: {node_id}")


def find_image_node(root: dict, landmark_structure: dict) -> tuple[dict, str]:
    for compact_node in walk(landmark_structure):
        full_node = find_node(root, compact_node["id"])
        for fill in full_node.get("properties", {}).get("fills", []):
            if fill.get("type") == "IMAGE" and fill.get("visible", True) and fill.get("imageHash"):
                return full_node, fill["imageHash"]
    raise ValueError(f"Landmark has no visible image fill: {landmark_structure.get('name')}")


def box(node: dict, key: str = "relativeToMaster") -> dict:
    value = node.get(key)
    if not value:
        raise ValueError(f"Missing {key} on {node.get('name')}")
    return {name: round(float(value[name]), 4) for name in ("x", "y", "width", "height")}


def extract_title_svg(svg_bytes: bytes) -> bytes:
    root = ET.fromstring(svg_bytes)
    title = next((element for element in root.iter() if element.attrib.get("id") == "title"), None)
    if title is None:
        raise ValueError("Landmark SVG has no title group")

    new_root = ET.Element(root.tag, root.attrib)
    new_root.append(copy.deepcopy(title))

    # Title masks can live inside the title group. Keep only external definitions
    # that do not contain a raster image, so the label file cannot duplicate art.
    for child in root:
        if child.tag == f"{{{SVG_NS}}}defs":
            clean_defs = ET.Element(child.tag, child.attrib)
            for definition in child:
                if not any(desc.tag == f"{{{SVG_NS}}}image" for desc in definition.iter()):
                    clean_defs.append(copy.deepcopy(definition))
            if len(clean_defs):
                new_root.append(clean_defs)
    return ET.tostring(new_root, encoding="utf-8", xml_declaration=True)


def target_size(source_size: tuple[int, int], map_size: tuple[float, float]) -> tuple[int, int]:
    target_w = max(1, int(round(map_size[0] * PIXELS_PER_MAP_UNIT)))
    target_h = max(1, int(round(map_size[1] * PIXELS_PER_MAP_UNIT)))
    edge_scale = min(1.0, MAX_IMAGE_EDGE / max(target_w, target_h))
    target_w = max(1, int(round(target_w * edge_scale)))
    target_h = max(1, int(round(target_h * edge_scale)))
    source_scale = min(1.0, source_size[0] / target_w, source_size[1] / target_h)
    return max(1, int(round(target_w * source_scale))), max(1, int(round(target_h * source_scale)))


def deterministic_price(seed: str, tier: str, geometry_data: str) -> int:
    low, high = PRICE_BANDS[tier]
    choices = list(range(low, high + 1, PRICE_STEP))
    digest = hashlib.sha256(f"{seed}|{tier}|{geometry_data}".encode("utf-8")).digest()
    return choices[int.from_bytes(digest[:8], "big") % len(choices)]


def svg_local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def rewrite_plot_svg(svg_bytes: bytes, plot_rows: list[dict]) -> bytes:
    root = ET.fromstring(svg_bytes)
    paths_by_tier: dict[str, list[ET.Element]] = {}
    for element in root.iter():
        if svg_local_name(element.tag) == "g" and element.attrib.get("id") in PRICE_BANDS:
            paths_by_tier[element.attrib["id"]] = [
                child for child in list(element) if svg_local_name(child.tag) == "path"
            ]
            element.attrib["id"] = f"price_tier_{element.attrib['id']}"

    rows_by_tier: dict[str, list[dict]] = {tier: [] for tier in PRICE_BANDS}
    for row in plot_rows:
        rows_by_tier[row["priceTier"]].append(row)

    for tier, rows in rows_by_tier.items():
        paths = paths_by_tier.get(tier, [])
        if len(paths) != len(rows):
            raise ValueError(f"Plot SVG/JSON mismatch for {tier}: {len(paths)} vs {len(rows)}")
        for path, row in zip(paths, rows):
            if path.attrib.get("id") != row["sourceSvgId"]:
                raise ValueError(
                    f"Plot order mismatch for {tier}: {path.attrib.get('id')} vs {row['sourceSvgId']}"
                )
            path.attrib["id"] = row["id"]
            path.attrib["data-price-tier"] = tier
            path.attrib["data-base-price"] = str(row["basePrice"])
    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def build_contact_sheet(landmarks: list[dict], output_dir: Path) -> None:
    tile_w, tile_h = 280, 220
    columns = 4
    rows = math.ceil(len(landmarks) / columns)
    canvas = Image.new("RGB", (columns * tile_w, rows * tile_h), "#f2e4ca")
    draw = ImageDraw.Draw(canvas)
    font = ImageFont.load_default()
    for index, landmark in enumerate(landmarks):
        x = (index % columns) * tile_w
        y = (index // columns) * tile_h
        image_path = output_dir / landmark["artwork"]["file"]
        with Image.open(image_path) as source:
            preview = source.convert("RGBA")
            preview.thumbnail((tile_w - 24, tile_h - 54), Image.Resampling.LANCZOS)
            px = x + (tile_w - preview.width) // 2
            py = y + 8 + (tile_h - 54 - preview.height) // 2
            canvas.paste(preview, (px, py), preview)
        draw.rectangle((x, y, x + tile_w - 1, y + tile_h - 1), outline="#3d3232", width=2)
        label = landmark["id"].replace("landmark_", "")[:38]
        draw.text((x + 10, y + tile_h - 38), label, fill="#2f2f2f", font=font)
        draw.text((x + 10, y + tile_h - 23), f"{index + 1:02d}  {landmark['artwork']['pixelWidth']}x{landmark['artwork']['pixelHeight']}", fill="#817b76", font=font)
    review_dir = output_dir / "review"
    review_dir.mkdir(parents=True, exist_ok=True)
    canvas.save(review_dir / "landmark_contact_sheet.webp", "WEBP", quality=88, method=6)


def build_alignment_review(master: dict, landmarks: list[dict], output_dir: Path) -> None:
    map_w = master["width"]
    map_h = master["height"]
    layers = []
    for landmark in landmarks:
        art = landmark["artwork"]
        bounds = art["bounds"]
        layers.append(
            f'<img class="landmark" src="../{html.escape(art["file"])}" '
            f'style="left:{bounds["x"]}px;top:{bounds["y"]}px;width:{bounds["width"]}px;height:{bounds["height"]}px" '
            f'alt="{html.escape(landmark["id"])}">'
        )
        group = landmark["bounds"]
        layers.append(
            f'<img class="label" src="../{html.escape(landmark["label"]["file"])}" '
            f'style="left:{group["x"]}px;top:{group["y"]}px;width:{group["width"]}px;height:{group["height"]}px" '
            f'alt="{html.escape(landmark["id"])} label">'
        )
    document = f"""<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><title>地图运行素材对齐审查</title>
<style>
body{{margin:0;background:#24211f;color:#f2e4ca;font-family:system-ui,sans-serif}}
header{{position:sticky;top:0;z-index:20;padding:12px 18px;background:#2f2f2fee}}
.viewport{{padding:18px;overflow:auto}} .map{{position:relative;width:{map_w}px;height:{map_h}px;transform-origin:top left;transform:scale(.12);margin-bottom:{int(map_h * .12 - map_h)}px}}
.map>img{{position:absolute;display:block}} .base,.geometry{{inset:0;width:100%;height:100%}}
.plots{{opacity:.6}} .landmark,.label{{object-fit:fill}}
</style>
<header><strong>Metropolis 地图运行素材对齐审查</strong> · 12% 总览 · 52 个地标 · 30 个地块</header>
<div class="viewport"><div class="map">
<img class="base" src="../base/metropolis_map_base.svg" alt="base map">
<img class="geometry districts" src="../geometry/metropolis_district_geometry.svg" alt="district geometry">
<img class="geometry plots" src="../geometry/metropolis_purchasable_blocks.svg" alt="purchasable plots">
{''.join(layers)}
</div></div></html>"""
    review_dir = output_dir / "review"
    review_dir.mkdir(parents=True, exist_ok=True)
    (review_dir / "alignment_review.html").write_text(document, encoding="utf-8")


def process(source_zip: Path, output_dir: Path, price_seed: str) -> dict:
    source_zip = source_zip.resolve()
    output_dir = output_dir.resolve()
    if output_dir.exists():
        shutil.rmtree(output_dir)
    for folder in ("base", "geometry", "illustrations", "labels", "review"):
        (output_dir / folder).mkdir(parents=True, exist_ok=True)

    source_size = source_zip.stat().st_size
    source_hash = sha256_file(source_zip)
    with ZipFile(source_zip) as archive, tempfile.TemporaryDirectory(prefix="metropolis_handoff_") as temp_name:
        temp_dir = Path(temp_name)
        document = json.loads(archive.read("handoff/figma_document.json"))
        landmark_handoff = json.loads(archive.read("handoff/landmarks.json"))
        export_summary = json.loads(archive.read("handoff/export_summary.json"))
        master = document["master"]
        tree = document["tree"]

        (output_dir / "base" / "metropolis_map_base.svg").write_bytes(
            archive.read("export/metropolis_map_base.svg")
        )
        (output_dir / "geometry" / "metropolis_district_geometry.svg").write_bytes(
            archive.read("export/metropolis_district_geometry.svg")
        )

        # Pair the compact Figma tree with SVG path order, then assign stable
        # geography-based IDs. Duplicate Figma names are retained only as audit data.
        plot_layer = next(
            child for child in tree.get("children", []) if child.get("name") == "08_PURCHASABLE_BLOCK_GEOMETRY"
        )
        plot_svg_bytes = archive.read("export/metropolis_purchasable_blocks.svg")
        plot_svg_root = ET.fromstring(plot_svg_bytes)
        svg_ids_by_tier = {}
        path_data_by_tier = {}
        for element in plot_svg_root.iter():
            if svg_local_name(element.tag) == "g" and element.attrib.get("id") in PRICE_BANDS:
                tier = element.attrib["id"]
                tier_paths = [child for child in list(element) if svg_local_name(child.tag) == "path"]
                svg_ids_by_tier[tier] = [path.attrib.get("id", "") for path in tier_paths]
                path_data_by_tier[tier] = [path.attrib.get("d", "") for path in tier_paths]

        source_plot_rows = []
        for tier_group in plot_layer.get("children", []):
            tier = tier_group.get("name", "").lower()
            if tier not in PRICE_BANDS:
                raise ValueError(f"Unknown price tier group: {tier_group.get('name')}")
            nodes = tier_group.get("children", [])
            if len(nodes) != len(svg_ids_by_tier.get(tier, [])):
                raise ValueError(f"Plot count mismatch in {tier}")
            for index, node in enumerate(nodes):
                path_data = path_data_by_tier[tier][index]
                source_plot_rows.append(
                    {
                        "sourceNodeId": node["id"],
                        "sourceName": node.get("name", ""),
                        "sourceSvgId": svg_ids_by_tier[tier][index],
                        "priceTier": tier,
                        "bounds": box(node),
                        "geometrySha256": sha256_bytes(path_data.encode("utf-8")),
                        "_pathData": path_data,
                    }
                )

        sorted_plot_rows = sorted(
            source_plot_rows,
            key=lambda row: (round(row["bounds"]["y"], 3), round(row["bounds"]["x"], 3)),
        )
        for index, row in enumerate(sorted_plot_rows, start=1):
            row["id"] = f"plot_{index:03d}"
            row["basePrice"] = deterministic_price(price_seed, row["priceTier"], row["_pathData"])
            del row["_pathData"]

        # rewrite_plot_svg pairs rows by original tier order, not geographic order.
        original_order_rows = []
        by_source_node = {row["sourceNodeId"]: row for row in sorted_plot_rows}
        for tier_group in plot_layer.get("children", []):
            for node in tier_group.get("children", []):
                original_order_rows.append(by_source_node[node["id"]])
        rewritten_plot_svg = rewrite_plot_svg(plot_svg_bytes, original_order_rows)
        (output_dir / "geometry" / "metropolis_purchasable_blocks.svg").write_bytes(rewritten_plot_svg)

        landmarks = []
        used_ids: set[str] = set()
        raw_image_bytes = 0
        output_image_bytes = 0
        for source in landmark_handoff["landmarks"]:
            stable_id = runtime_landmark_id(source["sourceName"])
            if stable_id in used_ids:
                raise ValueError(f"Duplicate normalized landmark ID: {stable_id}")
            used_ids.add(stable_id)
            full_image_node, image_hash = find_image_node(tree, source["structure"])
            image_zip_path = f"images/{image_hash}.png"
            raw = archive.read(image_zip_path)
            raw_image_bytes += len(raw)
            raw_path = temp_dir / f"{image_hash}.png"
            raw_path.write_bytes(raw)

            artwork_bounds = box(full_image_node)
            with Image.open(raw_path) as image:
                image.load()
                original_w, original_h = image.size
                target_w, target_h = target_size(
                    image.size, (artwork_bounds["width"], artwork_bounds["height"])
                )
                converted = image.convert("RGBA")
                if converted.size != (target_w, target_h):
                    converted = converted.resize((target_w, target_h), Image.Resampling.LANCZOS)
                artwork_file = Path("illustrations") / f"{stable_id}.webp"
                converted.save(
                    output_dir / artwork_file,
                    "WEBP",
                    quality=WEBP_QUALITY,
                    method=6,
                    exact=True,
                )
                output_image_bytes += (output_dir / artwork_file).stat().st_size

            label_file = Path("labels") / f"{stable_id}_label.svg"
            label_bytes = extract_title_svg(archive.read(source["file"]))
            (output_dir / label_file).write_bytes(label_bytes)
            label_node = next(
                (node for node in walk(source["structure"]) if node.get("name") == "title"), None
            )
            if label_node is None:
                raise ValueError(f"Missing title structure for {source['sourceName']}")

            landmarks.append(
                {
                    "id": stable_id,
                    "sourceName": source["sourceName"],
                    "sourceStableId": source["stableId"],
                    "sourceNodeId": source["structure"]["id"],
                    "bounds": box(source),
                    "artwork": {
                        "file": artwork_file.as_posix(),
                        "bounds": artwork_bounds,
                        "sourceImageHash": image_hash,
                        "sourcePixelWidth": original_w,
                        "sourcePixelHeight": original_h,
                        "pixelWidth": target_w,
                        "pixelHeight": target_h,
                    },
                    "label": {
                        "file": label_file.as_posix(),
                        "bounds": box(label_node),
                        "fontDependency": "Jacquard 24",
                    },
                }
            )

    plots_payload = {
        "format": "metropolis_runtime_plots",
        "formatVersion": 1,
        "master": master,
        "idOrder": "north_to_south_then_west_to_east",
        "priceGeneration": {
            "timing": "content_build_time",
            "algorithm": "sha256(seed|tier|svg_path_data) modulo inclusive $500 steps",
            "seed": price_seed,
            "bands": {tier: {"min": low, "max": high} for tier, (low, high) in PRICE_BANDS.items()},
            "step": PRICE_STEP,
        },
        "plotCount": len(sorted_plot_rows),
        "plots": sorted_plot_rows,
    }
    landmarks_payload = {
        "format": "metropolis_runtime_landmarks",
        "formatVersion": 1,
        "master": master,
        "displayThresholdPercent": 500,
        "selectionIsMutuallyExclusiveWith": ["district", "plot"],
        "landmarkCount": len(landmarks),
        "landmarks": landmarks,
    }
    (output_dir / "plots.json").write_text(json.dumps(plots_payload, ensure_ascii=False, indent=2), encoding="utf-8")
    (output_dir / "landmarks.json").write_text(
        json.dumps(landmarks_payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    build_contact_sheet(landmarks, output_dir)
    build_alignment_review(master, landmarks, output_dir)

    generated_files = [path for path in output_dir.rglob("*") if path.is_file()]
    total_output_size = sum(path.stat().st_size for path in generated_files)
    tier_counts = Counter(row["priceTier"] for row in sorted_plot_rows)
    prices_by_tier = {
        tier: [row["basePrice"] for row in sorted_plot_rows if row["priceTier"] == tier]
        for tier in PRICE_BANDS
    }
    report = {
        "source": {
            "file": source_zip.name,
            "sha256": source_hash,
            "bytes": source_size,
            "exportMode": export_summary.get("exportMode"),
            "warnings": export_summary.get("warnings", []),
        },
        "output": {
            "directory": output_dir.name,
            "bytes": total_output_size,
            "reductionPercent": round((1 - total_output_size / source_size) * 100, 2),
            "fileCount": len(generated_files),
        },
        "landmarks": {
            "count": len(landmarks),
            "rawPngBytes": raw_image_bytes,
            "optimizedWebpBytes": output_image_bytes,
            "imageReductionPercent": round((1 - output_image_bytes / raw_image_bytes) * 100, 2),
            "normalizedIds": [
                {"source": row["sourceName"], "runtime": row["id"]}
                for row in landmarks
                if row["sourceStableId"] != row["id"]
            ],
        },
        "plots": {
            "count": len(sorted_plot_rows),
            "tierCounts": dict(tier_counts),
            "pricesByTier": prices_by_tier,
        },
        "knownFollowUp": [
            "地标横幅 SVG 仍声明 Jacquard 24；接入网页前须随项目提供该字体或由老板批准替代字体。",
            "仓库中的现有 .fig 本地副本早于本次 ZIP；老板仍须保存与 v004 内容同步的新版本化 .fig 快照。",
            "本阶段不修改现有网页；alignment_review.html 只用于离线位置审查。",
            "地块价格是内容构建时固定生成，不在每局开始时重新随机。",
        ],
    }
    (output_dir / "processing_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    owner_report = f"""# 地图运行素材处理验收单

## 处理结果

- 原始交付包：`{source_zip.name}`，SHA-256 `{source_hash}`。
- 历史地标：{len(landmarks)} 个；每个均拆成轻量 `WebP` 插画与独立矢量横幅。
- 可购买地块：{len(sorted_plot_rows)} 个；按地图从北到南、同排从西到东编号为 `plot_001`—`plot_{len(sorted_plot_rows):03d}`。
- 价格层级：便宜 {tier_counts['cheap']} 块、中等 {tier_counts['medium']} 块、昂贵 {tier_counts['expensive']} 块。
- 地标位图：{raw_image_bytes / 1024 / 1024:.1f} MiB → {output_image_bytes / 1024 / 1024:.1f} MiB，缩减 {(1 - output_image_bytes / raw_image_bytes) * 100:.1f}%.
- 完整运行素材目录：{total_output_size / 1024 / 1024:.1f} MiB，相对原 ZIP 缩减 {(1 - total_output_size / source_size) * 100:.1f}%.

## 地价生成口径

Figma 的 `cheap`、`medium`、`expensive` 父组是老板确定的价格层级，不是视觉分组。精确基础地价由处理器在内容构建时生成：便宜 `$6,000–$10,000`、中等 `$11,000–$18,000`、昂贵 `$19,000–$26,000`，步长 `$500`。种子与几何路径共同决定结果，因此同一版本重复处理得到完全相同的价格；进入游戏后不会每局改变。

## 请老板检查

1. 打开 `review/landmark_contact_sheet.webp`，确认 52 个插画没有裁坏、错图或明显糊损。
2. 打开 `review/alignment_review.html`，确认地标、横幅、街区和地块仍在 Figma 原坐标。
3. 查看 `plots.json`，抽查价格层级和确切地价是否符合预期。

## 已知但不阻塞本阶段的问题

- 横幅仍使用 Figma 导出的 `Jacquard 24` 文字声明；正式接入网页前必须把该字体纳入项目或由老板批准替代。
- 仓库内现有 `.fig` 本地副本早于本次 ZIP；老板仍须从当前 Figma 文件保存一份与 `v004` 同步的版本化 `.fig` 快照。
- 本阶段只生成运行素材和审查页，不修改当前网页，也没有把地块交互接进游戏。
- 历史地标的年代适配与百科内容属于后续内容阶段，本次仅保持老板提交的位置和图像。
"""
    (output_dir / "OWNER_REVIEW_ZH_CN.md").write_text(owner_report, encoding="utf-8")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_zip", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--price-seed", default=DEFAULT_PRICE_SEED)
    args = parser.parse_args()
    report = process(args.source_zip, args.output_dir, args.price_seed)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())

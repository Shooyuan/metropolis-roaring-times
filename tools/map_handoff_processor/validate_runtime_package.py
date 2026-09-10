#!/usr/bin/env python3
"""Validate the generated Metropolis runtime-map package without rewriting it."""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image


PROCESSOR_PATH = Path(__file__).with_name("process_handoff.py")
SPEC = importlib.util.spec_from_file_location("process_handoff", PROCESSOR_PATH)
PROCESSOR = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(PROCESSOR)


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def view_box(path: Path) -> str:
    return ET.parse(path).getroot().attrib.get("viewBox", "")


def inside(bounds: dict, width: float, height: float) -> bool:
    epsilon = 0.1
    return (
        bounds["x"] >= -epsilon
        and bounds["y"] >= -epsilon
        and bounds["x"] + bounds["width"] <= width + epsilon
        and bounds["y"] + bounds["height"] <= height + epsilon
    )


def validate(package_dir: Path) -> dict:
    package_dir = package_dir.resolve()
    errors: list[str] = []
    plots = json.loads((package_dir / "plots.json").read_text(encoding="utf-8"))
    landmarks = json.loads((package_dir / "landmarks.json").read_text(encoding="utf-8"))
    master = plots["master"]
    width, height = float(master["width"]), float(master["height"])

    shared_svgs = [
        package_dir / "base/metropolis_map_base.svg",
        package_dir / "geometry/metropolis_district_geometry.svg",
        package_dir / "geometry/metropolis_purchasable_blocks.svg",
    ]
    expected_view_box = f"0 0 {int(width)} {int(height)}"
    for svg in shared_svgs:
        if not svg.exists():
            errors.append(f"missing shared SVG: {svg.name}")
        elif view_box(svg) != expected_view_box:
            errors.append(f"viewBox mismatch: {svg.name} -> {view_box(svg)}")

    plot_rows = plots["plots"]
    plot_ids = [row["id"] for row in plot_rows]
    expected_ids = [f"plot_{index:03d}" for index in range(1, len(plot_rows) + 1)]
    if plot_ids != expected_ids:
        errors.append("plot IDs are not consecutive geographic-order IDs")
    if len(set(plot_ids)) != len(plot_ids):
        errors.append("duplicate plot IDs")
    if any(not inside(row["bounds"], width, height) for row in plot_rows):
        errors.append("plot bounds outside master canvas")
    for row in plot_rows:
        low, high = PROCESSOR.PRICE_BANDS.get(row["priceTier"], (1, 0))
        if not low <= row["basePrice"] <= high or row["basePrice"] % PROCESSOR.PRICE_STEP:
            errors.append(f"invalid price for {row['id']}")

    plot_root = ET.parse(shared_svgs[2]).getroot()
    plot_paths = [element for element in plot_root.iter() if local_name(element.tag) == "path"]
    svg_plot_ids = [path.attrib.get("id") for path in plot_paths]
    if set(svg_plot_ids) != set(plot_ids):
        errors.append("plot SVG IDs do not match plots.json")
    for path in plot_paths:
        path_id = path.attrib.get("id")
        if not re.search(r"[zZ]\s*$", path.attrib.get("d", "")):
            errors.append(f"unclosed plot path: {path_id}")
        row = next((item for item in plot_rows if item["id"] == path_id), None)
        if row:
            recomputed = PROCESSOR.deterministic_price(
                plots["priceGeneration"]["seed"], row["priceTier"], path.attrib.get("d", "")
            )
            if recomputed != row["basePrice"]:
                errors.append(f"non-reproducible price for {path_id}")

    landmark_rows = landmarks["landmarks"]
    landmark_ids = [row["id"] for row in landmark_rows]
    if len(set(landmark_ids)) != len(landmark_ids):
        errors.append("duplicate landmark IDs")
    for row in landmark_rows:
        if not re.fullmatch(r"landmark_[a-z0-9_]+", row["id"]):
            errors.append(f"invalid landmark ID: {row['id']}")
        if not inside(row["bounds"], width, height) or not inside(row["artwork"]["bounds"], width, height):
            errors.append(f"landmark outside master canvas: {row['id']}")
        artwork = package_dir / row["artwork"]["file"]
        label = package_dir / row["label"]["file"]
        if not artwork.exists() or not label.exists():
            errors.append(f"missing landmark output: {row['id']}")
            continue
        with Image.open(artwork) as image:
            if image.format != "WEBP":
                errors.append(f"not WebP: {row['id']}")
            if image.size != (row["artwork"]["pixelWidth"], row["artwork"]["pixelHeight"]):
                errors.append(f"image size mismatch: {row['id']}")
        label_text = label.read_text(encoding="utf-8")
        if "data:image" in label_text or "<image" in label_text:
            errors.append(f"label still embeds raster art: {row['id']}")

    required_review = [
        package_dir / "review/landmark_contact_sheet.webp",
        package_dir / "review/alignment_review.html",
        package_dir / "OWNER_REVIEW_ZH_CN.md",
        package_dir / "processing_report.json",
    ]
    for path in required_review:
        if not path.exists():
            errors.append(f"missing review artifact: {path.name}")

    result = {
        "passed": not errors,
        "errors": errors,
        "plotCount": len(plot_rows),
        "landmarkCount": len(landmark_rows),
        "packageBytes": sum(path.stat().st_size for path in package_dir.rglob("*") if path.is_file()),
    }
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("package_dir", type=Path)
    args = parser.parse_args()
    result = validate(args.package_dir)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    sys.exit(main())

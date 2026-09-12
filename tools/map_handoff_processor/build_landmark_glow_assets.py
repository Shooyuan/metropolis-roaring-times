#!/usr/bin/env python3
"""Build transparent red glow overlays for M1W landmark illustrations.

The browser must not apply CSS drop-shadow directly to the landmark artwork:
low-alpha source-map residue and pale card backgrounds can then glow as a
rectangle.  This tool derives a separate high-alpha silhouette mask and blurs
that mask into a red glow PNG, leaving the original illustration untouched.
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


ROOTS = [
    Path("m0_web/assets/runtime_map_v001"),
    Path("assets/runtime_map_v001"),
]
ALPHA_THRESHOLD = 180
GLOW_COLOR = (214, 72, 54)


def build_glow(source: Path, target: Path) -> None:
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    mask = alpha.point(lambda value: 255 if value >= ALPHA_THRESHOLD else 0)
    expanded = mask.filter(ImageFilter.MaxFilter(7))
    soft = expanded.filter(ImageFilter.GaussianBlur(8))
    tight = expanded.filter(ImageFilter.GaussianBlur(3))
    glow_alpha = ImageChops.lighter(
        soft.point(lambda value: int(value * 0.72)),
        tight.point(lambda value: int(value * 0.42)),
    )
    glow = Image.new("RGBA", image.size, (*GLOW_COLOR, 0))
    glow.putalpha(glow_alpha)
    target.parent.mkdir(parents=True, exist_ok=True)
    glow.save(target)


def main() -> None:
    built = 0
    for root in ROOTS:
        manifest = root / "landmarks.json"
        if not manifest.exists():
            continue
        data = json.loads(manifest.read_text())
        for landmark in data["landmarks"]:
            source = root / landmark["artwork"]["file"]
            target = root / "glow" / f"{landmark['id']}_glow.png"
            build_glow(source, target)
            built += 1
    print(f"LANDMARK_GLOW_ASSETS_BUILT count={built}")


if __name__ == "__main__":
    main()

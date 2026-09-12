#!/usr/bin/env python3
"""Clean landmark mattes and build transparent red glow overlays.

The browser must not apply CSS drop-shadow directly to the landmark artwork:
low-alpha source-map residue and pale card backgrounds can then glow as a
rectangle.  This tool removes pale card/matte pixels from the runtime artwork,
then derives a separate outside-only glow PNG from the cleaned alpha mask.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageFilter


ROOTS = [
    Path("m0_web/assets/runtime_map_v001"),
    Path("assets/runtime_map_v001"),
]
ALPHA_THRESHOLD = 80
GLOW_COLOR = (214, 72, 54)
SILHOUETTE_SCALE = 4


def clean_artwork(source: Path) -> Image.Image:
    image = Image.open(source).convert("RGBA")
    data = np.array(image)
    red = data[:, :, 0].astype(np.int16)
    green = data[:, :, 1].astype(np.int16)
    blue = data[:, :, 2].astype(np.int16)
    alpha = data[:, :, 3]
    visible = alpha > 0
    brightness = (red + green + blue) / 3
    saturation = np.maximum.reduce([red, green, blue]) - np.minimum.reduce([red, green, blue])

    # The Figma landmark exports sometimes contain a pale paper rectangle
    # behind the actual cutout.  Instead of trying to detect that rectangle by
    # its bounds, keep only pixels close to real ink/detail.  This preserves
    # the building engraving while stripping the card matte and border.
    low_alpha_residue = visible & (alpha < 80)
    real_ink = visible & (alpha >= 80) & ((brightness < 178) | ((brightness < 215) & (saturation > 42)))
    ink_mask = Image.fromarray(real_ink.astype(np.uint8) * 255)
    keep_near_ink = ink_mask.filter(ImageFilter.MaxFilter(13)).filter(ImageFilter.GaussianBlur(1))
    keep = np.array(keep_near_ink) > 8

    remove_matte = visible & ~keep
    data[:, :, 3][low_alpha_residue | remove_matte] = 0
    return Image.fromarray(data)


def build_glow(source: Path, target: Path) -> None:
    image = clean_artwork(source)
    image.save(source, quality=88, method=3)
    alpha = image.getchannel("A")
    mask = alpha.point(lambda value: 255 if value >= ALPHA_THRESHOLD else 0)
    small_size = (max(1, mask.width // SILHOUETTE_SCALE), max(1, mask.height // SILHOUETTE_SCALE))
    small_mask = mask.resize(small_size, Image.Resampling.NEAREST)
    small_silhouette = small_mask.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9))
    silhouette = small_silhouette.resize(mask.size, Image.Resampling.NEAREST).filter(ImageFilter.GaussianBlur(1))
    expanded = silhouette.filter(ImageFilter.MaxFilter(17))
    soft_outer = expanded.filter(ImageFilter.GaussianBlur(7))
    tight_outer = silhouette.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(3))
    inner_block = silhouette.filter(ImageFilter.MaxFilter(3))
    outside_soft = ImageChops.subtract(soft_outer, inner_block)
    outside_tight = ImageChops.subtract(tight_outer, inner_block)
    glow_alpha = ImageChops.lighter(
        outside_soft.point(lambda value: int(value * 0.9)),
        outside_tight.point(lambda value: int(value * 0.7)),
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

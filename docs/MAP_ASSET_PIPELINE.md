# Metropolis: Roaring Times — Map Asset Pipeline

> Document role: authoritative map-art intake and registration contract
>
> Player-facing language: English
>
> Visual authority: `04_MAP_AND_ART_DIRECTION.md`

## 1. Purpose

This pipeline keeps map art replaceable without moving district boundaries, plots or buildings. The supplied 1939 Manhattan image is an art and composition reference, not a production background and not an interaction mask.

The final base may be reconstructed with AI-assisted art, Figma or both. Regardless of production method, gameplay geometry remains structured data.

## 2. Coordinate Contract

- Canonical map coordinates are normalized: top-left is `(0.0, 0.0)` and bottom-right is `(1.0, 1.0)` within the approved map crop.
- `map_manifest.json` records crop identity, aspect ratio, registration landmarks, layer files, source revision and LOD thresholds.
- Source pixel dimensions may change without moving gameplay objects.
- Changing crop or aspect ratio after approval requires an explicit geometry migration, full validator run and new owner visual gate.
- District polygons, plot polygons, district-summary anchors and building anchors all use the same normalized space.

## 3. Accepted Art Handoffs

Preferred production handoff:

- layered Figma file, PSD or KRA master with stable named layers;
- transparent PNG exports at reviewed target sizes for raster layers;
- SVG or GeoJSON district boundaries with stable English IDs, converted to validated runtime JSON;
- transparent PNG building illustrations with one building per asset and no baked ownership/state border;
- one flattened preview for review only.

A flattened JPG/PNG alone is insufficient for production because roads, water, labels, public features and buildings cannot be independently updated or controlled by zoom.

## 4. Required Layer Separation

The production handoff separates at least:

1. paper/background texture;
2. water;
3. coastline;
4. roads;
5. district labels/fields;
6. transit lines and non-building symbols;
7. non-building landmarks and ornament;
8. atmosphere/print texture.

Public and private building illustrations are never baked into these base layers. They are separate anchored assets controlled by runtime LOD.

## 5. District Interaction Contract

- Each district is one or more named closed vector polygons.
- Polygon data defines hover, selection and detail-page identity; painted border pixels do not.
- Hover draws a wide `border_peach` outer band plus a thin `ink_primary` inner line.
- Click locks the border and opens the district detail page until another district is selected or the current selection is explicitly closed.
- At near zoom, plot and building hit targets take priority over the district below them.

## 6. District Summary and Building LOD

Far and middle zoom hide every individual public and private building illustration. The district summary displays, in this exact order:

1. plots currently purchasable by the human player;
2. human-owned apartments, combining Standard and Luxury Apartments;
3. human-owned Factories;
4. human-owned Department Stores;
5. major transit facilities present;
6. district prosperity level.

At and above one owner-approved near-zoom threshold, all public and private individual building illustrations appear. Threshold and crossfade values are data in `map_manifest.json`, not assumptions based on source-image pixel size.

## 7. Prosperity Data Contract

- District prosperity is derived jointly from owner-approved human and active-AI development inputs.
- The score satisfies `50.0 <= prosperity_score < 100.0` and displays one decimal place.
- It is distinct from the global economy phase named `Prosperity`.
- Formula, weights, English labels and level bands require owner approval before production implementation.
- Transit is listed in the summary but does not affect prosperity unless the approved formula explicitly includes it.

## 8. Intake Sequence

1. Preserve the submitted source file unchanged in `references/`.
2. Record creator/source, date received, intended use and known rights status.
3. Review historical period fit and whether the file is reference-only or a production candidate.
4. Approve crop, aspect ratio and registration landmarks.
5. Reconstruct or export named production layers.
6. Convert vectors and anchors to normalized validated data.
7. Test alignment, district hit areas, LOD behavior and export exclusion of the historical reference.
8. Obtain owner visual approval before moving approved production assets into `assets/` and committing them.

Unregistered files are not renamed, edited, converted, staged or shipped.

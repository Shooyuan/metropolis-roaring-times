# Metropolis: Roaring Times — Figma Map Handoff and Asset Pipeline

> Document role: authoritative owner-to-Codex map handoff contract
>
> Source author: Owner in Figma
>
> Integration owner: Codex after owner delivery
>
> Player-facing language: English

## 1. Authority and Non-Negotiable Boundary

The owner authors and approves both the production map art and district geometry in Figma. Codex may validate, convert, optimize and integrate those submitted assets, but must not invent, redraw, approximate or silently correct district boundaries.

The supplied 1939 Manhattan image is a locked visual reference. It is not the production base and is never exported in the game.

No M1A map implementation begins until the owner submits the minimum package in section 7 and Codex completes an intake report. Missing assets create a reported dependency; they do not authorize placeholder geography.

## 2. Figma Master Dimensions

Use one master frame for every map-related page:

| Setting | Required value |
|---|---|
| Frame name | `MAP_MASTER_4474x5904` |
| Width | `4474 px` |
| Height | `5904 px` |
| Aspect ratio | `0.7577913279132791` |
| Orientation | Portrait, north-up |
| Coordinate origin | Top-left `(0, 0)` |
| Rotation | `0°` |
| Color space for exported PNG | sRGB |
| Pixel ratio | Export at `1×` unless Codex requests a test derivative |

These dimensions register the current reference crop. They do not limit in-game zoom. Camera zoom changes how much of the registered map the player sees; it does not change district positions.

Every master frame must remain exactly `4474 × 5904`. Do not crop, resize, rotate, add an outer margin or move the content inside one page without applying the identical change to every map page and obtaining owner approval.

## 3. Required Figma Pages

Create these pages in this exact order:

```text
00_README
01_REFERENCE
02_MAP_BASE
03_DISTRICT_GEOMETRY
04_ALIGNMENT_REVIEW
05_FUTURE_BUILDING_ANCHORS
```

### `00_README`

Contains:

- project name and map revision;
- `4474 × 5904` canvas lock;
- north-up requirement;
- export filenames from section 7;
- current author/date;
- change notes;
- a warning that buildings and gameplay-state colors do not belong in the base map.

### `01_REFERENCE`

- Contains the supplied historical reference inside `MAP_MASTER_4474x5904`.
- The reference image is locked.
- No production export is generated from this page.
- Any crop/alignment guide is locked and named `registration_guide_do_not_export`.

### `02_MAP_BASE`

Contains the production art seen by the player. It uses the layer structure in section 4 and excludes every public/private building illustration and dynamic gameplay state.

### `03_DISTRICT_GEOMETRY`

Contains the owner-authored district shapes on the same `4474 × 5904` frame. Each district is an editable, closed vector shape with the stable name in section 5.

### `04_ALIGNMENT_REVIEW`

Contains a review-only overlay of the production base plus district outlines and English district labels. It lets the owner and Codex confirm that art and geometry occupy the same positions.

### `05_FUTURE_BUILDING_ANCHORS`

Reserved for a later approved stage. It remains empty during the initial map handoff unless the owner deliberately supplies anchors. Codex must not treat this empty page as permission to place buildings.

## 4. `02_MAP_BASE` Layer Structure

Inside `MAP_MASTER_4474x5904`, use this exact top-level order from back to front:

```text
00_REGISTRATION_DO_NOT_EXPORT
01_PAPER
02_WATER
03_COASTLINE
04_ROADS
05_DISTRICT_TONE
06_TRANSIT_LINES_AND_BRIDGES
07_LABELS
08_NON_BUILDING_ORNAMENT
09_FRAME
10_PRINT_TEXTURE
```

Rules:

- `00_REGISTRATION_DO_NOT_EXPORT` contains locked corner marks and alignment guides only.
- `01_PAPER` through `10_PRINT_TEXTURE` remain editable in Figma.
- Static paper, water, roads and ornament may be flattened only in the exported base PNG, never in the Figma master.
- Public and private building illustrations are excluded from every base layer.
- City Hall, the public library and other buildings are delivered later as separate building assets, even when government-owned.
- Ownership, hover, selection, plot borders, prosperity, legal warnings and construction states are never painted into the base.
- Player-facing map colors follow `04_MAP_AND_ART_DIRECTION.md`; technical district ID colors are not player-facing palette additions.

## 5. `03_DISTRICT_GEOMETRY` Layer Structure

Inside `MAP_MASTER_4474x5904`:

```text
00_REGISTRATION_DO_NOT_EXPORT
01_BASE_GHOST_DO_NOT_EXPORT
02_DISTRICTS_EXPORT
├── district_central_park
├── district_midtown
├── district_hells_kitchen
├── district_lower_east_side
├── district_lower_manhattan
└── district_brooklyn_bridgehead
03_LABELS_DO_NOT_EXPORT
```

Each item under `02_DISTRICTS_EXPORT` must:

- be authored and approved by the owner;
- be a closed vector shape or a named group of closed shapes;
- use no blur, shadow, texture, mask or image fill;
- have no stroke in the production SVG export;
- use a flat technical fill color;
- remain inside the master frame;
- not overlap another district unless the owner intentionally documents an exception;
- preserve the exact stable layer name.

Hell's Kitchen and Lower East Side remain separate vector shapes even though they share one gameplay category.

## 6. Technical District Colors

These colors exist only for the mask and alignment audit:

| District layer | Technical color |
|---|---|
| `district_central_park` | `#0000FF` |
| `district_midtown` | `#00FF00` |
| `district_hells_kitchen` | `#FFFF00` |
| `district_lower_east_side` | `#FF00FF` |
| `district_lower_manhattan` | `#FF0000` |
| `district_brooklyn_bridgehead` | `#00FFFF` |
| Outside all districts | `#000000` |

The SVG is the authoritative district geometry. The color mask is a pixel-alignment cross-check and fallback source, not permission for Codex to redraw boundaries.

## 7. Required Delivery Package

The owner submits one versioned folder:

```text
metropolis_map_v001/
├── source/
│   └── metropolis_roaring_times_map_v001.fig
├── export/
│   ├── metropolis_map_base_v001.png
│   ├── metropolis_district_geometry_v001.svg
│   ├── metropolis_district_mask_v001.png
│   └── metropolis_alignment_preview_v001.png
└── OWNER_NOTES.md
```

Required files:

1. **Figma source (`.fig`)** — editable authority and revision history snapshot.
2. **Base PNG** — `4474 × 5904`, 1×, opaque sRGB PNG, no reference layer, buildings or gameplay states.
3. **District SVG** — `width="4474"`, `height="5904"`, `viewBox="0 0 4474 5904"`; contains only the six owner-authored district shapes.
4. **District mask PNG** — `4474 × 5904`, one technical color per district, black outside, no labels/effects. It must align pixel-for-pixel with the base PNG.
5. **Alignment preview PNG** — `4474 × 5904`; base art plus visible district outlines and English names for human review only.
6. **Owner notes** — revision, creator, delivery date, known unfinished areas and any deliberate geographic distortion.

If a live Figma link is supplied, the `.fig` snapshot is still required before the package becomes a committed project dependency.

## 8. How Position Matching Works

The base PNG, district SVG and mask PNG share the same frame and origin. A point at `(x, y)` therefore means the same map location in all three files.

At runtime, Codex converts submitted SVG coordinates into normalized map coordinates:

```text
normalized_x = svg_x / 4474
normalized_y = svg_y / 5904
```

Zooming and dragging only transform the camera. They do not change these normalized positions. Replacing the base art is safe only when the replacement keeps the approved crop and aspect ratio.

## 9. Codex Intake Procedure

After the owner submits the package, Codex must perform these steps in order:

1. Preserve the submitted package unchanged in `references/incoming/`.
2. Record filenames, dimensions, checksums, source author and date.
3. Verify all four exports are `4474 × 5904` or use the exact SVG viewBox.
4. Overlay the SVG and mask on the base and produce an alignment report.
5. Check for open paths, overlaps, gaps, duplicate/missing stable names and out-of-frame geometry.
6. Compare the alignment preview with the authoritative source; do not correct geography independently.
7. Report every defect or ambiguity to the owner.
8. Wait for corrected assets or explicit owner acceptance.
9. Convert the approved SVG to normalized runtime JSON without changing vertices.
10. Add derived files to `assets/`/`data/`, record provenance and run export-exclusion tests.
11. Present the first Godot overlay to the owner before implementing 64 plots.

No automatic simplification, smoothing or vertex deletion is allowed unless Codex shows the before/after result and receives owner approval.

## 10. Building and LOD Boundary

- The initial map handoff contains no individual building illustration in the base.
- Public and private building art will be submitted as separate transparent assets in a later package.
- Both categories use the same future owner-approved near-zoom threshold.
- Far/middle district summaries and prosperity remain program-generated interface layers.
- Codex may later propose building anchors, but the owner must approve them before bulk placement.

## 11. Rejection Conditions

Codex must stop intake and report a blocker when:

- any required file is missing;
- dimensions, crop, orientation or SVG viewBox do not match;
- district layer names are missing or changed;
- district shapes are open, overlapping unexpectedly or outside the frame;
- the base contains baked public/private buildings or gameplay states;
- the reference image appears in the production base export;
- Codex cannot prove the base, SVG and mask share one coordinate registration.

Rejected intake files remain preserved and are never silently overwritten.

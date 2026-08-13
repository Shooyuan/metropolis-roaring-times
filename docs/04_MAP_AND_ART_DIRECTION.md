# Metropolis: Roaring Times — Map and Art Direction

> Document role: authoritative visual, map-interaction and asset-direction specification
>
> Player-facing language: English
>
> Reference image: `../references/manhattan_map_reference.jpg`
>
> Scope authority: `../00_PROJECT_CONTEXT.md` and `03_VERTICAL_SLICE_SCOPE.md`

## 1. Visual Objective

The game should feel like an interactive New York pictorial map printed on aged paper, not a modern digital map with a historical filter.

The visual hierarchy is:

1. Property ownership, legality, value and available action.
2. Plot, district, road and transit structure.
3. Buildings and public landmarks.
4. Decorative frame, paper texture and restrained atmosphere.

Decoration cannot reduce plot readability or input accuracy.

## 2. Reference Policy

The supplied pictorial Manhattan map is the primary reference for:

- paper tone;
- ink tone and line density;
- warm orange water and border fields;
- north-up vertical Manhattan composition;
- ornamental border rhythm;
- handwritten-label character;
- small landmark-vignette treatment;
- limited red accent use;
- aged print texture and imperfect registration.

It is an art reference and development-only alignment guide, not a shippable background texture. The owner rebuilds the production map and district geometry in Figma; Codex may not substitute its own composition or district boundaries.

The owner-approved production map must use reviewed coastline, road, landmark and frame assets. The reference contains buildings and a 1939 visual context that can fall outside the game's 1910–1935 period; any identifiable landmark included in production requires a date and design review. Dynamic public and private buildings remain separate assets rather than being painted into the base.

### 2.1 Coordinate Registration and Art Handoff

- The owner uses one north-up Figma vector canvas of any size for the base, district geometry and alignment material.
- Map-space positions are normalized from the actual canvas width and height recorded by the exporter and remain independent of runtime scaling.
- Every approved base-map revision declares the same crop, aspect ratio, owner revision and registration landmarks in `map_manifest.json`.
- A replacement texture may change runtime resolution but may not change the registered crop or aspect ratio without an owner-reviewed geometry migration.
- The owner delivers the editable `.fig` and exporter ZIP. SVG and structure JSON are the primary production assets; PNG files are optional review previews. The district SVG is authoritative; Codex converts it to validated runtime JSON without changing geometry.
- Codex must stop and report missing, open, overlapping, misnamed or misaligned district shapes instead of correcting them independently.
- Public and private buildings are separate transparent illustration assets placed at data-driven normalized anchors.
- A flattened preview is review material only; it is not sufficient without the complete owner delivery package.
- The full intake contract is defined in `MAP_ASSET_PIPELINE.md`.

## 3. Approved Reference-Derived Palette

The following sRGB values were sampled and visually cross-checked against the supplied image. They replace the earlier free use of verdigris, purple, silver and champagne colors.

| Token | Value | Primary use |
|---|---|---|
| `paper_base` | `#E5D3AE` | Main map and panel material |
| `paper_highlight` | `#F1E3BF` | Raised cards, empty land and light labels |
| `ink_primary` | `#433E3A` | Main text, roads and strong outlines |
| `ink_secondary` | `#716658` | Secondary labels and inactive structure |
| `water_warm` | `#DEB080` | Hudson River, East River and warm map fields |
| `border_peach` | `#E1B686` | Decorative frame and low-priority fill |
| `compass_red` | `#C54543` | Player ownership and restrained focal accents |
| `warning_deep` | `#964940` | Debt, violation and destructive-action warnings |

### 3.1 Palette Rules

- Map and in-game UI art stays within these colors, their opacity variants and documented lighter/darker tonal adjustments.
- Purple, silver, cyan, neon green and modern saturated interface blue are not approved.
- Black and pure white are replaced by `ink_primary` and `paper_highlight` except where a platform accessibility fallback requires otherwise.
- Generated assets are color-graded back into this palette before import.
- A new hue requires an owner-reviewed palette update before it enters production.

## 4. Ownership and State Encoding

Tycoon, Landlady and Shark are rival personalities, not difficulty levels and not separate ownership factions.

The opponent-selection screen uses the heading `Choose Rival`. The vertical slice has one `Standard` ruleset and no difficulty system; no control is labeled `Difficulty`.

### 4.1 Ownership

| Owner state | Color | Secondary encoding |
|---|---|---|
| Human player | `compass_red` | Solid double outline and small player monogram |
| Active rival | `ink_primary` | Cross-hatched inset and rival icon |
| Government/public | `water_warm` | Dotted boundary and lock/civic icon |
| Unowned/available | `paper_highlight` | Thin `ink_secondary` outline and price tag |

The active rival uses the same ownership encoding whether the selected personality is Tycoon, Landlady or Shark.

### 4.2 Interaction and Legal States

- Hover: brighter paper lift plus a thin outer highlight.
- Selected: four corner brackets and a persistent label; selection does not replace ownership encoding.
- Auction eligible: gavel icon and patterned edge.
- Under construction: scaffold/roof-work symbol and remaining-turn label.
- Compliant: check symbol with normal ink treatment.
- Transition warning: amber-toned hatch derived from `border_peach`, hourglass icon and turns remaining.
- Violation: `warning_deep`, diagonal warning hatch and explicit penalty label.
- Disabled: reduced contrast plus a visible prohibition symbol.

No state relies on color alone.

## 5. Map Composition

### 5.1 Orientation

- Manhattan remains vertical with north at the top and Lower Manhattan at the bottom.
- The map is embedded inside a landscape application layout; the island is not rotated sideways to fill the screen.
- Hudson River remains west/left and East River remains east/right.
- Land across the southeast river edge may appear as non-interactive background; it is not a vertical-slice district.
- Rotation controls, gesture rotation and automatic camera rotation are prohibited.

### 5.2 Perspective

- Coastline, roads, plots, transit and buildings all use a direct top-down view.
- Buildings are recognized through roof plans, courtyards, chimneys, skylights, loading areas and footprint silhouettes.
- No isometric grid, 3/4 building perspective or simulated 3D camera tilt is used.
- Decorative landmark vignettes may use illustrated elevation views only outside the interactive plot footprint, such as in the frame or event cards.

### 5.3 Geographic Structure

The production map preserves the owner-approved relative order of the twelve districts from Inwood in the north to Financial District in the south, including Washington Heights, Harlem, both Upper sides, both Midtown sides, Chelsea, both Villages and SoHo. Central Park remains a public non-district area; Brooklyn and Manhattan bridges remain public landmarks. The city may be compressed and artistically distorted, but the approved twelve district shapes and their relative positions cannot be redrawn by Codex.

## 6. Map Layers

Back to front:

1. `paper_background` — paper base and subtle aging.
2. `water_layer` — warm water fill, minimal wave hatching and ferry decoration.
3. `coastline_layer` — primary coastline ink.
4. `road_layer` — simplified major road hierarchy.
5. `district_layer` — labels and low-opacity tonal fields.
6. `district_interaction_layer` — hover and locked-selection borders generated from district polygons.
7. `district_summary_layer` — far/middle summaries anchored independently from the base texture.
8. `plot_layer` — exactly 64 interactive polygons.
9. `transit_layer` — bridges, six subway stations and one tram line with about five stops.
10. `public_building_layer` — separate public-building illustrations, visible only at the shared near threshold.
11. `private_building_layer` — separate private-property illustrations, visible only at the shared near threshold.
12. `property_state_layer` — ownership, selection, auction, compliance and value overlays.
13. `landmark_layer` — non-building public landmarks and restrained vignettes.
14. `atmosphere_layer` — subtle print/paper effects only.

Each interactive polygon and collision shape is generated from the same source coordinates. Decorative art never defines the clickable boundary.

## 7. Camera and Navigation

### 7.1 Pan

- Drag empty map space with the primary mouse button, or drag anywhere with the middle mouse button.
- Plot clicks must not accidentally initiate a pan until movement exceeds a configured drag threshold.
- Pan is constrained so the map cannot be lost completely outside the viewport.
- Opening a blocking modal disables map input.

### 7.2 Fixed-Factor Zoom

- Default zoom: `100%`.
- Zoom in: current zoom multiplied by `1.25`.
- Zoom out: current zoom multiplied by `0.80`.
- Minimum: approximately `50%`.
- Maximum: `200%`.
- Boundary steps clamp to the minimum or maximum.
- Mouse-wheel and visible `+`/`−` buttons use the same rule.
- Zoom is anchored at the pointer position when possible.
- The UI displays the rounded current percentage.
- A short tween may smooth visual movement, but the authoritative target is the fixed calculated zoom value.
- No free-form rotation, tilt or pinch rotation is accepted.

### 7.3 Focus

- Selecting a plot can pan it into a safe visible area not covered by the right panel.
- Focus does not automatically change zoom unless the selected plot is below the minimum readable size.
- Closing the detail panel does not reset camera position.

### 7.4 Information Density

- Far and middle view: individual public and private building illustrations are hidden. Each district shows, in order, human-purchasable plot count, human-owned apartment count, human-owned Factory count, human-owned Department Store count, major transit facilities and prosperity level.
- Standard and Luxury Apartments are combined in the apartment count.
- Near view: at and above one owner-approved threshold, all individual public and private building illustrations appear together with plot name, building state, income indicator, compliance and construction details.
- The threshold and any short crossfade are data-driven and require owner approval during the complete-map milestone.
- HUD text and action icons remain screen-space readable instead of shrinking with the map.

### 7.5 District Hover, Selection and Detail

- Hovering uncovered district space draws a wide `border_peach` outer band with a thin `ink_primary` inner line.
- Clicking a district locks this border and opens its district detail page.
- The locked selection remains until another district is selected or the current selection is explicitly closed.
- At near zoom, plot and building hit targets take priority over the district beneath them; district labels and uncovered district space remain district-selection targets.
- The district border is an interaction state, not an ownership color, and must not use `compass_red` as its sole encoding.

## 8. Plot and Road Art

- Plots are irregular but must not contain extremely thin, self-intersecting or visually ambiguous shapes.
- Shared boundaries align without visible cracks at normal zoom.
- Road width communicates hierarchy without recreating every Manhattan street.
- District labels use English names and avoid overlapping interactive plot labels.
- Plot labels can hide at far zoom and appear at near zoom.
- Value heat treatment uses tonal density and hatching within the approved palette, not a rainbow heatmap.

## 9. Public Transit Art

- Brooklyn and Manhattan bridges are fixed public landmarks with clear approach areas.
- Six subway stations use one consistent top-down station icon family.
- One tram line uses a single ink route with approximately five visible stops.
- Transit range is shown only when inspecting a transport node or affected plot; permanent radius circles would clutter the map.
- Affected plots explain the `+15%` transit bonus in English.
- The former Brooklyn Bridgehead-specific value bonus is retired; any future bridge premium must identify approved plots explicitly.
- Player construction, route editing, vehicle simulation and ticket revenue are not depicted as available actions.

## 10. Building Art

### 10.1 View and Readability

- All gameplay buildings are top-down.
- Public buildings and transit-associated building illustrations use the same near-zoom visibility threshold as private buildings.
- Roof silhouette and footprint communicate building category before small details.
- Buildings remain within their plot polygon and cannot obscure adjacent clickable boundaries.
- A subtle ink shadow may separate a building from the paper, but it cannot create a 3D camera angle.

### 10.2 Required Variants

- Standard Apartment: 3 top-down variants.
- Luxury Apartment: 3 top-down variants.
- Factory: 3 top-down variants.
- Department Store: 3 top-down variants.
- Total: 12 gameplay building assets.

Variants share category silhouette language and differ through roof plan, courtyard, chimney, signage shape or decorative roof detail. They never change rules.

### 10.3 State Treatment

- Under construction: lightweight scaffold/roof-work overlay.
- Redevelopment: the old building is removed and the replacement uses the same construction overlay until next turn.
- Pending brokered sale: small contract/document icon and `Sale Pending` label without hiding ownership.
- Non-compliant: warning hatch and legal icon, not a replacement building image.
- Demolished: building disappears and the owned empty plot remains.
- Economy effects use overlays and UI explanation, not recolored building sprites that obscure category identity.

## 11. Rival Portrait Direction

### 11.1 Purpose

Portraits identify the selected rival and communicate reaction during auction, debt pressure and important events. They are not map units and do not determine difficulty.

### 11.2 Style

- Original rubber-hose animation language inspired by late-1920s and early-1930s animation conventions.
- Simple curved limbs, expressive eyes, period clothing and bold ink silhouettes.
- Designs must be original and must not copy a specific Cuphead character, frame or trademarked costume.
- Portrait line and fill colors are reduced to the approved map palette.
- No generated text is embedded in portrait images.

### 11.3 Required Emotions

For Tycoon, Landlady and Shark:

1. Neutral/default.
2. Confident.
3. Hesitant.
4. Angry.
5. Withdraws from auction.

Total: 15 transparent portrait assets.

Identity consistency requirements:

- same face and body proportions;
- same clothing and signature accessories;
- same line weight and camera framing;
- expressions readable at auction-panel size;
- transparent edges free from halos.

### 11.4 Future Game Brief Mascot

`Game Brief` reserves a portrait/dialogue area for one original rubber-hose-style board mascot that can later comment on current state and accept player dialogue choices. This mascot is not Tycoon, Landlady or Shark, does not change difficulty, and does not make authoritative game decisions.

The vertical slice requires only the stable layout reservation and fallback text state. Final mascot art, dialogue corpus and any runtime conversational technology require a later owner gate. The preferred offline-compatible direction is deterministic state-driven dialogue; a network language model is not implied by the reserved space.

## 12. UI Direction

- The approved Brand/Logo displays the exact title `Metropolis: Roaring Times`, including the colon, and retains the public credit `designed and drawn by GatChive`.
- The Brand remains a separate asset from the map base so UI placement and scaling do not alter map registration.

- UI framing uses restrained Art Deco geometry derived from the reference border.
- Panels use paper surfaces and ink edges; no glassmorphism, neon glow or modern blue dashboard styling.
- Primary text uses `ink_primary`; secondary text uses `ink_secondary` only when contrast remains readable.
- Numbers use stable-width figures to prevent layout movement during settlement.
- Player-facing text, buttons, events, tooltips and rival labels are English.
- `Choose Rival` presents Tycoon, Landlady and Shark as strategy/personality profiles.
- The vertical slice has no difficulty selector.
- Destructive, debt and violation actions use `warning_deep` plus explicit English labels and symbols.
- The left panel is consistently named the **Integrated Operations Panel** in specifications and `Operations Desk` in player-facing English.
- Its tabs appear in the exact order `Game Brief`, `Investment Advice`, `Bank`, `Auction House`, `Stock Market`.
- Every tab is an independent page with its own scroll region. `Game Brief` is not a fixed header above another page.
- `Game Brief` shows mode, `Standard` ruleset, rival, objective, turn, economy and law state, plus the reserved mascot region.
- `Investment Advice` uses newspaper-card hierarchy for verified history, fictional city reporting, government rumors and activity. `Historical`, `Fictional`, `Rumor` and `Activity` badges must remain visible without relying on color.
- The top status bar carries `Metropolis: Roaring Times`, the primary status values, `End Turn`, help, save and settings.
- The right property panel carries purchase, construction, redevelopment and brokered-sale actions.
- There is no fixed bottom action bar. Bank, auction and securities actions live in their corresponding Integrated Operations Panel tabs.

The `Stock Market` page uses compact period-inspired quotation rows rather than a modern candlestick terminal. The `Auction House` page can show `No scheduled auctions` until owner-approved stories exist; it must not invent placeholder narrative presented as final content.

Fonts must be bundled, licensed for the intended distribution and readable in the Web export. A period-appropriate display face may be used for headings; body and numeric text prioritize readability.

## 13. Atmosphere and Motion

Included lightweight effects:

- subtle paper grain;
- extremely restrained print-registration offset at decorative edges;
- brief ink pulse on a changed plot;
- limited factory smoke or construction dust if performance allows;
- short gavel and card-transition motion.

Excluded:

- dynamic day/night cycle;
- sunrise or sunset sky background;
- moving pedestrians;
- moving street vehicles;
- simulated train or tram movement;
- continuous camera shake;
- heavy particles that hide plot boundaries.

Motion respects a reduced-motion setting where practical.

## 14. Asset Production Rules

- The map Figma source keeps the owner-approved top-to-bottom stacking order `06_FRAME`, `05_NON_BUILDING_ORNAMENT`, `04_ROADS`, `03_DISTRICT_GEOMETRY`, `02_COASTLINE`, `01_WATER`; actual visual occlusion takes precedence over the superseded generic layer template.
- The authoritative Brand is the separate `assets/00_BRAND.svg`; the map Figma file does not need an `00_BRAND` layer, and Brand remains excluded from the flattened map-base export.
- Programmatic geometry owns coastline, roads, plots, collision, ownership and rule overlays.
- SVG is preferred for icons, ornaments and simple line art that Godot imports reliably.
- Transparent raster assets use lossless PNG during editing; optimized Web variants require visual comparison before replacement.
- Source and export names use stable English `snake_case`.
- Every final asset is listed in `docs/ASSET_MANIFEST.md` with source, author/tool, dimensions, license, generation prompt where applicable and import settings.
- Generated assets remain drafts until visually reviewed in the actual map or UI context.
- The original reference image remains in `references/` and is never packaged as the playable map background.

## 15. Accessibility and Clarity

- Ownership and compliance use pattern/icon/line differences in addition to color.
- Text and icons are checked against their actual paper background.
- Minimum interactive plot size is verified at the farthest allowed zoom.
- Selected and hover states remain distinct for player, rival, public and unowned plots.
- Debt warnings cannot be confused with player ownership red; warning uses a hazard icon, diagonal hatch and explicit label.
- Required information remains visible at 1920×1080, 1440×900 and 1366×768.

## 16. Performance Boundaries

- Decorative paper effects cannot require a full-resolution animated texture.
- Plot visuals update on state change, not through independent per-frame economic polling.
- Offscreen and far-view landmark detail can be reduced.
- Image dimensions are chosen from on-screen need rather than generation maximum.
- Final Web build is tested for texture memory, zoom fluidity and input latency.

## 17. Visual Review Gates

### Gate A — Map Composition

Before producing all 64 plots, owner review approves:

- island orientation and proportions;
- placement of all twelve authoritative district vectors;
- Central Park as a public non-district area and land across the rivers as non-interactive background;
- major public landmarks;
- paper, ink and water appearance.

### Gate B — Interaction States

Before UI expansion, owner review approves one sample plot in:

- unowned;
- player-owned;
- rival-owned;
- government;
- selected;
- auction;
- transition warning;
- violation states.

### Gate C — Asset Style

Before generating all variants, owner review approves:

- one top-down building from each category;
- one rival neutral portrait and two emotion variations;
- one event-card illustration;
- one Integrated Operations Panel sample containing all five tab labels and the reserved Game Brief mascot area;
- one Art Deco panel and button family.

### Gate D — Final Integration

The final visual pass verifies:

- no placeholder blocks or default controls remain;
- all assets use the approved palette;
- no unauthorized reference content is shipped;
- no obvious post-period object appears without review;
- map interaction remains readable under final decoration.

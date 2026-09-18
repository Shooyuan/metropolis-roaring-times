# Metropolis: Roaring Times

Prototype workspace for **Metropolis: Roaring Times**, a 1920s Manhattan real-estate strategy game. The currently playable build is the browser-based M1W demo in `m0_web/`.

## Play The Web Demo

From the repository root:

```bash
python3 -m http.server 4173 --bind 127.0.0.1 --directory m0_web
```

Then open:

```text
http://127.0.0.1:4173/
```

On macOS, you can also double-click `run_metropolis_demo.command`.

## Current Demo Scope

- 30-turn one-on-one economic match
- 12 Manhattan districts
- 30 purchasable plots
- 52 historical landmarks
- Property purchase, construction, redevelopment and brokered sale
- Bank loans and securities market
- English and Simplified Chinese UI

The Godot project files remain in this repository for later work, but the browser demo is the active playable target right now.

## Tests

Run from `m0_web/`:

```bash
node tests/m1w_static_test.js
node tests/m1w_i18n_static_test.js
node tests/map_content_contract_test.js
node tests/runtime_map_integration_test.js
```

## Repository Hygiene

Large reference images, generated UI explorations, source handoff ZIP files and unapproved art drops are intentionally ignored until their source, rights and runtime purpose are recorded in `docs/ASSET_MANIFEST.md`.

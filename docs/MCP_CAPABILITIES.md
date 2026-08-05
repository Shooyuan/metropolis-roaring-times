# Metropolis: Roaring Times — Godot Capability Record

## Purpose

This document records the verified M0G environment. Repository files, Git history and reproducible command-line results are authoritative; editor tabs, chat context and temporary tool state are not.

## Verified Environment

| Capability | Verified result |
|---|---|
| Godot distribution | Steam editor |
| Exact version | `4.7.1.stable.steam.a13da4feb` |
| Executable | `/Users/shuubun/Library/Application Support/Steam/steamapps/common/Godot Engine/Godot.app/Contents/MacOS/Godot` |
| Renderer | Compatibility (`gl_compatibility`) |
| Main scene | `res://scenes/main/main.tscn` |
| Web target | Single-threaded, no GDExtension support |
| Web release template | Steam-bundled `editor_data/export_templates/4.7.1.stable/web_nothreads_release.zip` |
| Web debug template | Steam-bundled `editor_data/export_templates/4.7.1.stable/web_nothreads_debug.zip` |
| Browser rendering | WebGL 2 Compatibility path verified |
| Persistence | `user://` native and browser storage both survived a second launch/reload |

The Steam package also contains `web_nothreads_release.zip` and related debug templates. Godot selected its matching bundled release template successfully from `export_presets.cfg`; no separate template download was required.

## Godot MCP Status

No Godot MCP server or Godot-specific MCP action is exposed in the current Codex tool surface. This is not a blocker. Codex uses repository edits, the Steam Godot executable, headless scripts and browser verification as the tested fallback and source of truth.

If a Godot MCP integration is added later, it must first receive a read-only capability audit. It must not become a hidden dependency, edit generated cache by hand or bypass the stage/test/commit protocol.

## Reproducible Checks

Run from the repository root with the recorded executable:

```text
Godot --headless --path . --script res://tests/run_all.gd
Godot --headless --path . --script res://tests/run_all.gd -- --intentional-failure
Godot --headless --path . -- --m0g-auto-quit
Godot --headless --path . --export-release Web build/web/index.html
```

The first command must exit `0` and report four passing checks. The second is a demonstration and must exit `1`. The third starts the configured main scene and exits after the persistence probe. The fourth requires `build/web/` to exist and produces the ignored Web build.

## M0G Evidence

- passing tests: `M0G_TESTS_PASS count=4`, exit `0`;
- intentional isolated failure: `M0G_TESTS_FAIL count=1`, exit `1`;
- native persistence: consecutive runtime visits `1` and `2`;
- Web export: HTML, JavaScript, WASM and PCK generated successfully;
- browser runtime: Godot 4.7.1, WebGL 2 Compatibility, Emscripten single-thread build;
- Web persistence: browser visits `1` and `2` across reload;
- browser console: no blocking JavaScript, WebGL or Godot runtime error during the smoke path.

## Boundaries and Risks

- `build/` is generated, excluded from Git and excluded from the exported resource pack so prior output cannot recursively inflate later builds; it must be regenerated for deployment.
- The M0G shell is not gameplay, a map prototype, production UI or final art.
- Steam may update Godot. Any version change requires rerunning the test, native startup and Web smoke checks and updating this record.
- Full release validation in both Chrome and Safari remains an M9 requirement.
- The browser persistence probe proves feasibility only; the production save schema and migration tests begin in M3.

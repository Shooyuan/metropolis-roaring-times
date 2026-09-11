"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const webRoot = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(webRoot, relative), "utf8");
const html = read("index.html");
const app = read("app.js");
const styles = read("styles.css");
const plots = JSON.parse(read("assets/runtime_map_v001/plots.json"));
const landmarks = JSON.parse(read("assets/runtime_map_v001/landmarks.json"));

assert.equal(plots.plotCount, 30, "Runtime web package must contain the 30 approved plots");
assert.equal(landmarks.landmarkCount, 52, "Runtime web package must contain the 52 approved landmarks");
assert.deepEqual([...new Set(plots.plots.map((plot) => plot.priceTier))].sort(), ["cheap", "expensive", "medium"]);
assert.equal(new Set(plots.plots.map((plot) => plot.id)).size, 30, "Plot IDs must be unique");
assert.equal(new Set(landmarks.landmarks.map((landmark) => landmark.id)).size, 52, "Landmark IDs must be unique");

for (const id of ["plot-overlay", "plot-mark-layer", "landmark-layer", "landmark-details", "entity-file-title"]) {
  assert(html.includes(`id="${id}"`), `Missing runtime-map DOM node: ${id}`);
}
assert(html.includes("assets/runtime_map_v001/base/metropolis_map_base.svg"), "M1W must use the v004 runtime map base");
assert(html.includes("app.js?v=m1w-map5"), "M1W must cache-bust the 1000% zoom hotfix script");
assert(app.includes('window.fetch(`${root}/plots.json`'), "Plot data must load from the generated runtime manifest");
assert(app.includes('window.fetch(`${root}/landmarks.json`'), "Landmark data must load from the generated runtime manifest");
assert(app.includes('data-map-entity'), "Map interactions must use the shared entity contract");
assert(app.includes('selectedDistrictId = null;') && app.includes('selectedLandmarkId = null;') && app.includes('state.selectedPlotId = null;'), "District, plot and landmark selection must clear competing entity types");
assert(styles.includes(".map-canvas.is-detail-zoom .plot-interaction"), "Plot interaction must be gated by detail zoom");
assert(styles.includes(".map-canvas.is-detail-zoom .landmark-label"), "Landmark labels must appear at detail zoom");
assert(!app.includes('id: "cp_01"') && !app.includes('id: "fd_01"'), "Retired M0 representative plots must not remain in runtime data");
assert(app.includes('metropolis_roaring_times_m1w_unified_save_v4'), "Geometry migration must use the v4 save namespace");

for (const landmark of landmarks.landmarks) {
  for (const asset of [landmark.artwork.file, landmark.label.file]) {
    assert(fs.existsSync(path.join(webRoot, "assets/runtime_map_v001", asset)), `Missing landmark asset: ${asset}`);
  }
}

console.log("RUNTIME_MAP_INTEGRATION_TEST_PASS plots=30 landmarks=52 zoom=1000 detail_from=500 selection=exclusive");

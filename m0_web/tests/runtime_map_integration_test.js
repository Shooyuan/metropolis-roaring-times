"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const webRoot = path.resolve(__dirname, "..");
const read = (relative) => fs.readFileSync(path.join(webRoot, relative), "utf8");
const html = read("index.html");
const app = read("app.js");
const styles = read("styles.css");
const landmarkContentScript = read("landmark-content.js");
const enLocale = read("locales/en-US.js");
const zhLocale = read("locales/zh-CN.js");
const plots = JSON.parse(read("assets/runtime_map_v001/plots.json"));
const landmarks = JSON.parse(read("assets/runtime_map_v001/landmarks.json"));

assert.equal(plots.plotCount, 30, "Runtime web package must contain the 30 approved plots");
assert.equal(landmarks.landmarkCount, 52, "Runtime web package must contain the 52 approved landmarks");
assert.deepEqual([...new Set(plots.plots.map((plot) => plot.priceTier))].sort(), ["cheap", "expensive", "medium"]);
assert.equal(new Set(plots.plots.map((plot) => plot.id)).size, 30, "Plot IDs must be unique");
assert.equal(new Set(landmarks.landmarks.map((landmark) => landmark.id)).size, 52, "Landmark IDs must be unique");

const contentSandbox = { window: {} };
vm.runInNewContext(landmarkContentScript, contentSandbox, { filename: "landmark-content.js" });
const landmarkCopy = contentSandbox.window.M1W_LANDMARK_COPY;
assert.equal(Object.keys(landmarkCopy).length, 52, "The bilingual copy deck must contain exactly 52 landmarks");
for (const landmark of landmarks.landmarks) {
  const copy = landmarkCopy[landmark.id];
  assert(copy, `Missing landmark copy: ${landmark.id}`);
  for (const locale of ["en-US", "zh-CN"]) {
    for (const field of ["name", "short", "long", "sourceTitle", "sourceUrl"]) {
      assert(copy[locale][field]?.trim(), `Missing ${locale}.${field}: ${landmark.id}`);
    }
  }
  assert(copy["zh-CN"].short.startsWith(`${copy["zh-CN"].name}，`), `Chinese short must start with the landmark name: ${landmark.id}`);
  assert(copy["en-US"].sourceUrl.startsWith("https://en.wikipedia.org/wiki/"), `Source must be English Wikipedia: ${landmark.id}`);
}

const playerCopyFiles = { html, enLocale, zhLocale, landmarkContentScript };
const bannedEngineeringCopy = [
  /owner-authored/i,
  /owner-approved/i,
  /owner approval/i,
  /producer demo/i,
  /approval gate/i,
  /老板/,
  /制作人地图演示/,
  /本灰盒/,
  /老板审核/,
  /老板绘制/,
  /老板定稿/,
];
for (const [file, source] of Object.entries(playerCopyFiles)) {
  for (const pattern of bannedEngineeringCopy) {
    assert(!pattern.test(source), `Player-facing ${file} contains engineering-language pattern ${pattern}`);
  }
}

for (const id of ["plot-overlay", "plot-mark-layer", "landmark-layer", "landmark-details", "entity-file-title"]) {
  assert(html.includes(`id="${id}"`), `Missing runtime-map DOM node: ${id}`);
}
assert(html.includes("assets/runtime_map_v001/base/metropolis_map_base.svg"), "M1W must use the v004 runtime map base");
assert(html.includes("app.js?v=m1w-no-labels1"), "M1W must cache-bust the landmark label removal");
assert(html.includes("landmark-content.js?v=m1w-copy1"), "M1W must load the formal bilingual landmark copy deck");
assert(app.includes('window.fetch(`${root}/plots.json`'), "Plot data must load from the generated runtime manifest");
assert(app.includes('window.fetch(`${root}/landmarks.json`'), "Landmark data must load from the generated runtime manifest");
assert(app.includes('data-map-entity'), "Map interactions must use the shared entity contract");
assert(app.includes('selectedDistrictId = null;') && app.includes('selectedLandmarkId = null;') && app.includes('state.selectedPlotId = null;'), "District, plot and landmark selection must clear competing entity types");
assert(styles.includes(".map-canvas.is-detail-zoom .plot-interaction"), "Plot interaction must be gated by detail zoom");
assert(!app.includes("MAP_LANDMARK_LABEL_ZOOM_STEP") && !app.includes("isLandmarkLabelZoom"), "Landmark map labels must not have a high-zoom runtime gate");
assert(!app.includes("landmark.label"), "Landmark label assets must not be rendered into landmark buttons");
assert(!styles.includes("landmark-label"), "Landmark map labels must not have runtime CSS");
assert(!html.includes("landmark labels appear"), "Map helper copy must not promise hidden landmark labels");
assert(styles.includes(".map-canvas.is-detail-zoom .runtime-plot-asset"), "Plot building assets must appear at detail zoom");
assert(styles.includes('font-family: "Kings M1W"'), "Runtime district labels must use the approved Kings font");
assert(styles.includes(".district-label-text.is-hovered") && styles.includes(".district-label-text.is-selected"), "Runtime district labels must react to hover and locked selection");
assert(app.includes("setDistrictLabelClass(meta.id, \"is-hovered\", true)"), "District hover must activate the matching map label color");
assert(app.includes("setDistrictLabelClass(group.dataset.districtId, \"is-selected\", selected)"), "District selection must lock the matching map label color");
assert(styles.includes("stroke-width: 1.5px"), "Runtime purchasable plot strokes must use the approved half-width visual treatment");
assert(styles.includes("stroke-width: 3.5px") && styles.includes("stroke-width: 1px"), "Runtime plot hover/selection outlines must use the approved thinner border pair");
assert(styles.includes(".landmark-entity:hover .landmark-glow"), "Runtime landmark hover must use the separate transparent red glow overlay");
assert(styles.includes(".landmark-entity.is-selected .landmark-glow"), "Runtime landmark selection must persist the separate glow overlay after click");
assert(app.includes("window.requestAnimationFrame") && app.includes("scheduleMapView()"), "Runtime map drag must be requestAnimationFrame-throttled");
assert(app.includes("cachedMaxPanX") && app.includes("cachedMaxPanY"), "Runtime map drag must cache pan bounds during pointer drag");
assert(styles.includes("button.landmark-entity:hover:not(:disabled)") && styles.includes("background: transparent;"), "Runtime landmark buttons must not show generic button hover backgrounds");
assert(app.includes("landmark-glow") && app.includes("glow/${landmark.id}_glow.png"), "Runtime landmarks must load generated glow mask assets");
assert(!styles.includes(".landmark-entity.is-selected::after"), "Runtime landmark selection must not render the old rectangular frame overlay");
assert(!styles.includes(".landmark-entity:hover .landmark-artwork") && !styles.includes("drop-shadow(0 0 14px"), "Runtime landmark glow must not filter the artwork image or restore the broad image-bound shadow");
assert(!app.includes('id: "cp_01"') && !app.includes('id: "fd_01"'), "Retired M0 representative plots must not remain in runtime data");
assert(app.includes('metropolis_roaring_times_m1w_unified_save_v4'), "Geometry migration must use the v4 save namespace");

for (const landmark of landmarks.landmarks) {
  for (const asset of [landmark.artwork.file, landmark.label.file, `glow/${landmark.id}_glow.png`]) {
    assert(fs.existsSync(path.join(webRoot, "assets/runtime_map_v001", asset)), `Missing landmark asset: ${asset}`);
  }
}

console.log("RUNTIME_MAP_INTEGRATION_TEST_PASS plots=30 landmarks=52 zoom=1500 detail_from=500 labels=hidden selection=exclusive");

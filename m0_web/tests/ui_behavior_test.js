"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const sandbox = vm.createContext({
  window: { M1WI18n: { t: (key) => key, getLocale: () => "en-US" } },
  document: { readyState: "loading", addEventListener() {} },
  getComputedStyle: () => ({ aspectRatio: "10334 / 14101" }),
});
vm.runInContext(fs.readFileSync(path.join(__dirname, "../app.js"), "utf8"), sandbox);
const run = (source) => vm.runInContext(source, sandbox);

run(`
  dom.mapStage = { clientWidth: 900, clientHeight: 800,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 900, height: 800 }) };
  dom.mapAnchor = { style: {}, offsetWidth: 900, offsetHeight: 1228 };
  dom.mapCanvas = { classList: { toggle() {} } };
  dom.mapZoomValue = {};
  dom.mapZoomOut = {};
  dom.mapZoomIn = {};
  mapView.loaded = true;
  updateMapFit();
`);
const fitted = run("currentMapZoom()");
assert(Math.abs(fitted * 800 * 10334 / 14101 - 900) < .01, "Initial map must fit the available width");
assert.equal(run("dom.mapZoomOut.disabled"), true);
run("setMapZoomStep(mapView.zoomStep + 1)");
assert(run("currentMapZoom()") > fitted, "First plus press must visibly zoom in, skipping steps below fit");
run("setMapZoomStep(mapView.zoomStep - 1)");
assert.equal(run("currentMapZoom()"), fitted, "Minus must return to fit without exposing side gaps");
run("setMapZoomStep(999)");
assert.equal(run("currentMapZoom()"), 15);
assert.equal(run("dom.mapZoomIn.disabled"), true);
run("resetMapView()");
assert.equal(run("currentMapZoom()"), fitted);
run("dom.mapStage.clientWidth = 1100; updateMapFit()");
assert(Math.abs(run("currentMapZoom()") * 800 * 10334 / 14101 - 1100) < .01, "Resizing must recompute fit");
run("setMapZoomStep(MAP_DETAIL_ZOOM_STEP)");
assert.equal(run("isDetailZoom()"), true, "Detail interactions must still start at 500%");
run("setMapZoomStep(MAP_DETAIL_ZOOM_STEP - 1)");
assert.equal(run("isDetailZoom()"), false);
run("dom.mapStage.clientWidth = 600; dom.mapStage.clientHeight = 1200; resetMapView(); updateMapFit()");
assert(Math.abs(run("currentMapZoom()") * 1200 * 10334 / 14101 - 600) < .01, "Tall viewports must also fit exactly, even below 100%");

run('state = { turn: 1, log: [{ turn: 1, key: "activity.match_entered", values: {} }] }');
assert.equal(run("getNewsRecords().length"), 0, "Opening must display the requested market brief, not a startup log");
run('state.turn = 2; state.log.unshift({ turn: 2, key: "activity.operating_settlement", values: {} })');
assert.equal(run("getNewsRecords()[0].text"), "news.headline.turn_2", "New turn bulletin must outrank routine settlement");
run('state.log.unshift({ turn: 2, key: "activity.test_action", values: {} })');
assert.equal(run("getNewsRecords()[0].text"), "activity.test_action", "A subsequent action must replace the bulletin");
assert.equal(run("getNewsRecords()[1].text"), "news.headline.turn_2", "Earlier news must remain available in history");
run('const firstAction = getNewsRecords()[0].identity; state.log.unshift({ turn: 2, key: "activity.test_action", values: {} })');
assert.equal(run("getNewsRecords()[0].identity === firstAction"), false, "Identical text from a new action must still count as a new message");
run('state.turn = 3; state.log.unshift({ turn: 3, key: "activity.operating_settlement", values: {} })');
assert.equal(run("getNewsRecords()[0].text"), "news.headline.turn_3", "Newer turns must supersede previous actions");

console.log("UI_BEHAVIOR_TEST_PASS map_fit resize zoom_limits opening_brief news_order history");

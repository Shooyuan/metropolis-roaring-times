"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const authoritativeDocs = [
  "AGENTS.md",
  "00_PROJECT_CONTEXT.md",
  "docs/01_PRODUCT_BRIEF.md",
  "docs/02_GAME_RULES.md",
  "docs/03_VERTICAL_SLICE_SCOPE.md",
  "docs/04_MAP_AND_ART_DIRECTION.md",
  "docs/05_TECHNICAL_ARCHITECTURE.md",
  "docs/06_ACCEPTANCE_TESTS.md",
  "docs/07_IMPLEMENTATION_PLAN.md",
  "docs/MAP_ASSET_PIPELINE.md",
  "docs/IN_GAME_UI_LAYOUT_SPEC.md",
  "docs/ASSET_MANIFEST.md",
  "docs/OWNER_PROJECT_REVIEW.md",
];

const combined = authoritativeDocs.map(read).join("\n");
for (const layer of [
  "08_PURCHASABLE_BLOCK_GEOMETRY",
  "07_HISTORICAL_LANDMARKS",
  "06_FRAME",
  "05_NON_BUILDING_ORNAMENT",
  "04_ROADS",
  "03_DISTRICT_GEOMETRY",
  "02_COASTLINE",
  "01_WATER",
]) {
  assert(combined.includes(layer), `Missing authoritative layer: ${layer}`);
}

assert(!/exactly 64|all 64|64 个可购买|64 production plots/i.test(combined), "Retired fixed plot count remains active");
assert(combined.includes("100%`, `125%`, `156%`, `195%`, `244%`, `305%`, `381%`, `477%`, `500%`, `625%`, `781%`, `977%`, `1000%`, `1250%`, `1500%"), "Approved zoom ladder missing");
assert(combined.includes("English Wikipedia"), "Single-source content rule missing");
assert(combined.includes("district | plot | landmark | null"), "Mutually exclusive selection contract missing");

const zh = read("m0_web/locales/zh-CN.js");
assert(zh.includes('"district.district_west_village.name": "西乡"'), "West Village Chinese name is not 西乡");
assert(zh.includes('"district.district_east_village.name": "东乡"'), "East Village Chinese name is not 东乡");
assert(!zh.includes('"district.district_west_village.name": "西村"'), "Retired 西村 name remains");
assert(!zh.includes('"district.district_east_village.name": "东村"'), "Retired 东村 name remains");

const icon = read("assets/wikipedia-w.svg");
assert(icon.includes("<svg"), "Wikipedia source icon is not SVG");
assert(icon.includes('viewBox="0 0 1024 1024"'), "Wikipedia source icon viewBox changed");

for (const reviewFile of [
  "docs/HISTORICAL_CONTENT_REVIEW/README.md",
  "docs/HISTORICAL_CONTENT_REVIEW/APPROVAL_REGISTER.md",
  "docs/HISTORICAL_CONTENT_REVIEW/SOURCE_REGISTER.md",
  "docs/HISTORICAL_CONTENT_REVIEW/templates/DISTRICT_TEMPLATE.md",
  "docs/HISTORICAL_CONTENT_REVIEW/templates/LANDMARK_TEMPLATE.md",
]) {
  assert(fs.existsSync(path.join(root, reviewFile)), `Missing review file: ${reviewFile}`);
}

console.log("MAP_CONTENT_CONTRACT_TEST_PASS layers=8 zoom_steps=15 locales=2");

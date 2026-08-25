"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const webRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(webRoot, "..");
const html = fs.readFileSync(path.join(webRoot, "index.html"), "utf8");
const script = fs.readFileSync(path.join(webRoot, "app.js"), "utf8");
const styles = fs.readFileSync(path.join(webRoot, "styles.css"), "utf8");
const brand = fs.readFileSync(path.join(webRoot, "assets", "00_BRAND.svg"));
const mapBase = fs.readFileSync(path.join(webRoot, "assets", "metropolis_map_base.svg"));
const districts = fs.readFileSync(path.join(webRoot, "assets", "metropolis_district_geometry.svg"));
const sourceZip = path.join(projectRoot, "assets", "metropolis_handoff_1786627051152.zip");

const expectedDistricts = [
  "district_inwood",
  "district_washington_heights",
  "district_harlem",
  "district_upper_east",
  "district_upper_west",
  "district_midtown_west",
  "district_midtown_east",
  "district_chelsea",
  "district_west_village",
  "district_east_village",
  "district_soho",
  "district_financial_district",
];

const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");
const zipEntry = (entry) => execFileSync("unzip", ["-p", sourceZip, entry], { maxBuffer: 8 * 1024 * 1024 });

assert.equal(sha256(mapBase), sha256(zipEntry("export/metropolis_map_base.svg")), "Web map base must be an exact derivative of handoff v003");
assert.equal(sha256(districts), sha256(zipEntry("export/metropolis_district_geometry.svg")), "Web district geometry must be an exact derivative of handoff v003");
assert.equal(sha256(brand), sha256(fs.readFileSync(path.join(projectRoot, "assets", "00_BRAND.svg"))), "Web Brand must match the approved project Brand");

const districtText = districts.toString("utf8");
const exportedIds = [...districtText.matchAll(/<g id="(district_[^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(exportedIds.sort(), [...expectedDistricts].sort(), "District SVG must contain exactly the twelve approved IDs");
assert(!districtText.includes("district_finicial_district"), "Retired Financial District misspelling must not return");
assert(!districtText.includes('id="istrict_financial_district"'), "Financial District ID must not lose its first letter");

for (const id of ["map-stage", "map-anchor", "map-canvas", "district-overlay", "map-zoom-out", "map-zoom-in", "map-reset", "district-details"]) {
  assert(html.includes(`id="${id}"`), `Missing M1W DOM contract: ${id}`);
}
for (const id of ["home-screen", "home-panel", "home-load-panel", "home-config-panel", "home-about-panel", "home-language-select"]) {
  assert(html.includes(`id="${id}"`), `Missing home screen DOM contract: ${id}`);
}
for (const asset of ["right-menu-panel-complete.png", "1.png", "2.png", "3.png", "4.png", "nyc-skyline-from-reference-v3.png", "button_frame_default.png"]) {
  assert(html.includes(`assets/home_png_complete/${asset}`) || styles.includes(`assets/home_png_complete/${asset}`), `Home screen must reference ${asset}`);
  assert(fs.existsSync(path.join(webRoot, "assets", "home_png_complete", asset)), `Missing home screen asset: ${asset}`);
}
const homeMap = path.join(webRoot, "assets", "manhattan_map_reference.jpg");
const homePanel = path.join(webRoot, "assets", "cutouts", "panel_center_large.png");
for (const font of ["InknutAntiqua-Regular.ttf", "InknutAntiqua-Bold.ttf"]) {
  assert(fs.existsSync(path.join(webRoot, "assets", "fonts", font)), `Missing approved home font: ${font}`);
}
assert.equal(sha256(fs.readFileSync(homeMap)), sha256(fs.readFileSync(path.join(projectRoot, "references", "manhattan_map_reference.jpg"))), "Home background must be an exact copy of the approved reference map");
assert(html.includes('class="home-map-scroll"') && html.includes('src="assets/manhattan_map_reference.jpg"'), "Home must render the approved map as its scrolling background");
assert(html.includes('src="assets/cutouts/panel_center_large.png"'), "Load, Config and About must share the owner-provided center panel asset");
assert(fs.existsSync(homePanel), "Missing owner-provided center panel asset");
assert(styles.includes("animation: home-map-bottom-to-top 60s linear infinite"), "Home map must use the approved 60-second bottom-to-top loop");
assert(styles.includes("width: 100vw") && styles.includes("opacity: .7"), "Home map and skyline sizing/opacity contract must remain explicit");
assert(styles.includes('font-family: "Inknut Antiqua M1W"'), "Home typography must use Inknut Antiqua");
assert(html.includes('data-home-action="new"'), "Home screen must expose a new-game action");
assert(!html.includes('id="start-modal" class="modal-backdrop is-open"'), "Rival chooser must not open before the home screen action");
assert(html.includes("Metropolis: Roaring Times"), "Player-facing title must include the colon");
assert(!html.includes("BROOKLYN BRIDGEHEAD"), "Retired district label must not be visible in the M1W map");
assert(!html.includes("HELL'S KITCHEN"), "Retired district label must not be visible in the M1W map");
assert(!script.includes("Brooklyn Bridgehead"), "Retired district semantics must not remain in active M1W code");
assert(!script.includes("Hell's Kitchen"), "Retired district semantics must not remain in active M1W code");
assert(brand.toString("utf8").includes('id="brand-title-colon"'), "Approved Brand colon vector must be present");

for (const id of expectedDistricts) assert(script.includes(`id: "${id}"`), `Missing district metadata: ${id}`);
assert(script.includes("const MAP_ZOOM_FACTOR = 1.25;"), "Map zoom must use the approved fixed 125% factor");
assert(script.includes("const MAP_MAX_ZOOM_STEP = 5;"), "Map zoom step limit must remain explicit");
assert(!script.includes("rotate("), "M1W map transforms must not introduce rotation");
assert(script.includes('dom.mapAnchor.style.height = `${zoom * 100}%`;'), "Map zoom must resize the SVG layout box for sharp Safari rendering");
assert(!script.includes("dom.mapCanvas.style.transform = `scale(${zoom})`;"), "Map zoom must not enlarge a cached composited bitmap");
assert(!styles.includes(".map-canvas { position: absolute; inset: 0; transform-origin:"), "Map canvas must not advertise a composited scale transform");

console.log(`M1W_STATIC_TEST_PASS districts=${expectedDistricts.length} map_sha=${sha256(mapBase).slice(0, 12)} brand_sha=${sha256(brand).slice(0, 12)}`);

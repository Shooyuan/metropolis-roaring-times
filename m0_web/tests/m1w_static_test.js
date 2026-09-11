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
const favicon = path.join(webRoot, "assets", "metropolis-game-logo-256.png");

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
for (const id of ["home-screen", "home-panel", "home-load-panel", "home-config-panel", "home-about-panel", "home-language-value", "start-modal-back", "start-confirm-button"]) {
  assert(html.includes(`id="${id}"`), `Missing home screen DOM contract: ${id}`);
}
for (const asset of ["right-menu-panel-complete.png", "1.png", "2.png", "3.png", "4.png", "nyc-skyline-from-reference-v3-expanded-sides 1.png", "manhattan_map_reference.png", "Vector.png", "button_frame_default.png"]) {
  assert(html.includes(`assets/home_png_complete/${asset}`) || styles.includes(`assets/home_png_complete/${asset}`), `Home screen must reference ${asset}`);
  assert(fs.existsSync(path.join(webRoot, "assets", "home_png_complete", asset)), `Missing home screen asset: ${asset}`);
}
const homePanel = path.join(webRoot, "assets", "home_png_complete", "panel_center_large.png");
for (const font of ["InknutAntiqua-Regular.ttf", "InknutAntiqua-Bold.ttf"]) {
  assert(fs.existsSync(path.join(webRoot, "assets", "fonts", font)), `Missing approved home font: ${font}`);
}
assert(html.includes('class="home-map-scroll"') && html.includes('src="assets/home_png_complete/manhattan_map_reference.png"'), "Home must render the owner-selected PNG map as its scrolling background");
assert(html.includes('src="assets/home_png_complete/panel_center_large.png"'), "Load, Config, About and the rival chooser must share the available owner-provided center panel asset");
assert(fs.existsSync(homePanel), "Missing owner-provided center panel asset");
assert(styles.includes("animation: home-map-bottom-to-top 60s linear infinite"), "Home map must use the approved 60-second bottom-to-top loop");
assert(styles.includes("width: 100vw") && styles.includes("opacity: .7"), "Home map and skyline sizing/opacity contract must remain explicit");
assert(styles.includes('font-family: "Inknut Antiqua M1W"'), "Home typography must use Inknut Antiqua");
assert(/\.home-menu-actions button \{[\s\S]*?font-weight: 400;/.test(styles), "Home menu must use Inknut Antiqua Regular without changing its size");
assert(styles.includes("top: 3.7%") && styles.includes("left: 34.8%") && styles.includes("top: 50.2%") && styles.includes("left: 35.5%"), "Home documents must retain the approved Group 11 composition anchors");
assert(!html.includes('id="home-language-select"'), "Home Config must not use a native language selector");
assert((html.match(/data-home-language-step=/g) || []).length === 2, "Home Config must expose left and right language arrows");
assert(script.includes("function stepHomeLanguage(direction)"), "Home language arrows must have a shared cycling implementation");
assert(styles.includes('background: url("assets/home_png_complete/Vector.png")'), "Load and Config choices must use the approved Vector frame");
assert(/\.home-panel-back:hover[\s\S]*?color: #9d342c;/.test(styles), "Home panel esc control must share the red selected feedback");
assert(html.includes('data-home-action="new"'), "Home screen must expose a new-game action");
assert(!html.includes('id="start-modal" class="modal-backdrop is-open"'), "Rival chooser must not open before the home screen action");
assert(html.includes('id="start-confirm-button"') && html.includes("disabled data-i18n=\"home.rival.start\""), "Rival chooser must require a selection before Start");
assert(script.includes('button.addEventListener("click", () => selectRival(button.dataset.rival))'), "Rival cards must select first instead of immediately starting a match");
assert(script.includes('dom.startConfirmButton.addEventListener("click"'), "The framed Start control must launch the selected match");
assert(/function openNewGameFlow\(\) \{[\s\S]*?showHomeScreen\(\);[\s\S]*?dom\.startModal\.classList\.add\("is-open"\);/.test(script), "New Game must open the rival chooser over the home screen");
assert(styles.includes('color: #9b7242;'), "Rival explanations must use the approved brown text color");
assert(styles.includes('background: url("assets/home_png_complete/panel_center_large.png")'), "Rival cards must use the approved panel center artwork");
assert(styles.includes('background: url("assets/home_png_complete/button_frame_default.png")'), "Start must use the approved framed button artwork");
assert(styles.includes("grid-template-columns: repeat(3, minmax(0, 1fr))"), "Rival choices must remain exactly equal width even when a name has a larger intrinsic width");
assert(styles.includes("aspect-ratio: 364 / 90"), "Start must preserve the source frame's native aspect ratio");
assert(styles.includes('.rival-option[data-rival="landlady"] strong { transform: translateX(-16px); }'), "Landlady needs the approved optical centering correction");
assert(/\.start-confirm-button \{[\s\S]*?display: flex;[\s\S]*?align-items: center;[\s\S]*?line-height: 1;/.test(styles), "Start text must remain vertically centered inside its native-ratio frame");
assert(html.includes("Metropolis: Roaring Times"), "Player-facing title must include the colon");
assert(html.includes('rel="icon" type="image/png" sizes="256x256" href="assets/metropolis-game-logo-256.png?v=1"'), "The browser tab must use the approved Metropolis game logo");
assert(fs.existsSync(favicon), "Missing generated 256px Metropolis favicon");
assert(!html.includes("BROOKLYN BRIDGEHEAD"), "Retired district label must not be visible in the M1W map");
assert(!html.includes("HELL'S KITCHEN"), "Retired district label must not be visible in the M1W map");
assert(!script.includes("Brooklyn Bridgehead"), "Retired district semantics must not remain in active M1W code");
assert(!script.includes("Hell's Kitchen"), "Retired district semantics must not remain in active M1W code");
assert(brand.toString("utf8").includes('id="brand-title-colon"'), "Approved Brand colon vector must be present");

for (const id of expectedDistricts) assert(script.includes(`id: "${id}"`), `Missing district metadata: ${id}`);
assert(script.includes("const MAP_ZOOM_FACTOR = 1.25;"), "Map zoom must use the approved fixed 125% factor");
assert(script.includes("const MAP_ZOOM_STEPS = [1, 1.25, 1.56, 1.95, 2.44, 3.05, 3.81, 4.77, 5, 6.25, 7.81, 9.77, 10];"), "Map zoom must use the approved thirteen-step ladder ending at 1000%");
assert(script.includes("const MAP_DETAIL_ZOOM_STEP = MAP_ZOOM_STEPS.indexOf(5);"), "Plot and landmark selection must remain available from the 500% detail threshold through 1000%");
assert(!script.includes("rotate("), "M1W map transforms must not introduce rotation");
assert(script.includes('dom.mapAnchor.style.height = `${zoom * 100}%`;'), "Map zoom must resize the SVG layout box for sharp Safari rendering");
assert(!script.includes("dom.mapCanvas.style.transform = `scale(${zoom})`;"), "Map zoom must not enlarge a cached composited bitmap");
assert(!styles.includes(".map-canvas { position: absolute; inset: 0; transform-origin:"), "Map canvas must not advertise a composited scale transform");

console.log(`M1W_STATIC_TEST_PASS districts=${expectedDistricts.length} map_sha=${sha256(mapBase).slice(0, 12)} brand_sha=${sha256(brand).slice(0, 12)}`);

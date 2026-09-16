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
const localization = fs.readFileSync(path.join(webRoot, "localization.css"), "utf8");
const brand = fs.readFileSync(path.join(webRoot, "assets", "00_BRAND.svg"));
const mapBase = fs.readFileSync(path.join(webRoot, "assets", "metropolis_map_base.svg"));
const districts = fs.readFileSync(path.join(webRoot, "assets", "metropolis_district_geometry.svg"));
const sourceZip = path.join(projectRoot, "assets", "metropolis_handoff_1786627051152.zip");
const favicon = path.join(webRoot, "assets", "metropolis-game-logo-256.png");
const headerLogo = path.join(webRoot, "assets", "metropolis-game-logo.png");

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
for (const asset of ["construction_site.png", "standard_apartment.png", "luxury_apartment.png", "department_store.png", "factory.png"]) {
  assert(script.includes(`assets/buildings/${asset}`), `Runtime map must reference building asset: ${asset}`);
  assert(fs.existsSync(path.join(webRoot, "assets", "buildings", asset)), `Missing runtime building asset: ${asset}`);
}
const homePanel = path.join(webRoot, "assets", "new ui", "01_plain_panel_2x.png");
for (const font of ["InknutAntiqua-Regular.ttf", "InknutAntiqua-Bold.ttf", "Kings-Regular.ttf"]) {
  assert(fs.existsSync(path.join(webRoot, "assets", "fonts", font)), `Missing approved home font: ${font}`);
}
for (const font of ["SourceHanSerifCN-Bold-2.otf", "SourceHanSerifCN-Medium-6.otf"]) {
  assert(fs.existsSync(path.join(webRoot, "assets", "fonts", font)), `Missing approved Chinese UI font: ${font}`);
}
assert(html.includes('class="home-map-scroll"') && html.includes('src="assets/home_png_complete/manhattan_map_reference.png"'), "Home must render the owner-selected PNG map as its scrolling background");
assert(html.includes('src="assets/new%20ui/01_plain_panel_2x.png"'), "Load, Config, About and the rival chooser must use the approved plain panel asset");
assert(fs.existsSync(homePanel), "Missing owner-provided center panel asset");
assert(styles.includes("animation: home-map-bottom-to-top 60s linear infinite"), "Home map must use the approved 60-second bottom-to-top loop");
assert(styles.includes("width: 100vw") && styles.includes("opacity: .7"), "Home map and skyline sizing/opacity contract must remain explicit");
assert(html.includes("styles.css?v=m1w-ui-bottom1"), "Main stylesheet cachebuster must advance after the bottom controls refinement");
assert(styles.includes('font-family: "Inknut Antiqua M1W"'), "Home typography must use Inknut Antiqua");
assert(styles.includes('font-family: "Kings M1W"'), "District map labels must use the approved Kings font");
assert(styles.includes("fill: #bdb199") && styles.includes("fill: #4e403e"), "District map labels must use the approved inactive and hover/selected colors");
assert(script.includes('district_upper_east", name: "Upper East Side", label: ["UPPER", "EAST", "SIDE"]'), "Upper East Side map label must be split one word per line");
assert(script.includes('district_west_village", name: "West Village", label: ["WEST", "VILLAGE"]'), "Village map labels must be split one word per line");
assert(script.includes("const DISTRICT_LABEL_LAYOUT = {"), "District labels must use per-district layout controls instead of one global size");
assert(styles.includes('html[lang="en-US"] .game-shell'), "English in-game UI must be explicitly scoped to Inknut Antiqua");
assert(html.includes("localization.css?v=m1w-label1"), "Localization stylesheet cachebuster must advance after the district-label font override");
assert(localization.includes('html[lang] .district-label-text') && localization.includes('font-family: "Kings M1W", Georgia, serif !important;'), "Localization must not override map labels away from the approved Kings font");
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
assert(script.includes('window.location.protocol === "file:"') && script.includes("toast.local_server_required"), "Direct file launches must explain that the local server is required");
assert(styles.includes(".toast { position: fixed; z-index: 620;"), "Home-screen startup feedback must appear above the home overlay");
assert(/\.masthead \{[\s\S]*?min-height: 54px;[\s\S]*?padding: 5px 12px;/.test(styles), "Top status bar must stay thin after the top bar refinement");
assert(/\.masthead h1 \{[\s\S]*?white-space: nowrap;/.test(styles), "Header title must not wrap and inflate the top bar");
assert(styles.includes(".brand-lockup > div { min-width: 0; }"), "Header title wrapper must be allowed to shrink before it pushes status controls away");
assert(/\.top-status-cell \{[\s\S]*?min-width: 102px;[\s\S]*?height: 38px;[\s\S]*?border: 1px solid var\(--line\);/.test(styles), "Cash and debt cells must remain compact instead of oversized boxes");
assert(/\.top-status-cell strong \{[\s\S]*?min-height: 14px;[\s\S]*?line-height: 1\.2;/.test(styles), "Cash and debt values must not be vertically clipped");
assert(/\.header-actions \.quiet-button \{[\s\S]*?min-width: 88px;[\s\S]*?padding: 0 14px;/.test(styles), "Config button must keep enough horizontal breathing room");
assert(html.includes('id="map-status" class="visually-hidden"') && !html.includes("12 districts · 30 plots · 52 landmarks</span>"), "Map count status must not remain visible in the toolbar");
assert(/\.map-toolbar\.map-legend \{[\s\S]*?gap: 10px;/.test(styles), "Map zoom controls must keep enough spacing");
assert(/\.map-toolbar #map-reset \{[\s\S]*?margin-right: auto;/.test(styles), "Map reset must separate zoom controls from the legend");
assert(/\.turn-panel \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\);[\s\S]*?grid-template-rows: auto 38px;/.test(styles), "Turn panel must use stacked rows to avoid metric and button overlap");
assert(/\.turn-metrics div \{[\s\S]*?height: 46px;/.test(styles) && /\.turn-metrics small \{[\s\S]*?height: 14px;/.test(styles), "Turn metrics must stay compact enough to keep End Turn inside the panel");
assert(styles.includes("grid-template-rows: minmax(330px, 1fr) 132px;"), "Right column must reserve enough height for the turn controls");
assert(styles.includes('color: #9b7242;'), "Rival explanations must use the approved brown text color");
assert(styles.includes('background: url("assets/new%20ui/01_plain_panel_2x.png")'), "Rival cards must use the approved plain panel artwork");
assert(styles.includes('background: url("assets/home_png_complete/button_frame_default.png")'), "Start must use the approved framed button artwork");
assert(styles.includes("grid-template-columns: repeat(3, minmax(0, 1fr))"), "Rival choices must remain exactly equal width even when a name has a larger intrinsic width");
assert(styles.includes("aspect-ratio: 364 / 90"), "Start must preserve the source frame's native aspect ratio");
assert(styles.includes('html[lang="en-US"] .rival-option[data-rival="landlady"] strong { transform: translateX(-16px); }'), "English Landlady needs the approved optical centering correction");
assert(styles.includes('html[lang="zh-CN"] .rival-option[data-rival="landlady"] strong { transform: translateX(0); }'), "Chinese 女房东 must remain visually centered");
assert(/\.start-confirm-button \{[\s\S]*?display: flex;[\s\S]*?align-items: center;[\s\S]*?line-height: 1;/.test(styles), "Start text must remain vertically centered inside its native-ratio frame");
assert(html.includes('<h2 id="settings-title">Config</h2>') && !html.includes('<h2 id="settings-title">System</h2>'), "Config modal must promote Config as the title and remove the System heading");
assert(html.includes('class="settings-description"'), "Config modal must include the concise game description requested by the owner");
assert(styles.includes("#settings-modal {\n  z-index: 430;\n}"), "Config modal must appear above the home overlay when opened from the top bar");
assert(/\.settings-card h2 \{[\s\S]*?font-size: clamp\(2\.35rem, 4vw, 3\.4rem\);/.test(styles), "Config heading must be enlarged inside the settings modal");
assert(/\.config-actions button \{[\s\S]*?min-height: 36px;[\s\S]*?font-size: \.88rem;/.test(styles), "Config action buttons must be compact instead of oversized");
assert(html.includes("Metropolis: Roaring Times"), "Player-facing title must include the colon");
assert(html.includes('src="assets/metropolis-game-logo.png"'), "Header must use the owner-selected Metropolis game logo");
assert.equal(sha256(fs.readFileSync(headerLogo)), sha256(fs.readFileSync(path.join(projectRoot, "assets", "metropolis game logo.png"))), "Header logo must match the owner-selected project asset");
assert(html.includes('rel="icon" type="image/png" sizes="256x256" href="assets/metropolis-game-logo-256.png?v=1"'), "The browser tab must use the approved Metropolis game logo");
assert(fs.existsSync(favicon), "Missing generated 256px Metropolis favicon");
assert(!html.includes("BROOKLYN BRIDGEHEAD"), "Retired district label must not be visible in the M1W map");
assert(!html.includes("HELL'S KITCHEN"), "Retired district label must not be visible in the M1W map");
assert(!script.includes("Brooklyn Bridgehead"), "Retired district semantics must not remain in active M1W code");
assert(!script.includes("Hell's Kitchen"), "Retired district semantics must not remain in active M1W code");
assert(brand.toString("utf8").includes('id="brand-title-colon"'), "Approved Brand colon vector must be present");

for (const id of expectedDistricts) assert(script.includes(`id: "${id}"`), `Missing district metadata: ${id}`);
assert(script.includes("const MAP_ZOOM_FACTOR = 1.25;"), "Map zoom must use the approved fixed 125% factor");
assert(script.includes("const MAP_ZOOM_STEPS = [1, 1.25, 1.56, 1.95, 2.44, 3.05, 3.81, 4.77, 5, 6.25, 7.81, 9.77, 10, 12.5, 15];"), "Map zoom must use the approved fifteen-step ladder ending at 1500%");
assert(script.includes("const MAP_DETAIL_ZOOM_STEP = MAP_ZOOM_STEPS.indexOf(5);"), "Plot and landmark selection must remain available from the 500% detail threshold through 1500%");
assert(!script.includes("MAP_LANDMARK_LABEL_ZOOM_STEP"), "Landmark map labels must remain removed from runtime zoom gates");
assert(!script.includes("isLandmarkLabelZoom"), "Landmark map labels must not be restored through a separate zoom helper");
assert(!script.includes("landmark.label"), "Landmark map label assets must not be rendered into the map DOM");
assert(!script.includes("rotate("), "M1W map transforms must not introduce rotation");
assert(script.includes('dom.mapAnchor.style.height = `${zoom * 100}%`;'), "Map zoom must resize the SVG layout box for sharp Safari rendering");
assert(script.includes("window.requestAnimationFrame") && script.includes("scheduleMapView()"), "Map drag must be throttled through requestAnimationFrame");
assert(script.includes("cachedMaxPanX") && script.includes("cachedMaxPanY"), "Map drag must cache pan bounds instead of reading layout on every pointer move");
assert(!script.includes("dom.mapCanvas.style.transform = `scale(${zoom})`;"), "Map zoom must not enlarge a cached composited bitmap");
assert(!styles.includes(".map-canvas { position: absolute; inset: 0; transform-origin:"), "Map canvas must not advertise a composited scale transform");
assert(!styles.includes("landmark-label"), "Landmark map labels must not have runtime CSS");
assert(!html.includes("landmark labels appear"), "Map helper copy must not promise hidden landmark labels");
assert(styles.includes(".map-canvas.is-detail-zoom .runtime-plot-asset"), "Development building assets must appear from the detail zoom gate");
assert(styles.includes("font-size: 32px"), "Purchasable plot price marks must use the owner-approved half-size label");
assert(styles.includes("stroke-width: 6px"), "Purchasable plot price mark stroke must scale with the half-size label");
assert(styles.includes(".plot-fill { fill: #2ab799; fill-opacity: .82; stroke: #735e59; stroke-width: 1.5px;"), "Purchasable plot fill stroke must be reduced to half of the previous M1W width");
assert(styles.includes(".plot-outline-outer { stroke: #f6d9a6; stroke-width: 3.5px; }"), "Purchasable plot hover outer border must be reduced to half width");
assert(styles.includes(".plot-outline-inner { stroke: #322824; stroke-width: 1px; }"), "Purchasable plot hover inner border must be reduced to half width");
assert(styles.includes(".plot-interaction:focus,\n.plot-interaction:focus-visible { outline: none; }"), "Plot focus must not show the browser default blue outline");
assert(styles.includes(".landmark-entity:hover .landmark-glow"), "Landmark hover must show a separate transparent red glow overlay");
assert(styles.includes(".landmark-entity.is-selected .landmark-glow"), "Landmark selection must lock the separate red glow overlay");
assert(styles.includes(".landmark-glow { opacity: 0; transform-origin: center; transform: scale(1.05); filter: blur(1.1px)"), "Landmark glow mask must be slightly expanded and softened");
assert(script.includes("clearDistrictContextHover(landmark.districtId);"), "Selecting a landmark must clear its district context highlight");
assert(script.includes("active && selectedLandmarkId"), "Selected landmarks must not keep their district context-highlighted");
assert(styles.includes("button.landmark-entity:hover:not(:disabled)") && styles.includes("background: transparent;") && styles.includes("appearance: none;"), "Landmark buttons must override generic button hover backgrounds and outlines");
assert(styles.includes(".map-canvas.is-map-moving .landmark-glow"), "Map dragging must suppress hover glow and outline transitions");
assert(script.includes("landmark-glow") && script.includes("glow/${landmark.id}_glow.png"), "Landmark cards must include generated glow mask assets");
assert(!styles.includes(".landmark-entity.is-selected::after"), "Landmark selection must not draw a full rectangular image-frame border");
assert(!styles.includes(".landmark-entity:hover .landmark-artwork") && !styles.includes("drop-shadow(0 0 14px"), "Landmark glow must not filter the artwork image or restore the broadest image-bound shadow");

console.log(`M1W_STATIC_TEST_PASS districts=${expectedDistricts.length} map_sha=${sha256(mapBase).slice(0, 12)} brand_sha=${sha256(brand).slice(0, 12)}`);

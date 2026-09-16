"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const webRoot = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(webRoot, "u1_layout.html"), "utf8");
const css = fs.readFileSync(path.join(webRoot, "u1_layout.css"), "utf8");
const js = fs.readFileSync(path.join(webRoot, "u1_layout.js"), "utf8");
const app = fs.readFileSync(path.join(webRoot, "app.js"), "utf8");

for (const file of ["u1_layout.html", "u1_layout.css", "u1_layout.js"]) {
  assert(fs.existsSync(path.join(webRoot, file)), `Missing U1 file: ${file}`);
}

for (const id of [
  "u1-cash-income-value", "u1-debt-value", "u1-turn-value",
  "cash-value", "debt-value", "turn-value", "u1-date-value", "ap-value", "end-turn-button",
  "map-stage", "map-anchor", "map-canvas", "map-base", "district-overlay", "plot-overlay",
  "plot-mark-layer", "landmark-layer", "entity-file-title", "property-details", "landmark-details",
  "buy-button", "build-button", "redevelop-button", "sell-property-button", "stock-list",
  "borrow-button", "repay-button", "news-list", "market-brief",
]) {
  assert(html.includes(`id="${id}"`), `U1 layout missing DOM id: ${id}`);
}

for (const tab of ["brief", "bank", "auction", "stocks"]) {
  assert(html.includes(`data-operations-tab="${tab}"`), `U1 layout missing rail/panel tab: ${tab}`);
  assert(html.includes(`data-operations-page="${tab}"`), `U1 layout missing operations page: ${tab}`);
}

assert(!html.includes("Investment<br>Advice"), "U1 layout must not expose the old advice tab");
assert(html.includes("u1_layout.css?v=u1-1"), "U1 layout must load its dedicated stylesheet");
assert(html.includes("u1_layout.js?v=u1-1"), "U1 layout must load its dedicated script");
assert(html.includes("app.js?v=u1-1"), "U1 layout must run the migrated game logic");
assert(css.includes("grid-template-columns: 68px minmax(300px, 440px)"), "U1 layout must use left rail + portfolio + map + detail columns");
assert(css.includes(".u1-news-stack"), "News must render as floating map notifications");
assert(css.includes("body.u1-layout.u1-portfolio-closed"), "Portfolio panel must be closable");
assert(js.includes("function u1CurrentIncome(state)"), "U1 HUD must derive income from current game state");
assert(js.includes('document.getElementById("u1-cash-income-value")'), "U1 HUD must render to its own cash/income node");
assert(js.includes("cashNode.replaceChildren"), "U1 HUD must render cash and income in one field");
assert(app.includes('window.dispatchEvent(new CustomEvent("m1w:render"'), "App render must notify U1 HUD after state changes");
assert(fs.existsSync(path.join(webRoot, "assets", "new ui", "01_plain_panel_2x.png")), "U1 panel artwork must be available");

console.log("U1_LAYOUT_STATIC_TEST_PASS");

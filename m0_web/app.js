"use strict";

const MAX_TURN = 8;
const SAVE_KEY = "metropolis_roaring_times_m1w_unified_save_v3";
const LEGACY_SAVE_KEYS = [
  "metropolis_roaring_times_m01_save_v2",
  "metropolis_roaring_times_m01_save_zh_cn_v1",
  "roaring_times_m0_web_save_v1",
];
const t = (key, values = {}) => window.M1WI18n.t(key, values);
const locale = () => window.M1WI18n.getLocale();
const HOME_LANGUAGE_NAMES = { "en-US": "English", "zh-CN": "中文（简体）" };

const RIVALS = {
  tycoon: { name: "Tycoon", style: "Industry & transport", preferredPlots: ["hk_01", "mt_01"], building: "factory", reserve: 8000, security: "industrial_shares" },
  landlady: { name: "Landlady", style: "Residential income", preferredPlots: ["cp_01", "les_01"], building: "standard_apartment", reserve: 12000, security: "municipal_bonds" },
  shark: { name: "Shark", style: "Cheap land & liquidity", preferredPlots: ["bb_01", "hk_02"], building: "department_store", reserve: 26000, security: "investment_trust" },
};

const BUILDINGS = {
  standard_apartment: { name: "Standard Apartment", short: "APT", cost: 8000, gross: 1400, maintenance: 200 },
  factory: { name: "Factory", short: "FAC", cost: 15000, gross: 2900, maintenance: 500 },
  luxury_apartment: { name: "Luxury Apartment", short: "LUX", cost: 25000, gross: 3800, maintenance: 800 },
  department_store: { name: "Department Store", short: "STORE", cost: 30000, gross: 5200, maintenance: 1000 },
};

const SECURITIES = {
  municipal_bonds: { name: "Municipal & Railroad Bonds", ticker: "BONDS", risk: "Low", opens: 1, prices: [100, 101, 101, 100, 99, 98, 99, 100] },
  industrial_shares: { name: "Industrial Shares Basket", ticker: "IND", risk: "Medium–High", opens: 1, prices: [100, 103, 108, 116, 122, 112, 87, 80] },
  investment_trust: { name: "Metropolitan Investment Trust", ticker: "TRUST", risk: "High", opens: 3, prices: [null, null, 100, 112, 126, 105, 72, 65] },
};

const NEWS_ITEMS = [
  { turn: 1, type: "Fictional", sourceKey: "news.source.metropolitan_ledger", headlineKey: "news.headline.turn_1" },
  { turn: 2, type: "Historical", sourceKey: "news.source.federal_reserve", headlineKey: "news.headline.turn_2" },
  { turn: 3, type: "Fictional", sourceKey: "news.source.five_borough_gazette", headlineKey: "news.headline.turn_3" },
  { turn: 4, type: "Rumor", sourceKey: "news.source.state_sources", headlineKey: "news.headline.turn_4" },
  { turn: 5, type: "Rumor", sourceKey: "news.source.state_sources", headlineKey: "news.headline.turn_5" },
  { turn: 6, type: "Fictional", sourceKey: "news.source.metropolitan_ledger", headlineKey: "news.headline.turn_6" },
  { turn: 7, type: "Historical", sourceKey: "news.source.federal_reserve", headlineKey: "news.headline.turn_7" },
];

const DISTRICTS = [
  { id: "district_inwood", name: "Inwood", label: ["INWOOD"], location: "Northern Manhattan", note: "The northernmost approved district in the M1W map." },
  { id: "district_washington_heights", name: "Washington Heights", label: ["WASHINGTON", "HEIGHTS"], location: "Upper northern Manhattan", note: "Owner-authored geometry between Inwood and Harlem." },
  { id: "district_harlem", name: "Harlem", label: ["HARLEM"], location: "Upper Manhattan", note: "The approved cross-island district north of Central Park." },
  { id: "district_upper_east", name: "Upper East Side", label: ["UPPER EAST", "SIDE"], location: "East of Central Park", note: "The approved district on Central Park’s eastern side." },
  { id: "district_upper_west", name: "Upper West Side", label: ["UPPER WEST", "SIDE"], location: "West of Central Park", note: "The approved district on Central Park’s western side." },
  { id: "district_midtown_west", name: "Midtown West", label: ["MIDTOWN", "WEST"], location: "Western Midtown", note: "The approved western half of the Midtown map area." },
  { id: "district_midtown_east", name: "Midtown East", label: ["MIDTOWN", "EAST"], location: "Eastern Midtown", note: "The approved eastern half of the Midtown map area." },
  { id: "district_chelsea", name: "Chelsea", label: ["CHELSEA"], location: "West Side, south of Midtown", note: "Owner-approved Figma vector network; M1W verifies its real browser hit area without redrawing it." },
  { id: "district_west_village", name: "West Village", label: ["WEST", "VILLAGE"], location: "Lower West Side", note: "The approved western Village district in the M1W map." },
  { id: "district_east_village", name: "East Village", label: ["EAST", "VILLAGE"], location: "Lower East Side", note: "The approved eastern Village district in the M1W map." },
  { id: "district_soho", name: "SoHo", label: ["SOHO"], location: "Lower Manhattan", note: "The approved district immediately north of Financial District." },
  { id: "district_financial_district", name: "Financial District", label: ["FINANCIAL", "DISTRICT"], location: "Southern Manhattan", note: "The southernmost approved playable district in the M1W map." },
];

const MAP_ZOOM_FACTOR = 1.25;
const MAP_MAX_ZOOM_STEP = 5;
const MAP_PAN_KEY_STEP = 38;

const PLOT_BLUEPRINTS = [
  { id: "cp_01", name: "Riverside Heights", district: "Unmapped M0 Fixture", zone: "Residential", price: 21000, x: 35, y: 8, w: 14, h: 9, shape: "polygon(6% 9%, 91% 0, 100% 89%, 12% 100%)" },
  { id: "cp_02", name: "Museum Row", district: "Unmapped M0 Fixture", zone: "Residential", price: 23000, x: 50, y: 8, w: 14, h: 9, shape: "polygon(0 0, 92% 7%, 100% 100%, 8% 91%)" },
  { id: "cp_public", name: "Central Park", district: "Unmapped M0 Fixture", zone: "Public", price: 0, x: 41, y: 18, w: 19, h: 13, owner: "government", shape: "polygon(10% 0, 93% 8%, 100% 90%, 0 100%)" },
  { id: "uw_01", name: "West End Blocks", district: "Unmapped M0 Fixture", zone: "Residential", price: 15000, x: 30, y: 24, w: 11, h: 10, shape: "polygon(8% 0, 100% 8%, 92% 100%, 0 89%)" },
  { id: "ue_01", name: "East Side Court", district: "Unmapped M0 Fixture", zone: "Residential", price: 17000, x: 60, y: 24, w: 11, h: 10, shape: "polygon(0 7%, 88% 0, 100% 92%, 9% 100%)" },
  { id: "mt_01", name: "Garment Square", district: "Unmapped M0 Fixture", zone: "Business", price: 15000, x: 35, y: 36, w: 14, h: 10, shape: "polygon(0 7%, 93% 0, 100% 88%, 8% 100%)" },
  { id: "mt_02", name: "Grand Avenue", district: "Unmapped M0 Fixture", zone: "Business", price: 24000, x: 50, y: 36, w: 15, h: 10, shape: "polygon(7% 0, 100% 9%, 92% 100%, 0 89%)" },
  { id: "hk_01", name: "Rail Yard West", district: "Unmapped M0 Fixture", zone: "Unrestricted", price: 9000, x: 27, y: 48, w: 14, h: 10, shape: "polygon(12% 0, 100% 8%, 88% 100%, 0 91%)" },
  { id: "mt_03", name: "Herald Blocks", district: "Unmapped M0 Fixture", zone: "Business", price: 16000, x: 43, y: 48, w: 14, h: 10, shape: "polygon(0 8%, 90% 0, 100% 91%, 8% 100%)" },
  { id: "les_01", name: "Orchard Courts", district: "Unmapped M0 Fixture", zone: "Residential", price: 11000, x: 58, y: 48, w: 14, h: 10, shape: "polygon(8% 0, 100% 10%, 91% 100%, 0 88%)" },
  { id: "hk_02", name: "Foundry Lane", district: "Unmapped M0 Fixture", zone: "Unrestricted", price: 7000, x: 29, y: 60, w: 13, h: 10, shape: "polygon(0 6%, 90% 0, 100% 90%, 10% 100%)" },
  { id: "les_02", name: "Essex Market", district: "Unmapped M0 Fixture", zone: "Business", price: 12000, x: 57, y: 60, w: 14, h: 10, shape: "polygon(9% 0, 100% 7%, 90% 100%, 0 92%)" },
  { id: "lm_01", name: "Civic Exchange", district: "Unmapped M0 Fixture", zone: "Business", price: 18000, x: 37, y: 70, w: 14, h: 9, shape: "polygon(0 9%, 92% 0, 100% 91%, 7% 100%)" },
  { id: "lm_public", name: "City Hall", district: "Unmapped M0 Fixture", zone: "Public", price: 0, x: 52, y: 70, w: 12, h: 9, owner: "government", shape: "polygon(8% 0, 100% 8%, 91% 100%, 0 90%)" },
  { id: "lm_02", name: "Wall Street Corner", district: "Unmapped M0 Fixture", zone: "Business", price: 26000, x: 39, y: 81, w: 13, h: 9, shape: "polygon(0 5%, 91% 0, 100% 87%, 10% 100%)" },
  { id: "lm_03", name: "Battery Warehouses", district: "Unmapped M0 Fixture", zone: "Unrestricted", price: 14000, x: 49, y: 88, w: 12, h: 8, shape: "polygon(10% 0, 100% 12%, 88% 100%, 0 86%)" },
  { id: "bb_01", name: "Bridge Landing", district: "Unmapped M0 Fixture", zone: "Unrestricted", price: 6000, x: 76, y: 75, w: 13, h: 10, shape: "polygon(0 11%, 90% 0, 100% 89%, 9% 100%)" },
  { id: "bb_02", name: "Dockside Lots", district: "Unmapped M0 Fixture", zone: "Business", price: 8000, x: 80, y: 87, w: 13, h: 9, shape: "polygon(8% 0, 100% 9%, 92% 100%, 0 88%)" },
];

const dom = {};
let state = null;
let busy = false;
let toastTimer = null;
let selectedDistrictId = null;
let activeHomePanel = null;
let selectedRivalId = null;

const mapView = {
  loaded: false,
  zoomStep: 0,
  panX: 0,
  panY: 0,
  dragging: false,
  moved: false,
  pointerId: null,
  pointerStartX: 0,
  pointerStartY: 0,
  panStartX: 0,
  panStartY: 0,
  pressedDistrictId: null,
  lastWheelAt: 0,
};

const money = (value) => new Intl.NumberFormat(locale(), { style: "currency", currency: "USD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(Math.round(value));
const compactMoney = (value) => Math.abs(value) >= 1000 ? `$${Math.round(value / 1000)}k` : `$${Math.round(value)}`;
const rivalName = (id) => t(`rival.${id}.name`);
const rivalStyle = (id) => t(`rival.${id}.style`);
const buildingName = (id) => t(`building.${id}.name`);
const buildingShort = (id) => t(`building.${id}.short`);
const securityName = (id) => t(`security.${id}.name`);
const securityRisk = (id) => t(`security.${id}.risk`);
const districtName = (districtOrId) => t(`district.${typeof districtOrId === "string" ? districtOrId : districtOrId.id}.name`);
const districtLabel = (district) => t(`district.${district.id}.label`).split("|");
const districtLocation = (district) => t(`district.${district.id}.location`);
const districtNote = (district) => t(`district.${district.id}.note`);
const plotName = (plotOrId) => {
  const plot = typeof plotOrId === "string" ? PLOT_BLUEPRINTS.find((item) => item.id === plotOrId) : plotOrId;
  return plot ? t(`plot.${plot.id}.name`) : "";
};

function economyForTurn(turn) {
  if (turn <= 2) return { id: "opening", market: 1, income: 1, credit: 100000, rate: 0.0025 };
  if (turn <= 4) return { id: "prosperity", market: 1.12, income: 1.18, credit: 110000, rate: 0.0025 };
  if (turn <= 6) return { id: "overheating", market: 1.22, income: 1.08, credit: 80000, rate: 0.006 };
  return { id: "adjustment", market: 0.9, income: 0.78, credit: 60000, rate: 0.0075 };
}

const blankHoldings = () => Object.fromEntries(Object.keys(SECURITIES).map((id) => [id, 0]));
const securityPriceForTurn = (id, turn) => SECURITIES[id].prices[turn - 1];
const zoningActive = () => Boolean(state && state.turn >= 6);

function clonePlots() {
  return PLOT_BLUEPRINTS.map((plot) => ({ ...plot, owner: plot.owner || "unowned", building: null, invested: 0, salePending: null }));
}

function createInitialState(rivalId) {
  const plots = clonePlots();
  const rivalStarts = { tycoon: ["hk_01", "mt_01"], landlady: ["cp_01", "les_01"], shark: ["bb_01", "hk_02"] };
  let aiCash = 50000;
  for (const id of rivalStarts[rivalId]) {
    const plot = plots.find((item) => item.id === id);
    plot.owner = "ai";
    plot.invested = plot.price;
    aiCash -= plot.price;
  }
  return {
    version: 3, rivalId, turn: 1, ap: 3, cash: 50000, aiCash, loans: [], plots,
    selectedPlotId: null, activeOperationsTab: "brief", finished: false, transactionSequence: 1,
    playerHoldings: blankHoldings(), aiHoldings: blankHoldings(),
    securitiesPrices: Object.fromEntries(Object.keys(SECURITIES).map((id) => [id, securityPriceForTurn(id, 1)])),
    securitiesPreviousPrices: Object.fromEntries(Object.keys(SECURITIES).map((id) => [id, securityPriceForTurn(id, 1)])),
    log: [{ turn: 1, type: "Activity", key: "activity.match_entered", values: { rivalId } }],
  };
}

const getPlot = (id) => state?.plots.find((plot) => plot.id === id) || null;
const currentDebt = () => state ? state.loans.reduce((sum, loan) => sum + loan.principal + loan.interest, 0) : 0;
const outstandingPrincipal = () => state ? state.loans.reduce((sum, loan) => sum + loan.principal, 0) : 0;
const marketPrice = (plot) => Math.round(plot.price * economyForTurn(state?.turn || 1).market);
const plotBuildingValue = (plot) => plot.building ? Math.round(BUILDINGS[plot.building.type].cost * economyForTurn(state.turn).market) : 0;
const propertyMarketValue = (plot) => marketPrice(plot) + plotBuildingValue(plot);

function securitiesValue(owner) {
  if (!state) return 0;
  const holdings = owner === "player" ? state.playerHoldings : state.aiHoldings;
  return Object.keys(SECURITIES).reduce((sum, id) => sum + (holdings[id] || 0) * (state.securitiesPrices[id] || 0), 0);
}

function participantWorth(owner) {
  if (!state) return 0;
  const cash = owner === "player" ? state.cash : state.aiCash;
  const property = state.plots.filter((plot) => plot.owner === owner).reduce((sum, plot) => sum + propertyMarketValue(plot), 0);
  return cash + property + securitiesValue(owner) - (owner === "player" ? currentDebt() : 0);
}

function operationalIncome(plot) {
  if (!plot.building || plot.building.activeTurn > state.turn) return 0;
  const building = BUILDINGS[plot.building.type];
  return Math.round(building.gross * economyForTurn(state.turn).income) - building.maintenance;
}

function setToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => dom.toast.classList.remove("is-visible"), 2200);
}

function addLog(key, values = {}, type = "Activity") {
  state.log.unshift({ turn: state.turn, type, key, values });
  state.log = state.log.slice(0, 30);
}

function localizedEvent(entry) {
  if (!entry.key) return entry.text || "";
  const values = { ...(entry.values || {}) };
  if (values.rivalId) values.rival = rivalName(values.rivalId);
  if (values.plotId) values.plot = plotName(values.plotId);
  if (values.buildingId) values.building = buildingName(values.buildingId);
  if (values.fromBuildingId) values.fromBuilding = buildingName(values.fromBuildingId);
  if (values.toBuildingId) values.toBuilding = buildingName(values.toBuildingId);
  for (const field of ["amount", "fee", "price", "playerIncome", "rivalIncome", "due"]) {
    if (Number.isFinite(values[field])) values[field] = money(values[field]);
  }
  return t(entry.key, values);
}

function withCommitLock(action) {
  if (!state || state.finished || busy) return;
  busy = true;
  try {
    const before = JSON.stringify(state);
    action();
    if (JSON.stringify(state) !== before) state.transactionSequence += 1;
    render();
  } finally {
    window.setTimeout(() => { busy = false; }, 160);
  }
}

function plotMark(plot) {
  if (plot.salePending) return t("plot_mark.sale_pending");
  if (plot.owner === "market") return t("plot_mark.sold");
  if (plot.building) {
    const short = buildingShort(plot.building.type);
    return plot.building.activeTurn > state.turn ? t("plot_mark.building", { building: short }) : short;
  }
  if (plot.owner === "player") return t("plot_mark.player");
  if (plot.owner === "ai") return t("plot_mark.rival");
  if (plot.owner === "government") return t("plot_mark.public");
  return compactMoney(marketPrice(plot));
}

function renderMap() {
  dom.plotLayer.replaceChildren();
  for (const plot of state.plots) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `plot${state.selectedPlotId === plot.id ? " is-selected" : ""}`;
    button.dataset.plotId = plot.id;
    button.dataset.owner = plot.owner;
    Object.assign(button.style, { left: `${plot.x}%`, top: `${plot.y}%`, width: `${plot.w}%`, height: `${plot.h}%` });
    button.style.setProperty("--shape", plot.shape);
    button.setAttribute("aria-label", t("aria.plot", { plot: plotName(plot), owner: t(`owner.${plot.owner}`), building: plot.building ? buildingName(plot.building.type) : t("property.empty_land") }));
    const mark = document.createElement("span");
    mark.className = "plot-mark";
    mark.textContent = plotMark(plot);
    button.append(mark);
    button.addEventListener("click", () => { state.selectedPlotId = plot.id; render(); });
    dom.plotLayer.append(button);
  }
}

const svgNamespace = "http://www.w3.org/2000/svg";
const districtMeta = (id) => DISTRICTS.find((district) => district.id === id) || null;
const currentMapZoom = () => MAP_ZOOM_FACTOR ** mapView.zoomStep;

function clampMapPan() {
  if (!mapView.loaded) return;
  const renderedWidth = dom.mapAnchor.offsetWidth;
  const renderedHeight = dom.mapAnchor.offsetHeight;
  const maxX = Math.max(0, (renderedWidth - dom.mapStage.clientWidth) / 2);
  const maxY = Math.max(0, (renderedHeight - dom.mapStage.clientHeight) / 2);
  mapView.panX = Math.max(-maxX, Math.min(maxX, mapView.panX));
  mapView.panY = Math.max(-maxY, Math.min(maxY, mapView.panY));
}

function applyMapView() {
  if (!mapView.loaded) return;
  const zoom = currentMapZoom();
  // Resize the SVG's layout box instead of scaling a composited layer. Safari
  // otherwise rasterizes the fitted map once and enlarges that bitmap, which
  // makes an intrinsically vector asset look blurred at higher zoom levels.
  dom.mapAnchor.style.height = `${zoom * 100}%`;
  clampMapPan();
  dom.mapAnchor.style.transform = `translate(-50%, -50%) translate3d(${mapView.panX}px, ${mapView.panY}px, 0)`;
  dom.mapZoomValue.value = `${Math.round(zoom * 100)}%`;
  dom.mapZoomOut.disabled = mapView.zoomStep === 0;
  dom.mapZoomIn.disabled = mapView.zoomStep === MAP_MAX_ZOOM_STEP;
}

function setMapZoomStep(nextStep, focusPoint = null) {
  if (!mapView.loaded) return false;
  const clampedStep = Math.max(0, Math.min(MAP_MAX_ZOOM_STEP, nextStep));
  if (clampedStep === mapView.zoomStep) return false;
  const oldZoom = currentMapZoom();
  const rect = dom.mapStage.getBoundingClientRect();
  const focusX = focusPoint ? focusPoint.clientX - rect.left - rect.width / 2 : 0;
  const focusY = focusPoint ? focusPoint.clientY - rect.top - rect.height / 2 : 0;
  mapView.zoomStep = clampedStep;
  const nextZoom = currentMapZoom();
  mapView.panX = focusX - ((focusX - mapView.panX) / oldZoom) * nextZoom;
  mapView.panY = focusY - ((focusY - mapView.panY) / oldZoom) * nextZoom;
  applyMapView();
  return true;
}

function resetMapView() {
  mapView.zoomStep = 0;
  mapView.panX = 0;
  mapView.panY = 0;
  applyMapView();
}

function renderDistrictDetails() {
  const district = districtMeta(selectedDistrictId);
  dom.emptyDistrict.hidden = Boolean(district);
  dom.districtDetails.hidden = !district;
  for (const group of dom.districtOverlay.querySelectorAll("[data-district-id]")) {
    const selected = group.dataset.districtId === selectedDistrictId;
    group.classList.toggle("is-selected", selected);
    group.setAttribute("aria-pressed", String(selected));
  }
  if (!district) {
    dom.mapHint.textContent = t("map.hover_lock");
    return;
  }
  dom.districtCode.textContent = district.id.toUpperCase();
  dom.districtName.textContent = districtName(district);
  dom.districtLocation.textContent = t("district.location_line", { location: districtLocation(district) });
  dom.districtPlots.textContent = t("district.pending_plots");
  dom.districtApartments.textContent = "—";
  dom.districtFactories.textContent = "—";
  dom.districtStores.textContent = "—";
  dom.districtTransit.textContent = t("district.pending_transit");
  dom.districtProsperity.textContent = t("district.pending_prosperity");
  dom.districtNote.textContent = t("district.note_line", { note: districtNote(district) });
  dom.mapHint.textContent = t("map.selection_locked", { district: districtName(district) });
}

function selectDistrict(id) {
  if (!districtMeta(id)) return false;
  selectedDistrictId = id;
  renderDistrictDetails();
  return true;
}

function clearDistrictSelection() {
  selectedDistrictId = null;
  renderDistrictDetails();
}

function refreshDistrictLocalization() {
  if (!mapView.loaded) return;
  const interactionLayer = dom.districtOverlay.querySelector("#district-interaction-layer");
  const labelLayer = dom.districtOverlay.querySelector("#district-label-layer");
  if (!interactionLayer || !labelLayer) return;
  labelLayer.replaceChildren();
  for (const meta of DISTRICTS) {
    const group = interactionLayer.querySelector(`[data-district-id="${meta.id}"]`);
    group.setAttribute("aria-label", t("aria.select_district", { district: districtName(meta) }));
    labelLayer.append(createDistrictLabel(meta, group.getBBox()));
  }
  renderDistrictDetails();
}

function createDistrictPath(sourcePath, className) {
  const path = document.createElementNS(svgNamespace, "path");
  path.setAttribute("class", className);
  for (const attribute of ["d", "fill-rule", "clip-rule", "transform"]) {
    if (sourcePath.hasAttribute(attribute)) path.setAttribute(attribute, sourcePath.getAttribute(attribute));
  }
  return path;
}

function createDistrictLabel(meta, bounds) {
  const text = document.createElementNS(svgNamespace, "text");
  text.setAttribute("class", "district-label-text");
  text.setAttribute("data-label-for", meta.id);
  text.setAttribute("x", String(bounds.x + bounds.width / 2));
  const lineHeight = 170;
  const label = districtLabel(meta);
  const firstY = bounds.y + bounds.height / 2 - ((label.length - 1) * lineHeight) / 2;
  label.forEach((line, index) => {
    const span = document.createElementNS(svgNamespace, "tspan");
    span.setAttribute("x", String(bounds.x + bounds.width / 2));
    span.setAttribute("y", String(firstY + index * lineHeight));
    span.textContent = line;
    text.append(span);
  });
  return text;
}

async function initializeProducerMap() {
  const response = await window.fetch("assets/metropolis_district_geometry.svg", { cache: "no-store" });
  if (!response.ok) throw new Error(`District SVG returned HTTP ${response.status}`);
  const sourceText = await response.text();
  const sourceDocument = new DOMParser().parseFromString(sourceText, "image/svg+xml");
  if (sourceDocument.querySelector("parsererror")) throw new Error("District SVG could not be parsed");

  dom.districtOverlay.replaceChildren();
  const interactionLayer = document.createElementNS(svgNamespace, "g");
  interactionLayer.setAttribute("id", "district-interaction-layer");
  dom.districtOverlay.append(interactionLayer);

  for (const meta of DISTRICTS) {
    const sourceGroup = sourceDocument.getElementById(meta.id);
    if (!sourceGroup) throw new Error(`Missing district geometry: ${meta.id}`);
    const sourcePaths = [...sourceGroup.querySelectorAll("path")];
    if (!sourcePaths.length) throw new Error(`District has no vector paths: ${meta.id}`);

    const group = document.createElementNS(svgNamespace, "g");
    group.setAttribute("class", "district-interaction");
    group.setAttribute("data-district-id", meta.id);
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", t("aria.select_district", { district: districtName(meta) }));
    group.setAttribute("aria-pressed", "false");

    for (const sourcePath of sourcePaths) group.append(createDistrictPath(sourcePath, "district-hit"));
    for (const sourcePath of sourcePaths) group.append(createDistrictPath(sourcePath, "district-outline-outer"));
    for (const sourcePath of sourcePaths) group.append(createDistrictPath(sourcePath, "district-outline-inner"));

    group.addEventListener("pointerenter", () => { dom.mapHint.textContent = t("map.open_file", { district: districtName(meta) }); });
    group.addEventListener("pointerleave", () => {
      const selected = districtMeta(selectedDistrictId);
      dom.mapHint.textContent = selected ? t("map.selection_locked", { district: districtName(selected) }) : t("map.hover_lock");
    });
    group.addEventListener("focus", () => { dom.mapHint.textContent = t("map.press_enter", { district: districtName(meta) }); });
    group.addEventListener("keydown", (event) => {
      if (["Enter", " "].includes(event.key)) {
        event.preventDefault();
        selectDistrict(meta.id);
      }
    });
    interactionLayer.append(group);
  }

  const labelLayer = document.createElementNS(svgNamespace, "g");
  labelLayer.setAttribute("id", "district-label-layer");
  for (const meta of DISTRICTS) {
    const group = interactionLayer.querySelector(`[data-district-id="${meta.id}"]`);
    labelLayer.append(createDistrictLabel(meta, group.getBBox()));
  }
  dom.districtOverlay.append(labelLayer);

  mapView.loaded = true;
  dom.mapAnchor.removeAttribute("aria-hidden");
  dom.mapLoading.hidden = true;
  dom.mapStatus.textContent = t("map.status", { count: DISTRICTS.length });
  dom.mapHint.textContent = t("map.hover_lock");
  applyMapView();
}

function failProducerMap(error) {
  console.error(error);
  dom.mapLoading.hidden = false;
  dom.mapLoading.classList.add("is-error");
  dom.mapLoading.textContent = t("map.load_error");
  dom.mapStatus.textContent = t("map.load_failed");
  dom.mapHint.textContent = t("map.unavailable");
}

function mapPointerDown(event) {
  if (!mapView.loaded || event.button !== 0) return;
  const district = event.target.closest?.("[data-district-id]");
  mapView.dragging = true;
  mapView.moved = false;
  mapView.pointerId = event.pointerId;
  mapView.pointerStartX = event.clientX;
  mapView.pointerStartY = event.clientY;
  mapView.panStartX = mapView.panX;
  mapView.panStartY = mapView.panY;
  mapView.pressedDistrictId = district?.dataset.districtId || null;
  dom.mapStage.classList.add("is-dragging");
  dom.mapStage.setPointerCapture(event.pointerId);
}

function mapPointerMove(event) {
  if (!mapView.dragging || event.pointerId !== mapView.pointerId) return;
  const dx = event.clientX - mapView.pointerStartX;
  const dy = event.clientY - mapView.pointerStartY;
  if (Math.hypot(dx, dy) > 4) mapView.moved = true;
  mapView.panX = mapView.panStartX + dx;
  mapView.panY = mapView.panStartY + dy;
  applyMapView();
}

function mapPointerEnd(event) {
  if (!mapView.dragging || event.pointerId !== mapView.pointerId) return;
  if (!mapView.moved && mapView.pressedDistrictId) selectDistrict(mapView.pressedDistrictId);
  mapView.dragging = false;
  mapView.pointerId = null;
  mapView.pressedDistrictId = null;
  dom.mapStage.classList.remove("is-dragging");
  if (dom.mapStage.hasPointerCapture(event.pointerId)) dom.mapStage.releasePointerCapture(event.pointerId);
}

function mapWheel(event) {
  if (!mapView.loaded) return;
  event.preventDefault();
  const now = performance.now();
  if (now - mapView.lastWheelAt < 120) return;
  mapView.lastWheelAt = now;
  setMapZoomStep(mapView.zoomStep + (event.deltaY < 0 ? 1 : -1), event);
}

function mapKeydown(event) {
  if (!mapView.loaded) return;
  if (["+", "="].includes(event.key)) { event.preventDefault(); setMapZoomStep(mapView.zoomStep + 1); return; }
  if (["-", "_"].includes(event.key)) { event.preventDefault(); setMapZoomStep(mapView.zoomStep - 1); return; }
  if (event.key === "0") { event.preventDefault(); resetMapView(); return; }
  const directions = { ArrowLeft: [MAP_PAN_KEY_STEP, 0], ArrowRight: [-MAP_PAN_KEY_STEP, 0], ArrowUp: [0, MAP_PAN_KEY_STEP], ArrowDown: [0, -MAP_PAN_KEY_STEP] };
  if (!directions[event.key]) return;
  event.preventDefault();
  mapView.panX += directions[event.key][0];
  mapView.panY += directions[event.key][1];
  applyMapView();
}

function zoningReason(plot, buildingId) {
  if (zoningActive() && plot.zone === "Residential" && ["factory", "department_store"].includes(buildingId)) {
    return t("reason.zoning_block");
  }
  return "";
}

function buildingLegality(plot, buildingId) {
  if (!plot || plot.owner !== "player") return t("reason.own_empty_plot");
  if (plot.salePending) return t("reason.sale_pending");
  if (plot.building) return t("reason.already_built");
  if (state.ap < 1) return t("reason.no_ap");
  if (state.cash < BUILDINGS[buildingId].cost) return t("reason.need_cash", { amount: money(BUILDINGS[buildingId].cost) });
  return zoningReason(plot, buildingId);
}

function redevelopmentCost(plot, buildingId) {
  return Math.max(0, BUILDINGS[buildingId].cost - Math.round(BUILDINGS[plot.building.type].cost * 1.2));
}

function redevelopmentOptions(plot) {
  if (!plot?.building) return [];
  const oldCost = BUILDINGS[plot.building.type].cost;
  return Object.entries(BUILDINGS).filter(([, building]) => building.cost > oldCost);
}

function redevelopmentLegality(plot, buildingId) {
  if (!plot || plot.owner !== "player" || !plot.building) return t("reason.own_developed_property");
  if (plot.salePending) return t("reason.sale_pending");
  if (!redevelopmentOptions(plot).some(([id]) => id === buildingId)) return t("reason.higher_cost_only");
  if (state.ap < 1) return t("reason.no_ap");
  const cost = redevelopmentCost(plot, buildingId);
  if (state.cash < cost) return t("reason.need_cash", { amount: money(cost) });
  return zoningReason(plot, buildingId);
}

function selectedActionReason(plot) {
  if (!plot) return t("reason.select_plot");
  if (plot.salePending) return t("reason.sale_settlement", { amount: money(plot.salePending.price), turn: plot.salePending.settleTurn });
  if (plot.owner === "government") return t("reason.public_unavailable");
  if (plot.owner === "market") return t("reason.left_market");
  if (plot.owner === "ai") return t("reason.rival_property");
  if (plot.owner === "unowned" && state.ap < 1) return t("reason.no_ap");
  if (plot.owner === "unowned" && state.cash < marketPrice(plot)) return t("reason.insufficient_cash");
  if (plot.owner === "player" && plot.building?.activeTurn > state.turn) return t("reason.operational_next_turn");
  return "";
}

function renderProperty() {
  const plot = getPlot(state.selectedPlotId);
  dom.emptyProperty.hidden = Boolean(plot);
  dom.propertyDetails.hidden = !plot;
  if (!plot) return;

  dom.plotCode.textContent = plot.id.toUpperCase();
  dom.plotName.textContent = plotName(plot);
  dom.plotDistrict.textContent = t("plot.unmapped_fixture");
  dom.plotZone.textContent = t(`zone.${plot.zone.toLowerCase()}`);
  dom.plotOwner.textContent = plot.owner === "ai" ? rivalName(state.rivalId) : t(`owner.${plot.owner}`);
  dom.plotPrice.textContent = plot.owner === "government" ? t("property.not_for_sale") : money(propertyMarketValue(plot));
  dom.plotBuilding.textContent = plot.building ? `${buildingName(plot.building.type)}${plot.building.activeTurn > state.turn ? t("property.building_suffix") : ""}` : t("property.empty_land");
  dom.plotIncome.textContent = plot.owner === "market" ? t("property.not_collected") : plot.building ? t("property.income_per_turn", { amount: money(operationalIncome(plot)) }) : "—";

  dom.buyButton.hidden = plot.owner !== "unowned";
  dom.buyButton.disabled = plot.owner !== "unowned" || state.ap < 1 || state.cash < marketPrice(plot);
  dom.buyButton.textContent = t("property.buy_plot", { amount: money(marketPrice(plot)) });

  dom.buildSection.hidden = plot.owner !== "player" || Boolean(plot.building) || Boolean(plot.salePending);
  dom.buildButton.disabled = Boolean(buildingLegality(plot, dom.buildingSelect.value));

  const options = redevelopmentOptions(plot);
  dom.redevelopSection.hidden = plot.owner !== "player" || !plot.building || options.length === 0 || Boolean(plot.salePending);
  if (!dom.redevelopSection.hidden) {
    const selected = dom.redevelopSelect.value;
    dom.redevelopSelect.replaceChildren(...options.map(([id, building]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = t("property.redevelop_option", { building: buildingName(id), amount: money(redevelopmentCost(plot, id)) });
      return option;
    }));
    if (options.some(([id]) => id === selected)) dom.redevelopSelect.value = selected;
    const buildingId = dom.redevelopSelect.value;
    const old = BUILDINGS[plot.building.type];
    dom.redevelopPreview.textContent = t("property.redevelop_preview", { newCost: money(BUILDINGS[buildingId].cost), credit: money(old.cost * 1.2), amount: money(redevelopmentCost(plot, buildingId)) });
    dom.redevelopButton.disabled = Boolean(redevelopmentLegality(plot, buildingId));
  }

  dom.saleSection.hidden = plot.owner !== "player" || Boolean(plot.salePending);
  if (!dom.saleSection.hidden) {
    const salePrice = Math.round(propertyMarketValue(plot) * 0.9);
    dom.salePreview.textContent = state.turn >= MAX_TURN ? t("property.sale_final_turn") : t("property.sale_preview", { amount: money(salePrice) });
    dom.sellPropertyButton.disabled = state.ap < 1 || state.turn >= MAX_TURN;
  }

  let reason = selectedActionReason(plot);
  if (plot.owner === "player" && !plot.building && !plot.salePending) reason = buildingLegality(plot, dom.buildingSelect.value);
  if (plot.owner === "player" && plot.building && options.length && !plot.salePending) reason = redevelopmentLegality(plot, dom.redevelopSelect.value);
  dom.propertyReason.textContent = reason;
}

function renderBuildingSelectLabels() {
  const selected = dom.buildingSelect.value;
  for (const option of dom.buildingSelect.options) {
    const building = BUILDINGS[option.value];
    if (building) option.textContent = `${buildingName(option.value)} — ${money(building.cost)}`;
  }
  if ([...dom.buildingSelect.options].some((option) => option.value === selected)) dom.buildingSelect.value = selected;
}

function rivalCondition() {
  const worth = participantWorth("ai");
  if (state.aiCash < 8000) return t("rival_condition.cash_strained");
  if (worth > participantWorth("player") * 1.12) return t("rival_condition.confident");
  if (worth < participantWorth("player") * 0.88) return t("rival_condition.pressured");
  return t("rival_condition.steady");
}

function cityMessage() {
  if (state.turn === 4) return { warning: true, text: t("market_message.turn_4") };
  if (state.turn === 5) return { warning: true, text: t("market_message.turn_5") };
  if (state.turn >= 6) return { warning: true, text: t("market_message.zoning_active") };
  if (economyForTurn(state.turn).id === "prosperity") return { warning: false, text: t("market_message.prosperity") };
  return { warning: false, text: t("market_message.opening") };
}

function renderNews() {
  dom.newsList.replaceChildren();
  const records = [
    ...NEWS_ITEMS.filter((item) => item.turn <= state.turn).map((item) => ({ ...item, source: t(item.sourceKey), text: t(item.headlineKey) })),
    ...state.log.map((entry) => ({ turn: entry.turn, type: entry.type || "Activity", source: t("news.source.operations_desk"), text: localizedEvent(entry) })),
  ].sort((a, b) => b.turn - a.turn).slice(0, 18);
  for (const record of records) {
    const item = document.createElement("li");
    item.className = "news-item";
    const top = document.createElement("div");
    top.className = "news-meta";
    const badge = document.createElement("span");
    badge.className = `news-badge news-badge--${record.type.toLowerCase()}`;
    badge.textContent = t(`news.type.${record.type.toLowerCase()}`);
    const source = document.createElement("span");
    source.textContent = t("news.meta", { turn: record.turn, source: record.source });
    const copy = document.createElement("p");
    copy.textContent = record.text;
    top.append(badge, source);
    item.append(top, copy);
    dom.newsList.append(item);
  }
}

function renderLoanBook() {
  dom.loanList.replaceChildren();
  if (!state.loans.length) {
    const item = document.createElement("li");
    item.textContent = t("bank.no_loans");
    dom.loanList.append(item);
    return;
  }
  for (const loan of state.loans) {
    const item = document.createElement("li");
    item.textContent = t("bank.loan_due", { amount: money(loan.principal + loan.interest), turn: loan.dueTurn });
    dom.loanList.append(item);
  }
}

function renderStocks() {
  dom.stockList.replaceChildren();
  for (const [id, security] of Object.entries(SECURITIES)) {
    const available = state.turn >= security.opens;
    const price = state.securitiesPrices[id];
    const previous = state.securitiesPreviousPrices[id];
    const change = available && previous ? ((price - previous) / previous) * 100 : 0;
    const holdingValue = (state.playerHoldings[id] || 0) * (price || 0);
    const card = document.createElement("article");
    card.className = "stock-card";
    const summary = document.createElement("div");
    summary.className = "stock-summary";
    summary.innerHTML = `<div><strong>${security.ticker}</strong><span>${securityName(id)}</span></div><div class="stock-price"><strong>${available ? money(price) : t("stock.locked")}</strong><span>${available ? t("stock.change", { change: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%` }) : t("stock.opens_prosperity")}</span></div>`;
    const facts = document.createElement("p");
    facts.textContent = t("stock.facts", { risk: securityRisk(id), amount: money(holdingValue) });
    const actions = document.createElement("div");
    actions.className = "stock-actions";
    for (const side of ["buy", "sell"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.securityId = id;
      button.dataset.tradeSide = side;
      button.textContent = t(`stock.${side}`);
      const amount = Number(dom.stockOrderAmount.value) || 0;
      button.disabled = !available || state.ap < 1 || (side === "buy" ? state.cash < amount * 1.01 : holdingValue + 0.01 < amount);
      actions.append(button);
    }
    card.append(summary, facts, actions);
    dom.stockList.append(card);
  }
}

function renderOperations() {
  for (const button of dom.operationsTabs) {
    const active = button.dataset.operationsTab === state.activeOperationsTab;
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  }
  for (const page of dom.operationsPages) page.hidden = page.dataset.operationsPage !== state.activeOperationsTab;
  const economy = economyForTurn(state.turn);
  dom.rivalName.textContent = rivalName(state.rivalId);
  dom.rivalStyle.textContent = rivalStyle(state.rivalId);
  dom.rivalCondition.textContent = rivalCondition();
  dom.rivalWorth.textContent = money(participantWorth("ai"));
  dom.lawStatus.textContent = zoningActive() ? t("law.active") : state.turn >= 4 ? t("law.review") : t("law.none");
  const message = cityMessage();
  dom.marketBrief.classList.toggle("is-warning", message.warning);
  dom.marketBrief.querySelector("p").textContent = message.text;
  dom.bankCredit.textContent = money(Math.max(0, economy.credit - outstandingPrincipal()));
  dom.bankRate.textContent = t("bank.rate", { rate: (economy.rate * 100).toFixed(2) });
  renderNews();
  renderLoanBook();
  renderStocks();
}

function renderStatus() {
  const economy = economyForTurn(state.turn);
  dom.turnValue.textContent = `${state.turn} / ${MAX_TURN}`;
  dom.economyValue.textContent = t(`economy.${economy.id}`);
  dom.cashValue.textContent = money(state.cash);
  dom.debtValue.textContent = money(currentDebt());
  dom.creditValue.textContent = money(Math.max(0, economy.credit - outstandingPrincipal()));
  dom.worthValue.textContent = money(participantWorth("player"));
  dom.apValue.textContent = `${state.ap} / 3`;
  dom.turnPrompt.textContent = state.ap > 0 ? t("status.ap_available", { ap: state.ap }) : t("status.ready_settle");
  dom.endTurnButton.disabled = state.finished;
  dom.borrowButton.disabled = Math.max(0, economy.credit - outstandingPrincipal()) < 10000;
  dom.repayButton.disabled = currentDebt() <= 0 || state.cash <= 0;
  dom.loadButton.disabled = !hasAnySave();
}

function render() {
  if (!state) return;
  renderStatus();
  renderOperations();
  renderMap();
  renderProperty();
}

function buySelectedPlot() {
  withCommitLock(() => {
    const plot = getPlot(state.selectedPlotId);
    if (!plot || plot.owner !== "unowned" || state.ap < 1 || state.cash < marketPrice(plot)) return;
    const price = marketPrice(plot);
    if (!window.confirm(t("confirm.buy_plot", { plot: plotName(plot), amount: money(price) }))) return;
    state.cash -= price;
    state.ap -= 1;
    plot.owner = "player";
    plot.invested = price;
    addLog("activity.property_purchased", { plotId: plot.id, price });
    setToast(t("toast.property_acquired"));
  });
}

function buildSelectedPlot() {
  withCommitLock(() => {
    const plot = getPlot(state.selectedPlotId);
    const buildingId = dom.buildingSelect.value;
    const reason = buildingLegality(plot, buildingId);
    if (reason) { setToast(reason); return; }
    const building = BUILDINGS[buildingId];
    if (!window.confirm(t("confirm.build", { building: buildingName(buildingId), amount: money(building.cost) }))) return;
    state.cash -= building.cost;
    state.ap -= 1;
    plot.invested += building.cost;
    plot.building = { type: buildingId, activeTurn: state.turn + 1 };
    addLog("activity.construction_started", { plotId: plot.id, buildingId });
    setToast(t("toast.construction_started"));
  });
}

function redevelopSelectedPlot(buildingId = dom.redevelopSelect.value) {
  let result = false;
  withCommitLock(() => {
    const plot = getPlot(state.selectedPlotId);
    const reason = redevelopmentLegality(plot, buildingId);
    if (reason) { setToast(reason); return; }
    const old = BUILDINGS[plot.building.type];
    const next = BUILDINGS[buildingId];
    const cost = redevelopmentCost(plot, buildingId);
    if (!window.confirm(t("confirm.redevelop", { fromBuilding: buildingName(plot.building.type), toBuilding: buildingName(buildingId), amount: money(cost) }))) return;
    const fromBuildingId = plot.building.type;
    state.cash -= cost;
    state.ap -= 1;
    plot.invested = plot.invested - old.cost + next.cost;
    plot.building = { type: buildingId, activeTurn: state.turn + 1 };
    addLog("activity.redeveloped", { plotId: plot.id, fromBuildingId, toBuildingId: buildingId, amount: cost });
    setToast(t("toast.redevelopment_started"));
    result = true;
  });
  return result;
}

function sellSelectedProperty() {
  let result = false;
  withCommitLock(() => {
    const plot = getPlot(state.selectedPlotId);
    if (!plot || plot.owner !== "player" || plot.salePending || state.ap < 1 || state.turn >= MAX_TURN) return;
    const price = Math.round(propertyMarketValue(plot) * 0.9);
    if (!window.confirm(t("confirm.brokered_sale", { plot: plotName(plot), amount: money(price) }))) return;
    state.ap -= 1;
    plot.salePending = { price, settleTurn: state.turn + 1 };
    addLog("activity.sale_locked", { plotId: plot.id, price });
    setToast(t("toast.sale_locked"));
    result = true;
  });
  return result;
}

function normalizeOrderAmount() {
  const amount = Math.round(Number(dom.stockOrderAmount.value));
  if (!Number.isFinite(amount) || amount < 1000 || amount % 1000 !== 0) return null;
  return amount;
}

function tradeSecurity(id, side) {
  let result = false;
  withCommitLock(() => {
    const security = SECURITIES[id];
    const amount = normalizeOrderAmount();
    if (!security || !["buy", "sell"].includes(side) || !amount) { setToast(t("toast.invalid_order")); return; }
    if (state.turn < security.opens) { setToast(t("toast.instrument_unavailable")); return; }
    if (state.ap < 1) { setToast(t("reason.no_ap")); return; }
    const fee = Math.round(amount * 0.01);
    const price = state.securitiesPrices[id];
    const units = amount / price;
    if (side === "buy") {
      if (state.cash < amount + fee) { setToast(t("toast.order_cash")); return; }
      if (!window.confirm(t("confirm.stock_buy", { amount: money(amount), ticker: security.ticker, fee: money(fee) }))) return;
      state.cash -= amount + fee;
      state.playerHoldings[id] += units;
    } else {
      if ((state.playerHoldings[id] || 0) * price + 0.01 < amount) { setToast(t("toast.order_holding")); return; }
      if (!window.confirm(t("confirm.stock_sell", { amount: money(amount), ticker: security.ticker, fee: money(fee) }))) return;
      state.cash += amount - fee;
      state.playerHoldings[id] = Math.max(0, state.playerHoldings[id] - units);
    }
    state.ap -= 1;
    addLog(`activity.stock_${side}`, { amount, ticker: security.ticker, fee });
    setToast(t(`toast.stock_${side}_completed`));
    result = true;
  });
  return result;
}

function borrowMoney() {
  withCommitLock(() => {
    const economy = economyForTurn(state.turn);
    if (economy.credit - outstandingPrincipal() < 10000) return;
    if (!window.confirm(t("confirm.borrow", { rate: (economy.rate * 100).toFixed(2), turn: state.turn + 5 }))) return;
    state.cash += 10000;
    state.loans.push({ id: state.transactionSequence, principal: 10000, interest: 0, rate: economy.rate, dueTurn: state.turn + 5 });
    addLog("activity.borrowed", { amount: 10000, dueTurn: state.turn + 5 });
    setToast(t("toast.loan_funded"));
  });
}

function repayMoney() {
  withCommitLock(() => {
    if (!state.loans.length || state.cash <= 0) return;
    let budget = Math.min(10000, state.cash, currentDebt());
    if (!window.confirm(t("confirm.repay", { amount: money(budget) }))) return;
    const paid = budget;
    for (const loan of state.loans) {
      const interestPaid = Math.min(budget, loan.interest);
      loan.interest -= interestPaid;
      budget -= interestPaid;
      const principalPaid = Math.min(budget, loan.principal);
      loan.principal -= principalPaid;
      budget -= principalPaid;
      if (budget <= 0) break;
    }
    state.loans = state.loans.filter((loan) => loan.principal + loan.interest > 0.01);
    state.cash -= paid;
    addLog("activity.debt_repaid", { amount: paid });
    setToast(t("toast.debt_paid"));
  });
}

function settleIncome(owner) {
  return state.plots.filter((plot) => plot.owner === owner).reduce((sum, plot) => sum + operationalIncome(plot), 0);
}

function settleLoans() {
  for (const loan of state.loans) loan.interest += Math.round(loan.principal * loan.rate);
  const due = state.loans.filter((loan) => loan.dueTurn <= state.turn).reduce((sum, loan) => sum + loan.principal + loan.interest, 0);
  if (!due) return true;
  if (state.cash >= due) {
    state.cash -= due;
    state.loans = state.loans.filter((loan) => loan.dueTurn > state.turn);
    addLog("activity.matured_debt_paid", { due });
    return true;
  }
  finishMatch("bankruptcy", t("result.bankruptcy_detail", { amount: money(due) }));
  return false;
}

function aiBuild() {
  const rival = RIVALS[state.rivalId];
  const candidates = state.plots.filter((plot) => plot.owner === "ai" && !plot.building && !zoningReason(plot, rival.building));
  const plot = candidates.sort((a, b) => Number(rival.preferredPlots.includes(b.id)) - Number(rival.preferredPlots.includes(a.id)))[0];
  if (!plot || state.aiCash < BUILDINGS[rival.building].cost + rival.reserve) return false;
  const building = BUILDINGS[rival.building];
  state.aiCash -= building.cost;
  plot.invested += building.cost;
  plot.building = { type: rival.building, activeTurn: state.turn + 1 };
  addLog("activity.rival_construction", { rivalId: state.rivalId, buildingId: rival.building, plotId: plot.id });
  return true;
}

function aiBuy() {
  const rival = RIVALS[state.rivalId];
  const candidates = state.plots.filter((plot) => plot.owner === "unowned").sort((a, b) => {
    const preference = Number(rival.preferredPlots.includes(b.id)) - Number(rival.preferredPlots.includes(a.id));
    return preference || marketPrice(a) - marketPrice(b);
  });
  const plot = candidates.find((item) => state.aiCash >= marketPrice(item) + rival.reserve);
  if (!plot) return false;
  const price = marketPrice(plot);
  state.aiCash -= price;
  plot.owner = "ai";
  plot.invested = price;
  addLog("activity.rival_purchase", { rivalId: state.rivalId, plotId: plot.id, price });
  return true;
}

function aiInvest() {
  const rival = RIVALS[state.rivalId];
  let id = rival.security;
  if (state.turn < SECURITIES[id].opens) id = "industrial_shares";
  const amount = 1000;
  const fee = 10;
  if (state.aiCash < rival.reserve + amount + fee) return false;
  state.aiCash -= amount + fee;
  state.aiHoldings[id] += amount / state.securitiesPrices[id];
  addLog("activity.rival_investment", { rivalId: state.rivalId, amount, ticker: SECURITIES[id].ticker });
  return true;
}

function aiAct() {
  const actions = state.turn % 2 === 0 ? [aiBuild, aiBuy, aiInvest] : [aiBuy, aiBuild, aiInvest];
  actions.some((action) => action());
}

function settlePendingSales() {
  for (const plot of state.plots.filter((item) => item.owner === "player" && item.salePending?.settleTurn <= state.turn)) {
    const price = plot.salePending.price;
    state.cash += price;
    plot.owner = "market";
    plot.salePending = null;
    addLog("activity.sale_settled", { plotId: plot.id, price });
  }
}

function repriceSecurities() {
  for (const id of Object.keys(SECURITIES)) {
    state.securitiesPreviousPrices[id] = state.securitiesPrices[id];
    const next = securityPriceForTurn(id, state.turn);
    state.securitiesPrices[id] = next ?? state.securitiesPrices[id];
  }
}

function finishMatch(reason = "complete", detail = "") {
  state.finished = true;
  const playerWorth = participantWorth("player");
  const aiWorth = participantWorth("ai");
  dom.resultTitle.textContent = reason === "bankruptcy" ? t("result.insolvency") : playerWorth > aiWorth ? t("result.player_leads") : playerWorth < aiWorth ? t("result.rival_leads", { rival: rivalName(state.rivalId) }) : t("result.tie");
  dom.resultSummary.textContent = detail || t(playerWorth >= aiWorth ? "result.summary_player" : "result.summary_rival", { turns: MAX_TURN });
  dom.resultPlayerWorth.textContent = money(playerWorth);
  dom.resultRivalWorth.textContent = money(aiWorth);
  dom.resultPlayerSecurities.textContent = money(securitiesValue("player"));
  dom.resultRivalSecurities.textContent = money(securitiesValue("ai"));
  dom.resultModal.classList.add("is-open");
}

function endTurn() {
  withCommitLock(() => {
    if (!window.confirm(t("confirm.end_turn", { turn: state.turn }))) return;
    aiAct();
    if (state.turn >= MAX_TURN) { finishMatch(); return; }
    state.turn += 1;
    settlePendingSales();
    repriceSecurities();
    const playerIncome = settleIncome("player");
    const aiIncome = settleIncome("ai");
    state.cash += playerIncome;
    state.aiCash += aiIncome;
    addLog("activity.operating_settlement", { playerIncome, rivalIncome: aiIncome });
    if (!settleLoans()) return;
    state.ap = 3;
    if (state.turn === 6) addLog("activity.zoning_active", {}, "Rumor");
    setToast(t("toast.turn_begins", { turn: state.turn }));
  });
}

function switchOperationsTab(tab) {
  if (!state || !["brief", "advice", "bank", "auction", "stocks"].includes(tab)) return false;
  state.activeOperationsTab = tab;
  render();
  return true;
}

function saveGame() {
  if (!state) return;
  state.version = 3;
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  setToast(t("toast.match_saved"));
  renderStatus();
}

function migrateState(raw) {
  const migrated = structuredClone(raw);
  migrated.version = 3;
  migrated.activeOperationsTab = migrated.activeOperationsTab || "brief";
  migrated.playerHoldings = { ...blankHoldings(), ...(migrated.playerHoldings || {}) };
  migrated.aiHoldings = { ...blankHoldings(), ...(migrated.aiHoldings || {}) };
  migrated.securitiesPrices = migrated.securitiesPrices || Object.fromEntries(Object.keys(SECURITIES).map((id) => [id, securityPriceForTurn(id, migrated.turn) ?? securityPriceForTurn(id, SECURITIES[id].opens)]));
  migrated.securitiesPreviousPrices = migrated.securitiesPreviousPrices || { ...migrated.securitiesPrices };
  migrated.plots = migrated.plots.map((oldPlot) => {
    const blueprint = PLOT_BLUEPRINTS.find((plot) => plot.id === oldPlot.id);
    return { ...blueprint, ...oldPlot, district: blueprint?.district || "Unmapped M0 Fixture", price: blueprint?.price ?? oldPlot.price, salePending: oldPlot.salePending || null };
  });
  migrated.log = (migrated.log || []).map((entry) => entry.key ? ({ type: entry.type || "Activity", ...entry }) : ({ type: entry.type || "Activity", turn: entry.turn, key: "activity.legacy_text", values: { text: entry.text || "" } }));
  return migrated;
}

function validLoadedState(candidate) {
  return candidate && [1, 2, 3].includes(candidate.version) && RIVALS[candidate.rivalId] && Number.isInteger(candidate.turn) && candidate.turn >= 1 && candidate.turn <= MAX_TURN && Number.isFinite(candidate.cash) && Number.isFinite(candidate.aiCash) && Array.isArray(candidate.plots) && candidate.plots.length === PLOT_BLUEPRINTS.length;
}

function saveKeyInUse() {
  return [SAVE_KEY, ...LEGACY_SAVE_KEYS].find((key) => window.localStorage.getItem(key)) || null;
}

function hasAnySave() {
  return Boolean(saveKeyInUse());
}

function syncHomeLoadState() {
  const hasSave = hasAnySave();
  dom.homeLoadSaveButton.hidden = !hasSave;
  dom.homeLoadSaveButton.disabled = !hasSave;
  dom.homeLoadEmpty.hidden = hasSave;
}

function renderHomeLanguagePicker() {
  dom.homeLanguageValue.textContent = HOME_LANGUAGE_NAMES[locale()] || locale();
}

function stepHomeLanguage(direction) {
  const supported = window.M1WI18n.supported;
  const currentIndex = Math.max(0, supported.indexOf(locale()));
  const nextIndex = (currentIndex + direction + supported.length) % supported.length;
  window.M1WI18n.setLocale(supported[nextIndex]);
}

function closeHomePanel() {
  dom.homePanel.hidden = true;
  activeHomePanel = null;
  for (const panel of [dom.homeLoadPanel, dom.homeConfigPanel, dom.homeAboutPanel]) panel.hidden = true;
}

function openHomePanel(panel) {
  const panels = {
    load: { title: "Load", node: dom.homeLoadPanel },
    config: { title: "Config", node: dom.homeConfigPanel },
    about: { title: "About Us", node: dom.homeAboutPanel },
  };
  const entry = panels[panel];
  if (!entry) return false;
  closeHomePanel();
  activeHomePanel = panel;
  if (panel === "load") syncHomeLoadState();
  dom.homePanelTitle.textContent = t(`home.panel.${panel}`);
  entry.node.hidden = false;
  dom.homePanel.hidden = false;
  return true;
}

function hideHomeScreen() {
  dom.homeScreen.classList.add("is-hidden");
  closeHomePanel();
}

function showHomeScreen() {
  dom.homeScreen.classList.remove("is-hidden");
  closeHomePanel();
}

function selectRival(rivalId) {
  selectedRivalId = RIVALS[rivalId] ? rivalId : null;
  document.querySelectorAll("[data-rival]").forEach((button) => {
    const selected = button.dataset.rival === selectedRivalId;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  dom.startConfirmButton.disabled = !selectedRivalId;
  return Boolean(selectedRivalId);
}

function openNewGameFlow() {
  showHomeScreen();
  selectRival(null);
  dom.startLoadButton.hidden = !hasAnySave();
  dom.startModal.classList.add("is-open");
}

function closeNewGameFlow() {
  dom.startModal.classList.remove("is-open");
  selectRival(null);
}

function loadGame() {
  const sourceKey = saveKeyInUse();
  const raw = sourceKey ? window.localStorage.getItem(sourceKey) : null;
  if (!raw) { setToast(t("toast.no_save")); return false; }
  try {
    const parsed = JSON.parse(raw);
    if (!validLoadedState(parsed)) throw new Error("Invalid save structure");
    state = migrateState(parsed);
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    hideHomeScreen();
    dom.startModal.classList.remove("is-open");
    dom.resultModal.classList.remove("is-open");
    render();
    setToast(sourceKey === SAVE_KEY ? t("toast.save_loaded") : t("toast.legacy_loaded"));
    return true;
  } catch (error) {
    console.error(error);
    setToast(t("toast.invalid_save"));
    return false;
  }
}

function startMatch(rivalId) {
  if (!RIVALS[rivalId]) return false;
  state = createInitialState(rivalId);
  dom.buildingSelect.value = "standard_apartment";
  dom.stockOrderAmount.value = "1000";
  hideHomeScreen();
  dom.startModal.classList.remove("is-open");
  dom.resultModal.classList.remove("is-open");
  render();
  setToast(t("toast.match_started", { rival: rivalName(rivalId) }));
  return true;
}

function restartFlow() {
  if (state && !state.finished && !window.confirm(t("confirm.restart"))) return;
  state = null;
  dom.resultModal.classList.remove("is-open");
  openNewGameFlow();
}

function collectDom() {
  const ids = ["home-screen", "home-panel", "home-panel-back", "home-panel-title", "home-load-panel", "home-load-save-button", "home-load-empty", "home-config-panel", "home-about-panel", "home-language-value", "toast", "plot-layer", "empty-property", "property-details", "plot-code", "plot-name", "plot-district", "plot-zone", "plot-owner", "plot-price", "plot-building", "plot-income", "buy-button", "building-select", "build-button", "redevelop-select", "redevelop-preview", "redevelop-button", "sell-property-button", "sale-preview", "property-reason", "turn-value", "economy-value", "cash-value", "debt-value", "credit-value", "worth-value", "ap-value", "turn-prompt", "end-turn-button", "rival-name", "rival-style", "rival-condition", "rival-worth", "law-status", "market-brief", "news-list", "bank-credit", "bank-rate", "borrow-button", "repay-button", "loan-list", "stock-order-amount", "stock-list", "save-button", "load-button", "restart-button", "start-modal", "start-modal-back", "start-confirm-button", "start-load-button", "help-modal", "settings-modal", "language-select", "result-modal", "result-title", "result-summary", "result-player-worth", "result-rival-worth", "result-player-securities", "result-rival-securities", "result-restart-button", "help-button", "settings-button", "map-stage", "map-anchor", "map-canvas", "map-base", "district-overlay", "map-loading", "map-hint", "map-zoom-out", "map-zoom-value", "map-zoom-in", "map-reset", "map-status", "empty-district", "district-details", "district-close-button", "district-code", "district-name", "district-location", "district-plots", "district-apartments", "district-factories", "district-stores", "district-transit", "district-prosperity", "district-note"];
  for (const id of ids) dom[id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = document.getElementById(id);
  dom.homeActions = [...document.querySelectorAll("[data-home-action]")];
  dom.homeLanguageButtons = [...document.querySelectorAll("[data-home-language-step]")];
  dom.operationsTabs = [...document.querySelectorAll("[data-operations-tab]")];
  dom.operationsPages = [...document.querySelectorAll("[data-operations-page]")];
  dom.buildSection = document.querySelector(".build-section");
  dom.redevelopSection = document.querySelector(".redevelop-section");
  dom.saleSection = document.querySelector(".sale-section");
}

function bindEvents() {
  dom.homeActions.forEach((button) => button.addEventListener("click", () => {
    const action = button.dataset.homeAction;
    if (action === "new") openNewGameFlow();
    else openHomePanel(action);
  }));
  dom.homePanelBack.addEventListener("click", closeHomePanel);
  dom.homeLoadSaveButton.addEventListener("click", loadGame);
  dom.homeLanguageButtons.forEach((button) => button.addEventListener("click", () => stepHomeLanguage(Number(button.dataset.homeLanguageStep))));
  document.querySelectorAll("[data-rival]").forEach((button) => button.addEventListener("click", () => selectRival(button.dataset.rival)));
  dom.startConfirmButton.addEventListener("click", () => selectedRivalId && startMatch(selectedRivalId));
  dom.startModalBack.addEventListener("click", closeNewGameFlow);
  dom.buyButton.addEventListener("click", buySelectedPlot);
  dom.buildButton.addEventListener("click", buildSelectedPlot);
  dom.redevelopButton.addEventListener("click", () => redevelopSelectedPlot());
  dom.sellPropertyButton.addEventListener("click", sellSelectedProperty);
  dom.buildingSelect.addEventListener("change", renderProperty);
  dom.redevelopSelect.addEventListener("change", renderProperty);
  dom.stockOrderAmount.addEventListener("input", () => state && renderStocks());
  dom.stockList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-trade-side]");
    if (button) tradeSecurity(button.dataset.securityId, button.dataset.tradeSide);
  });
  dom.operationsTabs.forEach((button) => button.addEventListener("click", () => switchOperationsTab(button.dataset.operationsTab)));
  dom.borrowButton.addEventListener("click", borrowMoney);
  dom.repayButton.addEventListener("click", repayMoney);
  dom.endTurnButton.addEventListener("click", endTurn);
  dom.saveButton.addEventListener("click", saveGame);
  dom.loadButton.addEventListener("click", loadGame);
  dom.startLoadButton.addEventListener("click", loadGame);
  dom.restartButton.addEventListener("click", restartFlow);
  dom.resultRestartButton.addEventListener("click", restartFlow);
  dom.helpButton.addEventListener("click", () => dom.helpModal.classList.add("is-open"));
  dom.settingsButton.addEventListener("click", () => dom.settingsModal.classList.add("is-open"));
  dom.languageSelect.addEventListener("change", () => window.M1WI18n.setLocale(dom.languageSelect.value));
  window.addEventListener("m1w:locale-changed", () => {
    renderHomeLanguagePicker();
    if (activeHomePanel) dom.homePanelTitle.textContent = t(`home.panel.${activeHomePanel}`);
    renderBuildingSelectLabels();
    refreshDistrictLocalization();
    if (state) render();
  });
  dom.mapZoomOut.addEventListener("click", () => setMapZoomStep(mapView.zoomStep - 1));
  dom.mapZoomIn.addEventListener("click", () => setMapZoomStep(mapView.zoomStep + 1));
  dom.mapReset.addEventListener("click", resetMapView);
  dom.districtCloseButton.addEventListener("click", clearDistrictSelection);
  dom.mapStage.addEventListener("pointerdown", mapPointerDown);
  dom.mapStage.addEventListener("pointermove", mapPointerMove);
  dom.mapStage.addEventListener("pointerup", mapPointerEnd);
  dom.mapStage.addEventListener("pointercancel", mapPointerEnd);
  dom.mapStage.addEventListener("wheel", mapWheel, { passive: false });
  dom.mapStage.addEventListener("keydown", mapKeydown);
  window.addEventListener("resize", applyMapView);
  dom.mapBase.addEventListener("error", () => failProducerMap(new Error("Map base SVG failed to load")), { once: true });
  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.closeModal).classList.remove("is-open")));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dom.startModal.classList.contains("is-open")) {
      closeNewGameFlow();
      return;
    }
    if (event.key === "Escape" && !dom.homeScreen.classList.contains("is-hidden") && !dom.homePanel.hidden) {
      closeHomePanel();
      return;
    }
    if (event.key === "Escape") document.querySelectorAll(".modal-backdrop:not(#start-modal)").forEach((modal) => modal.classList.remove("is-open"));
  });
}

function initializeApp() {
  collectDom();
  renderBuildingSelectLabels();
  bindEvents();
  renderHomeLanguagePicker();
  dom.startLoadButton.hidden = !hasAnySave();
  dom.loadButton.disabled = dom.startLoadButton.hidden;
  initializeProducerMap().catch(failProducerMap);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
else initializeApp();

const testApi = {
  getState: () => state ? structuredClone(state) : null,
  startMatch, switchOperationsTab, buySelectedPlot, buildSelectedPlot, redevelopSelectedPlot, sellSelectedProperty,
  tradeSecurity, borrowMoney, repayMoney, endTurn, saveGame, loadGame,
  economyForTurn, participantWorth, propertyMarketValue, securitiesValue,
  selectDistrict, clearDistrictSelection, setMapZoomStep, resetMapView,
  getMapState: () => ({ loaded: mapView.loaded, zoomStep: mapView.zoomStep, zoom: currentMapZoom(), panX: mapView.panX, panY: mapView.panY, selectedDistrictId }),
};

if (Object.isExtensible(window)) window.M0Game = testApi;
if (Object.isExtensible(document)) document.M0Game = testApi;

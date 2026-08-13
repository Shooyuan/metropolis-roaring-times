"use strict";

const MAX_TURN = 8;
const SAVE_KEY = "metropolis_roaring_times_m01_save_zh_cn_v1";
const LEGACY_SAVE_KEY = "metropolis_roaring_times_m01_save_zh_cn_legacy";

const RIVALS = {
  tycoon: { name: "实业大亨", style: "工业与交通", preferredPlots: ["hk_01", "mt_01"], building: "factory", reserve: 8000, security: "industrial_shares" },
  landlady: { name: "女房东", style: "住宅收入", preferredPlots: ["cp_01", "les_01"], building: "standard_apartment", reserve: 12000, security: "municipal_bonds" },
  shark: { name: "资本鲨客", style: "廉价土地与流动性", preferredPlots: ["bb_01", "hk_02"], building: "department_store", reserve: 26000, security: "investment_trust" },
};

const BUILDINGS = {
  standard_apartment: { name: "标准公寓", short: "公寓", cost: 8000, gross: 1400, maintenance: 200 },
  factory: { name: "工厂", short: "工厂", cost: 15000, gross: 2900, maintenance: 500 },
  luxury_apartment: { name: "豪华公寓", short: "豪宅", cost: 25000, gross: 3800, maintenance: 800 },
  department_store: { name: "百货商场", short: "商场", cost: 30000, gross: 5200, maintenance: 1000 },
};

const SECURITIES = {
  municipal_bonds: { name: "市政与铁路债券", ticker: "BONDS", risk: "低", opens: 1, prices: [100, 101, 101, 100, 99, 98, 99, 100] },
  industrial_shares: { name: "工业股票组合", ticker: "IND", risk: "中高", opens: 1, prices: [100, 103, 108, 116, 122, 112, 87, 80] },
  investment_trust: { name: "大都会投资信托", ticker: "TRUST", risk: "高", opens: 3, prices: [null, null, 100, 112, 126, 105, 72, 65] },
};

const NEWS_ITEMS = [
  { turn: 1, type: "Fictional", source: "《大都会纪事报》", headline: "新一轮地产季开启，建筑商争相寻找交通便利的地块。" },
  { turn: 2, type: "Historical", source: "美联储历史档案", headline: "证券信贷随 20 世纪 20 年代末的投资热潮同步扩张。" },
  { turn: 3, type: "Fictional", source: "《五区公报》", headline: "投资信托开始吸引曼哈顿小额投资者的关注。" },
  { turn: 4, type: "Rumor", source: "纽约州政府知情人士", headline: "据悉，住宅分区限制正接受积极审议。" },
  { turn: 5, type: "Rumor", source: "纽约州政府知情人士", headline: "第二次吹风表明，住宅区内的工业用途即将受到限制。" },
  { turn: 6, type: "Fictional", source: "《大都会纪事报》", headline: "分区法令生效后，各地产机构重新评估混合用途地块。" },
  { turn: 7, type: "Historical", source: "美联储历史档案", headline: "压缩后的调整阶段开始，股票估值大幅下跌。" },
];

const DISTRICTS = [
  { id: "district_inwood", name: "因伍德", label: ["因伍德"], location: "曼哈顿北部", note: "M1W 地图最北端的已批准分区。" },
  { id: "district_washington_heights", name: "华盛顿高地", label: ["华盛顿高地"], location: "曼哈顿上北部", note: "老板绘制的因伍德与哈莱姆之间分区几何。" },
  { id: "district_harlem", name: "哈莱姆", label: ["哈莱姆"], location: "曼哈顿上城", note: "中央公园以北、横跨曼哈顿岛的已批准分区。" },
  { id: "district_upper_east", name: "上东区", label: ["上东区"], location: "中央公园以东", note: "中央公园东侧的已批准分区。" },
  { id: "district_upper_west", name: "上西区", label: ["上西区"], location: "中央公园以西", note: "中央公园西侧的已批准分区。" },
  { id: "district_midtown_west", name: "中城西", label: ["中城西"], location: "曼哈顿中城西部", note: "中城地图区域西半部的已批准分区。" },
  { id: "district_midtown_east", name: "中城东", label: ["中城东"], location: "曼哈顿中城东部", note: "中城地图区域东半部的已批准分区。" },
  { id: "district_chelsea", name: "切尔西", label: ["切尔西"], location: "西区，中城以南", note: "老板批准的 Figma 矢量网络；M1W 在不重新绘制的前提下验证其真实浏览器感应区。" },
  { id: "district_west_village", name: "西村", label: ["西村"], location: "下西区", note: "M1W 地图中已批准的格林尼治村西部分区。" },
  { id: "district_east_village", name: "东村", label: ["东村"], location: "下东区", note: "M1W 地图中已批准的格林尼治村东部分区。" },
  { id: "district_soho", name: "苏豪区", label: ["苏豪区"], location: "曼哈顿下城", note: "金融区正北方的已批准分区。" },
  { id: "district_financial_district", name: "金融区", label: ["金融区"], location: "曼哈顿南部", note: "M1W 地图最南端的已批准可玩分区。" },
];

const MAP_ZOOM_FACTOR = 1.25;
const MAP_MAX_ZOOM_STEP = 5;
const MAP_PAN_KEY_STEP = 38;

const PLOT_BLUEPRINTS = [
  { id: "cp_01", name: "河滨高地", district: "未映射的 M0 固定数据", zone: "Residential", price: 21000, x: 35, y: 8, w: 14, h: 9, shape: "polygon(6% 9%, 91% 0, 100% 89%, 12% 100%)" },
  { id: "cp_02", name: "博物馆街区", district: "未映射的 M0 固定数据", zone: "Residential", price: 23000, x: 50, y: 8, w: 14, h: 9, shape: "polygon(0 0, 92% 7%, 100% 100%, 8% 91%)" },
  { id: "cp_public", name: "中央公园", district: "未映射的 M0 固定数据", zone: "Public", price: 0, x: 41, y: 18, w: 19, h: 13, owner: "government", shape: "polygon(10% 0, 93% 8%, 100% 90%, 0 100%)" },
  { id: "uw_01", name: "西区街廓", district: "未映射的 M0 固定数据", zone: "Residential", price: 15000, x: 30, y: 24, w: 11, h: 10, shape: "polygon(8% 0, 100% 8%, 92% 100%, 0 89%)" },
  { id: "ue_01", name: "东区庭院", district: "未映射的 M0 固定数据", zone: "Residential", price: 17000, x: 60, y: 24, w: 11, h: 10, shape: "polygon(0 7%, 88% 0, 100% 92%, 9% 100%)" },
  { id: "mt_01", name: "服装业广场", district: "未映射的 M0 固定数据", zone: "Business", price: 15000, x: 35, y: 36, w: 14, h: 10, shape: "polygon(0 7%, 93% 0, 100% 88%, 8% 100%)" },
  { id: "mt_02", name: "中央大道", district: "未映射的 M0 固定数据", zone: "Business", price: 24000, x: 50, y: 36, w: 15, h: 10, shape: "polygon(7% 0, 100% 9%, 92% 100%, 0 89%)" },
  { id: "hk_01", name: "西部铁路场", district: "未映射的 M0 固定数据", zone: "Unrestricted", price: 9000, x: 27, y: 48, w: 14, h: 10, shape: "polygon(12% 0, 100% 8%, 88% 100%, 0 91%)" },
  { id: "mt_03", name: "先驱广场街廓", district: "未映射的 M0 固定数据", zone: "Business", price: 16000, x: 43, y: 48, w: 14, h: 10, shape: "polygon(0 8%, 90% 0, 100% 91%, 8% 100%)" },
  { id: "les_01", name: "果园街庭院", district: "未映射的 M0 固定数据", zone: "Residential", price: 11000, x: 58, y: 48, w: 14, h: 10, shape: "polygon(8% 0, 100% 10%, 91% 100%, 0 88%)" },
  { id: "hk_02", name: "铸造厂巷", district: "未映射的 M0 固定数据", zone: "Unrestricted", price: 7000, x: 29, y: 60, w: 13, h: 10, shape: "polygon(0 6%, 90% 0, 100% 90%, 10% 100%)" },
  { id: "les_02", name: "埃塞克斯市场", district: "未映射的 M0 固定数据", zone: "Business", price: 12000, x: 57, y: 60, w: 14, h: 10, shape: "polygon(9% 0, 100% 7%, 90% 100%, 0 92%)" },
  { id: "lm_01", name: "市政交易所", district: "未映射的 M0 固定数据", zone: "Business", price: 18000, x: 37, y: 70, w: 14, h: 9, shape: "polygon(0 9%, 92% 0, 100% 91%, 7% 100%)" },
  { id: "lm_public", name: "市政厅", district: "未映射的 M0 固定数据", zone: "Public", price: 0, x: 52, y: 70, w: 12, h: 9, owner: "government", shape: "polygon(8% 0, 100% 8%, 91% 100%, 0 90%)" },
  { id: "lm_02", name: "华尔街街角", district: "未映射的 M0 固定数据", zone: "Business", price: 26000, x: 39, y: 81, w: 13, h: 9, shape: "polygon(0 5%, 91% 0, 100% 87%, 10% 100%)" },
  { id: "lm_03", name: "炮台仓库", district: "未映射的 M0 固定数据", zone: "Unrestricted", price: 14000, x: 49, y: 88, w: 12, h: 8, shape: "polygon(10% 0, 100% 12%, 88% 100%, 0 86%)" },
  { id: "bb_01", name: "大桥登陆点", district: "未映射的 M0 固定数据", zone: "Unrestricted", price: 6000, x: 76, y: 75, w: 13, h: 10, shape: "polygon(0 11%, 90% 0, 100% 89%, 9% 100%)" },
  { id: "bb_02", name: "码头地块", district: "未映射的 M0 固定数据", zone: "Business", price: 8000, x: 80, y: 87, w: 13, h: 9, shape: "polygon(8% 0, 100% 9%, 92% 100%, 0 88%)" },
];

const dom = {};
let state = null;
let busy = false;
let toastTimer = null;
let selectedDistrictId = null;

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

const money = (value) => new Intl.NumberFormat("zh-CN", { style: "currency", currency: "USD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(Math.round(value));
const compactMoney = (value) => Math.abs(value) >= 1000 ? `$${Math.round(value / 1000)}k` : `$${Math.round(value)}`;

function economyForTurn(turn) {
  if (turn <= 2) return { id: "opening", name: "开局", market: 1, income: 1, credit: 100000, rate: 0.0025 };
  if (turn <= 4) return { id: "prosperity", name: "繁荣", market: 1.12, income: 1.18, credit: 110000, rate: 0.0025 };
  if (turn <= 6) return { id: "overheating", name: "过热", market: 1.22, income: 1.08, credit: 80000, rate: 0.006 };
  return { id: "adjustment", name: "调整", market: 0.9, income: 0.78, credit: 60000, rate: 0.0075 };
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
    version: 2, rivalId, turn: 1, ap: 3, cash: 50000, aiCash, loans: [], plots,
    selectedPlotId: null, activeOperationsTab: "brief", finished: false, transactionSequence: 1,
    playerHoldings: blankHoldings(), aiHoldings: blankHoldings(),
    securitiesPrices: Object.fromEntries(Object.keys(SECURITIES).map((id) => [id, securityPriceForTurn(id, 1)])),
    securitiesPreviousPrices: Object.fromEntries(Object.keys(SECURITIES).map((id) => [id, securityPriceForTurn(id, 1)])),
    log: [{ turn: 1, type: "Activity", text: `${RIVALS[rivalId].name}以相同初始资产进入曼哈顿市场。` }],
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

function addLog(text, type = "Activity") {
  state.log.unshift({ turn: state.turn, type, text });
  state.log = state.log.slice(0, 30);
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
  if (plot.salePending) return "待售";
  if (plot.owner === "market") return "已售";
  if (plot.building) {
    const building = BUILDINGS[plot.building.type];
    return plot.building.activeTurn > state.turn ? `${building.short}\n施工` : building.short;
  }
  if (plot.owner === "player") return "你的";
  if (plot.owner === "ai") return "对手";
  if (plot.owner === "government") return "公共";
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
    button.setAttribute("aria-label", `${plot.name}，${plot.owner}，${plot.building ? BUILDINGS[plot.building.type].name : "空地"}`);
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
    dom.mapHint.textContent = "悬停查看分区 · 单击锁定";
    return;
  }
  dom.districtCode.textContent = district.id.toUpperCase();
  dom.districtName.textContent = district.name;
  dom.districtLocation.textContent = `${district.location} · 纽约曼哈顿`;
  dom.districtPlots.textContent = "等待 64 地块阶段";
  dom.districtApartments.textContent = "—";
  dom.districtFactories.textContent = "—";
  dom.districtStores.textContent = "—";
  dom.districtTransit.textContent = "等待老板审核";
  dom.districtProsperity.textContent = "—（50.0 至低于 100.0）";
  dom.districtNote.textContent = `${district.note} 在相关数据与公式获批前，玩法数量和繁荣度将有意保持未设定状态。`;
  dom.mapHint.textContent = `${district.name} · 已锁定选择`;
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
  const firstY = bounds.y + bounds.height / 2 - ((meta.label.length - 1) * lineHeight) / 2;
  meta.label.forEach((line, index) => {
    const span = document.createElementNS(svgNamespace, "tspan");
    span.setAttribute("x", String(bounds.x + bounds.width / 2));
    span.setAttribute("y", String(firstY + index * lineHeight));
    span.textContent = line;
    text.append(span);
  });
  return text;
}

async function initializeProducerMap() {
  const response = await window.fetch("../assets/metropolis_district_geometry.svg", { cache: "no-store" });
  if (!response.ok) throw new Error(`分区 SVG 返回 HTTP ${response.status}`);
  const sourceText = await response.text();
  const sourceDocument = new DOMParser().parseFromString(sourceText, "image/svg+xml");
  if (sourceDocument.querySelector("parsererror")) throw new Error("无法解析分区 SVG");

  dom.districtOverlay.replaceChildren();
  const interactionLayer = document.createElementNS(svgNamespace, "g");
  interactionLayer.setAttribute("id", "district-interaction-layer");
  dom.districtOverlay.append(interactionLayer);

  for (const meta of DISTRICTS) {
    const sourceGroup = sourceDocument.getElementById(meta.id);
    if (!sourceGroup) throw new Error(`缺少分区几何：${meta.id}`);
    const sourcePaths = [...sourceGroup.querySelectorAll("path")];
    if (!sourcePaths.length) throw new Error(`分区没有矢量路径：${meta.id}`);

    const group = document.createElementNS(svgNamespace, "g");
    group.setAttribute("class", "district-interaction");
    group.setAttribute("data-district-id", meta.id);
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", `选择${meta.name}`);
    group.setAttribute("aria-pressed", "false");

    for (const sourcePath of sourcePaths) group.append(createDistrictPath(sourcePath, "district-hit"));
    for (const sourcePath of sourcePaths) group.append(createDistrictPath(sourcePath, "district-outline-outer"));
    for (const sourcePath of sourcePaths) group.append(createDistrictPath(sourcePath, "district-outline-inner"));

    group.addEventListener("pointerenter", () => { dom.mapHint.textContent = `${meta.name} · 单击打开分区档案`; });
    group.addEventListener("pointerleave", () => {
      const selected = districtMeta(selectedDistrictId);
      dom.mapHint.textContent = selected ? `${selected.name} · 已锁定选择` : "悬停查看分区 · 单击锁定";
    });
    group.addEventListener("focus", () => { dom.mapHint.textContent = `${meta.name} · 按 Enter 键选择`; });
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
  dom.mapStatus.textContent = `${DISTRICTS.length} 个分区 · 老板定稿几何`;
  dom.mapHint.textContent = "悬停查看分区 · 单击锁定";
  applyMapView();
}

function failProducerMap(error) {
  console.error(error);
  dom.mapLoading.hidden = false;
  dom.mapLoading.classList.add("is-error");
  dom.mapLoading.textContent = "无法准备正式地图，请检查本地 HTTP 服务器和素材文件。";
  dom.mapStatus.textContent = "地图载入失败";
  dom.mapHint.textContent = "正式地图不可用";
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
    return "分区法令禁止在住宅用地上新建工厂和百货商场。";
  }
  return "";
}

function buildingLegality(plot, buildingId) {
  if (!plot || plot.owner !== "player") return "需要先拥有一块空地才能建造。";
  if (plot.salePending) return "该地产已提交经纪出售。";
  if (plot.building) return "该地块已经建有建筑。";
  if (state.ap < 1) return "本回合已无剩余行动点。";
  if (state.cash < BUILDINGS[buildingId].cost) return `你需要 ${money(BUILDINGS[buildingId].cost)} 现金。`;
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
  if (!plot || plot.owner !== "player" || !plot.building) return "需要先拥有已开发地产才能改建。";
  if (plot.salePending) return "该地产已提交经纪出售。";
  if (!redevelopmentOptions(plot).some(([id]) => id === buildingId)) return "只能改建为成本严格更高的建筑。";
  if (state.ap < 1) return "本回合已无剩余行动点。";
  const cost = redevelopmentCost(plot, buildingId);
  if (state.cash < cost) return `你需要 ${money(cost)} 现金。`;
  return zoningReason(plot, buildingId);
}

function selectedActionReason(plot) {
  if (!plot) return "请选择地块查看详情。";
  if (plot.salePending) return `经纪出售将在第 ${plot.salePending.settleTurn} 回合开始时以 ${money(plot.salePending.price)} 结算。`;
  if (plot.owner === "government") return "本原型暂不开放公共土地。";
  if (plot.owner === "market") return "该地产结算后已离开可玩市场。";
  if (plot.owner === "ai") return "该地产属于你的对手。";
  if (plot.owner === "unowned" && state.ap < 1) return "本回合已无剩余行动点。";
  if (plot.owner === "unowned" && state.cash < marketPrice(plot)) return "现金不足；借款必须由你明确操作。";
  if (plot.owner === "player" && plot.building?.activeTurn > state.turn) return "建筑将在下一回合投入运营。";
  return "";
}

function renderProperty() {
  const plot = getPlot(state.selectedPlotId);
  dom.emptyProperty.hidden = Boolean(plot);
  dom.propertyDetails.hidden = !plot;
  if (!plot) return;

  const ownerLabels = { player: "你", ai: RIVALS[state.rivalId].name, government: "公共", market: "已售给市场", unowned: "可购买" };
  dom.plotCode.textContent = plot.id.toUpperCase();
  dom.plotName.textContent = plot.name;
  dom.plotDistrict.textContent = plot.district;
  dom.plotZone.textContent = ({ Residential: "住宅", Business: "商业", Unrestricted: "无限制", Public: "公共" })[plot.zone] || plot.zone;
  dom.plotOwner.textContent = ownerLabels[plot.owner];
  dom.plotPrice.textContent = plot.owner === "government" ? "不出售" : money(propertyMarketValue(plot));
  dom.plotBuilding.textContent = plot.building ? `${BUILDINGS[plot.building.type].name}${plot.building.activeTurn > state.turn ? "（施工中）" : ""}` : "空地";
  dom.plotIncome.textContent = plot.owner === "market" ? "不再收取" : plot.building ? `${money(operationalIncome(plot))} / 回合` : "—";

  dom.buyButton.hidden = plot.owner !== "unowned";
  dom.buyButton.disabled = plot.owner !== "unowned" || state.ap < 1 || state.cash < marketPrice(plot);
  dom.buyButton.textContent = `购买地块 · ${money(marketPrice(plot))}`;

  dom.buildSection.hidden = plot.owner !== "player" || Boolean(plot.building) || Boolean(plot.salePending);
  dom.buildButton.disabled = Boolean(buildingLegality(plot, dom.buildingSelect.value));

  const options = redevelopmentOptions(plot);
  dom.redevelopSection.hidden = plot.owner !== "player" || !plot.building || options.length === 0 || Boolean(plot.salePending);
  if (!dom.redevelopSection.hidden) {
    const selected = dom.redevelopSelect.value;
    dom.redevelopSelect.replaceChildren(...options.map(([id, building]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `${building.name} — 支付 ${money(redevelopmentCost(plot, id))}`;
      return option;
    }));
    if (options.some(([id]) => id === selected)) dom.redevelopSelect.value = selected;
    const buildingId = dom.redevelopSelect.value;
    const old = BUILDINGS[plot.building.type];
    dom.redevelopPreview.textContent = `新建筑成本 ${money(BUILDINGS[buildingId].cost)} − 旧建筑抵扣 ${money(old.cost * 1.2)} = 实付 ${money(redevelopmentCost(plot, buildingId))}。下一回合投入运营。`;
    dom.redevelopButton.disabled = Boolean(redevelopmentLegality(plot, buildingId));
  }

  dom.saleSection.hidden = plot.owner !== "player" || Boolean(plot.salePending);
  if (!dom.saleSection.hidden) {
    const salePrice = Math.round(propertyMarketValue(plot) * 0.9);
    dom.salePreview.textContent = state.turn >= MAX_TURN ? "最后一回合不能发起经纪出售。" : `锁定 ${money(salePrice)}（当前地产价值的 90%），下一回合开始时结算。`;
    dom.sellPropertyButton.disabled = state.ap < 1 || state.turn >= MAX_TURN;
  }

  let reason = selectedActionReason(plot);
  if (plot.owner === "player" && !plot.building && !plot.salePending) reason = buildingLegality(plot, dom.buildingSelect.value);
  if (plot.owner === "player" && plot.building && options.length && !plot.salePending) reason = redevelopmentLegality(plot, dom.redevelopSelect.value);
  dom.propertyReason.textContent = reason;
}

function rivalCondition() {
  const worth = participantWorth("ai");
  if (state.aiCash < 8000) return "现金紧张";
  if (worth > participantWorth("player") * 1.12) return "信心十足";
  if (worth < participantWorth("player") * 0.88) return "承受压力";
  return "稳健";
}

function cityMessage() {
  if (state.turn === 4) return { warning: true, text: "分区法令辩论已经公布：住宅区可能很快禁止新建工厂和百货商场。" };
  if (state.turn === 5) return { warning: true, text: "第二次分区法令预警：住宅区工业项目面临近期风险。" };
  if (state.turn >= 6) return { warning: true, text: "分区法令已生效：住宅用地不得新建工厂或百货商场。" };
  if (economyForTurn(state.turn).id === "prosperity") return { warning: false, text: "繁荣推高地价和经营收入，投资信托现已开放。" };
  return { warning: false, text: "开局市场：土地价格稳定、信贷充足，每一点行动点都很重要。" };
}

function renderNews() {
  dom.newsList.replaceChildren();
  const records = [
    ...NEWS_ITEMS.filter((item) => item.turn <= state.turn).map((item) => ({ ...item, text: item.headline })),
    ...state.log.map((entry) => ({ turn: entry.turn, type: entry.type || "Activity", source: "你的综合操作栏", text: entry.text })),
  ].sort((a, b) => b.turn - a.turn).slice(0, 18);
  for (const record of records) {
    const item = document.createElement("li");
    item.className = "news-item";
    const top = document.createElement("div");
    top.className = "news-meta";
    const badge = document.createElement("span");
    badge.className = `news-badge news-badge--${record.type.toLowerCase()}`;
    badge.textContent = ({ Historical: "史实", Fictional: "虚构", Rumor: "传闻", Activity: "动态" })[record.type] || record.type;
    const source = document.createElement("span");
    source.textContent = `第 ${record.turn} 回合 · ${record.source}`;
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
    item.textContent = "暂无未偿贷款。";
    dom.loanList.append(item);
    return;
  }
  for (const loan of state.loans) {
    const item = document.createElement("li");
    item.textContent = `${money(loan.principal + loan.interest)} 将于第 ${loan.dueTurn} 回合结束时到期`;
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
    summary.innerHTML = `<div><strong>${security.ticker}</strong><span>${security.name}</span></div><div class="stock-price"><strong>${available ? money(price) : "未开放"}</strong><span>${available ? `本回合 ${change >= 0 ? "+" : ""}${change.toFixed(1)}%` : "繁荣阶段开放"}</span></div>`;
    const facts = document.createElement("p");
    facts.textContent = `风险：${security.risk} · 你的持仓：${money(holdingValue)}`;
    const actions = document.createElement("div");
    actions.className = "stock-actions";
    for (const side of ["buy", "sell"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.securityId = id;
      button.dataset.tradeSide = side;
      button.textContent = side === "buy" ? "买入" : "卖出";
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
  dom.rivalName.textContent = RIVALS[state.rivalId].name;
  dom.rivalStyle.textContent = RIVALS[state.rivalId].style;
  dom.rivalCondition.textContent = rivalCondition();
  dom.rivalWorth.textContent = money(participantWorth("ai"));
  dom.lawStatus.textContent = zoningActive() ? "住宅分区限制已生效" : state.turn >= 4 ? "分区法令审议中" : "暂无生效限制";
  const message = cityMessage();
  dom.marketBrief.classList.toggle("is-warning", message.warning);
  dom.marketBrief.querySelector("p").textContent = message.text;
  dom.bankCredit.textContent = money(Math.max(0, economy.credit - outstandingPrincipal()));
  dom.bankRate.textContent = `每回合 ${(economy.rate * 100).toFixed(2)}%`;
  renderNews();
  renderLoanBook();
  renderStocks();
}

function renderStatus() {
  const economy = economyForTurn(state.turn);
  dom.turnValue.textContent = `${state.turn} / ${MAX_TURN}`;
  dom.economyValue.textContent = economy.name;
  dom.cashValue.textContent = money(state.cash);
  dom.debtValue.textContent = money(currentDebt());
  dom.creditValue.textContent = money(Math.max(0, economy.credit - outstandingPrincipal()));
  dom.worthValue.textContent = money(participantWorth("player"));
  dom.apValue.textContent = `${state.ap} / 3`;
  dom.turnPrompt.textContent = state.ap > 0 ? `剩余 ${state.ap} 点行动点` : "可以结算";
  dom.endTurnButton.disabled = state.finished;
  dom.borrowButton.disabled = Math.max(0, economy.credit - outstandingPrincipal()) < 10000;
  dom.repayButton.disabled = currentDebt() <= 0 || state.cash <= 0;
  dom.loadButton.disabled = !window.localStorage.getItem(SAVE_KEY) && !window.localStorage.getItem(LEGACY_SAVE_KEY);
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
    if (!window.confirm(`是否以 ${money(price)} 购买${plot.name}？此操作消耗 1 点行动点。`)) return;
    state.cash -= price;
    state.ap -= 1;
    plot.owner = "player";
    plot.invested = price;
    addLog(`以 ${money(price)} 购买了${plot.name}。`);
    setToast("地产购买完成。");
  });
}

function buildSelectedPlot() {
  withCommitLock(() => {
    const plot = getPlot(state.selectedPlotId);
    const buildingId = dom.buildingSelect.value;
    const reason = buildingLegality(plot, buildingId);
    if (reason) { setToast(reason); return; }
    const building = BUILDINGS[buildingId];
    if (!window.confirm(`是否花费 ${money(building.cost)} 建造${building.name}？建筑将在下一回合投入运营。`)) return;
    state.cash -= building.cost;
    state.ap -= 1;
    plot.invested += building.cost;
    plot.building = { type: buildingId, activeTurn: state.turn + 1 };
    addLog(`在${plot.name}开始建造${building.name}。`);
    setToast("施工已经开始。");
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
    if (!window.confirm(`计入旧建筑 120% 残值抵扣后，是否花费 ${money(cost)} 将${old.name}改建为${next.name}？`)) return;
    state.cash -= cost;
    state.ap -= 1;
    plot.invested = plot.invested - old.cost + next.cost;
    plot.building = { type: buildingId, activeTurn: state.turn + 1 };
    addLog(`花费 ${money(cost)}，将${plot.name}的${old.name}改建为${next.name}。`);
    setToast("改建已经开始。");
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
    if (!window.confirm(`是否将${plot.name}以 ${money(price)} 提交经纪出售？交易将在下一回合结算，并消耗 1 点行动点。`)) return;
    state.ap -= 1;
    plot.salePending = { price, settleTurn: state.turn + 1 };
    addLog(`${plot.name}的经纪出售价格已锁定为 ${money(price)}，下一回合结算。`);
    setToast("出售价格已锁定。");
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
    if (!security || !["buy", "sell"].includes(side) || !amount) { setToast("委托额至少为 $1,000，并须以 $1,000 为步进。 "); return; }
    if (state.turn < security.opens) { setToast("该投资标的尚未开放。"); return; }
    if (state.ap < 1) { setToast("本回合已无剩余行动点。"); return; }
    const fee = Math.round(amount * 0.01);
    const price = state.securitiesPrices[id];
    const units = amount / price;
    if (side === "buy") {
      if (state.cash < amount + fee) { setToast("现金不足以支付委托额与手续费。"); return; }
      if (!window.confirm(`是否买入 ${money(amount)} 的 ${security.ticker}，并支付 ${money(fee)} 手续费？`)) return;
      state.cash -= amount + fee;
      state.playerHoldings[id] += units;
    } else {
      if ((state.playerHoldings[id] || 0) * price + 0.01 < amount) { setToast("你的持仓小于本次卖出委托额。"); return; }
      if (!window.confirm(`是否卖出 ${money(amount)} 的 ${security.ticker}，并支付 ${money(fee)} 手续费？`)) return;
      state.cash += amount - fee;
      state.playerHoldings[id] = Math.max(0, state.playerHoldings[id] - units);
    }
    state.ap -= 1;
    addLog(`${side === "buy" ? "买入" : "卖出"} ${money(amount)} 的 ${security.ticker}；手续费 ${money(fee)}。`);
    setToast(`证券${side === "buy" ? "买入" : "卖出"}委托已完成。`);
    result = true;
  });
  return result;
}

function borrowMoney() {
  withCommitLock(() => {
    const economy = economyForTurn(state.turn);
    if (economy.credit - outstandingPrincipal() < 10000) return;
    if (!window.confirm(`是否借款 $10,000？每回合利率为 ${(economy.rate * 100).toFixed(2)}%，本金与累计利息将在第 ${state.turn + 5} 回合结束时到期。`)) return;
    state.cash += 10000;
    state.loans.push({ id: state.transactionSequence, principal: 10000, interest: 0, rate: economy.rate, dueTurn: state.turn + 5 });
    addLog(`借入 $10,000，将于第 ${state.turn + 5} 回合结束时到期。`);
    setToast("贷款已经到账，未消耗行动点。");
  });
}

function repayMoney() {
  withCommitLock(() => {
    if (!state.loans.length || state.cash <= 0) return;
    let budget = Math.min(10000, state.cash, currentDebt());
    if (!window.confirm(`是否最多使用 ${money(budget)} 偿还最早的贷款？此操作不消耗行动点。`)) return;
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
    addLog(`偿还了 ${money(paid)} 债务。`);
    setToast("还款已完成，未消耗行动点。");
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
    addLog(`已支付到期本金与利息 ${money(due)}。`);
    return true;
  }
  finishMatch("bankruptcy", `无法偿还 ${money(due)} 的到期债务。必须在此期限前完成紧急资产出售。`);
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
  addLog(`${rival.name}在${plot.name}开始建造${building.name}。`);
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
  addLog(`${rival.name}以 ${money(price)} 购买了${plot.name}。`);
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
  addLog(`${rival.name}向 ${SECURITIES[id].ticker} 投资了 ${money(amount)}。`);
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
    addLog(`${plot.name}的经纪出售以 ${money(price)} 完成结算。`);
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
  dom.resultTitle.textContent = reason === "bankruptcy" ? "资不抵债" : playerWorth > aiWorth ? "你领跑曼哈顿" : playerWorth < aiWorth ? `${RIVALS[state.rivalId].name}领先` : "势均力敌";
  dom.resultSummary.textContent = detail || `${MAX_TURN} 回合结束后，${playerWorth >= aiWorth ? "你的投资组合守住了优势" : "对手的投资组合领先"}。`;
  dom.resultPlayerWorth.textContent = money(playerWorth);
  dom.resultRivalWorth.textContent = money(aiWorth);
  dom.resultPlayerSecurities.textContent = money(securitiesValue("player"));
  dom.resultRivalSecurities.textContent = money(securitiesValue("ai"));
  dom.resultModal.classList.add("is-open");
}

function endTurn() {
  withCommitLock(() => {
    if (!window.confirm(`是否结束第 ${state.turn} 回合？经营收入、债务利息和对手行动将进行结算。`)) return;
    aiAct();
    if (state.turn >= MAX_TURN) { finishMatch(); return; }
    state.turn += 1;
    settlePendingSales();
    repriceSecurities();
    const playerIncome = settleIncome("player");
    const aiIncome = settleIncome("ai");
    state.cash += playerIncome;
    state.aiCash += aiIncome;
    addLog(`经营结算：你获得 ${money(playerIncome)}，对手获得 ${money(aiIncome)}。`);
    if (!settleLoans()) return;
    state.ap = 3;
    if (state.turn === 6) addLog("住宅分区限制现已生效。", "Rumor");
    setToast(`第 ${state.turn} 回合开始。`);
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
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  setToast("对局已保存在此浏览器中。");
  renderStatus();
}

function migrateState(raw) {
  const migrated = structuredClone(raw);
  migrated.version = 2;
  migrated.activeOperationsTab = migrated.activeOperationsTab || "brief";
  migrated.playerHoldings = { ...blankHoldings(), ...(migrated.playerHoldings || {}) };
  migrated.aiHoldings = { ...blankHoldings(), ...(migrated.aiHoldings || {}) };
  migrated.securitiesPrices = migrated.securitiesPrices || Object.fromEntries(Object.keys(SECURITIES).map((id) => [id, securityPriceForTurn(id, migrated.turn) ?? securityPriceForTurn(id, SECURITIES[id].opens)]));
  migrated.securitiesPreviousPrices = migrated.securitiesPreviousPrices || { ...migrated.securitiesPrices };
  migrated.plots = migrated.plots.map((oldPlot) => {
    const blueprint = PLOT_BLUEPRINTS.find((plot) => plot.id === oldPlot.id);
    return { ...blueprint, ...oldPlot, district: blueprint?.district || "未映射的 M0 固定数据", price: blueprint?.price ?? oldPlot.price, salePending: oldPlot.salePending || null };
  });
  migrated.log = (migrated.log || []).map((entry) => ({ type: entry.type || "Activity", ...entry }));
  return migrated;
}

function validLoadedState(candidate) {
  return candidate && [1, 2].includes(candidate.version) && RIVALS[candidate.rivalId] && Number.isInteger(candidate.turn) && candidate.turn >= 1 && candidate.turn <= MAX_TURN && Number.isFinite(candidate.cash) && Number.isFinite(candidate.aiCash) && Array.isArray(candidate.plots) && candidate.plots.length === PLOT_BLUEPRINTS.length;
}

function loadGame() {
  const raw = window.localStorage.getItem(SAVE_KEY) || window.localStorage.getItem(LEGACY_SAVE_KEY);
  if (!raw) { setToast("未找到已保存的对局。"); return false; }
  try {
    const parsed = JSON.parse(raw);
    if (!validLoadedState(parsed)) throw new Error("存档结构无效");
    state = migrateState(parsed);
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    dom.startModal.classList.remove("is-open");
    dom.resultModal.classList.remove("is-open");
    render();
    setToast(parsed.version === 1 ? "旧版 M0 存档已迁移并载入。" : "已载入保存的对局。");
    return true;
  } catch (error) {
    console.error(error);
    setToast("存档无效，未能载入。");
    return false;
  }
}

function startMatch(rivalId) {
  if (!RIVALS[rivalId]) return false;
  state = createInitialState(rivalId);
  dom.buildingSelect.value = "standard_apartment";
  dom.stockOrderAmount.value = "1000";
  dom.startModal.classList.remove("is-open");
  dom.resultModal.classList.remove("is-open");
  render();
  setToast(`与${RIVALS[rivalId].name}的对局已经开始。`);
  return true;
}

function restartFlow() {
  if (state && !state.finished && !window.confirm("是否放弃当前对局并选择新对手？已经保存的对局仍会保留。")) return;
  state = null;
  dom.resultModal.classList.remove("is-open");
  dom.startModal.classList.add("is-open");
  dom.startLoadButton.hidden = !window.localStorage.getItem(SAVE_KEY) && !window.localStorage.getItem(LEGACY_SAVE_KEY);
}

function collectDom() {
  const ids = ["toast", "plot-layer", "empty-property", "property-details", "plot-code", "plot-name", "plot-district", "plot-zone", "plot-owner", "plot-price", "plot-building", "plot-income", "buy-button", "building-select", "build-button", "redevelop-select", "redevelop-preview", "redevelop-button", "sell-property-button", "sale-preview", "property-reason", "turn-value", "economy-value", "cash-value", "debt-value", "credit-value", "worth-value", "ap-value", "turn-prompt", "end-turn-button", "rival-name", "rival-style", "rival-condition", "rival-worth", "law-status", "market-brief", "news-list", "bank-credit", "bank-rate", "borrow-button", "repay-button", "loan-list", "stock-order-amount", "stock-list", "save-button", "load-button", "restart-button", "start-modal", "start-load-button", "help-modal", "settings-modal", "result-modal", "result-title", "result-summary", "result-player-worth", "result-rival-worth", "result-player-securities", "result-rival-securities", "result-restart-button", "help-button", "settings-button", "map-stage", "map-anchor", "map-canvas", "map-base", "district-overlay", "map-loading", "map-hint", "map-zoom-out", "map-zoom-value", "map-zoom-in", "map-reset", "map-status", "empty-district", "district-details", "district-close-button", "district-code", "district-name", "district-location", "district-plots", "district-apartments", "district-factories", "district-stores", "district-transit", "district-prosperity", "district-note"];
  for (const id of ids) dom[id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = document.getElementById(id);
  dom.operationsTabs = [...document.querySelectorAll("[data-operations-tab]")];
  dom.operationsPages = [...document.querySelectorAll("[data-operations-page]")];
  dom.buildSection = document.querySelector(".build-section");
  dom.redevelopSection = document.querySelector(".redevelop-section");
  dom.saleSection = document.querySelector(".sale-section");
}

function bindEvents() {
  document.querySelectorAll("[data-rival]").forEach((button) => button.addEventListener("click", () => startMatch(button.dataset.rival)));
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
  dom.mapBase.addEventListener("error", () => failProducerMap(new Error("地图底图 SVG 载入失败")), { once: true });
  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.closeModal).classList.remove("is-open")));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") document.querySelectorAll(".modal-backdrop:not(#start-modal)").forEach((modal) => modal.classList.remove("is-open"));
  });
}

function initializeApp() {
  collectDom();
  bindEvents();
  dom.startLoadButton.hidden = !window.localStorage.getItem(SAVE_KEY) && !window.localStorage.getItem(LEGACY_SAVE_KEY);
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

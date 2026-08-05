"use strict";

const MAX_TURN = 8;
const SAVE_KEY = "metropolis_roaring_times_m01_save_v2";
const LEGACY_SAVE_KEY = "roaring_times_m0_web_save_v1";

const RIVALS = {
  tycoon: { name: "Tycoon", style: "Industry & transport", preferredDistricts: ["Midtown", "Hell's Kitchen"], building: "factory", reserve: 8000, security: "industrial_shares" },
  landlady: { name: "Landlady", style: "Residential income", preferredDistricts: ["Central Park District", "Lower East Side"], building: "standard_apartment", reserve: 12000, security: "municipal_bonds" },
  shark: { name: "Shark", style: "Cheap land & liquidity", preferredDistricts: ["Brooklyn Bridgehead", "Lower East Side"], building: "department_store", reserve: 26000, security: "investment_trust" },
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
  { turn: 1, type: "Fictional", source: "The Metropolitan Ledger", headline: "Builders seek well-connected parcels as a new property season opens." },
  { turn: 2, type: "Historical", source: "Federal Reserve Historical Record", headline: "Security credit expands alongside the late-1920s investment boom." },
  { turn: 3, type: "Fictional", source: "The Five Borough Gazette", headline: "Investment trusts draw new attention from small Manhattan investors." },
  { turn: 4, type: "Rumor", source: "Sources familiar with the New York State Government", headline: "Residential zoning restrictions are said to be under active review." },
  { turn: 5, type: "Rumor", source: "Sources familiar with the New York State Government", headline: "A second briefing points to imminent limits on industrial residential use." },
  { turn: 6, type: "Fictional", source: "The Metropolitan Ledger", headline: "Property desks reassess mixed-use sites after the zoning order takes effect." },
  { turn: 7, type: "Historical", source: "Federal Reserve Historical Record", headline: "Equity values fall sharply as the compressed adjustment phase begins." },
];

const PLOT_BLUEPRINTS = [
  { id: "cp_01", name: "Riverside Heights", district: "Central Park District", zone: "Residential", price: 21000, x: 35, y: 8, w: 14, h: 9, shape: "polygon(6% 9%, 91% 0, 100% 89%, 12% 100%)" },
  { id: "cp_02", name: "Museum Row", district: "Central Park District", zone: "Residential", price: 23000, x: 50, y: 8, w: 14, h: 9, shape: "polygon(0 0, 92% 7%, 100% 100%, 8% 91%)" },
  { id: "cp_public", name: "Central Park", district: "Central Park District", zone: "Public", price: 0, x: 41, y: 18, w: 19, h: 13, owner: "government", shape: "polygon(10% 0, 93% 8%, 100% 90%, 0 100%)" },
  { id: "uw_01", name: "West End Blocks", district: "Central Park District", zone: "Residential", price: 15000, x: 30, y: 24, w: 11, h: 10, shape: "polygon(8% 0, 100% 8%, 92% 100%, 0 89%)" },
  { id: "ue_01", name: "East Side Court", district: "Central Park District", zone: "Residential", price: 17000, x: 60, y: 24, w: 11, h: 10, shape: "polygon(0 7%, 88% 0, 100% 92%, 9% 100%)" },
  { id: "mt_01", name: "Garment Square", district: "Midtown", zone: "Business", price: 15000, x: 35, y: 36, w: 14, h: 10, shape: "polygon(0 7%, 93% 0, 100% 88%, 8% 100%)" },
  { id: "mt_02", name: "Grand Avenue", district: "Midtown", zone: "Business", price: 24000, x: 50, y: 36, w: 15, h: 10, shape: "polygon(7% 0, 100% 9%, 92% 100%, 0 89%)" },
  { id: "hk_01", name: "Rail Yard West", district: "Hell's Kitchen", zone: "Unrestricted", price: 9000, x: 27, y: 48, w: 14, h: 10, shape: "polygon(12% 0, 100% 8%, 88% 100%, 0 91%)" },
  { id: "mt_03", name: "Herald Blocks", district: "Midtown", zone: "Business", price: 16000, x: 43, y: 48, w: 14, h: 10, shape: "polygon(0 8%, 90% 0, 100% 91%, 8% 100%)" },
  { id: "les_01", name: "Orchard Courts", district: "Lower East Side", zone: "Residential", price: 11000, x: 58, y: 48, w: 14, h: 10, shape: "polygon(8% 0, 100% 10%, 91% 100%, 0 88%)" },
  { id: "hk_02", name: "Foundry Lane", district: "Hell's Kitchen", zone: "Unrestricted", price: 7000, x: 29, y: 60, w: 13, h: 10, shape: "polygon(0 6%, 90% 0, 100% 90%, 10% 100%)" },
  { id: "les_02", name: "Essex Market", district: "Lower East Side", zone: "Business", price: 12000, x: 57, y: 60, w: 14, h: 10, shape: "polygon(9% 0, 100% 7%, 90% 100%, 0 92%)" },
  { id: "lm_01", name: "Civic Exchange", district: "Lower Manhattan", zone: "Business", price: 18000, x: 37, y: 70, w: 14, h: 9, shape: "polygon(0 9%, 92% 0, 100% 91%, 7% 100%)" },
  { id: "lm_public", name: "City Hall", district: "Lower Manhattan", zone: "Public", price: 0, x: 52, y: 70, w: 12, h: 9, owner: "government", shape: "polygon(8% 0, 100% 8%, 91% 100%, 0 90%)" },
  { id: "lm_02", name: "Wall Street Corner", district: "Lower Manhattan", zone: "Business", price: 26000, x: 39, y: 81, w: 13, h: 9, shape: "polygon(0 5%, 91% 0, 100% 87%, 10% 100%)" },
  { id: "lm_03", name: "Battery Warehouses", district: "Lower Manhattan", zone: "Unrestricted", price: 14000, x: 49, y: 88, w: 12, h: 8, shape: "polygon(10% 0, 100% 12%, 88% 100%, 0 86%)" },
  { id: "bb_01", name: "Bridge Landing", district: "Brooklyn Bridgehead", zone: "Unrestricted", price: 6000, x: 76, y: 75, w: 13, h: 10, shape: "polygon(0 11%, 90% 0, 100% 89%, 9% 100%)" },
  { id: "bb_02", name: "Dockside Lots", district: "Brooklyn Bridgehead", zone: "Business", price: 8000, x: 80, y: 87, w: 13, h: 9, shape: "polygon(8% 0, 100% 9%, 92% 100%, 0 88%)" },
];

const dom = {};
let state = null;
let busy = false;
let toastTimer = null;

const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.round(value));
const compactMoney = (value) => Math.abs(value) >= 1000 ? `$${Math.round(value / 1000)}k` : `$${Math.round(value)}`;

function economyForTurn(turn) {
  if (turn <= 2) return { id: "opening", name: "Opening", market: 1, income: 1, credit: 100000, rate: 0.0025 };
  if (turn <= 4) return { id: "prosperity", name: "Prosperity", market: 1.12, income: 1.18, credit: 110000, rate: 0.0025 };
  if (turn <= 6) return { id: "overheating", name: "Overheating", market: 1.22, income: 1.08, credit: 80000, rate: 0.006 };
  return { id: "adjustment", name: "Adjustment", market: 0.9, income: 0.78, credit: 60000, rate: 0.0075 };
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
    log: [{ turn: 1, type: "Activity", text: `${RIVALS[rivalId].name} enters the Manhattan market on equal starting value.` }],
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
  if (plot.salePending) return "SALE\nPENDING";
  if (plot.owner === "market") return "SOLD";
  if (plot.building) {
    const building = BUILDINGS[plot.building.type];
    return plot.building.activeTurn > state.turn ? `${building.short}\nBUILD` : building.short;
  }
  if (plot.owner === "player") return "YOU";
  if (plot.owner === "ai") return "RIVAL";
  if (plot.owner === "government") return "PUBLIC";
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
    button.setAttribute("aria-label", `${plot.name}, ${plot.owner}, ${plot.building ? BUILDINGS[plot.building.type].name : "empty"}`);
    const mark = document.createElement("span");
    mark.className = "plot-mark";
    mark.textContent = plotMark(plot);
    button.append(mark);
    button.addEventListener("click", () => { state.selectedPlotId = plot.id; render(); });
    dom.plotLayer.append(button);
  }
}

function zoningReason(plot, buildingId) {
  if (zoningActive() && plot.zone === "Residential" && ["factory", "department_store"].includes(buildingId)) {
    return "The zoning rule blocks new factories and stores on Residential plots.";
  }
  return "";
}

function buildingLegality(plot, buildingId) {
  if (!plot || plot.owner !== "player") return "Own an empty plot before building.";
  if (plot.salePending) return "This property is already committed to a brokered sale.";
  if (plot.building) return "This plot already has a building.";
  if (state.ap < 1) return "No action points remain this turn.";
  if (state.cash < BUILDINGS[buildingId].cost) return `You need ${money(BUILDINGS[buildingId].cost)} cash.`;
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
  if (!plot || plot.owner !== "player" || !plot.building) return "Own a developed property before redevelopment.";
  if (plot.salePending) return "This property is already committed to a brokered sale.";
  if (!redevelopmentOptions(plot).some(([id]) => id === buildingId)) return "Redevelopment must move to a strictly higher-cost building.";
  if (state.ap < 1) return "No action points remain this turn.";
  const cost = redevelopmentCost(plot, buildingId);
  if (state.cash < cost) return `You need ${money(cost)} cash.`;
  return zoningReason(plot, buildingId);
}

function selectedActionReason(plot) {
  if (!plot) return "Select a plot to inspect it.";
  if (plot.salePending) return `Brokered sale settles for ${money(plot.salePending.price)} at the start of turn ${plot.salePending.settleTurn}.`;
  if (plot.owner === "government") return "Public land is not available in this prototype.";
  if (plot.owner === "market") return "This property has left the playable market after settlement.";
  if (plot.owner === "ai") return "This property belongs to your rival.";
  if (plot.owner === "unowned" && state.ap < 1) return "No action points remain this turn.";
  if (plot.owner === "unowned" && state.cash < marketPrice(plot)) return "Insufficient cash. Borrowing is always explicit.";
  if (plot.owner === "player" && plot.building?.activeTurn > state.turn) return "Construction becomes operational next turn.";
  return "";
}

function renderProperty() {
  const plot = getPlot(state.selectedPlotId);
  dom.emptyProperty.hidden = Boolean(plot);
  dom.propertyDetails.hidden = !plot;
  if (!plot) return;

  const ownerLabels = { player: "You", ai: RIVALS[state.rivalId].name, government: "Public", market: "Sold to market", unowned: "Available" };
  dom.plotCode.textContent = plot.id.toUpperCase();
  dom.plotName.textContent = plot.name;
  dom.plotDistrict.textContent = plot.district;
  dom.plotZone.textContent = plot.zone;
  dom.plotOwner.textContent = ownerLabels[plot.owner];
  dom.plotPrice.textContent = plot.owner === "government" ? "Not for sale" : money(propertyMarketValue(plot));
  dom.plotBuilding.textContent = plot.building ? `${BUILDINGS[plot.building.type].name}${plot.building.activeTurn > state.turn ? " (Building)" : ""}` : "Empty land";
  dom.plotIncome.textContent = plot.owner === "market" ? "Not collected" : plot.building ? `${money(operationalIncome(plot))} / turn` : "—";

  dom.buyButton.hidden = plot.owner !== "unowned";
  dom.buyButton.disabled = plot.owner !== "unowned" || state.ap < 1 || state.cash < marketPrice(plot);
  dom.buyButton.textContent = `Buy Plot · ${money(marketPrice(plot))}`;

  dom.buildSection.hidden = plot.owner !== "player" || Boolean(plot.building) || Boolean(plot.salePending);
  dom.buildButton.disabled = Boolean(buildingLegality(plot, dom.buildingSelect.value));

  const options = redevelopmentOptions(plot);
  dom.redevelopSection.hidden = plot.owner !== "player" || !plot.building || options.length === 0 || Boolean(plot.salePending);
  if (!dom.redevelopSection.hidden) {
    const selected = dom.redevelopSelect.value;
    dom.redevelopSelect.replaceChildren(...options.map(([id, building]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `${building.name} — pay ${money(redevelopmentCost(plot, id))}`;
      return option;
    }));
    if (options.some(([id]) => id === selected)) dom.redevelopSelect.value = selected;
    const buildingId = dom.redevelopSelect.value;
    const old = BUILDINGS[plot.building.type];
    dom.redevelopPreview.textContent = `${money(BUILDINGS[buildingId].cost)} new cost − ${money(old.cost * 1.2)} old-building credit = ${money(redevelopmentCost(plot, buildingId))}. Operational next turn.`;
    dom.redevelopButton.disabled = Boolean(redevelopmentLegality(plot, buildingId));
  }

  dom.saleSection.hidden = plot.owner !== "player" || Boolean(plot.salePending);
  if (!dom.saleSection.hidden) {
    const salePrice = Math.round(propertyMarketValue(plot) * 0.9);
    dom.salePreview.textContent = state.turn >= MAX_TURN ? "Brokered sales cannot begin on the final turn." : `Lock ${money(salePrice)} (90% of current property value); settle at the start of next turn.`;
    dom.sellPropertyButton.disabled = state.ap < 1 || state.turn >= MAX_TURN;
  }

  let reason = selectedActionReason(plot);
  if (plot.owner === "player" && !plot.building && !plot.salePending) reason = buildingLegality(plot, dom.buildingSelect.value);
  if (plot.owner === "player" && plot.building && options.length && !plot.salePending) reason = redevelopmentLegality(plot, dom.redevelopSelect.value);
  dom.propertyReason.textContent = reason;
}

function rivalCondition() {
  const worth = participantWorth("ai");
  if (state.aiCash < 8000) return "Cash strained";
  if (worth > participantWorth("player") * 1.12) return "Confident";
  if (worth < participantWorth("player") * 0.88) return "Pressured";
  return "Steady";
}

function cityMessage() {
  if (state.turn === 4) return { warning: true, text: "Zoning debate announced: Residential districts may soon reject new factories and department stores." };
  if (state.turn === 5) return { warning: true, text: "Second zoning warning: industrial residential plans face near-term risk." };
  if (state.turn >= 6) return { warning: true, text: "Zoning is active: no new Factory or Department Store on Residential plots." };
  if (economyForTurn(state.turn).id === "prosperity") return { warning: false, text: "Prosperity lifts land values and operating income. Investment trusts are now available." };
  return { warning: false, text: "Opening market: land is stable, credit is broad and every action point matters." };
}

function renderNews() {
  dom.newsList.replaceChildren();
  const records = [
    ...NEWS_ITEMS.filter((item) => item.turn <= state.turn).map((item) => ({ ...item, text: item.headline })),
    ...state.log.map((entry) => ({ turn: entry.turn, type: entry.type || "Activity", source: "Your Operations Desk", text: entry.text })),
  ].sort((a, b) => b.turn - a.turn).slice(0, 18);
  for (const record of records) {
    const item = document.createElement("li");
    item.className = "news-item";
    const top = document.createElement("div");
    top.className = "news-meta";
    const badge = document.createElement("span");
    badge.className = `news-badge news-badge--${record.type.toLowerCase()}`;
    badge.textContent = record.type;
    const source = document.createElement("span");
    source.textContent = `Turn ${record.turn} · ${record.source}`;
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
    item.textContent = "No outstanding loans.";
    dom.loanList.append(item);
    return;
  }
  for (const loan of state.loans) {
    const item = document.createElement("li");
    item.textContent = `${money(loan.principal + loan.interest)} due at the end of turn ${loan.dueTurn}`;
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
    summary.innerHTML = `<div><strong>${security.ticker}</strong><span>${security.name}</span></div><div class="stock-price"><strong>${available ? money(price) : "LOCKED"}</strong><span>${available ? `${change >= 0 ? "+" : ""}${change.toFixed(1)}% this turn` : "Opens in Prosperity"}</span></div>`;
    const facts = document.createElement("p");
    facts.textContent = `Risk ${security.risk} · Your holding ${money(holdingValue)}`;
    const actions = document.createElement("div");
    actions.className = "stock-actions";
    for (const side of ["buy", "sell"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.securityId = id;
      button.dataset.tradeSide = side;
      button.textContent = side === "buy" ? "Buy" : "Sell";
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
  dom.lawStatus.textContent = zoningActive() ? "Residential zoning active" : state.turn >= 4 ? "Zoning under review" : "No active restriction";
  const message = cityMessage();
  dom.marketBrief.classList.toggle("is-warning", message.warning);
  dom.marketBrief.querySelector("p").textContent = message.text;
  dom.bankCredit.textContent = money(Math.max(0, economy.credit - outstandingPrincipal()));
  dom.bankRate.textContent = `${(economy.rate * 100).toFixed(2)}% per turn`;
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
  dom.turnPrompt.textContent = state.ap > 0 ? `${state.ap} AP available` : "Ready to settle";
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
    if (!window.confirm(`Buy ${plot.name} for ${money(price)}? This uses 1 action point.`)) return;
    state.cash -= price;
    state.ap -= 1;
    plot.owner = "player";
    plot.invested = price;
    addLog(`Purchased ${plot.name} for ${money(price)}.`);
    setToast("Property acquired.");
  });
}

function buildSelectedPlot() {
  withCommitLock(() => {
    const plot = getPlot(state.selectedPlotId);
    const buildingId = dom.buildingSelect.value;
    const reason = buildingLegality(plot, buildingId);
    if (reason) { setToast(reason); return; }
    const building = BUILDINGS[buildingId];
    if (!window.confirm(`Build ${building.name} for ${money(building.cost)}? It becomes operational next turn.`)) return;
    state.cash -= building.cost;
    state.ap -= 1;
    plot.invested += building.cost;
    plot.building = { type: buildingId, activeTurn: state.turn + 1 };
    addLog(`Started ${building.name} construction on ${plot.name}.`);
    setToast("Construction started.");
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
    if (!window.confirm(`Replace ${old.name} with ${next.name} for ${money(cost)} after the 120% residual credit?`)) return;
    state.cash -= cost;
    state.ap -= 1;
    plot.invested = plot.invested - old.cost + next.cost;
    plot.building = { type: buildingId, activeTurn: state.turn + 1 };
    addLog(`Redeveloped ${plot.name} from ${old.name} to ${next.name} for ${money(cost)}.`);
    setToast("Redevelopment started.");
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
    if (!window.confirm(`Commit ${plot.name} to a brokered sale for ${money(price)}? It settles next turn and uses 1 action point.`)) return;
    state.ap -= 1;
    plot.salePending = { price, settleTurn: state.turn + 1 };
    addLog(`Brokered sale locked for ${plot.name} at ${money(price)}; settlement next turn.`);
    setToast("Sale price locked.");
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
    if (!security || !["buy", "sell"].includes(side) || !amount) { setToast("Use an order value of at least $1,000 in $1,000 steps."); return; }
    if (state.turn < security.opens) { setToast("This instrument is not available yet."); return; }
    if (state.ap < 1) { setToast("No action points remain this turn."); return; }
    const fee = Math.round(amount * 0.01);
    const price = state.securitiesPrices[id];
    const units = amount / price;
    if (side === "buy") {
      if (state.cash < amount + fee) { setToast("Insufficient cash for the order and fee."); return; }
      if (!window.confirm(`Buy ${money(amount)} of ${security.ticker} plus a ${money(fee)} fee?`)) return;
      state.cash -= amount + fee;
      state.playerHoldings[id] += units;
    } else {
      if ((state.playerHoldings[id] || 0) * price + 0.01 < amount) { setToast("Your holding is smaller than this sell order."); return; }
      if (!window.confirm(`Sell ${money(amount)} of ${security.ticker} and pay a ${money(fee)} fee?`)) return;
      state.cash += amount - fee;
      state.playerHoldings[id] = Math.max(0, state.playerHoldings[id] - units);
    }
    state.ap -= 1;
    addLog(`${side === "buy" ? "Bought" : "Sold"} ${money(amount)} of ${security.ticker}; fee ${money(fee)}.`);
    setToast(`Securities ${side} order completed.`);
    result = true;
  });
  return result;
}

function borrowMoney() {
  withCommitLock(() => {
    const economy = economyForTurn(state.turn);
    if (economy.credit - outstandingPrincipal() < 10000) return;
    if (!window.confirm(`Borrow $10,000 at ${(economy.rate * 100).toFixed(2)}% interest per turn? Principal plus accrued interest is due at the end of turn ${state.turn + 5}.`)) return;
    state.cash += 10000;
    state.loans.push({ id: state.transactionSequence, principal: 10000, interest: 0, rate: economy.rate, dueTurn: state.turn + 5 });
    addLog(`Borrowed $10,000; due at the end of turn ${state.turn + 5}.`);
    setToast("Loan funded. No action point used.");
  });
}

function repayMoney() {
  withCommitLock(() => {
    if (!state.loans.length || state.cash <= 0) return;
    let budget = Math.min(10000, state.cash, currentDebt());
    if (!window.confirm(`Apply up to ${money(budget)} to the oldest loan? This uses no action point.`)) return;
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
    addLog(`Repaid ${money(paid)} of debt.`);
    setToast("Debt payment applied. No action point used.");
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
    addLog(`Paid ${money(due)} in matured principal and interest.`);
    return true;
  }
  finishMatch("bankruptcy", `A matured debt of ${money(due)} could not be paid. Emergency asset sales must be arranged before this deadline.`);
  return false;
}

function aiBuild() {
  const rival = RIVALS[state.rivalId];
  const candidates = state.plots.filter((plot) => plot.owner === "ai" && !plot.building && !zoningReason(plot, rival.building));
  const plot = candidates.sort((a, b) => Number(rival.preferredDistricts.includes(b.district)) - Number(rival.preferredDistricts.includes(a.district)))[0];
  if (!plot || state.aiCash < BUILDINGS[rival.building].cost + rival.reserve) return false;
  const building = BUILDINGS[rival.building];
  state.aiCash -= building.cost;
  plot.invested += building.cost;
  plot.building = { type: rival.building, activeTurn: state.turn + 1 };
  addLog(`${rival.name} began a ${building.name} on ${plot.name}.`);
  return true;
}

function aiBuy() {
  const rival = RIVALS[state.rivalId];
  const candidates = state.plots.filter((plot) => plot.owner === "unowned").sort((a, b) => {
    const preference = Number(rival.preferredDistricts.includes(b.district)) - Number(rival.preferredDistricts.includes(a.district));
    return preference || marketPrice(a) - marketPrice(b);
  });
  const plot = candidates.find((item) => state.aiCash >= marketPrice(item) + rival.reserve);
  if (!plot) return false;
  const price = marketPrice(plot);
  state.aiCash -= price;
  plot.owner = "ai";
  plot.invested = price;
  addLog(`${rival.name} purchased ${plot.name} for ${money(price)}.`);
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
  addLog(`${rival.name} invested ${money(amount)} in ${SECURITIES[id].ticker}.`);
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
    addLog(`${plot.name} brokered sale settled for ${money(price)}.`);
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
  dom.resultTitle.textContent = reason === "bankruptcy" ? "Insolvency" : playerWorth > aiWorth ? "You Lead Manhattan" : playerWorth < aiWorth ? `${RIVALS[state.rivalId].name} Leads` : "Dead Heat";
  dom.resultSummary.textContent = detail || `After ${MAX_TURN} turns, ${playerWorth >= aiWorth ? "your portfolio held its ground" : "the rival portfolio finished ahead"}.`;
  dom.resultPlayerWorth.textContent = money(playerWorth);
  dom.resultRivalWorth.textContent = money(aiWorth);
  dom.resultPlayerSecurities.textContent = money(securitiesValue("player"));
  dom.resultRivalSecurities.textContent = money(securitiesValue("ai"));
  dom.resultModal.classList.add("is-open");
}

function endTurn() {
  withCommitLock(() => {
    if (!window.confirm(`End turn ${state.turn}? Income, debt interest and the rival action will settle.`)) return;
    aiAct();
    if (state.turn >= MAX_TURN) { finishMatch(); return; }
    state.turn += 1;
    settlePendingSales();
    repriceSecurities();
    const playerIncome = settleIncome("player");
    const aiIncome = settleIncome("ai");
    state.cash += playerIncome;
    state.aiCash += aiIncome;
    addLog(`Operating settlement: you ${money(playerIncome)}, rival ${money(aiIncome)}.`);
    if (!settleLoans()) return;
    state.ap = 3;
    if (state.turn === 6) addLog("Residential zoning restrictions are now active.", "Rumor");
    setToast(`Turn ${state.turn} begins.`);
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
  setToast("Match saved in this browser.");
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
    return { ...blueprint, ...oldPlot, price: blueprint?.price ?? oldPlot.price, salePending: oldPlot.salePending || null };
  });
  migrated.log = (migrated.log || []).map((entry) => ({ type: entry.type || "Activity", ...entry }));
  return migrated;
}

function validLoadedState(candidate) {
  return candidate && [1, 2].includes(candidate.version) && RIVALS[candidate.rivalId] && Number.isInteger(candidate.turn) && candidate.turn >= 1 && candidate.turn <= MAX_TURN && Number.isFinite(candidate.cash) && Number.isFinite(candidate.aiCash) && Array.isArray(candidate.plots) && candidate.plots.length === PLOT_BLUEPRINTS.length;
}

function loadGame() {
  const raw = window.localStorage.getItem(SAVE_KEY) || window.localStorage.getItem(LEGACY_SAVE_KEY);
  if (!raw) { setToast("No saved match was found."); return false; }
  try {
    const parsed = JSON.parse(raw);
    if (!validLoadedState(parsed)) throw new Error("Invalid save structure");
    state = migrateState(parsed);
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    dom.startModal.classList.remove("is-open");
    dom.resultModal.classList.remove("is-open");
    render();
    setToast(parsed.version === 1 ? "Legacy M0 save migrated and loaded." : "Saved match loaded.");
    return true;
  } catch (error) {
    console.error(error);
    setToast("The saved match is invalid and was not loaded.");
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
  setToast(`Match started against ${RIVALS[rivalId].name}.`);
  return true;
}

function restartFlow() {
  if (state && !state.finished && !window.confirm("Abandon this match and choose a new rival? Your saved match will remain available.")) return;
  state = null;
  dom.resultModal.classList.remove("is-open");
  dom.startModal.classList.add("is-open");
  dom.startLoadButton.hidden = !window.localStorage.getItem(SAVE_KEY) && !window.localStorage.getItem(LEGACY_SAVE_KEY);
}

function collectDom() {
  const ids = ["toast", "plot-layer", "empty-property", "property-details", "plot-code", "plot-name", "plot-district", "plot-zone", "plot-owner", "plot-price", "plot-building", "plot-income", "buy-button", "building-select", "build-button", "redevelop-select", "redevelop-preview", "redevelop-button", "sell-property-button", "sale-preview", "property-reason", "turn-value", "economy-value", "cash-value", "debt-value", "credit-value", "worth-value", "ap-value", "turn-prompt", "end-turn-button", "rival-name", "rival-style", "rival-condition", "rival-worth", "law-status", "market-brief", "news-list", "bank-credit", "bank-rate", "borrow-button", "repay-button", "loan-list", "stock-order-amount", "stock-list", "save-button", "load-button", "restart-button", "start-modal", "start-load-button", "help-modal", "settings-modal", "result-modal", "result-title", "result-summary", "result-player-worth", "result-rival-worth", "result-player-securities", "result-rival-securities", "result-restart-button", "help-button", "settings-button"];
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
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
else initializeApp();

const testApi = {
  getState: () => state ? structuredClone(state) : null,
  startMatch, switchOperationsTab, buySelectedPlot, buildSelectedPlot, redevelopSelectedPlot, sellSelectedProperty,
  tradeSecurity, borrowMoney, repayMoney, endTurn, saveGame, loadGame,
  economyForTurn, participantWorth, propertyMarketValue, securitiesValue,
};

if (Object.isExtensible(window)) window.M0Game = testApi;
if (Object.isExtensible(document)) document.M0Game = testApi;

"use strict";

const MAX_TURN = 8;
const SAVE_KEY = "roaring_times_m0_web_save_v1";

const RIVALS = {
  tycoon: {
    name: "Tycoon",
    style: "Industry & transport",
    preferredDistricts: ["Midtown", "Hell's Kitchen"],
    building: "factory",
    reserve: 8000,
  },
  landlady: {
    name: "Landlady",
    style: "Residential income",
    preferredDistricts: ["Central Park District", "Lower East Side"],
    building: "standard_apartment",
    reserve: 12000,
  },
  shark: {
    name: "Shark",
    style: "Cheap land & cash",
    preferredDistricts: ["Brooklyn Bridgehead", "Lower East Side"],
    building: "department_store",
    reserve: 26000,
  },
};

const BUILDINGS = {
  standard_apartment: { name: "Standard Apartment", short: "APT", cost: 8000, income: 1000, maintenance: 200 },
  luxury_apartment: { name: "Luxury Apartment", short: "LUX", cost: 25000, income: 2800, maintenance: 800 },
  factory: { name: "Factory", short: "FAC", cost: 15000, income: 1900, maintenance: 500 },
  department_store: { name: "Department Store", short: "STORE", cost: 30000, income: 3600, maintenance: 1000 },
};

const PLOT_BLUEPRINTS = [
  { id: "cp_01", name: "Riverside Heights", district: "Central Park District", zone: "Residential", price: 21000, x: 35, y: 8, w: 14, h: 9, shape: "polygon(6% 9%, 91% 0, 100% 89%, 12% 100%)" },
  { id: "cp_02", name: "Museum Row", district: "Central Park District", zone: "Residential", price: 23000, x: 50, y: 8, w: 14, h: 9, shape: "polygon(0 0, 92% 7%, 100% 100%, 8% 91%)" },
  { id: "cp_public", name: "Central Park", district: "Central Park District", zone: "Public", price: 0, x: 41, y: 18, w: 19, h: 13, owner: "government", shape: "polygon(10% 0, 93% 8%, 100% 90%, 0 100%)" },
  { id: "uw_01", name: "West End Blocks", district: "Central Park District", zone: "Residential", price: 18000, x: 30, y: 24, w: 11, h: 10, shape: "polygon(8% 0, 100% 8%, 92% 100%, 0 89%)" },
  { id: "ue_01", name: "East Side Court", district: "Central Park District", zone: "Residential", price: 19500, x: 60, y: 24, w: 11, h: 10, shape: "polygon(0 7%, 88% 0, 100% 92%, 9% 100%)" },
  { id: "mt_01", name: "Garment Square", district: "Midtown", zone: "Business", price: 17000, x: 35, y: 36, w: 14, h: 10, shape: "polygon(0 7%, 93% 0, 100% 88%, 8% 100%)" },
  { id: "mt_02", name: "Grand Avenue", district: "Midtown", zone: "Business", price: 24000, x: 50, y: 36, w: 15, h: 10, shape: "polygon(7% 0, 100% 9%, 92% 100%, 0 89%)" },
  { id: "hk_01", name: "Rail Yard West", district: "Hell's Kitchen", zone: "Unrestricted", price: 10500, x: 27, y: 48, w: 14, h: 10, shape: "polygon(12% 0, 100% 8%, 88% 100%, 0 91%)" },
  { id: "mt_03", name: "Herald Blocks", district: "Midtown", zone: "Business", price: 18500, x: 43, y: 48, w: 14, h: 10, shape: "polygon(0 8%, 90% 0, 100% 91%, 8% 100%)" },
  { id: "les_01", name: "Orchard Courts", district: "Lower East Side", zone: "Residential", price: 11000, x: 58, y: 48, w: 14, h: 10, shape: "polygon(8% 0, 100% 10%, 91% 100%, 0 88%)" },
  { id: "hk_02", name: "Foundry Lane", district: "Hell's Kitchen", zone: "Unrestricted", price: 9000, x: 29, y: 60, w: 13, h: 10, shape: "polygon(0 6%, 90% 0, 100% 90%, 10% 100%)" },
  { id: "les_02", name: "Essex Market", district: "Lower East Side", zone: "Business", price: 12500, x: 57, y: 60, w: 14, h: 10, shape: "polygon(9% 0, 100% 7%, 90% 100%, 0 92%)" },
  { id: "lm_01", name: "Civic Exchange", district: "Lower Manhattan", zone: "Business", price: 20500, x: 37, y: 70, w: 14, h: 9, shape: "polygon(0 9%, 92% 0, 100% 91%, 7% 100%)" },
  { id: "lm_public", name: "City Hall", district: "Lower Manhattan", zone: "Public", price: 0, x: 52, y: 70, w: 12, h: 9, owner: "government", shape: "polygon(8% 0, 100% 8%, 91% 100%, 0 90%)" },
  { id: "lm_02", name: "Wall Street Corner", district: "Lower Manhattan", zone: "Business", price: 26000, x: 39, y: 81, w: 13, h: 9, shape: "polygon(0 5%, 91% 0, 100% 87%, 10% 100%)" },
  { id: "lm_03", name: "Battery Warehouses", district: "Lower Manhattan", zone: "Unrestricted", price: 15000, x: 49, y: 88, w: 12, h: 8, shape: "polygon(10% 0, 100% 12%, 88% 100%, 0 86%)" },
  { id: "bb_01", name: "Bridge Landing", district: "Brooklyn Bridgehead", zone: "Unrestricted", price: 8000, x: 76, y: 75, w: 13, h: 10, shape: "polygon(0 11%, 90% 0, 100% 89%, 9% 100%)" },
  { id: "bb_02", name: "Dockside Lots", district: "Brooklyn Bridgehead", zone: "Business", price: 9500, x: 80, y: 87, w: 13, h: 9, shape: "polygon(8% 0, 100% 9%, 92% 100%, 0 88%)" },
];

const dom = {};
let state = null;
let busy = false;
let toastTimer = null;

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.round(value));
}

function compactMoney(value) {
  if (Math.abs(value) >= 1000) return `$${Math.round(value / 1000)}k`;
  return `$${Math.round(value)}`;
}

function economyForTurn(turn) {
  if (turn <= 2) return { id: "opening", name: "Opening", market: 1, income: 1, credit: 100000, rate: 0.0025 };
  if (turn <= 4) return { id: "prosperity", name: "Prosperity", market: 1.12, income: 1.18, credit: 110000, rate: 0.0025 };
  if (turn <= 6) return { id: "overheating", name: "Overheating", market: 1.22, income: 1.08, credit: 80000, rate: 0.006 };
  return { id: "adjustment", name: "Adjustment", market: 0.9, income: 0.78, credit: 60000, rate: 0.0075 };
}

function zoningActive() {
  return state && state.turn >= 6;
}

function clonePlots() {
  return PLOT_BLUEPRINTS.map((plot) => ({ ...plot, owner: plot.owner || "unowned", building: null, invested: 0 }));
}

function createInitialState(rivalId) {
  const plots = clonePlots();
  const rivalStarts = {
    tycoon: ["hk_01", "mt_01"],
    landlady: ["cp_01", "les_01"],
    shark: ["bb_01", "hk_02"],
  };
  let aiCash = 50000;
  for (const id of rivalStarts[rivalId]) {
    const plot = plots.find((item) => item.id === id);
    plot.owner = "ai";
    plot.invested = plot.price;
    aiCash -= plot.price;
  }
  return {
    version: 1,
    rivalId,
    turn: 1,
    ap: 3,
    cash: 50000,
    aiCash,
    loans: [],
    plots,
    selectedPlotId: null,
    log: [{ turn: 1, text: `${RIVALS[rivalId].name} enters the Manhattan market on equal starting value.` }],
    finished: false,
    transactionSequence: 1,
  };
}

function getPlot(id) {
  return state?.plots.find((plot) => plot.id === id) || null;
}

function currentDebt() {
  if (!state) return 0;
  return state.loans.reduce((sum, loan) => sum + loan.principal + loan.interest, 0);
}

function outstandingPrincipal() {
  if (!state) return 0;
  return state.loans.reduce((sum, loan) => sum + loan.principal, 0);
}

function marketPrice(plot) {
  return Math.round(plot.price * economyForTurn(state?.turn || 1).market);
}

function plotBuildingValue(plot) {
  if (!plot.building) return 0;
  return Math.round(BUILDINGS[plot.building.type].cost * economyForTurn(state.turn).market);
}

function participantWorth(owner) {
  if (!state) return 0;
  const cash = owner === "player" ? state.cash : state.aiCash;
  const assets = state.plots
    .filter((plot) => plot.owner === owner)
    .reduce((sum, plot) => sum + marketPrice(plot) + plotBuildingValue(plot), 0);
  return cash + assets - (owner === "player" ? currentDebt() : 0);
}

function operationalIncome(plot) {
  if (!plot.building || plot.building.activeTurn > state.turn) return 0;
  const building = BUILDINGS[plot.building.type];
  const gross = Math.round(building.income * economyForTurn(state.turn).income);
  return gross - building.maintenance;
}

function setToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => dom.toast.classList.remove("is-visible"), 1800);
}

function addLog(text) {
  state.log.unshift({ turn: state.turn, text });
  state.log = state.log.slice(0, 9);
}

function withCommitLock(action) {
  if (!state || state.finished || busy) return;
  busy = true;
  try {
    action();
    state.transactionSequence += 1;
    render();
  } finally {
    window.setTimeout(() => { busy = false; }, 120);
  }
}

function plotMark(plot) {
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
    button.style.left = `${plot.x}%`;
    button.style.top = `${plot.y}%`;
    button.style.width = `${plot.w}%`;
    button.style.height = `${plot.h}%`;
    button.style.setProperty("--shape", plot.shape);
    button.setAttribute("aria-label", `${plot.name}, ${plot.owner}, ${plot.building ? BUILDINGS[plot.building.type].name : "empty"}`);
    const mark = document.createElement("span");
    mark.className = "plot-mark";
    mark.textContent = plotMark(plot);
    button.append(mark);
    button.addEventListener("click", () => {
      state.selectedPlotId = plot.id;
      render();
    });
    dom.plotLayer.append(button);
  }
}

function selectedActionReason(plot) {
  if (!plot) return "Select a plot to inspect it.";
  if (plot.owner === "government") return "Public land is not available in this M0 prototype.";
  if (plot.owner === "ai") return "This property belongs to your rival.";
  if (plot.owner === "unowned" && state.ap < 1) return "No action points remain this turn.";
  if (plot.owner === "unowned" && state.cash < marketPrice(plot)) return "Insufficient cash. Borrowing is always explicit.";
  if (plot.owner === "player" && plot.building) {
    return plot.building.activeTurn > state.turn ? "Construction becomes operational next turn." : "This building is producing income.";
  }
  return "";
}

function buildingLegality(plot, buildingId) {
  if (!plot || plot.owner !== "player") return "Own an empty plot before building.";
  if (plot.building) return "This plot already has a building.";
  if (state.ap < 1) return "No action points remain this turn.";
  const building = BUILDINGS[buildingId];
  if (state.cash < building.cost) return `You need ${money(building.cost)} cash.`;
  if (zoningActive() && plot.zone === "Residential" && ["factory", "department_store"].includes(buildingId)) {
    return "The zoning rule now blocks new factories and stores on Residential plots.";
  }
  return "";
}

function renderProperty() {
  const plot = getPlot(state.selectedPlotId);
  dom.emptyProperty.hidden = Boolean(plot);
  dom.propertyDetails.hidden = !plot;
  if (!plot) return;

  dom.plotCode.textContent = plot.id;
  dom.plotName.textContent = plot.name;
  dom.plotDistrict.textContent = plot.district;
  dom.plotZone.textContent = plot.zone;
  dom.plotOwner.textContent = plot.owner === "player" ? "You" : plot.owner === "ai" ? RIVALS[state.rivalId].name : plot.owner === "government" ? "Public" : "Available";
  dom.plotPrice.textContent = plot.owner === "government" ? "Not for sale" : money(marketPrice(plot));
  dom.plotBuilding.textContent = plot.building ? `${BUILDINGS[plot.building.type].name}${plot.building.activeTurn > state.turn ? " (Building)" : ""}` : "Empty land";
  dom.plotIncome.textContent = plot.building ? `${money(operationalIncome(plot))} / turn` : "—";

  dom.buyButton.hidden = plot.owner !== "unowned";
  dom.buyButton.disabled = plot.owner !== "unowned" || state.ap < 1 || state.cash < marketPrice(plot);
  dom.buyButton.textContent = `Buy Plot · ${money(marketPrice(plot))}`;
  dom.buildSection.hidden = plot.owner !== "player" || Boolean(plot.building);
  dom.buildButton.disabled = Boolean(buildingLegality(plot, dom.buildingSelect.value));
  dom.propertyReason.textContent = plot.owner === "player" && !plot.building ? buildingLegality(plot, dom.buildingSelect.value) : selectedActionReason(plot);
}

function renderLedger() {
  dom.ledgerList.replaceChildren();
  for (const entry of state.log) {
    const item = document.createElement("li");
    const turn = document.createElement("span");
    turn.className = "ledger-turn";
    turn.textContent = `TURN ${entry.turn}`;
    item.append(turn, document.createTextNode(entry.text));
    dom.ledgerList.append(item);
  }
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
  if (state.turn === 5) return { warning: true, text: "Second zoning warning: industrial plans on Residential plots are now a near-term risk." };
  if (state.turn >= 6) return { warning: true, text: "Prototype zoning is active: no new Factory or Department Store on Residential plots." };
  if (economyForTurn(state.turn).id === "prosperity") return { warning: false, text: "Prosperity lifts land values and operating income. Expansion is getting expensive." };
  return { warning: false, text: "Opening market: land is stable, credit is broad and every action point matters." };
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
  dom.rivalName.textContent = RIVALS[state.rivalId].name;
  dom.rivalStyle.textContent = RIVALS[state.rivalId].style;
  dom.rivalCondition.textContent = rivalCondition();
  dom.rivalWorth.textContent = money(participantWorth("ai"));
  dom.turnPrompt.textContent = state.ap > 0 ? `Spend up to ${state.ap} more action point${state.ap === 1 ? "" : "s"}, or end the turn.` : "No action points remain. End the turn to settle income.";
  const message = cityMessage();
  dom.eventCard.classList.toggle("is-warning", message.warning);
  dom.eventCard.querySelector("p").textContent = message.text;
  dom.borrowButton.disabled = Math.max(0, economy.credit - outstandingPrincipal()) < 10000;
  dom.repayButton.disabled = currentDebt() <= 0 || state.cash <= 0;
  dom.saveButton.disabled = false;
  dom.loadButton.disabled = !window.localStorage.getItem(SAVE_KEY);
}

function render() {
  if (!state) return;
  renderStatus();
  renderMap();
  renderProperty();
  renderLedger();
}

function buySelectedPlot() {
  withCommitLock(() => {
    const plot = getPlot(state.selectedPlotId);
    if (!plot || plot.owner !== "unowned") return;
    const price = marketPrice(plot);
    if (state.ap < 1 || state.cash < price) return;
    state.cash -= price;
    state.ap -= 1;
    plot.owner = "player";
    plot.invested = price;
    addLog(`You purchased ${plot.name} for ${money(price)}.`);
    setToast(`${plot.name} acquired.`);
  });
}

function buildSelectedPlot() {
  withCommitLock(() => {
    const plot = getPlot(state.selectedPlotId);
    const buildingId = dom.buildingSelect.value;
    const reason = buildingLegality(plot, buildingId);
    if (reason) {
      setToast(reason);
      return;
    }
    const building = BUILDINGS[buildingId];
    state.cash -= building.cost;
    state.ap -= 1;
    plot.invested += building.cost;
    plot.building = { type: buildingId, activeTurn: state.turn + 1 };
    addLog(`${building.name} started on ${plot.name}; operations begin next turn.`);
    setToast(`${building.name} under construction.`);
  });
}

function borrow() {
  const economy = economyForTurn(state.turn);
  if (Math.max(0, economy.credit - outstandingPrincipal()) < 10000) return;
  if (!window.confirm(`Borrow $10,000 at ${(economy.rate * 100).toFixed(2)}% per turn, due on turn ${state.turn + 6}?`)) return;
  withCommitLock(() => {
    state.cash += 10000;
    state.loans.push({ id: `loan_${state.transactionSequence}`, principal: 10000, interest: 0, rate: economy.rate, dueTurn: state.turn + 6 });
    addLog(`You borrowed $10,000 at ${(economy.rate * 100).toFixed(2)}% per turn; due turn ${state.turn + 6}.`);
    setToast("Loan deposited. Watch the due turn.");
  });
}

function repay() {
  withCommitLock(() => {
    if (!state.loans.length || state.cash <= 0) return;
    const loan = state.loans[0];
    let amount = Math.min(10000, state.cash, loan.interest + loan.principal);
    const paid = amount;
    const interestPaid = Math.min(loan.interest, amount);
    loan.interest -= interestPaid;
    amount -= interestPaid;
    loan.principal -= Math.min(loan.principal, amount);
    state.cash -= paid;
    if (loan.principal <= 0 && loan.interest <= 0) state.loans.shift();
    addLog(`You repaid ${money(paid)}; interest was cleared before principal.`);
    setToast(`${money(paid)} repaid.`);
  });
}

function settleParticipant(owner) {
  const income = state.plots
    .filter((plot) => plot.owner === owner)
    .reduce((sum, plot) => sum + operationalIncome(plot), 0);
  if (owner === "player") state.cash += income;
  else state.aiCash += income;
  return income;
}

function chooseAiPlot() {
  const rival = RIVALS[state.rivalId];
  const candidates = state.plots.filter((plot) => plot.owner === "unowned" && plot.price > 0 && state.aiCash - marketPrice(plot) >= rival.reserve);
  candidates.sort((a, b) => {
    if (state.rivalId === "shark") return marketPrice(a) - marketPrice(b);
    const aPreferred = rival.preferredDistricts.includes(a.district) ? 1 : 0;
    const bPreferred = rival.preferredDistricts.includes(b.district) ? 1 : 0;
    return bPreferred - aPreferred || marketPrice(b) - marketPrice(a);
  });
  return candidates[0] || null;
}

function chooseAiBuildingPlot() {
  return state.plots.find((plot) => plot.owner === "ai" && !plot.building && !(zoningActive() && plot.zone === "Residential" && ["factory", "department_store"].includes(RIVALS[state.rivalId].building)));
}

function aiAct() {
  const rival = RIVALS[state.rivalId];
  const building = BUILDINGS[rival.building];
  const buildPlot = chooseAiBuildingPlot();
  if (buildPlot && state.aiCash - building.cost >= rival.reserve) {
    state.aiCash -= building.cost;
    buildPlot.invested += building.cost;
    buildPlot.building = { type: rival.building, activeTurn: state.turn + 1 };
    addLog(`${rival.name} starts a ${building.name} on ${buildPlot.name}.`);
    return;
  }

  const target = chooseAiPlot();
  if (target) {
    const price = marketPrice(target);
    state.aiCash -= price;
    target.owner = "ai";
    target.invested = price;
    addLog(`${rival.name} buys ${target.name} for ${money(price)}.`);
  } else {
    addLog(`${rival.name} holds cash and passes this turn.`);
  }
}

function accrueAndResolveLoans() {
  for (const loan of state.loans) {
    loan.interest += Math.round(loan.principal * loan.rate);
  }
  const due = state.loans.filter((loan) => loan.dueTurn <= state.turn);
  for (const loan of due) {
    const obligation = loan.principal + loan.interest;
    if (state.cash >= obligation) {
      state.cash -= obligation;
      addLog(`Matured loan repaid automatically for ${money(obligation)}.`);
      state.loans = state.loans.filter((item) => item.id !== loan.id);
    } else {
      addLog(`Prototype bankruptcy: ${money(obligation)} loan matured without enough cash.`);
      finishMatch(true);
      return false;
    }
  }
  return true;
}

function endTurn() {
  if (!state || state.finished || busy) return;
  if (state.ap > 0 && !window.confirm(`End turn with ${state.ap} unused action point${state.ap === 1 ? "" : "s"}?`)) return;
  withCommitLock(() => {
    const playerIncome = settleParticipant("player");
    const aiIncome = settleParticipant("ai");
    addLog(`Settlement: you ${playerIncome >= 0 ? "received" : "paid"} ${money(Math.abs(playerIncome))}; rival net ${money(aiIncome)}.`);
    if (!accrueAndResolveLoans()) return;
    aiAct();

    if (state.turn >= MAX_TURN) {
      finishMatch(false);
      return;
    }

    state.turn += 1;
    state.ap = 3;
    if (state.turn === 4) addLog("Public zoning debate begins. Residential industrial plans now carry visible risk.");
    if (state.turn === 6) addLog("Prototype zoning takes effect: no new Factory or Department Store on Residential land.");
    setToast(`Turn ${state.turn}: ${economyForTurn(state.turn).name}.`);
  });
}

function finishMatch(bankrupt) {
  state.finished = true;
  const playerWorth = participantWorth("player");
  const aiWorth = participantWorth("ai");
  let summary;
  if (bankrupt) summary = "Debt matured without enough cash. The prototype records a bankruptcy defeat.";
  else if (playerWorth > aiWorth) summary = `You outbuilt ${RIVALS[state.rivalId].name} and finished with the stronger portfolio.`;
  else if (playerWorth < aiWorth) summary = `${RIVALS[state.rivalId].name} finished ahead. Try a different mix of cash, buildings and debt.`;
  else summary = "The prototype ends in an exact net-worth tie.";
  dom.resultSummary.textContent = summary;
  dom.resultPlayerWorth.textContent = money(playerWorth);
  dom.resultRivalWorth.textContent = money(aiWorth);
  dom.resultModal.classList.add("is-open");
}

function startMatch(rivalId) {
  state = createInitialState(rivalId);
  dom.startModal.classList.remove("is-open");
  dom.resultModal.classList.remove("is-open");
  render();
  setToast(`Match started against ${RIVALS[rivalId].name}.`);
}

function saveGame() {
  if (!state) return;
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  dom.startLoadButton.hidden = false;
  renderStatus();
  setToast("Prototype saved in this browser.");
}

function validLoadedState(loaded) {
  if (!loaded || loaded.version !== 1 || !RIVALS[loaded.rivalId]) return false;
  if (!Number.isInteger(loaded.turn) || loaded.turn < 1 || loaded.turn > MAX_TURN) return false;
  if (!Number.isFinite(loaded.cash) || !Number.isFinite(loaded.aiCash) || !Number.isInteger(loaded.ap)) return false;
  if (!Array.isArray(loaded.plots) || loaded.plots.length !== PLOT_BLUEPRINTS.length) return false;
  if (!Array.isArray(loaded.loans) || !Array.isArray(loaded.log)) return false;
  const expectedIds = new Set(PLOT_BLUEPRINTS.map((plot) => plot.id));
  return loaded.plots.every((plot) => expectedIds.has(plot.id) && ["unowned", "player", "ai", "government"].includes(plot.owner));
}

function loadGame() {
  const raw = window.localStorage.getItem(SAVE_KEY);
  if (!raw) {
    setToast("No prototype save found.");
    return;
  }
  const previousState = state;
  try {
    const loaded = JSON.parse(raw);
    if (!validLoadedState(loaded)) throw new Error("Unsupported save");
    state = loaded;
    dom.startModal.classList.remove("is-open");
    dom.resultModal.classList.toggle("is-open", Boolean(state.finished));
    if (state.finished) {
      const playerWorth = participantWorth("player");
      const aiWorth = participantWorth("ai");
      dom.resultSummary.textContent = "Loaded completed prototype match.";
      dom.resultPlayerWorth.textContent = money(playerWorth);
      dom.resultRivalWorth.textContent = money(aiWorth);
    }
    render();
    setToast("Prototype save restored.");
  } catch (error) {
    state = previousState;
    console.error("Unable to load M0 save", error);
    if (state) render();
    setToast("Save could not be loaded; the current match was not changed.");
  }
}

function showNewMatch() {
  if (state && !state.finished && !window.confirm("Leave the current prototype match and choose another rival?")) return;
  dom.resultModal.classList.remove("is-open");
  dom.startModal.classList.add("is-open");
}

function bindDom() {
  const ids = [
    "turn-value", "economy-value", "cash-value", "debt-value", "credit-value", "worth-value", "ap-value",
    "rival-name", "rival-style", "rival-condition", "rival-worth", "event-card", "plot-layer", "map-hint",
    "empty-property", "property-details", "plot-code", "plot-name", "plot-district", "plot-zone", "plot-owner",
    "plot-price", "plot-building", "plot-income", "buy-button", "building-select", "build-button", "property-reason",
    "turn-prompt", "borrow-button", "repay-button", "end-turn-button", "ledger-list", "save-button", "load-button",
    "restart-button", "help-button", "start-modal", "start-load-button", "help-modal", "result-modal", "result-summary",
    "result-player-worth", "result-rival-worth", "result-restart-button", "toast",
  ];
  for (const id of ids) {
    const key = id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    dom[key] = document.getElementById(id);
  }
  dom.buildSection = document.querySelector(".build-section");
}

function bindEvents() {
  document.querySelectorAll("[data-rival]").forEach((button) => button.addEventListener("click", () => startMatch(button.dataset.rival)));
  document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.closeModal).classList.remove("is-open")));
  dom.buyButton.addEventListener("click", buySelectedPlot);
  dom.buildButton.addEventListener("click", buildSelectedPlot);
  dom.buildingSelect.addEventListener("change", renderProperty);
  dom.borrowButton.addEventListener("click", borrow);
  dom.repayButton.addEventListener("click", repay);
  dom.endTurnButton.addEventListener("click", endTurn);
  dom.saveButton.addEventListener("click", saveGame);
  dom.loadButton.addEventListener("click", loadGame);
  dom.startLoadButton.addEventListener("click", loadGame);
  dom.restartButton.addEventListener("click", showNewMatch);
  dom.resultRestartButton.addEventListener("click", showNewMatch);
  dom.helpButton.addEventListener("click", () => dom.helpModal.classList.add("is-open"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") dom.helpModal.classList.remove("is-open");
  });
}

function initialize() {
  bindDom();
  bindEvents();
  const hasSave = Boolean(window.localStorage.getItem(SAVE_KEY));
  dom.loadButton.disabled = !hasSave;
  dom.startLoadButton.hidden = !hasSave;
}

window.addEventListener("DOMContentLoaded", initialize);

window.M0Game = {
  getState: () => state,
  startMatch,
  money,
  economyForTurn,
  participantWorth: (owner) => participantWorth(owner),
};

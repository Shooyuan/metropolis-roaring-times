"use strict";

const U1_BUILDINGS = {
  standard_apartment: { gross: 1400, maintenance: 200 },
  factory: { gross: 2900, maintenance: 500 },
  luxury_apartment: { gross: 3800, maintenance: 800 },
  department_store: { gross: 5200, maintenance: 1000 },
};

const U1_DATES = [
  "APR 14, 1926",
  "MAY 14, 1926",
  "JUN 14, 1926",
  "JUL 14, 1926",
  "AUG 14, 1926",
  "SEP 14, 1926",
  "OCT 14, 1926",
  "NOV 14, 1926",
];

function u1CompactK(value) {
  const abs = Math.abs(value || 0);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1000) {
    const scaled = abs / 1000;
    const digits = scaled >= 100 ? 0 : 1;
    return `${sign}${scaled.toFixed(digits).replace(/\.0$/, "")}k`;
  }
  return `${sign}${Math.round(abs)}`;
}

function u1EconomyIncomeMultiplier(turn) {
  if (turn <= 2) return 1;
  if (turn <= 4) return 1.18;
  if (turn <= 6) return 1.08;
  return 0.78;
}

function u1CurrentDebt(state) {
  return (state.loans || []).reduce((sum, loan) => sum + loan.principal + loan.interest, 0);
}

function u1CurrentIncome(state) {
  const multiplier = u1EconomyIncomeMultiplier(state.turn || 1);
  return (state.plots || []).reduce((sum, plot) => {
    if (plot.owner !== "player" || !plot.building || plot.building.activeTurn > state.turn) return sum;
    const building = U1_BUILDINGS[plot.building.type];
    if (!building) return sum;
    return sum + Math.round(building.gross * multiplier) - building.maintenance;
  }, 0);
}

function refreshU1Status(explicitState = null) {
  const api = window.M0Game;
  const state = explicitState || api?.getState?.();
  const cashNode = document.getElementById("u1-cash-income-value");
  const debtNode = document.getElementById("u1-debt-value");
  const turnNode = document.getElementById("u1-turn-value");
  const dateNode = document.getElementById("u1-date-value");
  const clockNode = document.getElementById("u1-clock-value");
  if (!cashNode || !debtNode || !turnNode || !dateNode) return;
  if (!state) {
    cashNode.textContent = "—";
    debtNode.textContent = "—";
    turnNode.textContent = "—";
    dateNode.textContent = U1_DATES[0];
    if (clockNode) clockNode.textContent = "10:24 AM";
    return;
  }
  const income = u1CurrentIncome(state);
  const incomeText = `${income >= 0 ? "+" : "-"}${u1CompactK(Math.abs(income))}`;
  const incomeNode = document.createElement("span");
  incomeNode.className = income >= 0 ? "is-good" : "is-bad";
  incomeNode.textContent = `（${incomeText}）`;
  cashNode.replaceChildren(document.createTextNode(u1CompactK(state.cash)), incomeNode);
  debtNode.textContent = u1CompactK(u1CurrentDebt(state));
  turnNode.textContent = `${state.turn} / 8`;
  dateNode.textContent = U1_DATES[Math.max(0, Math.min(U1_DATES.length - 1, state.turn - 1))];
  if (clockNode) clockNode.textContent = `${String(9 + state.turn).padStart(2, "0")}:24 AM`;
}

function refreshRailState() {
  const selected = document.querySelector(".u1-panel-tabs [data-operations-tab][aria-selected='true']")?.dataset.operationsTab || "brief";
  document.querySelectorAll(".u1-rail [data-operations-tab]").forEach((button) => {
    const active = button.dataset.operationsTab === selected;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function openPortfolio() {
  document.body.classList.remove("u1-portfolio-closed");
}

function bindU1Layout() {
  document.querySelectorAll("[data-u1-panel='portfolio']").forEach((button) => {
    button.addEventListener("click", () => {
      openPortfolio();
      refreshRailState();
    });
  });
  document.querySelector("[data-u1-close-portfolio]")?.addEventListener("click", () => {
    document.body.classList.add("u1-portfolio-closed");
  });
  const observer = new MutationObserver(refreshRailState);
  document.querySelectorAll(".u1-panel-tabs [data-operations-tab]").forEach((button) => {
    observer.observe(button, { attributes: true, attributeFilter: ["aria-selected"] });
  });
  window.addEventListener("m1w:render", (event) => {
    refreshU1Status(event.detail?.state || null);
    refreshRailState();
  });
  window.addEventListener("m1w:locale-changed", () => {
    window.setTimeout(() => refreshU1Status(), 0);
  });
  window.setInterval(() => refreshU1Status(), 500);
  refreshU1Status();
  refreshRailState();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindU1Layout, { once: true });
else bindU1Layout();

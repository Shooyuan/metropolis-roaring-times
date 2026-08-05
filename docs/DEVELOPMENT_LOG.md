# Metropolis: Roaring Times — Development Log

## M0.1W — Web Graybox Economic and Interface Revision

### Delivered Scope

- changed the playable title to `Metropolis: Roaring Times`;
- replaced the old Investor Brief and bottom command deck with the five-page Operations Desk and top status-bar `End Turn`;
- separated Game Brief, Investment Advice, Bank, Auction House and Stock Market into independently scrolling pages in the approved order;
- added the non-conversational placeholder for the future rubber-hose board mascot;
- applied the approved opening land bands and building gross-income/maintenance tuning;
- implemented strictly upward redevelopment using `max(0, new_cost - 120% × old_original_cost)` with one-turn activation;
- implemented one-action-point brokered sales that lock 90% of property market value and settle at the next turn boundary;
- implemented bonds, industrial shares and a fictional investment trust with deterministic prices, $1,000 order steps, 1% fees and one existing action point per buy/sell;
- included securities in both participants' net worth and result breakdown;
- added classified Historical, Fictional, Rumor and Activity records without inventing real newspaper attribution;
- retained zero-action-point borrowing/repayment, three total action points, zoning and the eight-turn result;
- added v2 local-save state and migration from the original M0 v1 save.

### Verification Performed

- JavaScript syntax, static page/script ID matching and Git whitespace checks;
- local HTTP load and full browser startup;
- exact tab order, top-bar `End Turn` and absence of a fixed bottom action bar;
- purchase, next-turn construction activation and approved operating income;
- Standard Apartment to Factory redevelopment for exactly `$5,400`, with no same/lower-cost option;
- securities buy and sell, 1% fee, action-point consumption and deterministic revaluation;
- bank borrowing and repayment without action-point consumption;
- brokered-sale lock, action-point consumption, next-turn settlement and sold-state transfer;
- Investment Advice classifications and exact approved New York State government-rumor source wording;
- turn-six Residential zoning rejection;
- save, intervening transaction and exact visible-state restoration;
- final-turn brokered-sale rejection and legal eight-turn result;
- visual review at a compact `1280×720` viewport with no document-level overflow.

### Remaining Prototype Risks

- This prototype deliberately uses the simplified M0 maturity-failure result; production bank takeover and emergency auction remain later Godot work.
- Auction stories and bidder behavior still require owner approval and are not represented as working content.
- The 18-plot/eight-turn deterministic tuning demonstrates decisions but does not validate the production 64-plot/20-turn balance.
- Godot, final map interaction, final art, portraits, audio and production accessibility remain unstarted.

### Next Gate

After the M0.1W files pass final review and are committed, stop and request explicit owner approval before any later stage. Godot M0G remains postponed unless the owner changes that decision.

## M0.1D — Economic Loop and Interface Specification Sync

### Owner Decisions Incorporated

- player-facing title changed to `Metropolis: Roaring Times`;
- the left-side system container is named the Integrated Operations Panel and uses tabs in exact order: `Game Brief`, `Investment Advice`, `Bank`, `Auction House`, `Stock Market`;
- `Game Brief` is an independent page and reserves space for a future rubber-hose-style conversational board mascot;
- no fixed bottom action toolbar; `End Turn` moves to the top status bar;
- redevelopment uses `max(0, new_cost - 120% × old_original_cost)`, only for strictly higher original-cost targets and never pays a negative difference;
- ordinary brokered sale consumes one action point, locks 90% of current market value and settles next turn;
- the stock market contains bonds, shares and an investment trust, while futures and broker margin remain deferred;
- every securities buy/sell consumes one of the existing three action points; no separate financial-order resource is added;
- Investment Advice distinguishes verified historical reporting, fictional city news, New York State government rumors and ledger activity.

### Risk Control

The owner supplied the 120% redevelopment credit. Project management added the strictly-higher-cost target rule and zero-payout floor to prevent downgrade or repeat-conversion cash generation while preserving the approved formula. This safeguard was accepted for and implemented in M0.1W.

### Documentation Scope

The root authority, product brief, game rules, vertical-slice scope, art/UI direction, technical architecture, acceptance tests, implementation plan, development log, prototype README and reference-directory README were synchronized before code changes. The original PRD and map reference files remain unchanged.

### Next Gate

Completed in commit `6c4b5a4`; the owner then approved M0.1W implementation.

## M0W — Standalone Web Graybox

### Decision

The owner postponed Godot M0 and requested an immediate plain Web gameplay prototype for investor explanation.

### Delivered Scope

- standalone dependency-free HTML/CSS/JavaScript page;
- visible `M0 WEB GRAYBOX — NOT FINAL ART OR BALANCE` status;
- 18 representative irregular plots and eight compressed turns;
- Tycoon, Landlady and Shark rival selection with equal displayed starting value;
- property inspection, purchase and four building choices;
- three action points, one-turn construction delay and operating settlement;
- explicit borrowing, repayment, locked prototype rate and maturity failure;
- four compressed economy phases;
- zoning warnings and a turn-six Residential construction restriction;
- deterministic rival purchase/build action;
- ledger, restart, local save/load and net-worth result;
- compact `1366×768` investor presentation layout.

### Verification Performed

- JavaScript syntax check;
- Markdown and Git whitespace checks;
- local HTTP load;
- all three rivals start with equal displayed net worth;
- purchase deducts cash and one action point once;
- construction deducts cost/action point and activates next turn;
- loan confirmation, deposit, credit reduction and repayment;
- rapid double-click purchase commits once;
- turn settlement and rival action;
- manual save, state change and exact visible restoration;
- full eight-turn result;
- zoning prevents new Factory construction on a Residential plot from turn six;
- `1366×768` visual inspection with map and command deck in the first viewport;
- browser console contains no warning/error after the tested paths.

### Known Prototype Limits

- This code is not reused by the production Godot project.
- Values and AI heuristics are demonstration tuning, not final balance.
- M0W has 18 plots/eight turns rather than the production 64 plots/20 turns.
- Auction is intentionally absent because story/bidder content requires owner approval.
- Debt maturity uses a simplified bankruptcy result and does not implement production asset disposition.
- Map pan/zoom, final art, portraits, audio, production save schema and final accessibility work are not included.
- Save data is local to the current browser/site storage.

### Superseded Next Gate

The original M0W review led to the M0.1D decisions above. M0.1W was subsequently approved and implemented; Godot M0G remains postponed and still requires separate owner approval.

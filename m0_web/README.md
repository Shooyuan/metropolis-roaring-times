# Metropolis: Roaring Times — M0 Web Graybox

This is a disposable, dependency-free investor gameplay prototype. It is not the production Godot codebase, final art, final balance or the complete vertical-slice content.

## Current Implementation Status

Commit `ee6eccf` is the completed original M0W build. Its current HTML still shows the earlier `Roaring Times` title, Investor Brief layout and bottom command deck and does not yet implement redevelopment, brokered sale or securities. Those are known implementation gaps, not the current specification.

The approved M0.1W revision is intentionally not started until the M0.1D documentation stage is tested, committed, reported and separately approved.

## Included

- eight compressed turns;
- 18 representative plots;
- Tycoon, Landlady and Shark rival choices;
- property purchase and four building types;
- construction delay, settlement and economy phases;
- explicit borrowing, repayment and maturity risk;
- simplified rival actions and zoning change;
- browser-local save/load and net-worth result.

## Not Included

- final 64-plot/20-turn scope;
- government or emergency auctions;
- final historical event stories;
- final AI scoring, art, audio or Godot architecture.

## Approved M0.1W Revision Scope

- display `Metropolis: Roaring Times`;
- replace the fixed Investor Brief/bottom command deck with the five-tab Integrated Operations Panel and top-bar `End Turn`;
- add strictly upward redevelopment using the approved 120% credit and zero payout floor;
- add 90% next-turn brokered property sale;
- add bonds, shares and an investment trust, with one existing action point per buy/sell;
- add Investment Advice source classification and keep Auction House free of unapproved story content.

Serve this folder through a local HTTP server for testing. `index.html` is the entry page.

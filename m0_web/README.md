# Metropolis: Roaring Times — M0 Web Graybox

This is a disposable, dependency-free investor gameplay prototype. It is not the production Godot codebase, final art, final balance or the complete vertical-slice content.

## Current Implementation Status

M0.1W replaces the original M0W interface and economic loop. The playable page now uses the approved title, five-page Integrated Operations Panel, top-bar `End Turn`, upward redevelopment, next-turn brokered property sale, three securities instruments and classified Investment Advice feed.

The original M0W baseline remains recorded in commit `ee6eccf`; the M0.1D specification synchronization is recorded in commit `0cd57f4`; the completed M0.1W revision is recorded in commit `baef8ea`. This folder remains a disposable investor-explanation prototype rather than production Godot code, even after M0G established the separate minimal Godot runtime.

## Included

- eight compressed turns;
- 18 representative plots;
- Tycoon, Landlady and Shark rival choices;
- property purchase and four building types;
- strictly upward redevelopment with the 120% residual-value credit;
- 90% brokered property sales that settle next turn;
- bonds, industrial shares and a fictional investment trust;
- construction delay, settlement and economy phases;
- explicit borrowing, repayment and maturity risk;
- simplified rival actions and zoning change;
- five independent Operations Desk pages and classified news/activity records;
- browser-local save/load and net-worth result.

## Not Included

- final 64-plot/20-turn scope;
- government or emergency auctions;
- final historical event stories;
- final AI scoring, art, audio or Godot architecture.

## Prototype Boundaries

- Debt maturity still uses the documented simplified M0 bankruptcy result; production bank takeover and emergency disposition arrive in later Godot stages.
- The Auction House truthfully shows `No Scheduled Auctions`; owner-approved auction stories and bidder behavior have not been invented.
- News labeled `Historical` uses institutional historical-summary wording, not fabricated newspaper attribution.
- Save schema v2 automatically migrates the original M0 v1 browser save when one exists.

Serve this folder through a local HTTP server for testing. `index.html` is the entry page.

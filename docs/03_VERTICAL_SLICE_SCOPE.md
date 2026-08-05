# Metropolis: Roaring Times — Vertical Slice Scope

> Document role: binding content and feature boundary for the first playable release
>
> Mode: `vertical_slice`
>
> Player-facing language: English
>
> Product authority: `../00_PROJECT_CONTEXT.md`
>
> Rule authority: `02_GAME_RULES.md`

## 1. Release Objective

Deliver one complete, replayable 20-turn match in which a human player competes against one selected AI opponent on a stylized New York property map.

The release must prove the complete loop:

```text
inspect property
→ finance a plan
→ buy or bid
→ construct, redevelop, demolish or sell
→ optionally trade a compact securities market
→ settle income and debt
→ respond to economy and zoning
→ survive loan maturity
→ finish and understand the final ranking
```

The release is not considered complete when only isolated systems or a visual prototype work.

## 2. Fixed Match Scope

- 20 turns.
- Expected duration: 20–30 minutes.
- One human player versus one active AI opponent.
- Player selects Tycoon, Landlady or Shark before the match.
- Three action points per participant per turn.
- Manual save slot: one.
- Autosave slot: one.
- Final ranking after turn 20, with early bankruptcy outcomes.
- Deterministic seed stored with every match and save.

## 3. Fixed Map Scope

### 3.1 Plot Count

- Exactly 64 interactive plots.
- Every plot has a unique stable ID and an irregular polygon.
- Decorative shapes, water, roads and public landmarks do not count toward the 64 plots.
- Every interactive plot must be inspectable and must have a defined owner, district, direct-sale state, auction eligibility, zoning state and adjacency list.

### 3.2 Geography

The map covers:

1. Lower Manhattan.
2. Midtown.
3. Central Park District.
4. Hell's Kitchen and Lower East Side as geographically separate subareas sharing one low-cost mixed-use gameplay category.
5. Brooklyn Bridgehead.

Relative direction must remain recognizable. Street-level and cadastral accuracy are not required.

### 3.3 Public Assets

Required non-purchasable assets:

- Central Park.
- City Hall.
- Public library.
- Brooklyn Bridge.
- Manhattan Bridge.
- Six subway stations.
- One tram line with approximately five stops.

### 3.4 Transit Rules

- Transit is prebuilt and government-owned.
- The player and AI cannot build, buy, demolish or extend transit.
- A plot within one adjacency step of an applicable transit facility receives `+15%` land value and building income.
- Configured Brooklyn Bridgehead plots also receive `+10%` land value from bridge access.
- Multiple ordinary transit bonuses do not stack; only the highest applicable bonus is used.
- The separate bridgehead bonus may apply in addition to one ordinary transit bonus.

## 4. Fixed Building Scope

Four rule-bearing building types:

1. Standard Apartment.
2. Luxury Apartment.
3. Factory.
4. Department Store.

Required behavior:

- construction cost;
- one-turn construction delay;
- maintenance;
- deterministic income;
- district, transit, pollution, economy and compliance modifiers;
- demolition with a 10% construction-cost refund;
- redevelopment only into a legal building with strictly higher original construction cost;
- redevelopment cash cost `max(0, new_cost - 120% × old_original_cost)`, with no negative payout;
- owned, under-construction, operational and non-compliant states.

Required visual quantity:

- three visual variants per building type;
- 12 building appearances total;
- visual variants do not change gameplay values;
- variants are selected deterministically and stored in save data.

No additional income-producing building type may enter the vertical slice without a scope change.

## 5. Fixed AI Scope

Three complete opponent profiles:

- Tycoon.
- Landlady.
- Shark.

All three must support:

- personality-specific starting assets;
- plot valuation;
- direct purchase;
- construction and demolition decisions;
- redevelopment, brokered-sale and securities-trading decisions;
- borrowing and repayment;
- loan-maturity response;
- government-auction bidding;
- zoning awareness;
- economy-phase awareness;
- deterministic debug explanation.

Only one AI is active per match. Testing must cover separate matches against all three.

Required portrait quantity for each profile:

1. Neutral/default.
2. Confident.
3. Hesitant.
4. Angry.
5. Withdraws from auction.

Total: 15 AI expression assets. Expression changes do not alter AI decisions.

## 6. Fixed Economy and Finance Scope

Required systems:

- cash;
- reputation;
- `$100,000` base credit limit;
- phase-based credit-limit multipliers;
- independent six-turn loan contracts;
- locked interest rate at issue;
- partial and full repayment;
- three-, two- and one-turn maturity warnings;
- bank takeover at 70% of current invested cost basis;
- emergency auction starting at 50% of current invested cost basis;
- debt disposition and bankruptcy;
- opening, prosperity, overheating and adjustment phases;
- centralized property revaluation;
- auditable transaction ledger.
- normal brokered property sale at 90% of submission-time market value, consuming one action point and settling next turn;
- Municipal & Railroad Bonds, Industrial Shares and Metropolitan Investment Trust;
- one action point per securities buy or sell, with no extra financial-action resource;
- `$1,000` minimum securities order and `1%` fee;
- deterministic once-per-turn securities pricing and portfolio valuation;
- securities excluded from property-backed credit capacity.

The opening land-price bands are `$6,000–$10,000`, `$11,000–$18,000` and `$19,000–$26,000`. The first building-income baselines are fixed in `02_GAME_RULES.md`; economy, district and event multipliers remain balance data requiring simulation.

## 7. Fixed Auction Scope

### 7.1 Government Auctions

- At least two in every complete match.
- English ascending format.
- Human versus active AI opponent.
- Bounded AI valuation and maximum-round protection.
- Borrowing available inside the bidding interface.
- Win, loss, withdrawal, insufficient funds and no-sale outcomes.
- Each auction has an owner-approved story reason connected to the released plot and current economy.

The actual auction stories are deliberately not defined in this document. They require a separate owner content decision before auction implementation.

### 7.2 Debt Emergency Auctions

- Available only during debt disposition.
- Starting price equals 50% of invested cost basis.
- Can be repeated for multiple owned assets until debt is covered or no eligible asset remains.
- Detailed bidder roster and narrative treatment require the same later auction-content approval.

## 8. Fixed Law Scope

Only the compressed 1916 Zoning Resolution is implemented:

- Turn 10: first public warning.
- Turn 12: second public warning.
- Turn 14: law enacted.
- Turns 15–16: transition warnings.
- Turn 17 onward: full penalties.

Required effects:

- Residential, Business and Unrestricted zoning.
- Residential zones block new Factory and Department Store construction.
- Pre-existing non-compliant buildings remain standing.
- Full non-compliance reduces income by 30% and prevents upgrades.
- Map, property panel and asset overview show compliance state.

Setback, coverage, exchange discount and the remaining seven historical milestones are interfaces only, not playable features.

## 9. Fixed Event Scope

In addition to the two zoning warnings and two government-auction stories, implement exactly four economy events:

- two global events;
- two district-specific events.

Requirements:

- events use the match seed;
- every event has an English headline, short description, duration and explicit rule modifiers;
- affected values and expiration are visible;
- the same event cannot apply twice unless its definition explicitly permits stacking;
- event themes and final numbers are frozen during content and balance work.

The four events may modify the three approved securities through explicit data, but must not introduce additional instruments, commodity futures, unions or citizen simulation.

Every news item declares one of four source classes: verified historical newspaper, fictional newspaper, New York State government source or ledger activity. A real newspaper name can appear only with a verified historical event and source date. Government-law rumors use `Sources familiar with the New York State Government` in the English interface.

Non-mechanical city/news flavor items do not count against the four economy-event limit. Any item that changes a rule value must be one of the approved zoning warnings, auction stories or four configured economy events; the feed cannot silently introduce additional gameplay events.

## 10. Fixed Onboarding Scope

Required English onboarding:

- one static `How to Play` page;
- first-use guidance for inspecting a plot;
- first direct purchase prompt;
- first construction prompt;
- first loan warning;
- first auction prompt;
- first redevelopment prompt;
- first brokered-sale prompt;
- first securities-trade prompt;
- tooltips for all primary buttons, resources, zoning and loan terms.

There is no separate tutorial campaign, voiced tutorial or forced step-by-step tutorial level.

Guidance can be skipped and remains accessible from the pause/help menu.

## 11. Fixed Audio Scope

Minimum audio content:

- one loopable period-inspired background track;
- purchase confirmation sound;
- construction confirmation sound;
- income settlement sound;
- warning/alert sound;
- auction gavel sound.

Audio must have independent music and sound-effect volume controls and a mute option.

Temporary silence does not block early rules milestones, but the required audio must be present and verified in the final Web build.

## 12. Fixed UI and Language Scope

- All player-facing text is English.
- Internal IDs and file names use English `snake_case`.
- The top status bar contains the title `Metropolis: Roaring Times`, turn/economy/finance/action status, `End Turn`, save/help and settings actions.
- The left-side Integrated Operations Panel is required and contains tabs in exact order: `Game Brief`, `Investment Advice`, `Bank`, `Auction House`, `Stock Market`.
- `Game Brief` is a standalone page showing mode, `Standard` ruleset, rival, objective, turn, economy and current law; it reserves space for a future rubber-hose-style conversational board mascot.
- `Investment Advice` is a standalone scrolling news/activity page and is not a fixed block above the other tabs.
- Bank, auction and securities controls appear inside their corresponding tabs; property purchase, construction, redevelopment and sale remain in the right property panel.
- No fixed bottom action toolbar is included. `End Turn` is in the top status bar.
- Map, right property panel, law information, asset overview, auction modal, help page and result screen are required.
- Debt disposition has a dedicated blocking interface.
- AI debug information is development-only and can be toggled.
- Required desktop targets: 1920×1080, 1440×900 and 1366×768.
- Important state cannot rely on color alone.

## 13. Fixed Save and Result Scope

Required:

- one manual save slot;
- one autosave slot;
- exact state restoration;
- no duplicate transaction after loading;
- new-match reset;
- human victory;
- human turn-20 defeat;
- human bankruptcy defeat;
- AI bankruptcy victory;
- final net asset ranking and tie-break explanation;
- summary of major purchases, construction, redevelopment, brokered sales, securities trades, auctions, loans and zoning consequences.

## 14. Quality Requirements

- Core rules run in a headless test environment.
- The entire 20-turn match can be simulated without rendering.
- All transactions are atomic and logged.
- The game has no blocking error, dead turn, infinite auction or unrecoverable modal.
- The Web export runs through a local HTTP server.
- Browser console has no persistent JavaScript, WebGL or Godot errors.
- Final visuals contain no plain test blocks or default Godot controls presented as finished art.

## 15. Explicitly Deferred

- Full 312-turn Classic Mode.
- Playable Extreme and Roaring modes.
- Seven later law milestones.
- Full listed property exchange beyond the approved brokered-sale action.
- Owner-initiated sealed bids.
- Hostile acquisition and poison-pill response.
- Private AI negotiation.
- Player-built tram or subway infrastructure.
- Transit ticket revenue and toll ownership.
- Old-law tenement lifecycle.
- Second city or procedural map.
- Multiplayer, online accounts, cloud saves and leaderboards.
- Mobile, console and unlisted platform work.
- Complex character animation, cinematics, voice acting and citizen simulation.
- Commodity futures, broker margin, short selling, options and individual real-company simulation.
- A live-network conversational mascot; only a future layout reservation and state-driven extension point are in scope.

Deferred systems must not appear as non-functional controls.

## 16. Scope Change Gate

A proposed addition must answer all of the following before work begins:

1. Which vertical-slice risk does it validate?
2. Which existing item becomes smaller or moves out to preserve capacity?
3. Which rule, test and milestone change?
4. What new art, data, save and Web risks appear?
5. Has the owner approved the trade-off?

Without explicit approval, the quantities and exclusions in this document are binding.

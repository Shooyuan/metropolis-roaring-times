# Metropolis: Roaring Times — Vertical Slice Scope

> 当前前置交付：现有 M1W 已接入并验证 v004 正式底图、12 个街区、30 个可购买地块和 52 个历史地标，包含固定缩放、互斥选择、双语详情及原 M0.1 地产经济演示。该网页仍是制作人验证层；老板验收前不启动 Godot 地图实现。

> Document role: binding content and feature boundary for the first playable release
>
> Mode: `vertical_slice`
>
> Player-facing language: English by default, with Simplified Chinese selectable in Settings
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
- One month per turn from June 1915 through January 1917; turn 14 is July 1916.
- Expected duration: 20–30 minutes.
- One human player versus one active AI opponent.
- Player selects Tycoon, Landlady or Shark before the match.
- Three action points per participant per turn.
- Manual save slot: one.
- Autosave slot: one.
- Final ranking after turn 20, with early bankruptcy outcomes.
- Deterministic seed stored with every match and save.

## 3. Fixed Map Scope

### 3.1 Plot Collection

- 地块数量不预设；完整集合等于老板在 `08_PURCHASABLE_BLOCK_GEOMETRY` 中实际绘制并批准的所有闭合地块。
- Every plot has a unique stable ID and an irregular polygon.
- Decorative shapes, water, roads and historical landmarks are not plots.
- Every interactive plot must be inspectable and must have a defined owner, district, direct-sale state, auction eligibility, zoning state and adjacency list.
- A plot cannot cross a district boundary, and only owner-authored geometry creates development rights.

### 3.2 Geography

The map uses the twelve owner-approved Manhattan districts: Inwood, Washington Heights, Harlem, Upper East Side, Upper West Side, Midtown West, Midtown East, Chelsea, West Village, East Village, SoHo and Financial District. The exact stable IDs are defined in `MAP_ASSET_PIPELINE.md`. The former six-district/five-gameplay-area model is retired. Central Park remains a public non-district area, and land across the rivers is non-interactive background in the vertical slice.

Relative direction must remain recognizable. Street-level and cadastral accuracy are not required.

### 3.3 Public Assets and Historical Landmarks

- Central Park is the only public area explicitly locked here as non-purchasable.
- The complete set of historical buildings, churches, bridges, stations, monuments, plazas, parks and public facilities comes only from the owner's finished `07_HISTORICAL_LANDMARKS`; this document does not invent missing landmarks.
- Public/historical assets never become plots merely because they are visible on the map.

### 3.4 Transit Rules

- Transit is prebuilt and government-owned.
- The player and AI cannot build, buy, demolish or extend transit.
- A plot within one adjacency step of an applicable transit facility receives `+15%` land value and building income.
- Multiple ordinary transit bonuses do not stack; only the highest applicable bonus is used.
- The former Brooklyn Bridgehead-specific bonus is retired. A future bridge premium requires an owner-approved explicit plot list.

### 3.5 Map Presentation and District Detail

- Map art, district geometry, plot geometry, building anchors and gameplay overlays share one normalized coordinate system derived from the actual width and height recorded for the owner's Figma vector canvas; no fixed pixel dimensions are required.
- The supplied 1939 map is a development reference only. The owner authors and approves the production Figma base, which must not embed dynamic public or private buildings.
- District boundaries are closed vector shapes authored by the owner and delivered in the authoritative district SVG. Codex converts them to runtime polygons without redrawing, smoothing or changing vertices; the shared-viewBox programmatic overlay verifies alignment against the owner source.
- Hovering uncovered district space displays an indicative district border. Clicking locks the border and opens the district detail page until another district is selected or the selection is explicitly closed.
- At near zoom, a plot or building hit target takes priority over the underlying district.
- Far and middle zoom keep historical-landmark illustrations visible for recognition, hide landmark banners and development-building illustrations, and show a district summary in this exact order: human-purchasable plots, human-owned apartments, human-owned factories, human-owned department stores, major transit facilities, district prosperity.
- `100%—477%` remains district-oriented browsing: landmark illustrations stay visible for recognition, while plot/landmark selection, development-building illustrations and landmark banners remain disabled. From `500%` through the `1500%` maximum, plot boundaries, development-building illustrations and plot/landmark selection remain enabled; landmark banners appear only from `1250%` through `1500%`.
- District prosperity is derived jointly from human and active-AI development, is clamped to `50.0 <= score < 100.0`, and is displayed to one decimal place. Its formula and English level bands are a later owner approval gate.

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

开局地价层级为 `cheap $6,000–$10,000`、`medium $11,000–$18,000`、`expensive $19,000–$26,000`。层级来自老板在 Figma 中对每个地块的分组；精确价格在内容构建时按固定种子生成并版本化，不在每局开局时重抽。首批建筑收入基线见 `02_GAME_RULES.md`；经济、街区和事件倍率仍属于必须模拟校准的平衡数据。

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

- Player-facing text defaults to English; Settings can switch the complete interface to Simplified Chinese immediately.
- Switching language preserves the current match, map camera, selected district/plot, open operations tab and modal state.
- English and Chinese use one interface structure and gameplay implementation. Stable localization keys and structured event records are required; parallel full-page implementations are not allowed.
- Internal IDs and file names use English `snake_case`.
- The authoritative five-module arrangement is defined in `IN_GAME_UI_LAYOUT_SPEC.md`.
- The top status bar contains Turn, Cash, Debt, Credit Left and Config. Exact rival finances remain hidden.
- The left-side Integrated Operations Panel contains tabs in exact order: `News`, `Bank`, `Auction House`, `Stock Market`, beneath the approved marquee title sign.
- `News` integrates Investment Advice, historical/fictional/government/activity reporting and the five-expression ice-cream board mascot.
- `Game Brief` moves into Config. Config also contains Language, Save Game, Load Game and Return to Title, and explicitly excludes Audio, Display and Controls.
- Bank, auction and securities controls appear inside their corresponding tabs; property purchase, construction, redevelopment and sale remain in the right property panel.
- The right detail region includes a permanent proportional mini-map with a red viewport rectangle synchronized to the main map camera.
- The bottom-right turn-control region contains calendar date, economy phase, action-point state and `End Turn`.
- Ending with unused action points warns once unless the player selects the local `Don't show this warning again` preference; zero points ends without that warning.
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
- A live-network conversational mascot; the approved five-image ice-cream mascot is limited to deterministic state-driven presentation.

Deferred systems must not appear as non-functional controls.

## 16. Scope Change Gate

A proposed addition must answer all of the following before work begins:

1. Which vertical-slice risk does it validate?
2. Which existing item becomes smaller or moves out to preserve capacity?
3. Which rule, test and milestone change?
4. What new art, data, save and Web risks appear?
5. Has the owner approved the trade-off?

Without explicit approval, the quantities and exclusions in this document are binding.

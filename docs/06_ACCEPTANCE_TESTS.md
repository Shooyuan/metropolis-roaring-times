# Metropolis: Roaring Times — Acceptance Tests

> Document role: authoritative acceptance and release-gate specification for the vertical slice
>
> Player-facing language: English
>
> Scope authority: `../00_PROJECT_CONTEXT.md` and `01_PRODUCT_BRIEF.md` through `05_TECHNICAL_ARCHITECTURE.md`

## 1. Completion Definition

The 20-turn vertical slice is complete only when:

1. all required automated tests pass at the candidate commit;
2. all required Godot scene and desktop checks pass;
3. the full Chrome Web acceptance set passes;
4. the Safari smoke set has no blocker or serious defect;
5. all owner visual-review gates are approved;
6. there are zero open blocker or serious defects;
7. every open medium defect has been reported to and explicitly accepted by the owner;
8. the exact tested files are saved and committed to Git;
9. the release report identifies versions, seeds, evidence and known limitations.

Passing this documentation stage does not mean the game already passes these future product tests. Each implementation milestone runs the subset applicable to it; the final candidate runs the complete set.

## 2. Test Types and IDs

| Prefix | Type | Purpose |
|---|---|---|
| `DOC` | Document/static check | Markdown, file, schema and content consistency |
| `AUT` | Automated headless test | Deterministic domain rules and simulation |
| `SCN` | Godot scene/runtime check | Scene wiring, input and local application behavior |
| `WEB` | Browser test | Export, storage, browser input, audio and console |
| `PERF` | Performance test | Frame rate, stalls, memory and responsiveness |
| `VIS` | Owner visual review | Composition, art style, readability and final polish |
| `AUD` | Audio review | Playback, controls, balance and required cues |

Every failed case receives a defect ID and severity. A case cannot be marked passed by explanation alone; the recorded evidence must demonstrate the expected result.

## 3. Required Test Environments

### 3.1 Godot Environment

Record for every candidate:

- Godot exact version;
- renderer and export mode;
- operating system version;
- candidate Git commit;
- whether the run is editor, headless, desktop or Web;
- content/rules version and relevant seed.

The implementation uses a Godot 4.x stable release and Compatibility renderer. A version change requires rerunning startup, save and Web smoke checks.

### 3.2 Primary Web Environment

Full Web acceptance uses:

- the latest stable Google Chrome installed on the test date;
- the owner's current MacBook Air as the reference machine;
- a local HTTP server, never `file://`;
- `1366×768` for the performance run;
- `1366×768`, `1440×900` and `1920×1080` for layout review.

The exact Chrome and macOS versions are recorded in the release report.

### 3.3 Safari Smoke Environment

The latest stable Safari installed on the same Mac is a smoke target. Safari must:

- load the Web build;
- start a new match;
- render and navigate the map;
- complete purchase and construction interactions;
- advance at least three turns;
- save, reload the page and restore both the manual and autosave slots in separate checks;
- start audio after user interaction and allow mute;
- avoid blocker and serious defects.

Minor Safari-only visual differences may be recorded. A crash, inability to start, lost/corrupt save, duplicate transaction, dead turn or unusable core interface is not an acceptable “minor difference.”

## 4. Defect Severity and Release Gate

### 4.1 Severity

| Severity | Definition | Examples |
|---|---|---|
| Blocker | Candidate cannot be meaningfully tested or completed | build will not start, unavoidable crash, no playable map |
| Serious | Core result is wrong or progress/data can be lost | duplicated money, incorrect debt failure, corrupt save, auction/turn deadlock |
| Medium | Significant defect with a reliable workaround or limited scope | one panel obscures information at one target resolution |
| Minor | Cosmetic or low-impact defect that does not mislead the player | small alignment issue, brief harmless visual pop |

### 4.2 Gate

- Blocker defects: zero open.
- Serious defects: zero open.
- Medium defects: fixed, or listed with impact/workaround and explicitly accepted by the owner.
- Minor defects: listed and prioritized; owner approval is required only if their combined effect prevents final visual approval.
- A test marked “not run” is not a pass.
- A deferred feature is not a defect only when it has no visible non-functional control and is explicitly out of scope.

## 5. Test Data and Reproducibility

The repository provides stable fixtures for:

- a new human-versus-each-rival match;
- each economy phase;
- active and nearly mature loans;
- government auction states;
- debt disposition with multiple assets;
- redevelopment paths, pending brokered sales and each securities instrument;
- historical, fictional, government-source and activity news records;
- zoning warning, enactment, transition and penalty states;
- turn 20 result and each bankruptcy result;
- valid, old-version, missing-field and corrupted saves.

Automated tests must print their seed and failing assertion. Random seeds generated during exploratory testing must be recorded so the failure can be replayed.

## 6. Project, Build and Content Validation

### `DOC-001` Required Project Files

Pass when `project.godot`, all authoritative documents, required source/content directories and final delivery reports exist at their documented paths. No committed scene or script depends on a developer's absolute local path.

### `DOC-002` Repository Hygiene

Pass when the candidate contains no secret, proxy setting, `.env`, `.godot/` cache, editor cache, personal configuration or unintended temporary/export file.

### `DOC-003` Content Parse

Pass when every required JSON file parses, uses a supported schema, contains unique stable IDs and resolves all references.

### `DOC-004` Vertical-Slice Quantities

Pass when content validation confirms:

- exactly 64 interactive plots;
- five gameplay areas with Hell's Kitchen and Lower East Side spatially separate;
- four building categories and three art variants per category;
- Tycoon, Landlady and Shark personalities;
- two approved government-auction stories;
- four additional economy events: two global and two district;
- six subway stations, approximately five tram stops on one line and two bridges;
- one compressed zoning law with the approved turn schedule;
- exactly three securities instruments with the approved availability and no futures/margin product;
- the five Integrated Operations Panel tabs in the approved order.

### `DOC-005` English Player Content

Pass when all player-facing labels, buttons, errors, events, tutorials, tooltips, rival profiles and result text are English. Internal content IDs and file names use stable English `snake_case`.

The product title must appear as `Metropolis: Roaring Times`. Government-source rumors use `Sources familiar with the New York State Government`.

The Brand/Logo passes only when it includes the colon in `Metropolis: Roaring Times`, visibly retains the owner-approved credit `designed and drawn by GatChive`, remains a separate asset from the map base and introduces no unintended opaque background.

### `DOC-006` Deferred-Control Audit

Pass when there is no non-functional visible control for the full property exchange, sealed owner bid, hostile acquisition, poison pill, private negotiation, player-built transit, commodity futures, broker margin, multiplayer or other deferred system. `Auction House` may truthfully show `No scheduled auctions`; the reserved Game Brief mascot area must have a clear non-conversational fallback rather than a fake working chat.

## 7. Startup and Match Setup

### `SCN-001` Project Startup

Open `project.godot` and run the main project. Pass when it reaches the title/start flow without a blocking error and can exit normally.

The window/browser title and primary masthead use `Metropolis: Roaring Times`.

### `SCN-002` Choose Rival

Pass when the setup screen uses `Choose Rival`, presents Tycoon, Landlady and Shark as personalities/strategies, and contains no difficulty selector.

### `AUT-001` Symmetric Starting Value

For each rival, pass when:

- the human starts with `$50,000`, base credit `$100,000`, reputation `0` and no property;
- the rival has the same total starting net worth;
- the rival starts with two personality-fitting properties paid for by converting its cash;
- no personality receives a hidden rules or difficulty bonus.

### `SCN-003` New Match Reset

After leaving a completed or partially played match, start a new one. Pass when the new match has a new valid session and no cash, property, loan, law, auction, selection or transient modal state leaks from the previous game.

## 8. Map, Plot and Camera Acceptance

### `DOC-007A` Owner Figma Handoff Integrity

Before M1A implementation, pass when the owner package contains the versioned `.fig`, `4474 × 5904` base PNG, district SVG with `width="4474"`, `height="5904"` and `viewBox="0 0 4474 5904"`, `4474 × 5904` district-mask PNG, alignment preview and owner notes. The six stable district layer names must be present, all shapes must be closed and in frame, Hell's Kitchen and Lower East Side must remain separate, and SVG/mask overlays must align with the base. A missing or ambiguous asset fails intake; Codex may not replace it with invented geometry.

### `DOC-007B` Figma 一键交付插件完整性

在 M1W 地图网页开发前，老板选中 `MAP_MASTER_4474x5904`；没有外层 Frame 时，可选中七个规定顶层图层中的任意一层，由插件建立只用于导出的虚拟主画框。随后运行 `Metropolis Handoff Exporter`。通过条件：ZIP 包含完整图层树 JSON、原始图片引用、地图底图 PNG、分区 SVG、对齐预览 PNG、独立 Brand SVG/PNG 和每个顶层图层的全画框 SVG；JSON 保存父子关系、顺序、显示/锁定状态、位置、尺寸、变换、填充、描边、颜色、效果、文字和矢量路径；导出过程不联网且不改变原始 Figma 画面。插件 ZIP 不能替代版本化 `.fig` 本地副本。

### `DOC-007` Geometry Integrity

Pass when each plot polygon:

- has at least three valid vertices;
- is not self-intersecting;
- has a matching collision polygon derived from the same coordinates;
- has a valid area, owner eligibility, adjacency list and district;
- has no unapproved overlap or unusably thin clickable shape.

### `SCN-004` Geographic Legibility

Pass when the north-up Godot map matches the owner-approved Figma alignment preview and preserves the approved relative arrangement of Manhattan, the two rivers, five gameplay areas, Central Park, the two bridges and Brooklyn Bridgehead. Manhattan must not rotate sideways, and any conversion difference requires owner review.

### `SCN-005` Plot Interaction

At minimum, test an unowned, human, rival, government, selected, auction, construction, warning and violation plot. Pass when ownership and state are clear and click/hover/selection use the authoritative plot ID.

### `SCN-005A` District Hover, Selection and Detail

Pass when hovering uncovered district space shows the approved indicative border without changing ownership presentation; clicking locks the border and opens the matching district detail page; the selection persists until another district is selected or explicitly closed; and at near zoom a plot/building hit target takes priority over its underlying district.

### `SCN-006` Pan

Pass when:

- primary drag on empty map space pans;
- middle drag pans;
- a plot click below the movement threshold selects rather than pans;
- map bounds prevent losing the entire map;
- a blocking modal prevents map input.

### `SCN-007` Fixed Zoom

Pass when:

- default zoom is `100%`;
- each zoom-in target is current target × `1.25`;
- each zoom-out target is current target × `0.80`;
- the target clamps near `50%` and at `200%`;
- wheel and visible controls use the same calculation;
- zoom remains pointer-anchored where possible;
- the rounded percentage is displayed;
- there is no rotation or tilt control.

### `SCN-008` Information Density

Pass when far and middle zoom hide every individual public and private building illustration and show each district summary in this exact order: human-purchasable plots, human-owned apartments, human-owned factories, human-owned department stores, major transit facilities and prosperity. At and above the approved near threshold, all public and private individual building illustrations appear. Standard and Luxury Apartments combine into the apartment count, the switch/crossfade follows data rather than texture resolution, and the minimum interactive target remains usable at the farthest allowed zoom.

### `AUT-040` District Summary and Prosperity Contract

For representative district fixtures, pass when the summary is derived from authoritative state and updates after relevant human/AI purchases, construction, transfer and demolition without a writable duplicate. The numeric prosperity score must include both participants' owner-approved development inputs, satisfy `50.0 <= score < 100.0`, display one decimal place and never equal `100.0`. The implementation must distinguish district prosperity from the global `Prosperity` economy phase and must not include transit in the formula unless the owner-approved formula explicitly does so.

## 9. Property and Building Rules

### `AUT-002` Direct Purchase

For an eligible unowned plot, pass when one atomic purchase:

- validates phase, ownership and funds;
- deducts the authoritative price once;
- transfers ownership once;
- consumes one action point;
- updates invested cost basis;
- writes one complete ledger transaction.

Repeat with insufficient cash and no explicit loan. Pass when the purchase fails with no state change and no silent borrowing.

### `AUT-003` Construction

For each of the four building categories, pass when construction:

- validates plot ownership, legal category, adjacency requirements and funds;
- deducts the configured cost and consumes one action point once;
- enters under-construction state during the current turn;
- becomes operational at the approved next-turn boundary;
- cannot earn income before operation;
- writes one atomic transaction.

### `AUT-004` Building Constraints

Pass when Luxury Apartment reputation/adjacency restrictions, factory residential effects and Department Store location inputs use the same rule implementation for preview, AI and settlement.

### `AUT-005` Demolition

Pass when demolition consumes one action point, charges no separate fee, refunds exactly 10% of original construction cost under the shared rounding rule, removes the building, retains ownership of empty land and removes demolished investment from current cost basis.

### `AUT-005A` Redevelopment

For every legal higher-cost building transition, pass when redevelopment consumes one action point and charges exactly:

```text
max(0, new_original_cost - 1.20 * old_original_cost)
```

The old building stops operating, leaves current cost basis and is replaced by an under-construction target whose full original cost enters current basis. It becomes operational next turn. Same-cost targets, lower-cost targets, illegal zoning, non-compliant upgrade prohibition, pending sale and insufficient cash all reject atomically. No path can pay cash to the participant from a negative difference.

### `AUT-005B` Brokered Property Sale

Pass when a legal submission consumes one action point, locks exactly 90% of current market value, marks the asset `sale_pending` and transfers ownership/cash once at the next `TURN_START` before income and maintenance. Verify that the pending asset cannot be redeveloped, demolished, resold or auctioned and that brokered sale is unavailable as an immediate resolution for already-mature debt.

### `AUT-006` Transit and Bridgehead

Pass when:

- one ordinary adjacency step to any fixed transit asset gives `+15%` land value and building income;
- multiple ordinary transit assets do not stack;
- configured Brooklyn Bridgehead plots receive the additional `+10%` land-value bonus;
- the bridgehead bonus may stack with one ordinary transit bonus;
- public transit cannot be purchased or constructed by the player.

## 10. Turn Flow, Action Points and Economy

### `AUT-007` Phase Order

Pass when every turn advances exactly through:

```text
TURN_START
→ INCOME_SETTLEMENT
→ COST_SETTLEMENT
→ DEBT_MATURITY
→ EVENT_RESOLUTION
→ PLAYER_ACTION
→ AI_ACTION
→ AUCTION_RESOLUTION
→ MARKET_REVALUATION
→ LAW_AND_ECONOMY_CHECK
→ AUTOSAVE
→ TURN_END
```

Illegal phase jumps and duplicate end-turn requests must change nothing.

### `AUT-008` Action Points

Pass when the player receives exactly three action points per turn and purchase, construction, demolition, redevelopment, brokered-sale submission, each securities buy/sell and winning auction acquisition consume one. Borrowing, repayment, inspection and entering a scheduled government auction consume zero. There is no separate `Financial Order` resource, and no action can reduce action points below zero.

### `SCN-009` End-Turn Confirmation

Pass when ending with unused action points requires confirmation and the confirmation shows the number being abandoned. Ending with zero action points does not require the unused-action warning.

### `AUT-009` Economy Schedule

Pass when turns map exactly to:

- Opening: `1–4`;
- Prosperity: `5–10`;
- Overheating: `11–15`;
- Adjustment: `16–20`.

Changing phase updates configured market, credit and new-loan-rate inputs once at the correct boundary.

### `AUT-010` Income and Costs

Pass when operational buildings settle configured income and maintenance once per turn, with district, building, transit, pollution, economy, event and law modifiers applied in one documented order. Preview, ledger and committed total must match.

### `AUT-011` Ordinary Forced-Cost Shortfall

Pass when an ordinary mandatory-cost shortfall opens emergency liquidation before bankruptcy, prevents unrelated actions during resolution and declares bankruptcy only if legal liquidation cannot cover the obligation.

## 11. Credit, Loans and Debt Disposition

### `AUT-012` Credit Limits

With base credit `$100,000`, pass when phase limits are exactly:

- Opening: `$100,000`;
- Prosperity: `$110,000`;
- Overheating: `$80,000`;
- Adjustment: `$60,000`.

Available credit equals the current limit minus all outstanding principal, clamped to zero for new borrowing. A phase drop below existing principal creates no immediate margin call but prohibits additional borrowing.

### `AUT-013` Loan Creation

For each economy phase, pass when an allowed player request creates a separate six-turn loan, deposits the requested principal once and locks the per-turn rate at:

- Opening: `0.25%`;
- Prosperity: `0.25%`;
- Overheating: `0.60%`;
- Adjustment: `0.75%`.

Borrowing is rejected during settlement, AI action, debt disposition and other prohibited phases. Loan confirmation is required and shows principal, locked rate, due turn and projected obligation.

### `AUT-014` Interest Accrual

Pass when each active loan accrues its locked rate exactly once per eligible turn, never adopts a later phase rate and uses the shared currency rounding rule.

### `AUT-015` Early and Partial Repayment

Pass when repayment consumes no action point, may be partial or full, pays accrued interest before principal and never creates a negative balance. Repeat across multiple independent loans to prove the selected loan is updated correctly.

### `AUT-016` Maturity Warnings

Pass when each loan produces clear warnings at exactly three, two and one turns before due, without duplicate warning after save/load.

### `AUT-017` Maturity Payment

Pass when sufficient cash pays principal plus accrued interest at maturity, closes the correct loan once and records complete before/after values.

### `AUT-018` Bank Takeover

In debt disposition, pass when the player can surrender multiple eligible assets. Each takeover pays exactly 70% of that asset's current invested cost basis under the shared rounding rule, transfers/removes the asset atomically and applies proceeds to the obligation through normal finance transactions.

### `AUT-019` Emergency Auction

Pass when an eligible asset begins at exactly 50% of invested cost basis, cannot use new borrowing, ends within the configured maximum rounds and handles sale/no-sale without trapping the debt flow. Bidder narrative and roster must match owner-approved content.

### `AUT-020` Debt Resolution and Bankruptcy

Cover at least these cases:

1. cash alone covers maturity;
2. one takeover covers maturity;
3. multiple disposals cover maturity;
4. emergency auction covers maturity;
5. all legal disposals remain insufficient.

Pass when cases 1–4 resume at the documented state and case 5 produces immediate human bankruptcy defeat. Normal actions and new borrowing remain unavailable throughout disposition.

## 12. Stock Market Acceptance

### `AUT-020A` Securities Instruments and Availability

Pass when the market contains only `municipal_railroad_bonds`, `industrial_shares` and `metropolitan_investment_trust`; the first two are available from Opening and the trust from Prosperity. No individual real company, commodity future, option, short or broker-margin instrument is exposed.

### `AUT-020B` Securities Orders

For each instrument, test buy and sell. Pass when each successful order uses the displayed authoritative turn price, enforces the `$1,000` minimum, charges exactly `1%`, consumes one action point and creates one atomic ledger record. Insufficient cash/holding, unavailable instrument, duplicate request and zero remaining action points change nothing.

### `AUT-020C` Securities Revaluation and Credit Separation

Pass when prices change exactly once during `MARKET_REVALUATION` from named deterministic economy/event inputs, replay identically from the same seed and never change because a UI panel opens. Securities value appears in portfolio and results but contributes zero to property-backed available credit. Configured guaranteed bond return after fees cannot exceed the applicable new-loan rate.

## 13. Government Auction Acceptance

### `AUT-021` Scheduled Auctions

Pass when at least two government auctions occur on configured turns, use configured eligible plots and display only owner-approved English stories.

### `AUT-022` Ascending Bid Rules

Pass when current bid, minimum increment, legal funding and withdrawal are enforced; entry costs no action point, while winning acquisition consumes one action point.

### `AUT-023` Auction End States

Cover and pass:

- human win;
- rival win;
- human withdrawal;
- rival withdrawal;
- no sale;
- insufficient funds at a validating boundary;
- maximum-round protection.

Every end state restores the correct turn flow and records a single result. Cosmetic timers and skipped animation cannot change the winner or price.

### `SCN-010` Bid Confirmation and Clarity

Pass when a binding bid confirmation or auction commit step shows current price, increment, resulting funding position and action-point consequence. Rapid repeated input cannot submit the same bid twice.

## 14. AI Acceptance

### `AUT-024` Shared Legality

For all three personalities, pass when the AI uses the same purchase, construction, finance, law and auction legality as the player, has no hidden money or valuation bonus and cannot act with unavailable funds/action points.

### `AUT-025` Public Knowledge Only

Pass when AI evaluation before turns 10 and 12 cannot read unpublished law warnings or later event outcomes. After public warning, the same public information may affect its score.

### `AUT-026` Deterministic Decision Evidence

For a fixed version, seed and state, pass when candidate actions, chosen command, valuation and reason codes reproduce exactly. Development output must explain rejected and selected actions.

### `AUT-027` Personality Statistical Run

Run the same set of at least 30 fixed seeds for each personality, for at least 90 complete simulations. Use the same content version and deterministic human test policy, discard no seed, and report every denominator.

For this test:

- residential-building share is completed Standard/Luxury Apartments divided by all completed income buildings;
- factory-oriented action share is completed Factory construction divided by all completed income buildings;
- uncommitted-liquidity ratio is cash divided by cash plus current owned-property/building market value, sampled at the start of each AI action phase;
- post-bid withdrawal rate is withdrawals divided by auctions in which that AI made at least one legal bid.

Pass when:

- all simulations end legally without a dead turn or infinite auction;
- Landlady's residential-building share is at least 60% and at least 15 percentage points above Tycoon's;
- Tycoon's factory-oriented action share is at least 10 percentage points above Landlady's;
- Shark's median uncommitted-liquidity ratio is at least 10 percentage points above Tycoon's;
- Shark's rate of withdrawing after at least one legal auction bid is at least 10 percentage points above Landlady's;
- no personality's signature result depends on a starting-value or rules advantage.

If balancing work demonstrates that a metric produces misleading behavior, changing the threshold requires an owner-approved update to this document before acceptance.

### `SCN-011` AI Presentation

Pass when visible AI actions are shown in short `0.6–1.2` second sequences, may be skipped or accelerated and still produce the same state/ledger. Normal player UI shows only actions and broad financial condition, not exact AI cash, valuation ceiling or utility score.

### `SCN-012` Development Debug Separation

In a development build, `F1` displays the required AI/rules evidence without mutating state. In the final Web build, the overlay and exact private AI data are disabled or absent.

## 15. Zoning Law and Event Acceptance

### `AUT-028` Zoning Timeline

Pass when:

- turn 10 publishes the first warning;
- turn 12 publishes the second warning;
- turn 14 enacts the law;
- turns 15–16 present transition state;
- turn 17 activates full existing-building penalties.

Each transition occurs once and remains correct across save/load.

### `AUT-029` New Construction Restriction

From enactment, pass when Residential plots reject new Factory and Department Store construction with a clear reason. Business and Unrestricted behavior must follow configured rules.

### `AUT-030` Existing Noncompliance

Pass when a pre-enactment noncompliant building remains standing, receives the correct warning/transition state, loses exactly 30% income from turn 17 and cannot upgrade. No deferred setback, coverage or property-exchange discount is falsely applied.

### `SCN-013` Law Communication

Pass when warning, enactment, transition and violation are distinguishable on the timeline, plot, property panel and ledger using text/icon/pattern as well as color.

### `AUT-031` Additional Events

Pass when the two global and two district events respect eligibility, duration, scope, non-duplication and deterministic event-stream behavior. Their previews and committed modifier IDs match.

### `AUT-031A` News Provenance

Pass when every Investment Advice item declares source name/type, authenticity, turn/date, headline, summary, affected systems and expiry. A real newspaper item requires a verified source date and citation and cannot contain invented quoted copy. Fictional city items use only approved fictional mastheads. Government-law rumors use `Sources familiar with the New York State Government` and display `Rumor`; activity items are ledger-derived and never presented as historical reporting.

## 16. Ledger, Atomicity and Determinism

### `AUT-032` Transaction Evidence

For purchase, construction, demolition, redevelopment, brokered-sale submission/settlement, securities order/revaluation, loan, repayment, takeover, auction, income, maintenance, law penalty and bankruptcy, pass when each ledger entry includes the required turn, phase, actor, before/after financial and ownership/holding values, action-point changes and modifier reasons.

### `AUT-033` Atomic Failure

Force validation failure at every state-changing operation. Pass when cash, debt, ownership, building, action points, phase and ledger remain unchanged.

### `AUT-034` Duplicate Submission Guard

Submit the same request rapidly and again after save/load. Pass when it commits once and returns the original result or a structured duplicate rejection thereafter.

### `AUT-035` Fixed Replay

For the same build/rules version, seed, initial content and ordered action list, run at least three times. Pass when every turn-boundary signature, final state and ledger are identical.

### `AUT-036` Visual Independence

Repeat a deterministic run with animation skipped, reduced motion enabled and different frame timing. Pass when authoritative results remain identical.

## 17. Save, Load and Recovery

### `AUT-037` Manual Round Trip

At a stable interactive state, save and load. Pass when turn, phase, participants, loans, plots, buildings, construction/redevelopment, pending brokered sales, security prices/holdings, economy, law, news/events, ledger, deterministic streams and transaction guard restore exactly.

### `AUT-038` Autosave Boundary

Pass when one autosave is written after law/economy checks, before turn end, and only after any transaction completes. It must not replay the completed turn boundary when loaded.

### `SCN-014` Save Availability

Pass when one manual slot and one autosave slot are visible, manual save is disabled during unresolved transactions/blocking flows with an English reason, and no undo control is offered for committed transactions.

### `AUT-039` Failed and Corrupt Load

Attempt missing-field, unsupported-version, invalid-reference and corrupt JSON loads. Pass when each is rejected clearly, the currently running valid match remains unchanged and the existing usable save is not overwritten.

### `WEB-001` Browser Persistence

In Chrome and the Safari smoke run, repeat the following sequence separately for the manual slot and autosave slot:

1. create or trigger the target save;
2. record its turn and key state;
3. close or reload the page;
4. reopen the build;
5. load the slot.

Pass when the exact state returns and no transaction is duplicated. Clearing browser site storage is permitted to delete saves and is documented as platform behavior, not an in-game failure.

## 18. UI, Input, Tutorial and Accessibility

### `SCN-015` Required Interface

Pass when the top status bar shows `Metropolis: Roaring Times`, status values, `End Turn`, save/help and settings; the map and right property panel remain usable; and the left Integrated Operations Panel contains exactly this tab order: `Game Brief`, `Investment Advice`, `Bank`, `Auction House`, `Stock Market`.

Each tab is an independent page with its own scroll behavior. `Game Brief` is not pinned above the other pages, shows mode/`Standard` ruleset/rival/objective/turn/economy/law and includes the reserved mascot area with fallback. `Investment Advice` scrolls news/activity. Bank, auction and securities actions appear only in their relevant tabs. No fixed bottom action toolbar exists.

### `SCN-016` High-Risk Confirmations

Pass when taking a loan, demolishing, redevelopment, brokered sale, securities order, submitting the required binding-bid commit, surrendering/auctioning an asset and ending with unused action points require clear confirmation. Redevelopment shows the 120% credit and zero-floor cost; sale shows 90% locked value and delay; securities show gross, 1% fee and action-point cost. Cancel changes nothing. Routine selection and inspection require no confirmation.

### `SCN-017` Mouse Completion

Pass when the complete match can be played with a mouse, including map navigation, property purchase/redevelopment/sale, banking, securities, auctions, save/load and results.

### `SCN-018` Keyboard Panel Navigation

Pass when required non-map controls have visible focus, logical tab order and keyboard activation. Full keyboard-only geographic plot selection is not required for the vertical slice.

### `SCN-019` First-Use Guidance

Pass when an English static How to Play page explains the core loop and first-use prompts/tooltips cover purchase, construction, redevelopment, brokered sale, bank, stock market, auction, zoning and end turn without creating a separate tutorial campaign.

### `SCN-020` Layout Targets

At `1920×1080`, `1440×900` and `1366×768`, pass when required text and controls remain readable/reachable, blocking modals fit, no essential value is clipped and the map retains usable space.

### `SCN-021` Non-Color State

Pass when ownership, selection, auction, construction, compliance, transition, violation, disabled and debt-warning states remain distinguishable using approved patterns, icons, outlines or labels when viewed without color cues.

### `SCN-022` Reduced Motion

Pass when reduced motion shortens/removes nonessential motion without hiding required results or changing rule timing.

## 19. Visual and Asset Acceptance

### `VIS-001` Map Composition Gate

Owner approves the submitted Figma source, base PNG, district SVG/mask alignment, island orientation/proportion, placement of five gameplay groupings represented by six separate district vectors, bridgehead, main landmarks and strict reference-derived paper/ink/water appearance before Codex integrates district interaction or finalizes any of the 64 plots.

### `VIS-002` Interaction-State Gate

Owner approves a sample plot in unowned, human, rival, government, selected, auction, transition-warning and violation states before UI expansion.

### `VIS-003` Building and UI Gate

Owner approves one top-down sample from each of the four building categories plus one Art Deco panel/button family and one five-tab Integrated Operations Panel sample before all variants are produced.

### `VIS-004` Rival Portrait Gate

Owner approves one neutral rival portrait and two emotional samples before the full set. Final pass requires 15 consistent transparent portraits: neutral, confident, hesitant, angry and auction withdrawal for each of Tycoon, Landlady and Shark.

### `VIS-005` Palette Audit

Pass when production map/UI art uses the approved palette and documented tonal/opacity variants:

- `paper_base #E5D3AE`;
- `paper_highlight #F1E3BF`;
- `ink_primary #433E3A`;
- `ink_secondary #716658`;
- `water_warm #DEB080`;
- `border_peach #E1B686`;
- `compass_red #C54543`;
- `warning_deep #964940`.

Any additional hue requires prior owner approval.

### `VIS-006` Final Integration Gate

Owner approves the final integrated build only when:

- no placeholder block or default Godot control is presented as final art;
- all gameplay buildings use direct top-down views;
- rival portraits are original rubber-hose-style designs rather than copies of a known character;
- the reference image is not shipped as the playable background;
- the supplied reference is absent from the runtime/export package, and production map layers record the owner Figma revision and source checksums;
- public and private building illustrations remain separate from the base map and obey the same approved near-zoom threshold;
- identifiable content passes period/date review;
- decoration does not obscure plot boundaries or state.

## 20. Audio Acceptance

### `AUD-001` Required Assets

Pass when the final build includes one loopable period-inspired music track and sounds for purchase, construction, income, warning and auction gavel.

### `AUD-002` Playback and Controls

Pass when music and sound effects have independent volume controls and mute works. The Web build starts audio only after a valid browser user interaction and does not produce repeated start errors.

### `AUD-003` Cue Correctness

Pass when each cue plays once for its committed result, does not play for rejected/cancelled transactions and does not become an input to rule timing.

## 21. Performance and Web Acceptance

### `PERF-001` Reference Camera Run

On the owner's MacBook Air in stable Chrome at `1366×768`:

1. load a populated representative/final map;
2. alternate continuous pan, zoom and plot selection for 60 seconds;
3. keep required HUD and map state layers visible;
4. record the measurement method and result.

Pass when average frame rate is at least 58 FPS, there is no continuous one-second interval below 45 FPS and no input stall over 100 ms outside documented load/scene transitions.

### `PERF-002` Event-Driven Map Updates

Pass when inactive plots do not perform independent per-frame economy polling and a mass revaluation/state refresh completes without a dead frame sequence that violates `PERF-001`.

### `PERF-003` Full-Match Stability

Complete or simulate a 20-turn match while monitoring errors and memory trend. Pass when there is no unbounded growth attributable to repeated turns, modals, auctions, plot views or portrait changes.

### `WEB-002` Export and HTTP Load

Pass when `build/web/index.html` and required export files load through local HTTP using the Compatibility renderer and single-threaded path, without requiring runtime internet access.

### `WEB-003` Chrome Console

During the full Chrome acceptance run, pass when there is no persistent JavaScript, WebGL, Godot, storage or audio error. A one-time browser informational warning must be recorded and shown not to affect behavior before it is excluded.

### `WEB-004` Offline Runtime

After the build has loaded, disable network access and start/continue a match. Pass when gameplay, AI, rules and local save continue without a remote service.

### `WEB-005` Focus and Rapid Input

Pass when changing browser focus, returning to the tab and rapidly clicking a pending action cannot duplicate a command, skip a blocking flow or corrupt input state.

## 22. Complete Match and Results

### `AUT-041` Headless 20-Turn Simulation

For each rival and required fixed seeds, pass when the match reaches a legal terminal state with no dead phase, infinite auction, unresolved modal dependency or out-of-range action point.

### `SCN-023` Human 20-Turn Playthrough

Complete one representative match through the actual interface. Pass when property purchase, construction, redevelopment, brokered sale, lending, securities trading, at least one auction, economy change, zoning timeline, save/load and final result are exercised without a blocking defect.

### `AUT-042` Net Worth and Tie-Breaks

Pass when turn-20 ranking uses:

```text
cash
+ current market value of owned plots
+ current market value of owned buildings and permanent improvements
+ current market value of securities holdings
- all outstanding principal
- all accrued interest
```

Ties resolve by reputation, then cash, then configured strategic plots. Exact component values and tie-break reason appear in the structured result.

### `AUT-043` Terminal Results

Cover and pass:

- human turn-20 victory;
- human turn-20 defeat;
- human bankruptcy defeat;
- AI bankruptcy human victory;
- each tie-break level.

### `SCN-024` Result Summary

Pass when the English result screen shows ranking, cash/property/securities/debt components, tie-break explanation where applicable and a ledger-derived summary of major purchases, construction, redevelopment, brokered sales, securities trades, auctions, loans and zoning consequences.

## 23. Required Commands and Evidence

The baseline headless command is:

```text
godot --headless --path . --script res://tests/run_all.gd
```

Every candidate report records:

- candidate Git commit and whether the worktree was clean;
- Godot, OS, Chrome and Safari versions;
- automated command and full pass/fail count;
- fixed and exploratory seeds;
- Chrome, Safari and performance results;
- owner visual-gate decisions;
- defects fixed during the candidate cycle;
- all remaining defects with severity and owner decision;
- Web build location and checksum/signature where practical.

Screenshots and videos support visual/browser evidence but do not replace the runnable project, automated output or Web export.

## 24. Milestone Test Rule

For each development milestone:

1. identify the acceptance IDs newly made applicable;
2. run them before the milestone commit;
3. run relevant regression tests from earlier milestones;
4. fix failures or report a blocker before continuing;
5. save all files and create one recoverable Git commit;
6. report evidence, commit, risks and remaining non-applicable tests to the owner;
7. obtain approval before beginning the next milestone.

The final release candidate must run the full applicable set regardless of earlier milestone results.

## 25. Approved D6 Decisions

The owner approved the following acceptance policy:

1. Chrome is the complete primary Web target; Safari receives the defined smoke test and cannot retain blocker/serious defects.
2. The reference performance run uses the owner's MacBook Air and the thresholds in `PERF-001`.
3. Each AI personality receives at least 30 fixed-seed statistical simulations.
4. Loan rates, partial repayment, maturity disposition, repeated asset disposal and bankruptcy boundaries require automated coverage.
5. Map, state treatment, building samples, rival portraits and final UI require staged owner visual approval.
6. The match must be mouse-completable and panels keyboard accessible; keyboard-only plot selection is not required.
7. Manual/autosave persistence and corrupt-load safety require explicit browser and automated tests.
8. Blocker/serious defects cannot ship; every retained medium defect requires owner approval.
9. Redevelopment, brokered sale and securities trading require automated atomicity, save/load and action-point coverage.
10. The Integrated Operations Panel, title, fixed tab order and absence of a bottom toolbar are release acceptance requirements.
11. Historical news provenance is tested content, not optional editorial polish.

Changing these acceptance decisions requires an owner-approved documentation update.

# Metropolis: Roaring Times — Technical Architecture

> Document role: authoritative implementation architecture for the vertical slice
>
> Engine: Godot 4.x stable, GDScript, Compatibility renderer
>
> Primary target: single-threaded Web export
>
> Scope authority: `../00_PROJECT_CONTEXT.md`, `02_GAME_RULES.md`, `03_VERTICAL_SLICE_SCOPE.md` and `04_MAP_AND_ART_DIRECTION.md`

## 1. Architecture Objective

The architecture must support a complete, deterministic 20-turn property-strategy match without allowing presentation code to become a second implementation of the rules.

It must make the following safe and independently testable:

- exactly 64 irregular plots and fixed public transit;
- property purchase, construction, redevelopment, demolition, brokered sale and revaluation;
- participant cash, credit, separate loans and maturity disposition;
- deterministic bonds, shares and investment-trust trading using the existing action-point budget;
- a provenance-aware news feed and five-tab Integrated Operations Panel;
- three selectable AI personalities in separate 1v1 matches;
- government and emergency auctions;
- the compressed economy cycle and 1916 zoning law;
- atomic ledger entries, exact save/load and deterministic replay;
- a responsive map and readable desktop interface in a Web build.

The design favors explicit state, small domain services and data-driven content over a large inheritance hierarchy or scene-node scripts with hidden side effects.

## 2. Fixed Technology Decisions

| Concern | Decision |
|---|---|
| Engine | Godot 4.x stable |
| Language | GDScript with static type annotations for core code |
| Renderer | Compatibility |
| Web model | Single-threaded export first; no runtime networking |
| Content format | JSON for modes, plots, buildings, economy, laws, AI, auctions, securities, news sources and events |
| Scenes | Godot `.tscn` scenes |
| Scripts | English `snake_case` `.gd` files and stable English class/ID names |
| Save format | Versioned JSON in `user://`; `ConfigFile` only for local settings |
| Tests | First-party custom headless runner; no third-party test plugin required |
| Input | Mouse and keyboard only for the vertical slice |
| Rules clock | Turn/phase driven; never frame-time driven |
| Currency | Integer dollars using one documented rounding function |
| Randomness | Seeded, named deterministic streams |

No C#, React, Three.js, PixiJS, server, remote database, live language model or required private plugin is part of the runtime.

## 3. Architectural Boundaries

The project uses four main layers:

```text
Presentation
    scenes, controls, map drawing, animation, audio, input
        ↓ requests                 ↑ view models / events
Application
    session orchestration, turn flow, commands, modal flow
        ↓ commands                 ↑ structured results
Domain
    authoritative state, validation, calculations, transactions, AI
        ↓ content lookup           ↑ stable content records
Content and Persistence
    JSON repositories, save codec, settings, ledger serialization
```

Rules:

- Presentation may request an action but cannot directly change cash, debt, ownership, action points, law state or building state.
- Application code controls when a command is legal to request and which blocking interface is active.
- Domain code owns every rule calculation and state mutation.
- Content files provide values and schedules but cannot contain executable script.
- Persistence serializes authoritative state; loading does not replay UI events or already committed transactions.
- Rendering state is derived from authoritative state and can be rebuilt after loading.

## 4. Project Layout

The implementation should converge on the following structure:

```text
res://
├── project.godot
├── export_presets.cfg
├── scenes/
│   ├── main/
│   │   └── main.tscn
│   ├── map/
│   │   ├── map_view.tscn
│   │   ├── district_view.tscn
│   │   └── plot_view.tscn
│   ├── ui/
│   │   ├── match_hud.tscn
│   │   ├── property_panel.tscn
│   │   ├── district_detail_panel.tscn
│   │   ├── integrated_operations_panel.tscn
│   │   ├── game_brief_tab.tscn
│   │   ├── investment_advice_tab.tscn
│   │   ├── bank_tab.tscn
│   │   ├── auction_house_tab.tscn
│   │   ├── stock_market_tab.tscn
│   │   ├── asset_overview.tscn
│   │   ├── law_timeline.tscn
│   │   ├── auction_modal.tscn
│   │   ├── debt_disposition_modal.tscn
│   │   ├── confirmation_modal.tscn
│   │   ├── how_to_play.tscn
│   │   └── result_screen.tscn
│   └── debug/
│       └── debug_overlay.tscn
├── scripts/
│   ├── application/
│   ├── domain/
│   ├── presentation/
│   ├── persistence/
│   └── shared/
├── data/
│   ├── modes/
│   │   └── vertical_slice.json
│   ├── laws/
│   │   └── 1916_zoning.json
│   ├── districts.json
│   ├── map_manifest.json
│   ├── plots.json
│   ├── buildings.json
│   ├── transit.json
│   ├── ai_personalities.json
│   ├── economy_phases.json
│   ├── securities.json
│   ├── news_sources.json
│   ├── auctions.json
│   └── events.json
├── assets/
├── tests/
│   ├── run_all.gd
│   ├── fixtures/
│   └── test_*.gd
├── docs/
└── build/web/
```

Folders are introduced by the milestone that first needs them. Empty speculative modules should not be created merely to match this diagram.

## 5. Scene Ownership

### 5.1 Main Scene

```text
Main
├── GameWorld
│   ├── MapRoot
│   │   ├── PaperBackground
│   │   ├── WaterLayer
│   │   ├── CoastlineLayer
│   │   ├── RoadLayer
│   │   ├── DistrictLayer
│   │   ├── DistrictInteractionLayer
│   │   ├── DistrictSummaryLayer
│   │   ├── PlotLayer
│   │   ├── TransitLayer
│   │   ├── PublicBuildingLayer
│   │   ├── PrivateBuildingLayer
│   │   ├── PropertyStateLayer
│   │   ├── LandmarkLayer
│   │   └── AtmosphereLayer
│   └── MapCamera
├── UILayer
│   ├── MatchHUD
│   ├── IntegratedOperationsPanel
│   │   ├── GameBriefTab
│   │   ├── InvestmentAdviceTab
│   │   ├── BankTab
│   │   ├── AuctionHouseTab
│   │   └── StockMarketTab
│   ├── PropertyPanel
│   ├── DistrictDetailPanel
│   ├── ModalLayer
│   └── NotificationLayer
└── DebugLayer
```

`DebugLayer` is instantiated only in development builds. It is absent or forcibly disabled in the final Web export.

The owner-submitted Figma base, district SVG and alignment material share one vector-canvas registration of any size. `map_manifest.json` records the actual canvas width, height, owner revision and normalized conversion. `districts.json` contains exactly the twelve stable IDs defined in `MAP_ASSET_PIPELINE.md`; it may not contain former six-district IDs. The supplied historical reference may be enabled only as an editor/development alignment guide and is excluded from exports. Codex does not author substitute district polygons.

### 5.2 District Views and Level of Detail

Each district view is generated from authoritative closed polygon geometry and owns only presentation and hit testing. It provides:

- hover and locked-selection borders derived from the same polygon;
- a normalized anchor for the far/middle district summary;
- a read-only district detail request carrying the stable `district_id`;
- data-driven visibility switching at the approved near-zoom threshold.

The `DistrictSummaryViewModel` derives its six ordered fields from authoritative state: human-purchasable plots, human-owned apartments, human-owned factories, human-owned department stores, major transit facilities and prosperity. Public and private building art share one near-zoom visibility threshold. At near zoom, plot/building hit areas have priority over their district.

### 5.3 Plot Views

Each interactive plot may use `Area2D`, `CollisionPolygon2D` and one or more `Polygon2D` or draw-command layers. The render polygon and collision polygon must be generated from the same normalized source coordinate list.

A plot view is responsible only for:

- hit testing;
- ownership and state presentation;
- hover, selection and focus feedback;
- forwarding the stable `plot_id` to the application layer.

It cannot calculate rent, apply law penalties, transfer ownership or independently poll the economy each frame.

### 5.4 Autoload Policy

Autoloads are limited to process-wide services that genuinely survive scene changes:

- `ContentRepository` — immutable validated content after startup;
- `SaveManager` — versioned save paths and codecs;
- `AudioManager` — music, sound effects and user volume settings.

The active `GameSession`, `GameState`, turn controller and domain services belong to the current match and are destroyed on return to the title screen. This prevents state leaking into a new match.

## 6. Authoritative Runtime State

`GameState` is the single serializable authority for a match. It contains plain typed domain records, not references to UI nodes.

Minimum state groups:

```text
MatchState
├── schema_version
├── rules_version
├── match_id
├── mode_id
├── match_seed
├── next_transaction_sequence
├── turn_number
├── turn_phase
├── active_participant_id
├── pending_blocking_flow
├── participants
├── plots
├── buildings
├── loans
├── construction_queue
├── pending_brokered_sales
├── securities_market_state
├── securities_holdings
├── economy_state
├── law_state
├── event_state
├── news_state
├── auction_state
├── deterministic_stream_states
├── ledger
└── result_state
```

Participant state includes cash, reputation, action points, owned plot IDs, loan IDs, securities holdings and bankruptcy state. AI-private scoring data is transient diagnostic output and is not part of the player-facing view model.

### 6.1 Stable IDs

- Content uses stable English `snake_case` IDs.
- Runtime entities use deterministic IDs derived from the match and a monotonic sequence where practical.
- A transaction ID is unique inside a match and survives save/load.
- UI selection stores IDs, never direct ownership of domain objects.
- Renaming a player-facing label does not rename its content ID.

### 6.2 Derived Values

Available credit, property market value, securities portfolio value, expected income, compliance, adjacency effects and net worth are calculated from authoritative inputs. They are cached only when profiling shows a need, and every cache has an explicit invalidation trigger.

Derived display values are never written back into authority merely because the UI rounded or formatted them.

## 7. Turn and Blocking-Flow State Machine

The turn controller permits only the sequence defined in the game rules:

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

`TURN_START` first settles brokered property sales submitted on the preceding turn. Ownership transfers before income and maintenance, so a sold property cannot pay the former owner one extra settlement.

`DEBT_MATURITY`, `PLAYER_ACTION` and `AUCTION_RESOLUTION` may open a blocking subflow. A subflow must resolve or explicitly cancel before the controller advances.

Required blocking flows:

- confirmation;
- government auction;
- debt disposition;
- emergency auction;
- critical law/news acknowledgement;
- result screen.

The controller owns a transition table. UI signals cannot arbitrarily assign a phase. Every transition validates current phase, required result and pending transaction status.

### 7.1 Debt Disposition

When a matured obligation cannot be paid:

1. the controller enters a dedicated debt-disposition state;
2. normal player actions and new borrowing are disabled;
3. bank takeover and emergency auction commands may be submitted repeatedly;
4. each completed disposal is an independent atomic transaction;
5. the flow resolves when the obligation is paid or no legal disposal can cover it;
6. an uncovered obligation commits bankruptcy and ends the match.

The interface cannot dismiss this flow without a valid resolution.

### 7.2 AI Turn Presentation

AI planning completes without animation or frame timing. It produces an ordered list of validated domain commands and public presentation summaries.

After the commands commit, the presentation layer shows their results in a short sequence, normally `0.6–1.2` seconds per visible action. The player may skip or accelerate this sequence. Skipping animation never skips, changes or recomputes a rule result.

## 8. Command and Transaction Pipeline

Every state-changing action follows one path:

```text
UI or AI intent
→ typed CommandRequest
→ phase and permission gate
→ ActionValidator preflight
→ domain service builds TransactionDraft
→ draft validates all preconditions
→ GameState commits the complete delta once
→ Ledger appends the matching record
→ domain events publish
→ presentation rebuilds affected view models
```

### 8.1 Command Request

A request includes:

- request ID;
- actor ID;
- action type;
- required target IDs and parameters;
- expected turn and phase;
- source context such as player, AI or system.

The request contains intent, not client-calculated costs. Domain services look up authoritative costs and modifiers.

### 8.2 Transaction Draft

A draft includes every planned change before commit:

- expected preconditions;
- cash, debt, reputation, securities and action-point deltas;
- ownership/building/law changes;
- construction, redevelopment, pending-sale or auction changes;
- ledger reason and applied modifier IDs;
- public and private result payloads.

If any precondition fails, the full operation fails and changes nothing. No partial purchase, partial construction or half-applied repayment is allowed.

### 8.3 Idempotence

- Committed request and transaction IDs are retained in state/ledger.
- A duplicate submission returns the original result or a structured duplicate rejection; it does not commit again.
- Buttons are temporarily disabled while their request is unresolved.
- Loading restores the next transaction sequence and committed-ID guard.
- Autosave occurs only after the current atomic operation is complete.

### 8.4 No Undo Rule

Once a transaction is committed to the ledger, the vertical slice provides no undo command. Loading a previous manual or autosave is the only player rollback mechanism.

The lack of undo makes confirmation and clear cost previews mandatory for high-risk commands.

## 9. Domain Services

Each service accepts state/content inputs and returns validation results, transaction drafts or deterministic projections. Services do not own UI nodes.

### 9.1 `TurnController`

- owns legal phase transitions;
- starts system settlement commands;
- opens and resolves blocking flows;
- prevents double end-turn and dead turns;
- reaches result evaluation after turn 20.

### 9.2 `ActionValidator`

- checks phase, actor, ownership, legal target and action points;
- checks cash/credit eligibility without silently borrowing;
- checks building, zoning and adjacency constraints;
- returns stable reason codes plus player-facing localization keys.

### 9.3 `PropertyService`

- purchases eligible plots;
- transfers ownership through approved acquisition paths;
- calculates invested cost basis components;
- submits 90%-of-market brokered sales, locks the price and settles transfer at the next `TURN_START`;
- stages bank takeovers and acquired-property results.

### 9.4 `BuildingService`

- validates building category and plot fit;
- starts one-turn construction;
- activates completed construction at the correct boundary;
- demolishes buildings and calculates the 10% construction-cost refund;
- validates strictly upward redevelopment, applies the 120% old-original-cost credit with a zero cash-cost floor and starts replacement construction;
- never uses visual variant ID to change rules.

### 9.5 `FinanceService`

- calculates current credit limit and available credit;
- creates a separate six-turn loan with locked rate;
- accrues interest once per eligible turn;
- applies repayment to accrued interest before principal;
- identifies warnings and maturity obligations;
- prohibits borrowing during debt disposition and invalid phases.

### 9.6 `RuleEngine`

- calculates income, maintenance and market revaluation;
- resolves transport, bridgehead, pollution and district effects;
- applies economy and law modifiers in a documented order;
- uses the same rounding function for simulation, UI preview and ledger.

### 9.6A `SecuritiesService`

- owns the three approved instrument definitions, turn prices and participant holdings;
- validates `$1,000` minimum order, available cash/holdings, one-action-point cost and `1%` fee;
- prohibits short selling, broker margin, commodity futures and extra financial-action tokens;
- settles orders atomically at the displayed turn price;
- reprices once during `MARKET_REVALUATION` from named deterministic economy/event inputs;
- assigns securities zero property-collateral value and exposes portfolio components to results.

### 9.7 `LawService`

- advances warning, enactment, transition and penalty states;
- validates new construction restrictions;
- marks existing noncompliant buildings;
- supplies the 30% income penalty and upgrade prohibition from turn 17;
- leaves deferred setback/coverage rules inactive.

### 9.8 `AuctionService`

- runs deterministic English ascending auctions;
- validates bids against legal funding and AI valuation limits;
- enforces minimum increment, withdrawal and maximum-round protection;
- separates cosmetic timers from decision results;
- handles sale, no sale, withdrawal and insufficient-funds cleanup;
- supports the distinct 50%-basis emergency-auction entry point.

Auction stories and bidder narrative content remain data entries requiring later owner approval; architecture must not invent them.

### 9.9 `AIPlanner`

- evaluates only information legally available at the current turn;
- applies shared legality and finance rules;
- uses selected personality weights to score legal actions;
- creates a deterministic plan with explanation records;
- submits commands through the same transaction pipeline as the player;
- retains sufficient cash/debt constraints to avoid impossible actions.

The three personalities share one rules implementation. Personality data changes priorities, not difficulty bonuses, hidden assets or rule exemptions.

### 9.10 `EventService`

- selects eligible events through a named deterministic stream;
- prevents duplicate or out-of-window events;
- applies global/district modifiers through the transaction pipeline;
- records event duration and expiry explicitly.

### 9.10A `NewsService`

- builds the `Investment Advice` feed from historical, fictional, government-source and activity records;
- requires source date/citation fields for real-newspaper attribution;
- uses `Sources familiar with the New York State Government` for player-facing government rumors;
- never allows a fictional event to masquerade under a real masthead;
- exposes read-only affected-system and expiry explanations.

### 9.10B `DistrictProsperityService`

- derives district prosperity from owner-approved human and active-AI development inputs without mutating participant or property records;
- guarantees `50.0 <= prosperity_score < 100.0` and supplies a one-decimal display value;
- remains distinct from the global economy phase named `Prosperity`;
- uses only owner-approved weights, bands and labels loaded from validated content;
- does not infer a transit contribution merely because transit appears in the district summary.

### 9.11 `ResultService`

- evaluates bankruptcy immediately;
- calculates turn-20 net worth from the rule definition;
- applies reputation, cash and strategic-plot tie-breaks in order;
- produces a structured final summary from the ledger.

## 10. Data-Driven Content

### 10.1 Content Loading

`ContentRepository` loads all files required by the selected mode before creating the match. It validates:

- required keys and supported schema version;
- unique IDs and valid references;
- exactly 64 plots for the vertical-slice mode;
- a recorded owner Figma revision plus source filenames/checksums for the base PNG, district SVG, mask PNG and alignment preview;
- a valid normalized map registration, crop, aspect ratio and declared LOD thresholds;
- normalized district polygons that match the owner-submitted SVG without unauthorized smoothing or vertex deletion, plus in-bounds summary/building anchors;
- valid polygon coordinates and district assignment;
- economy/law schedules covering turns 1–20;
- valid building, transit, AI and event references;
- valid security instruments, availability windows, news-source classes and citations required by historical items;
- numeric ranges, positive costs and legal multipliers;
- player-facing English text keys or fallback text.

A fatal content error stops match creation with a clear diagnostic. It must not create a partially valid match.

### 10.2 Content Separation

- `vertical_slice.json` selects the active schedules and quantities.
- `map_manifest.json` declares the owner delivery revision, source checksums, normalized coordinate contract, approved crop/aspect registration, layer assets and LOD thresholds.
- District polygon geometry in `districts.json` is a derived copy of the owner-authoritative SVG. Conversion is reproducible and may not change geometry without owner approval; rendered border pixels never define interaction.
- Plot geometry and topology live in `plots.json`, not scene collision edits.
- Buildings provide costs, upkeep, income inputs, legal tags and art variant IDs.
- Securities provide opening price, availability, economy/event modifier IDs and volatility bounds, never executable pricing code.
- News records separate source identity, authenticity, headline, summary, affected systems and optional citation.
- Personality records provide weights and thresholds, not scripted cheats.
- Law records provide dates, warnings and named modifiers.
- Event records provide eligibility and modifier IDs.
- Display strings are separate from stable rule IDs even though only English ships initially.

### 10.3 No Executable Content

JSON may name a supported operation or modifier, but it cannot contain arbitrary expressions evaluated at runtime. Every operation maps to a reviewed implementation in the domain layer.

This prevents content typos from becoming unrestricted code and keeps behavior testable.

## 11. Determinism and Numerical Rules

### 11.1 Named Random Streams

The match seed derives independent streams such as:

- `ai_planning`;
- `auction_behavior`;
- `event_selection`;
- `initial_distribution`;
- `visual_only`.

Rule streams are serialized. Visual-only randomness cannot advance or influence a rule stream. Animation speed, skipped presentation and frame rate therefore cannot change outcomes.

### 11.2 Currency and Rounding

- Authoritative currency uses integer dollars.
- Intermediate multipliers use a single shared calculation helper.
- The vertical slice uses one documented half-up rounding rule at the final currency boundary.
- Percent previews call the same helper as commits.
- Floating-point display formatting never becomes an authoritative input.

### 11.3 Reproducibility

The same build/rules version, seed, initial content and ordered command list must produce the same final state and ledger. A replay signature hashes relevant authoritative state at turn boundaries for tests and diagnostics.

## 12. AI Information and Debug Separation

### 12.1 Player-Facing Information

The normal interface may show:

- the rival's committed visible actions;
- owned properties and visible buildings;
- auction bids and withdrawal;
- broad financial condition such as stable, pressured or distressed;
- portrait reactions and public story context.

It does not reveal exact rival cash, exact valuation ceiling, utility scores, private thresholds or decision weights.

### 12.2 Development Debug Information

The development-only `F1` overlay may show:

- exact AI cash, debt, credit and liquidity pressure;
- legal candidate actions;
- valuation range and utility components;
- personality modifiers;
- chosen action and rejection reasons;
- active seed/stream state;
- phase, plot, loan, law and transaction diagnostics.

The overlay must not mutate state. Any later debug mutation command must be isolated from release exports and cannot be used as test evidence for normal gameplay.

## 13. UI, Input and Confirmation Architecture

The left-side panel is named `IntegratedOperationsPanel` internally and shown as `Operations Desk` in English. Its tab order is fixed: `Game Brief`, `Investment Advice`, `Bank`, `Auction House`, `Stock Market`. Each tab owns an independent scroll container; no shared fixed Game Brief is rendered above the other pages.

`Game Brief` reserves a presentation slot for a future rubber-hose board mascot. The slot consumes a read-only match-summary view model and has a text fallback. It cannot mutate state or require a live model/network connection in the vertical slice.

### 13.1 View Models

Panels consume purpose-built read-only view models. A view model contains formatted labels, enabled states and reason codes derived from authoritative state; it never contains a writable pointer to `GameState`.

`DistrictSummaryViewModel` preserves the approved six-field order and one-decimal prosperity display. `DistrictDetailViewModel` supplies the selected district page. Both are rebuilt from authoritative state rather than saved as mutable duplicates.

Domain events identify what changed. The presentation coordinator then refreshes only affected map layers and panels.

### 13.2 Confirmations

The following actions require an explicit confirmation showing their consequences:

- taking a loan;
- demolishing a building;
- redevelopment, showing old building, target, 120% credit, cash cost and construction delay;
- brokered sale, showing locked 90% price and next-turn settlement;
- securities buy/sell, showing instrument, gross amount, 1% fee, action-point cost and post-trade cash/holding;
- submitting a final/committing auction bid when required by the auction flow;
- bank takeover or emergency disposal of an asset;
- ending a turn while action points remain.

Routine plot selection, inspection, camera navigation and panel opening do not require confirmation.

Confirmation data captures a command summary, but the domain command is revalidated at submission time. Stale confirmation data cannot force an outdated transaction through.

### 13.3 Input Ownership

- `MapInputController` distinguishes click from drag using a configured movement threshold.
- Primary-drag on empty map space and middle-drag pan the map.
- At near zoom, plot and building hit targets consume selection before the underlying district; district labels and uncovered polygon space may select a district.
- District hover is transient. A district click creates a locked selection that persists until another district is selected or the selection is explicitly closed.
- Mouse wheel and visible buttons request the same fixed-factor zoom function.
- Camera rotation and tilt have no actions in the input map.
- Blocking modals capture input and disable world interaction.
- `Escape` closes only interfaces explicitly marked dismissible.
- Keyboard focus order supports all required non-map controls.

The vertical slice does not claim controller or touch support.

### 13.4 Presentation Timing

Tweens, portrait reactions, gavel timing and notification duration are cosmetic. Completion callbacks may release a presentation queue, but they cannot determine prices, legality, random choices or phase results.

A reduced-motion setting shortens or removes nonessential motion without affecting command order.

## 14. Save, Load and Settings

### 14.1 Paths

```text
user://saves/manual_save.json
user://saves/autosave.json
user://settings.cfg
```

Godot maps `user://` to browser-managed persistent storage in Web exports. Save behavior must be verified after page reload in the supported browser test environment.

### 14.2 Save Envelope

Every save contains:

- save schema version;
- rules/build identifier;
- timestamp for display only;
- complete authoritative match state;
- serialized deterministic stream state;
- committed transaction/sequence guard;
- integrity checksum or deterministic state signature.

Camera position, selected plot and open non-blocking panel may be stored as presentation state. They cannot change rule restoration.

### 14.3 Save Safety

- Manual save is allowed only in a stable interactive phase with no unresolved transaction or blocking modal.
- Autosave occurs at the defined `AUTOSAVE` phase after law/economy checks.
- Data is written to a temporary path and then replaced when the platform supports it; a failed write preserves the previous usable slot.
- Loading validates envelope, version, content references and required fields before replacing the current session.
- A failed load leaves the current game unchanged and displays an English error.
- New Match creates a new session and cannot reuse old transient state.

### 14.4 Migration Policy

`SaveManager` exposes explicit migration steps from one supported schema version to the next. During development, a schema change without a migration may invalidate pre-release saves only when documented in the development log. The final vertical-slice build must load saves created by that same released build.

### 14.5 Settings

`ConfigFile` stores music volume, sound-effect volume, mute, reduced motion and other local presentation preferences. Settings are not part of match authority or deterministic replay.

## 15. Signals and Event Delivery

Use typed Godot signals at application/presentation boundaries. Domain services should prefer return values and explicit event records over a global signal web.

Representative public events:

- `phase_changed`;
- `transaction_committed`;
- `plot_state_changed`;
- `participant_finance_changed`;
- `pending_sale_changed`;
- `securities_market_changed`;
- `news_feed_changed`;
- `blocking_flow_changed`;
- `auction_state_changed`;
- `law_state_changed`;
- `notification_requested`;
- `match_finished`.

Signals carry stable IDs and structured results. Receivers query a fresh view model rather than treating signal order as state authority.

## 16. Performance and Web Constraints

### 16.1 Target

The player-experience target is stable 60 FPS while panning and zooming the populated map at `1366×768` on a normal desktop-class computer. The same interaction must remain usable at `1440×900` and `1920×1080`.

Rules simulation is independent of frame rate. A slow presentation frame may delay display but cannot change the committed outcome.

### 16.2 Controls

- No plot performs an independent `_process` economy calculation.
- Polygon and collision data are built once unless geometry changes.
- Ownership, value and compliance visuals update on relevant domain events.
- Derived map styles are cached by state key where useful.
- Far-view labels and landmark detail use level-of-detail visibility.
- Paper texture and atmospheric effects avoid full-resolution animated buffers.
- Texture dimensions and compression are reviewed in the Web build.
- Object pooling is used only after profiling demonstrates allocation pressure.

### 16.3 Web Compatibility

- The build uses the Compatibility renderer and single-threaded path first.
- The game does not require cross-origin isolation or runtime downloads to play.
- File access uses `res://` and `user://`, never local absolute paths.
- The final build is served over HTTP for testing; `file://` is unsupported.
- Browser console, persistent storage, audio start/unlock and page reload are verified.
- Losing browser focus pauses or safely contains presentation input; it cannot duplicate a command.

## 17. Error Handling and Recovery

Errors are classified as:

- validation rejection — expected illegal player/AI action, no state change;
- recoverable runtime error — save failure, missing optional audio or presentation issue;
- fatal content/state error — corrupt authority, invalid required content or impossible phase transition.

Rules:

- A rejection returns a stable code and English player-facing explanation where appropriate.
- Recoverable errors are logged and leave the match in a valid state.
- Fatal errors stop further mutation, preserve diagnostic context and offer a safe return to title or load when possible.
- No exception/error path silently grants money, consumes action points or advances a phase.
- Logs must not include secrets, machine-specific paths in player reports or unbounded save contents.

## 18. Testing Architecture

The custom runner entry point is:

```text
godot --headless --path . --script res://tests/run_all.gd
```

Test layers:

1. Unit tests for formulas, validators, rounding and modifiers.
2. Transaction tests for atomicity, ledger evidence and duplicate guards.
3. Service tests for loans, construction, redevelopment, brokered sales, securities, auction, news provenance, law and AI behavior.
4. State-machine tests for legal/illegal phase transitions and blocking flows.
5. Save/load tests for exact restoration and migration rejection.
6. Deterministic simulation tests for full turns 1–20 and multiple AI seeds.
7. Scene smoke tests for startup, input wiring and required panels.
8. Web/manual tests for browser storage, audio, camera performance and console errors.

Core tests instantiate domain/application code without loading the map scene. Test fixtures use compact data unless the test specifically validates the production 64-plot content.

No test relies on animation timing, uncontrolled system time or unseeded randomness.

## 19. Security, Licensing and Build Hygiene

- No API key, proxy setting, credential or personal environment file is committed or embedded in Web output.
- JSON content is treated as local untrusted input and validated before use.
- Runtime cannot evaluate downloaded code or arbitrary expressions from content.
- Every final third-party or generated asset is recorded in `docs/ASSET_MANIFEST.md` with source and license/provenance.
- The supplied historical reference remains a development/editor alignment guide only and is explicitly excluded from release exports. Production map assets record the owner-authored Figma revision, checksums and approval; any auxiliary generated asset still requires provenance and owner approval.
- `.godot/`, temporary exports, editor caches and personal settings stay out of Git.

## 20. Deferred Architecture

The vertical slice does not build working UI or complete services for:

- the full 312-turn Classic mode;
- additional active laws;
- full listed-property exchange beyond brokered sale or sealed owner bids;
- hostile acquisition and poison-pill response;
- private AI negotiation;
- player-built transit, ticketing or tolls;
- individual-company securities, commodity futures, broker margin, options or short selling;
- live-network mascot conversation or real-time market data;
- multiplayer, accounts, cloud saves or leaderboards;
- controller, touch, mobile or console support.

Stable IDs, versioned data and domain boundaries should permit later extension, but no speculative framework may increase current risk or expose non-functional controls.

## 21. Approved Owner-Facing Decisions

The following D5 decisions are fixed for the vertical slice:

1. AI results are presented in short skippable/accelerable action sequences after deterministic computation.
2. Loans, demolition, redevelopment, brokered sale, securities orders, committing bids, emergency asset disposal and ending with unused action points require confirmation.
3. Committed ledger transactions have no undo; save loading is the rollback path.
4. Exact AI finances and scoring are hidden from the player and visible only in development debug mode.
5. The first release supports mouse and keyboard, not controller or touch.
6. Map navigation targets stable 60 FPS at `1366×768` on a normal desktop-class computer.
7. `F1` diagnostics are development-only and disabled or absent in the final Web build.
8. Technical data, save and test implementation follows the decisions in this document without changing approved game rules.
9. The player-facing title is `Metropolis: Roaring Times`.
10. The Integrated Operations Panel uses the approved five-tab order and there is no fixed bottom action toolbar.
11. Securities orders consume one of the existing three action points; borrowing and repayment continue to consume zero.
12. Redevelopment uses the exact 120% credit formula only for strictly higher-cost targets and never pays a negative difference.

Any change to these decisions requires an owner-approved documentation update before implementation.

## 22. Architecture Review Gates

### Gate A — Environment and Export

- Godot version and executable are recorded.
- The minimal project starts headlessly and graphically.
- A minimal Compatibility Web export loads through HTTP.
- Browser storage feasibility is confirmed early.

### Gate B — Domain Skeleton

- State, phase transitions, commands and ledger run without UI.
- Duplicate transaction protection is demonstrated.
- Save/load round-trip preserves a fixture state.

### Gate C — Map and Rules Integration

- Map nodes render from the same plot data used by rules.
- UI requests cannot mutate authority directly.
- Camera performance and event-driven visual refresh meet the target.

### Gate D — Complete Simulation

- All three personalities finish deterministic 20-turn simulations.
- Auctions, debt disposition, zoning and bankruptcy cannot deadlock the phase machine.
- Final state and ledger signatures repeat for the same seed/actions.

### Gate E — Release Web Build

- Development debug paths are unavailable.
- Save/load survives browser reload.
- Required input, audio, screen sizes and console checks pass.
- The exported build contains no credentials, private configuration or unapproved reference asset.

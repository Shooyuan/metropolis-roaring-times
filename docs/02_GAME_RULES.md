# Metropolis: Roaring Times — Game Rules

> Document role: authoritative gameplay rules for the 20-turn vertical slice
>
> Player-facing language: English
>
> Product scope: `../00_PROJECT_CONTEXT.md`
>
> Product summary: `01_PRODUCT_BRIEF.md`

## 1. Match Definition

- Mode: `vertical_slice`.
- Length: 20 turns unless the player becomes bankrupt earlier.
- Calendar: turn 1 is June 1915; each turn advances one month; turn 14 is July 1916 and turn 20 is January 1917.
- Participants: one human player and one active AI opponent.
- AI roster: Tycoon, Landlady and Shark; all three profiles must be implemented, but only one is active in a match.
- The opponent is selected by the player before the match.
- The government owns public plots, releases auction plots and enforces laws. It is not a normal competitor.
- The match ends after all turn-20 settlement and revaluation steps are complete.

## 2. Deterministic Match Setup

Every new match stores a seed. The seed controls all permitted random choices, including event selection, AI tie-breaking and auction behavior.

### 2.1 Human Starting State

- Cash: `$50,000`.
- Base credit limit: `$100,000`.
- Outstanding principal: `$0`.
- Accrued interest: `$0`.
- Reputation: `0`.
- Owned property: none.

### 2.2 AI Starting State

- The AI starts with the same total net asset value as the human player.
- Part of the AI's starting cash is converted into two personality-appropriate properties.
- The market value of those properties is deducted from the AI's cash; the AI receives no free net-value advantage.
- At least one starting property should demonstrate the opponent's preferred asset type.
- Exact starting plot IDs and buildings are content configuration, not hard-coded rules.

### 2.3 Map State

- The map contains the complete owner-approved set of irregular plots from `08_PURCHASABLE_BLOCK_GEOMETRY`; no target count is imposed by gameplay code.
- District identity and boundaries come only from the owner-approved Figma handoff and its authoritative district SVG; gameplay code cannot create substitute geography. The vertical slice contains exactly the twelve stable district IDs defined in `MAP_ASSET_PIPELINE.md`; the former six-district model is invalid.
- Public plots are owned by the government and cannot be purchased.
- Initial private and unowned plots are defined by the mode configuration.
- All ownership, zoning, adjacency and building state is loaded before the first turn begins.

### 2.4 Owner-authored Plot and Landmark Rules

- A plot exists only when the owner draws and approves its closed vector in Figma. Street enclosures that are absent from that layer are not purchasable.
- A plot grants development rights and supports one primary development building. It starts as undeveloped land; buying it does not automatically construct a building.
- Figma geometry never decides current price, availability, ownership or legal use. Those are runtime values. Laws can change permitted building categories by district.
- A plot may not cross a district boundary. The owner splits it in Figma; validation rejects a crossing but never edits the geometry.
- Central Park is explicitly non-purchasable. No other park, plaza or public-land rule may be invented solely from its map label.
- District, plot and historical-landmark selection are mutually exclusive. A new selection replaces the old one; clicking empty map space clears selection.
- Historical landmarks remain visually present throughout the match and do not change with the game year. Their future gameplay effects are deferred pending owner approval.

## 3. Core Value Definitions

### 3.1 Cash

Liquid money used for purchases, construction, redevelopment, securities trading, maintenance, repayment and auction settlement.

### 3.2 Outstanding Principal

The unpaid principal of all active loan contracts. Principal is a liability and is subtracted from final net asset value.

### 3.3 Accrued Interest

Interest accumulated on an individual loan but not yet paid. Accrued interest is also a liability and is subtracted from net asset value.

### 3.4 Available Credit

```text
available_credit = max(0, current_credit_limit - total_outstanding_principal)
```

Accrued interest does not consume credit limit, but it remains due and reduces net asset value.

### 3.5 Reputation

Reputation gates premium opportunities such as Luxury Apartments and selected high-status plots. Exact thresholds and gains remain data values and must be frozen before building balance implementation.

### 3.6 Invested Cost Basis

`invested_cost_basis` is the amount still invested in the current property:

```text
plot acquisition price
+ construction cost of the building currently present
+ cost of upgrades currently present
+ approved permanent property improvements
```

It excludes:

- market appreciation or depreciation;
- rent and other income;
- maintenance, interest, taxes and penalties;
- costs of buildings or upgrades that have already been demolished;
- temporary event modifiers.

### 3.7 Market Value

`market_value` is the current appraised value of the plot and its existing improvements after district, economy, adjacency, zoning and compliance modifiers.

Cost basis is used for forced bank takeover and emergency-auction starting price. Market value is used for portfolio display, AI evaluation and final ranking.

### 3.8 Securities Portfolio Value

`securities_value` is the sum of each held instrument's quantity multiplied by its current authoritative turn price. Securities are liquid assets in final net asset value, but they do not increase the property-backed credit limit.

### 3.9 District Summary and Prosperity

The district summary is a deterministic derived view of authoritative plot, building, transit and participant state. It does not store a second editable copy of those facts.

At far and middle zoom it displays these fields in this exact order:

1. plots currently purchasable by the human player;
2. human-owned apartment building count, combining Standard and Luxury Apartments;
3. human-owned Factory count;
4. human-owned Department Store count;
5. major transit facilities present;
6. district prosperity level.

District prosperity is jointly determined by owner-approved development inputs from the human player and the active AI opponent. Its authoritative numeric score satisfies `50.0 <= prosperity_score < 100.0` and is displayed to one decimal place. It can approach `100.0` but can never equal it.

District prosperity is distinct from the global economy phase named `Prosperity`. The formula, weights, display labels and level bands require a separate owner-approved balance proposal before implementation. Major transit appears in the summary but must not silently affect prosperity unless that approved formula explicitly includes it.

## 4. Turn State Machine

Each turn follows one authoritative sequence:

1. `TURN_START`
2. `INCOME_SETTLEMENT`
3. `COST_SETTLEMENT`
4. `DEBT_MATURITY`
5. `EVENT_RESOLUTION`
6. `PLAYER_ACTION`
7. `AI_ACTION`
8. `AUCTION_RESOLUTION`
9. `MARKET_REVALUATION`
10. `LAW_AND_ECONOMY_CHECK`
11. `AUTOSAVE`
12. `TURN_END`

The UI cannot skip, reorder or independently reproduce a phase. A phase transition is legal only when the current phase has completed or entered an explicitly defined interruption state.

At `TURN_START`, brokered property sales submitted on the preceding turn settle before income. The seller therefore receives neither maintenance nor income from a property transferred at that boundary.

### 4.1 Income Settlement

- Operational buildings generate deterministic income.
- Buildings under construction generate no income.
- Buildings disabled by an event generate income only if the event rule explicitly permits it.
- Compliance and economy modifiers are applied exactly once.

### 4.2 Cost Settlement

- Building maintenance is charged.
- Current-turn interest is accrued on each active loan at that loan's locked rate.
- Interest is not automatically paid every turn; it remains attached to the loan until partial repayment, full repayment or maturity.
- If ordinary mandatory costs cannot be paid, the participant enters emergency liquidation before bankruptcy.

### 4.3 Debt Maturity

- Loans due on the current turn are processed after income and ordinary cost settlement.
- Cash is applied only after the owner confirms repayment or when the due contract is automatically settled.
- If cash is insufficient, the normal turn pauses and debt disposition begins.
- No event, player action, AI action or market update occurs until all due loans are resolved or the participant becomes bankrupt.

### 4.4 Player Action

- The player receives three action points.
- The player can perform actions in any legal order.
- Ending the phase with unused action points discards them.
- Action points never carry to another turn.

### 4.5 AI Action

- The active AI receives the same normal action-point budget and follows the same legality, cash, credit, building and debt rules.
- AI actions are generated from deterministic utility scores and committed through the same transaction path as human actions.

### 4.6 Turn Completion

- The game revalues property after player, AI and auction transactions.
- Law and economy transitions apply once.
- The game writes an autosave after all state changes.
- After turn 20, final ranking replaces the next-turn transition.

## 5. Action Point Rules

| Action | Action-point cost | Notes |
|---|---:|---|
| Buy an eligible plot directly | 1 | Payment and ownership transfer are atomic |
| Start construction | 1 | Building becomes operational next turn |
| Demolish a building | 1 | Refunds 10% of original construction cost |
| Redevelop a building | 1 | Only into a legal building with strictly higher original construction cost |
| Submit a brokered property sale | 1 | Settles next turn at 90% of locked submission-time market value |
| Buy or sell one securities instrument | 1 | Minimum $1,000 order and 1% fee; no separate financial action resource |
| Enter a scheduled government auction | 0 | Winning and acquiring the plot consumes 1 point |
| Borrow money | 0 | Allowed only in interactive borrowing states |
| Repay money | 0 | Partial and full repayment are allowed |
| Inspect map, property, ledger or timeline | 0 | No state-changing effect |
| Save manually | 0 | Not allowed during an unresolved transaction |
| End turn | 0 | Requires no unresolved modal or transaction |

If the player wins a government auction without one remaining action point, the bid is illegal and cannot be placed. The auction UI must show this restriction before submission.

## 6. Property Purchase

- A plot can be purchased directly only when it is available for direct sale, not public, not reserved for auction and not owned by another participant.
- The displayed purchase price and the committed purchase price must match.
- The player must have enough cash after any explicitly confirmed borrowing.
- Borrowing is never silently triggered by a purchase.
- A successful purchase deducts cash, transfers ownership, records acquisition cost basis, consumes one action point and creates one ledger transaction.
- If any part fails, no cash, ownership or action point changes.

### 6.1 Opening Land-Price Distribution

The vertical-slice balance target divides purchasable opening plots into three bands:

- entry: `$6,000–$10,000`, approximately one third;
- middle: `$11,000–$18,000`, approximately one half;
- premium: `$19,000–$26,000`, the remaining plots.

Exact plot prices are deterministic content data. The distribution must let a player complete an entry purchase plus Standard Apartment while retaining meaningful liquidity.

### 6.2 Brokered Property Sale

- An owned property outside debt disposition may be listed through `Brokered Sale`.
- Submission consumes one action point and locks a gross sale price equal to `90% × current_market_value` using the shared rounding rule.
- The property becomes `sale_pending` and cannot be demolished, redeveloped, pledged to a new action or entered into another auction.
- Settlement occurs at the next `TURN_START`, before income and costs; cash and ownership transfer atomically.
- The locked 10% liquidity discount prevents cost-free same-turn arbitrage.
- Brokered sale cannot resolve a debt already due because that blocking phase cannot advance to the next turn. Debt disposition uses bank takeover or emergency auction instead.

## 7. Buildings

### 7.1 Core Building Types

| Type | Construction cost | Maintenance | Opening base gross income | Opening base net income |
|---|---:|---:|---:|---:|
| Standard Apartment | `$8,000` | `$200` | `$1,400` | `$1,200` |
| Luxury Apartment | `$25,000` | `$800` | `$3,800` | `$3,000` |
| Factory | `$15,000` | `$500` | `$2,900` | `$2,400` |
| Department Store | `$30,000` | `$1,000` | `$5,200` | `$4,200` |

These are the first approved balance baselines before district, transit, pollution, economy, event and law modifiers. They remain centralized configuration values and require simulation calibration; runtime income cannot be selected by an unseeded roll.

### 7.2 Construction

- Construction requires an owned empty plot, one action point, legal zoning and enough cash.
- Construction payment and state transition are atomic.
- A new building is `under_construction` for the remainder of the current turn.
- It becomes `operational` at the start of the next turn.
- It pays no maintenance and earns no income while under construction unless later content explicitly changes this rule.

### 7.3 Building Constraints

- Standard Apartment: affected negatively by nearby factories and positively by transit.
- Luxury Apartment: requires a configured reputation threshold and no disqualifying nearby factory.
- Factory: applies a negative residential-income modifier in its configured radius.
- Department Store: benefits from residential units and suitable commercial location.
- Public transit is prebuilt in the vertical slice and can provide adjacency bonuses; the player cannot build tram or subway infrastructure.
- The fixed transport layer contains two bridges, six subway stations and one tram line with approximately five stops.
- A plot within one adjacency step of an applicable transit facility receives 15% more land value and building income.
- Multiple transit-access bonuses do not stack; only the highest applicable transit bonus is used.
- The former Brooklyn Bridgehead-specific 10% bonus is retired because the owner-approved twelve-district map has no such gameplay district. A future bridge premium requires a separately approved explicit plot list.

### 7.4 Demolition

- Demolition requires ownership and one action point.
- Demolition has no additional cash fee.
- The owner immediately receives 10% of the building's original construction cost.
- The demolished building and its construction cost are removed from current invested cost basis.
- The plot remains owned and becomes empty.
- A building cannot be demolished during an unresolved auction, settlement or debt-disposition transaction.

### 7.5 Redevelopment

- Redevelopment requires ownership, one action point, stable `PLAYER_ACTION`, enough cash and a legal target building.
- The target building's original construction cost must be strictly greater than the current building's original construction cost. Same-cost replacement and downgrade are illegal.
- The cash cost is:

```text
redevelopment_cash_cost = max(
  0,
  new_building_original_cost - 1.20 * old_building_original_cost
)
```

- A negative difference never grants cash. The 120% amount is an upgrade credit used only inside the atomic redevelopment transaction, not a separately withdrawable resale value.
- The old building stops operating immediately and its cost leaves current invested cost basis.
- The replacement enters `under_construction`, adds its full original construction cost to current invested cost basis and becomes operational next turn.
- The property earns no income and pays no building maintenance while the replacement is under construction.
- A non-compliant building whose law state prohibits upgrade cannot redevelop.
- Redevelopment is unavailable while the property is `sale_pending` or involved in an unresolved auction, settlement or debt-disposition transaction.

## 8. Lending and Repayment

### 8.1 Credit Limit by Economy Phase

| Economy phase | Base-limit multiplier | Current limit from `$100,000` base |
|---|---:|---:|
| Opening | 100% | `$100,000` |
| Prosperity | 110% | `$110,000` |
| Overheating | 80% | `$80,000` |
| Adjustment | 60% | `$60,000` |

When the limit falls below existing outstanding principal:

- the bank does not immediately demand the excess;
- no new loan can be issued until outstanding principal is below the current limit;
- existing maturity dates and locked rates do not change;
- a separate story event may impose stronger terms only if that event is explicitly configured.

### 8.2 Loan Creation

- Borrowing does not consume an action point.
- Borrowing is available during `PLAYER_ACTION` and inside a government-auction bidding interface.
- Borrowing is forbidden during settlement, AI action, market revaluation, law transition and debt disposition.
- Each draw creates an independent loan contract.
- Maximum new principal equals available credit.
- Borrowed principal immediately increases cash and outstanding principal.
- Every contract stores principal, accrued interest, locked per-turn rate, issue turn and due turn.
- Default term: six turns.
- A loan issued on turn `T` is due during `DEBT_MATURITY` on turn `T + 6`.

### 8.3 Locked Interest Rate

| Economy phase when borrowed | Rate per turn |
|---|---:|
| Opening | 0.25% |
| Prosperity | 0.25% |
| Overheating | 0.60% |
| Adjustment | 0.75% |

The rate is fixed for that contract. A later economy transition does not alter it.

Per-turn accrual:

```text
interest_accrued_this_turn = outstanding_principal_for_contract × locked_rate
```

The calculation uses integer currency rounding defined in configuration and applied consistently to player and AI.

### 8.4 Early and Partial Repayment

- Repayment does not consume an action point.
- The participant may repay any positive amount up to cash on hand.
- Payment first clears accrued interest on the selected contract.
- Any remainder reduces principal.
- Reduced principal immediately restores the same amount of available credit, subject to the current phase limit.
- Fully repaid contracts become immutable ledger history and no longer accrue interest.

### 8.5 Maturity Warnings

The UI shows persistent warnings three, two and one turns before maturity. Each warning includes:

- contract ID;
- remaining principal;
- accrued interest;
- projected amount due;
- due turn;
- cash shortfall at the current state.

## 9. Debt Disposition and Bankruptcy

### 9.1 Entry

If cash cannot cover all principal and accrued interest due on the current turn, the match enters `DEBT_DISPOSITION`.

The participant may dispose of multiple eligible assets. Normal buying, construction, borrowing, events and AI actions remain blocked.

### 9.2 Bank Takeover

- The bank offer is guaranteed and immediate.
- The property transfer price is `70% × invested_cost_basis`.
- The bank becomes the owner of the plot and its current building.
- Market appreciation does not increase the bank offer.
- The proceeds increase cash and are recorded in the ledger.

### 9.3 Emergency Auction

- The auction starting price is `50% × invested_cost_basis`.
- The property is transferred only if the auction produces a valid winning bid.
- Final price may be below or above the bank takeover offer.
- Bidder roster, narrative presentation and detailed bidding behavior are frozen later during auction-content design and require owner approval.
- Auction proceeds increase cash and are recorded before debt repayment resumes.

### 9.4 Resolution

- Disposition continues until cash can cover every loan due this turn, no eligible assets remain, or the participant ends disposition.
- Once enough cash exists, due contracts are settled before normal play resumes.
- If the participant still cannot cover due principal and interest, that participant is bankrupt.
- Human bankruptcy immediately ends the match in defeat.
- AI bankruptcy immediately ends the match in a human victory for the vertical slice.

### 9.5 Ordinary Emergency Liquidation

If mandatory non-loan costs cannot be paid, the same asset-disposition tools may be used before bankruptcy. This does not change loan maturity dates or permit new borrowing during disposition.

## 10. Financial System and Stock Market

The Financial System is one architecture boundary with three player-facing tabs: `Bank`, `Auction House` and `Stock Market`. The tabs share participant cash, debt, action points, deterministic timing and ledger transactions, but each service keeps its own rules.

### 10.1 Vertical-Slice Instruments

| Stable ID | Player-facing name | Role | Availability |
|---|---|---|---|
| `municipal_railroad_bonds` | Municipal & Railroad Bonds | Low-volatility liquidity reserve; after fees it must not create risk-free borrowing arbitrage | Opening onward |
| `industrial_shares` | Industrial Shares | Economy-sensitive equity basket with medium/high volatility | Opening onward |
| `metropolitan_investment_trust` | Metropolitan Investment Trust | Leveraged-theme high-risk pooled security with severe downside events | Prosperity onward |

These are fictional aggregate instruments shaped by historical market behavior. The vertical slice does not simulate individual real companies, live prices or a real exchange feed.

### 10.2 Securities Orders

- Every buy or sell is a normal state-changing action that consumes one of the participant's three action points.
- There is no separate `Financial Order` point, token or per-turn resource.
- Minimum gross order value is `$1,000`.
- Every buy and sell charges `1%` of gross order value using the shared currency rounding rule.
- A buy must be fully covered by cash; no silent bank loan or broker margin is created.
- Short selling, broker margin, options, commodity futures and same-instrument intraturn price movement are not implemented.
- A failed or duplicate order changes no cash, holding, action point or ledger state.

### 10.3 Pricing and Settlement

- Each instrument has one authoritative price per turn.
- Orders during `PLAYER_ACTION` settle immediately at the displayed turn price plus or minus the transaction fee.
- Prices change once during `MARKET_REVALUATION` from configured economy, event and deterministic-stream inputs.
- The same instrument cannot offer a guaranteed after-fee return above the corresponding new-loan rate.
- Securities remain more liquid but have lower risk-adjusted expected return than a well-selected operational property.
- Securities have zero weight in property-backed credit-limit calculations.

### 10.4 AI and Results

- The AI may trade the same instruments through the same legality, action-point, fee and information rules.
- AI personalities may use different portfolio weights but receive no hidden price or future-news information.
- Current securities value is included in net asset value; unrealized gains and losses are shown separately from property value and cash.

## 11. Economy Phases

| Turns | Phase | Credit multiplier | New-loan rate | Intended pressure |
|---|---|---:|---:|---|
| 1–4 | Opening | 100% | 0.25% | Establish the first portfolio |
| 5–10 | Prosperity | 110% | 0.25% | Expand while land values rise |
| 11–15 | Overheating | 80% | 0.60% | Expensive assets and tighter finance |
| 16–20 | Adjustment | 60% | 0.75% | Falling values and liquidity pressure |

Land-price, income and event multipliers remain configuration data and require simulation calibration. Economy phase changes never retroactively alter a loan's fixed rate.

## 12. Property Revaluation

Revaluation is centralized in the rule engine and considers at least:

- district base value;
- plot attributes;
- current economy phase;
- nearby public transit;
- nearby factory pollution;
- nearby park or public landmark;
- current building type and state;
- zoning and compliance status;
- configured local ownership or scarcity modifiers.

The map view never calculates authoritative value. It displays the result and the major contributing modifiers.

## 13. Government Auctions

- At least two government plot auctions occur in a match.
- Trigger turn and eligible plot pool come from mode data.
- Every auction needs an approved narrative reason connected to the plot and current economy; placeholder stories cannot ship.
- The normal format is an English ascending auction.
- Entering a scheduled auction costs no action point.
- A participant must have one action point available to place a potentially winning bid.
- Winning transfers the property, deducts cash, consumes one action point and writes a ledger entry.
- Losing or withdrawing consumes no action point.
- Borrowing is allowed from inside the bidding interface, within normal credit limits.
- Bids cannot exceed cash plus available credit.
- AI bids are bounded by its utility valuation and liquidity policy.
- Maximum rounds and exit conditions prevent infinite bidding.
- Win, loss, withdrawal, insufficient funds and no-sale paths all return to a valid turn state.

Government-auction stories and emergency-debt-auction stories are separate content categories.

## 14. AI Rules

### 14.1 Shared Rules

- AI uses the same action points, prices, construction/redevelopment delay, brokered-sale timing, securities rules, lending terms, maturity rules and bankruptcy conditions as the player.
- AI does not call an online model.
- Every decision is reproducible from state and seed.
- AI cannot use law information that has not been publicly foreshadowed.

### 14.2 Personality Priorities

- Tycoon weights factories, transit adjacency, clusters and mid-game expansion.
- Landlady weights apartments, premium residential location, compliance and stable income.
- Shark weights liquidity, discount to expected market value and auction price pressure.

Personality differences must be expressed through documented weights and constraints, not only names, portraits or dialogue.

### 14.3 Debug Evidence

For every evaluated state, development tools can expose:

- cash and available credit;
- outstanding loans and maturity pressure;
- current target;
- valuation range;
- personality modifiers;
- selected action and rejected alternatives;
- final score explanation.

## 15. Compressed 1916 Zoning Law

### 15.1 Timeline

- Turn 10: first public warning.
- Turn 12: second public warning.
- Turn 14: enactment.
- Turns 15–16: transition warnings.
- Turn 17 onward: full penalties.

### 15.2 Enactment Effects

- Every plot receives `Residential`, `Business` or `Unrestricted` legal zoning.
- Residential zoning blocks new Factory and Department Store construction.
- A building legally started before enactment is treated as pre-existing.
- A pre-existing non-compliant building is not demolished automatically.
- During transition it displays a warning but receives no full penalty.
- From turn 17 it earns 30% less income and cannot be upgraded.
- Compliance state must be visible on map and property details.

Setback, coverage and property-exchange discount rules are future modifiers and have no fake current implementation.

## 16. News and Investment Advice

### 16.1 Source Types

Every visible item stores `turn_or_date`, `source_name`, `source_type`, `authenticity`, `headline`, `summary`, `affected_systems`, `expiry` and an optional verified source citation.

- `historical_newspaper`: only a verified historical event attributed to a real newspaper active on that date; displayed with `Historical`.
- `fictional_newspaper`: fictional city reporting using an approved fictional masthead; displayed with `Fictional`.
- `government_source`: zoning or law information attributed in player-facing English to `Sources familiar with the New York State Government`; displayed with `Rumor` until officially enacted.
- `activity`: ledger-derived player, AI and market activity; never presented as a historical newspaper report.

No invented quotation or unverified headline may be placed under a real newspaper name. Historical content keeps a source date and citation in content data even when the player-facing summary is a paraphrase.

### 16.2 Presentation

The former `Investment Advice` page is integrated into the scrolling `News` tab of the Integrated Operations Panel. It may filter `Headlines`, `Advice` and `Activity`. The ice-cream board mascot remains visible in News and selects one of five deterministic expressions from match state. `Game Brief` is no longer a tab; it is opened from `Config`.

## 17. Manual Save and Autosave

- The vertical slice provides one manual save slot and one autosave slot.
- Manual save is allowed only in a stable interactive state with no unresolved transaction or modal.
- Autosave occurs after law/economy checks and before turn completion.
- Save data includes schema version, mode, seed, turn, phase, participant state, loans, plots, buildings, construction/redevelopment, pending brokered sales, securities holdings and prices, economy, laws, news/events, auction state where permitted and ledger.
- Loading must reproduce the saved state exactly.
- Loading never replays an already committed transaction.

## 18. Ledger and Atomicity

Every state-changing transaction receives a stable ID and records:

- turn and phase;
- participant;
- action type;
- cash before and after;
- principal and interest before and after when applicable;
- property/building ownership before and after;
- action points before and after;
- reason and rule modifiers.

Purchase, construction, demolition, redevelopment, brokered-sale submission/settlement, securities order, loan, repayment, takeover, auction, income, maintenance, law penalty and bankruptcy operations are atomic. A failed operation changes nothing.

## 19. Victory and Defeat

Final net asset value is:

```text
cash
+ current market value of owned plots
+ current market value of owned buildings and permanent improvements
+ current market value of securities holdings
- all outstanding principal
- all accrued interest
```

- Highest net asset value after turn 20 wins.
- Ties are resolved by reputation, then cash, then number of configured strategic plots.
- Human bankruptcy is an immediate defeat.
- AI bankruptcy is an immediate human victory in the vertical slice.
- The original `$500,000` three-turn victory countdown is not implemented in this mode.

## 20. Randomness and Rounding

- All randomness uses the match seed and named deterministic streams.
- Currency is stored as integer dollars unless implementation evidence proves cents are required.
- One documented rounding rule is used everywhere.
- UI formatting never changes authoritative values.
- The same version, seed, initial state and action sequence must produce identical final state and ledger.

## 21. Deferred Rules

The following original-PRD systems are not active in the vertical slice:

- a full listed-property exchange beyond the fixed-price brokered sale;
- sealed bids initiated by property owners;
- hostile acquisitions and poison-pill responses;
- private AI negotiation;
- player-built tram and subway systems;
- individual-company shares, commodity futures, options, short selling and broker margin;
- a live-network conversational mascot or real-time market feed;
- old-law tenement lifecycle;
- the remaining seven historical law milestones;
- full Classic, Extreme and Roaring modes.

Their future existence cannot create visible non-functional controls in the current build.

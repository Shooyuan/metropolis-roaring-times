# Roaring Times — Game Rules

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

- The map contains exactly 64 irregular interactive plots.
- Public plots are owned by the government and cannot be purchased.
- Initial private and unowned plots are defined by the mode configuration.
- All ownership, zoning, adjacency and building state is loaded before the first turn begins.

## 3. Core Value Definitions

### 3.1 Cash

Liquid money used for purchases, construction, maintenance, repayment and auction settlement.

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

## 7. Buildings

### 7.1 Core Building Types

| Type | Construction cost | Maintenance | Base income range |
|---|---:|---:|---:|
| Standard Apartment | `$8,000` | `$200` | `$600–$1,200` |
| Luxury Apartment | `$25,000` | `$800` | `$2,000–$4,000` |
| Factory | `$15,000` | `$500` | `$1,000–$2,500` |
| Department Store | `$30,000` | `$1,000` | `$1,500–$5,000` |

The final deterministic base values and district multipliers are configuration data. Runtime income cannot be chosen by an unseeded roll inside the displayed range.

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
- Configured Brooklyn Bridgehead plots receive an additional 10% land-value bonus from bridge access.
- Multiple transit-access bonuses do not stack; only the highest applicable transit bonus is used. The separate configured bridgehead bonus may apply in addition.

### 7.4 Demolition

- Demolition requires ownership and one action point.
- Demolition has no additional cash fee.
- The owner immediately receives 10% of the building's original construction cost.
- The demolished building and its construction cost are removed from current invested cost basis.
- The plot remains owned and becomes empty.
- A building cannot be demolished during an unresolved auction, settlement or debt-disposition transaction.

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

## 10. Economy Phases

| Turns | Phase | Credit multiplier | New-loan rate | Intended pressure |
|---|---|---:|---:|---|
| 1–4 | Opening | 100% | 0.25% | Establish the first portfolio |
| 5–10 | Prosperity | 110% | 0.25% | Expand while land values rise |
| 11–15 | Overheating | 80% | 0.60% | Expensive assets and tighter finance |
| 16–20 | Adjustment | 60% | 0.75% | Falling values and liquidity pressure |

Land-price, income and event multipliers remain configuration data and require simulation calibration. Economy phase changes never retroactively alter a loan's fixed rate.

## 11. Property Revaluation

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

## 12. Government Auctions

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

## 13. AI Rules

### 13.1 Shared Rules

- AI uses the same action points, prices, construction delay, lending terms, maturity rules and bankruptcy conditions as the player.
- AI does not call an online model.
- Every decision is reproducible from state and seed.
- AI cannot use law information that has not been publicly foreshadowed.

### 13.2 Personality Priorities

- Tycoon weights factories, transit adjacency, clusters and mid-game expansion.
- Landlady weights apartments, premium residential location, compliance and stable income.
- Shark weights liquidity, discount to expected market value and auction price pressure.

Personality differences must be expressed through documented weights and constraints, not only names, portraits or dialogue.

### 13.3 Debug Evidence

For every evaluated state, development tools can expose:

- cash and available credit;
- outstanding loans and maturity pressure;
- current target;
- valuation range;
- personality modifiers;
- selected action and rejected alternatives;
- final score explanation.

## 14. Compressed 1916 Zoning Law

### 14.1 Timeline

- Turn 10: first public warning.
- Turn 12: second public warning.
- Turn 14: enactment.
- Turns 15–16: transition warnings.
- Turn 17 onward: full penalties.

### 14.2 Enactment Effects

- Every plot receives `Residential`, `Business` or `Unrestricted` legal zoning.
- Residential zoning blocks new Factory and Department Store construction.
- A building legally started before enactment is treated as pre-existing.
- A pre-existing non-compliant building is not demolished automatically.
- During transition it displays a warning but receives no full penalty.
- From turn 17 it earns 30% less income and cannot be upgraded.
- Compliance state must be visible on map and property details.

Setback, coverage and property-exchange discount rules are future modifiers and have no fake current implementation.

## 15. Manual Save and Autosave

- The vertical slice provides one manual save slot and one autosave slot.
- Manual save is allowed only in a stable interactive state with no unresolved transaction or modal.
- Autosave occurs after law/economy checks and before turn completion.
- Save data includes schema version, mode, seed, turn, phase, participant state, loans, plots, buildings, construction, economy, laws, events, auction state where permitted and ledger.
- Loading must reproduce the saved state exactly.
- Loading never replays an already committed transaction.

## 16. Ledger and Atomicity

Every state-changing transaction receives a stable ID and records:

- turn and phase;
- participant;
- action type;
- cash before and after;
- principal and interest before and after when applicable;
- property/building ownership before and after;
- action points before and after;
- reason and rule modifiers.

Purchase, construction, demolition, loan, repayment, takeover, auction, income, maintenance, law penalty and bankruptcy operations are atomic. A failed operation changes nothing.

## 17. Victory and Defeat

Final net asset value is:

```text
cash
+ current market value of owned plots
+ current market value of owned buildings and permanent improvements
- all outstanding principal
- all accrued interest
```

- Highest net asset value after turn 20 wins.
- Ties are resolved by reputation, then cash, then number of configured strategic plots.
- Human bankruptcy is an immediate defeat.
- AI bankruptcy is an immediate human victory in the vertical slice.
- The original `$500,000` three-turn victory countdown is not implemented in this mode.

## 18. Randomness and Rounding

- All randomness uses the match seed and named deterministic streams.
- Currency is stored as integer dollars unless implementation evidence proves cents are required.
- One documented rounding rule is used everywhere.
- UI formatting never changes authoritative values.
- The same version, seed, initial state and action sequence must produce identical final state and ledger.

## 19. Deferred Rules

The following original-PRD systems are not active in the vertical slice:

- listed property sales;
- sealed bids initiated by property owners;
- hostile acquisitions and poison-pill responses;
- private AI negotiation;
- player-built tram and subway systems;
- old-law tenement lifecycle;
- the remaining seven historical law milestones;
- full Classic, Extreme and Roaring modes.

Their future existence cannot create visible non-functional controls in the current build.

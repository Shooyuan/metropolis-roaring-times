# Roaring Times — Product Brief

> Document role: approved product summary for the current vertical slice
>
> Product title: **Roaring Times**
>
> Chinese reference title: 《大都会：咆哮年代》
>
> Player-facing language: **English**
>
> Authoritative scope: `../00_PROJECT_CONTEXT.md`

## 1. Product Definition

Roaring Times is a single-player, turn-based property strategy game set in a stylized historical New York. The player buys land, develops buildings, manages cash and credit, reacts to economic cycles and regulation, and competes with a personality-driven AI opponent for the most valuable real-estate portfolio.

The map is not a decorative backdrop. It is the main decision surface: location, zoning, nearby infrastructure, pollution, public landmarks and ownership all affect the value of a plot.

## 2. Current Delivery Goal

The first playable release is **Vertical Slice Test Mode**:

- 20 turns.
- Approximately 20–30 minutes per match.
- One human player versus one AI opponent.
- Three implemented AI personalities: Tycoon, Landlady and Shark.
- One AI personality is active in a match; opponent selection behavior will be frozen before the new-game flow is implemented.
- Exactly 64 irregular, interactive plots across a stylized Manhattan and a small Brooklyn bridgehead area.
- A complete match from opening state to final result.
- A Godot project that can be exported and played in a desktop browser.

This mode compresses the economy and the 1916 zoning milestone into 20 turns to validate the game loop. It does not replace the long-term 1910–1935 historical timeline.

## 3. Player Fantasy

The player should feel like a bold New York property operator who reads the city faster than the competition:

- Acquire land before a district rises.
- Decide whether to build stable housing, profitable commerce or disruptive industry.
- Borrow aggressively during expansion without becoming fragile before a downturn.
- Contest a story-driven government auction against a recognizable rival.
- Read public warning signs before a law changes what can be built.
- Finish the match with a portfolio whose value reflects a chain of visible decisions.

## 4. Core Loop

```text
Read the map and market
→ choose up to three actions
→ buy, build, demolish or bid
→ resolve the AI opponent
→ settle income, costs and credit
→ revalue land and buildings
→ apply economy and law changes
→ save and advance the turn
```

The 1916 zoning law is an external rule change inside the property game. It is not the player's primary action and must not turn the product into a decree-card selection game.

## 5. Experience Pillars

### 5.1 The City Is Legible

The player can understand district identity, plot ownership, value, building use, zoning and risk without opening a spreadsheet outside the game.

### 5.2 Location Creates Strategy

Parks, transit, factories, public buildings and district identity create clear advantages and disadvantages. Two plots with the same size should not automatically have the same strategic value.

### 5.3 The Rival Has a Personality

Tycoon, Landlady and Shark use different evaluation weights and portfolio goals. Across separate matches, the three opponents must make meaningfully different purchases, bids and building decisions.

### 5.4 Growth Has a Cost

Cash, debt capacity and reputation solve different problems. Expansion during prosperity increases exposure to interest, falling land values and forced inaction during adjustment.

### 5.5 Rules Change the Value of Earlier Decisions

The compressed 1916 zoning milestone is announced before it takes effect. Prepared players can reposition; ignored warnings can leave a profitable building non-compliant.

### 5.6 Every Result Is Explainable

Money, ownership, income, costs, land value and compliance changes are recorded in an auditable ledger. The player and the development team can understand why a result occurred.

## 6. Match Structure

- The human player starts with `$50,000` cash, `$100,000` opening credit and `0` reputation.
- The player starts without owned property.
- The AI opponent starts with a small personality-appropriate portfolio; exact assets are frozen during balance design.
- Each turn gives the player three action points.
- At least two government auctions occur during the match.
- Every auction must have a narrative reason for the land release or forced sale. Story details are not invented until the owner approves the auction content brief.
- The economy moves through opening, prosperity, overheating and adjustment.
- The 1916 zoning milestone is foreshadowed, enacted and enforced through a transition period.
- After turn 20, the participant with the highest net asset value wins.
- Ties are resolved by reputation, then cash, then number of strategically important plots.
- A player who cannot pay mandatory costs, has no available credit and has no disposable assets loses early through bankruptcy.

## 7. Content Summary

### 7.1 Map

Five gameplay groupings organize the map:

1. Lower Manhattan.
2. Midtown.
3. Central Park District.
4. Hell's Kitchen and Lower East Side as separate geographic subareas sharing one low-cost mixed-use gameplay category.
5. Brooklyn Bridgehead.

Central Park, City Hall, the public library, major bridges and initial transit nodes are public assets and cannot be purchased.

### 7.2 Core Buildings

- Standard Apartment.
- Luxury Apartment.
- Factory.
- Department Store.

Transit is initially represented by public infrastructure and adjacency effects. Player-built tram and subway networks are deferred from the vertical slice.

The fixed transport layer contains the Brooklyn and Manhattan bridges, six subway stations and one tram line with approximately five stops. Nearby plots receive a non-stacking transit-access bonus.

### 7.3 AI Roster

- **Tycoon** prefers industry, transit access and clustered production assets.
- **Landlady** prefers housing, premium locations and stable cash flow.
- **Shark** prefers liquidity, mispriced assets and price pressure in auctions.

The vertical slice is 1v1, but all three personalities must be implemented and testable in separate matches.

### 7.4 Law Content

The vertical slice implements only the compressed 1916 Zoning Resolution:

- Public warnings on turns 10 and 12.
- Enactment on turn 14.
- Transition messaging on turns 15–16.
- Full non-compliance penalties from turn 17.

Setback, floor coverage and exchange-price penalties remain future law modifiers; they are not represented by fake UI in the current release.

## 8. Visual and Audio Identity

The visual direction combines:

- Early twentieth-century New York promotional maps.
- Art Deco geometry.
- A strict palette sampled from the supplied map: cream paper, dark brown ink, warm peach-orange water and a restrained compass red.
- Hand-drawn architectural vignettes and slightly imperfect print registration.
- Original rubber-hose-inspired AI portraits with five consistent emotional states, used for rival identity, bidding and reactions.

The supplied Manhattan pictorial map is a composition and style reference, not a final background asset. The playable geography, plot polygons and status layers are original structured assets.

Audio supports interaction and atmosphere through restrained period-inspired music and tactile cues such as typewriters, telephones, printing presses, cash registers and an auction gavel. Audio polish is not allowed to delay core-rule completion.

## 9. Platform and Accessibility Baseline

- Engine: Godot 4.x, GDScript and Compatibility renderer.
- First playable delivery: single-threaded Web export.
- No server, account, online database or runtime network dependency.
- Target desktop resolutions: 1920×1080, 1440×900 and 1366×768.
- Player-facing text is English.
- Important states use text, icons, outlines or patterns in addition to color.

## 10. Explicitly Out of Scope for the Vertical Slice

- Full 312-turn Classic Mode content.
- The remaining seven historical law milestones.
- Extreme Mode and Roaring Mode as playable modes.
- Property listing, sealed bids, hostile takeovers and poison-pill responses.
- Private negotiation with AI.
- Player-built tram and subway networks.
- The complete old-law tenement lifecycle.
- Multiplayer, online services, cloud saves, leaderboards and accounts.
- Additional cities, procedural maps, mobile and console releases.
- Cinematics, voice acting, complex character animation and street-level citizen simulation.

## 11. Long-Term Product Direction

The architecture should support, without pretending to implement now:

- Classic Mode from January 1910 through December 1935, one month per turn.
- Eight historical law milestones and the full old-law tenement lifecycle.
- Extreme and Roaring modes.
- Property exchange and hostile acquisition systems.
- Longer economic cycles, additional transport systems and additional cities.

## 12. Product Success Criteria

The vertical slice succeeds when:

- A new player can start and finish a 20-turn match without developer guidance.
- Buying, building, bidding and ending a turn are understandable.
- The AI opponent creates pressure consistent with the selected personality.
- The economic adjustment and zoning law both change sensible player behavior.
- The final result explains the portfolio, ranking and major turning points.
- The same seed and action sequence reproduce the same result.
- The browser build completes a full match without blocking errors.

## 13. Product Risks

- Sixty to eighty plots plus three complete AI personalities remain a medium-sized vertical slice.
- The economy can become unreadable if formulas are exposed before they are calibrated.
- A narrative auction can become cosmetic if its story is not connected to the plot, price and rival behavior.
- Generated art can drift in period, perspective and character identity.
- Historical housing policy requires careful framing and must not be reduced to celebratory bonuses.

These risks are controlled through milestone gates, data-driven rules, automated simulation, owner review and one recoverable Git commit per completed documentation or development stage.

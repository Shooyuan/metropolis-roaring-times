# Metropolis: Roaring Times — Implementation Plan

> Document role: authoritative milestone sequence for the 20-turn vertical slice
>
> Execution model: one approved stage at a time, test/fix, save, Git commit, owner report, next-stage approval
>
> Scope authority: `../00_PROJECT_CONTEXT.md` and `01_PRODUCT_BRIEF.md` through `06_ACCEPTANCE_TESTS.md`

## 1. Plan Objective

This plan turns the frozen product, rules, visual, architecture and acceptance documents into a recoverable sequence of Godot milestones.

The final target remains a complete English-language, browser-playable 20-turn 1v1 vertical slice. The plan also adds one explicit interim deliverable requested by the owner: a deliberately plain but fully functional investor gameplay prototype before final art production.

The plan does not authorize work on the full 312-turn mode or any deferred system.

## 2. Current Baseline

The first documentation-reconciliation stage consists of:

| Stage | Document | Status at D7 completion |
|---|---|---|
| D1 | Product Brief | Complete |
| D2 | Game Rules | Complete |
| D3 | Vertical Slice Scope | Complete |
| D4 | Map and Art Direction | Complete |
| D5 | Technical Architecture | Complete |
| D6 | Acceptance Tests | Complete |
| D7 | Implementation Plan | Complete after this document passes tests and is committed |

The standalone M0W Web Graybox was completed in commit `ee6eccf`, the M0.1D specification synchronization was completed in commit `0cd57f4`, and the M0.1W revision was completed in commit `baef8ea`. The Codex/DeepSeek collaboration boundary was committed as `0885c3f`. M0G established the verified production Godot baseline without beginning gameplay implementation. M1W now includes the owner-approved v004 runtime package with 12 districts, 30 plots and 52 landmarks for browser validation; historical copy, production building art and Godot M1B remain separately gated.

## 3. Mandatory Stage Protocol

Every implementation stage follows this sequence:

1. Read `AGENTS.md`, the authoritative documents, Git status and latest commit.
2. Report the stage objective, files, tests, risks, external actions and required owner decisions.
3. Obtain explicit owner approval to start.
4. Change only the approved stage scope.
5. Run all newly applicable acceptance tests and relevant regressions.
6. Fix every discovered blocker/serious defect and all failures required by the stage gate.
7. Save all related files and inspect the complete Git diff.
8. Confirm no cache, secret, proxy, personal configuration or unrelated change is included.
9. Create the stage Git commit.
10. Report files, evidence, commit, remaining risk and the proposed next stage.
11. Wait for explicit approval before starting the next stage.

A test failure, unsaved file or failed commit prevents stage completion. Work may remain in the worktree while a failure is being fixed, but it must be reported and cannot be called complete.

### 3.1 Commit Policy

- Each stage and approved substage receives its own recoverable commit.
- The investor prototype is a separate stage and commit.
- A commit message describes the delivered capability rather than an internal activity.
- Existing commits are not rewritten merely to improve wording or automatic author identity.
- The current local Git identity may remain during development. Before public release, the owner may provide the desired public name and email.

### 3.2 Change Policy

- A new product rule updates the relevant specification and acceptance test before code.
- A change that expands scope requires an owner-approved trade-off.
- Deferred controls are not added as disabled placeholders.
- Temporary visual assets must be clearly marked and must not enter the final visual approval by accident.

## 4. External Action and Tool Policy

M0 first inventories the local environment. If Godot, Web export templates or a necessary tool is missing:

1. stop at the discovery result;
2. report the missing component, source, version, size/impact and alternative if any;
3. ask the owner for installation/download approval;
4. install only after approval;
5. record the result in project documentation.

The project does not silently install a Godot plugin, change global Git identity, write a proxy configuration, add a network service or download a third-party asset.

Godot MCP is an optional development aid. Project files and command-line verification remain the fallback and source of truth.

## 5. Effort and Risk Scale

Before M0 there is insufficient environment evidence for calendar commitments. The plan therefore uses relative size:

| Level | Meaning |
|---|---|
| Small | Narrow capability with limited content and dependencies |
| Medium | Multiple connected components or one meaningful owner review |
| Large | Major gameplay system, substantial content or broad regression surface |
| Extra Large | Broad integration with art/export/performance or many acceptance groups |

Risk levels describe uncertainty and rework exposure, not expected quality.

After M0, the project manager provides a more credible forecast based on Godot availability, export-template status, test speed and tool capability. A date is not promised without owner approval.

## 6. Milestone Overview

| Stage | Outcome | Size | Main risk |
|---|---|---:|---|
| M0W | Immediate plain Web gameplay prototype for investor explanation | Medium | Prototype/production boundary |
| M0.1D | Synchronize approved M0.1 rules through every authoritative document | Medium | Cross-document contradiction |
| M0.1W | Historical: revise the plain Web prototype for its then-approved five-tab layout | Large | Prototype scope expansion and balance |
| M0G | Verified Godot environment, test runner and Web smoke build (complete) | Medium | Local Godot/Web capability |
| M1W | 将老板 Figma 地图接入现有 M0 网页，形成制作人地图交互 Demo | Medium | Figma 交付完整性、SVG 坐标与浏览器性能 |
| M1A | Validate the owner Figma package and integrate an owner-approved map overlay | Medium | Input completeness and conversion fidelity |
| M1B | Complete owner-approved plot/landmark data, camera and geometry validation | Large | Polygon production and input accuracy |
| U1 | English 1920×1080 full-screen game-UI style concept | Medium | Style fit without copying reference-game assets |
| U2 | Five-module and modal style sheets | Medium | Cross-module consistency and information density |
| U3 | Implementable component/state/asset specification | Medium | Responsive slicing, states and handoff precision |
| M2 | Plot interaction and responsive UI shell | Large | Screen density and state clarity |
| M3 | Property purchase, finance, ledger and save foundation | Large | Atomic money/debt state |
| M4 | Buildings, settlement and economy loop | Large | Formula order and turn boundaries |
| M5 | Three deterministic AI personalities | Large | Distinct behavior without cheats |
| M5F | Securities market, News/advice and provenance | Large | Financial dominance, leverage and historical attribution |
| M6 | Government and emergency auctions | Large | Bid flow, funding and deadlock risk |
| M7 | Zoning law, events and full graybox rules loop | Large | Timeline/state integration |
| G1 | Investor Graybox Web Demo | Medium | Communicating unfinished visuals honestly |
| M8A | Owner-approved production art samples | Large | Style consistency and historical accuracy |
| M8B | Complete production art/audio integration | Extra Large | Asset volume, licensing and Web memory |
| M9 | Final saves, results, full QA and release Web build | Extra Large | Cross-system regression and browser storage |

M1 and M8 are split because the owner must approve a sample before bulk production. Each substage is independently tested and committed.

## 7. M0W — Immediate Web Graybox Prototype

### 7.1 Objective

Before any Godot work, deliver a deliberately plain standalone Web prototype that lets the owner explain the core property-strategy idea to investors.

### 7.2 Fixed Prototype Boundary

M0W uses local HTML, CSS and JavaScript with no runtime network, login, database or required external framework. It is a disposable communication prototype, not the production codebase and not evidence that the final owner-approved plot set is complete.

The first version uses:

- basic white/light backgrounds and black/dark frames;
- English player-facing text;
- a compressed representative Manhattan plot layout;
- a short eight-turn demonstration rather than the final 20-turn mode;
- one selected rival from Tycoon, Landlady or Shark;
- purchase, four building choices, borrowing/repayment, income, AI competition, a compressed economy shift and a zoning warning/effect;
- a simple net-worth result and local browser save;
- a visible `M0 WEB GRAYBOX — NOT FINAL ART` label.

Government/emergency auctions are not faked in M0W because their story and bidder content still requires later owner approval. They enter the production sequence at M6 and the full investor build at G1.

### 7.3 Work

- Add a self-contained `m0_web/` site inside the repository.
- Build an investor-readable single-screen game layout.
- Implement clickable irregular representative plots and clear ownership patterns.
- Implement a deterministic short match with three action points per turn.
- Implement simple but real purchase, construction, loan, repayment, income and rival actions.
- Implement first-use instructions, event/transaction log, restart and local save/load.
- Keep all values labeled as prototype tuning rather than final balance.
- Validate the page through a local HTTP server and browser interaction.
- Update the plan and development record so reconnects do not mistake M0W for Godot M0.

### 7.4 Gate and Evidence

- Page loads without a blocking console error.
- Rival selection works for Tycoon, Landlady and Shark.
- A user can buy, build, borrow/repay, end turns and reach the turn-eight result.
- Rival actions change according to the selected personality at a demonstrable level.
- Repeated rapid input cannot commit the same player action twice.
- Save/load and restart preserve or reset the intended prototype state.
- Required content remains usable at `1366×768`.
- The page is clearly labeled as provisional and contains no claim of final art or final balance.
- Files are tested, saved and committed as one M0W stage.

### 7.5 Risk

Medium-high. The prototype creates temporary duplicate rule code. To contain rework, it stays dependency-free, isolated in `m0_web/` and is never imported into the later Godot implementation.

## 7A. M0.1D — Cross-Document Rule Synchronization

### Objective

Before changing the prototype, make the project title, redevelopment, property sale, securities, news provenance and Integrated Operations Panel one consistent specification across the root authority and every implementation document.

### Work

- Rename the player-facing product to `Metropolis: Roaring Times` without renaming the repository directory.
- Define strictly upward redevelopment using `max(0, new_cost - 120% × old_original_cost)` and prohibit negative payouts.
- Define the 90% next-turn brokered property sale.
- Add the three-instrument stock market, one-action-point orders, `$1,000` minimum, `1%` fee and no extra `Financial Order` resource.
- Define historical, fictional, government-source and activity news provenance.
- Historical note: M0.1D froze the then-approved five-tab Integrated Operations Panel and top-bar `End Turn`; `IN_GAME_UI_LAYOUT_SPEC.md` now supersedes that presentation decision without rewriting the old prototype.
- Update rules, scope, art/UI, architecture, acceptance, milestones, development log and prototype README.

### Gate and Evidence

- Markdown structure and local-link checks pass.
- Global searches find no active specification that still requires `Roaring Times` as the standalone title, a fixed bottom toolbar, stock trading as deferred, ranged old building income or a separate financial-action resource.
- Original reference PRDs remain untouched.
- The complete document diff is saved and committed as one M0.1D commit.

### Risk

High. The 120% credit produces a money loop unless redevelopment is limited to a strictly higher original construction cost and the cash result is floored at zero. The securities scope also touches AI, save, results and tests and cannot be documented as UI-only work.

## 7B. M0.1W — Web Graybox Economic and UI Revision

**Status:** Complete after the M0.1W stage commit and owner report recorded by this gate.

### Objective

Revise the existing standalone Web prototype, after separate owner approval, so investors can experience the newly documented liquidity loop without starting Godot production.

### Work

- Apply the `Metropolis: Roaring Times` title.
- Implement the then-approved five-tab Integrated Operations Panel and top-bar `End Turn`; this remains historical M0.1W behavior and is not the final UI contract.
- Implement redevelopment, brokered property sale and the approved opening land/income rebalance.
- Implement the three-instrument stock market with action-point cost, fee, deterministic revaluation, holdings and result value.
- Implement the historical Investment Advice source badges and data structure; final presentation integrates this feed into News.
- Preserve three total action points, zero-action bank borrowing/repayment and the prototype's local save/load.
- Keep `Auction House` honest with `No scheduled auctions` until owner-approved stories are supplied.

### Gate and Evidence

- The updated prototype completes a legal eight-turn match without a dead turn.
- Redevelopment, pending sale, securities, save/load, restart and result calculations pass focused browser tests.
- The historical M0.1W title, tab order and independent scrolling pass at `1366×768`; this is regression evidence for that prototype, not final-layout acceptance.
- Rapid duplicate input cannot duplicate money, holdings, ownership or action-point consumption.
- Files are saved and committed as a separate M0.1W stage.

### Risk

High. This is a substantial disposable-prototype revision. It must not be mistaken for completion of the production Godot services, the 20-turn balance or the story-driven auction system.

## 8. M0G — Godot Environment and Minimum Runtime

**Status:** Complete after the M0G stage commit and owner report recorded by this gate.

### 8.1 Objective

Prove that the local machine can edit, test and export the chosen Godot project before gameplay implementation begins.

### 8.2 Work

- Locate and record the exact Godot executable/version.
- Inspect available Godot MCP capabilities without making them mandatory.
- Check Compatibility renderer and single-threaded Web export support.
- Check whether the matching Web export templates are installed.
- Update the project display name from the current placeholder to `Metropolis: Roaring Times`.
- Establish a minimal main scene that starts and exits cleanly.
- Establish `tests/run_all.gd` and one passing/failing assertion demonstration.
- Establish the initial source/data/test directory skeleton only where immediately used.
- Produce a minimal HTTP-served Web smoke export.
- Confirm basic `user://` persistence feasibility in Chrome.
- Record findings in `docs/MCP_CAPABILITIES.md` and the development log.

### 8.3 Not Yet

- No gameplay map.
- No final UI or art.
- No gameplay rule implementation beyond a minimal testable application shell.

### 8.4 Gate and Evidence

- Godot exact version recorded.
- Headless runner exits success for passing tests and failure for an intentional isolated assertion.
- Main scene starts/exits without a blocking error.
- Minimal Chrome Web build loads over HTTP.
- Missing components are either approved/installed or reported as a blocker.

Primary acceptance references: `SCN-001`, `WEB-002`, `WEB-003` as applicable to the minimal shell.

### 8.5 Risk

The original high environment risk is now reduced: the Steam executable, matching Web templates, Compatibility renderer, single-thread export, headless tests and browser persistence have been verified. Godot MCP is unavailable in the current tool surface, so project files and the command-line runner remain authoritative.

## 8A. M1W — 制作人地图网页 Demo

> 当前状态：地图接入与英/简中单一多语言实现已完成，52 个历史地标的双语短介绍、长介绍与逐项英文 Wikipedia 链接已接入。自动门禁、语言切换、状态保持、语言记忆、统一存档往返和旧中文链接跳转均已通过；尚未获准进入 Godot M1A。详细证据见 `M1W_WEB_TEST_REPORT.md` 与 `M1W_PLAYER_COPY_FORMALIZATION_TEST_REPORT.md`。

### 目标

使用 `Metropolis Handoff Exporter` 按老板 Figma 实际矢量画布生成的一键交付 ZIP，升级现有 `m0_web`，让制作人能够在浏览器中看到正式 Brand 和地图，并操作拖拽、固定倍率缩放、分区悬停、点击保持与分区详情。

### 工作范围

- 校验 `.fig` 本地副本与插件 ZIP 记录的实际画布宽高、图层树、图片、SVG `viewBox` 和位置关系；不以固定像素尺寸判退；
- 从 ZIP 中提取网页专用衍生素材，不覆盖老板源文件；
- 保留现有 M0 网页的状态栏、综合操作栏、金融/地产玩法说明和右侧详情结构；
- 用正式地图替换占位曼哈顿轮廓；
- 接入独立 Brand；
- 实现禁止旋转的地图拖拽、固定倍率缩放、边界限制；
- 实现现有分区的悬停边框、点击保持和英/简中详情样板；
- 将中英文审阅版合并为单一 `index.html`、单一玩法脚本和两份语言词典；在设置中即时切换语言并保留对局、地图与界面状态；
- 从单一历史地标文案源接入 52 组中英文名称、单句短介绍、长介绍和英文 Wikipedia 链接；玩家界面不得暴露制作、审批或内部工程身份；
- 使用新的统一存档键，并把旧英文与旧中文存档作为只读迁移来源，避免自动覆盖；
- 对老板批准保留原样的 `district_chelsea` 矢量网络执行专项命中测试；若悬停、点击或选中保持范围错误，停止接入并报告，不擅自修改边界；
- 在 Chrome 中完成可视、交互、分辨率和性能检查。

### 不在本阶段

- 不启动 Godot 地图实现；
- 不擅自创建任何老板未在 Figma 中绘制的正式地块；
- 不实现正式建筑插画、完整 AI 地图决策或最终经济平衡；
- 不改变老板提交的分区边界。

### 门禁

- `DOC-007B` 通过；
- 老板审查网页中的地图对齐、Brand、缩放和分区交互；
- 浏览器测试通过并创建独立 Git 提交；
- 提交后停止，重新请求是否进入 Godot M1A。

## 9. M1A — Map Composition Prototype

> 顺序调整：老板已明确当前先完成 M1W 制作人地图网页，暂不进入 Godot。M1W 验收并提交后，M1A 才重新请求授权。

### 9.1 Objective

Validate and integrate the owner-authored Figma map package, then obtain owner approval for the exact district, plot and historical-landmark overlays. Codex does not create the base composition or any missing geography.

### 9.2 Work

- 2026-09-08：`v004` 快速交付包已经到达并通过结构验收，包含 30 个地块和 52 个历史地标；不再把“等待 ZIP”列为当前阻塞。
- Preserve the versioned `.fig` and owner notes unchanged; archive the 1.2GB exporter ZIP under ignored `assets/source_handoffs/`, never in the Web public directory or Git history.
- Verify filenames, dimensions, shared SVG viewBox/layer IDs, registration, checksums, closed shapes or recorded owner-approved vector-network exceptions, overlap/gap conditions and programmatic overlay alignment.
- Produce an intake report and return every ambiguity to the owner without editing source geography.
- Build `assets/runtime_map_v001/` reproducibly with the lightweight processor: preserve geometry, split landmark art/labels, normalize IDs, number plots geographically and freeze tier-constrained generated prices.
- After owner accepts the contact sheet and alignment review, convert the submitted SVG coordinates reproducibly to normalized gameplay JSON without smoothing, deleting or moving vertices.
- Render the owner base and derived boundaries in Godot and compare them with the owner source plus the programmatic overlay report at target screen ratios; use a full-mode alignment preview only when supplied.
- Demonstrate one district's hover border, locked selection and detail-page handoff.
- Demonstrate far/middle district summaries and always-visible landmark art, then `500%—1500%` plot/landmark selection and development-building visibility. Landmark map banners remain hidden by owner decision; names and copy live in the right-side Historical File.
- Record the owner revision, source checksums, deliberate geographic compression and date-sensitive landmarks.

### 9.3 Not Yet

- The 30-plot/52-landmark runtime package has passed automation but not the owner's visual approval gate.
- No Codex-authored or substitute base/district geometry.
- No bulk building or portrait production.
- No rule implementation attached to prototype plots.
- No finalized prosperity formula, weights, labels or bands.

### 9.4 Gate and Evidence

- `DOC-007A` passes before map code begins.
- `DOC-007C` automation passes, then the owner approves the contact sheet and offline alignment review before Web or Godot integration.
- Owner approves `VIS-001` Map Composition Gate for the submitted Figma package and its exact Godot overlay.
- Hudson/west, East River/east and Lower Manhattan/south remain correct.
- All twelve owner-approved district IDs are present exactly once and their relative geometry matches the Figma source.
- Strict palette and orientation review passes.
- Normalized registration matches the owner SVG/mask and survives a replacement runtime texture resolution without moving geometry.
- The historical reference and owner source package remain absent from runtime/export output; only approved production derivatives ship.
- Owner approves the sample district border/detail and far/middle-versus-near LOD intent.

### 9.5 Risk

High. Missing/misaligned owner assets or unauthorized Codex correction would corrupt every later polygon and anchor. Intake and owner overlay approval occur before map implementation; the verified M0G shell remains the runtime baseline while assets are pending.

## 10. M1B — Complete Map Data and Camera

### 10.1 Objective

Deliver the complete owner-approved set of data-driven plots and historical landmarks plus stable pan/zoom behavior up to `1000%`, with detailed interaction available from `500%`.

### 10.2 Work

- Define all plot IDs, polygons, ownership eligibility and adjacency against exactly the twelve approved owner districts; every plot belongs to exactly one stable district ID.
- Add `map_manifest.json` with normalized registration, declared layer assets and owner-approved LOD threshold data.
- Import the district polygons derived from the approved owner SVG; propose summary/building anchors separately for owner review.
- Define public plots and fixed transit topology.
- Generate render/collision polygons from the same data.
- Implement map bounds, drag threshold, primary/middle pan and fixed-factor zoom.
- Implement zoom percentage and no-rotation input map.
- Implement district hover/locked selection, district detail handoff and near-zoom plot/building input priority.
- Implement far/middle district-summary view models and near-threshold placeholder building visibility.
- Add geometry/content validators and headless tests.
- Add temporary state patterns sufficient to test selection and ownership.

### 10.3 Not Yet

- No property purchase or income.
- No final map decoration.
- No final visual state family.

### 10.4 Gate and Evidence

- `DOC-003`, `DOC-004`, `DOC-007` pass for current map content.
- `SCN-004`, `SCN-005A`, `SCN-006`, `SCN-007`, `SCN-008` and `AUT-040` pass at stage scope, except that prosperity uses an owner-approved formula fixture before production balancing.
- Every owner-authored plot validates with no self-intersection, missing reference, district crossing or unusable collision; imported count equals delivered count without a hard-coded target.
- Camera cannot rotate or lose the map.

### 10.5 Risk

High due to geometry volume. Failed shapes are corrected individually; plot count is not reduced to protect schedule.

## 10A. U1–U3 — 游戏内 UI 设计交接

### U1：全屏风格概念

- 以老板布局和 `IN_GAME_UI_LAYOUT_SPEC.md` 为权威，制作英文 `1920×1080` 全屏概念图。
- 使用 1920 年代纽约 Art Deco 高级酒店语言；只借鉴《Civilization VI》的信息层级、地图优先和环形控制原则，不复制其资产。
- 明确五模块、四页签、灯箱、永久小地图、右下回合区及三种选择详情。
- 不修改现有网页。老板批准概念图后单独测试文件完整性并提交 U1。

### U2：模块与弹窗样式板

- 分别展开顶部状态栏、左侧综合操作栏、中央地图控件、右侧详情/小地图、右下回合控制区。
- 覆盖 Config、普通确认、债务处置、拍卖、法令新闻、来源、帮助和结果弹窗。
- 明确英文/简体中文排版、行动点四状态、选中/悬停/禁用/危险状态和减少动态效果。
- 老板逐项批准后测试清单完整性并提交 U2。

### U3：组件与实现规格

- 输出组件尺寸、约束、九宫格/矢量/位图格式、字体、色板、间距、层级、状态、动效和响应式规则。
- 为 `1920×1080`、`1440×900`、`1366×768` 建立同一结构的布局合同。
- 建立素材来源与许可记录；不把老板整张 Figma 拼图作为运行时背景。
- 老板批准组件包后测试资产命名、尺寸、透明边缘与清单一致性，并提交 U3；之后另行申请 M2 实现许可。

## 11. M2 — Plot Interaction and UI Shell

### 11.1 Objective

Create the complete responsive interface structure and make every plot inspectable without yet implementing money-changing actions.

### 11.2 Work

- Implement the approved U3 five-module shell: top status, left Integrated Operations Panel, center map, right detail/mini-map and bottom-right turn controls.
- Build the Integrated Operations Panel tabs in exact order: `News`, `Bank`, `Auction House`, `Stock Market`; integrate advice/news and the five-state ice-cream mascot in News.
- Build Config with Game Brief, Language, Save Game, Load Game and Return to Title, and no Audio, Display or Controls entries.
- Synchronize the permanent mini-map viewport rectangle from the authoritative main-camera transform.
- Build modal and notification layers.
- Build assets, law information, How to Play and result-screen shells only where they can show real stage data.
- Implement plot hover, selection, focus and owner/state view models.
- Complete the district detail page and production presentation of the ordered district summary.
- Implement mouse flow, panel keyboard focus and blocking-modal input capture.
- Implement target-resolution layout behavior.
- Implement temporary English labels and error/reason presentation.

### 11.3 Not Yet

- Buttons for unavailable future systems remain absent rather than disabled.
- No final Art Deco skin.
- No real purchase, loan, auction or AI command.

### 11.4 Gate and Evidence

- `SCN-005`, `SCN-015`, `SCN-018`, `SCN-020`, `SCN-021` pass at current scope.
- Every owner-authored plot can be inspected and identified.
- Blocking modal prevents world input.
- Required information fits the three target resolutions.
- Owner approves `VIS-002` interaction-state sample before the state family expands.

### 11.5 Risk

Medium-high. The main danger is an interface that consumes map space or requires final art before information hierarchy is proven.

## 12. M3 — Property, Finance, Ledger and Save Foundation

### 12.1 Objective

Establish the authoritative state and transaction pipeline through real purchase and lending actions.

### 12.2 Work

- Implement `GameState`, command requests, validation, atomic drafts and ledger.
- Implement participant setup and symmetric AI starting value records.
- Implement direct plot purchase and ownership transfer.
- Implement base credit, phase limit inputs, separate six-turn loans and locked rates.
- Implement interest, early/partial repayment and maturity warnings.
- Implement debt disposition state and bank takeover.
- Establish versioned JSON manual/autosave codecs and duplicate guard.
- Connect bank/property panels through read-only view models.
- Implement brokered-sale submission, locked 90% value, pending state and next-turn settlement.
- Add confirmation for loans and high-risk disposal.

### 12.3 Deliberate Temporary Limitation

Emergency auction is completed in M6. Until then, debt fixtures use the bank-takeover path and the interface does not present an emergency-auction action as available.

### 12.4 Gate and Evidence

- `AUT-001`, `AUT-002`, `AUT-012` through `AUT-018`, `AUT-032` through `AUT-039` pass where their dependencies exist.
- Failed transactions change nothing.
- Rapid duplicate requests commit once.
- Save/load preserves the implemented authoritative state exactly.
- No UI callback directly writes cash, debt, ownership or action points.

### 12.5 Risk

High. This is the financial integrity foundation; later features cannot bypass it for speed.

## 13. M4 — Buildings, Settlement and Economy Loop

### 13.1 Objective

Deliver the repeatable buy → build/redevelop/sell → settle → revalue → continue-turn property loop.

### 13.2 Work

- Implement all four building types from content data.
- Implement construction delay and next-turn activation.
- Implement demolition and 10% refund.
- Implement strictly upward redevelopment with the approved 120% old-cost credit and zero payout floor.
- Apply the approved opening land-price bands and deterministic building-income baselines.
- Implement district, transit, bridgehead and factory adjacency effects.
- Implement income, maintenance, forced-cost shortfall and market revaluation.
- Implement action-point reset/consumption and end-turn confirmation.
- Implement Opening, Prosperity, Overheating and Adjustment phases.
- Implement a 20-turn state-machine path using currently available systems.
- Extend ledger, save and deterministic tests.

### 13.3 Not Yet

- No final AI decision system.
- No auction, zoning law or additional event content.
- Temporary programmatic building shapes remain acceptable.

### 13.4 Gate and Evidence

- `AUT-003` through `AUT-011`, including `AUT-005A` and `AUT-005B`, pass.
- Applicable turn, settlement, atomicity and replay tests pass.
- A headless fixture completes 20 turns without dead phase.
- Preview and committed settlement match.
- New-match reset clears all implemented runtime state.

### 13.5 Risk

High. Modifier order and construction timing must be frozen in one rules implementation before AI begins to use them.

## 14. M5 — Deterministic Rival AI

### 14.1 Objective

Make Tycoon, Landlady and Shark visibly different legal opponents under equal starting rules.

### 14.2 Work

- Implement shared AI candidate generation and legality.
- Implement personality weights and liquidity/debt constraints.
- Implement public-information-only zoning anticipation hooks.
- Implement deterministic action selection and explanation records.
- Implement public action summaries and broad financial condition.
- Implement development-only `F1` evidence overlay.
- Implement short skippable/accelerable AI presentation queue.
- Run a preliminary 90-match statistical suite for the available non-auction personality metrics.

### 14.3 Not Yet

- AI auction behavior is added to the same planner in M6.
- Final portraits are not required; text labels or simple black-frame placeholders are used.

### 14.4 Gate and Evidence

- `AUT-024` through `AUT-026` pass.
- `SCN-011` and development portion of `SCN-012` pass.
- All three rivals complete repeated 20-turn simulations without illegal actions.
- Available residential, factory and liquidity metrics are recorded across the same 30-seed set per personality.
- `AUT-027` remains explicitly pending rather than partially passed because its auction-withdrawal metric cannot run before M6.

### 14.5 Risk

High. A persona that differs only by label is a serious design failure even when it wins or loses normally.

## 14A. M5F — Securities Market, News/Advice and Provenance

### 14A.1 Objective

Add a compact historical finance layer that gives liquid-cash decisions without replacing the property loop.

### 14A.2 Work

- Implement Municipal & Railroad Bonds, Industrial Shares and Metropolitan Investment Trust from validated content.
- Implement `$1,000` minimum orders, `1%` fee, one existing action point per buy/sell and deterministic once-per-turn prices.
- Include holdings in save, ledger, AI planning and results while assigning them zero property-credit collateral value.
- Implement the `News` feed with investment advice, historical, fictional, government-source and activity provenance.
- Require verified source date/citation for any real-newspaper item; use `Sources familiar with the New York State Government` for law rumors.
- Extend AI, simulation and balance evidence so securities do not dominate well-selected operating property.

### 14A.3 Not Yet

- No individual real-company simulation, commodity futures, options, short selling, broker margin or live prices.
- The News ice-cream mascot uses its five deterministic state images and fallback text; no live-network conversation.

### 14A.4 Gate and Evidence

- `AUT-020A` through `AUT-020C` and `AUT-031A` pass.
- Save/load, atomicity, duplicate submission, net worth and AI legality regressions pass with securities holdings.
- Strategy simulations report property, cash and securities allocation by rival and phase and reveal no deterministic risk-free borrowing loop.
- The four-tab Integrated Operations Panel and five-module screen remain usable at every target resolution.

### 14A.5 Risk

High. Securities can become a parallel main game, invite leveraged arbitrage or create false historical attribution. Action-point cost, fees, collateral exclusion, bounded content and provenance tests are mandatory controls.

## 15. M6 — Government and Emergency Auctions

### 15.1 Pre-Implementation Owner Gate

Before auction content is committed, present the owner with:

- two English government-auction story proposals;
- proposed trigger turns and plot pools;
- bidder roster and narrative treatment for emergency auctions;
- any historical claim used in the story.

Content implementation waits for explicit approval.

### 15.2 Objective

Deliver deterministic, finite English ascending auctions for both scheduled government sales and debt disposition.

### 15.3 Work

- Implement government auction scheduling and approved stories.
- Implement price, increment, bid, withdrawal and maximum rounds.
- Implement AI auction valuation and personality behavior.
- Implement 1-action-point winning acquisition.
- Implement emergency auction at 50% invested cost basis.
- Complete debt disposition with repeated takeover/auction actions.
- Implement binding-bid confirmation and gavel presentation hook.
- Extend save, ledger, replay and rapid-input guards.

### 15.4 Gate and Evidence

- `AUT-019` through `AUT-023` pass.
- Auction portions of `AUT-024` pass and the complete `AUT-027` 90-match statistical acceptance passes.
- `SCN-010`, auction portion of `SCN-016` and `WEB-005` pass at stage scope.
- No sale, withdrawal, rival win, human win and insufficient funding all restore the correct phase.
- No seed produces an infinite auction.

### 15.5 Risk

High. Funding, action-point consumption and modal cleanup cross multiple systems; every end state requires evidence.

## 16. M7 — Zoning Law, Events and Complete Graybox Rules

### 16.1 Pre-Implementation Owner Gate

Before additional event content is committed, present four English proposals:

- two global economy events;
- two district events;
- trigger/eligibility, duration and numeric effect;
- story context and any historical claim.

Implementation waits for explicit approval.

### 16.2 Objective

Complete every core vertical-slice gameplay system before production art begins.

### 16.3 Work

- Implement zoning warnings on turns 10 and 12.
- Implement enactment on turn 14, transition on 15–16 and penalties from 17.
- Implement construction restriction, existing noncompliance and 30% income penalty.
- Implement law timeline, plot/property communication and ledger entries.
- Implement the four approved economy events.
- Complete result calculation and temporary result presentation needed for full runs.
- Run all domain simulations across AI, auctions, loans, law and events.

### 16.4 Gate and Evidence

- `AUT-028` through `AUT-031` pass.
- `SCN-013` passes with temporary but clear visual patterns.
- `AUT-035`, `AUT-036`, `AUT-041` through `AUT-043` pass.
- A complete 20-turn match can reach every approved result without final art.
- No core rule remains represented only by a mock button or scripted video.

### 16.5 Risk

High. Law/event transitions touch valuation, legality, income, AI and save state simultaneously.

## 17. G1 — Investor Graybox Web Demo

### 17.1 Purpose

Package the real M7 gameplay as a presentation-ready pre-alpha prototype before final art and audio. This is a separate owner-requested deliverable, not the final vertical slice.

### 17.2 Visual Rule

The prototype may deliberately use:

- white or light-paper backgrounds;
- black or dark-ink outlines;
- plain text labels and rectangular panels;
- simple geometric building shapes;
- simple pattern/icon ownership states;
- no generated character portrait.

This temporary exception exists only for the investor prototype. It does not alter the approved final palette/art direction and cannot pass M8 or final visual gates.

### 17.3 Required Gameplay

The investor build must use the real implementation for:

- the complete owner-approved plot set and camera;
- 1v1 rival selection;
- purchase, construction, demolition and settlement;
- redevelopment, normal brokered sale and the approved three-instrument stock market;
- loans, repayment and debt consequences;
- economy phases;
- AI actions;
- government/emergency auctions;
- zoning warnings and penalties;
- 20-turn result and save/load.

No investor-only fake outcome, hidden rule shortcut or pre-recorded interaction is allowed.

### 17.4 Deliverables

- `build/investor_graybox/` browser build;
- a visible `Pre-Alpha Gameplay Prototype` label;
- `docs/INVESTOR_DEMO_GUIDE.md` with a concise 3–5 minute walkthrough;
- a clearly separated list of implemented, temporary and forthcoming presentation work;
- one approved stage Git commit.

The guide must describe what the prototype proves and must not present temporary visuals as final quality.

### 17.5 Gate and Evidence

- Full representative Chrome playthrough of the investor route.
- Safari smoke test has no blocker/serious defect.
- Browser save survives reload.
- No blocker/serious gameplay defect remains.
- Every retained medium defect is reported to and accepted by the owner before investor use.
- Owner approves the build and walkthrough before it is shown externally.

### 17.6 Risk

Medium-high. The main risk is expectation management: the build must look intentionally provisional while still being stable enough to demonstrate actual strategy.

## 18. M8A — Production Art Samples

### 18.1 Objective

Approve the production asset language before bulk generation or illustration.

### 18.2 Work

- Integrate the owner-approved Brand as a separate asset using the exact title `Metropolis: Roaring Times` and retained public credit `designed and drawn by GatChive`; do not bake it into the map base.
- Produce one top-down sample for each building category.
- Produce one neutral rival portrait and two emotion samples in the approved original rubber-hose direction.
- Produce one event-card illustration.
- Produce one Art Deco panel/button family.
- Integrate samples into actual map/UI scale.
- Record source, tool/prompt, dimensions, license/provenance and import settings.
- Review period correctness and strict palette conversion.

### 18.3 Gate and Evidence

- Owner approves `VIS-003` and the sample portion of `VIS-004`.
- Samples remain legible at final on-screen size.
- No sample copies a recognizable protected character or embeds generated text.
- Asset-manifest records are complete.

### 18.4 Risk

High. Style drift, inconsistent identity, perspective error and post-period detail must be caught before batch work.

## 19. M8B — Full Art and Audio Integration

### 19.1 Objective

Replace investor-graybox presentation with the complete approved visual and audio package.

### 19.2 Work

- Complete 12 top-down building assets.
- Complete 15 consistent rival emotion portraits.
- Complete original map ornament, road, transit, landmark and state art.
- Complete Art Deco UI, tutorial and result presentation.
- Complete required event/news presentation art within approved content.
- Add one loopable music track and five required sound effects.
- Add independent music/SFX volume, mute and reduced-motion behavior.
- Remove or replace every temporary asset presented as gameplay art.
- Complete asset manifest and license/provenance review.
- Profile texture memory and browser presentation.

### 19.3 Gate and Evidence

- `VIS-004` final portrait set, `VIS-005` and `VIS-006` pass.
- `AUD-001` through `AUD-003` pass.
- `SCN-019` through `SCN-022` pass with final presentation.
- No placeholder block or default Godot control remains as final art.
- Owner completes final integrated visual approval.

### 19.4 Risk

Extra high due to asset count and iterative owner review. Samples are never bulk-expanded before M8A approval.

## 20. M9 — Final Save, Results, QA and Web Release

### 20.1 Objective

Produce the final browser-deliverable vertical slice and complete evidence package.

### 20.2 Work

- Finalize manual/autosave, migrations and browser persistence.
- Finalize every terminal result and ledger-derived summary.
- Complete final Chrome and Safari matrices.
- Run the full automated suite, including at least 90 AI statistical simulations.
- Run reference performance, memory, rapid-input and offline tests.
- Remove development-only debug paths from release export.
- Audit English content, deferred controls, credentials and asset provenance.
- Produce `build/web/` release output and final reports.
- Update architecture, implemented-rules, decisions, test, Web export and known-limitations reports.

### 20.3 Gate and Evidence

- Every applicable acceptance ID in `06_ACCEPTANCE_TESTS.md` passes.
- Chrome full acceptance passes.
- Safari smoke contains no blocker/serious defect.
- `PERF-001` through `PERF-003` pass.
- Browser manual/autosave survives reload.
- Zero blocker and serious defects remain.
- Every retained medium defect is owner-approved.
- Final Web export, source, reports and assets are saved and committed.

### 20.4 Risk

Extra high because this is the only stage where all systems, final assets, persistence and browser constraints are exercised together. It is not treated as a late bug-catching substitute for earlier milestone testing.

## 21. Test Progression

Tests activate cumulatively:

```text
M0W      standalone Web prototype + short gameplay browser test
M0.1D    cross-document consistency + Markdown/static checks
M0.1W    historical standalone Web economic loop + then-approved five-tab UI browser tests
M0G      startup + headless runner + Web smoke
M1A      composition owner review
M1B      content/geometry + camera
U1       full-screen concept integrity + owner visual approval
U2       module/modal coverage + cross-sheet consistency
U3       component/state/asset manifest + responsive handoff checks
M2       interaction + UI/layout
M3       transactions + finance + save foundation
M4       buildings + settlement + economy + turn loop
M5       AI legality/personality/determinism
M5F      securities/news provenance + allocation/balance simulation
M6       auctions + complete debt disposition
M7       law/events + full rules simulation
G1       investor browser/playthrough gate
M8A      art sample owner gates
M8B      final visual/audio/accessibility gates
M9       complete regression + browser + performance + release
```

An earlier passing test is rerun whenever a later stage changes its inputs or boundary. For example, save and replay tests expand at every new serializable system.

## 22. Required Owner Gates

Development pauses for owner decisions at:

1. each stage start;
2. resuming M0G Godot work after M0W (satisfied by owner approval before M0G);
3. starting M0.1W implementation after the M0.1D document commit;
4. any missing-tool installation/download;
5. M1A map composition;
6. M2 interaction-state and Integrated Operations Panel sample;
7. M5F verified historical items and fictional newspaper mastheads;
8. M6 government/emergency auction stories;
9. M7 four additional event stories/effects;
10. G1 investor build and walkthrough;
11. M8A building/portrait/event/UI samples;
12. M8B final integrated art;
13. every medium defect proposed for release retention;
14. M9 final release acceptance.

An unanswered gate is pending, not implicit approval.

## 23. Living Risk Register

| Risk | Level | Control | Earliest proof point |
|---|---|---|---|
| M0W prototype is mistaken for final technology or balance | High | Visible provisional label, isolated dependency-free code and explicit guide | M0W |
| M0.1 prototype expansion is mistaken for Godot production progress | High | Separate M0.1W stage, provisional label and no code reuse claim | M0.1W |
| Godot/Web tools become unavailable or version-drifts | Low after M0G proof | Record exact Steam version/templates and rerun M0G smoke checks after any engine update | M0G and every update |
| Godot MCP unavailable | Low for current work | Files/CLI are the verified authoritative path; reassess only if MCP is later introduced | M0G |
| Map crop/aspect or registration changes after geometry begins | High | Normalized coordinates, registration landmarks and M1A approval before M1B | M1A |
| Codex starts map work before receiving complete owner Figma assets | High | Hard M1A intake gate; missing package stops implementation and permits no placeholder geography | Before M1A |
| Derived runtime districts differ from owner SVG | High | Reproducible conversion, checksum/provenance record and owner overlay approval | M1A |
| 64 polygons produce input defects | High | Shared render/collision data and validators | M1B |
| Near-zoom plot/building targets conflict with district selection | High | Explicit input priority plus district hover/selection scene tests | M1A–M1B |
| LOD switch hides required information or overloads the map | High | One data-driven threshold, far/middle summary contract and owner visual gate | M1A–M1B |
| UI hides map or critical finance state | High | Resolution and interaction gates before rules expansion | M2 |
| Financial duplication/corruption | High | Atomic transactions, ledger, duplicate guard, save tests | M3 |
| Economy formulas are hard to balance | High | One rule engine and deterministic simulation | M4 |
| 120% redevelopment credit creates downgrade/cash-generation exploit | High | Strictly higher original-cost targets, zero payout floor and atomic tests | M4 |
| AI personalities become cosmetic | High | 90-match relative behavior thresholds and debug evidence | M5 |
| Auction creates a deadlock | High | Maximum rounds and every exit-state test | M6 |
| Story/history content misleads | Medium-high | Owner approval and source review before implementation | M6–M7 |
| Real newspaper attribution becomes misinformation | High | Source type/date/citation schema, no invented quotations and provenance acceptance | M5F |
| Securities dominate property or reward cheap leverage | High | Existing AP cost, 1% fee, no margin, zero collateral and allocation simulation | M5F |
| Investor mistakes prototype for final art | Medium-high | Visible pre-alpha label and guide | G1 |
| Generated art drifts or copies known work | High | M8A samples, original prompts, owner review, provenance | M8A |
| Asset volume harms Web memory | High | On-screen sizing, import review and profiling | M8B |
| Browser storage loses progress | High | Prototype proof in M0W, production proof in M0G/M3 and full Chrome/Safari tests in M9 | M0W–M9 |
| AI acceptance thresholds prove misleading | Medium | Report simulation evidence; owner-approved spec change only | M5 |
| Automatic local Git identity is unsuitable publicly | Low now | Keep history stable; set owner-approved identity before public release | Before public release |

Risk changes are reported immediately. A higher risk does not silently reduce scope or acceptance standards.

## 24. Deferred Work Protection

The milestones do not include:

- the full 312-turn Classic implementation;
- playable Extreme or Roaring modes;
- seven later laws;
- full listed property exchange beyond brokered sale or sealed owner sales;
- hostile acquisition or poison pill;
- private AI negotiation;
- player-built transit, ticket revenue or toll ownership;
- multiplayer, accounts, cloud saves or leaderboards;
- controller, touch, mobile or console support;
- dynamic day/night, pedestrians, vehicles, cinematics or voice acting;
- individual-company shares, commodity futures, options, short selling and broker margin;
- live-network mascot conversation or real-time market data.

Future-facing IDs and clean boundaries may exist, but no working-time estimate, visible control or implementation is created for these systems without an approved scope change.

## 25. Recovery Procedure

After reconnecting:

```text
Read the current project, AGENTS.md, 00_PROJECT_CONTEXT.md, Git status and latest commit.
Summarize completed work and continue from the first unfinished approved task.
Do not rebuild the project from scratch and do not overwrite existing files.
```

The recovery report must identify:

- current branch;
- clean or modified worktree;
- last completed stage and commit;
- last recorded test evidence;
- current blocking risk or owner gate;
- exact next approved action.

Chat memory, editor tabs and MCP state are never substitutes for the repository.

## 26. Approved Decisions and M0W Override

The owner approved:

1. the M0–M9 implementation sequence with the refinements in this document;
2. separate M1A composition and M1B complete-map stages/commits;
3. separate M8A art-sample and M8B full-integration stages/commits;
4. prior approval for any missing-tool download or installation;
5. clearly marked temporary visuals during functional development;
6. owner approval of auction and event stories before implementation;
7. relative effort/risk planning before M0 rather than an unsupported calendar promise;
8. a separate G1 investor Web prototype using basic white/light backgrounds, black/dark frames and real M7 gameplay before production art;
9. the player-facing title `Metropolis: Roaring Times`;
10. the five-module game screen in `IN_GAME_UI_LAYOUT_SPEC.md`, including `News`, `Bank`, `Auction House`, `Stock Market`, permanent mini-map and bottom-right turn controls;
11. strictly upward redevelopment at `max(0, new_cost - 120% × old_original_cost)` with no negative payout;
12. a 90%-of-market brokered sale that consumes one action point and settles next turn;
13. three securities instruments whose buy/sell orders consume one of the existing three action points; no separate financial-order resource;
14. verified-real, fictional, government-source and activity news provenance rules.

The owner did not make a Git-identity decision during D7. The safe operational default is to leave existing commit identity/history unchanged and ask again before any public release; this default is not recorded as owner approval.

Changing these decisions requires an owner-approved documentation update before execution.

After D7, the owner explicitly postponed Godot M0 and directed the project to build the standalone M0W Web Graybox first. After completing M0.1W, the owner approved M0G. That approval applies only to M0G; M1A still requires a new owner gate.

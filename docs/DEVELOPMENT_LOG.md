# Metropolis: Roaring Times — Development Log

## TOOL-FIGMA-03 — Figma 主线程 UTF-8 兼容修复

### 问题与决定

- 真实 Figma 桌面版在开始导出结构 JSON 时报告 `'TextEncoder' is not defined`；
- 原因是插件主线程不是普通浏览器页面，不能假定存在浏览器全局 `TextEncoder`；这与老板的地图图层或素材内容无关；
- 改为插件内置 UTF-8 编码器，避免依赖该浏览器全局对象，继续支持中英文和 emoji 文本。

### 风险与验证

- 插件界面中的 ZIP 生成仍运行在浏览器式 UI 沙箱，保留其原生 `TextEncoder`；本次只替换 Figma 主线程中的不兼容调用；
- 自动测试已在明确没有 `TextEncoder` 的主线程模拟环境中通过，并逐字节对照标准 UTF-8 编码；JavaScript 语法、ZIP 生成、系统解压和无网络权限检查也均通过；
- 真实文件当前被识别为 `10334 × 14101`、6 个顶层图层，而非规范中的 `4474 × 5904`、7 层；这不会再阻止导出，但 ZIP 会保留尺寸警告，且缺少的 `00_BRAND` 只能使用老板已单独提供的 Brand 文件处理；
- M0G 回归测试通过，Godot `4.7.1.stable.steam.a13da4feb` 输出 `M0G_TESTS_PASS count=4`；测试环境仍有既有 macOS 系统 CA 读取警告，但不影响项目测试；
- 本阶段仍需老板重新运行插件完成一次真实 ZIP 导出，才能结束现场验收。

## TOOL-FIGMA-02 — 并列 Group 自动识别修复

### 问题与决定

- 老板的七个地图顶层图层是同级 Group，而非被一个外层 Frame 包裹；旧版插件因此无法把已选中的 `06_FRAME` 识别为地图入口；
- 保留老板现有 Figma 图层结构，不要求重新分组或改稿；
- 插件改为接受七个规定顶层图层中的任意一层，并根据同级图层自动建立只用于导出的虚拟主画框。

### 本阶段实现

- 同时支持正式 `MAP_MASTER_4474x5904` Frame 与并列顶层 Group 两种结构；
- 虚拟主画框优先使用 `01_WATER` 或 `06_FRAME` 的精确 `4474 × 5904` 边界，并保留各图层的绝对变换、顺序、样式和可见状态；
- 完整 SVG、地图底图、分区 SVG、对齐预览和逐层 SVG 均使用同一虚拟主画框坐标；
- 导出清单增加 `sourceKind`，明确记录本次使用真实 Frame 还是并列图层模式；
- 插件界面和项目交付规范同步更新，不再要求老板为了导出而重构 Figma 原稿。

### 风险与验证

- 虚拟主画框只在导出期间存在，完成单项导出后立即删除；
- 如所有候选图层都不是规定尺寸，插件仍允许导出但会在包内写入尺寸警告；
- 必须在 Figma 桌面版真实文件中再次确认界面显示“并列图层模式”，并完成一次 ZIP 下载，才算现场验收结束。
- JavaScript 语法、并列 Group/正式 Frame 识别、统一画布坐标变换、插件清单无网络权限和 ZIP 生成/系统解压测试均通过；
- M0G 回归测试通过，Godot `4.7.1.stable.steam.a13da4feb` 输出 `M0G_TESTS_PASS count=4`；测试环境仍出现既有 macOS 系统 CA 读取警告，但不影响项目测试。

## TOOL-FIGMA-01 — Figma 一键交付插件与 M1W 网页优先决策

### 老板决定

- 手工隐藏图层、分别导出多个格式过于复杂，需要项目专用 Figma 插件；
- 插件必须尽可能保存图层关系、位置关系、颜色、样式、矢量和原始图片；
- 当前最近目标恢复为制作人浏览器 Demo，先不用 Godot；
- M1W 网页验收前不得启动 Godot M1A。

### 本阶段实现

- 新增 `tools/figma_handoff_exporter/` 本地 Figma 开发插件；
- 一键 ZIP 包含完整图层树 JSON、生产地图 PNG、分区 SVG、对齐预览、独立 Brand、逐层全画框 SVG 和原始图片；
- 插件不联网，仅接受规定名称或 `4474 × 5904` 尺寸的主画框；
- 所有生产导出使用临时副本并在导出后删除，不改写老板原图层；
- 新增中文安装说明和本地 ZIP 结构测试；
- 项目计划新增 M1W，Godot M1A 顺延。

### 风险与限制

- Figma 插件 API 不提供版本历史、评论和所有内部协作元数据，因此仍须保留 `.fig` 本地副本；
- 本阶段只能完成本地静态和 ZIP 测试，必须由老板在 Figma 桌面版导入插件并完成一次真实文件导出验收；
- 超大地图的 PNG、逐层 SVG 和结构 JSON 可能使 ZIP 较大，导出时需等待进度完成。

### 本地验证

- `code.js` JavaScript 语法检查通过；
- Figma `manifest.json` 结构检查通过，网络白名单固定为 `none`；
- ZIP 存储算法测试通过，生成文件可由系统 `unzip` 完整校验和读取；
- 为避免旧版 macOS 解压工具错误显示中文文件名，包内中文说明使用英文文件名 `README_ZH_CN.txt`；
- Git 空白检查和 Markdown 相对链接检查通过；
- 未修改运行代码的 M0G 基线在 Godot `4.7.1.stable.steam.a13da4feb` 下通过，输出 `M0G_TESTS_PASS count=4`；
- 受限测试环境仍产生已知的 macOS 系统 CA 读取警告，但没有项目测试因此失败。

## M1A-BRAND-D — Brand 标题、署名与独立导出决策

### 老板决定

- 正式 Brand 必须使用完整标题 `Metropolis: Roaring Times`，保留冒号；
- 公开保留署名 `designed and drawn by GatChive`；
- Brand 从地图底图拆出，作为独立素材导出和运行时放置；
- Figma 地图顶层遮挡顺序以老板批准的 `06_FRAME`、`05_NON_BUILDING_ORNAMENT`、`04_ROADS`、`03_DISTRICT_GEOMETRY`、`02_COASTLINE`、`01_WATER`、`00_BRAND` 为准。

### 已收素材的只读检查

- `00_BRAND.svg` 是合法 SVG，画框 `2450 × 2538`，透明背景正常，文字已转矢量路径；
- 文件包含一张 `2280 × 930` 的内嵌 PNG、11 个蒙版和 3 个滤镜，正式 Godot Web 接入前仍需进行 SVG/透明 PNG 视觉对照；
- 当前导出标题缺少冒号，底部约有 `88 px` 透明余量，因此仍等待老板从 Figma 重新导出修正版；
- 本次文档决策阶段不修改、移动或提交老板的 `.fig` 和 SVG 源素材。

### 验证结果

- Git 空白检查与 Markdown 相对链接检查通过；
- 标题、署名、独立 Brand 和老板批准的七层遮挡顺序已同步到总纲、产品、美术、验收、计划与素材流程；
- 未修改代码的 M0G 基线在 Godot `4.7.1.stable.steam.a13da4feb` 下通过，输出 `M0G_TESTS_PASS count=4`；
- 受限测试环境仍产生已知的 macOS 系统 CA 读取警告，但没有项目测试因此失败。

## DOC-L0 — 老板审查文档语言纠偏

### 问题

- 项目把“面向英语玩家”错误扩大成了“开发文档使用英文”；
- 老板当前需要审查的地图交付规范使用英文，导致审查成本和误解风险上升；
- `01_PRODUCT_BRIEF.md` 至 `07_IMPLEMENTATION_PLAN.md` 等历史权威规格也仍以英文为主。

### 本阶段纠正

- 将 `MAP_ASSET_PIPELINE.md` 完整改为中文，同时原样保留尺寸、颜色、文件名、Figma 页面/图层名、公式和稳定分区 ID；
- 明确 `OWNER_PROJECT_REVIEW.md` 是中文老板审查入口，并清理非必要英文管理用语；
- 在总纲和 `AGENTS.md` 中冻结语言边界：玩家内容英文，老板审查与团队实施文档中文，稳定技术标识保留英文；
- 新增 `DOCUMENT_LANGUAGE_MIGRATION.md`，把其余英文规格分成四个受控翻译批次；
- 本阶段不改变玩法、数值、代码和 M1A 地图门禁。

### 当前门禁

完成静态检查、Godot 基线测试和独立 Git 提交后停止。老板决定后续优先完成全部文档中文化，还是将翻译批次与后续里程碑交替安排；未获批准前不开始 M1A。

### 验证结果

- `git diff --check` 通过；
- Markdown 相对链接检查通过；
- 地图规范翻译前后的反引号技术标识完整性检查通过；
- `4474 × 5904`、宽高比、SVG 画框、文件名、坐标公式和七种技术色的定向常量检查通过；
- 三份当前老板审查/语言治理文档均以中文字符为主；
- 未发现旧的“项目文档可以使用中文”宽松规则残留；
- 未修改代码的 M0G 基线在 Godot `4.7.1.stable.steam.a13da4feb` 下通过，输出 `M0G_TESTS_PASS count=4`；
- 受限测试环境仍产生已知的 macOS 系统 CA 读取警告，但没有项目测试因此失败。

## M1A-F — Owner-Authored Figma Handoff Correction

### Management Failure Report

- Codex incorrectly treated the absence of owner district assets as permission to draw provisional district polygons and present them as an M1A visual candidate;
- the owner rejected that interpretation and confirmed that both the production base and district geometry will be submitted from the owner's Figma work;
- the incorrect M1A implementation, preview scene, test data and screenshots were never committed and were removed completely;
- the verified M0G runtime remains the implementation baseline.

### Corrected Authority

- the owner authors and approves one `4474 × 5904` Figma master containing the production base and district vectors;
- the required delivery contains `.fig`, base PNG, authoritative district SVG, district-mask PNG, alignment preview and owner notes;
- Codex may preserve, validate, convert and integrate the package but may not invent, redraw, smooth, simplify or silently repair district geometry;
- missing or invalid assets stop M1A and are reported to the owner;
- the owner-facing management sequence and decision gates are recorded in `OWNER_PROJECT_REVIEW.md`.

### Current Gate

This is a documentation and process-correction stage. After its tests and Git commit, work pauses for owner review. Actual M1A remains blocked on both owner approval of this process and receipt of the minimum Figma delivery package.

### Verification

- `git diff --check` passes;
- Markdown relative-link validation passes;
- acceptance-test heading IDs contain no duplicates;
- targeted authority/count scans confirm the active documents consistently define owner-authored Figma geometry, five gameplay groupings and six separate district vectors;
- the rejected provisional M1A data, scene, scripts, notes and tests are absent;
- the unchanged M0G headless suite passes with `M0G_TESTS_PASS count=4` under Godot `4.7.1.stable.steam.a13da4feb`;
- Godot emits the known non-blocking macOS system-CA access warning in the restricted test environment; no project test fails because of it.

## M1A-D — Map Foundation and LOD Specification Correction (Superseded in Part)

> Historical note: the interaction/LOD decisions remain active, but any wording that allowed Codex to establish map composition or district geometry is superseded by M1A-F and `MAP_ASSET_PIPELINE.md`.

### Owner Decision and Corrective Action

- the owner rejected the unapproved freehand/programmatic Manhattan composition and required development to proceed from the supplied 1939 reference as an art and spatial guide;
- the rejected M1A implementation was never committed and has been removed in full, restoring the verified M0G runtime shell;
- the historical image is reference material only; under the superseding M1A-F decision, the owner reconstructs the production map in named Figma layers and Codex has no authority to substitute generated art or geometry;
- district/plot geometry, interaction borders, building anchors and gameplay overlays remain independent structured data in normalized map coordinates;
- the Godot editor's standard 4.7 project metadata update is preserved as an editor-generated compatibility change;
- newly supplied reference files remain untouched and untracked until provenance and asset intake are reviewed.

### Specification Decisions Incorporated

- map texture resolution is independent from map-space geometry, but every revision must preserve an approved crop, aspect ratio and registration landmarks;
- districts use closed vector polygons, not raster border colors, for hit testing and selection;
- hover shows an indicative `border_peach`/`ink_primary` border; click locks the border and opens the district detail page until another selection or explicit close;
- near-zoom plot/building targets take priority over their underlying district;
- far and middle zoom hide all individual public/private building illustrations and display the exact ordered district summary;
- all public and private building illustrations appear at the same owner-approved near-zoom threshold;
- district prosperity combines human and active-AI development, ranges from `50.0` to strictly below `100.0`, and displays one decimal place;
- the prosperity formula, weights, English labels/bands and precise LOD threshold remain future owner approval gates.

### Verification and Next Gate

- all active product, rules, scope, art, architecture, acceptance and implementation-plan documents are synchronized through this correction;
- the new asset handoff contract is recorded in `MAP_ASSET_PIPELINE.md`;
- Markdown relative-link validation, duplicate acceptance-ID detection, Git whitespace checks and targeted legacy-wording scans pass;
- the unchanged M0G headless suite passes with `M0G_TESTS_PASS count=4` under Godot `4.7.1.stable.steam.a13da4feb`;
- the unchanged M0G native scene starts with `M0G_RUNTIME_READY` and a successful `user://` persistence increment when run with normal local permissions;
- the next implementation gate is governed by M1A-F: first receive and validate the owner-authored Figma package, then integrate an exact district overlay. Codex may not create substitute geography.

## M0G — Godot Environment and Minimum Runtime

### Owner Decisions and Collaboration Boundary

- the owner approved resuming Godot work after the M0.1W Web prototype;
- the owner chose the Steam installation of Godot rather than a Codex-managed download;
- Codex remains project manager, integration owner and sole writer to the main worktree;
- DeepSeek receives a separate detached worktree and may edit only an explicitly assigned domain task packet;
- `DEEPSEEK_OFFICE.md`, `docs/COLLABORATION_PROTOCOL.md` and the corresponding `AGENTS.md` rules were committed as `0885c3f`;
- no DeepSeek task is active during M0G.

### Delivered Scope

- verified the Steam Godot executable as `4.7.1.stable.steam.a13da4feb`;
- verified matching Steam-bundled Web templates, including single-thread release/debug templates;
- confirmed that no Godot MCP capability is exposed in the current Codex tool surface and retained files plus CLI as the authoritative path;
- set the project display name and main scene to `Metropolis: Roaring Times`;
- retained the Compatibility renderer and added a single-thread Web export preset;
- added a minimal English runtime shell that visibly distinguishes native/Web startup and increments a `user://` persistence probe;
- added the first headless test runner with four configuration/resource assertions and an isolated intentional-failure mode;
- excluded generated Web output, reference material, prototype files and tests from the release package where applicable;
- recorded environment findings in `MCP_CAPABILITIES.md`.

### Verification Performed

- passing headless run printed `M0G_TESTS_PASS count=4` and exited `0`;
- isolated intentional failure printed `M0G_TESTS_FAIL count=1` and exited `1`;
- native headless startup printed `M0G_RUNTIME_READY` and persisted visit counts `1`, then `2`;
- release Web export generated HTML, JavaScript, WASM and PCK files with the Steam-bundled template;
- the HTTP-served build started in a real browser with Godot 4.7.1, Compatibility/WebGL 2 and a single-thread Emscripten configuration;
- browser console contained the expected runtime-ready record and no blocking error;
- browser persistence incremented from visit `1` to visit `2` after reload.

### Remaining Risks and Next Gate

- this is an environment shell only; it contains no production map, rules loop, final interface or art;
- the current browser proof covers the available in-app browser surface, not the full Chrome/Safari release matrix reserved for M9;
- future Steam engine updates may change the executable or templates and require the M0G smoke checks to be rerun;
- M1A map composition is not authorized until the owner reviews this completed stage and explicitly approves the next gate.

## M0.1W — Web Graybox Economic and Interface Revision

### Delivered Scope

- changed the playable title to `Metropolis: Roaring Times`;
- replaced the old Investor Brief and bottom command deck with the five-page Operations Desk and top status-bar `End Turn`;
- separated Game Brief, Investment Advice, Bank, Auction House and Stock Market into independently scrolling pages in the approved order;
- added the non-conversational placeholder for the future rubber-hose board mascot;
- applied the approved opening land bands and building gross-income/maintenance tuning;
- implemented strictly upward redevelopment using `max(0, new_cost - 120% × old_original_cost)` with one-turn activation;
- implemented one-action-point brokered sales that lock 90% of property market value and settle at the next turn boundary;
- implemented bonds, industrial shares and a fictional investment trust with deterministic prices, $1,000 order steps, 1% fees and one existing action point per buy/sell;
- included securities in both participants' net worth and result breakdown;
- added classified Historical, Fictional, Rumor and Activity records without inventing real newspaper attribution;
- retained zero-action-point borrowing/repayment, three total action points, zoning and the eight-turn result;
- added v2 local-save state and migration from the original M0 v1 save.

### Verification Performed

- JavaScript syntax, static page/script ID matching and Git whitespace checks;
- local HTTP load and full browser startup;
- exact tab order, top-bar `End Turn` and absence of a fixed bottom action bar;
- purchase, next-turn construction activation and approved operating income;
- Standard Apartment to Factory redevelopment for exactly `$5,400`, with no same/lower-cost option;
- securities buy and sell, 1% fee, action-point consumption and deterministic revaluation;
- bank borrowing and repayment without action-point consumption;
- brokered-sale lock, action-point consumption, next-turn settlement and sold-state transfer;
- Investment Advice classifications and exact approved New York State government-rumor source wording;
- turn-six Residential zoning rejection;
- save, intervening transaction and exact visible-state restoration;
- final-turn brokered-sale rejection and legal eight-turn result;
- visual review at a compact `1280×720` viewport with no document-level overflow.

### Remaining Prototype Risks

- This prototype deliberately uses the simplified M0 maturity-failure result; production bank takeover and emergency auction remain later Godot work.
- Auction stories and bidder behavior still require owner approval and are not represented as working content.
- The 18-plot/eight-turn deterministic tuning demonstrates decisions but does not validate the production 64-plot/20-turn balance.
- Final map interaction, final art, portraits, audio and production accessibility remain unstarted. The minimal Godot environment shell is now established by M0G.

### Next Gate

M0.1W was completed in commit `baef8ea`; the owner later approved and started M0G.

## M0.1D — Economic Loop and Interface Specification Sync

### Owner Decisions Incorporated

- player-facing title changed to `Metropolis: Roaring Times`;
- the left-side system container is named the Integrated Operations Panel and uses tabs in exact order: `Game Brief`, `Investment Advice`, `Bank`, `Auction House`, `Stock Market`;
- `Game Brief` is an independent page and reserves space for a future rubber-hose-style conversational board mascot;
- no fixed bottom action toolbar; `End Turn` moves to the top status bar;
- redevelopment uses `max(0, new_cost - 120% × old_original_cost)`, only for strictly higher original-cost targets and never pays a negative difference;
- ordinary brokered sale consumes one action point, locks 90% of current market value and settles next turn;
- the stock market contains bonds, shares and an investment trust, while futures and broker margin remain deferred;
- every securities buy/sell consumes one of the existing three action points; no separate financial-order resource is added;
- Investment Advice distinguishes verified historical reporting, fictional city news, New York State government rumors and ledger activity.

### Risk Control

The owner supplied the 120% redevelopment credit. Project management added the strictly-higher-cost target rule and zero-payout floor to prevent downgrade or repeat-conversion cash generation while preserving the approved formula. This safeguard was accepted for and implemented in M0.1W.

### Documentation Scope

The root authority, product brief, game rules, vertical-slice scope, art/UI direction, technical architecture, acceptance tests, implementation plan, development log, prototype README and reference-directory README were synchronized before code changes. The original PRD and map reference files remain unchanged.

### Next Gate

Completed in commit `0cd57f4`; the owner then approved M0.1W implementation.

## M0W — Standalone Web Graybox

### Decision

The owner postponed Godot M0 and requested an immediate plain Web gameplay prototype for investor explanation.

### Delivered Scope

- standalone dependency-free HTML/CSS/JavaScript page;
- visible `M0 WEB GRAYBOX — NOT FINAL ART OR BALANCE` status;
- 18 representative irregular plots and eight compressed turns;
- Tycoon, Landlady and Shark rival selection with equal displayed starting value;
- property inspection, purchase and four building choices;
- three action points, one-turn construction delay and operating settlement;
- explicit borrowing, repayment, locked prototype rate and maturity failure;
- four compressed economy phases;
- zoning warnings and a turn-six Residential construction restriction;
- deterministic rival purchase/build action;
- ledger, restart, local save/load and net-worth result;
- compact `1366×768` investor presentation layout.

### Verification Performed

- JavaScript syntax check;
- Markdown and Git whitespace checks;
- local HTTP load;
- all three rivals start with equal displayed net worth;
- purchase deducts cash and one action point once;
- construction deducts cost/action point and activates next turn;
- loan confirmation, deposit, credit reduction and repayment;
- rapid double-click purchase commits once;
- turn settlement and rival action;
- manual save, state change and exact visible restoration;
- full eight-turn result;
- zoning prevents new Factory construction on a Residential plot from turn six;
- `1366×768` visual inspection with map and command deck in the first viewport;
- browser console contains no warning/error after the tested paths.

### Known Prototype Limits

- This code is not reused by the production Godot project.
- Values and AI heuristics are demonstration tuning, not final balance.
- M0W has 18 plots/eight turns rather than the production 64 plots/20 turns.
- Auction is intentionally absent because story/bidder content requires owner approval.
- Debt maturity uses a simplified bankruptcy result and does not implement production asset disposition.
- Map pan/zoom, final art, portraits, audio, production save schema and final accessibility work are not included.
- Save data is local to the current browser/site storage.

### Superseded Next Gate

The original M0W review led to the M0.1D decisions above. M0.1W and M0G were subsequently approved and implemented in sequence.

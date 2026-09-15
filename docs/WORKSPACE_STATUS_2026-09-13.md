# 工作区清理记录 — 2026-09-13

## 本次目的

旧 Codex 任务因为上下文窗口耗尽无法继续压缩。本文件记录新任务接手时的工作区状态和老板已确认的处理原则，避免后续窗口把未跟踪素材误当成已提交事实。

## 已确认处理

- `m0_web/assets/cutouts/panel_center_large.png` 和 `m0_web/assets/home_png_complete/panel_center_large.png` 的删除可以保留。运行时代码、样式、测试和文档已经改用 `m0_web/assets/new ui/01_plain_panel_2x.png`；旧路径不再是网页依赖。
- `references/` 中未跟踪的大图、建筑图、字体和生成参考图按长期参考素材处理，不在本次整理中删除。
- 未跟踪 UI 素材的正式归属尚未确认；本次不提交、不移动、不删除。
- 当前主线优先进入 M1W 网页视觉验收，而不是继续 Godot、U1 实现或看板角色接入。

## 当前未跟踪素材分组

### 待归属 UI / U1 素材

- `docs/assets/in_game_ui_concept_u1_v001.png`
- `docs/assets/in_game_ui_concept_u1_v002.png`
- `assets/title-bar-marquee-complete-4000x2000*.png`
- `assets/titlebar_parts_bright_v1/`
- `assets/auction.png`
- `assets/bank.png`
- `assets/config.png`
- `assets/current*.png`
- `assets/debt.png`
- `assets/credit available.png`
- `assets/债券.png`

这些文件看起来属于最终游戏 UI、标题栏、状态栏或金融按钮方向，但老板尚未决定哪些进入正式项目资产。

### 待归属网页运行候选素材

- `m0_web/assets/home_png_complete/*icon*.png`
- `m0_web/assets/home_png_complete/*panel*.png`
- `m0_web/assets/home_png_complete/*.9slice.json`
- `m0_web/assets/home_png_complete/*qa-preview*.jpg`

这些文件可能属于 M1W 或 U 系列 UI 资产，但当前网页门禁不依赖其中大多数新增文件。本次不提交。

### 长期参考素材

- `references/*.png`
- `references/generated/*.png`
- `references/buildings/**/*.png`
- `references/InknutAntiqua-Regular.ttf`
- `references/skylines`

老板确认这些按长期参考素材保留。未来若要提交，应先单独确认仓库体积和版权/来源说明。

### 本机缓存

- `.DS_Store`
- `*.import`

这些已经被 `.gitignore` 忽略。本次不需要纳入版本控制。

## 后续规则

1. 未跟踪素材不得自动提交；必须先确认用途、来源、是否进入运行包。
2. 参考素材若要长期提交，必须单独做体积与来源审查。
3. M1W 视觉验收发现的问题优先记录为具体条目；涉及地图几何位置时回到 Figma 重导，不直接改权威路径。
4. 新阶段如果要接入 U1/UI 素材，先建立素材清单和命名规则，再修改网页或 Godot。

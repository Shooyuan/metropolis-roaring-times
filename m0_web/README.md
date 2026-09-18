# Metropolis: Roaring Times — M1W 制作人地图网页 Demo

这是一个无需安装依赖、通过本地 HTTP 服务运行的制作人演示网页。它不是最终 Godot 游戏、完整垂直切片、最终数值或完整历史内容。

## 当前状态

M1W 在原有 M0.1 网页的状态栏、综合操作栏和 30 回合经济演示基础上，接入项目负责人批准的 Figma 地图交付包 v004：

- 正式独立 Brand：`assets/00_BRAND.svg`；
- 正式地图底图：`assets/runtime_map_v001/base/metropolis_map_base.svg`；
- 12 个权威街区：`assets/runtime_map_v001/geometry/metropolis_district_geometry.svg`；
- 30 个项目负责人绘制并批准的可购买地块及其稳定 ID、价格层级和固定基础地价；
- 52 个项目负责人放置的历史地标插画；地图上不再渲染历史地标英文横幅，名称与正文只在右侧 Historical File 中显示；
- 地图拖拽、固定倍率缩放、边界限制和禁止旋转；
- SVG 按实际显示尺寸重新绘制，避免 Safari 把低分辨率合成层放大后出现模糊；
- 街区悬停边框、点击锁定、关闭选择和双语街区详情；
- 街区、地块、历史地标严格互斥选择，点击地图空白处清空右侧详情；
- `100%—1500%` 十五级固定缩放：街区始终可选择；地块精细交互和历史地标点击从 `500%` 起开放；
- 地块接入原 M0.1 的购买、建造、改建、经纪出售、银行、股票、AI 和回合流程；
- Chelsea 保留项目负责人批准的 Figma 矢量网络，并纳入真实浏览器命中专项测试。
- 英文与简体中文合并为同一个网页实现，在设置中即时切换且不重置对局状态；
- 首次访问默认英文，`?lang=zh-CN` 可直接打开中文，旧 `/zh-CN/` 地址会兼容跳转；
- 中英文使用统一存档键，并可只读迁移旧英文或旧中文存档。

旧 M0 的 18 个代表性地块已经退出运行时。现有经济演示直接使用 v004 的 30 个真实地块；对手开局地块只是 M1W 测试映射，不代表最终数值平衡。

## 当前可演示内容

> 历史原型说明：以下五页签与顶部结束回合布局描述的是当前已提交 M1W 网页事实。最终游戏内 UI 已由 `../docs/IN_GAME_UI_LAYOUT_SPEC.md` 改为五模块、左侧四页签和右下回合控制区；U1—U3 审批完成前不回写本网页。

- 打开网页后先进入 Art Deco 风格启动页：项目负责人指定的曼哈顿参考地图以 70% 不透明度在 60 秒内从底部向顶部循环浏览，四张票据独立定位，天际线等比铺满屏幕宽度；
- 启动页英文菜单、弹窗正文和多数英文 UI 正文使用 `assets/fonts/Adobe-SongTi-Std-L-2.otf`；部分标题保留 Inknut Antiqua；Load、Config、About 与对手选择共同使用项目负责人提供的 `assets/new ui/01_plain_panel_2x.png`，不由 CSS 重画；Load 存档项和 Config 语言项使用 `assets/home_png_complete/Vector.png`，语言通过左右三角切换而非系统下拉框；
- 可从启动页选择开始新游戏、读取存档、设置语言或查看 About；
- 选择 Tycoon、Landlady 或 Shark 作为 1v1 对手；
- 查看 Game Brief、Investment Advice、Bank、Auction House 和 Stock Market 五个页签；
- 在正式曼哈顿地图上查看并选择 12 个街区、30 个地块和 52 个历史地标；
- 通过按钮、滚轮或键盘按固定倍率缩放；
- 使用鼠标拖拽或方向键平移；
- 查看街区、地块与历史地标三类右侧详情；
- 在 `500%—1000%` 选择地块并演示购买、建造、改建和出售；
- 运行 30 回合经济、借款、证券和存档演示。

## 暂未包含

- 五套开发建筑插画及其在地块视觉中心的正式落点；
- 历史地标基于英文 Wikipedia 的正式短介绍、长介绍、逐项来源链接和双语译文；
- 分区经济画像、可购地数量、大型交通设施与繁荣度公式；
- 政府拍卖和紧急债务拍卖故事；
- 最终数值平衡、正式 AI、美术、音频和 Godot 架构。

## 本地运行与测试

在本目录启动本地服务器：

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:4173/`。首次默认英文；可在 Settings 中切换简体中文，或直接打开 `http://127.0.0.1:4173/?lang=zh-CN`。

macOS 上也可以直接双击项目根目录的 `run_metropolis_demo.command`。它会自动启动本地服务器并打开网页；游玩时保持弹出的终端窗口开启，结束后关闭窗口或按 `Ctrl+C` 即可停止服务器。

静态门禁测试：

```bash
node tests/m1w_static_test.js
node tests/m1w_i18n_static_test.js
node tests/map_content_contract_test.js
node tests/runtime_map_integration_test.js
```

`index.html` 是网页入口。不要用 `file://` 直接打开，因为分区 SVG 需要通过同源 HTTP 请求读取。

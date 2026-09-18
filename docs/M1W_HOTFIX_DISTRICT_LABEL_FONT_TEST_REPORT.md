# M1W 热修测试报告：街区英文地图标签字体与状态色

日期：2026-09-12

## 本阶段目标

1. 地图本体街区标签使用项目负责人指定字体 `Kings-Regular.ttf`。
2. 街区英文名按一个单词一行显示。
3. 标签尽量通过逐街区位置和字号配置放在各自街区边界内。
4. 标签默认颜色为 `#bdb199`。
5. 鼠标悬停、键盘聚焦或点击锁定街区时，标签颜色变为 `#4e403e`。

## 已修改内容

- `m0_web/styles.css`
  - 新增 `Kings M1W` 字体声明。
  - 街区标签改用 `Kings M1W`。
  - 街区标签默认色和激活色改为项目负责人指定值。
- `m0_web/app.js`
  - 地图本体街区标签固定使用英文地名，不随界面语言切换。
  - 多词街区改为一词一行。
  - 新增 12 个街区的独立标签排版表。
  - 街区 hover、focus 和 selected 状态同步更新对应标签颜色。
- `m0_web/tests/`
  - 增加字体、颜色、逐词换行和状态同步防回归检查。
- 项目文档
  - 同步项目总纲、地图美术规范、验收标准、素材清单、项目负责人审查计划和开发日志。

## 视觉验收重点

- 在英文和中文界面下，地图本体都应显示英文街区标签。
- 多词街区应一词一行，例如 `UPPER / EAST / SIDE`。
- 鼠标没有悬停也没有选中时，街区标签为浅灰褐色。
- 鼠标悬停或点击选中街区时，该街区标签变为深墨褐色。
- 标签不能明显跑出街区边界；如果某个街区因形状太窄仍不理想，应记录具体街区名并单独调整排版表。

## 风险

街区边界是不规则的，当前程序以每个街区的几何外接框为基础，再用逐街区参数微调。它能解决当前 M1W 的大多数可读性问题，但不是自动排版引擎。后续如果 Figma 街区形状变化，必须重新做一次视觉审查。

## 自动测试

已通过：

```text
node --check m0_web/app.js
node --check m0_web/locales/en-US.js
node --check m0_web/locales/zh-CN.js
node m0_web/tests/m1w_static_test.js
node m0_web/tests/m1w_i18n_static_test.js
node m0_web/tests/map_content_contract_test.js
node m0_web/tests/runtime_map_integration_test.js
git diff --check
```

关键输出：

```text
M1W_STATIC_TEST_PASS districts=12 map_sha=6c511527a6c2 brand_sha=4255ada51de6
M1W_I18N_STATIC_TEST_PASS locales=2 dynamic_keys=253 fonts=2
MAP_CONTENT_CONTRACT_TEST_PASS layers=8 zoom_steps=15 locales=2
RUNTIME_MAP_INTEGRATION_TEST_PASS plots=30 landmarks=52 zoom=1500 detail_from=500 labels_from=1250 selection=exclusive
```

## 浏览器复验

使用浏览器只读检查确认：

- 页面标题正常；
- 12 个街区标签均已生成；
- `UPPER / EAST / SIDE`、`WEST / VILLAGE` 等多词标签已按一词一行输出；
- 标签默认色为 `rgb(189, 177, 153)`，对应 `#bdb199`；
- 无控制台错误。

注意：本地浏览器如果已经缓存旧 `index.html`，普通 `http://127.0.0.1:4173/` 可能仍短暂读取旧的 `styles.css?v=m1w-home10`。本阶段已经把 `styles.css` 和 `localization.css` 都推进到 `?v=m1w-label1`；若项目负责人当前页面仍显示旧字体，需要执行一次硬刷新。

# 地图交付包轻量化工具

这个工具把老板从 Figma 插件导出的 ZIP 转成可提交、可测试、可供网页或 Godot 使用的轻量运行素材。它不会修改 Figma 源文件，也不会改变街区、地块或历史地标的位置。

## 做什么

- 保留正式底图、12 街区几何和全部可购买地块路径；
- 将地标 SVG 中重复内嵌的超大 PNG 拆出并压缩为透明 `WebP`；
- 将地标横幅保存成独立小型 SVG；
- 清理 `_transparent`、重复下划线和标点造成的不稳定 ID；
- 按“从北到南、同排从西到东”给地块自动编号；
- 把 Figma 的 `cheap`、`medium`、`expensive` 分组解释为价格层级，并生成固定、可复现的精确基础地价；
- 生成接触表、离线对齐页和中文验收单。

## 运行

```bash
python3 tools/map_handoff_processor/process_handoff.py \
  assets/source_handoffs/metropolis_map_v001/metropolis_handoff_1788840097378.zip \
  assets/runtime_map_v001
```

原始 ZIP 是不可替代的设计交付证据，只归档、不提交 Git。`assets/runtime_map_v001/` 是供项目使用和审查的派生结果，可以重复生成。

地价随机只发生在内容构建时。算法、种子、价格区间和最终结果都会写进 `plots.json`，因此测试、存档和演示不会因重新启动而变化。

处理完成后运行只读验收：

```bash
python3 tools/map_handoff_processor/validate_runtime_package.py assets/runtime_map_v001
```

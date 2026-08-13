"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const webRoot = path.resolve(__dirname, "..");
const zhRoot = path.join(webRoot, "zh-CN");
const html = fs.readFileSync(path.join(zhRoot, "index.html"), "utf8");
const script = fs.readFileSync(path.join(zhRoot, "app.js"), "utf8");
const styles = fs.readFileSync(path.join(zhRoot, "zh-CN.css"), "utf8");

const fontFiles = [
  "SourceHanSerifSC-M1W.woff2",
  "SourceHanSansSC-M1W.woff2",
];

assert(html.includes('<html lang="zh-CN">'), "Chinese build must declare simplified Chinese");
assert(html.includes("M1W 制作人地图演示（中文版）"), "Chinese build needs an explicit localized title");
assert(html.includes("综合操作栏"), "Chinese build must localize the five-module operations desk");
for (const label of ["游戏<br>简报", "投资<br>建议", "银行", "拍卖场", "股票<br>市场"]) {
  assert(html.includes(label), `Missing localized operations tab: ${label}`);
}
for (const label of ["玩法说明", "结束回合", "曼哈顿分区地图", "分区档案", "选择对手"]) {
  assert(html.includes(label), `Missing localized interface copy: ${label}`);
}

assert(html.includes('href="../styles.css?v=m1w2"'), "Chinese build must share the approved English layout stylesheet");
assert(html.includes('src="../assets/00_BRAND.svg"'), "Chinese build must share the approved Brand asset");
assert(html.includes('src="../assets/metropolis_map_base.svg"'), "Chinese build must share the approved vector map base");
assert(script.includes('window.fetch("../assets/metropolis_district_geometry.svg"'), "Chinese build must share approved district geometry");
assert(script.includes('const SAVE_KEY = "metropolis_roaring_times_m01_save_zh_cn_v1";'), "Chinese build must not collide with the English browser save");
assert(script.includes('label: ["切尔西"]'), "Chinese district labels must be localized");
assert(script.includes("贷款已经到账，未消耗行动点。"), "Dynamic bank feedback must be localized");
assert(script.includes("证券${side === \"buy\" ? \"买入\" : \"卖出\"}委托已完成。"), "Dynamic stock feedback must be localized");

assert(styles.includes('font-family: "Source Han Serif SC M1W"'), "Chinese title font must be Source Han Serif SC");
assert(styles.includes('font-family: "Source Han Sans SC M1W"'), "Chinese body font must be Source Han Sans SC");
for (const file of fontFiles) {
  const font = fs.readFileSync(path.join(zhRoot, "fonts", file));
  assert.equal(font.subarray(0, 4).toString("ascii"), "wOF2", `${file} must be a valid WOFF2 font`);
  assert(font.length > 100000, `${file} subset is unexpectedly small`);
}

console.log(`M1W_ZH_CN_STATIC_TEST_PASS fonts=${fontFiles.length} tabs=5`);

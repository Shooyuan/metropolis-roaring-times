"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const webRoot = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(webRoot, "index.html"), "utf8");
const app = fs.readFileSync(path.join(webRoot, "app.js"), "utf8");
const i18n = fs.readFileSync(path.join(webRoot, "i18n.js"), "utf8");
const localizationStyles = fs.readFileSync(path.join(webRoot, "localization.css"), "utf8");
const redirect = fs.readFileSync(path.join(webRoot, "zh-CN", "index.html"), "utf8");

const context = { window: { M1W_LOCALES: {} } };
vm.createContext(context);
for (const locale of ["en-US", "zh-CN"]) {
  vm.runInContext(fs.readFileSync(path.join(webRoot, "locales", `${locale}.js`), "utf8"), context, { filename: `${locale}.js` });
}
const en = context.window.M1W_LOCALES["en-US"];
const zh = context.window.M1W_LOCALES["zh-CN"];

assert(en && zh, "Both locale dictionaries must load");
const dynamicEnglishKeys = Object.keys(en).filter((key) => !key.startsWith("static.") && !key.startsWith("attribute."));
const missingChineseKeys = dynamicEnglishKeys.filter((key) => !(key in zh));
assert.deepEqual(missingChineseKeys, [], `Chinese dictionary is missing dynamic keys: ${missingChineseKeys.join(", ")}`);

for (const fragment of [
  'id="language-select"',
  '<option value="en-US">English</option>',
  '<option value="zh-CN">简体中文</option>',
  'src="locales/en-US.js',
  'src="locales/zh-CN.js',
  'src="i18n.js',
  'src="app.js',
]) assert(html.includes(fragment), `Unified page is missing: ${fragment}`);

assert.equal((html.match(/src="app\.js/g) || []).length, 1, "Unified page must load exactly one gameplay implementation");
assert(i18n.includes('return "en-US";'), "First visit must default to English");
assert(i18n.includes('new URLSearchParams(window.location.search).get("lang")'), "Language query override must be supported");
assert(i18n.includes('window.dispatchEvent(new CustomEvent("m1w:locale-changed"'), "Runtime language changes must notify gameplay rendering");
assert(i18n.indexOf('dictionaries[requested]?.[sharedKey]') < i18n.indexOf('dictionaries["en-US"]?.[key]'), "Requested-language shared static text must win over the generated English occurrence");
assert(i18n.includes('if (!(key in english)) english[key] = source;'), "English accessibility attributes must register their readable fallback");
assert(app.includes('const SAVE_KEY = "metropolis_roaring_times_m1w_unified_save_v4";'), "Bilingual build needs one current unified save key");
assert(app.includes('"metropolis_roaring_times_m1w_unified_save_v3"'), "Runtime-map migration must retain the previous unified save key as read-only input");
for (const legacyKey of ["metropolis_roaring_times_m01_save_v2", "metropolis_roaring_times_m01_save_zh_cn_v1", "roaring_times_m0_web_save_v1"]) {
  assert(app.includes(`"${legacyKey}"`), `Missing read-only legacy save migration source: ${legacyKey}`);
}
assert(app.includes('key: "activity.match_entered"'), "New activity records must store localization keys instead of rendered prose");
assert(app.includes("renderBuildingSelectLabels();"), "Language switching must localize static select options");

assert(redirect.includes("../?lang=zh-CN"), "Old Chinese URL must redirect to the unified page");
assert(!fs.existsSync(path.join(webRoot, "zh-CN", "app.js")), "Duplicate Chinese gameplay code must be removed");
assert(!fs.existsSync(path.join(webRoot, "zh-CN", "zh-CN.css")), "Duplicate Chinese layout stylesheet must be removed");

for (const file of ["SourceHanSerifCN-Bold-2.otf", "SourceHanSerifCN-Medium-6.otf"]) {
  const font = fs.readFileSync(path.join(webRoot, "assets", "fonts", file));
  assert.equal(font.subarray(0, 4).toString("ascii"), "OTTO", `${file} must be a valid OpenType font`);
  assert(font.length > 1000000, `${file} is unexpectedly small`);
}
assert(localizationStyles.includes('html[lang="zh-CN"]'), "Chinese font overrides must be scoped by the document language");
assert(localizationStyles.includes('SourceHanSerifCN-Bold-2.otf'), "Chinese title font must use the owner-approved Bold OTF");
assert(localizationStyles.includes('SourceHanSerifCN-Medium-6.otf'), "Chinese body font must use the owner-approved Medium OTF");
assert(localizationStyles.includes('--zh-title: "Source Han Serif CN M1W Title"'), "Chinese title variable must point to the approved title family");
assert(localizationStyles.includes('--zh-body: "Source Han Serif CN M1W Body"'), "Chinese body variable must point to the approved body family");

console.log(`M1W_I18N_STATIC_TEST_PASS locales=2 dynamic_keys=${dynamicEnglishKeys.length} fonts=2`);

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const source = fs.readFileSync(path.join(__dirname, "..", "code.js"), "utf8");
if (source.includes("MASTER_WIDTH") || source.includes("MASTER_HEIGHT") || source.includes("不是规定的")) {
  throw new Error("插件仍包含固定画布尺寸限制或警告");
}
for (const requiredOutput of [
  "metropolis_map_base.svg",
  "metropolis_district_geometry.svg",
  "metropolis_purchasable_blocks.svg",
  "handoff/landmarks.json",
  "landmarks/"
]) {
  if (!source.includes(requiredOutput)) throw new Error(`快速交付缺少生产文件：${requiredOutput}`);
}
if (!source.includes("metropolis_historical_landmarks.svg")) {
  throw new Error("完整归档模式缺少历史地标总 SVG");
}

function makeNode(name, type, bounds) {
  return {
    id: `id_${name}`,
    name,
    type,
    visible: true,
    absoluteBoundingBox: bounds,
    absoluteTransform: [[1, 0, bounds.x], [0, 1, bounds.y]]
  };
}

const names = [
  "08_PURCHASABLE_BLOCK_GEOMETRY",
  "07_HISTORICAL_LANDMARKS",
  "06_FRAME",
  "05_NON_BUILDING_ORNAMENT",
  "04_ROADS",
  "03_DISTRICT_GEOMETRY",
  "02_COASTLINE",
  "01_WATER"
];
const page = {
  id: "page_1",
  name: "Page 1",
  type: "PAGE",
  selection: [],
  children: [],
  findOne(predicate) {
    return this.children.find(predicate) || null;
  }
};
page.children = names.map((name, index) => {
  const selectedCanvas = name === "06_FRAME";
  const node = makeNode(name, name === "01_WATER" ? "RECTANGLE" : "GROUP", {
    x: 100 + index,
    y: 200 + index,
    width: selectedCanvas ? 10334 : 9992 - index,
    height: selectedCanvas ? 14101 : 13410 - index
  });
  node.parent = page;
  return node;
});
page.selection = [page.children[0]];

const figma = {
  showUI() {},
  currentPage: page,
  root: { id: "root", name: "test", children: [page] },
  ui: { postMessage() {}, onmessage: null },
  on() {},
  closePlugin() {}
};
const context = { figma, __html__: "", Uint8Array, console, Set, Date, Number, Math };
vm.createContext(context);
vm.runInContext(source, context, { filename: "code.js" });

context.utf8Sample = "Metropolis 中文 🗽";
const actualUtf8 = Buffer.from(vm.runInContext("utf8Encode(utf8Sample)", context));
const expectedUtf8 = Buffer.from(context.utf8Sample, "utf8");
if (!actualUtf8.equals(expectedUtf8)) throw new Error("插件自带 UTF-8 编码与标准结果不一致");

const loose = vm.runInContext("selectedContext()", context);
if (!loose || loose.kind !== "LOOSE_LAYERS") throw new Error("未识别并列顶层 Group");
if (loose.layers.length !== 8) throw new Error(`顶层图层数量错误：${loose.layers.length}`);
if (Math.round(loose.width) !== 10334 || Math.round(loose.height) !== 14101) {
  throw new Error(`虚拟主画框尺寸错误：${loose.width} × ${loose.height}`);
}
context.transformNode = page.children[2];
context.masterBounds = loose.bounds;
const relativeTransform = vm.runInContext("relativeTransformFor(transformNode, masterBounds)", context);
if (relativeTransform[0][2] !== context.transformNode.absoluteTransform[0][2] - loose.bounds.x) {
  throw new Error("并列图层横向位置没有转换为统一画布坐标");
}
if (relativeTransform[1][2] !== context.transformNode.absoluteTransform[1][2] - loose.bounds.y) {
  throw new Error("并列图层纵向位置没有转换为统一画布坐标");
}

const realFrame = makeNode("MAP_MASTER_VECTOR", "FRAME", { x: 20, y: 30, width: 2718, height: 4096 });
realFrame.width = 2718;
realFrame.height = 4096;
realFrame.rotation = 0;
realFrame.children = page.children.slice(0, 2);
page.selection = [realFrame];
const frameContext = vm.runInContext("selectedContext()", context);
if (!frameContext || frameContext.kind !== "FRAME") throw new Error("正式外层 Frame 回归失败");
if (frameContext.layers.length !== 2) throw new Error("正式 Frame 子图层读取失败");

const fastOptions = vm.runInContext("normalizeExportOptions({mode:'fast',includeLayerSvg:true,includePngPreview:true})", context);
if (fastOptions.includeMasterFull || fastOptions.includeAlignmentPreview || fastOptions.includeLayerSvg || fastOptions.includePngPreview) {
  throw new Error("快速模式仍启用了耗时的整图、对齐、逐层或 PNG 导出");
}
const fullOptions = vm.runInContext("normalizeExportOptions({mode:'full',includeLayerSvg:true,includePngPreview:false})", context);
if (!fullOptions.includeMasterFull || !fullOptions.includeAlignmentPreview || !fullOptions.includeLayerSvg || fullOptions.includePngPreview) {
  throw new Error("完整模式导出选项不正确");
}
if (vm.runInContext("includeLayerForMode(PLOT_LAYER, 'map_base')", context) !== false) {
  throw new Error("纯底图仍包含可购买地块");
}
if (vm.runInContext("includeLayerForMode(LANDMARK_LAYER, 'map_base')", context) !== false) {
  throw new Error("纯底图仍包含历史地标");
}
if (vm.runInContext("includeLayerForMode(LANDMARK_LAYER, 'historical_landmarks')", context) !== true) {
  throw new Error("历史地标独立导出没有选中权威图层");
}

const landmarkLayer = page.children.find((node) => node.name === "07_HISTORICAL_LANDMARKS");
landmarkLayer.children = Array.from({ length: 100 }, (_, index) => {
  const landmark = makeNode(`landmark_${String(index + 1).padStart(3, "0")}`, "GROUP", {
    x: 500 + index * 10,
    y: 800 + index * 12,
    width: 240,
    height: 300
  });
  const label = makeNode("title", "GROUP", { x: 510 + index * 10, y: 1020 + index * 12, width: 220, height: 50 });
  const labelText = makeNode(`Landmark ${index + 1}`, "TEXT", { x: 530 + index * 10, y: 1030 + index * 12, width: 180, height: 20 });
  labelText.characters = `Landmark ${index + 1}`;
  label.children = [labelText];
  labelText.parent = label;
  const artwork = makeNode(`landmark_${index + 1}_artwork`, "RECTANGLE", { x: 520 + index * 10, y: 810 + index * 12, width: 200, height: 200 });
  landmark.children = [label, artwork];
  label.parent = landmark;
  artwork.parent = landmark;
  landmark.parent = landmarkLayer;
  return landmark;
});
context.looseResult = loose;
context.landmarkWarnings = [];
const landmarkBatch = vm.runInContext("landmarkDescriptors(looseResult, landmarkWarnings)", context);
if (landmarkBatch.length !== 100) throw new Error(`逐地标清单数量错误：${landmarkBatch.length}`);
if (new Set(landmarkBatch.map((item) => item.file)).size !== 100) throw new Error("逐地标文件名不唯一");
if (!landmarkBatch[0].relativeToMaster || !landmarkBatch[0].structure.children) {
  throw new Error("逐地标清单没有保存地图坐标或子图层关系");
}
context.landmarkBatch = landmarkBatch;
const landmarkManifest = vm.runInContext("buildLandmarkManifest(looseResult, landmarkBatch)", context);
if (landmarkManifest.landmarkCount !== 100 || landmarkManifest.master.width !== loose.width) {
  throw new Error("历史地标 manifest 缺少数量或主画布信息");
}
context.sampleLandmarkName = "st-paul-the-apostle-church";
if (vm.runInContext("landmarkStableId(sampleLandmarkName)", context) !== "landmark_st_paul_the_apostle_church") {
  throw new Error("Figma 地标名没有转换为稳定 snake_case 运行时 ID");
}

context.heavyVectorNode = makeNode("heavy", "VECTOR", { x: 0, y: 0, width: 1, height: 1 });
context.heavyVectorNode.vectorPaths = [{ windingRule: "NONZERO", data: "M 0 0 L 1 1" }];
context.heavyVectorNode.vectorNetwork = { vertices: [{ x: 0, y: 0 }], segments: [] };
const compactNode = vm.runInContext("serializeNode(heavyVectorNode, null, false)", context);
if ("vectorPaths" in compactNode || "vectorNetwork" in compactNode) {
  throw new Error("快速模式结构树仍复制重型矢量数据");
}
const fullNode = vm.runInContext("serializeNode(heavyVectorNode, null, true)", context);
if (!("vectorPaths" in fullNode) || !("vectorNetwork" in fullNode)) {
  throw new Error("完整归档模式没有保留重型矢量数据");
}

async function runAsyncChecks() {
  context.warningList = [];
  const succeeded = await vm.runInContext("attemptFile('optional.png', '可选 PNG', async () => { throw new Error('too large'); }, warningList)", context);
    if (succeeded !== false || context.warningList.length !== 1 || !context.warningList[0].includes("继续生成")) {
      throw new Error("可选文件失败没有被降级为继续导出的警告");
    }

  const messages = [];
  figma.ui.postMessage = (message) => messages.push(message);
  context.exportCalls = [];
  vm.runInContext(`
    exportContext = async function(_context, mode, format) {
      exportCalls.push(mode + ':' + format);
      return new Uint8Array([1, 2, 3]);
    };
    exportBrand = async function() { return null; };
    exportLandmarkNode = async function(node) {
      if (node.name === 'landmark_050') throw new Error('simulated landmark failure');
      return new Uint8Array([4, 5, 6]);
    };
  `, context);
  page.selection = [page.children[0]];
  await vm.runInContext("runExport({mode:'fast',includeLayerSvg:true,includePngPreview:true})", context);

  if (context.exportCalls.some((call) => call.startsWith("historical_landmarks:"))) {
    throw new Error("快速模式仍调用历史地标总 SVG 导出");
  }
  const filePaths = messages.filter((message) => message.type === "file").map((message) => message.path);
  if (!filePaths.includes("handoff/landmarks.json")) throw new Error("快速模式没有输出历史地标位置清单");
  if (!filePaths.includes("landmarks/landmark_100.svg")) throw new Error("单个地标失败后没有继续导出后续地标");
  if (filePaths.includes("landmarks/landmark_050.svg")) throw new Error("失败地标不应产生损坏文件");
  if (filePaths.includes("export/metropolis_historical_landmarks.svg")) throw new Error("快速模式不应输出历史地标总 SVG");
  const complete = messages.find((message) => message.type === "complete");
  if (!complete || !complete.warnings.some((warning) => warning.includes("landmark_050"))) {
    throw new Error("单个地标失败没有进入最终警告汇总");
  }
  console.log("FIGMA_PLUGIN_CONTEXT_SMOKE_PASS");
}

runAsyncChecks().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

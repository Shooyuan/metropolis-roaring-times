const fs = require("fs");
const path = require("path");
const vm = require("vm");

const source = fs.readFileSync(path.join(__dirname, "..", "code.js"), "utf8");

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
  "06_FRAME",
  "05_NON_BUILDING_ORNAMENT",
  "04_ROADS",
  "03_DISTRICT_GEOMETRY",
  "02_COASTLINE",
  "01_WATER",
  "00_BRAND"
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
  const exact = name === "01_WATER";
  const node = makeNode(name, name === "01_WATER" ? "RECTANGLE" : "GROUP", {
    x: 100 + index,
    y: 200 + index,
    width: exact ? 4474 : 4400 - index,
    height: exact ? 5904 : 5800 - index
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
const context = { figma, __html__: "", TextEncoder, console, Set, Date, Number, Math };
vm.createContext(context);
vm.runInContext(source, context, { filename: "code.js" });

const loose = vm.runInContext("selectedContext()", context);
if (!loose || loose.kind !== "LOOSE_LAYERS") throw new Error("未识别并列顶层 Group");
if (loose.layers.length !== 7) throw new Error(`顶层图层数量错误：${loose.layers.length}`);
if (Math.round(loose.width) !== 4474 || Math.round(loose.height) !== 5904) {
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

const realFrame = makeNode("MAP_MASTER_4474x5904", "FRAME", { x: 20, y: 30, width: 4474, height: 5904 });
realFrame.width = 4474;
realFrame.height = 5904;
realFrame.rotation = 0;
realFrame.children = page.children.slice(0, 2);
page.selection = [realFrame];
const frameContext = vm.runInContext("selectedContext()", context);
if (!frameContext || frameContext.kind !== "FRAME") throw new Error("正式外层 Frame 回归失败");
if (frameContext.layers.length !== 2) throw new Error("正式 Frame 子图层读取失败");

console.log("FIGMA_PLUGIN_CONTEXT_SMOKE_PASS");

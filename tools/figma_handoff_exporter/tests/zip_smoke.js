const fs = require("fs");
const vm = require("vm");

const html = fs.readFileSync(require("path").join(__dirname, "..", "ui.html"), "utf8");
const match = html.match(/<script>([\s\S]*?)<\/script>/);
if (!match) throw new Error("ui.html 中没有内联脚本");

const nodes = new Map();
function node(id) {
  if (!nodes.has(id)) nodes.set(id, {
    id,
    value: 0,
    max: 1,
    disabled: false,
    checked: true,
    className: "",
    classList: { toggle() {} },
    addEventListener() {},
    appendChild() {},
    remove() {},
    click() {}
  });
  return nodes.get(id);
}

let blobParts = null;
class TestBlob {
  constructor(parts) { blobParts = parts; this.parts = parts; }
}

const context = {
  console,
  TextEncoder,
  Uint8Array,
  Uint32Array,
  setTimeout,
  Blob: TestBlob,
  URL: { createObjectURL() { return "blob:test"; }, revokeObjectURL() {} },
  document: { getElementById: node, createElement: node, body: { appendChild() {} } },
  parent: { postMessage() {} },
  window: {}
};
vm.createContext(context);
vm.runInContext(match[1], context, { filename: "ui-inline.js" });

const result = vm.runInContext("buildZip([{path:'smoke_test.txt',bytes:new TextEncoder().encode('ok')}])", context);
if (!(result instanceof TestBlob) || !blobParts) throw new Error("ZIP 未生成");
const first = blobParts[0];
if (!(first instanceof Uint8Array) || first[0] !== 0x50 || first[1] !== 0x4b || first[2] !== 0x03 || first[3] !== 0x04) {
  throw new Error("ZIP 本地文件头错误");
}
const signatures = blobParts.filter((part) => part instanceof Uint8Array && part.length >= 4).map((part) => Array.from(part.slice(0, 4)).join(","));
if (!signatures.includes("80,75,1,2") || !signatures.includes("80,75,5,6")) throw new Error("ZIP 中央目录或结束记录缺失");

if (process.env.TEST_ZIP_PATH) {
  const buffers = blobParts.map((part) => Buffer.from(part));
  fs.writeFileSync(process.env.TEST_ZIP_PATH, Buffer.concat(buffers));
}

console.log("FIGMA_PLUGIN_ZIP_SMOKE_PASS");

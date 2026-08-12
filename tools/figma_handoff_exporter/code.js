/* Metropolis Handoff Exporter — local Figma development plugin. */

figma.showUI(__html__, { width: 500, height: 560, themeColors: true });

const MASTER_NAME = "MAP_MASTER_4474x5904";
const MASTER_WIDTH = 4474;
const MASTER_HEIGHT = 5904;
const DISTRICT_LAYER = "03_DISTRICT_GEOMETRY";
const BRAND_LAYER = "00_BRAND";

function normalizeName(value) {
  return String(value || "unnamed")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "") || "unnamed";
}

function toPlain(value, seen, depth) {
  if (depth > 10) return "[maximum depth]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "symbol") return String(value);
  if (typeof value === "function") return undefined;
  if (Array.isArray(value)) return value.map((item) => toPlain(item, seen, depth + 1));
  if (typeof value === "object") {
    if (seen.has(value)) return "[circular]";
    seen.add(value);
    const result = {};
    for (const key of Object.keys(value)) {
      try {
        const plain = toPlain(value[key], seen, depth + 1);
        if (plain !== undefined) result[key] = plain;
      } catch (_error) {
        result[key] = "[unavailable]";
      }
    }
    seen.delete(value);
    return result;
  }
  return String(value);
}

function safeProperty(node, key) {
  try {
    if (!(key in node)) return undefined;
    return toPlain(node[key], new Set(), 0);
  } catch (_error) {
    return "[unavailable]";
  }
}

const COMMON_PROPERTIES = [
  "visible", "locked", "opacity", "blendMode", "isMask", "maskType", "clipsContent",
  "x", "y", "width", "height", "rotation", "relativeTransform", "absoluteTransform",
  "absoluteBoundingBox", "absoluteRenderBounds", "constraints", "minWidth", "maxWidth",
  "minHeight", "maxHeight", "layoutMode", "primaryAxisSizingMode", "counterAxisSizingMode",
  "primaryAxisAlignItems", "counterAxisAlignItems", "layoutWrap", "itemSpacing", "counterAxisSpacing",
  "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "layoutAlign", "layoutGrow",
  "layoutPositioning", "fills", "strokes", "strokeWeight", "strokeAlign", "strokeCap", "strokeJoin",
  "dashPattern", "strokeMiterLimit", "fillStyleId", "strokeStyleId", "effects", "effectStyleId",
  "cornerRadius", "topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius",
  "exportSettings", "componentPropertyReferences", "boundVariables", "annotations", "hyperlink"
];

function styledText(node) {
  if (node.type !== "TEXT") return undefined;
  const result = {
    characters: node.characters,
    fontName: safeProperty(node, "fontName"),
    fontSize: safeProperty(node, "fontSize"),
    textAlignHorizontal: safeProperty(node, "textAlignHorizontal"),
    textAlignVertical: safeProperty(node, "textAlignVertical"),
    textAutoResize: safeProperty(node, "textAutoResize"),
    paragraphIndent: safeProperty(node, "paragraphIndent"),
    paragraphSpacing: safeProperty(node, "paragraphSpacing"),
    lineHeight: safeProperty(node, "lineHeight"),
    letterSpacing: safeProperty(node, "letterSpacing"),
    textCase: safeProperty(node, "textCase"),
    textDecoration: safeProperty(node, "textDecoration")
  };
  try {
    result.segments = toPlain(node.getStyledTextSegments([
      "fontName", "fontSize", "fontWeight", "textDecoration", "textCase", "lineHeight",
      "letterSpacing", "fills", "textStyleId", "fillStyleId", "listOptions", "indentation"
    ]), new Set(), 0);
  } catch (error) {
    result.segmentError = String(error);
  }
  return result;
}

function serializeNode(node, parentAbsolute) {
  const item = {
    id: node.id,
    name: node.name,
    type: node.type,
    parentId: node.parent ? node.parent.id : null,
    siblingIndex: node.parent && "children" in node.parent ? node.parent.children.indexOf(node) : null,
    properties: {}
  };
  for (const key of COMMON_PROPERTIES) {
    const value = safeProperty(node, key);
    if (value !== undefined) item.properties[key] = value;
  }
  const bounds = safeProperty(node, "absoluteBoundingBox");
  if (bounds && typeof bounds === "object" && parentAbsolute) {
    item.relativeToMaster = {
      x: bounds.x - parentAbsolute.x,
      y: bounds.y - parentAbsolute.y,
      width: bounds.width,
      height: bounds.height
    };
  }
  const text = styledText(node);
  if (text) item.text = text;
  if ("vectorPaths" in node) item.vectorPaths = safeProperty(node, "vectorPaths");
  if ("vectorNetwork" in node) item.vectorNetwork = safeProperty(node, "vectorNetwork");
  if ("booleanOperation" in node) item.booleanOperation = safeProperty(node, "booleanOperation");
  if ("componentProperties" in node) item.componentProperties = safeProperty(node, "componentProperties");
  if ("reactions" in node) item.reactions = safeProperty(node, "reactions");
  if ("children" in node) item.children = node.children.map((child) => serializeNode(child, parentAbsolute));
  return item;
}

function paintsFromNode(node) {
  const paints = [];
  for (const key of ["fills", "strokes"]) {
    try {
      const value = node[key];
      if (Array.isArray(value)) paints.push(...value);
    } catch (_error) {}
  }
  return paints;
}

function collectImageHashes(node, hashes) {
  for (const paint of paintsFromNode(node)) {
    if (paint && paint.type === "IMAGE" && paint.imageHash) hashes.add(paint.imageHash);
  }
  if ("children" in node) for (const child of node.children) collectImageHashes(child, hashes);
}

function bytesToHex(bytes, limit) {
  let result = "";
  for (let i = 0; i < Math.min(bytes.length, limit); i += 1) result += bytes[i].toString(16).padStart(2, "0");
  return result;
}

function imageExtension(bytes) {
  const prefix = bytesToHex(bytes, 12);
  if (prefix.startsWith("89504e470d0a1a0a")) return "png";
  if (prefix.startsWith("ffd8ff")) return "jpg";
  if (prefix.startsWith("47494638")) return "gif";
  if (prefix.startsWith("52494646") && prefix.slice(16, 24) === "57454250") return "webp";
  return "bin";
}

function postFile(path, bytes) {
  figma.ui.postMessage({ type: "file", path, bytes });
}

function postText(path, text) {
  postFile(path, new TextEncoder().encode(text));
}

function progress(message, current, total) {
  figma.ui.postMessage({ type: "progress", message, current, total });
}

function selectedMaster() {
  const selected = figma.currentPage.selection;
  if (selected.length === 1 && selected[0].type === "FRAME") {
    const frame = selected[0];
    if (frame.name === MASTER_NAME || (Math.round(frame.width) === MASTER_WIDTH && Math.round(frame.height) === MASTER_HEIGHT)) return frame;
  }
  const exact = figma.currentPage.findOne((node) => node.type === "FRAME" && node.name === MASTER_NAME);
  if (exact && exact.type === "FRAME") return exact;
  return null;
}

function findLayer(master, name) {
  const direct = master.children.find((child) => child.name === name);
  if (direct) return direct;
  return master.findOne((node) => node.name === name);
}

function findBrandNode(master) {
  return findLayer(master, BRAND_LAYER) || figma.currentPage.findOne((node) => node.name === BRAND_LAYER);
}

function setTopVisibility(frame, predicate) {
  for (const child of frame.children) child.visible = predicate(child);
}

async function exportClone(master, mode, format) {
  const clone = master.clone();
  clone.name = `__handoff_${mode}__`;
  clone.x = master.x + master.width + 2048;
  clone.y = master.y;
  figma.currentPage.appendChild(clone);
  try {
    if (mode === "map_base") {
      setTopVisibility(clone, (child) => child.name !== DISTRICT_LAYER && child.name !== BRAND_LAYER);
    } else if (mode === "district_geometry") {
      clone.fills = [];
      clone.strokes = [];
      clone.effects = [];
      setTopVisibility(clone, (child) => child.name === DISTRICT_LAYER);
      const district = findLayer(clone, DISTRICT_LAYER);
      if (district) district.visible = true;
    } else if (mode === "alignment_preview") {
      setTopVisibility(clone, (child) => child.name !== BRAND_LAYER);
      const district = findLayer(clone, DISTRICT_LAYER);
      if (district) district.visible = true;
    }
    const settings = format === "SVG"
      ? { format: "SVG", svgIdAttribute: true, svgOutlineText: false, svgSimplifyStroke: false }
      : { format: "PNG", constraint: { type: "SCALE", value: 1 } };
    return await clone.exportAsync(settings);
  } finally {
    clone.remove();
  }
}

async function exportLayerOnMasterCanvas(master, layer) {
  const frame = figma.createFrame();
  frame.name = `__handoff_layer_${normalizeName(layer.name)}__`;
  frame.resizeWithoutConstraints(master.width, master.height);
  frame.fills = [];
  frame.strokes = [];
  frame.effects = [];
  frame.clipsContent = true;
  frame.x = master.x + master.width + 2048;
  frame.y = master.y;
  const clone = layer.clone();
  frame.appendChild(clone);
  try {
    return await frame.exportAsync({ format: "SVG", svgIdAttribute: true, svgOutlineText: false, svgSimplifyStroke: false });
  } finally {
    frame.remove();
  }
}

async function exportBrand(master) {
  const brand = findBrandNode(master);
  if (!brand || !("exportAsync" in brand)) return null;
  const clone = brand.clone();
  if ("visible" in clone) clone.visible = true;
  clone.name = "__handoff_brand__";
  clone.x = master.x + master.width + 2048;
  clone.y = master.y;
  figma.currentPage.appendChild(clone);
  try {
    const svg = await clone.exportAsync({ format: "SVG", svgIdAttribute: true, svgOutlineText: false, svgSimplifyStroke: false });
    const png = await clone.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 1 } });
    return { svg, png, nodeId: brand.id, name: brand.name };
  } finally {
    clone.remove();
  }
}

async function runExport(options) {
  const master = selectedMaster();
  if (!master) throw new Error(`请选中地图主画框，或将主画框命名为 ${MASTER_NAME}。`);
  const warnings = [];
  if (Math.round(master.width) !== MASTER_WIDTH || Math.round(master.height) !== MASTER_HEIGHT) {
    warnings.push(`主画框当前为 ${master.width} × ${master.height}，不是规定的 ${MASTER_WIDTH} × ${MASTER_HEIGHT}。`);
  }
  const masterBounds = master.absoluteBoundingBox || { x: master.x, y: master.y, width: master.width, height: master.height };
  const timestamp = new Date().toISOString();
  const topLayers = master.children.map((node, index) => ({ index, id: node.id, name: node.name, type: node.type, visible: node.visible }));
  const manifest = {
    format: "metropolis_figma_handoff",
    formatVersion: 1,
    exportedAt: timestamp,
    fileName: figma.root.name,
    page: { id: figma.currentPage.id, name: figma.currentPage.name },
    master: {
      id: master.id,
      name: master.name,
      width: master.width,
      height: master.height,
      rotation: master.rotation,
      absoluteBoundingBox: toPlain(masterBounds, new Set(), 0)
    },
    topLayers,
    warnings,
    pages: figma.root.children.map((page) => ({ id: page.id, name: page.name, type: page.type })),
    tree: serializeNode(master, masterBounds),
    currentPageTree: figma.currentPage.children.map((node) => serializeNode(node, masterBounds))
  };

  const total = 7 + master.children.length;
  let step = 0;
  progress("保存完整图层树和样式", ++step, total);
  postText("handoff/figma_document.json", JSON.stringify(manifest, null, 2));

  progress("导出完整主画框 SVG", ++step, total);
  postFile("export/master_full.svg", await master.exportAsync({ format: "SVG", svgIdAttribute: true, svgOutlineText: false, svgSimplifyStroke: false }));

  progress("导出网页地图底图 PNG", ++step, total);
  postFile("export/metropolis_map_base.png", await exportClone(master, "map_base", "PNG"));

  progress("导出分区几何 SVG", ++step, total);
  postFile("export/metropolis_district_geometry.svg", await exportClone(master, "district_geometry", "SVG"));

  progress("导出地图对齐预览 PNG", ++step, total);
  postFile("export/metropolis_alignment_preview.png", await exportClone(master, "alignment_preview", "PNG"));

  const brand = await exportBrand(master);
  progress("导出独立 Brand", ++step, total);
  if (brand) {
    postFile("export/metropolis_brand_logo.svg", brand.svg);
    postFile("export/metropolis_brand_logo.png", brand.png);
  } else {
    warnings.push(`没有找到 ${BRAND_LAYER}，未导出 Brand。`);
  }

  if (options.includeLayerSvg) {
    for (let index = 0; index < master.children.length; index += 1) {
      const layer = master.children[index];
      progress(`导出独立图层：${layer.name}`, ++step, total);
      const prefix = String(index).padStart(2, "0");
      postFile(`layers/${prefix}_${normalizeName(layer.name)}.svg`, await exportLayerOnMasterCanvas(master, layer));
    }
  }

  const hashes = new Set();
  collectImageHashes(figma.currentPage, hashes);
  let imageIndex = 0;
  for (const hash of hashes) {
    progress(`提取原始图片 ${++imageIndex}/${hashes.size}`, step, total);
    const image = figma.getImageByHash(hash);
    if (!image) continue;
    const bytes = await image.getBytesAsync();
    postFile(`images/${hash}.${imageExtension(bytes)}`, bytes);
  }

  const readme = [
    "Metropolis: Roaring Times — Figma Handoff",
    "",
    `导出时间：${timestamp}`,
    `Figma 文件：${figma.root.name}`,
    `主画框：${master.name} (${master.width} × ${master.height})`,
    "",
    "handoff/figma_document.json 保存完整图层树、父子关系、顺序、位置、尺寸、变换、颜色、填充、描边、效果、文字和矢量路径。",
    "export/ 保存网页制作直接使用的地图、分区、对齐预览和 Brand。",
    "layers/ 保存位于统一主画框坐标中的顶层图层 SVG。",
    "images/ 保存 Figma 中引用的原始图片填充。",
    "",
    "注意：此交付包不能替代 .fig 的版本历史、评论和协作记录；请继续保存本地 .fig 副本。",
    warnings.length ? `\n警告：\n- ${warnings.join("\n- ")}` : "\n检查未产生警告。"
  ].join("\n");
  postText("README_ZH_CN.txt", readme);
  postText("handoff/export_summary.json", JSON.stringify({ warnings, imageCount: hashes.size, topLayerCount: master.children.length }, null, 2));
  figma.ui.postMessage({ type: "complete", warnings, fileName: `metropolis_handoff_${Date.now()}.zip` });
}

function sendReady() {
  const master = selectedMaster();
  figma.ui.postMessage({
    type: "ready",
    master: master ? { id: master.id, name: master.name, width: master.width, height: master.height, layerCount: master.children.length } : null,
    selectionCount: figma.currentPage.selection.length
  });
}

figma.on("selectionchange", sendReady);
figma.ui.onmessage = async (message) => {
  if (message.type === "export") {
    try {
      figma.ui.postMessage({ type: "reset" });
      await runExport({ includeLayerSvg: message.includeLayerSvg !== false });
    } catch (error) {
      figma.ui.postMessage({ type: "error", message: error instanceof Error ? error.message : String(error) });
    }
  } else if (message.type === "close") {
    figma.closePlugin();
  }
};

sendReady();

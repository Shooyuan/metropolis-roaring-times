/* Metropolis Handoff Exporter — local Figma development plugin. */

figma.showUI(__html__, { width: 500, height: 630, themeColors: true });

const MASTER_NAME = "MAP_MASTER_VECTOR";
const LEGACY_MASTER_NAME = "MAP_MASTER_4474x5904";
const DISTRICT_LAYER = "03_DISTRICT_GEOMETRY";
const LANDMARK_LAYER = "07_HISTORICAL_LANDMARKS";
const PLOT_LAYER = "08_PURCHASABLE_BLOCK_GEOMETRY";
const BRAND_LAYER = "00_BRAND";
const EXPECTED_LAYER_NAMES = [
  PLOT_LAYER,
  LANDMARK_LAYER,
  "06_FRAME",
  "05_NON_BUILDING_ORNAMENT",
  "04_ROADS",
  DISTRICT_LAYER,
  "02_COASTLINE",
  "01_WATER",
  BRAND_LAYER
];

function normalizeName(value) {
  return String(value || "unnamed")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "") || "unnamed";
}

function landmarkStableId(value) {
  const normalized = normalizeName(value).replace(/[.-]+/g, "_");
  return normalized.startsWith("landmark_") ? normalized : `landmark_${normalized}`;
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

function serializeNode(node, parentAbsolute, includeHeavyGeometry) {
  const keepHeavyGeometry = includeHeavyGeometry !== false;
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
  if (keepHeavyGeometry && "vectorPaths" in node) item.vectorPaths = safeProperty(node, "vectorPaths");
  if (keepHeavyGeometry && "vectorNetwork" in node) item.vectorNetwork = safeProperty(node, "vectorNetwork");
  if ("booleanOperation" in node) item.booleanOperation = safeProperty(node, "booleanOperation");
  if ("componentProperties" in node) item.componentProperties = safeProperty(node, "componentProperties");
  if ("reactions" in node) item.reactions = safeProperty(node, "reactions");
  if ("children" in node) item.children = node.children.map((child) => serializeNode(child, parentAbsolute, keepHeavyGeometry));
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

function collectContextImageHashes(context) {
  const hashes = new Set();
  if (context.masterNode) {
    collectImageHashes(context.masterNode, hashes);
  } else {
    for (const layer of context.layers) collectImageHashes(layer, hashes);
  }
  const brand = findBrandNode(context);
  if (brand && brand !== context.masterNode && !context.layers.includes(brand)) collectImageHashes(brand, hashes);
  return hashes;
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

function utf8Encode(text) {
  const bytes = [];
  for (let index = 0; index < text.length; index += 1) {
    let codePoint = text.charCodeAt(index);
    if (codePoint >= 0xd800 && codePoint <= 0xdbff && index + 1 < text.length) {
      const next = text.charCodeAt(index + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        codePoint = 0x10000 + ((codePoint - 0xd800) << 10) + (next - 0xdc00);
        index += 1;
      }
    }
    if (codePoint <= 0x7f) {
      bytes.push(codePoint);
    } else if (codePoint <= 0x7ff) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint <= 0xffff) {
      bytes.push(0xe0 | (codePoint >> 12), 0x80 | ((codePoint >> 6) & 0x3f), 0x80 | (codePoint & 0x3f));
    } else {
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    }
  }
  return new Uint8Array(bytes);
}

function postText(path, text) {
  postFile(path, utf8Encode(text));
}

function progress(message, current, total) {
  figma.ui.postMessage({ type: "progress", message, current, total });
}

function nodeBounds(node) {
  const bounds = safeProperty(node, "absoluteBoundingBox");
  if (!bounds || typeof bounds !== "object") return null;
  if (![bounds.x, bounds.y, bounds.width, bounds.height].every((value) => typeof value === "number" && Number.isFinite(value))) return null;
  return bounds;
}

function expectedSiblings(node) {
  if (!node || !node.parent || !("children" in node.parent)) return [];
  return node.parent.children.filter((child) => EXPECTED_LAYER_NAMES.includes(child.name));
}

function canvasNode(layers, selectedNode) {
  const priority = ["06_FRAME", "01_WATER", ...EXPECTED_LAYER_NAMES];
  for (const name of priority) {
    const node = layers.find((candidate) => candidate.name === name);
    if (node && nodeBounds(node)) return node;
  }
  if (selectedNode && layers.includes(selectedNode) && nodeBounds(selectedNode)) return selectedNode;
  return null;
}

function unionBounds(layers) {
  const bounds = layers.map(nodeBounds).filter(Boolean);
  if (!bounds.length) return null;
  const left = Math.min(...bounds.map((item) => item.x));
  const top = Math.min(...bounds.map((item) => item.y));
  const right = Math.max(...bounds.map((item) => item.x + item.width));
  const bottom = Math.max(...bounds.map((item) => item.y + item.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

function looseContext(layers, parent, selectedNode) {
  if (layers.length < 3) return null;
  const basisNode = canvasNode(layers, selectedNode);
  const bounds = (basisNode && nodeBounds(basisNode)) || unionBounds(layers);
  if (!bounds) return null;
  return {
    kind: "LOOSE_LAYERS",
    id: `virtual:${parent.id}`,
    name: MASTER_NAME,
    parent,
    masterNode: null,
    layers,
    bounds,
    width: bounds.width,
    height: bounds.height,
    rotation: 0
  };
}

function selectedContext() {
  const selected = figma.currentPage.selection;
  if (selected.length === 1 && selected[0].type === "FRAME") {
    const frame = selected[0];
    const expectedChildren = frame.children.filter((child) => EXPECTED_LAYER_NAMES.includes(child.name));
    if (frame.name === MASTER_NAME || frame.name === LEGACY_MASTER_NAME || expectedChildren.length >= 3) {
      const bounds = nodeBounds(frame) || { x: frame.x, y: frame.y, width: frame.width, height: frame.height };
      return {
        kind: "FRAME",
        id: frame.id,
        name: frame.name,
        parent: frame,
        masterNode: frame,
        layers: Array.from(frame.children),
        bounds,
        width: frame.width,
        height: frame.height,
        rotation: frame.rotation
      };
    }
  }
  if (selected.length === 1 && EXPECTED_LAYER_NAMES.includes(selected[0].name)) {
    const context = looseContext(expectedSiblings(selected[0]), selected[0].parent, selected[0]);
    if (context) return context;
  }
  const exact = figma.currentPage.findOne((node) => node.type === "FRAME" && [MASTER_NAME, LEGACY_MASTER_NAME].includes(node.name));
  if (exact && exact.type === "FRAME") {
    const bounds = nodeBounds(exact) || { x: exact.x, y: exact.y, width: exact.width, height: exact.height };
    return {
      kind: "FRAME",
      id: exact.id,
      name: exact.name,
      parent: exact,
      masterNode: exact,
      layers: Array.from(exact.children),
      bounds,
      width: exact.width,
      height: exact.height,
      rotation: exact.rotation
    };
  }
  const pageLayers = figma.currentPage.children.filter((node) => EXPECTED_LAYER_NAMES.includes(node.name));
  const pageContext = looseContext(pageLayers, figma.currentPage, null);
  if (pageContext) return pageContext;
  return null;
}

function findLayer(context, name) {
  const direct = context.layers.find((child) => child.name === name);
  if (direct) return direct;
  if (context.masterNode && "findOne" in context.masterNode) return context.masterNode.findOne((node) => node.name === name);
  return null;
}

function findBrandNode(context) {
  return findLayer(context, BRAND_LAYER) || figma.currentPage.findOne((node) => node.name === BRAND_LAYER);
}

function setTopVisibility(frame, predicate) {
  for (const child of frame.children) child.visible = predicate(child);
}

function normalizeExportOptions(options) {
  const mode = options && options.mode === "full" ? "full" : "fast";
  return {
    mode,
    includeMasterFull: mode === "full",
    includeAlignmentPreview: mode === "full",
    includeLayerSvg: mode === "full" && options.includeLayerSvg !== false,
    includePngPreview: mode === "full" && options.includePngPreview === true
  };
}

function relativeTransformFor(node, bounds) {
  const transform = safeProperty(node, "absoluteTransform");
  if (!Array.isArray(transform) || transform.length !== 2) return null;
  return [
    [transform[0][0], transform[0][1], transform[0][2] - bounds.x],
    [transform[1][0], transform[1][1], transform[1][2] - bounds.y]
  ];
}

function relativeBoundsFor(node, originBounds) {
  const bounds = nodeBounds(node);
  if (!bounds || !originBounds) return null;
  return {
    x: bounds.x - originBounds.x,
    y: bounds.y - originBounds.y,
    width: bounds.width,
    height: bounds.height
  };
}

function countDescendantTypes(node, counts) {
  counts[node.type] = (counts[node.type] || 0) + 1;
  if ("children" in node) {
    for (const child of node.children) countDescendantTypes(child, counts);
  }
}

function serializeLandmarkNode(node, masterBounds, landmarkBounds) {
  const summary = {
    id: node.id,
    name: node.name,
    type: node.type,
    visible: safeProperty(node, "visible"),
    opacity: safeProperty(node, "opacity"),
    relativeToMaster: relativeBoundsFor(node, masterBounds),
    relativeToLandmark: relativeBoundsFor(node, landmarkBounds),
    relativeTransformToMaster: relativeTransformFor(node, masterBounds)
  };
  if (node.type === "TEXT") {
    summary.text = {
      characters: node.characters,
      fontName: safeProperty(node, "fontName"),
      fontSize: safeProperty(node, "fontSize"),
      textAlignHorizontal: safeProperty(node, "textAlignHorizontal"),
      lineHeight: safeProperty(node, "lineHeight"),
      letterSpacing: safeProperty(node, "letterSpacing")
    };
  }
  if ("children" in node) {
    summary.children = node.children.map((child) => serializeLandmarkNode(child, masterBounds, landmarkBounds));
  }
  return summary;
}

function landmarkDescriptors(context, warnings) {
  const layer = findLayer(context, LANDMARK_LAYER);
  if (!layer || !("children" in layer)) return [];
  const usedFileStems = new Set();
  return layer.children.map((node, index) => {
    const stableId = landmarkStableId(node.name);
    let fileStem = stableId;
    let suffix = 2;
    while (usedFileStems.has(fileStem)) fileStem = `${stableId}_${suffix++}`;
    if (fileStem !== stableId) {
      warnings.push(`历史地标名称“${node.name}”重复；交付文件暂命名为 ${fileStem}.svg，请在接入前检查稳定 ID。`);
    }
    usedFileStems.add(fileStem);
    const bounds = nodeBounds(node);
    const typeCounts = {};
    countDescendantTypes(node, typeCounts);
    if (!bounds) warnings.push(`历史地标“${node.name}”没有可用边界，无法保证地图定位。`);
    if (!("children" in node)) warnings.push(`历史地标“${node.name}”不是 Group/Frame，建议把插画与横幅放入同一个父组。`);
    return {
      index,
      node,
      sourceName: node.name,
      stableId,
      file: `landmarks/${fileStem}.svg`,
      relativeToMaster: relativeBoundsFor(node, context.bounds),
      relativeTransformToMaster: relativeTransformFor(node, context.bounds),
      typeCounts,
      structure: serializeLandmarkNode(node, context.bounds, bounds)
    };
  });
}

function buildLandmarkManifest(context, descriptors) {
  return {
    format: "metropolis_landmark_handoff",
    formatVersion: 1,
    sourceLayer: LANDMARK_LAYER,
    master: {
      width: context.width,
      height: context.height,
      absoluteBoundingBox: toPlain(context.bounds, new Set(), 0)
    },
    landmarkCount: descriptors.length,
    landmarks: descriptors.map((descriptor) => ({
      index: descriptor.index,
      sourceName: descriptor.sourceName,
      stableId: descriptor.stableId,
      file: descriptor.file,
      relativeToMaster: descriptor.relativeToMaster,
      relativeTransformToMaster: descriptor.relativeTransformToMaster,
      typeCounts: descriptor.typeCounts,
      structure: descriptor.structure
    }))
  };
}

async function exportLandmarkNode(node) {
  if (!node || !("exportAsync" in node)) throw new Error("该节点不支持导出");
  return await node.exportAsync({ format: "SVG", svgIdAttribute: true, svgOutlineText: false, svgSimplifyStroke: false });
}

function createContextClone(context, name) {
  if (context.kind === "FRAME") {
    const clone = context.masterNode.clone();
    clone.name = name;
    clone.x = context.bounds.x + context.width + 2048;
    clone.y = context.bounds.y;
    figma.currentPage.appendChild(clone);
    return clone;
  }
  const frame = figma.createFrame();
  frame.name = name;
  frame.resizeWithoutConstraints(context.width, context.height);
  frame.fills = [];
  frame.strokes = [];
  frame.effects = [];
  frame.clipsContent = true;
  frame.x = context.bounds.x + context.width + 2048;
  frame.y = context.bounds.y;
  for (const layer of context.layers) {
    const clone = layer.clone();
    const transform = relativeTransformFor(layer, context.bounds);
    frame.appendChild(clone);
    if (transform) clone.relativeTransform = transform;
  }
  return frame;
}

function includeLayerForMode(layerName, mode) {
  if (mode === "map_base") return ![DISTRICT_LAYER, LANDMARK_LAYER, PLOT_LAYER, BRAND_LAYER].includes(layerName);
  if (mode === "district_geometry") return layerName === DISTRICT_LAYER;
  if (mode === "historical_landmarks") return layerName === LANDMARK_LAYER;
  if (mode === "purchasable_blocks") return layerName === PLOT_LAYER;
  return true;
}

function createFilteredContextClone(context, name, mode) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resizeWithoutConstraints(context.width, context.height);
  frame.fills = [];
  frame.strokes = [];
  frame.effects = [];
  frame.clipsContent = true;
  frame.x = context.bounds.x + context.width + 2048;
  frame.y = context.bounds.y;
  for (const layer of context.layers) {
    if (!includeLayerForMode(layer.name, mode)) continue;
    const clone = layer.clone();
    const transform = relativeTransformFor(layer, context.bounds);
    frame.appendChild(clone);
    if (transform) clone.relativeTransform = transform;
  }
  return frame;
}

async function exportContext(context, mode, format) {
  const usesFilteredClone = ["map_base", "district_geometry", "historical_landmarks", "purchasable_blocks"].includes(mode);
  const clone = usesFilteredClone
    ? createFilteredContextClone(context, `__handoff_${mode}__`, mode)
    : createContextClone(context, `__handoff_${mode}__`);
  clone.name = `__handoff_${mode}__`;
  try {
    if (mode === "map_base") {
      setTopVisibility(clone, (child) => ![DISTRICT_LAYER, LANDMARK_LAYER, PLOT_LAYER, BRAND_LAYER].includes(child.name));
    } else if (mode === "district_geometry") {
      clone.fills = [];
      clone.strokes = [];
      clone.effects = [];
      setTopVisibility(clone, (child) => child.name === DISTRICT_LAYER);
      const district = clone.findOne((node) => node.name === DISTRICT_LAYER);
      if (district) district.visible = true;
    } else if (mode === "historical_landmarks") {
      clone.fills = [];
      clone.strokes = [];
      clone.effects = [];
      setTopVisibility(clone, (child) => child.name === LANDMARK_LAYER);
      const landmarks = clone.findOne((node) => node.name === LANDMARK_LAYER);
      if (landmarks) landmarks.visible = true;
    } else if (mode === "purchasable_blocks") {
      clone.fills = [];
      clone.strokes = [];
      clone.effects = [];
      setTopVisibility(clone, (child) => child.name === PLOT_LAYER);
      const plots = clone.findOne((node) => node.name === PLOT_LAYER);
      if (plots) plots.visible = true;
    } else if (mode === "alignment_preview") {
      setTopVisibility(clone, (child) => child.name !== BRAND_LAYER);
      const district = clone.findOne((node) => node.name === DISTRICT_LAYER);
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

async function exportLayerOnMasterCanvas(context, layer) {
  const frame = figma.createFrame();
  frame.name = `__handoff_layer_${normalizeName(layer.name)}__`;
  frame.resizeWithoutConstraints(context.width, context.height);
  frame.fills = [];
  frame.strokes = [];
  frame.effects = [];
  frame.clipsContent = true;
  frame.x = context.bounds.x + context.width + 2048;
  frame.y = context.bounds.y;
  const clone = layer.clone();
  const transform = relativeTransformFor(layer, context.bounds);
  frame.appendChild(clone);
  if (transform) clone.relativeTransform = transform;
  try {
    return await frame.exportAsync({ format: "SVG", svgIdAttribute: true, svgOutlineText: false, svgSimplifyStroke: false });
  } finally {
    frame.remove();
  }
}

async function exportBrand(context, includePngPreview) {
  const brand = findBrandNode(context);
  if (!brand || !("exportAsync" in brand)) return null;
  const clone = brand.clone();
  if ("visible" in clone) clone.visible = true;
  clone.name = "__handoff_brand__";
  clone.x = context.bounds.x + context.width + 2048;
  clone.y = context.bounds.y;
  figma.currentPage.appendChild(clone);
  try {
    const result = { svg: null, png: null, errors: [], nodeId: brand.id, name: brand.name };
    try {
      result.svg = await clone.exportAsync({ format: "SVG", svgIdAttribute: true, svgOutlineText: false, svgSimplifyStroke: false });
    } catch (error) {
      result.errors.push(`Brand SVG 导出失败：${error instanceof Error ? error.message : String(error)}`);
    }
    if (includePngPreview) {
      try {
        result.png = await clone.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 1 } });
      } catch (error) {
        result.errors.push(`Brand PNG 导出失败：${error instanceof Error ? error.message : String(error)}`);
      }
    }
    return result;
  } finally {
    clone.remove();
  }
}

async function attemptFile(path, label, producer, warnings) {
  try {
    const bytes = await producer();
    postFile(path, bytes);
    return true;
  } catch (error) {
    warnings.push(`${label}失败，但交付包继续生成：${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

async function attemptNamedLayerFile(context, layerName, path, label, mode, warnings) {
  if (!findLayer(context, layerName)) {
    warnings.push(`未找到 ${layerName}，未生成 ${path}。`);
    return false;
  }
  return attemptFile(path, label, () => exportContext(context, mode, "SVG"), warnings);
}

async function runExport(options) {
  const context = selectedContext();
  if (!context) throw new Error("请选择地图主画框，或八个规定地图顶层图层中的任意一层。");
  const exportOptions = normalizeExportOptions(options || {});
  const warnings = [];
  const masterBounds = context.bounds;
  const timestamp = new Date().toISOString();
  const landmarks = landmarkDescriptors(context, warnings);
  const landmarkManifest = buildLandmarkManifest(context, landmarks);
  const hashes = collectContextImageHashes(context);
  const includeHeavyGeometry = exportOptions.mode === "full";
  const topLayers = context.layers.map((node, index) => ({ index, id: node.id, name: node.name, type: node.type, visible: node.visible }));
  const tree = context.masterNode
    ? serializeNode(context.masterNode, masterBounds, includeHeavyGeometry)
    : {
        id: context.id,
        name: context.name,
        type: "VIRTUAL_FRAME",
        parentId: context.parent.id,
        siblingIndex: null,
        properties: {
          width: context.width,
          height: context.height,
          rotation: 0,
          absoluteBoundingBox: toPlain(masterBounds, new Set(), 0)
        },
        children: context.layers.map((node) => serializeNode(node, masterBounds, includeHeavyGeometry))
      };
  const manifest = {
    format: "metropolis_figma_handoff",
    formatVersion: 1,
    exportMode: exportOptions.mode,
    structureDetail: includeHeavyGeometry ? "full" : "compact_svg_geometry_external",
    exportedAt: timestamp,
    fileName: figma.root.name,
    page: { id: figma.currentPage.id, name: figma.currentPage.name },
    master: {
      id: context.id,
      name: context.name,
      sourceKind: context.kind,
      width: context.width,
      height: context.height,
      rotation: context.rotation,
      absoluteBoundingBox: toPlain(masterBounds, new Set(), 0)
    },
    topLayers,
    warnings,
    pages: figma.root.children.map((page) => ({ id: page.id, name: page.name, type: page.type })),
    tree
  };
  if (includeHeavyGeometry) {
    manifest.currentPageTree = figma.currentPage.children.map((node) => serializeNode(node, masterBounds, true));
  }

  const fullStepCount = (exportOptions.includeMasterFull ? 1 : 0) + (exportOptions.includeAlignmentPreview ? 1 : 0);
  const pngStepCount = exportOptions.includePngPreview ? 2 : 0;
  const layerStepCount = exportOptions.includeLayerSvg ? context.layers.length : 0;
  const landmarkStepCount = findLayer(context, LANDMARK_LAYER)
    ? (exportOptions.mode === "fast" ? landmarks.length : 1)
    : 0;
  const total = 5 + fullStepCount + pngStepCount + layerStepCount + landmarkStepCount + hashes.size;
  let step = 0;
  progress("保存完整图层树和样式", ++step, total);
  postText("handoff/figma_document.json", JSON.stringify(manifest, null, 2));
  postText("handoff/landmarks.json", JSON.stringify(landmarkManifest, null, 2));

  if (exportOptions.includeMasterFull) {
    progress("导出完整主画框 SVG", ++step, total);
    await attemptFile("export/master_full.svg", "完整地图 SVG 导出", () => exportContext(context, "full", "SVG"), warnings);
  }

  progress("导出网页地图底图 SVG", ++step, total);
  await attemptFile("export/metropolis_map_base.svg", "地图底图 SVG 导出", () => exportContext(context, "map_base", "SVG"), warnings);

  if (exportOptions.includePngPreview) {
    progress("导出网页地图底图 PNG 预览", ++step, total);
    await attemptFile("export/metropolis_map_base.png", "地图底图 PNG 导出", () => exportContext(context, "map_base", "PNG"), warnings);
  }

  progress("导出分区几何 SVG", ++step, total);
  await attemptNamedLayerFile(context, DISTRICT_LAYER, "export/metropolis_district_geometry.svg", "分区几何 SVG 导出", "district_geometry", warnings);

  if (findLayer(context, LANDMARK_LAYER)) {
    if (exportOptions.mode === "fast") {
      if (!landmarks.length) warnings.push(`${LANDMARK_LAYER} 中没有可逐项导出的地标父组。`);
      for (let index = 0; index < landmarks.length; index += 1) {
        const landmark = landmarks[index];
        progress(`逐项导出历史地标 ${index + 1}/${landmarks.length}：${landmark.stableId}`, ++step, total);
        await attemptFile(
          landmark.file,
          `历史地标 ${landmark.stableId} SVG 导出`,
          () => exportLandmarkNode(landmark.node),
          warnings
        );
      }
    } else {
      progress("完整模式：导出历史地标总 SVG", ++step, total);
      await attemptNamedLayerFile(context, LANDMARK_LAYER, "export/metropolis_historical_landmarks.svg", "历史地标总 SVG 导出", "historical_landmarks", warnings);
    }
  }

  progress("导出可购买地块 SVG", ++step, total);
  await attemptNamedLayerFile(context, PLOT_LAYER, "export/metropolis_purchasable_blocks.svg", "可购买地块 SVG 导出", "purchasable_blocks", warnings);

  if (exportOptions.includeAlignmentPreview) {
    progress("导出地图对齐 SVG", ++step, total);
    await attemptFile("export/metropolis_alignment_preview.svg", "地图对齐 SVG 导出", () => exportContext(context, "alignment_preview", "SVG"), warnings);
  }

  if (exportOptions.includePngPreview) {
    progress("导出地图对齐 PNG 预览", ++step, total);
    await attemptFile("export/metropolis_alignment_preview.png", "地图对齐预览 PNG 导出", () => exportContext(context, "alignment_preview", "PNG"), warnings);
  }

  progress("导出独立 Brand", ++step, total);
  const brand = await exportBrand(context, exportOptions.includePngPreview);
  if (brand) {
    if (brand.svg) postFile("export/metropolis_brand_logo.svg", brand.svg);
    if (brand.png) postFile("export/metropolis_brand_logo.png", brand.png);
    warnings.push(...brand.errors);
  }

  if (exportOptions.includeLayerSvg) {
    for (let index = 0; index < context.layers.length; index += 1) {
      const layer = context.layers[index];
      progress(`导出独立图层：${layer.name}`, ++step, total);
      const prefix = String(index).padStart(2, "0");
      await attemptFile(
        `layers/${prefix}_${normalizeName(layer.name)}.svg`,
        `顶层图层 ${layer.name} SVG 导出`,
        () => exportLayerOnMasterCanvas(context, layer),
        warnings
      );
    }
  }

  let imageIndex = 0;
  for (const hash of hashes) {
    progress(`提取主地图原始图片 ${++imageIndex}/${hashes.size}`, ++step, total);
    const image = figma.getImageByHash(hash);
    if (!image) continue;
    try {
      const bytes = await image.getBytesAsync();
      postFile(`images/${hash}.${imageExtension(bytes)}`, bytes);
    } catch (error) {
      warnings.push(`原始图片 ${hash} 提取失败，但交付包继续生成：${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const readme = [
    "Metropolis: Roaring Times — Figma Handoff",
    "",
    `导出时间：${timestamp}`,
    `Figma 文件：${figma.root.name}`,
    `地图画布：${context.name} (${context.width} × ${context.height})`,
    `识别方式：${context.kind === "FRAME" ? "外层 Frame" : "并列顶层图层（虚拟主画框）"}`,
    `导出模式：${exportOptions.mode === "fast" ? "大地图快速交付" : "完整归档交付"}`,
    "",
    exportOptions.mode === "fast"
      ? "handoff/figma_document.json 保存紧凑图层树、父子关系、顺序、位置、尺寸、变换、颜色、填充、描边、效果和文字；精确矢量路径保存在生产 SVG 中。"
      : "handoff/figma_document.json 保存完整重型图层树、父子关系、顺序、位置、尺寸、变换、颜色、填充、描边、效果、文字和矢量路径。",
    "export/ 保存网页制作直接使用的纯底图、分区、可购买地块和 Brand。",
    "handoff/landmarks.json 保存每座历史地标在主画布中的精确位置、变换、子图层关系及对应文件。",
    exportOptions.mode === "fast"
      ? "快速交付把历史地标拆为 landmarks/ 下的一地标一 SVG，并跳过完整主画框、地标总 SVG、对齐合成预览和重复的逐顶层 SVG，以避免超大地图长时间卡住。"
      : "完整归档交付保存历史地标总 SVG，并额外保存完整主画框、对齐预览和位于统一主画框坐标中的逐顶层 SVG。",
    "images/ 只保存当前主地图及独立 Brand 实际引用的原始图片填充，并按图片哈希去重。",
    "",
    "注意：此交付包不能替代 .fig 的版本历史、评论和协作记录；请继续保存本地 .fig 副本。",
    warnings.length ? `\n警告：\n- ${warnings.join("\n- ")}` : "\n检查未产生警告。"
  ].join("\n");
  postText("README_ZH_CN.txt", readme);
  postText("handoff/export_summary.json", JSON.stringify({ exportMode: exportOptions.mode, warnings, imageCount: hashes.size, landmarkCount: landmarks.length, topLayerCount: context.layers.length, sourceKind: context.kind }, null, 2));
  figma.ui.postMessage({ type: "complete", warnings, fileName: `metropolis_handoff_${Date.now()}.zip` });
}

function sendReady() {
  const context = selectedContext();
  figma.ui.postMessage({
    type: "ready",
    master: context ? {
      id: context.id,
      name: context.name,
      width: context.width,
      height: context.height,
      layerCount: context.layers.length,
      sourceKind: context.kind
    } : null,
    selectionCount: figma.currentPage.selection.length
  });
}

figma.on("selectionchange", sendReady);
figma.ui.onmessage = async (message) => {
  if (message.type === "export") {
    try {
      figma.ui.postMessage({ type: "reset" });
      await runExport({
        mode: message.mode,
        includeLayerSvg: message.includeLayerSvg !== false,
        includePngPreview: message.includePngPreview === true
      });
    } catch (error) {
      figma.ui.postMessage({ type: "error", message: error instanceof Error ? error.message : String(error) });
    }
  } else if (message.type === "close") {
    figma.closePlugin();
  }
};

sendReady();

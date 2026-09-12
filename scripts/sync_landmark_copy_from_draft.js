"use strict";

const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const draftPath = path.join(projectRoot, "docs", "LANDMARK_COPY_DRAFT.md");
const runtimePath = path.join(projectRoot, "m0_web", "landmark-content.js");
const shouldWrite = process.argv.includes("--write");

const draft = fs.readFileSync(draftPath, "utf8");
let runtime = fs.readFileSync(runtimePath, "utf8");
const entries = [...draft.matchAll(/- 内容 ID：`([^`]+)`[\s\S]*?- 短介绍：([^\n]+)\n- 长介绍：([^\n]+)/g)]
  .map((match) => ({ id: match[1], short: match[2], long: match[3] }));

if (entries.length !== 52) throw new Error(`Expected 52 landmark draft entries, found ${entries.length}`);

let changed = 0;
for (const entry of entries) {
  const pattern = new RegExp(
    `(${entry.id}: entry\\([\\s\\S]*?\\n\\s+\\{ name: "[^"]*", short: "[^"]*", long: "[^"]*" \\},\\n\\s+\\{ name: "[^"]*", short: )"[^"]*"(, long: )"[^"]*"( \\}\\),)`,
  );
  if (!pattern.test(runtime)) throw new Error(`Could not locate runtime entry: ${entry.id}`);
  runtime = runtime.replace(pattern, (_match, before, between, after) => {
    const short = JSON.stringify(entry.short);
    const long = JSON.stringify(entry.long);
    changed += 1;
    return `${before}${short}${between}${long}${after}`;
  });
}

if (shouldWrite) fs.writeFileSync(runtimePath, runtime);
console.log(`${shouldWrite ? "SYNCED" : "CHECKED"} landmark_copy entries=${entries.length} replacements=${changed}`);

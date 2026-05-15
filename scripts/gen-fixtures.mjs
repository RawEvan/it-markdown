/**
 * Regenerate expected.segments.json, expected.safe.html, and expected.static.html
 * for every fixture under fixtures/cases (each subfolder with input.md). Run `npm run build` first.
 * Also generates expected.unsafe.html (safeMode: false) and expected.ungrouped.html (groupTabs: false)
 * if the case name contains "unsafe" or "ungrouped" respectively.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseImd, renderImdToHtml } from "../dist/index.js";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..", "fixtures", "cases");

function normNl(s) {
  return s.replace(/\r\n/g, "\n");
}

const dirs = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

for (const name of dirs) {
  const dir = join(root, name);
  const inputPath = join(dir, "input.md");
  let input;
  try {
    input = readFileSync(inputPath, "utf8");
  } catch {
    continue;
  }
  const segments = parseImd(input);
  const htmlSafe = renderImdToHtml(input, { safeMode: true, staticOnly: false });
  const htmlStatic = renderImdToHtml(input, { safeMode: true, staticOnly: true });
  writeFileSync(join(dir, "expected.segments.json"), `${JSON.stringify(segments, null, 2)}\n`, "utf8");
  writeFileSync(join(dir, "expected.safe.html"), `${normNl(htmlSafe).trimEnd()}\n`, "utf8");
  writeFileSync(join(dir, "expected.static.html"), `${normNl(htmlStatic).trimEnd()}\n`, "utf8");

  // Generate unsafe mode output for cases with "unsafe" in name
  if (name.toLowerCase().includes("unsafe")) {
    const htmlUnsafe = renderImdToHtml(input, { safeMode: false, staticOnly: false });
    writeFileSync(join(dir, "expected.unsafe.html"), `${normNl(htmlUnsafe).trimEnd()}\n`, "utf8");
  }

  // Generate ungrouped tabs output for cases with "ungroup" in name
  if (name.toLowerCase().includes("ungroup") || name.toLowerCase().includes("tabs-ungrouped")) {
    const htmlUngrouped = renderImdToHtml(input, { safeMode: true, staticOnly: false, groupTabs: false });
    writeFileSync(join(dir, "expected.ungrouped.html"), `${normNl(htmlUngrouped).trimEnd()}\n`, "utf8");
  }

  console.log("wrote", name);
}

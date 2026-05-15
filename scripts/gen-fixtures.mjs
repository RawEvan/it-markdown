/**
 * Regenerate expected.segments.json and expected.safe.html for every fixture
 * under fixtures/cases (each subfolder with input.md). Run `npm run build` first.
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
  const html = renderImdToHtml(input, { safeMode: true, staticOnly: false });
  writeFileSync(join(dir, "expected.segments.json"), `${JSON.stringify(segments, null, 2)}\n`, "utf8");
  writeFileSync(join(dir, "expected.safe.html"), `${normNl(html).trimEnd()}\n`, "utf8");
  console.log("wrote", name);
}

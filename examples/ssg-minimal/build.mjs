import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderImdToHtml } from "it-markdown";

const dir = fileURLToPath(new URL(".", import.meta.url));
const md = readFileSync(join(dir, "input.md"), "utf8");
const html = renderImdToHtml(md, { safeMode: true, staticOnly: false });
writeFileSync(join(dir, "out.html"), `<!DOCTYPE html><meta charset="utf-8"><body>${html}</body>\n`, "utf8");
console.log("wrote", join(dir, "out.html"));

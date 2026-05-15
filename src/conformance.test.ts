import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseImd } from "./parse.js";
import { renderImdToHtml } from "./render.js";

function norm(s: string): string {
  return s.replace(/\r\n/g, "\n").trimEnd();
}

const casesDir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "fixtures", "cases");

describe("conformance fixtures", () => {
  const names = readdirSync(casesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const name of names) {
    const dir = join(casesDir, name);
    const inputPath = join(dir, "input.md");
    const segPath = join(dir, "expected.segments.json");
    const htmlPath = join(dir, "expected.safe.html");
    const staticPath = join(dir, "expected.static.html");
    if (!existsSync(inputPath) || !existsSync(segPath) || !existsSync(htmlPath) || !existsSync(staticPath)) continue;

    it(name, () => {
      const input = readFileSync(inputPath, "utf8");
      const expectedSeg = JSON.parse(readFileSync(segPath, "utf8")) as unknown;
      const expectedHtml = norm(readFileSync(htmlPath, "utf8"));
      const expectedStatic = norm(readFileSync(staticPath, "utf8"));

      expect(parseImd(input)).toEqual(expectedSeg);
      expect(norm(renderImdToHtml(input, { safeMode: true, staticOnly: false }))).toBe(expectedHtml);
      expect(norm(renderImdToHtml(input, { safeMode: true, staticOnly: true }))).toBe(expectedStatic);
    });
  }
});

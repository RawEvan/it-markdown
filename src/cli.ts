#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { renderImdToHtml } from "./render.js";

function usage(): void {
  process.stderr.write(
    "it-markdown — render extended Markdown to HTML\n\nusage:\n  it-markdown <file.md> [--static]\n  it-markdown --help\n\n  --static   emit static-only controls (no native inputs)\n",
  );
}

const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
  usage();
  process.exit(argv.length === 0 ? 1 : 0);
}

const staticHtml = argv.includes("--static");
const files = argv.filter((a) => !a.startsWith("-"));
const file = files[0];
if (!file) {
  usage();
  process.exit(1);
}

const src = readFileSync(file, "utf8");
process.stdout.write(renderImdToHtml(src, { safeMode: true, staticOnly: staticHtml }));

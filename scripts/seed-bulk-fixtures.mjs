/**
 * Create conformance inputs fixtures/cases/09-* … 50-* (42 cases; with 01–08 → 50 total).
 * Run once, then `npm run gen-fixtures`. Skips dirs that already have input.md.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..", "fixtures", "cases");
const pad = (n) => String(n).padStart(2, "0");

const specs = [
  ["link-unknown-widget-type", "[x](!unknown:a=1)\n"],
  ["link-no-attrs-after-colon", "[a](!button:)\n"],
  ["link-dest-without-colon", "[b](!buttononly)\n"],
  ["link-nested-parens-handler", '[c](!button:onClick=alert("a)"))\n'],
  ["link-single-quotes-handler", "[d](!button:onClick=alert('hi'))\n"],
  ["link-slider-defaults", "[s](!slider:)\n"],
  ["link-slider-min-max-only", "[s2](!slider:min=5,max=15)\n"],
  ["link-radio-one-option", "[r](!radio:options=Only,id=r99)\n"],
  ["button-index-0", "[B0](!button:onClick=f_0(0),id=id0)\n"],
  ["button-index-1", "[B1](!button:onClick=f_1(1),id=id1)\n"],
  ["button-index-2", "[B2](!button:onClick=f_2(2),id=id2)\n"],
  ["button-index-3", "[B3](!button:onClick=f_3(3),id=id3)\n"],
  ["button-index-4", "[B4](!button:onClick=f_4(4),id=id4)\n"],
  ["button-index-5", "[B5](!button:onClick=f_5(5),id=id5)\n"],
  ["button-index-6", "[B6](!button:onClick=f_6(6),id=id6)\n"],
  ["button-index-7", "[B7](!button:onClick=f_7(7),id=id7)\n"],
  ["button-index-8", "[B8](!button:onClick=f_8(8),id=id8)\n"],
  ["button-index-9", "[B9](!button:onClick=f_9(9),id=id9)\n"],
  ["button-index-10", "[B10](!button:onClick=f_10(10),id=id10)\n"],
  ["button-index-11", "[B11](!button:onClick=f_11(11),id=id11)\n"],
  ["tab-empty-body", "[!tab:Empty]\n"],
  ["tab-body-with-blank-lines", "[!tab:A]\n\nline\n\n[!tab:B]\n\nb\n"],
  ["collapse-only", "[!collapse:X]\nbody\n"],
  ["collapse-then-tab", "[!collapse:Y]\nYbody\n[!tab:Z]\nZtab\n"],
  ["tab-paragraph-tab", "[!tab:T1]\na\n\nBetween.\n\n[!tab:T2]\nb\n"],
  ["block-then-link", "[!tab:One]\nx\n\n[btn](!button:onClick=x())\n"],
  ["link-then-block", "[x](!slider:value=3)\n\n[!collapse:C]\nc\n"],
  ["two-collapses", "[!collapse:A]\na\n\n[!collapse:B]\nb\n"],
  ["heading-and-list", "# H\n\n- a\n- [b](!button:onClick=z())\n"],
  ["fenced-code-block", "```\n[!tab:fake]\n```\n\n[real](!button:onClick=q())\n"],
  ["blockquote-with-link", "> [q](!button:onClick=q())\n"],
  ["ordered-list", "1. [a](!radio:options=X|Y)\n"],
  ["emphasis-label", "*[L](!button:onClick=e())*\n"],
  ["multiple-links-same-line", "[a](!button:onClick=a())[b](!slider:value=1)\n"],
  ["checkbox-many-pipes", "[c](!checkbox:options=A|B|C|D|,id=cx)\n"],
  ["radio-spaces-around-pipes", "[r](!radio:options= A | B | C ,id=sp)\n"],
  [
    "long-radio-options",
    `[L](!radio:options=${Array.from({ length: 12 }, (_, i) => `O${i}`).join("|")},id=long)\n`,
  ],
  ["slider-large-range", "[L](!slider:min=0,max=999999,value=500,id=lr)\n"],
  ["collapse-with-inner-heading", "[!collapse:H]\n### Inner\n\ntext\n"],
  ["tab-with-list-body", "[!tab:L]\n- one\n- two\n"],
  ["plain-many-newlines", "a\n\n\n\nb\n"],
  ["only-whitespace-lines", "   \n  \n[x](!button:onClick=z())\n"],
  ["slider-edge-values", "[e](!slider:min=0,max=1,value=1,id=edge)\n"],
];

if (specs.length !== 43) {
  throw new Error(`expected 43 specs, got ${specs.length}`);
}

let idx = 9;
for (const [slug, md] of specs) {
  const name = `${pad(idx)}-${slug}`;
  const dir = join(root, name);
  const p = join(dir, "input.md");
  if (!existsSync(p)) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(p, md, "utf8");
    console.log("seed", name);
  }
  idx++;
}

console.log("done; indices 09–51 (43 cases, 51 total with 01–08).");

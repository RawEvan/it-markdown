# it-markdown (iMD)

**iMD (Interactive Markdown)** is Markdown-first content with a small set of extensions for buttons, sliders, choice groups, tabs, and collapses—aimed at AI-era documentation where humans need richer structure and light interactivity without giving up diff-friendly text.

This repository hosts the **reference TypeScript implementation**: a parser, a safe HTML renderer (using [`marked`](https://github.com/markedjs/marked) for standard Markdown), and tests. See [`SPEC.md`](./SPEC.md) for the grammar and rendering contract.

## Quick start

```bash
npm install
npm test
npm run build
```

```ts
import { readFileSync } from "node:fs";
import { renderImdToHtml } from "it-markdown";

const src = readFileSync(new URL("./examples/sample.imd.md", import.meta.url), "utf8");
const html = renderImdToHtml(src, { staticOnly: false, safeMode: true });
console.log(html);
```

## Design stance

- **Markdown remains the source of truth** for narrative text and lists.
- **Extensions are explicit** (`!button`, `!slider`, `[!tab:]`, …) so diffs stay reviewable.
- **Default HTML output is conservative**: user-provided `onClick` strings are not promoted to inline JavaScript; a future runtime can sandbox approved actions only.

## Example

See [`examples/sample.imd.md`](./examples/sample.imd.md).

## License

MIT

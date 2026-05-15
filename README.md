# it-markdown

**it-markdown** is a small TypeScript library that extends **normal Markdown** (`.md`) with optional, review-friendly controls: buttons, sliders, radio/checkbox groups, tabs, and collapses—useful when documentation needs light structure and interactivity without leaving the Markdown ecosystem.

This is **not** a new markup language or file suffix: you keep CommonMark/GFM-compatible sources; extensions use the same files your repo already uses. The library provides a parser and a **safe-by-default** HTML renderer built on [`marked`](https://github.com/markedjs/marked). See [`SPEC.md`](./SPEC.md) for syntax and the HTML contract.

## Quick start

```bash
npm install
npm test
npm run build
```

```ts
import { readFileSync } from "node:fs";
import { renderItMarkdownToHtml } from "it-markdown";

const src = readFileSync(new URL("./examples/sample.md", import.meta.url), "utf8");
const html = renderItMarkdownToHtml(src, { staticOnly: false, safeMode: true });
console.log(html);
```

## Design stance

- **Markdown remains the source of truth** for narrative text and lists.
- **Extensions are explicit** (`!button`, `!slider`, `[!tab:]`, …) so diffs stay reviewable.
- **Default HTML output is conservative**: user-provided `onClick` strings are not promoted to inline JavaScript; a future runtime can sandbox approved actions only.

## Example

See [`examples/sample.md`](./examples/sample.md).

## License

MIT

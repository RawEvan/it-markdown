# it-markdown

**it-markdown** adds a small set of **optional** extensions on top of normal Markdown (`.md`): buttons, sliders, radio/checkbox groups, tabs, and collapses—without a separate file format. The default HTML path is **safe** (no promotion of author `onClick` strings to executable attributes). See [`SPEC.md`](./SPEC.md) for the grammar and HTML contract. **中文简介：** [`README.zh-CN.md`](./README.zh-CN.md)

This repository hosts the **reference TypeScript implementation** (parser + renderer using [`marked`](https://github.com/markedjs/marked)).

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

This library ships as **Node / ESM** (`"type": "module"`). Use it from Node, bundlers, or editor extensions; there is **no published WASM build** yet.

## CLI

After `npm run build`:

```bash
npx it-markdown path/to/doc.md > fragment.html
npx it-markdown path/to/doc.md --static > fragment.static.html
```

## Design stance

- **Markdown remains the source of truth** for narrative text and lists.
- **Extensions are explicit** (`!button`, `!slider`, `[!tab:]`, …) so diffs stay reviewable.
- **Default HTML output is conservative**: user-provided `onClick` strings are not promoted to inline JavaScript; a future runtime can sandbox approved actions only.

## Conformance

- **Spec-Version** and semver rules: see [`SPEC.md`](./SPEC.md).
- **Fixture corpus (51 cases):** [`fixtures/cases/`](./fixtures/cases/) — each case includes `input.md`, `expected.segments.json`, `expected.safe.html`, and `expected.static.html`; `npm test` runs `src/conformance.test.ts`.
- **Regenerate expectations:** `npm run build` then **`npm run gen-fixtures`** (see [`fixtures/README.md`](./fixtures/README.md)).
- **Bulk seed inputs:** `node scripts/seed-bulk-fixtures.mjs` (then `gen-fixtures`).
- **JSON Schema (experimental):** [`schemas/control-destinations.schema.json`](./schemas/control-destinations.schema.json).

## Standardization & governance

- [`docs/standardization.md`](./docs/standardization.md) — CommonMark/GFM and forum path.
- [`docs/security-model.md`](./docs/security-model.md) — default safe rendering model.
- [`docs/extension-process.md`](./docs/extension-process.md) — how to propose new controls.
- [`docs/github-actions.md`](./docs/github-actions.md) — CI and reusable render workflow.
- [`docs/ai-authoring.md`](./docs/ai-authoring.md) — LLM / author hints aligned with fixtures.
- [`docs/github-pages-playground.md`](./docs/github-pages-playground.md) — optional static hosting for the playground.
- [`docs/roadmap-github-projects.md`](./docs/roadmap-github-projects.md) — suggested GitHub Project columns.

## Examples & tooling

- **Playground (Vite):** [`examples/playground/`](./examples/playground/)
- **Minimal SSG-style build:** [`examples/ssg-minimal/`](./examples/ssg-minimal/)
- **VS Code skeleton:** [`editors/vscode-it-markdown/`](./editors/vscode-it-markdown/)

## Example

See [`examples/sample.imd.md`](./examples/sample.imd.md).

## License

MIT

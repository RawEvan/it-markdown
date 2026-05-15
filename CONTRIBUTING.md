# Contributing

Thanks for helping improve **it-markdown**.

## Development

- Node.js 20+ (CI uses Node 22).
- `npm ci` — install dependencies.
- `npm test` — unit tests plus **conformance** fixtures (must pass before merging).
- `npm run build` — compile TypeScript to `dist/`.

## Changing the parser or HTML output

1. Edit `src/parse.ts` or `src/render.ts` (and unit tests under `src/*.test.ts` as needed).
2. Run `npm run build` then **`npm run gen-fixtures`** to refresh `fixtures/cases/*/expected.*`.
3. Review diffs in `expected.segments.json`, `expected.safe.html`, and `expected.static.html`; commit them with your code change.
4. If grammar or contracts change incompatibly, bump **Spec-Version** and the version map in `SPEC.md`, and add a **CHANGELOG** entry under `[Unreleased]` or the next semver section.

## New conformance cases

Add `fixtures/cases/<nn-name>/input.md`, run `npm run gen-fixtures`, and commit the generated expectations. Prefer small, focused examples (one behavior per fixture when possible).

## Conformance and releases

- After parser/renderer changes, run `npm run gen-fixtures` and commit `fixtures/cases/*/expected.*`.
- To recreate bulk `09`–`51` **inputs** only, run `npm run seed-fixtures` (then `gen-fixtures` if expectations are missing).
- See [`docs/github-actions.md`](./github-actions.md) for CI and reusable render workflows.

## Playground, SSG example, VS Code

- [`examples/playground/`](../examples/playground/) — Vite dev server.
- [`examples/ssg-minimal/`](../examples/ssg-minimal/) — one-file Node render.
- [`editors/vscode-it-markdown/`](../editors/vscode-it-markdown/) — Webview preview command (local dev).

## Pull requests

- Keep commits scoped; include tests and updated fixtures when behavior changes.
- Do not commit secrets or large generated assets unrelated to the change.

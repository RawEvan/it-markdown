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
3. Review diffs in `expected.segments.json` and `expected.safe.html`; commit them with your code change.
4. If grammar or contracts change incompatibly, bump **Spec-Version** and the version map in `SPEC.md`, and add a **CHANGELOG** entry under `[Unreleased]` or the next semver section.

## New conformance cases

Add `fixtures/cases/<nn-name>/input.md`, run `npm run gen-fixtures`, and commit the generated expectations. Prefer small, focused examples (one behavior per fixture when possible).

## Pull requests

- Keep commits scoped; include tests and updated fixtures when behavior changes.
- Do not commit secrets or large generated assets unrelated to the change.

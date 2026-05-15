# Conformance fixtures

Each subdirectory of `cases/` with an `input.md` file is one fixture. Checked-in expectations:

- `expected.segments.json` — output of `parseImd(input)` (JSON-serializable segment list).
- `expected.safe.html` — output of `renderImdToHtml(input, { safeMode: true, staticOnly: false })`, newlines normalized to `\n`.

## Regenerating expectations

After changing the parser or renderer, rebuild and run:

```bash
npm run build
npm run gen-fixtures
```

Commit updated `expected.*` files together with the code change.

## Growing the corpus

Add a new folder under `cases/` with `input.md`, then run `gen-fixtures`. Long term, aim for dozens of cases (edge cases for link destinations, nested parentheses, block boundaries, and render variants such as `staticOnly: true`).

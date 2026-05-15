# Conformance fixtures

Each subdirectory of `cases/` with an `input.md` file is one fixture. Checked-in expectations:

- `expected.segments.json` — output of `parseImd(input)` (JSON-serializable segment list).
- `expected.safe.html` — `renderImdToHtml(input, { safeMode: true, staticOnly: false })`, newlines normalized to `\n`.
- `expected.static.html` — `renderImdToHtml(input, { safeMode: true, staticOnly: true })`.

**Current corpus size:** 51 cases (`01`–`08` curated, `09`–`51` bulk-seeded for parser/renderer regression).

## Regenerating expectations

After changing the parser or renderer, rebuild and run:

```bash
npm run build
npm run gen-fixtures
```

Commit updated `expected.*` files together with the code change.

## Seeding bulk cases

To recreate empty `09`–`51` inputs from the generator script (skips existing `input.md`):

```bash
node scripts/seed-bulk-fixtures.mjs
```

## Growing the corpus

Add a new folder under `cases/` with `input.md`, run `npm run gen-fixtures`, and commit. Prefer small, focused examples.

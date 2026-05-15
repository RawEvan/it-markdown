# Extension process (new controls)

This project extends **Markdown in-band** (`!type:` link destinations and `[!tab:]` / `[!collapse:]` blocks). Adding a new control is a **spec + conformance + renderer** change, not a fork of Markdown.

## Checklist for a new `!type:` or block directive

1. **Design** — one paragraph in `SPEC.md`: syntax, attributes, fallback in non-supporting renderers.
2. **Parser** — extend `parse.ts` / `parse-attrs.ts` with tests in `src/*.test.ts`.
3. **Renderer** — extend `render.ts` (safe and `staticOnly` paths).
4. **Conformance** — add `fixtures/cases/<next>-<slug>/input.md`, run `npm run gen-fixtures`, commit `expected.*`.
5. **Schema** — update `schemas/control-destinations.schema.json` (or add a sibling schema) if the destination grammar changes.
6. **CHANGELOG** — note under `[Unreleased]` with semver impact (minor if additive and backward compatible for existing docs).

## Naming

- Link-style controls live under `!` + lowercase type + `:` + comma-separated `key=value`.
- Block directives use `[!name:` + title + `]` on their own line (leading whitespace allowed).

Avoid generic types that collide with future URL schemes or GFM features.

## Versioning

- **Spec-Version** (in `SPEC.md`) bumps when grammar or default HTML contract for existing constructs changes incompatibly.
- **npm semver** follows public TypeScript API changes.

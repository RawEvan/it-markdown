# Changelog

All notable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] — 2026-05-15

### Added

- **Conformance corpus** under `fixtures/cases/` with `input.md`, `expected.segments.json`, and `expected.safe.html`; CI-enforced via `src/conformance.test.ts`.
- **`npm run gen-fixtures`** (`scripts/gen-fixtures.mjs`) to regenerate expectations after parser/renderer changes.
- **Spec-Version `0.2`** section and version map in `SPEC.md`; CommonMark interaction notes.
- **`schemas/control-destinations.schema.json`** as a machine-readable sketch for link-style `!type:` destinations.
- **`docs/standardization.md`** — how this work relates to CommonMark/GFM and future forum proposals.
- **`CONTRIBUTING.md`** and **`SECURITY.md`** community baselines.

## [0.1.0] — initial release

- Reference parser (`parseImd`), safe HTML renderer (`renderImdToHtml`), Vitest unit tests, and `SPEC.md`.

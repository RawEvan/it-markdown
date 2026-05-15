# AI authoring hints

Use these snippets when you want an LLM to emit documents that match this repository’s **conformance** corpus (`fixtures/cases/`).

## System-style constraints (example)

You are writing Markdown with optional **it-markdown** extensions only:

- Interactive link syntax: `[label](!button:onClick=...)`, `!slider:`, `!radio:options=A|B`, `!checkbox:options=...`.
- Block tabs: a line `[!tab:Title]` then body until the next `[!tab:` or `[!collapse:`.
- Collapse: `[!collapse:Title]` then body until a line starting with `[!`.
- Do **not** invent new `!types`. Do **not** wrap extensions in HTML or JSX.
- Prefer short handler expressions in buttons; avoid unbalanced parentheses inside `(...)` destinations.

## Fixture-driven checks

After generating a long document, run the project’s tests locally or compare against `expected.*` for a similar fixture under `fixtures/cases/`.

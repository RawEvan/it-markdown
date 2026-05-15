# Security model (reference renderer)

This document summarizes how **it-markdown** treats untrusted Markdown by default. It complements [`SECURITY.md`](../SECURITY.md) for reporters.

## Server-side / build-time

- **`renderImdToHtml` with `safeMode: true` (default)** does **not** emit executable `onclick` attributes from document sources. Declared handlers are surfaced as **`data-imd-unsafe-handler`** (or similar hook attributes) for auditing and for a future sandboxed client runtime.
- **No network, storage, or DOM APIs** are invoked by the library: output is a static HTML string.
- **`staticOnly: true`** emits non-interactive placeholders (no native `<input>` / `<button>` behaviour beyond static markup).

## Client-side (future)

If you attach a runtime that reads `data-imd-*` and executes strings:

- Treat handler strings as **untrusted** unless produced by a trusted pipeline.
- Prefer a **whitelist** of callable symbols and a hardened sandbox (no `eval` of raw source).
- Keep **CSP** headers strict on pages that embed user-authored documents.

## Comparison to MDX

Unlike MDX, documents do not embed arbitrary JSX/JS. The extension surface is a **fixed widget vocabulary** (`button`, `slider`, `radio`, `checkbox`, tabs, collapse), which keeps review and automated scanning tractable.

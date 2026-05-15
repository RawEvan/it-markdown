# iMD (Interactive Markdown) specification

This repository implements **iMD**, a Markdown-first format with minimal extensions for common interactive controls, designed for AI-assisted authoring, readable diffs, and safe rendering.

## Goals

1. **AI-friendly**: small grammar, predictable tokens, easy for models to emit.
2. **Human-friendly**: clearer structure than raw HTML for many docs, with optional interactivity.
3. **Collaboration-friendly**: extensions stay on their own lines or in compact link forms.
4. **Safety-first**: arbitrary JavaScript is not executed by the default HTML renderer.

## Backward compatibility

Any CommonMark-compatible Markdown remains valid. Non-iMD renderers ignore unknown link destinations and show block directives as plain text until a dedicated renderer is used.

## Filenames and ecosystem fit

**Canonical sources use normal Markdown filenames** (typically `.md`, sometimes `.markdown`). There is no separate “iMD file extension” in this initiative: a document is still Markdown on disk and in version control; optional `!…` syntax is an **in-band extension** of that Markdown.

Using `.md` keeps diffs, code review, GitHub/GitLab previews, zip exports, and LLM tooling aligned with how the industry already treats documentation. Parsers, VS Code extensions, and CI actions should key off content (and optional front matter or config), not a bespoke suffix—so the same path toward **standardization** (e.g. CommonMark extension proposals) stays credible.

## Link-style controls

Syntax: `[label](!type:key=value,key2=value2)`

Supported `type` values:

### `button`

```
[label](!button:onClick=alert("Hello"))
```

The reference renderer does **not** wire `onClick` as executable JavaScript when `safeMode` is enabled (default). Instead it exposes the raw handler string via `data-imd-unsafe-handler` for auditing and for a future sandboxed runtime.

### `slider`

```
[label](!slider:min=0,max=100,value=50,id=num1)
```

### `radio`

Pipe-separated options:

```
[label](!radio:options=Python|JavaScript|Go,id=lang)
```

### `checkbox`

```
[label](!checkbox:options=HTML|CSS|JavaScript,id=skills)
```

## Block directives

### Tabs

Each tab starts on its own line. Content runs until the next `[!tab:` or `[!collapse:` line.

```
[!tab:标题1]
First panel body (Markdown)

[!tab:标题2]
Second panel body
```

Consecutive tab blocks are rendered as a single tab group.

### Collapse

```
[!collapse:点击展开]
Collapsed body (Markdown)
```

Body runs until the next line that begins with `[!` (after optional whitespace).

## HTML output contract

- Root wrapper: `<article class="imd-root" data-imd="1">…</article>` (class overridable).
- Controls expose `data-imd-control` with values `button`, `slider`, `radio`, `checkbox`, `tabs`, `collapse`.
- `staticOnly: true` renders non-interactive fallbacks for environments without JavaScript.

## Roadmap (from the design doc)

**Phase 1 (this repo):** parser + safe HTML fragment renderer + tests.

**Phase 2:** optional client runtime (tab switching without native `<details>` gaps, export-to-AI bridge), editor integrations.

**Phase 3:** hosted playground, richer component vocabulary, export pipelines.

## References

The original motivation document in this initiative contrasts Markdown token efficiency and diff clarity with HTML’s layout and interactivity affordances, and argues for a bounded extension layer rather than unconstrained HTML in long-lived repositories.

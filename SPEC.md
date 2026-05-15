# it-markdown — Markdown interactive extensions

This repository specifies and implements **small, in-band extensions to CommonMark-compatible Markdown** for common interactive controls (buttons, sliders, choice groups, tabs, collapses). It is not a separate document format: sources stay ordinary `.md` files; unknown destinations remain valid Markdown links in generic previews.

## Goals

1. **AI-friendly**: small grammar, predictable tokens, easy for models to emit.
2. **Human-friendly**: clearer structure than raw HTML for many docs, with optional interactivity.
3. **Collaboration-friendly**: extensions stay on their own lines or in compact link forms.
4. **Safety-first**: arbitrary JavaScript is not executed by the default HTML renderer.

## Backward compatibility

Any CommonMark-compatible Markdown remains valid. Generic Markdown renderers ignore unknown link destinations and show block directives as plain text until a renderer that understands these extensions is used.

## Filenames and ecosystem fit

**Canonical sources use normal Markdown filenames** (typically `.md`, sometimes `.markdown`). Optional `!…` syntax is an **in-band extension** of that Markdown so Git, code review, and editor tooling behave as they already do for Markdown repositories.

## Link-style controls

Syntax: `[label](!type:key=value,key2=value2)`

Supported `type` values:

### `button`

```
[label](!button:onClick=alert("Hello"))
[label](!button:action=alert("Hello"))
```

The reference renderer does **not** wire `onClick` as executable JavaScript when `safeMode` is enabled (default). It exposes the raw handler string via `data-itm-unsafe-handler` for auditing and for a future sandboxed runtime. If both `onClick` and `action` appear (after key normalization), `onclick` wins.

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

Consecutive tab blocks are rendered as a single tab group unless `renderItMarkdownToHtml(…, { groupTabs: false })` is set.

### Collapse

```
[!collapse:点击展开]
Collapsed body (Markdown)
```

Body runs until the next line that begins with `[!` (after optional whitespace).

## HTML output contract

- Root wrapper: `<article class="itm-root" data-itm="1">…</article>` (class overridable via `className`).
- Controls expose `data-itm-control` with values `button`, `slider`, `radio`, `checkbox`, `tabs`, `collapse`.
- `staticOnly: true` renders non-interactive fallbacks for environments without JavaScript.

The `itm-` prefix and `data-itm-*` attributes are the **HTML hook namespace** for this library (`it-markdown`), not a separate file type.

## Roadmap (summary)

**Phase 1 (this repo):** parser + safe HTML fragment renderer + tests.

**Phase 2:** optional client runtime, editor integrations.

**Phase 3:** hosted playground, richer component vocabulary, export pipelines.

## References

Markdown token efficiency and diff clarity matter for long-lived repositories; these extensions stay deliberately bounded compared to unconstrained HTML or executable JSX in documentation sources.

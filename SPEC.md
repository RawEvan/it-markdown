# iMD (Interactive Markdown) specification

This repository implements **iMD**, a Markdown-first format with minimal extensions for common interactive controls. The design favors **progressive extension of Markdown** (not a replacement format) so existing tools, diffs, and LLM training on Markdown remain first-class.

## Design principles

1. **Backward compatible**: any CommonMark/GFM document is valid iMD. Tools without iMD show link-style extensions as ordinary links (or omit unknown schemes); block directives appear as plain text lines until an iMD-aware renderer runs.
2. **Minimal tokens**: prefer `[label](!type:…)` and single-line `![!tab:]` / `[!collapse:]` markers so models and humans share a small grammar.
3. **Bounded behavior**: the default HTML renderer does **not** execute arbitrary JavaScript from sources; handlers are exposed only as inert `data-*` metadata unless explicitly opted out.
4. **Separation of concerns**: extensions describe **semantics** (`button`, `slider`, …). Presentation belongs in external CSS targeting emitted classes and `data-imd-control` attributes.

## Formal grammar (informal EBNF)

### Link-style controls

```txt
imdLink ::= "[" label "]" "(" imdDestination ")"
label   ::= CommonMark link text (no unescaped `]` in the simple case)
imdDestination ::= "!" type ":" attrList
type    ::= "button" | "slider" | "radio" | "checkbox"
attrList ::= attrPair ( "," attrPair )*
attrPair ::= key "=" value
key     ::= run of non-"=" / non-"," characters (trimmed; case-insensitive keys)
value   ::= run that may contain "|" (pipes) but not unescaped "," at top level
```

**Closing parenthesis**: the reference implementation scans the destination with the same bracketing rules as CommonMark **autolink disambiguation**—nested `()` inside `alert("…")` and quoted spans are respected so a single inline link can contain parentheses in attribute values.

**Keys**: parsed keys are normalized to lower-case. For `button`, `onClick` and `action` both map to the same handler string (`onClickRaw` in the AST). If both are present, `onclick` (after normalization) takes precedence over `action`.

### Block directives

```txt
tabLine      ::= *WSP "[!tab:" title "]" *WSP newline
collapseLine ::= *WSP "[!collapse:" title "]" *WSP newline
title        ::= any run not containing unescaped `]` as line terminator
```

- **Tab body**: from the line after `tabLine` until the next line whose trimmed form matches `tabLine` or `collapseLine` (leading whitespace allowed before `[!`).
- **Collapse body**: same rule, but any line whose trimmed form starts with `[!` ends the body (not only tab/collapse), reserving the `![!` prefix family for future directives.

### Tab grouping (rendering)

Parsing emits **one widget per** `[!tab:]`. Rendering merges **consecutive** `tab` widgets into a single `<div class="imd-tabs">` unless `renderImdToHtml(…, { groupTabs: false })` is set.

## Link-style controls (reference)

Syntax: `[label](!type:key=value,key2=value2)`

### `button`

```
[label](!button:onClick=alert("Hello"))
[label](!button:action=alert("Hello"))
```

The HTML renderer in **safe mode** (default) does not emit executable `onclick`. It may emit `data-imd-unsafe-handler="…"` for auditing and for a future sandboxed runtime.

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

```
[!tab:标题1]
First panel body (Markdown)

[!tab:标题2]
Second panel body
```

### Collapse

```
[!collapse:点击展开]
Collapsed body (Markdown)
```

## HTML output contract

- Root wrapper: `<article class="imd-root" data-imd="1">…</article>` (class overridable via `className`).
- Controls expose `data-imd-control` with values `button`, `slider`, `radio`, `checkbox`, `tabs`, `collapse`.
- `staticOnly: true` renders non-interactive fallbacks for environments without JavaScript.

## Parser architecture in this repo

1. **Block scan**: walk lines; on `[!tab:]` / `[!collapse:]`, cut out a widget with a Markdown body string.
2. **Inline scan**: for each Markdown fragment, find `[…](…)` spans and interpret destinations starting with `!` as iMD when the `type` is known.
3. **Markdown**: remaining text is passed to **`marked`** (v15) for HTML.

### Micromark / CommonMark note

A small **micromark** probe ships in development (`src/micromark-prototype.ts`, excluded from the published `dist/` bundle). Core micromark does **not** fully preserve some `!type:attr` destinations the way `marked` does, because generic CommonMark link destination rules interact with colon and `<!` sequences. That is expected: a future **micromark extension** would tokenize `imdLink` **before** the generic link tokenizer, mirroring what this preprocessor already does. Until then, treat this repo’s lexer as the normative iMD behavior for `!type:…` strings.

## Security model (reference renderer)

- No arbitrary JS execution in the default HTML path.
- No network, DOM mutation, or storage APIs from the server-side renderer (there is no runtime).
- A future client sandbox may allow only whitelisted “export to AI” bridges as described in the initiative roadmap.

## Roadmap (summary)

**Phase 1 (this repo):** parser + safe HTML fragment renderer + tests.

**Phase 2:** optional client runtime (tab switching polish, export-to-AI bridge), editor integrations.

**Phase 3:** hosted playground, richer component vocabulary, export pipelines, standards outreach.

**Long term:** iMD-style documents can evolve toward richer **agent state** formats (capturing intermediate results and collaboration metadata) while keeping the same Markdown-first baseline.

## References

The initiative’s strategy document argues for **extending Markdown** instead of inventing a parallel format: ecosystem gravity, LLM familiarity, and diff/review ergonomics dominate “perfect” bespoke grammars. iMD deliberately avoids unconstrained MDX-style JSX for those reasons.

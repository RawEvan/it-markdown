# CommonMark Forum Post Draft

**Note**: This is a draft for a potential CommonMark forum post. Requires review before posting.

---

**Subject: Proposal: Link-style Interactive Extensions for Markdown**

## Summary

I'd like to propose a lightweight extension mechanism for Markdown that enables
interactive widgets (buttons, sliders, tabs) without requiring a new file format
or dedicated parser. The syntax uses familiar link destination patterns:
`[label](!type:attrs)`.

## Motivation

Standard Markdown lacks native support for interactive elements. Authors resort to:

- Raw HTML (security concerns, poor portability)
- Custom parsers (fragmentation, no tooling)
- JavaScript embeds (maintenance burden, security)

A link-based extension syntax offers:

1. **Familiarity** — Uses existing link notation `[]()`
2. **Toolability** — Grammars, previews, and LSP support via standard mechanisms
3. **Composability** — Can layer on any CommonMark implementation
4. **Opt-in** — Normal links remain unchanged

## Proposed Syntax

### Link-style Controls

```
[Click me](!button:onclick='console.log("hi")')
[Volume](!slider:min=0,max=100,value=50)
[Choose theme](!radio:name=theme,options='Light,Dark')
[Features](!checkbox:name=f,options='A,B,C')
```

### Block Directives

```
[!tab:Tab One]
Content for tab one.

[!tab:Tab Two]
Content for tab two.

[!collapse:Details]
Click to reveal more content.
```

## Design Principles

1. **No new syntax** — Uses existing `[]()` link notation
2. **Prefix `!`** — Avoids collision with regular URLs
3. **Simple attributes** — `key=value` or `key='quoted value'`
4. **Composable** — Works alongside standard CommonMark
5. **Safe by default** — Reference implementation sanitizes JavaScript

## Implementation Status

Reference implementation at [github.com/RawEvan/it-markdown](https://github.com/RawEvan/it-markdown):

- Parser produces semantic AST with widget nodes
- Renderer generates accessible HTML with `data-*` hooks
- 56 conformance test cases
- VS Code extension with syntax highlighting
- VitePress integration example

## Open Questions

1. Should `!type:attrs` be normalized before or after link parsing?
2. What is the minimal safe subset for untrusted content?
3. How should extensions interact with existing link destination parsing?

## References

- [Spec draft](https://github.com/RawEvan/it-markdown/blob/main/SPEC.md)
- [micromark extension spike](https://github.com/RawEvan/it-markdown/blob/main/src/micromark-itmarkdown.ts)
- [Conformance fixtures](https://github.com/RawEvan/it-markdown/tree/main/fixtures/cases)

---

*Feedback welcome — especially on syntax collision concerns and safety model.*

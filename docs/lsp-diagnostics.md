# Research: Optional LSP / Diagnostics

**Date**: 2026-05-15
**Status**: Research — Spike direction

## Goal

Optional Language Server for `!`-extensions: unknown `!type`, missing required attrs,
unclosed block bodies — without reimplementing full Markdown parse.

## Use Cases

1. **Unknown widget type warnings** — `[Foo](!unknowntype:...)` shows "unknown widget type"
2. **Missing required attributes** — `[x](!button)` without `onclick` shows warning
3. **Unclosed block bodies** — `[!tab:Title]` without closing `]`
4. **Deprecated syntax** — `[x](!button:id=x,onclick=y)` vs `[x](!button:onclick=y,id=x)`

## Options

### Option A: VS Code Extension Diagnostics (Recommended for MVP)

**Pros**:
- Already have VS Code extension infrastructure
- Simple to implement using TextMate grammar + regex
- No separate LSP server needed
- Can use VS Code's built-in `Diagnostic` API

**Cons**:
- VS Code only (not other editors)

**Implementation sketch**:
```typescript
// In VS Code extension
const diagPattern = /\[([^\]]*)\]\(!(\w+)(:[^)]*)?\)/g;
const unknownTypes = new Set(["button", "slider", "radio", "checkbox", "tab", "collapse", "color"]);

function checkDiagnostics(doc: vscode.TextDocument) {
  const diagnostics: vscode.Diagnostic[] = [];
  let match;
  while ((match = diagPattern.exec(doc.getText())) !== null) {
    const type = match[2];
    if (!unknownTypes.has(type)) {
      const range = new vscode.Range(
        doc.positionAt(match.index + match[0].length - type.length - 1),
        doc.positionAt(match.index + match[0].length - 1)
      );
      diagnostics.push({
        message: `Unknown widget type '${type}'`,
        range,
        severity: vscode.DiagnosticSeverity.Warning,
      });
    }
  }
  vscode.languages.setDiagnostics(uri, diagnostics);
}
```

### Option B: Full LSP Server

**Pros**:
- Editor-agnostic (VS Code, Neovim, Emacs, etc.)
- Industry standard

**Cons**:
- Significant complexity
- Requires managing server lifecycle
- More boilerplate

**Stack**:
- `vscode-languageserver` + `vscode-languageserver-node`
- `unified` / `remark` for parsing (reuse existing ecosystem)

### Option C: Language Server + Client

**Pros**:
- Clean separation of concerns
- Can be tested independently

**Cons**:
- Most complex option
- Overkill for simple diagnostics

## Decision

**Recommendation**: Option A — VS Code Extension Diagnostics

Rationale:
1. Low complexity for immediate value
2. Leverages existing VS Code extension
3. Can prototype quickly
4. Full LSP can be explored later if needed

## Diagnostics to Implement (MVP)

1. **Unknown widget type** — Warning for types not in allowlist
2. **Missing `onclick` on button** — Warning (buttons need handlers)
3. **Empty `options` on radio/checkbox** — Error

## Diagnostics to Skip (Future)

1. **Style warnings** (attribute ordering)
2. **Deprecated syntax** (require major version bump)
3. **Complex validation** (requires full parse)

## References

- [VS Code Diagnostic API](https://code.visualstudio.com/api/references/vscode-api#Diagnostic)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
- [vscode-languageserver](https://www.npmjs.com/package/vscode-languageserver)

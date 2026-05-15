# VS Code Extension — it-markdown

Adds **syntax highlighting** and **preview** for interactive Markdown widgets: `!button`, `!slider`, `!radio`, `!checkbox`, `!tab`, and `!collapse`.

## Features

- **Syntax highlighting** for `](!type:)` link destinations and `[!tab:]` / `[!collapse:]` block directives
- **Safe HTML preview** command with VS Code theme integration
- **Configurable**: toggle `safeMode`, `staticOnly`, and `groupTabs` via settings
- **Command palette** integration with quick toggles

## Getting Started

1. Install the extension from the VS Code Marketplace
2. Open any Markdown (`.md`) file
3. Run **Markdown: Preview HTML (it-markdown)** from the command palette
4. Widget syntax highlights automatically

## Commands

| Command | Keybinding |
|---------|------------|
| `it-markdown.previewHtml` | Open it-markdown HTML preview |
| `it-markdown.toggleStaticOnly` | Toggle static-only rendering |

## Configuration

```json
{
  "itMarkdown.safeMode": true,
  "itMarkdown.staticOnly": false,
  "itMarkdown.groupTabs": true,
  "itMarkdown.enableSyntaxHighlighting": true
}
```

## Syntax Highlighting

The extension injects TextMate grammar into the built-in Markdown language:

- `!(button|slider|radio|checkbox|color):` — widget type tokens
- Quoted attribute values — string highlighting
- `[!tab:Label]` — block directive highlighting

## Publishing (Maintainers)

```bash
cd editors/vscode-it-markdown
npm install
npm run package          # creates .vsix
npm run publish          # publishes to Marketplace (requires PAT)
```

Or generate a PNG icon first:

```bash
# requires: npm install -g sharp-cli
sharp -i assets/icon.svg -o assets/icon.png resize 256 256
```

## License

MIT — see repository root.

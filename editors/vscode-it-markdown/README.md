# VS Code — it-markdown (local dev)

This folder is a **minimal** VS Code extension that opens a Webview with **safe** HTML from `renderImdToHtml`.

## Setup

From the repository root:

```bash
npm ci
npm run build
cd editors/vscode-it-markdown
npm install
```

Then in VS Code: **Run and Debug** → “Launch Extension” (add a `.vscode/launch.json` in the repo if you do not have one yet) with `extensionDevelopmentPath` pointing to `editors/vscode-it-markdown`.

## Command

- **Markdown: Preview HTML (it-markdown)** — `it-markdown.previewHtml`

## Publishing

This package is `private` and intended for development. For the marketplace you would pick a real `publisher`, add icons, TextMate grammar injection for `](!…)` / `[!tab:`, and bundle assets with `vsce`.

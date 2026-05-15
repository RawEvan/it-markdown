# VitePress + it-markdown Example

A complete integration of it-markdown interactive widgets with VitePress.

## Getting Started

```bash
cd examples/vitepress
npm install
npm run dev
```

## What's Included

- **Homepage** — Hero section with embedded widgets
- **Widget Gallery** — All widget types demonstrated
- **Integration Guide** — Setup instructions and API reference
- **Theme CSS** — Dark/light mode aware widget styling

## Project Structure

```
docs/
├── .vitepress/
│   ├── config.ts          # VitePress config + it-markdown hook
│   └── theme/
│       ├── index.ts       # Theme entry
│       └── style.css      # Widget styles
├── index.md               # Homepage
├── widgets.md             # Widget gallery
└── guide.md               # Integration guide
```

## Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Build static site
npm run preview  # Preview built site
```

## How It Works

The integration uses VitePress's `markdown.config` hook to preprocess
Markdown with `renderImdToHtml` before VitePress's default renderer
applies its own transformations. This preserves all standard Markdown
features while adding interactive widgets.

```
Markdown source → renderImdToHtml → VitePress markdown-it → HTML
```

## Customization

Modify `docs/.vitepress/config.ts` to change rendering options:

```typescript
renderImdToHtml(src, {
  safeMode: true,      // Set to false for trusted content only
  staticOnly: false,   // Set to true for no-JS rendering
  groupTabs: true,     // Set to false for separate tab blocks
});
```

## License

MIT

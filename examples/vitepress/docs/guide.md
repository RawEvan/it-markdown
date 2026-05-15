# Integration Guide

How to add it-markdown to your VitePress site.

## Setup

### 1. Install Dependencies

```bash
npm install it-markdown vitepress
```

### 2. Configure VitePress

Update your `.vitepress/config.ts`:

```typescript
import { defineConfig } from "vitepress";
import { renderImdToHtml } from "it-markdown";

export default defineConfig({
  markdown: {
    config: (md) => {
      const originalRender = md.render.bind(md);
      md.render = (src, env) => {
        const itHtml = renderImdToHtml(src, {
          safeMode: true,
          staticOnly: false,
          groupTabs: true,
        });
        return originalRender(itHtml, env);
      };
    },
  },
});
```

### 3. Add CSS Styling

Create `.vitepress/theme/style.css`:

```css
.itm-button { /* ... */ }
.itm-slider { /* ... */ }
.itm-tabs { /* ... */ }
.itm-collapse { /* ... */ }
```

## Alternative Integration

If you want more control, use a Vite plugin instead:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { renderImdToHtml } from "it-markdown";

export default defineConfig({
  plugins: [
    {
      name: "vite-plugin-it-markdown",
      transform(code, id) {
        if (id.endsWith(".md")) {
          return renderImdToHtml(code, { safeMode: true });
        }
      },
    },
  ],
});
```

## Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `safeMode` | `boolean` | `true` | Sanitize JavaScript handlers. Disable at your own risk. |
| `staticOnly` | `boolean` | `false` | Render static HTML without interactive scripts. |
| `groupTabs` | `boolean` | `true` | Group consecutive `[!tab:]` blocks into a single tab control. |

## Deployment

VitePress + it-markdown works with all static hosts:

- **GitHub Pages** — Works with GitHub Actions
- **Vercel** — Zero config deployment
- **Netlify** — Build and deploy in seconds
- **Cloudflare Pages** — Fast edge deployment

## Troubleshooting

### Widgets don't appear?

1. Check that `markdown.config` hook is properly set up
2. Verify CSS is imported in your theme
3. Make sure markdown files use the correct syntax: `[Label](!type:attrs)`

### Tabs are not grouped?

Set `groupTabs: true` — this is the default, but if you override options, make sure it's included.

### Security concerns?

Always keep `safeMode: true` for user-generated content. The sanitizer strips:

- `javascript:` URLs
- `eval()` and `new Function()`
- Inline event handlers not in the allowlist
- Potentially dangerous HTML tags

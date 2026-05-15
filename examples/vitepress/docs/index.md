---
layout: home

hero:
  name: it-markdown
  text: Interactive Markdown Widgets
  tagline: Button, slider, tabs, and more — inside your Markdown docs
  actions:
    - theme: brand
      text: Widget Gallery
      link: /widgets
    - theme: alt
      text: Integration Guide
      link: /guide
---

## What is it-markdown?

it-markdown lets you add interactive widgets to your Markdown documents using a simple link-based syntax:

[Click me](!button:onclick='console.log(\"Hello!\")')

[Volume](!slider:min=0,max=100,value=50)

[!tab:Features]

- **Safe by default** — all JavaScript is sanitized and sandboxed
- **No build lock-in** — works with any SSG that accepts custom markdown renderers
- **Lightweight** — zero runtime dependencies
- **CommonMark compatible** — standard markdown remains unchanged

[!tab:Quick Start]

Install and use in seconds:

```bash
npm install it-markdown
```

```javascript
import { renderImdToHtml } from "it-markdown";

const html = renderImdToHtml(markdown, { safeMode: true });
```

[!collapse:Advanced Options]

| Option | Default | Purpose |
|--------|---------|---------|
| `safeMode` | `true` | Sanitize JavaScript handlers |
| `staticOnly` | `false` | Render without interactive scripts |
| `groupTabs` | `true` | Merge consecutive tab blocks |


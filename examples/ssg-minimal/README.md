# Minimal static HTML build

This example turns a single `input.md` into `out.html` using the published API shape (`renderImdToHtml`). It is not tied to VitePress, Docusaurus, or Astro — only plain Node — but the same call fits into any SSG `transform` hook.

## Run

From repository root:

```bash
npm ci
npm run build
cd examples/ssg-minimal
npm install
npm run build
```

Open `out.html` in a browser (wrap with your own CSS).

# GitHub Actions — render Markdown to HTML

This repository ships:

1. **`.github/workflows/ci.yml`** — runs `npm ci`, `npm test`, and `npm run build` on pushes and PRs to `main` (and `cursor/**` for agent branches).

2. **`.github/workflows/render-markdown.yml`** — a *reusable* workflow (`workflow_call`) that renders one file to HTML using the checked-out code. Call it from another workflow in your org:

```yaml
jobs:
  docs:
    uses: YOUR_ORG/it-markdown/.github/workflows/render-markdown.yml@main
    with:
      input_path: docs/page.md
      output_path: dist/page.fragment.html
```

Replace `YOUR_ORG/it-markdown` with this repository path once published or forked.

For a **copy-paste** job inside the same repo without reuse, you can instead run the CLI in a step:

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: "22"
    cache: npm
- run: npm ci && npm run build
- run: npx it-markdown docs/README.md > site/fragment.html
```

(Install `it-markdown` from npm when released, or `npm ci` from a submodule / workspace of this repo.)

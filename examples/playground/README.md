# Browser playground (Vite)

Two-column editor: Markdown source on the left, rendered **safe** HTML on the right.

## Prerequisite

Build the library from the repository root:

```bash
npm ci
npm run build
```

## Run

```bash
cd examples/playground
npm install
npm run dev
```

Open the printed local URL (default port **5174**).

## Build static assets

```bash
npm run build
```

Output is written to `dist/` under this folder.

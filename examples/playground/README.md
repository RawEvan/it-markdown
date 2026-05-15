# it-markdown Playground

Interactive Markdown widget playground — auto-deployed to GitHub Pages.

## Local Development

```bash
cd examples/playground
npm install
npm run dev      # http://localhost:5174/it-markdown/
```

## GitHub Pages Deployment

The playground auto-deploys to GitHub Pages on every push to `main`.

### One-time Setup

1. Go to repo **Settings → Pages**
2. Under **Build and deployment**:
   - **Source**: `GitHub Actions`

That's it — the workflow in `.github/workflows/deploy-playground.yml` handles everything else.

### Manual Trigger

You can also trigger deployment manually:

1. Go to repo **Actions**
2. Select **Deploy Playground to GitHub Pages**
3. Click **Run workflow** → choose `main` branch

## What the Workflow Does

1. Checks out code
2. Sets up Node.js 22
3. Installs and builds root `it-markdown` package
4. Installs playground dependencies
5. Builds the playground (`vite build`)
6. Uploads `dist/` as Pages artifact
7. Deploys artifact to GitHub Pages

## Accessing the Playground

After deployment, visit:

```
https://RawEvan.github.io/it-markdown/
```

## Troubleshooting

### Blank page?

Check browser console for 404 errors — likely a `base` path issue. The
`vite.config.ts` sets `base: "/it-markdown/"` to match the repo name.

### 404 on first deploy?

GitHub Pages can take 1–2 minutes to propagate. Also check the Actions
run logs for build errors.

### Workflow not running?

Make sure your changes touch one of the `paths` in the workflow:

- `examples/playground/**`
- `src/**`
- `.github/workflows/deploy-playground.yml`

Or use `workflow_dispatch` to run manually.

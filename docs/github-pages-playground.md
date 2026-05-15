# Publish the playground to GitHub Pages (manual)

The Vite app in [`examples/playground/`](../examples/playground/) can be hosted as a static site.

1. Enable **GitHub Pages** for the repository: Settings → Pages → Build and deployment → **GitHub Actions** (or deploy from `gh-pages` branch).
2. On your machine, from the repo root:

   ```bash
   npm ci
   npm run build
   cd examples/playground
   npm ci
   npm run build
   ```

3. Upload the contents of `examples/playground/dist/` to your Pages source (e.g. push to `gh-pages` or attach as a Pages artifact workflow).

A first-party **automated** Pages workflow can be added later once Pages is enabled on the target repository (requires `permissions: pages: write` and `actions/configure-pages`).

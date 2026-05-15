# Research: Browser / WASM Bundle

**Date**: 2026-05-15
**Status**: Research — Decision record

## Goal

Evaluate bundling `it-markdown` + `marked` for browser extensions and static playground
without Node.js at runtime.

## Use Cases

1. **Browser extensions** — Content scripts that transform markdown on GitHub, GitLab, etc.
2. **Static playground** — Pure client-side demo without Node.js server
3. **Browser-based tools** — Online Markdown editors, documentation generators

## Options

### Option A: ESBuild Bundle (Recommended)

**Pros**:
- Fast builds
- Simple configuration
- Native ESM output
- Tree-shaking works well
- No WASM overhead

**Cons**:
- Not true WASM (still JavaScript)
- Large bundle if `marked` is included

**Estimated bundle size**:
- `it-markdown`: ~15 KB minified
- `marked`: ~35 KB minified
- **Total**: ~50 KB gzipped (~150 KB raw)

**Implementation**:
```javascript
// build-browser.mjs
import { build } from "esbuild";
import { gzipSync } from "zlib";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  minify: true,
  outfile: "dist/it-markdown.browser.esm.js",
  external: [],
});

const code = readFileSync("dist/it-markdown.browser.esm.js");
console.log("Gzipped:", gzipSync(code).length / 1024, "KB");
```

### Option B: Rollup Bundle

**Pros**:
- More ecosystem support
- Better tree-shaking
- Plugin ecosystem

**Cons**:
- Slower builds
- More configuration

### Option C: WASM via `marked`

**Pros**:
- Could use `marked` WASM build
- True portability

**Cons**:
- `it-markdown` itself is TypeScript, not easily compiled to WASM
- Adds complexity
- Performance gains unclear for this use case

## CSP Considerations

Content Security Policy (CSP) restrictions in browser extensions:

```json
{
  "content_security_policy": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
}
```

Note: `wasm-unsafe-eval` may be required for WASM, which is not allowed in all extension stores.

## Decision

**Recommendation**: Option A — ESBuild bundle

Rationale:
1. Simplicity — single build step
2. Compatibility — pure ESM works in all modern browsers
3. Size — 50 KB gzipped is acceptable for most use cases
4. No WASM complexity

## Next Steps (if approved)

1. Create `build-browser.mjs` in `scripts/`
2. Add `npm run build:browser` to package.json
3. Update playground to use browser build
4. Document in README

## References

- [esbuild](https://esbuild.github.io/)
- [Rollup](https://rollupjs.org/)
- [marked WASM](https://www.npmjs.com/package/@deno/shiki-deno)
- [Browser extension CSP](https://developer.chrome.com/docs/extensions/mv3/intro/)

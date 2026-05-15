import { defineConfig } from "vite";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

function resolveItMarkdown() {
  const localPath = resolve(__dirname, "..");
  if (existsSync(resolve(localPath, "src", "index.ts"))) {
    return localPath;
  }
  return "it-markdown";
}

export default defineConfig({
  root: ".",
  base: "/",
  server: { port: 0 },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "it-markdown": resolveItMarkdown(),
    },
  },
});

import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  root: ".",
  server: { port: 5174 },
  resolve: {
    alias: {
      "it-markdown": resolve(__dirname, "../.."),
    },
  },
});

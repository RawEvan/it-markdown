import { defineConfig } from "vitepress";
import { renderImdToHtml } from "it-markdown";

export default defineConfig({
  title: "it-markdown + VitePress",
  description: "Interactive Markdown widgets inside VitePress docs",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Widgets", link: "/widgets" },
      { text: "Guide", link: "/guide" },
    ],
    sidebar: {
      "/": [
        { text: "Introduction", link: "/" },
        { text: "Widget Gallery", link: "/widgets" },
        { text: "Integration Guide", link: "/guide" },
      ],
    },
  },
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

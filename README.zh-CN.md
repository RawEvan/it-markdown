# it-markdown

面向 **普通 Markdown（`.md`）** 的小型扩展：按钮、滑块、单选/多选、标签页与折叠面板。默认 **安全 HTML**（不把作者写的 `onClick` 变成可执行脚本），解析与渲染见 [`SPEC.md`](./SPEC.md)（英文规范）。

## 快速开始

```bash
npm install
npm test
npm run build
```

```ts
import { readFileSync } from "node:fs";
import { renderImdToHtml } from "it-markdown";

const src = readFileSync(new URL("./examples/sample.imd.md", import.meta.url), "utf8");
const html = renderImdToHtml(src, { staticOnly: false, safeMode: true });
```

## CLI

安装依赖并 `npm run build` 后：

```bash
npx it-markdown path/to/doc.md > out.fragment.html
npx it-markdown path/to/doc.md --static > out.static.html
```

## 一致性测试 / 规范版本

见英文 [`README.md`](./README.md) 中的 **Conformance** 与仓库根目录 [`SPEC.md`](./SPEC.md) 顶部的 **Spec-Version**。

## 示例与 Playground

- 最小 SSG 示例：`examples/ssg-minimal/`
- 浏览器双栏 Playground：`examples/playground/`（需在该目录 `npm install` 后 `npm run dev`；请先于仓库根目录执行 `npm run build`）

## VS Code

见 `editors/vscode-it-markdown/README.md`（本地开发用扩展骨架）。

## 文档与路线

- 安全模型（英文）：[`docs/security-model.md`](./docs/security-model.md)
- 扩展提案流程：[`docs/extension-process.md`](./docs/extension-process.md)
- GitHub Actions：[`docs/github-actions.md`](./docs/github-actions.md)
- AI 写作提示：[`docs/ai-authoring.md`](./docs/ai-authoring.md)
- GitHub Projects 建议列：[`docs/roadmap-github-projects.md`](./docs/roadmap-github-projects.md)

## License

MIT

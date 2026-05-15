import { renderImdToHtml } from "it-markdown";

const sample = `# Playground

[Click](!button:onClick=alert(1))

[!tab:A]
**Tab A**

[!tab:B]
Tab B
`;

const ta = document.querySelector<HTMLTextAreaElement>("#src")!;
const preview = document.querySelector<HTMLDivElement>("#preview")!;

function render() {
  preview.innerHTML = renderImdToHtml(ta.value, { safeMode: true, staticOnly: false });
}

ta.value = sample;
ta.addEventListener("input", render);
render();

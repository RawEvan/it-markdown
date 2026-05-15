import { renderImdToHtml } from "it-markdown";

const ta = document.querySelector<HTMLTextAreaElement>("#src")!;
const preview = document.querySelector<HTMLDivElement>("#preview")!;
const btnOpen = document.querySelector<HTMLButtonElement>("#btn-open")!;
const btnSave = document.querySelector<HTMLButtonElement>("#btn-save")!;
const btnSaveAs = document.querySelector<HTMLButtonElement>("#btn-save-as")!;
const statusEl = document.querySelector<HTMLSpanElement>("#status")!;
const mainEl = document.querySelector<HTMLDivElement>("#main")!;
const btnViewPreview = document.querySelector<HTMLButtonElement>("#view-preview")!;
const btnViewSplit = document.querySelector<HTMLButtonElement>("#view-split")!;
const btnViewEdit = document.querySelector<HTMLButtonElement>("#view-edit")!;

let currentFilePath: string | null = null;
let dirty = false;

function setStatus(msg: string, timeout = 3000) {
  statusEl.textContent = msg;
  if (timeout > 0) {
    setTimeout(() => {
      if (statusEl.textContent === msg) statusEl.textContent = "";
    }, timeout);
  }
}

function setView(mode: "preview" | "edit" | "split") {
  mainEl.className = `main mode-${mode}`;
  [btnViewPreview, btnViewEdit, btnViewSplit].forEach((b) => b.classList.remove("active"));
  if (mode === "preview") btnViewPreview.classList.add("active");
  if (mode === "edit") btnViewEdit.classList.add("active");
  if (mode === "split") btnViewSplit.classList.add("active");
}

function render() {
  preview.innerHTML = renderImdToHtml(ta.value, { safeMode: true, staticOnly: false });
  attachInteractiveBehaviors();
  dirty = true;
  setStatus("Modified", 0);
}

function attachInteractiveBehaviors() {
  preview.querySelectorAll('.imd-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll<HTMLButtonElement>('.imd-tab');
    const panels = tabGroup.querySelectorAll<HTMLDivElement>('.imd-tab-panel');
    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
        panels.forEach(p => p.hidden = true);
        tab.setAttribute('aria-selected', 'true');
        if (panels[idx]) panels[idx].hidden = false;
      });
    });
  });

  preview.querySelectorAll<HTMLButtonElement>('.imd-button[data-imd-onclick]').forEach(btn => {
    btn.addEventListener('click', () => {
      try { new Function(btn.dataset.imdOnclick!)(); } catch(e) { console.error(e); }
    });
  });

  preview.querySelectorAll<HTMLInputElement>('.imd-slider input[type=range]').forEach(input => {
    const parent = input.parentElement!;
    if (!parent.querySelector('.imd-slider-value-display')) {
      const display = document.createElement('span');
      display.className = 'imd-slider-value-display';
      display.textContent = input.value;
      parent.appendChild(display);
      input.addEventListener('input', () => { display.textContent = input.value; });
    }
  });
}

async function loadFile(path: string) {
  try {
    const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error(await res.text());
    const content = await res.text();
    ta.value = content;
    currentFilePath = path;
    dirty = false;
    setStatus(`Loaded: ${path}`);
    renderImd();
  } catch (err) {
    setStatus(`Error: ${err}`);
  }
}

async function saveFile() {
  if (!currentFilePath) {
    setStatus("No file path. Use Save As...", 3000);
    return;
  }
  try {
    const res = await fetch(`/api/file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: currentFilePath, content: ta.value }),
    });
    if (!res.ok) throw new Error(await res.text());
    dirty = false;
    setStatus(`Saved: ${currentFilePath}`);
  } catch (err) {
    setStatus(`Error: ${err}`);
  }
}

async function saveFileAs() {
  const path = prompt("Enter file path to save:");
  if (!path) return;
  currentFilePath = path;
  await saveFile();
}

function renderImd() {
  preview.innerHTML = renderImdToHtml(ta.value, { safeMode: true, staticOnly: false });
  attachInteractiveBehaviors();
}

btnOpen.addEventListener("click", () => {
  const path = prompt("Enter file path to open:");
  if (path) loadFile(path);
});

btnSave.addEventListener("click", saveFile);
btnSaveAs.addEventListener("click", saveFileAs);

btnViewPreview.addEventListener("click", () => setView("preview"));
btnViewSplit.addEventListener("click", () => setView("split"));
btnViewEdit.addEventListener("click", () => setView("edit"));

ta.addEventListener("input", () => {
  renderImd();
  dirty = true;
  setStatus("Modified", 0);
});

// Load from query param
const params = new URLSearchParams(location.search);
const fileParam = params.get("file");
if (fileParam) {
  loadFile(fileParam);
} else {
  // Default sample
  ta.value = `# Welcome to it-md-notepad

Edit this markdown on the left and see the interactive preview on the right.

## Sliders

[Brightness](!slider:min=0,max=100,value=50,id=brightness)

## Checkboxes

[Options](!checkbox:options=Option A|Option B|Option C,id=opts)

## Radio Buttons

[Color](!radio:options=Red|Green|Blue,id=color)

## Tabs

[!tab:First]
Content for the first tab.

[!tab:Second]
Content for the **second** tab.

## Collapsible

[!collapse:Click to expand]
Hidden content here.
`;
  renderImd();
}

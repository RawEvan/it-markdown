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
let autoSaveInterval: number | null = null;

const AUTOSAVE_KEY = "it-md-notepad:draft";
const AUTOSAVE_INTERVAL = 5000;
const MAX_FILE_SIZE = 1024 * 1024; // 1MB threshold for large file warning

/**
 * Show status message with optional timeout.
 */
function setStatus(msg: string, timeout = 3000) {
  statusEl.textContent = msg;
  if (timeout > 0) {
    setTimeout(() => {
      if (statusEl.textContent === msg) statusEl.textContent = "";
    }, timeout);
  }
}

/**
 * Switch between preview, edit, and split view modes.
 */
function setView(mode: "preview" | "edit" | "split") {
  mainEl.className = `main mode-${mode}`;
  [btnViewPreview, btnViewEdit, btnViewSplit].forEach((b) => b.classList.remove("active"));
  if (mode === "preview") btnViewPreview.classList.add("active");
  if (mode === "edit") btnViewEdit.classList.add("active");
  if (mode === "split") btnViewSplit.classList.add("active");
}

/**
 * Attach interactive behaviors to rendered widgets.
 */
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

/**
 * Render markdown content to preview panel.
 */
function renderImd() {
  try {
    preview.innerHTML = renderImdToHtml(ta.value, { safeMode: true, staticOnly: false });
    attachInteractiveBehaviors();
  } catch (err) {
    setStatus(`Render error: ${err}`, 5000);
    console.error("Render error:", err);
  }
}

/**
 * Load file from server with error handling.
 */
async function loadFile(path: string) {
  try {
    setStatus("Loading...", 0);
    const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error(await res.text());
    const content = await res.text();

    if (content.length > MAX_FILE_SIZE) {
      const proceed = confirm(`File is ${(content.length / 1024 / 1024).toFixed(1)}MB. Large files may affect performance. Continue?`);
      if (!proceed) {
        setStatus("Load cancelled", 3000);
        return;
      }
    }

    ta.value = content;
    currentFilePath = path;
    dirty = false;
    setStatus(`Loaded: ${path}`);
    renderImd();
    clearDraft();
  } catch (err) {
    setStatus(`Error: ${err}`, 5000);
    console.error("Load error:", err);
  }
}

/**
 * Save file to server with error handling.
 */
async function saveFile() {
  if (!currentFilePath) {
    setStatus("No file path. Use Save As...", 3000);
    return;
  }
  try {
    setStatus("Saving...", 0);
    const res = await fetch(`/api/file`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: currentFilePath, content: ta.value }),
    });
    if (!res.ok) throw new Error(await res.text());
    dirty = false;
    setStatus(`Saved: ${currentFilePath}`);
    clearDraft();
  } catch (err) {
    setStatus(`Save error: ${err}`, 5000);
    console.error("Save error:", err);
  }
}

/**
 * Save file with a new path.
 */
async function saveFileAs() {
  const path = prompt("Enter file path to save:");
  if (!path) return;
  currentFilePath = path;
  await saveFile();
}

/**
 * Auto-save draft to localStorage for crash recovery.
 */
function saveDraft() {
  if (!dirty || !ta.value) return;
  const draft = {
    path: currentFilePath,
    content: ta.value,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft));
  } catch {
    // localStorage may be full or unavailable
  }
}

/**
 * Load draft from localStorage on startup.
 */
function loadDraft(): boolean {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return false;
    const draft = JSON.parse(raw);
    if (!draft.content) return false;

    const age = Date.now() - (draft.timestamp || 0);
    const ageMinutes = Math.floor(age / 60000);

    if (draft.path) {
      const restore = confirm(
        `Found unsaved draft for "${draft.path}" (${ageMinutes}m ago). Restore it?`
      );
      if (restore) {
        ta.value = draft.content;
        currentFilePath = draft.path;
        dirty = true;
        setStatus("Restored from draft", 3000);
        renderImd();
        return true;
      }
    } else {
      const restore = confirm(`Found unsaved draft (${ageMinutes}m ago). Restore it?`);
      if (restore) {
        ta.value = draft.content;
        dirty = true;
        setStatus("Restored from draft", 3000);
        renderImd();
        return true;
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return false;
}

/**
 * Clear draft from localStorage after successful save.
 */
function clearDraft() {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Start auto-save interval.
 */
function startAutoSave() {
  if (autoSaveInterval) return;
  autoSaveInterval = window.setInterval(saveDraft, AUTOSAVE_INTERVAL);
}

/**
 * Stop auto-save interval.
 */
function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
}

// Event listeners
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

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "s") {
    e.preventDefault();
    saveFile();
  }
});

// Warn before closing if there are unsaved changes
window.addEventListener("beforeunload", (e) => {
  if (dirty) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// Initialize
startAutoSave();

// Load from query param or draft
const params = new URLSearchParams(location.search);
const fileParam = params.get("file");

if (fileParam) {
  loadFile(fileParam);
} else if (!loadDraft()) {
  // Default sample content
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

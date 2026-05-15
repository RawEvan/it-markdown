import { marked } from "marked";
import { parseImd } from "./parse.js";
import type { ImdSegment, ImdWidget, RenderHtmlOptions } from "./types.js";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(md: string): string {
  if (!md.trim()) return "";
  return marked.parse(md, { async: false }) as string;
}

function isTabWidget(seg: ImdSegment | undefined): seg is { type: "widget"; widget: Extract<ImdWidget, { kind: "tab" }> } {
  return !!seg && seg.type === "widget" && seg.widget.kind === "tab";
}

function renderButton(w: Extract<ImdWidget, { kind: "button" }>, opts: RenderHtmlOptions): string {
  const idAttr = w.id ? ` id="${esc(w.id)}"` : "";
  const label = esc(w.label);
  if (opts.staticOnly) {
    return `<span class="imd-button imd-static"${idAttr} data-imd-control="button">${label}</span>`;
  }
  const safe = opts.safeMode !== false;
  let dataAttrs = "";
  if (safe) {
    dataAttrs = ` data-imd-safe="1"`;
    if (w.onClickRaw) {
      dataAttrs += ` data-imd-unsafe-handler="${esc(w.onClickRaw)}"`;
    }
  } else if (w.onClickRaw) {
    dataAttrs = ` data-imd-onclick="${esc(w.onClickRaw)}"`;
  }
  return `<button type="button" class="imd-button"${idAttr} data-imd-control="button"${dataAttrs}>${label}</button>`;
}

function renderSlider(w: Extract<ImdWidget, { kind: "slider" }>, opts: RenderHtmlOptions): string {
  const idAttr = w.id ? ` id="${esc(w.id)}"` : "";
  const nameAttr = w.id ? ` name="${esc(w.id)}"` : "";
  const forAttr = w.id ? ` for="${esc(w.id)}"` : "";
  if (opts.staticOnly) {
    return `<span class="imd-slider imd-static"${idAttr} data-imd-control="slider"><span class="imd-slider-label">${esc(
      w.label,
    )}</span> <span class="imd-slider-value">${esc(String(w.value))}</span></span>`;
  }
  return `<label class="imd-slider"${forAttr} data-imd-control="slider"><span class="imd-slider-label">${esc(
    w.label,
  )}</span> <input type="range"${idAttr}${nameAttr} min="${w.min}" max="${w.max}" value="${w.value}" /></label>`;
}

function renderRadio(w: Extract<ImdWidget, { kind: "radio" }>, opts: RenderHtmlOptions): string {
  const gid = w.id ?? `imd-radio-${hashStable(w.label + w.options.join("|"))}`;
  const fieldset = `<fieldset class="imd-radio" data-imd-control="radio"${w.id ? ` data-imd-id="${esc(w.id)}"` : ""}>`;
  const legend = `<legend>${esc(w.label)}</legend>`;
  if (opts.staticOnly) {
    const items = w.options.map((o) => `<span class="imd-option">${esc(o)}</span>`).join(" ");
    return `${fieldset}${legend}<div class="imd-static-options">${items}</div></fieldset>`;
  }
  const inputs = w.options
    .map((o, idx) => {
      const rid = `${esc(gid)}-${idx}`;
      return `<label class="imd-option"><input type="radio" name="${esc(gid)}" value="${esc(o)}" id="${rid}" /> ${esc(
        o,
      )}</label>`;
    })
    .join(" ");
  return `${fieldset}${legend}<div class="imd-options">${inputs}</div></fieldset>`;
}

function renderCheckbox(w: Extract<ImdWidget, { kind: "checkbox" }>, opts: RenderHtmlOptions): string {
  const gid = w.id ?? `imd-cb-${hashStable(w.label + w.options.join("|"))}`;
  const fieldset = `<fieldset class="imd-checkbox" data-imd-control="checkbox"${w.id ? ` data-imd-id="${esc(w.id)}"` : ""}>`;
  const legend = `<legend>${esc(w.label)}</legend>`;
  if (opts.staticOnly) {
    const items = w.options.map((o) => `<span class="imd-option">${esc(o)}</span>`).join(" ");
    return `${fieldset}${legend}<div class="imd-static-options">${items}</div></fieldset>`;
  }
  const inputs = w.options
    .map((o, idx) => {
      const cid = `${esc(gid)}-${idx}`;
      return `<label class="imd-option"><input type="checkbox" name="${esc(gid)}[]" value="${esc(o)}" id="${cid}" /> ${esc(
        o,
      )}</label>`;
    })
    .join(" ");
  return `${fieldset}${legend}<div class="imd-options">${inputs}</div></fieldset>`;
}

/** Tiny stable hash for fallback ids (not cryptographic). */
function hashStable(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

function renderTabGroup(tabs: Extract<ImdWidget, { kind: "tab" }>[], opts: RenderHtmlOptions): string {
  if (tabs.length === 0) return "";
  const tabId = `imd-tabs-${hashStable(tabs.map((t) => t.title).join("|"))}`;
  const buttons = tabs
    .map((t, idx) => {
      const active = idx === 0 ? ' aria-selected="true"' : ' aria-selected="false"';
      return `<button type="button" class="imd-tab" role="tab"${active} data-imd-tab-index="${idx}" id="${tabId}-tab-${idx}">${esc(
        t.title,
      )}</button>`;
    })
    .join("");
  const panels = tabs
    .map((t, idx) => {
      const hidden = idx === 0 ? "" : ` hidden`;
      const body = renderMarkdown(t.body);
      return `<div class="imd-tab-panel" role="tabpanel"${hidden} aria-labelledby="${tabId}-tab-${idx}">${body}</div>`;
    })
    .join("");
  if (opts.staticOnly) {
    const blocks = tabs
      .map((t) => {
        return `<section class="imd-tab-static"><h4 class="imd-tab-static-title">${esc(t.title)}</h4>${renderMarkdown(
          t.body,
        )}</section>`;
      })
      .join("");
    return `<div class="imd-tabs imd-static" data-imd-control="tabs">${blocks}</div>`;
  }
  return `<div class="imd-tabs" data-imd-control="tabs" id="${tabId}"><div class="imd-tablist" role="tablist">${buttons}</div>${panels}</div>`;
}

function renderCollapse(w: Extract<ImdWidget, { kind: "collapse" }>, opts: RenderHtmlOptions): string {
  const body = renderMarkdown(w.body);
  if (opts.staticOnly) {
    return `<section class="imd-collapse imd-static" data-imd-control="collapse"><h4 class="imd-collapse-title">${esc(
      w.title,
    )}</h4>${body}</section>`;
  }
  return `<details class="imd-collapse" data-imd-control="collapse"><summary>${esc(w.title)}</summary>${body}</details>`;
}

function renderWidget(w: ImdWidget, opts: RenderHtmlOptions): string {
  switch (w.kind) {
    case "button":
      return renderButton(w, opts);
    case "slider":
      return renderSlider(w, opts);
    case "radio":
      return renderRadio(w, opts);
    case "checkbox":
      return renderCheckbox(w, opts);
    case "tab":
      return renderTabGroup([w], opts);
    case "collapse":
      return renderCollapse(w, opts);
  }
}

function renderSegments(segments: ImdSegment[], opts: RenderHtmlOptions): string {
  const parts: string[] = [];
  const groupTabs = opts.groupTabs !== false;
  let i = 0;
  while (i < segments.length) {
    const seg = segments[i];
    if (!seg) break;
    if (seg.type === "markdown") {
      parts.push(renderMarkdown(seg.value));
      i++;
      continue;
    }
    if (isTabWidget(seg) && groupTabs) {
      const tabs: Extract<ImdWidget, { kind: "tab" }>[] = [];
      while (isTabWidget(segments[i])) {
        const t = segments[i];
        if (t.type === "widget" && t.widget.kind === "tab") tabs.push(t.widget);
        i++;
      }
      parts.push(renderTabGroup(tabs, opts));
      continue;
    }
    parts.push(renderWidget(seg.widget, opts));
    i++;
  }
  return parts.join("\n");
}

/**
 * Render a full iMD document to an HTML fragment (no `<html>` wrapper).
 * Uses `marked` for Markdown segments; emits semantic controls with `data-imd-*` hooks for a future client runtime.
 */
export function renderImdToHtml(source: string, options: RenderHtmlOptions = {}): string {
  const segments = parseImd(source);
  const className = options.className ?? "imd-root";
  const inner = renderSegments(segments, options);
  return `<article class="${esc(className)}" data-imd="1">${inner}</article>`;
}

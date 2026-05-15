import { marked } from "marked";
import { parseItMarkdown } from "./parse.js";
import type { ItMarkdownSegment, ItMarkdownWidget, RenderHtmlOptions } from "./types.js";

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

function isTabWidget(
  seg: ItMarkdownSegment | undefined,
): seg is { type: "widget"; widget: Extract<ItMarkdownWidget, { kind: "tab" }> } {
  return !!seg && seg.type === "widget" && seg.widget.kind === "tab";
}

function renderButton(w: Extract<ItMarkdownWidget, { kind: "button" }>, opts: RenderHtmlOptions): string {
  const idAttr = w.id ? ` id="${esc(w.id)}"` : "";
  const label = esc(w.label);
  if (opts.staticOnly) {
    return `<span class="itm-button itm-static"${idAttr} data-itm-control="button">${label}</span>`;
  }
  const safe = opts.safeMode !== false;
  let dataAttrs = "";
  if (safe) {
    dataAttrs = ` data-itm-safe="1"`;
    if (w.onClickRaw) {
      dataAttrs += ` data-itm-unsafe-handler="${esc(w.onClickRaw)}"`;
    }
  } else if (w.onClickRaw) {
    dataAttrs = ` data-itm-onclick="${esc(w.onClickRaw)}"`;
  }
  return `<button type="button" class="itm-button"${idAttr} data-itm-control="button"${dataAttrs}>${label}</button>`;
}

function renderSlider(w: Extract<ItMarkdownWidget, { kind: "slider" }>, opts: RenderHtmlOptions): string {
  const idAttr = w.id ? ` id="${esc(w.id)}"` : "";
  const nameAttr = w.id ? ` name="${esc(w.id)}"` : "";
  const forAttr = w.id ? ` for="${esc(w.id)}"` : "";
  if (opts.staticOnly) {
    return `<span class="itm-slider itm-static"${idAttr} data-itm-control="slider"><span class="itm-slider-label">${esc(
      w.label,
    )}</span> <span class="itm-slider-value">${esc(String(w.value))}</span></span>`;
  }
  return `<label class="itm-slider"${forAttr} data-itm-control="slider"><span class="itm-slider-label">${esc(
    w.label,
  )}</span> <input type="range"${idAttr}${nameAttr} min="${w.min}" max="${w.max}" value="${w.value}" /></label>`;
}

function renderRadio(w: Extract<ItMarkdownWidget, { kind: "radio" }>, opts: RenderHtmlOptions): string {
  const gid = w.id ?? `itm-radio-${hashStable(w.label + w.options.join("|"))}`;
  const fieldset = `<fieldset class="itm-radio" data-itm-control="radio"${w.id ? ` data-itm-id="${esc(w.id)}"` : ""}>`;
  const legend = `<legend>${esc(w.label)}</legend>`;
  if (opts.staticOnly) {
    const items = w.options.map((o) => `<span class="itm-option">${esc(o)}</span>`).join(" ");
    return `${fieldset}${legend}<div class="itm-static-options">${items}</div></fieldset>`;
  }
  const inputs = w.options
    .map((o, idx) => {
      const rid = `${esc(gid)}-${idx}`;
      return `<label class="itm-option"><input type="radio" name="${esc(gid)}" value="${esc(o)}" id="${rid}" /> ${esc(
        o,
      )}</label>`;
    })
    .join(" ");
  return `${fieldset}${legend}<div class="itm-options">${inputs}</div></fieldset>`;
}

function renderCheckbox(w: Extract<ItMarkdownWidget, { kind: "checkbox" }>, opts: RenderHtmlOptions): string {
  const gid = w.id ?? `itm-cb-${hashStable(w.label + w.options.join("|"))}`;
  const fieldset = `<fieldset class="itm-checkbox" data-itm-control="checkbox"${w.id ? ` data-itm-id="${esc(w.id)}"` : ""}>`;
  const legend = `<legend>${esc(w.label)}</legend>`;
  if (opts.staticOnly) {
    const items = w.options.map((o) => `<span class="itm-option">${esc(o)}</span>`).join(" ");
    return `${fieldset}${legend}<div class="itm-static-options">${items}</div></fieldset>`;
  }
  const inputs = w.options
    .map((o, idx) => {
      const cid = `${esc(gid)}-${idx}`;
      return `<label class="itm-option"><input type="checkbox" name="${esc(gid)}[]" value="${esc(o)}" id="${cid}" /> ${esc(
        o,
      )}</label>`;
    })
    .join(" ");
  return `${fieldset}${legend}<div class="itm-options">${inputs}</div></fieldset>`;
}

/** Tiny stable hash for fallback ids (not cryptographic). */
function hashStable(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

function renderTabGroup(tabs: Extract<ItMarkdownWidget, { kind: "tab" }>[], opts: RenderHtmlOptions): string {
  if (tabs.length === 0) return "";
  const tabId = `itm-tabs-${hashStable(tabs.map((t) => t.title).join("|"))}`;
  const buttons = tabs
    .map((t, idx) => {
      const active = idx === 0 ? ' aria-selected="true"' : ' aria-selected="false"';
      return `<button type="button" class="itm-tab" role="tab"${active} data-itm-tab-index="${idx}" id="${tabId}-tab-${idx}">${esc(
        t.title,
      )}</button>`;
    })
    .join("");
  const panels = tabs
    .map((t, idx) => {
      const hidden = idx === 0 ? "" : ` hidden`;
      const body = renderMarkdown(t.body);
      return `<div class="itm-tab-panel" role="tabpanel"${hidden} aria-labelledby="${tabId}-tab-${idx}">${body}</div>`;
    })
    .join("");
  if (opts.staticOnly) {
    const blocks = tabs
      .map((t) => {
        return `<section class="itm-tab-static"><h4 class="itm-tab-static-title">${esc(t.title)}</h4>${renderMarkdown(
          t.body,
        )}</section>`;
      })
      .join("");
    return `<div class="itm-tabs itm-static" data-itm-control="tabs">${blocks}</div>`;
  }
  return `<div class="itm-tabs" data-itm-control="tabs" id="${tabId}"><div class="itm-tablist" role="tablist">${buttons}</div>${panels}</div>`;
}

function renderCollapse(w: Extract<ItMarkdownWidget, { kind: "collapse" }>, opts: RenderHtmlOptions): string {
  const body = renderMarkdown(w.body);
  if (opts.staticOnly) {
    return `<section class="itm-collapse itm-static" data-itm-control="collapse"><h4 class="itm-collapse-title">${esc(
      w.title,
    )}</h4>${body}</section>`;
  }
  return `<details class="itm-collapse" data-itm-control="collapse"><summary>${esc(w.title)}</summary>${body}</details>`;
}

function renderWidget(w: ItMarkdownWidget, opts: RenderHtmlOptions): string {
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

function renderSegments(segments: ItMarkdownSegment[], opts: RenderHtmlOptions): string {
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
      const tabs: Extract<ItMarkdownWidget, { kind: "tab" }>[] = [];
      while (isTabWidget(segments[i])) {
        const t = segments[i];
        if (t.type === "widget" && t.widget.kind === "tab") tabs.push(t.widget);
        i++;
      }
      parts.push(renderTabGroup(tabs, opts));
      continue;
    }
    if (isTabWidget(seg) && !groupTabs) {
      parts.push(renderTabGroup([seg.widget], opts));
      i++;
      continue;
    }
    parts.push(renderWidget(seg.widget, opts));
    i++;
  }
  return parts.join("\n");
}

/**
 * Render a full Markdown document (with optional interactive extensions) to an HTML fragment (no `<html>` wrapper).
 * Uses `marked` for Markdown segments; emits semantic controls with `data-itm-*` hooks for a future client runtime.
 */
export function renderItMarkdownToHtml(source: string, options: RenderHtmlOptions = {}): string {
  const segments = parseItMarkdown(source);
  const className = options.className ?? "itm-root";
  const inner = renderSegments(segments, options);
  return `<article class="${esc(className)}" data-itm="1">${inner}</article>`;
}

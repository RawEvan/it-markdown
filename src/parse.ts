import { findLinkClosingParen } from "./link-paren.js";
import { parseDirectiveDestination } from "./parse-attrs.js";
import type { ImdSegment, ImdWidget, ParseImdOptions } from "./types.js";

function findClosingLabelBracket(s: string, from: number): number {
  for (let i = from; i < s.length; i++) {
    if (s[i] === "]") return i;
  }
  return -1;
}

function toNum(v: string | undefined, fallback: number): number {
  if (v === undefined || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function buildWidgetFromLink(label: string, dest: string): ImdWidget | null {
  const d = parseDirectiveDestination(dest);
  if (!d) return null;
  const { subtype, attrs } = d;
  const id = attrs.id;

  switch (subtype) {
    case "button":
      return {
        kind: "button",
        label,
        id,
        onClickRaw: attrs.onclick || attrs.action,
        attrs,
      };
    case "slider":
      return {
        kind: "slider",
        label,
        id,
        min: toNum(attrs.min, 0),
        max: toNum(attrs.max, 100),
        value: toNum(attrs.value, 0),
        attrs,
      };
    case "radio": {
      const opt = attrs.options ?? "";
      const options = opt.split("|").map((o) => o.trim()).filter(Boolean);
      return { kind: "radio", label, id, options, attrs };
    }
    case "checkbox": {
      const opt = attrs.options ?? "";
      const options = opt.split("|").map((o) => o.trim()).filter(Boolean);
      return { kind: "checkbox", label, id, options, attrs };
    }
    default:
      return null;
  }
}

/** Split a markdown fragment for `[label](!type:...)` link-style widgets. */
export function splitMarkdownForInlineWidgets(text: string): ImdSegment[] {
  const segments: ImdSegment[] = [];
  let pos = 0;

  while (pos < text.length) {
    const open = text.indexOf("[", pos);
    if (open === -1) {
      if (pos < text.length) {
        segments.push({ type: "markdown", value: text.slice(pos) });
      }
      break;
    }
    if (open > pos) {
      segments.push({ type: "markdown", value: text.slice(pos, open) });
    }
    const closeLabel = findClosingLabelBracket(text, open + 1);
    if (closeLabel === -1) {
      segments.push({ type: "markdown", value: text.slice(open, open + 1) });
      pos = open + 1;
      continue;
    }
    if (text[closeLabel + 1] !== "(") {
      segments.push({ type: "markdown", value: text.slice(open, closeLabel + 1) });
      pos = closeLabel + 1;
      continue;
    }
    const openParen = closeLabel + 1;
    const destStart = openParen + 1;
    const closeParen = findLinkClosingParen(text, openParen);
    if (closeParen === -1) {
      segments.push({ type: "markdown", value: text.slice(open) });
      break;
    }
    const dest = text.slice(destStart, closeParen);
    const label = text.slice(open + 1, closeLabel);
    if (dest.startsWith("!")) {
      const w = buildWidgetFromLink(label, dest);
      if (w) {
        segments.push({ type: "widget", widget: w });
        pos = closeParen + 1;
        continue;
      }
    }
    segments.push({ type: "markdown", value: text.slice(open, closeParen + 1) });
    pos = closeParen + 1;
  }

  return mergeAdjacentMarkdown(segments);
}

function mergeAdjacentMarkdown(segments: ImdSegment[]): ImdSegment[] {
  const out: ImdSegment[] = [];
  for (const seg of segments) {
    const last = out[out.length - 1];
    if (seg.type === "markdown" && last?.type === "markdown") {
      last.value += seg.value;
    } else {
      out.push(seg);
    }
  }
  return out;
}

function flushBuffer(buf: string[], target: ImdSegment[]): void {
  if (buf.length === 0) return;
  const text = buf.join("\n");
  buf.length = 0;
  target.push(...splitMarkdownForInlineWidgets(text));
}

/**
 * Parse an iMD document into ordered segments (Markdown fragments and widgets).
 * Standard Markdown passes through as `markdown` segments; extensions are extracted.
 */
export function parseImd(source: string, _options?: ParseImdOptions): ImdSegment[] {
  void _options;
  const lines = source.split(/\r?\n/);
  const segments: ImdSegment[] = [];
  const buf: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";
    const tabM = /^\s*\[!tab:(.+)\]\s*$/.exec(line);
    const colM = /^\s*\[!collapse:(.+)\]\s*$/.exec(line);

    if (tabM) {
      flushBuffer(buf, segments);
      const title = tabM[1].trim();
      i++;
      const bodyLines: string[] = [];
      while (i < lines.length) {
        const next = lines[i] ?? "";
        if (/^\s*\[!tab:/.test(next) || /^\s*\[!collapse:/.test(next)) break;
        bodyLines.push(next);
        i++;
      }
      segments.push({ type: "widget", widget: { kind: "tab", title, body: bodyLines.join("\n").trimEnd() } });
      continue;
    }

    if (colM) {
      flushBuffer(buf, segments);
      const title = colM[1].trim();
      i++;
      const bodyLines: string[] = [];
      while (i < lines.length) {
        const next = lines[i] ?? "";
        if (/^\s*\[!/.test(next)) break;
        bodyLines.push(next);
        i++;
      }
      segments.push({
        type: "widget",
        widget: { kind: "collapse", title, body: bodyLines.join("\n").trimEnd() },
      });
      continue;
    }

    buf.push(line);
    i++;
  }

  flushBuffer(buf, segments);
  return segments;
}

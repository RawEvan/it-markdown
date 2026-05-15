import { describe, expect, it } from "vitest";
import { parseItMarkdown } from "./parse.js";

describe("parseItMarkdown", () => {
  it("parses link-style controls", () => {
    const src = `# Demo\n\n[点击我](!button:onClick=alert("Hello"))\n`;
    const segs = parseItMarkdown(src);
    const widgets = segs.filter((s) => s.type === "widget");
    expect(widgets).toHaveLength(1);
    const w = widgets[0];
    expect(w?.type).toBe("widget");
    if (w?.type === "widget" && w.widget.kind === "button") {
      expect(w.widget.label).toBe("点击我");
      expect(w.widget.onClickRaw).toBe('alert("Hello")');
    }
  });

  it("accepts action= as an alias for the button handler", () => {
    const segs = parseItMarkdown(`[Go](!button:action=alert(1))\n`);
    const w = segs.find((s) => s.type === "widget" && s.widget.kind === "button");
    expect(w?.type).toBe("widget");
    if (w?.type === "widget" && w.widget.kind === "button") {
      expect(w.widget.onClickRaw).toBe("alert(1)");
    }
  });

  it("parses tabs and collapses as blocks", () => {
    const src = `[!tab:标题1]\nLine A\n\n[!tab:标题2]\nLine B\n\n[!collapse:更多]\nHidden\n`;
    const segs = parseItMarkdown(src);
    expect(segs.filter((s) => s.type === "widget")).toHaveLength(3);
    const t0 = segs.find((s) => s.type === "widget" && s.widget.kind === "tab");
    expect(t0?.type).toBe("widget");
    if (t0?.type === "widget" && t0.widget.kind === "tab") {
      expect(t0.widget.title).toBe("标题1");
      expect(t0.widget.body).toContain("Line A");
    }
  });
});

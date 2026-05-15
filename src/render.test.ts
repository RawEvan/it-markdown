import { describe, expect, it } from "vitest";
import { renderItMarkdownToHtml } from "./render.js";

describe("renderItMarkdownToHtml", () => {
  it("wraps output and renders markdown headings", () => {
    const html = renderItMarkdownToHtml("# Title\n\nHello");
    expect(html).toContain('data-itm="1"');
    expect(html).toContain("<h1");
    expect(html).toContain("Title");
  });

  it("emits safe button metadata by default", () => {
    const html = renderItMarkdownToHtml(`[Go](!button:onClick=alert(1))`);
    expect(html).toContain('data-itm-safe="1"');
    expect(html).toContain("data-itm-unsafe-handler");
    expect(html).not.toContain("onclick=");
  });

  it("groups consecutive tabs", () => {
    const html = renderItMarkdownToHtml(`[!tab:A]\na\n[!tab:B]\nb`);
    expect(html).toContain('data-itm-control="tabs"');
    expect(html.match(/itm-tab-panel/g)?.length).toBe(2);
  });

  it("can render consecutive tabs as separate groups when groupTabs is false", () => {
    const html = renderItMarkdownToHtml(`[!tab:A]\na\n[!tab:B]\nb`, { groupTabs: false });
    expect(html.match(/data-itm-control="tabs"/g)?.length).toBe(2);
  });
});

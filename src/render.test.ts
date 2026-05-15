import { describe, expect, it } from "vitest";
import { renderImdToHtml } from "./render.js";

describe("renderImdToHtml", () => {
  it("wraps output and renders markdown headings", () => {
    const html = renderImdToHtml("# Title\n\nHello");
    expect(html).toContain('data-imd="1"');
    expect(html).toContain("<h1");
    expect(html).toContain("Title");
  });

  it("emits safe button metadata by default", () => {
    const html = renderImdToHtml(`[Go](!button:onClick=alert(1))`);
    expect(html).toContain('data-imd-safe="1"');
    expect(html).toContain("data-imd-unsafe-handler");
    expect(html).not.toContain("onclick=");
  });

  it("groups consecutive tabs", () => {
    const html = renderImdToHtml(`[!tab:A]\na\n[!tab:B]\nb`);
    expect(html).toContain('data-imd-control="tabs"');
    expect(html.match(/imd-tab-panel/g)?.length).toBe(2);
  });

  it("can render consecutive tabs as separate groups when groupTabs is false", () => {
    const html = renderImdToHtml(`[!tab:A]\na\n[!tab:B]\nb`, { groupTabs: false });
    expect(html.match(/data-imd-control="tabs"/g)?.length).toBe(2);
  });
});

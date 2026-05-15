import { describe, expect, it } from "vitest";
import { micromarkRenderHtmlFragment } from "./micromark-prototype.js";

describe("micromark prototype (CommonMark compatibility)", () => {
  it("preserves simple opaque ! destinations (no colon scheme ambiguity)", () => {
    const html = micromarkRenderHtmlFragment(`[点击我](!demo)`);
    expect(html).toMatch(/<a href/);
    expect(html).toContain("!demo");
    expect(html).toContain("点击我");
  });

  it("still parses headings and emphasis", () => {
    const html = micromarkRenderHtmlFragment("# Hi\n\n**Bold**");
    expect(html).toContain("<h1");
    expect(html).toContain("<strong");
  });
});

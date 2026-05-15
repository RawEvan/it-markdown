import { describe, expect, it } from "vitest";
import { micromark } from "micromark";

/**
 * Core micromark accepts simple opaque `!` link destinations; `!type:attrs` is not
 * normative across all CommonMark implementations (see SPEC). These tests document
 * baseline micromark behaviour for community alignment.
 */
describe("micromark baseline (opaque destinations)", () => {
  it("preserves href for simple !demo destination", () => {
    const html = micromark("[x](!demo)");
    expect(html).toContain("!demo");
  });

  it("still parses headings", () => {
    const html = micromark("# Hi\n\n**b**");
    expect(html).toContain("<h1");
    expect(html).toContain("<strong");
  });
});

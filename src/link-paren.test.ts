import { describe, expect, it } from "vitest";
import { findLinkClosingParen } from "./link-paren.js";

describe("findLinkClosingParen", () => {
  it("handles nested parentheses inside destinations", () => {
    const s = `[x](!button:onClick=alert("Hello"))`;
    const open = s.indexOf("(");
    const close = findLinkClosingParen(s, open);
    expect(close).toBe(s.length - 1);
    expect(s.slice(open + 1, close)).toBe('!button:onClick=alert("Hello")');
  });
});

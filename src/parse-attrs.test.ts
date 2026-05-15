import { describe, expect, it } from "vitest";
import { parseAttrString } from "./parse-attrs.js";

describe("parseAttrString", () => {
  it("parses comma-separated pairs with pipe values", () => {
    expect(parseAttrString("options=Python|JavaScript|Go,id=lang")).toEqual({
      options: "Python|JavaScript|Go",
      id: "lang",
    });
  });

  it("lower-cases keys", () => {
    expect(parseAttrString("min=0,MAX=10")).toEqual({ min: "0", max: "10" });
  });
});

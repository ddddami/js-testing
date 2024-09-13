import { it, expect, describe } from "vitest";
import { max } from "../src/intro";

describe("max", () => {
  it("should return first number if it is greater", () => {
    expect(max(2, 1)).toBe(2);
  });

  it("should return second number if it is greater", () => {
    expect(max(2, 3)).toBe(3);
  });

  it("should return first number if arguements are equal", () => {
    expect(max(2, 2)).toBe(2);
  });
});

import { it, expect, describe } from "vitest";
import { calculateDiscount, getCoupons } from "../src/core";

describe("getCoupons", () => {
  it("should return an array of coupons", () => {
    expect(getCoupons()).toBeInstanceOf(Array); // or Array.isArray(getCoupons()) # with TS, we don't have to write assertions against types
    expect(getCoupons().length).toBeGreaterThan(0);
  });

  it("should return an array of objects with valid coupon codes", () => {
    const coupons = getCoupons();

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });

  it("should return an array of objects with valid discount values", () => {
    const coupons = getCoupons();

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeGreaterThanOrEqual(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discounted price if given valid discount", () => {
    expect(calculateDiscount(100, "SAVE10")).toBe(90);
    expect(calculateDiscount(100, "SAVE20")).toBe(80);
  });

  it("should handle non-numeric types", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle negative price", () => {
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle invalid discount", () => {
    expect(calculateDiscount(10, "INVALID")).toBe(10);
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });
});

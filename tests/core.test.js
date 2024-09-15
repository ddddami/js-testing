import { it, expect, describe } from "vitest";
import { getCoupons } from "../src/core";

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

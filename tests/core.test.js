import { it, expect, describe } from "vitest";
import {
  calculateDiscount,
  canDrive,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
} from "../src/core";

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

describe("validateUserInput", () => {
  it("should return successful if given valid input ", () => {
    expect(validateUserInput("Damilola", 18)).toMatch(/success/i);
  });

  it("should return an error if username is not a string", () => {
    expect(validateUserInput(10, 18)).toMatch(/invalid/i);
  });

  it("should return an error if username is less than 3 characters", () => {
    expect(validateUserInput("ab", 18)).toMatch(/invalid/i);
  });

  it("should return an error if age is not a number", () => {
    expect(validateUserInput("Dami", "18")).toMatch(/invalid/i);
  });

  it("should return an error if age is less than 18", () => {
    expect(validateUserInput("Dami", 17)).toMatch(/invalid/i);
  });
  it("should return an error if inputs are invalid", () => {
    expect(validateUserInput("", 17)).toMatch(/invalid username/i);
    expect(validateUserInput("", 17)).toMatch(/invalid age/i);
  });

  it("should return an error if username is greater than 255", () => {
    const username = "A".repeat(256);
    expect(validateUserInput(username, 18)).toMatch(/invalid/i);
  });

  it("should return an error if age is greater than 100", () => {
    expect(validateUserInput("username", 101)).toMatch(/invalid/i);
  });
});

// Don't write unit tests based on our our functions are implemented. Because they may have bugs. Test with how the function should work in mind.

describe("isPriceInRange", () => {
  it("should return false if price is outside the boundary", () => {
    expect(isPriceInRange(-20, 0, 10)).toBe(false);
    expect(isPriceInRange(20, 0, 10)).toBe(false);
  });

  it("should return false if price is outside the boundary", () => {
    expect(isPriceInRange(5, 0, 10)).toBe(true);
  });

  it("should return true if price is equal to the min or max ", () => {
    expect(isPriceInRange(0, 0, 10)).toBe(true);
    expect(isPriceInRange(10, 0, 10)).toBe(true);
  });
});

describe("isValidUsername", () => {
  const minLength = 5;
  const maxLength = 15;
  it("should return false if username is too short", () => {
    expect(isValidUsername("d".repeat(minLength - 1))).toBe(false);
  });

  it("should return false if username is too long", () => {
    expect(isValidUsername("A".repeat(maxLength + 1))).toBe(false);
  });

  it("should return true if username is within the length constraint", () => {
    expect(isValidUsername("A".repeat(minLength + 1))).toBe(true);
    expect(isValidUsername("A".repeat(maxLength - 1))).toBe(true);
  });

  it("should return true if username equals minLength or maxLength", () => {
    expect(isValidUsername("A".repeat(minLength))).toBe(true);
    expect(isValidUsername("A".repeat(maxLength))).toBe(true);
  });

  it("should return false for invalid input types", () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
});

describe("canDrive", () => {
  const legalDrivingAge = {
    US: 16,
    UK: 17,
  };
  it("should return invalid if given invalid couuntry code", () => {
    expect(canDrive(18, "INVALID  ")).toMatch(/invalid/i);
  });
  it("should false for underage in the US", () => {
    expect(canDrive(15, "US")).toBe(false);
  });

  it("should return true for eligible in the US", () => {
    expect(canDrive(17, "US")).toBe(true);
  });

  it("should return true for min age in the US", () => {
    expect(canDrive(16, "US")).toBe(true);
  });

  it("should false for underage in the UK", () => {
    expect(canDrive(16, "UK")).toBe(false);
  });

  it("should return true for eligible in the UK", () => {
    expect(canDrive(18, "UK")).toBe(true);
  });

  it("should return true for min age in the UK", () => {
    expect(canDrive(17, "UK")).toBe(true);
  });
});

// Defensive programming -> only do it at the boundary of our app.
// analoogy: a building can have security to validate people in, once you are in, you don't need to be cjecked again.

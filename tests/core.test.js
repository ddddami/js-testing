import {
  it,
  expect,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
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

  it("should return false if price is within the boundary", () => {
    expect(isPriceInRange(5, 0, 10)).toBe(true);
  });

  it("should return true if price is equal to the min or max ", () => {
    expect(isPriceInRange(0, 0, 10)).toBe(true);
    expect(isPriceInRange(10, 0, 10)).toBe(true);
  });

  it.each([
    { price: -20, result: false, scenario: "price < min" },
    { price: 20, result: false, scenario: "price > min" },
    { price: 5, result: true, scenario: "price is between min and max" },
    { price: 0, result: true, scenario: "price equals min" },
    { price: 10, result: true, scenario: "price equals max" },
  ])("should return $result if $scenario", ({ price, result }) => {
    expect(isPriceInRange(price, 0, 10)).toBe(result);
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
  // it("should return invalid if given invalid couuntry code", () => {
  //   expect(canDrive(18, "INVALID  ")).toMatch(/invalid/i);
  // });
  // it("should false for underage in the US", () => {
  //   expect(canDrive(15, "US")).toBe(false);
  // });

  // it("should return true for eligible in the US", () => {
  //   expect(canDrive(17, "US")).toBe(true);
  // });

  // it("should return true for min age in the US", () => {
  //   expect(canDrive(16, "US")).toBe(true);
  // });

  // it("should false for underage in the UK", () => {
  //   expect(canDrive(16, "UK")).toBe(false);
  // });

  // it("should return true for eligible in the UK", () => {
  //   expect(canDrive(18, "UK")).toBe(true);
  // });

  // it("should return true for min age in the UK", () => {
  //   expect(canDrive(17, "UK")).toBe(true);
  // });

  // Parameterized tests -> data-driven tests

  it.each([
    { age: 15, country: "US", result: false },
    { age: 16, country: "US", result: true },
    { age: 17, country: "US", result: true },
    { age: 16, country: "UK", result: false },
    { age: 17, country: "UK", result: true },
    { age: 18, country: "UK", result: true },
  ])("should return $result for $age, $country", ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });
});

// Defensive programming -> only do it at the boundary of our app.
// analoogy: a building can have security to validate people in, once you are in, you don't need to be cjecked again.

// Testing async code.
// describe("fetchData", () => {
//   it(" should return a promise that resolves to an array of numbers", () => {
//     fetchData().then((result) => {
//       expect(result).toBeInstanceOf(Array);
//       expect(result.length).toBeGreaterThan(0);
//     });
//   });
// });

describe("fetchData", () => {
  it(" should return a promise that resolves to an array of numbers", async () => {
    try {
      const result = await fetchData();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    } catch (error) {
      expect(error).toHaveProperty("reason");
      expect(error.reason).toMatch(/failed/i);
    }

    // not sure you should have both.. either test a resolved or rejected promise. not sure yet.
  });
});

// Setup and teardown - creating a consistent environment across our tests or to clean up any resources or state.

describe("testSuite", () => {
  beforeAll(() => console.log("beforeAll called"));
  beforeEach(() => console.log("beforeEach called"));

  afterAll(() => console.log("afterAll called"));
  afterEach(() => console.log("afterEach called"));
  it("test case 1", () => {});

  it("test case 2", () => {});
});

describe("Stack", () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it("push should append an item to the stack", () => {
    stack.push(1);

    expect(stack.size()).toBe(1);
  });

  it("pop should remove and return the top item from the stack", () => {
    stack.push(1);
    stack.push(2);

    expect(stack.pop()).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it("pop should throw an error if stack is empty", () => {
    // normally, this test would always fail because our fn is going to throw an error.
    // so we pass a call back fn, and .toThrow() with this, our test fn wont throw an error. if the call back does, vitest would catch it.
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it("peek should return the last item in the stack without removing it", () => {
    stack.push(1);
    stack.push(2);

    const peekedItem = stack.peek();
    expect(peekedItem).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it("peek should throw an error if stack is empty", () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  it("isEmpty should return true is stack is empty", () => {
    expect(stack.isEmpty()).toBe(true);
  });
  it("isEmpty should return false is stack is not empty", () => {
    stack.push(1);
    expect(stack.isEmpty()).toBe(false);
  });

  it("size should return the number of items in the stack", () => {
    stack.push(1);
    stack.push(1);
    stack.push(1);

    expect(stack.size()).toBe(3);
  });

  it("clear should remove all items in the stack", () => {
    stack.push(1);
    stack.push(1);
    stack.push(1);
    stack.clear();

    expect(stack.size()).toBe(0);
  });
});

// mock fn to test fns in isolation.

import { it, expect, describe, vi, test } from "vitest";
import { getPriceInCurrency } from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";

vi.mock("../src/libs/currency");

describe("test suite", () => {
  // mockReturnValue
  // mockResolvedValue
  // mockImplementation

  test("test case", () => {
    const greet = vi.fn();
    greet.mockReturnValue("Hello");
  });

  test("test case", () => {
    const greet = vi.fn();
    greet.mockResolvedValue("Hello, Dami");

    greet().then((result) => console.log(result));
  });

  test("test case", () => {
    const greet = vi.fn();
    greet.mockImplementation((name) => console.log("Hello, " + name));

    greet("Damilola");
    expect(greet).toHaveBeenCalled();
    expect(greet).toHaveBeenCalledWith("Damilola");
    expect(greet).toHaveBeenCalledOnce();
  });

  // matchers for writing assertions against mock fns.
  //   toHaveBeenCalled
  //   toHaveBeenCalledWith
  // toHaveBeenCalledOnce
});

describe("test suite", () => {
  test("test case", () => {
    const sendText = vi.fn();
    sendText.mockReturnValue("ok");

    const result = sendText("hello");

    expect(sendText).toHaveBeenCalledWith("hello");
    expect(result).toMatch(/ok/i);
  });
});

// mocking modules -> vi.mock('path') to mock a module
//  to make our unit tests dependendt, they shouldnt be dependent on any global state or random values (Math.random()) or date time cuz they can change from execution.

// vi.mock() replaces every exported function in path with a mock fn.
// vi.mock() is also hoisted (raised to the top of the file.)

describe("getPriceInCurrency", () => {
  test("should return price in target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(0.5);

    const result = getPriceInCurrency(10, "NGN");
    expect(result).toBe(5);
  });
});

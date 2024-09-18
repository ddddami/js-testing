// mock fn to test fns in isolation.

import { it, expect, describe, vi, test } from "vitest";

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

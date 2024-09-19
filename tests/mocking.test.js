// mock fn to test fns in isolation.

import { it, expect, describe, vi, test } from "vitest";
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");

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

describe("getShippingInfo", () => {
  it("should return shipping cost for a destination", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });
    const result = getShippingInfo("Nigeria");

    expect(result).toMatch(/shipping cost: \$10 \(2 days\)/i);
  });

  it("should return shipping unavailble if quote canot be fetched", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const result = getShippingInfo("Nigeria");
    expect(getShippingQuote).toHaveBeenCalled();
    expect(result).toMatch(/unavailable/i);
  });
});

// interaction testing - testing the btw different units/fns
// -> to provide values, to test the interaction btw units

describe("renderPage", () => {
  it("should return correct content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it("should call analytics", async () => {
    const result = await renderPage();

    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  const order = { totalAmount: 100 };
  const creditCard = { creditCardNumber: 4222 };
  it("should call charge", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });
    const result = await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it("should return successful is charge is successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });
    const result = await submitOrder(order, creditCard);

    expect(result).toHaveProperty("success", true);
  });

  it("should return failed is charge is unsuccessful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });
    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: "payment_error" });
  });
});

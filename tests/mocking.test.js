// mock fn to test fns in isolation.

import { it, expect, describe, vi, test, beforeEach } from "vitest";
import {
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");
vi.mock("../src/libs/email", async (importOriginal) => {
  const originalModule = await importOriginal();
  return { ...originalModule, sendEmail: vi.fn() };
});

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

describe("signUp", () => {
  //the `mock` property is global.. it accumulates info btw different test cases.
  // best practice, clear mocks before /  after each test
  // CLEARING MOCKS
  // mockClear() - clears all info about every call
  // mockReset() - same as mockClear and change the implementation of mock fn to an empty
  // mockRestore() - same as mockClear, but restore the inner function to the original implementation (only makes sense in spies)
  // practically, most of the times we use mockClear.

  // do for every mock fn. or vi.clearAllMocks()
  //  or better,  configure vitest to auto clear all mocks before each test.
  beforeEach(() => {
    // vi.clearAllMocks()
    vi.mocked(sendEmail).mockClear(); // not needed again cause of clearMocks: true in defineConfig
  });

  const email = "damilola@trulydami.me";
  it("should call return false if email is not valid", async () => {
    const result = await signUp();
    expect(result).toBe(false);
  });

  it("should send welcome email if email is valid", async () => {
    // vi.mocked(sendEmail).mock
    const result = await signUp(email);
    // expect(sendEmail).toHaveBeenCalledWith(email, "Welcome aboard!"); to use regex for welcome aboard!
    expect(sendEmail).toHaveBeenCalled();
    const args = vi.mocked(sendEmail).mock.calls[0]; // returns what the fn has been called with
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });

  it("should return true if email is valid", async () => {
    const result = await signUp(email);
    expect(result).toBe(true);
  });
});

// Spying on functions
// -  sometimes, we need to monitor the behaviour of fns during test execution

describe("login", () => {
  // in addition to spying on a fn, you can also change it's implementation
  it("should email one-time login code", async () => {
    const email = "damilola@trulydami.me";
    const spy = vi.spyOn(security, "generateCode");
    await login(email);

    const securityCode = spy.mock.results[0].value;
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode.toString());
  });
});

//  use mocks only for testing
// PROBLEM WITH tests that use mocks -> become dependent on implementation of our units
// if our tests know too much of the implementation, they are more likely to break when we change implementation

// USE THEM ONLY FOR MOCKING EXTERNAL DEPENDENCIES (DBS, NETWORKS, SLOW SERVICES, MAY NOT BE AVAILABLE SERVICES)

// trustworthy tests are deterministic. to make sure they are -
// should not be dep. on:
// - any random data
// - shared state
// - current date and time
// - any global - shared state

describe("isOnline", () => {
  it("should return true if current hour is inside opening hours", () => {
    vi.setSystemTime("2024-01-01 08:05");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-01-01 08:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-01-01 19:59");
    expect(isOnline()).toBe(true);
  });

  it("should return false if current hour is outside opening hours", () => {
    vi.setSystemTime("2024-01-01 07:55");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2024-01-01 20:01");
    expect(isOnline()).toBe(false);
  });
});

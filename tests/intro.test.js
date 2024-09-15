import { it, expect, describe } from "vitest";
import { calculateAverage, fizzBuzz, max } from "../src/intro";

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

describe("fizzBuzz", () => {
  it("should return Fizz if number is divisible by 3", () => {
    expect(fizzBuzz(3)).toBe("Fizz");
  });

  it("should return Buzz if number is divisible by 5", () => {
    expect(fizzBuzz(5)).toBe("Buzz");
    expect(fizzBuzz(50)).toBe("Buzz");
  });

  it("should return number as a string if it is not divisible by 3 and 5", () => {
    expect(fizzBuzz(1)).toBe("1");
    expect(fizzBuzz(2)).toBe("2");
  });
});

describe("calculateAverage", () => {
  it("should return NaN if no arguements are passed", () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  it("should calculate the average of an array with a single element", () => {
    expect(calculateAverage([1])).toBe(1);
  });

  it("should calculate the average of an array with a two elements", () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });

  it("should calculate the average of an array with a three elements", () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

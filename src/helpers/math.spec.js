import { round, limit, floor2zero } from "./math";

describe("function round", () => {
  it("should round a value to the closed number with n decimals", () => {
    expect(round(5.111, 0)).toBe(5);
    expect(round(5.4582, 1)).toBe(5.5);
    expect(round(5.7643, 2)).toBe(5.76);
  });
});

describe("function limit", () => {
  it("should return a number between the limits as itself", () => {
    expect(limit(0, 10, 5)).toBe(5);
  });

  it("should return max if number is bigger than max", () => {
    expect(limit(0, 10, 885)).toBe(10);
  });

  it("should return min if number is bigger than min", () => {
    expect(limit(0, 10, -885)).toBe(0);
  });
});

describe("function floor2zero", () => {
  it("should return a multiple of size", () => {
    expect(floor2zero(15.23, 2) % 2).toEqual(0);
  });

  it("should return a multiple of size", () => {
    expect(floor2zero(-15.23, 2)).toEqual(-14);
  });
});

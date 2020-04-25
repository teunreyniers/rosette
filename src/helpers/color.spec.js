import { component2hex, rgb2hex } from "./color";

describe("function component2hex", () => {
  it("should convert a decimal number between 0, 255 to a hex 2 character string", () => {
    expect(component2hex(16)).toEqual("10");
  });

  it("should insert a leading 0 for numbers lower than 16", () => {
    expect(component2hex(5)).toEqual("05");
  });

  it("should truncate numbers bigger than 255", () => {
    expect(component2hex(1000)).toEqual("ff");
  });

  it("should treat numbers lower than zero as zero", () => {
    expect(component2hex(-5)).toEqual("00");
  });
});

describe("function rgb2hex", () => {
  it("should convert parameters r, g, b to a hex color", () => {
    expect(rgb2hex(16, 255, 45)).toEqual("#10ff2d");
  });
});

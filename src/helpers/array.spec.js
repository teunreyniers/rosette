import { move } from "./array";

describe("function move", () => {
  it("should move element 2 to position 2", () => {
    expect(move([1, 2, 3, 4, 5], 2, 4)).toEqual([1, 2, 4, 5, 3]);
  });

  it("should move the last element to the first place", () => {
    expect(move([1, 2, 3, 4, 5], 4, 0)).toEqual([5, 1, 2, 3, 4]);
  });

  it("should create new elements if index is bigger than the array length", () => {
    expect(move([1, 2, 3, 4, 5], 3, 6)).toEqual([
      1,
      2,
      3,
      5,
      undefined,
      undefined,
      4,
    ]);
  });
});

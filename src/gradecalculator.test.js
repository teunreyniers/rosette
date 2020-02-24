import { getIndexNormal, getIndexAdvanced } from "./gradeCalculator";

test("result should be 4", () => {
  expect(getIndexNormal([0.1, 0.5, 0.6, 0.75], 0.65)).toBe(4);
});

test("result should be 2", () => {
  expect(getIndexAdvanced([0.1, 0.5, 0.6, 0.75], 0.65, 0.5)).toBe(2);
});

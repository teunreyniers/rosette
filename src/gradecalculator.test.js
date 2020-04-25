import {
  getDeviations,
  getIndexNormal,
  getIndexAdvanced,
} from "./gradeCalculator";

test("test getDeviations", () => {
  expect(
    getDeviations(
      {
        key: "dd1",
        name: "Fysics",
        scores: [1, 2, 3, 4],
        tbs: 4,
        threshold: 0.6,
      },
      2,
      { mode: "advanced", thresholds: [0.5, 0.6, 0.75] }
    )
  ).toBe(3);
});

test("result should be 4", () => {
  expect(getIndexNormal([0.1, 0.5, 0.6, 0.75], 0.65)).toBe(4);
});

test("result should be 2", () => {
  expect(getIndexAdvanced([0.5, 0.6, 0.75], 0.65, 0.6)).toBe(2);
});

test("result should be 3", () => {
  expect(getIndexAdvanced([0.5, 0.6, 0.75], 0.79, 0.6)).toBe(3);
});

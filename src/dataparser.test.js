import {
  parseReference,
  createReference,
  getAlpha,
  sheetToArray
} from "./dataparser";

test("parseReference of B3 should be row: 3, col:2", () => {
  expect(parseReference("B3")).toEqual({ row: 3, col: 2 });
});

test("parseReference of DB82 should be row: 82, col:106", () => {
  expect(parseReference("DB82")).toEqual({ row: 82, col: 106 });
});

test("createReference of 3,2 should be B3", () => {
  expect(createReference(3, 2)).toBe("B3");
});

test("createReference of 3,2 should be B3", () => {
  expect(createReference(26, 26)).toBe("Z26");
});

test("parseReference and createReference should cancel out", () => {
  const { row, col } = parseReference("ABC123");
  expect(createReference(row, col)).toBe("ABC123");
});

test("getApha 8 should be H", () => {
  expect(getAlpha(8)).toBe("H");
});

test("getAlpha 36 should be AJ", () => {
  expect(getAlpha(36)).toBe("AJ");
});

test("sheetToArray 2x2", () => {
  const sheet = {
    "!ref": "B3:C4",
    B3: 1,
    C3: 3,
    C4: 4,
  }
  const result = [[1,3],["",4]]
  expect(sheetToArray(sheet)).toEqual(result);
});

import { v4 as uuidv4 } from "uuid";

export function parseReference(ref) {
  let row = 0;
  let col = 0;
  for (let c of ref) {
    if (/^[A-Z]+$/i.test(c)) {
      col = col * 26 + c.charCodeAt(0) - "A".charCodeAt(0) + 1;
    } else if (/^[0-9]+$/i.test(c)) {
      row = row * 10 + parseInt(c);
    }
  }
  return { row, col };
}

export function createReference(row, col) {
  return getAlpha(col) + row;
}

export function getAlpha(num) {
  let result = "";
  while (num > 0) {
    num--; // 1 => a, not 0 => a
    const remainder = num % 26;
    const digit = String.fromCharCode("A".charCodeAt(0) + remainder);
    result = digit + result;
    num = (num - remainder) / 26;
  }
  return result;
}

export function sheetToArray(sheet) {
  const [start, end] = sheet["!ref"].split(":").map(parseReference);

  let result = [];
  for (let i = start.row; i <= end.row; i++) {
    let row = [];
    for (let j = start.col; j <= end.col; j++) {
      const value = sheet[createReference(i, j)];
      if (value) {
        row.push(value);
      } else {
        row.push("");
      }
    }
    result.push(row);
  }
  return result;
}

export function parseSheet(sheet, options = undefined) {
  const {
    sectionsrow,
    partrow,
    tbsrow,
    thresholdrow,
    datarow,
    datacol,
    studentcol
  } = {
    ...options,
    sectionsrow: (options && options.sectionsrow) || 0,
    partrow: (options && options.partrow) || 1,
    datarow: (options && options.datarow) || 2,
    datacol: (options && options.datacol) || 1,
    studentcol: (options && options.studentcol) || 0
  };

  sheet = sheetToArray(sheet);
  const collector = {};

  for (let i = datacol; i < sheet[0].length; i++) {
    if (!collector[sheet[sectionsrow][i].v]) {
      collector[sheet[sectionsrow][i].v] = {
        parts: []
      };
    }
    collector[sheet[sectionsrow][i].v].parts.push({
      key: uuidv4(),
      name: sheet[partrow][i].v,
      scores: sheet.slice(datarow).map(r => r[i].v),
      tbs: tbsrow ? sheet[tbsrow][i].v : 0,
      threshold: thresholdrow ? sheet[thresholdrow][i].v : 0
    });
  }

  const sections = Object.entries(collector).map(([key, value]) => ({
    key: uuidv4(),
    name: key,
    ...value
  }));
  const students = sheet.slice(datarow).map(r => ({
    key: uuidv4(),
    name: r[studentcol].v
  }));

  return { students, sections };
}

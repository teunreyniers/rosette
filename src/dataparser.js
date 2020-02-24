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
  return result
}

export function parseSheet(sheet){

}
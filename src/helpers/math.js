export function round(x, decimal) {
  return Math.round(x * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function limit(min, max, x) {
  return Math.min(max, Math.max(min, x));
}

export function floor2zero(x, size) {
  return Math.sign(x) * Math.floor(Math.abs(x) / size) * size;
}

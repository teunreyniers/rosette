export function component2hex(c) {
  const hex = Math.min(255, Math.max(0, c)).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgb2hex(r, g, b) {
  return "#" + component2hex(r) + component2hex(g) + component2hex(b);
}

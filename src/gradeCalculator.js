export function getSectionByIndex(sections, index, dataoptions) {
  const r = sections.map(e => ({
    ...e,
    parts: e.parts
      .map(p => ({
        ...p,
        devitions: getDeviations(p, index, dataoptions)
      }))
      .filter(p => p.devitions !== undefined)
  }));

  return r;
}

export function getDeviations(part, index, dataoptions) {
  const value = part.scores[index];
  if (value === "") return undefined;
  if (dataoptions.mode === "normal") {
    return getIndexNormal(
      dataoptions.thresholds.map(e => parseFloat(e)),
      parseFloat(value) / parseFloat(part.tbs)
    );
  } else if (dataoptions.mode === "advanced") {
    return getIndexAdvanced(
      dataoptions.thresholds.map(e => parseFloat(e)),
      parseFloat(value) / parseFloat(part.tbs),
      parseFloat(part.threshold)
    );
  } else {
    return value;
  }
}

export function getIndexNormal(thresholds, value) {
  let i = thresholds.length - 1;
  while (value < thresholds[i] && i >= 0) {
    i -= 1;
  }
  return i + 2;
}

export function getIndexAdvanced(thresholds, value, threshold) {
  let i = thresholds.length - 1;
  while (
    value <
    threshold +
    ((thresholds[i] - thresholds[0]) / (1 - thresholds[0])) *
    (1 - threshold) &&
    i >= 0
  ) {
    i -= 1;
  }
  return i + 2;
}
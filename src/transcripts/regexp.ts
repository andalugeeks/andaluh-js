export function matchWholeWordFromSubexpressionAtEnd(exp) {
  return matchWholeWord(`(\\p{L}*)${exp}`);
}

export function matchWholeWordFromSubexpression(exp) {
  return matchWholeWord(`(\\p{L}*)${exp}(\\p{L}*)`);
}

export function matchWholeWord(exp) {
  return `(?=|$|[^\\p{L}])${exp}(?=^|$|[^\\p{L}])`;
}
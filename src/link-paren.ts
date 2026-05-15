/**
 * Find the closing `)` for a Markdown inline link `(destination)`,
 * respecting nested parentheses and single/double-quoted spans.
 */
export function findLinkClosingParen(source: string, openParenIndex: number): number {
  let depth = 1;
  let inString: '"' | "'" | null = null;

  for (let i = openParenIndex + 1; i < source.length; i++) {
    const ch = source[i];
    const prev = i > 0 ? source[i - 1] : "";

    if (inString) {
      if (ch === inString && prev !== "\\") inString = null;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = ch;
      continue;
    }

    if (ch === "(") {
      depth++;
      continue;
    }

    if (ch === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }

  return -1;
}

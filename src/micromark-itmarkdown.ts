/**
 * micromark extension spike for it-markdown
 *
 * This prototype demonstrates how micromark could tokenize `!type:attrs`
 * link destinations before generic link parsing, enabling native support
 * in micromark-based tools.
 *
 * Current status: SPIKE - not production ready
 *
 * @see https://github.com/micromark/micromark#creating-syntaxes
 */
import { micromark, type Options } from "micromark";

export function renderWithMicromark(source: string, options?: Options): string {
  return micromark(source, options);
}

export const itMarkdownExtension = {
  name: "it-markdown",
  parser: {
    resolveAll() {
      return;
    },
  },
};

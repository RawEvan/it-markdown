import { micromark } from "micromark";

/**
 * Renders a Markdown fragment with the core **micromark** tokenizer/compiler.
 *
 * This is a **compatibility probe**, not the production iMD pipeline (which uses `marked`
 * today). Micromark accepts opaque destinations such as `[label](!demo)`; destinations
 * containing `!type:key=value` (a colon after the type token) are not reliably preserved
 * by core CommonMark tokenization, which is why this repo preprocesses iMD before Markdown.
 */
export function micromarkRenderHtmlFragment(md: string): string {
  return micromark(md);
}

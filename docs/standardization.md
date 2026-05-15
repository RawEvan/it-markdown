# Standardization path

This document is a **narrative placeholder** for coordinating with the wider Markdown ecosystem. It is not a formal standards proposal.

## Relation to CommonMark and GFM

- **CommonMark**: Documents using only standard syntax remain valid CommonMark. Extensions live in link destinations (`!type:…`) and single-line block prefixes (`[!tab:]`, `[!collapse:]`), which generic renderers treat as ordinary links or plain text lines.
- **GitHub Flavored Markdown (GFM)**: Compatible as far as extensions do not conflict with GFM tables, task lists, and autolinks. Any future clash would be resolved in favour of de-facto GFM behaviour in shared contexts.

## Where proposals could go

Reasonable venues over time (subject to community norms):

- [CommonMark forum](https://talk.commonmark.org/) — discussion and design feedback for Markdown-related extensions.
- Reference **cmark**/**micromark** ecosystems — if an extension becomes a formal optional module, a micromark extension tokenizing `!type:` *before* generic link parsing would align tokenizer behaviour (see notes in `SPEC.md`).

## Proposal draft outline (future work)

1. **Problem statement**: bounded interactive documentation in Markdown without arbitrary JSX.
2. **Syntax**: normative grammar for link and block extensions (mirror `SPEC.md` + fixtures).
3. **HTML mapping**: default safe attributes (`data-imd-*` today; subject to rename if the project adopts a neutral hook namespace).
4. **Security model**: no execution in reference render; optional client runtime contract.
5. **Interoperability**: fallback behaviour in non-supporting renderers; file suffix remains `.md`.

Replace this outline with a link to an external draft when one exists.

## File names

Extensions are **in-band** in `.md` sources; there is no separate file extension for “extended” documents. See `SPEC.md` / repository README for rationale.

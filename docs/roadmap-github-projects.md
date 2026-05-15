# Roadmap ↔ GitHub Projects (suggested milestones)

Map **SPEC.md** phases to trackable columns in a GitHub Project (titles are suggestions only).

| Milestone / column | Scope |
|--------------------|--------|
| **M1 — Corpus & API** | Conformance ≥50 cases (done), CLI, semver + CHANGELOG. |
| **M2 — Editor** | VS Code marketplace-quality extension: grammar injection, preview, settings to disable for `*.md`. |
| **M3 — CI & hosting** | Reusable Actions adopted downstream; optional Pages deploy for playground. |
| **M4 — Ecosystem** | First-class VitePress or Docusaurus adapter package; OR Astro integration guide with tests. **Current repo ships** `examples/ssg-minimal` (plain Node) and `examples/playground` (Vite) as patterns, not full adapters. |
| **M5 — Standards** | CommonMark forum draft link; micromark extension spike merged or documented. |
| **M6 — Other editors** | Neovim Tree-sitter / Zed / JetBrains: contribute grammar + link to `fixtures/` (no first-party commitment required). |

Create a **Project** on GitHub, add these as **draft issues** or **milestones**, and link PRs to them.

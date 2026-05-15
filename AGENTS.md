# AGENTS.md

## Cursor Cloud specific instructions

**it-markdown** is a pure TypeScript library (no backend, no database, no Docker). All development commands are defined in `package.json`:

| Task | Command |
|------|---------|
| Install deps | `npm ci` (or `npm install`) |
| Run tests | `npm test` |
| Watch tests | `npm run test:watch` |
| Build | `npm run build` |

### Key notes

- The codebase lives on the `cursor/imd-bootstrap-8452` branch; `main` is currently a placeholder.
- Node.js >= 20 is required (`engines.node` in `package.json`). CI uses Node 22.
- Package manager is **npm** (lockfile: `package-lock.json`).
- Build output goes to `dist/` via `tsc`. No bundler is used.
- Tests use **Vitest** with `environment: "node"`. Test files are co-located with source in `src/**/*.test.ts`.
- There is no lint script configured yet; TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`) serves as the primary code quality gate.
- The library has a single runtime dependency: `marked` v15.
- No external services, secrets, or environment variables are needed.

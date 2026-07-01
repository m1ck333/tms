# TMS

Monorepo for the TMS frontend — EU and US products, each a desktop **dashboard**
and a mobile **PWA**, built on shared packages.

## Quick start

```bash
pnpm install       # link workspace packages + install tooling
pnpm lint          # eslint across the workspace
pnpm format        # prettier --write
pnpm format:check  # prettier --check (CI)
pnpm typecheck     # tsc --noEmit in every package
```

Node ≥ 22, pnpm ≥ 10 (see `.nvmrc`). **pnpm only — never npm.**

## Structure

```
packages/  ui  core  theme-eu  theme-us     # shared, symlinked as @tms/*
apps/      eu-dashboard  eu-pwa  us-dashboard  us-pwa
docs/      RULES.md  ARCHITECTURE.md
```

- **`@tms/ui`** — shared components (`primitives` / `desktop` / `mobile`).
- **`@tms/core`** — shared plumbing shape (i18n, data layer, auth, routing).
- **`@tms/theme-eu` / `@tms/theme-us`** — brand skins (tokens + logo).
- **apps** — thin; consume the packages and hold region-specific logic.

## Read before contributing

- **[docs/RULES.md](docs/RULES.md)** — the standard every change is reviewed against.
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — structure, decisions, build phases.

Status: **Phase 1 (foundation)**. Apps are placeholders until Phase 2.5.

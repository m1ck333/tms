# TMS Frontend — Architecture

## What this is

One pnpm monorepo for **four apps** — EU and US, each a desktop **dashboard** and a
mobile **PWA** — built on shared packages. The EU and US products are similar
(logic differs a little per region); the UI is the same components in different
brand skins.

## Why a monorepo (not two repos / a forked template)

The goal is that the four apps share UI and patterns. Shared UI only _stays_
shared if it is literally one thing all apps import — two forks drift apart the
moment each gets a customer. So: shared **packages**, consumed via pnpm workspace
**symlinks** (no registry, no publish, no Verdaccio — the source is right here).

## Layout

```
tms/
├── packages/
│   ├── ui/           # dashboard component library (shadcn) — flat src/components/
│   │   └── src/{components,lib,styles}/
│   ├── core/         # plumbing SHAPE: i18n, data layer, auth, routing, form+Zod
│   ├── theme-eu/     # EU brand tokens + logo
│   └── theme-us/     # US brand tokens + logo
├── apps/
│   ├── eu-dashboard/  eu-pwa/     # dashboard: @tms/ui · pwa: Ionic + Capacitor
│   └── us-dashboard/  us-pwa/     # both share @tms/core + theme + validation/i18n
├── docs/{RULES.md, ARCHITECTURE.md}
├── eslint.config.js  .prettierrc  tsconfig.base.json
└── pnpm-workspace.yaml
```

## Key decisions (settled)

| Decision          | Choice                         | Why                                              |
| ----------------- | ------------------------------ | ------------------------------------------------ |
| Structure         | one monorepo, shared packages  | only way "shared UI" stays true across apps      |
| Package linking   | pnpm workspace symlinks        | free, live, no publish/registry                  |
| Scope             | `@tms/*`                       | names the shared domain; "skyhard" is a joke     |
| Brand per region  | theme packages (tokens + logo) | same components, different skin                  |
| UI split          | primitives / desktop / mobile  | split by form factor, not by app                 |
| Component preview | showcase route (not Storybook) | solo reviewer; zero tooling/maintenance tax      |
| Stack             | same as the demo               | proven; some choices are BE-driven, BE unchanged |

## Stack

Same as the EU demo (deliberately — it's proven and BE-driven choices are
unchanged): React 19, TS strict, Vite 7, Tailwind 4, shadcn/ui, Apollo 4 +
TanStack Query 5, TanStack Table 8, RHF 7 + Zod 4, react-i18next, Recharts,
Vitest. pnpm only.

## Build phases (review-gated — stop and review after each)

- **Phase 1 — Foundation & rules** _(this)_: monorepo scaffold, tooling
  (Prettier/ESLint/TS + import boundaries), the `docs/` rulebook, package stubs.
  No UI, no app wiring yet.
- **Phase 2 — Design system**: theme tokens (eu/us), shadcn primitives, the three
  component layers, app layout shells, the showcase route.
- **Phase 2.5 — Wiring**: scaffold the four Vite apps; wire auth, routing, and the
  data layer; i18n runtime; a couple of placeholder routes.
- **Then**: skeleton done — wait for a signed company, fill in feature modules.

"Skeleton done" = everything the _same for every trucking company_ is built;
nothing that _varies per company_ (the feature modules) is.

## Deferred from Phase 1 (intentionally)

- **i18n runtime wiring** — the rule and per-app locale convention are set here;
  the react-i18next factory needs React, so it lands with `@tms/core` in Phase 2/2.5.
- **App scaffolds** — apps are empty placeholders until Phase 2.5.
- **Import-boundary lint** — configured now, but only exercises real cross-layer
  imports once components exist in Phase 2.

## PWA stack (settled)

- **PWA = Ionic React 8 + Capacitor, PWA-first.** Ionic and shadcn are different
  UI systems that don't mix, so **`@tms/ui` (shadcn) is dashboards-only** — one
  flat `components/` library, no form-factor split (mobile is Ionic's job in the
  PWA app).
- **Distribution path:** ship an installable PWA now (no store accounts, free),
  then add native iOS/Android from the **same Capacitor codebase** later when
  background GPS / store presence justifies the cost (Apple $99/yr, Google $25
  once; Android can sideload account-free). Some features (reliable background
  location) are native-build-only.
- **Dashboard ↔ PWA share** `@tms/core` (logic/hooks/data layer), Zod validation,
  i18n, types, and the raw brand palette (→ Tailwind vars for the dashboard, →
  Ionic CSS vars for the PWA) — **not** UI components.

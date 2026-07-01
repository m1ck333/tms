# TMS Frontend — Rules

The standard every change is reviewed against. Short, enforceable, and the reason
this repo won't drift the way an unreviewed codebase does. If a rule here is wrong,
change the rule in a commit — don't quietly break it.

> Legend: **[lint]** enforced by tooling · **[review]** enforced by human review

---

## 1. Localization

- **[review]** Every user-visible string goes through `t()`. No hardcoded UI text.
  - Only exception: strings identical in every language (e.g. "Status", brand names).
- EU apps: `sr` is default, `en` is fallback. US apps: `en` is default.
- Locale content is **per app** (not shared) — it differs by region.
- Keys are namespaced by feature (`common`, `navigation`, `<feature>`).

## 2. Styling & brand

- **[review]** Tailwind 4 + CSS custom properties (`@theme`). **No SCSS.** One
  styling system, never two.
- **[review]** Components never hardcode a brand color or logo. Colors come from
  theme tokens (`@tms/theme-eu` / `@tms/theme-us`); the logo comes through a slot.
- Dark mode via the same token system.
- **[review]** **One color palette.** Only the semantic tokens exist (`primary`,
  `muted`, `accent`, `border`, …); no ad-hoc hex/oklch in components. Neutrals are
  a single shared palette in `base.css`; a brand overrides **only** `--primary`
  and `--ring` — nothing else is tinted per brand.
- **[review]** **Consistent control radius.** Every form control — button, input,
  select, multiselect, textarea — uses `rounded-md` (→ `--radius-md`). Reskin all
  by changing `--radius`. Don't set per-control radii.
- **[review]** **z-index only from the named scale** (`z-dropdown`, `z-sticky`,
  `z-overlay`, `z-modal`, `z-popover`, `z-tooltip`, `z-toast`). Never `z-[999]`.
- **[review]** **Breakpoints defined once** in `base.css` (`--breakpoint-*`).
  Both CSS (`sm:`/`md:`/…) and the `useBreakpoint` hook (`@tms/core`, reads the
  same vars) use them — never a hardcoded pixel width in JS.

## 3. Component layering (`@tms/ui`)

- **[lint]** Three layers: `primitives/` (agnostic), `desktop/` (dashboard),
  `mobile/` (pwa). `desktop` and `mobile` never import each other; both may use
  `primitives`; `primitives` import neither. Enforced by `eslint-plugin-boundaries`.
- **[review]** A component is a **primitive only if** it works unchanged on touch
  and desktop. In doubt → not a primitive.
- **[review]** Every shared component is added to the showcase route in all its
  states (default / loading / empty / error / disabled).

## 4. Shared vs per-region

| Shared (`packages/*`)                         | Per-region (in each app)                      |
| --------------------------------------------- | --------------------------------------------- |
| UI components, theme token _system_, patterns | brand tokens' values, logo                    |
| plumbing shape (auth, data layer, routing)    | formatters (date/currency/units)              |
| form+Zod primitives, shared utils             | validation rules (EU PIB/JMBG vs US EIN/SSN)  |
|                                               | locale content, BE contract / generated types |
|                                               | feature / domain logic                        |

- **[review]** Promote something into a shared package **only after both regions
  use it the same way.** Premature sharing is drift.
- **[review]** Shared **app-level** hooks/utils live in `@tms/core` under `hooks/`
  and `utils/` — region-agnostic plumbing used by apps (`useDebounce`,
  `useTableSort`, `downloadFile`). Region-specific ones stay in the app.
- **[review]** **Styling/UI helpers stay in `@tms/ui`** (`src/lib/`, e.g. `cn`) —
  they belong to the component library, not `@tms/core`. Dependency direction:
  `@tms/ui` must **not** import `@tms/core`; `ui` and `core` are siblings, both
  consumed by apps (`theme ← ui`, plus `core`, all used by apps).
- **[review]** Formatters/validators use **shared logic + per-region config**: a
  generic helper in `@tms/core` (locale/currency/rules as params), and a thin
  per-app wrapper that supplies EU vs US config. The _how_ is shared and reviewed
  once; the _what_ is per app.
- **[review]** Form-factor-specific hooks go with their layer in `@tms/ui`
  (`mobile`/`desktop`) or the app — not `@tms/core`.

## 5. Data layer

- **[review]** GraphQL (Apollo) for reads; REST (TanStack Query) for writes.
- After every REST mutation, refetch the affected Apollo queries.
- (Mirrors the demo. Per-region BE, so queries/types live in each app.)

## 6. Forms

- **[review]** React Hook Form + a Zod schema in `schemas.ts`, via `zodResolver`.
  Schemas are shared by the form and its tests.
- **[review]** Numbers use `NumberInput`, never `<input type="number">`. Numeric
  fields default to `undefined` (empty with a placeholder), not `0`.

## 7. TypeScript & imports

- **[lint]** `strict` on; the demo's strict flags stay on (see `tsconfig.base.json`).
- **[lint]** Cross-package imports use the package name (`@tms/ui/...`), never a
  deep relative path into another package.
- **[review]** No `any` except the documented Zod-4 resolver cast.

## 8. Naming & structure

- **[review]** Files kebab-case; React components PascalCase; hooks `useX`.
- **[review]** Feature-based folders inside apps: `api/ components/ pages/ types/
schemas.ts` (same shape as the demo).

## 9. Icons, dates, currency

- **[review]** Icons: Lucide only.
- **[review]** Dates via a shared `formatDate`; currency via `formatCurrency` —
  but the **locale/format is region-specific** (EU `dd.MM.yyyy`/EUR vs US
  `MM/dd/yyyy`/USD), so the config is supplied per app.

## 10. Workflow

- **[review]** Changes are small and scoped — one feature or fix per reviewable
  unit. Split large diffs.
- **[review]** Each change states its intent, the pattern it mirrors, and what was
  deliberately left out. "Why is this here?" → deleting is a valid answer.
- **[lint]** `pnpm lint`, `pnpm format:check`, and `pnpm typecheck` must pass
  before a change is considered done. Pre-commit runs lint-staged (husky).

### Git & running the app (hard rules)

- **Never `git commit`, `push`, or deploy without the user's explicit
  confirmation each time.** Prior approval does not carry to the next action.
- **Never run or restart a dev server.** Building (`vite build`), lint, typecheck
  and tests are fine; starting/restarting a server is the user's job — ask them.
- **Don't commit per small change.** Group related work into one meaningful commit
  once a reviewable unit is complete and approved.
- **Commit message style:** `<type>: <short imperative summary>` (~50 chars,
  lowercase). Types: `feat` `fix` `chore` `docs` `refactor` `test` `style`. Add a
  short body only when the "why" isn't obvious. **No attribution / co-author
  trailers.** Example: `feat: add Button primitive with brand tokens`.

## 11. Where rules live

Single source of truth, no duplication.

| Scope                 | Location                                | Example                                  |
| --------------------- | --------------------------------------- | ---------------------------------------- |
| Monorepo-wide         | `docs/RULES.md` (this file)             | localization, no SCSS, commit style      |
| Claude behavior       | root `CLAUDE.md`                        | never commit without asking, small diffs |
| Package-specific      | that package's `README.md`              | `@tms/ui` layer/import rules             |
| App / region-specific | `apps/<app>/CLAUDE.md` (or `README.md`) | EU PIB/JMBG + `sr`; US EIN/SSN + `en`    |

- Nested `CLAUDE.md` files are auto-loaded by Claude Code when working in that
  subtree, on top of the root one.
- **[review]** A rule is written **once**. Local files hold only what is genuinely
  local and link back here for shared rules — never restate a shared rule (that
  drifts).

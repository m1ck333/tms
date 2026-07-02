# @tms/ui

Component library for the **dashboards** (eu/us), built on shadcn + Tailwind. The
PWAs use Ionic, not this library (see `docs/ARCHITECTURE.md`).

## Structure

Flat — one library, one import. No form-factor split.

```
src/
├── index.ts       # single barrel  →  import { Button, DataTable, cn } from '@tms/ui'
├── lib/           # cn, UiStringsProvider / useUiStrings
├── styles/        # base.css (tokens, @theme mapping, z-index/breakpoints, font)
└── components/    # every component (one file each; a folder only if multi-file)
```

- **Import from `@tms/ui`** (single entry). `@tms/ui/styles/base.css` for the CSS.
- One file per component; a component gets its own folder only if it truly spans
  multiple files.

## Brand

Components never hardcode color or logo. Colors come from Tailwind 4 CSS variables
provided by `@tms/theme-eu` / `@tms/theme-us`; the logo comes through a slot/prop.
Same components, different skin per region.

## i18n

`@tms/ui` never calls `t()`. Generic strings come from `UiStringsProvider`
(English defaults); apps map `t()` → the provider once. Per-instance text
(label/placeholder) is a normal prop.

## Showcase

Every component is added to the showcase (`apps/showcase`, port 5588) in each of
its states. That app — not Storybook — is how we review how components look, in
both brands and light/dark.

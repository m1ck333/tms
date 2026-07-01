# @tms/ui

Shared, brand-agnostic component library for every TMS app (eu/us · dashboard/pwa).

## Layers

| Folder        | For        | Assumes                          | Import rule                   |
| ------------- | ---------- | -------------------------------- | ----------------------------- |
| `primitives/` | both       | works on touch **and** desktop   | imports nothing form-specific |
| `desktop/`    | dashboards | hover, keyboard, dense, ≥1024px  | may use `primitives/`         |
| `mobile/`     | pwas       | touch, thumb-reach, small screen | may use `primitives/`         |

**`desktop/` and `mobile/` never import each other.** This is enforced by
`eslint-plugin-boundaries` (see root `eslint.config.js`).

## Deciding where a component goes

Put it in `primitives/` **only if** it renders and behaves correctly on both a
touch phone and a desktop with no changes. Assumes hover/keyboard/dense → `desktop/`.
Assumes touch/small-screen → `mobile/`. When in doubt, it is **not** a primitive.

## Brand

Components must never hardcode color or logo. Colors come from Tailwind 4 CSS
variables provided by `@tms/theme-eu` / `@tms/theme-us`; the logo comes through a
slot/prop. Same components, different skin per region.

## Showcase

Every component is added to the showcase route in each of its states (default /
loading / empty / error / disabled). That route — not Storybook — is how we
review how components look, in both brands and light/dark.

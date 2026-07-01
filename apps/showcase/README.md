# @tms/showcase

Dev-only host for viewing `@tms/ui` components in both brands (eu/us) and
light/dark. **Not a product app** — it's how we review how components look,
instead of Storybook (see `docs/RULES.md` §3).

```bash
pnpm --filter @tms/showcase dev    # user runs this; Claude never starts servers
# → http://localhost:5588  (fixed port, see vite.config.ts)
```

Toggles brand via `data-brand` on `<html>` and theme via the `.dark` class, so
one page proves components stay brand-agnostic.

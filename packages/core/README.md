# @tms/core

Shared, brand-agnostic **plumbing** — the _shape_ of how every app wires itself,
not any region's logic.

Lives here: i18n bootstrap, data-layer setup (Apollo + TanStack Query), auth +
token refresh, routing helpers, form+Zod primitives, shared utils.

Does **not** live here (per-region, lives in each app): formatters
(dates/currency/units), validation rules (EU PIB/JMBG vs US EIN/SSN), locale
content, BE contract / generated types, feature logic.

Rule of thumb: something is promoted into `@tms/core` only once **both** regions
have proven they use it the same way. Premature sharing is its own kind of drift.

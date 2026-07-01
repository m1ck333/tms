// @tms/core — shared, brand-agnostic plumbing SHAPE reused by every app:
//   - i18n bootstrap (react-i18next factory; apps supply their own locales)
//   - data layer (Apollo GraphQL reads + TanStack Query REST writes) setup
//   - auth + token refresh
//   - routing helpers (protected-route wrapper, etc.)
//   - form + Zod primitives, shared utils
//
// What does NOT live here (it varies per region, so it lives in each app):
//   - formatters (dates/currency/units), validation rules, locale content,
//     BE contract / generated types, feature/domain logic.
export {}

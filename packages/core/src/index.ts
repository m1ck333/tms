// @tms/core — shared, brand-agnostic plumbing SHAPE reused by every app:
//   - hooks (useOutsideClick, and app-level hooks like useDebounce/useBreakpoint)
//   - (to come) i18n bootstrap, data layer setup, auth, routing helpers
//
// What does NOT live here (it varies per region, so it lives in each app):
//   - formatters (dates/currency/units), validation rules, locale content,
//     BE contract / generated types, feature/domain logic.
export * from './hooks'

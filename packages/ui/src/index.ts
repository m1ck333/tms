// @tms/ui — shared component library.
// Barrel re-exports each form-factor layer. In apps, prefer the deep entry
// points (@tms/ui/primitives, @tms/ui/desktop, @tms/ui/mobile) so it stays
// obvious which form factor a component belongs to.
export * from './primitives'
export * from './desktop'
export * from './mobile'

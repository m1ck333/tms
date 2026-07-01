// Primitives — brand- & form-factor-agnostic. Must render and behave correctly
// on BOTH a touch phone and a desktop with no changes (e.g. Button, Input,
// Badge, Dialog, Sheet). Never hardcode a brand color or logo — consume theme
// tokens. When unsure whether something belongs here, it does NOT: a wrongly
// shared component is worse than a duplicated one.
export * from './button'

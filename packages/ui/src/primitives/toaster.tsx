import type { CSSProperties } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

// Toast host — render once at the app root: <Toaster />. Trigger toasts with the
// re-exported `toast(...)`. Colors map to our theme tokens, so toasts follow
// light/dark automatically (no theme prop wiring needed).
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
export { toast } from 'sonner'

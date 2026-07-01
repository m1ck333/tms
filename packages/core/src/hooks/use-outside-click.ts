import { useEffect, useRef } from 'react'

/**
 * Calls `handler` when a pointer/touch event happens outside the returned ref'd
 * element. Attach the ref to the element you want to protect.
 *
 * Note: Radix overlays (Dialog/Sheet/Popover/DropdownMenu) already dismiss on
 * outside click — use this only for custom, non-Radix dropdowns/menus/panels.
 *
 * @param handler called with the originating event when a click lands outside
 * @param enabled set false to detach the listener (e.g. while the panel is closed)
 */
export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
) {
  const ref = useRef<T>(null)
  const handlerRef = useRef(handler)

  // Keep the latest handler without re-attaching the listener every render.
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (!enabled) return
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current
      if (!el || el.contains(event.target as Node)) return
      handlerRef.current(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [enabled])

  return ref
}

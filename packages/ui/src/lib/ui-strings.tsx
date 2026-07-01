import { createContext, useContext, type ReactNode } from 'react'

// Generic, reusable strings baked into @tms/ui components. The library is
// i18n-agnostic — it never calls t(). It ships ENGLISH defaults; each app wraps
// its tree once in <UiStringsProvider value={{ noResults: t('ui.noResults'), … }}>
// to localize them. Per-instance text (label/placeholder) stays a normal prop.
export type UiStrings = {
  noResults: string
  loading: string
  clear: string
  close: string
  showPassword: string
  hidePassword: string
  remove: string
  selectPlaceholder: string
  searchPlaceholder: string
}

export const defaultUiStrings: UiStrings = {
  noResults: 'No results.',
  loading: 'Loading…',
  clear: 'Clear',
  close: 'Close',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  remove: 'Remove',
  selectPlaceholder: 'Select…',
  searchPlaceholder: 'Search…',
}

const UiStringsContext = createContext<UiStrings>(defaultUiStrings)

export function UiStringsProvider({
  value,
  children,
}: {
  value?: Partial<UiStrings>
  children: ReactNode
}) {
  return (
    <UiStringsContext.Provider value={{ ...defaultUiStrings, ...value }}>
      {children}
    </UiStringsContext.Provider>
  )
}

export function useUiStrings() {
  return useContext(UiStringsContext)
}

import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'
import { useUiStrings } from '../lib/ui-strings'
import { Badge } from './badge'
import { Label } from './label'
import { Spinner } from './spinner'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import type { SelectOption } from './select'

type MultiSelectProps = {
  options: SelectOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  /** Show a search box. Filtering is local unless `onSearch` is provided. */
  searchable?: boolean
  /** When set, search is server-side: the parent fetches and updates `options`. */
  onSearch?: (query: string) => void
  loading?: boolean
  disabled?: boolean
  /** Keep chips on one row; the real overflow (measured by width) collapses to a `+N` badge. */
  singleRow?: boolean
  emptyText?: string
  searchPlaceholder?: string
  label?: string
  helperText?: string
  error?: string
  required?: boolean
  className?: string
  id?: string
  name?: string
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder,
  searchable = false,
  onSearch,
  loading = false,
  disabled,
  singleRow = false,
  emptyText,
  searchPlaceholder,
  label,
  helperText,
  error,
  required,
  className,
  id,
  name,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const strings = useUiStrings()
  const generatedId = useId()
  const selectId = id || name || generatedId

  // Sticky cache: remember every option we've seen so chips survive server-side
  // search (when a selected option leaves the current `options`).
  const [seen, setSeen] = useState<Record<string, SelectOption>>({})
  const [prevOptions, setPrevOptions] = useState(options)
  if (options !== prevOptions) {
    setPrevOptions(options)
    setSeen((prev) => {
      const next = { ...prev }
      for (const o of options) next[o.value] = o
      return next
    })
  }
  const selectedOptions = value.map(
    (v) =>
      options.find((o) => o.value === v) ?? seen[v] ?? { value: v, label: v }
  )

  const toggle = (val: string) => {
    onChange?.(
      value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    )
  }

  // Responsive single-row: measure how many chips fit the available width and
  // collapse only the true overflow into `+N`. Recomputes on resize.
  const measureRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(selectedOptions.length)
  const selectedKey = value.join(',')
  useLayoutEffect(() => {
    if (!singleRow) return
    const el = measureRef.current
    if (!el) return
    const recompute = () => {
      const chips = Array.from(
        el.querySelectorAll<HTMLElement>('[data-measure-chip]')
      )
      const available = el.clientWidth
      const gap = 4
      const plusReserve = 44 // approx width of the "+N" badge
      let used = 0
      let count = 0
      for (let i = 0; i < chips.length; i++) {
        const next = used + (i > 0 ? gap : 0) + chips[i].offsetWidth
        const hasRest = i < chips.length - 1
        const limit = available - (hasRest ? plusReserve + gap : 0)
        if (next <= limit) {
          used = next
          count = i + 1
        } else {
          break
        }
      }
      setVisibleCount(count)
    }
    recompute()
    const ro = new ResizeObserver(recompute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [singleRow, selectedKey])

  const visibleOptions = singleRow
    ? selectedOptions.slice(0, visibleCount)
    : selectedOptions
  const hiddenCount = selectedOptions.length - visibleOptions.length

  const control = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          id={selectId}
          role="combobox"
          aria-expanded={open}
          aria-invalid={!!error}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex min-h-9 w-full cursor-pointer items-center gap-1 rounded-md border bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
        >
          <div
            className={cn(
              'relative flex min-w-0 flex-1 items-center gap-1',
              singleRow ? 'overflow-hidden' : 'flex-wrap'
            )}
          >
            {/* Invisible measuring layer: all chips, one row, for width math. */}
            {singleRow && (
              <div
                ref={measureRef}
                aria-hidden
                className="pointer-events-none invisible absolute inset-0 flex flex-nowrap items-center gap-1"
              >
                {selectedOptions.map((opt) => (
                  <span
                    key={opt.value}
                    data-measure-chip
                    className="inline-flex shrink-0"
                  >
                    <Badge
                      variant="secondary"
                      className="max-w-[12rem]"
                      onRemove={disabled ? undefined : () => {}}
                    >
                      <span className="truncate">{opt.label}</span>
                    </Badge>
                  </span>
                ))}
              </div>
            )}

            {selectedOptions.length === 0 && (
              <span className="text-muted-foreground px-1">
                {placeholder ?? strings.selectPlaceholder}
              </span>
            )}
            {visibleOptions.map((opt) => (
              <Badge
                key={opt.value}
                variant="secondary"
                className="max-w-[12rem] shrink-0"
                onRemove={disabled ? undefined : () => toggle(opt.value)}
              >
                <span className="truncate">{opt.label}</span>
              </Badge>
            ))}
            {hiddenCount > 0 && (
              <Badge variant="secondary" className="shrink-0">
                +{hiddenCount}
              </Badge>
            )}
          </div>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={!onSearch}>
          {searchable && (
            <CommandInput
              placeholder={searchPlaceholder ?? strings.searchPlaceholder}
              onValueChange={onSearch}
            />
          )}
          <CommandList>
            {loading ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                <Spinner size="sm" /> {strings.loading}
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText ?? strings.noResults}</CommandEmpty>
                <CommandGroup>
                  {options.map((opt) => {
                    const checked = value.includes(opt.value)
                    return (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        disabled={opt.disabled}
                        onSelect={() => toggle(opt.value)}
                      >
                        <Check
                          className={cn(
                            'size-4',
                            checked ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  if (!label && !helperText && !error) {
    return control
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={selectId} className={cn(error && 'text-destructive')}>
          {label}
          {required && (
            <span className="text-destructive" aria-hidden>
              *
            </span>
          )}
        </Label>
      )}
      {control}
      {error && <p className="text-destructive text-xs">{error}</p>}
      {helperText && !error && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
    </div>
  )
}

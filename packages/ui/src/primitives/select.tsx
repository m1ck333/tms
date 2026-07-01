import { useId, useState } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useUiStrings } from '../lib/ui-strings'
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

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type SelectProps = {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  /** Show a search box. Filtering is local unless `onSearch` is provided. */
  searchable?: boolean
  /** When set, search is server-side: the parent fetches and updates `options`. */
  onSearch?: (query: string) => void
  loading?: boolean
  disabled?: boolean
  clearable?: boolean
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

export function Select({
  options,
  value,
  onChange,
  placeholder,
  searchable = false,
  onSearch,
  loading = false,
  disabled,
  clearable,
  emptyText,
  searchPlaceholder,
  label,
  helperText,
  error,
  required,
  className,
  id,
  name,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const strings = useUiStrings()
  const generatedId = useId()
  const selectId = id || name || generatedId

  // Sticky cache: remember every option we've seen so the selected label
  // survives server-side search (when the option leaves the current `options`).
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
  const selected = value
    ? (options.find((o) => o.value === value) ??
      seen[value] ?? { value, label: value })
    : undefined

  const control = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={selectId}
          role="combobox"
          aria-expanded={open}
          aria-invalid={!!error}
          disabled={disabled}
          className={cn(
            'border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
            !selected && 'text-muted-foreground',
            className
          )}
        >
          <span className="truncate">
            {selected
              ? selected.label
              : (placeholder ?? strings.selectPlaceholder)}
          </span>
          <span className="flex items-center gap-1">
            {clearable && selected && !disabled && (
              <X
                className="text-muted-foreground hover:text-foreground size-4"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange?.('')
                }}
              />
            )}
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </span>
        </button>
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
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.label}
                      disabled={opt.disabled}
                      onSelect={() => {
                        onChange?.(opt.value)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'size-4',
                          opt.value === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {opt.label}
                    </CommandItem>
                  ))}
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

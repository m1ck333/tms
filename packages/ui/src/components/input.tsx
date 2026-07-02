import * as React from 'react'
import { forwardRef, useId, useState } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useUiStrings } from '../lib/ui-strings'
import { IconButton } from './button'
import { Label } from './label'

const inputStyles = cn(
  'border-input placeholder:text-muted-foreground flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'aria-invalid:border-destructive aria-invalid:ring-destructive/20'
)

type InputProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  label?: string
  helperText?: string
  error?: string
  required?: boolean
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'time'
    | 'datetime-local'
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  clearable?: boolean
  onClear?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      required,
      prefixIcon,
      suffixIcon,
      clearable,
      onClear,
      disabled,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const strings = useUiStrings()

    const generatedId = useId()
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type
    const inputId = id || props.name || generatedId
    const currentValue = value ?? ''
    const showClearButton =
      clearable && String(currentValue).length > 0 && !disabled
    const hasRightElement = suffixIcon || isPassword || showClearButton

    const handleClear = () => {
      onClear?.()
      onChange?.({
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>)
    }

    const inputElement = (
      <div className="relative">
        {prefixIcon && (
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 [&_svg]:size-4">
            {prefixIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          value={value}
          onChange={onChange}
          className={cn(
            inputStyles,
            prefixIcon && 'pl-10',
            hasRightElement && 'pr-10',
            className
          )}
          {...props}
        />

        {isPassword && (
          <IconButton
            type="button"
            variant="ghost"
            size="xs"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => setShowPassword(!showPassword)}
            icon={showPassword ? <EyeOff /> : <Eye />}
            aria-label={
              showPassword ? strings.hidePassword : strings.showPassword
            }
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
          />
        )}

        {showClearButton && !isPassword && (
          <IconButton
            type="button"
            variant="ghost"
            size="xs"
            tabIndex={-1}
            onClick={handleClear}
            icon={<X />}
            aria-label={strings.clear}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
          />
        )}

        {suffixIcon && !isPassword && !showClearButton && (
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 [&_svg]:size-4">
            {suffixIcon}
          </div>
        )}
      </div>
    )

    // Bare input when there's no field chrome to render.
    if (!label && !helperText && !error) {
      return inputElement
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label htmlFor={inputId} className={cn(error && 'text-destructive')}>
            {label}
            {required && (
              <span className="text-destructive" aria-hidden>
                *
              </span>
            )}
          </Label>
        )}

        {inputElement}

        {error && (
          <p id={`${inputId}-error`} className="text-destructive text-xs">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-muted-foreground text-xs">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }

import * as React from 'react'
import { forwardRef, useId } from 'react'
import { cn } from '../lib/utils'
import { Label } from './label'

type TextareaProps = React.ComponentProps<'textarea'> & {
  label?: string
  helperText?: string
  error?: string
  required?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, helperText, error, required, disabled, id, ...props },
    ref
  ) => {
    const generatedId = useId()
    const textareaId = id || props.name || generatedId

    const textareaElement = (
      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${textareaId}-error`
            : helperText
              ? `${textareaId}-helper`
              : undefined
        }
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 flex field-sizing-content min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        {...props}
      />
    )

    // Bare textarea when there's no field chrome to render.
    if (!label && !helperText && !error) {
      return textareaElement
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <Label
            htmlFor={textareaId}
            className={cn(error && 'text-destructive')}
          >
            {label}
            {required && (
              <span className="text-destructive" aria-hidden>
                *
              </span>
            )}
          </Label>
        )}

        {textareaElement}

        {error && (
          <p id={`${textareaId}-error`} className="text-destructive text-xs">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="text-muted-foreground text-xs"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }

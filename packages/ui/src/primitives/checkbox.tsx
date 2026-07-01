import {
  forwardRef,
  useId,
  type ComponentProps,
  type ComponentRef,
} from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { Label } from './label'

type CheckboxProps = Omit<
  ComponentProps<typeof CheckboxPrimitive.Root>,
  'onChange'
> & {
  label?: string
  description?: string
  error?: string
  onChange?: (checked: boolean) => void
}

const Checkbox = forwardRef<
  ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      label,
      description,
      error,
      disabled,
      id,
      onChange,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const checkboxId = id || props.name || generatedId

    const handleCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
      if (typeof checked === 'boolean') onChange?.(checked)
      onCheckedChange?.(checked)
    }

    const checkboxElement = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${checkboxId}-error` : undefined}
        onCheckedChange={handleCheckedChange}
        className={cn(
          'peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:bg-input/30 size-4 shrink-0 cursor-pointer rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="grid place-content-center text-current">
          <CheckIcon className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )

    if (!label && !description && !error) {
      return checkboxElement
    }

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-3">
          {checkboxElement}
          {(label || description) && (
            <div className="flex flex-col gap-0.5">
              {label && (
                <Label
                  htmlFor={checkboxId}
                  className={cn('leading-tight', error && 'text-destructive')}
                >
                  {label}
                </Label>
              )}
              {description && (
                <p className="text-muted-foreground text-xs">{description}</p>
              )}
            </div>
          )}
        </div>

        {error && (
          <p id={`${checkboxId}-error`} className="text-destructive text-xs">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }

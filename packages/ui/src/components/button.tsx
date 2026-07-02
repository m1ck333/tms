import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { Spinner } from './spinner'

// shadcn/ui "New York" Button (mirrors the eu-tms demo). Brand-agnostic — colors
// come from theme tokens. Note `cursor-pointer` + `disabled:cursor-not-allowed`:
// Tailwind v4 dropped the default button cursor, so we set it explicitly.
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
        'icon-xs': 'size-5 [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    prefixIcon?: React.ReactNode
    suffixIcon?: React.ReactNode
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  prefixIcon,
  suffixIcon,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  const isDisabled = disabled || loading

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      {...props}
    >
      {/* asChild expects a single child, so icons/loading only apply to a real button */}
      {asChild ? (
        children
      ) : (
        <>
          {loading ? (
            <Spinner size="sm" className="text-current" />
          ) : (
            prefixIcon
          )}
          {children}
          {suffixIcon}
        </>
      )}
    </Comp>
  )
}

type IconButtonProps = Omit<React.ComponentProps<'button'>, 'children'> &
  Omit<VariantProps<typeof buttonVariants>, 'size'> & {
    icon: React.ReactNode
    size?: 'xs' | 'sm' | 'default' | 'lg'
    loading?: boolean
    'aria-label': string
  }

function IconButton({
  className,
  variant,
  size = 'default',
  loading = false,
  disabled,
  icon,
  ...props
}: IconButtonProps) {
  const sizeMap = {
    xs: 'icon-xs',
    sm: 'icon-sm',
    default: 'icon',
    lg: 'icon-lg',
  } as const
  const isDisabled = disabled || loading

  return (
    <button
      data-slot="icon-button"
      className={cn(
        buttonVariants({ variant, size: sizeMap[size], className })
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Spinner size="sm" className="text-current" /> : icon}
    </button>
  )
}

export { Button, IconButton, buttonVariants }

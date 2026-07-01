import type { HTMLAttributes, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'
import { useUiStrings } from '../lib/ui-strings'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  // When provided, renders a nested close (X) button.
  onRemove?: () => void
  removeLabel?: string
  children?: ReactNode
}

export function Badge({
  className,
  variant,
  onRemove,
  removeLabel,
  children,
  ...props
}: BadgeProps) {
  const strings = useUiStrings()
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={removeLabel ?? strings.remove}
          className="focus-visible:ring-ring -mr-0.5 ml-0.5 inline-flex size-3.5 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-black/20 focus-visible:ring-1"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  )
}

export { badgeVariants }

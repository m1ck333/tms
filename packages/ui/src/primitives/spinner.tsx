import { cn } from '../lib/utils'
import { useUiStrings } from '../lib/ui-strings'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeClasses = {
  sm: 'size-4 border',
  md: 'size-6 border-2',
  lg: 'size-8 border-2',
}

// Ring spinner (no icon dependency). Used by Button/IconButton loading state.
export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  const strings = useUiStrings()
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={label ?? strings.loading}
    />
  )
}

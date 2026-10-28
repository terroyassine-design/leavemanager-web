import { cn } from '@/lib/utils'

/** Brand mark. `inverted` is used on the brand panel background. */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-base font-semibold tracking-tight">
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <rect width="32" height="32" rx="8" className={inverted ? 'fill-panel-foreground' : 'fill-primary'} />
        <path
          d="M9 16.5l4.5 4.5L23 11.5"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={inverted ? 'stroke-panel' : 'stroke-primary-foreground'}
        />
      </svg>
      <span className={cn(inverted && 'text-panel-foreground')}>LeaveManager</span>
    </span>
  )
}

import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS } from '@/lib/format'
import type { LeaveStatus } from '@/types'

// Status colors come from the design tokens (--success, --warning, --destructive)
const STATUS_CLASSES: Record<LeaveStatus, string> = {
  PENDING: 'bg-warning/10 text-warning',
  APPROVED: 'bg-success/10 text-success',
  REJECTED: 'bg-destructive/10 text-destructive',
  CANCELLED: 'bg-muted text-muted-foreground',
}

export function StatusBadge({ status }: { status: LeaveStatus }) {
  return (
    <Badge className={STATUS_CLASSES[status]}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </Badge>
  )
}

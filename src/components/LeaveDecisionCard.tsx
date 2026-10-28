import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { approveLeave, rejectLeave } from '@/api/leaves'
import { useAuth } from '@/auth/useAuth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, formatDays, initials, LEAVE_TYPE_LABELS } from '@/lib/format'
import type { Leave } from '@/types'
import { ErrorMessage } from './ErrorMessage'
import { StatusBadge } from './StatusBadge'

type Decision = 'approve' | 'reject'

/** One request in the manager's list, with approve / reject actions while it is pending. */
export function LeaveDecisionCard({ leave }: { leave: Leave }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const decisionMutation = useMutation({
    mutationFn: (decision: Decision) =>
      decision === 'approve' ? approveLeave(leave.id, comment) : rejectLeave(leave.id, comment),
    onSuccess: (updated) => {
      toast.success(updated.status === 'APPROVED' ? 'Demande validée' : 'Demande refusée', {
        description: `${updated.employeeName} · ${formatDays(updated.workingDays)}`,
      })
      queryClient.invalidateQueries({ queryKey: ['leaves'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })

  const isPending = leave.status === 'PENDING'
  const isOwnRequest = leave.employeeId === user?.id

  return (
    <Card size="sm">
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                {initials(leave.employeeName)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="font-medium">{leave.employeeName}</p>
              <p className="text-muted-foreground">
                {formatDate(leave.startDate)} → {formatDate(leave.endDate)} · {formatDays(leave.workingDays)}
              </p>
              <p className="text-muted-foreground">
                {LEAVE_TYPE_LABELS[leave.type]}
                {leave.reason && ` · ${leave.reason}`}
              </p>
            </div>
          </div>
          <StatusBadge status={leave.status} />
        </div>

        {isPending && !isOwnRequest && (
          <div className="grid gap-3 border-t pt-4">
            <label htmlFor={`comment-${leave.id}`} className="sr-only">
              Commentaire pour {leave.employeeName}
            </label>
            <Textarea
              id={`comment-${leave.id}`}
              rows={2}
              placeholder="Commentaire pour l’employé (facultatif)"
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <ErrorMessage error={decisionMutation.error} />
            <div className="flex gap-2">
              <Button disabled={decisionMutation.isPending} onClick={() => decisionMutation.mutate('approve')}>
                <CheckIcon />
                Valider
              </Button>
              <Button
                variant="destructive"
                disabled={decisionMutation.isPending}
                onClick={() => decisionMutation.mutate('reject')}
              >
                <XIcon />
                Refuser
              </Button>
            </div>
          </div>
        )}

        {isPending && isOwnRequest && (
          <p className="border-t pt-4 text-muted-foreground">
            Votre propre demande doit être validée par un autre manager.
          </p>
        )}

        {leave.decidedByName && (
          <p className="border-t pt-4 text-muted-foreground">
            Traitée par <span className="font-medium text-foreground">{leave.decidedByName}</span>
            {leave.managerComment && ` : « ${leave.managerComment} »`}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarCheckIcon, CalendarXIcon, HourglassIcon, PalmtreeIcon, type LucideIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cancelLeave, getMyLeaves } from '@/api/leaves'
import { useAuth } from '@/auth/useAuth'
import { EmptyState } from '@/components/EmptyState'
import { ErrorMessage } from '@/components/ErrorMessage'
import { LeaveForm } from '@/components/LeaveForm'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatDays, LEAVE_TYPE_LABELS } from '@/lib/format'
import { cn } from '@/lib/utils'

export function MyLeavesPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const leavesQuery = useQuery({ queryKey: ['leaves', 'mine'], queryFn: getMyLeaves })

  const cancelMutation = useMutation({
    mutationFn: cancelLeave,
    onSuccess: () => {
      toast('Demande annulée')
      queryClient.invalidateQueries({ queryKey: ['leaves'] })
    },
  })

  const leaves = leavesQuery.data ?? []
  const pendingCount = leaves.filter((leave) => leave.status === 'PENDING').length
  const approvedDays = leaves
    .filter((leave) => leave.status === 'APPROVED' && leave.type === 'PAID')
    .reduce((total, leave) => total + leave.workingDays, 0)

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Bonjour ${user?.fullName.split(' ')[0] ?? ''}`}
        description="Suivez vos demandes et posez de nouveaux congés."
      />

      <dl className="grid gap-3 sm:grid-cols-3">
        <Stat icon={PalmtreeIcon} label="Solde de congés payés" value={formatDays(user?.leaveBalance ?? 0)} highlight />
        <Stat icon={HourglassIcon} label="Demandes en attente" value={String(pendingCount)} />
        <Stat icon={CalendarCheckIcon} label="Congés payés validés" value={formatDays(approvedDays)} />
      </dl>

      <div className="grid items-start gap-6 lg:grid-cols-[2fr_3fr]">
        <LeaveForm />

        <Card>
          <CardHeader>
            <CardTitle>Mes demandes</CardTitle>
            <CardDescription>Les plus récentes en premier.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <ErrorMessage error={leavesQuery.error ?? cancelMutation.error} />

            {leavesQuery.isPending && [1, 2, 3].map((key) => <Skeleton key={key} className="h-16 w-full" />)}

            {leavesQuery.isSuccess && leaves.length === 0 && (
              <EmptyState
                icon={CalendarXIcon}
                title="Aucune demande pour l’instant"
                description="Utilisez le formulaire pour poser votre premier congé."
              />
            )}

            <ul className="divide-y">
              {leaves.map((leave) => (
                <li key={leave.id} className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="font-medium">
                      {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                    </p>
                    <p className="text-muted-foreground">
                      {LEAVE_TYPE_LABELS[leave.type]} · {formatDays(leave.workingDays)}
                      {leave.reason && ` · ${leave.reason}`}
                    </p>
                    {leave.decidedByName && (
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">{leave.decidedByName}</span>
                        {leave.managerComment ? ` : « ${leave.managerComment} »` : ' a traité la demande.'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusBadge status={leave.status} />
                    {leave.status === 'PENDING' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={cancelMutation.isPending}
                        onClick={() => cancelMutation.mutate(leave.id)}
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatProps {
  icon: LucideIcon
  label: string
  value: string
  highlight?: boolean
}

function Stat({ icon: Icon, label, value, highlight = false }: StatProps) {
  return (
    <Card className={cn(highlight && 'bg-primary text-primary-foreground ring-primary')}>
      <CardContent className="flex items-center justify-between gap-3">
        <div>
          <dt className={cn('text-sm', highlight ? 'text-primary-foreground/80' : 'text-muted-foreground')}>{label}</dt>
          <dd className="mt-1 text-2xl font-semibold tracking-tight">{value}</dd>
        </div>
        <span
          className={cn(
            'flex size-10 items-center justify-center rounded-lg',
            highlight ? 'bg-primary-foreground/15' : 'bg-accent text-accent-foreground',
          )}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}

import { useQuery } from '@tanstack/react-query'
import { InboxIcon } from 'lucide-react'
import { useState } from 'react'
import { getAllLeaves } from '@/api/leaves'
import { EmptyState } from '@/components/EmptyState'
import { ErrorMessage } from '@/components/ErrorMessage'
import { LeaveDecisionCard } from '@/components/LeaveDecisionCard'
import { PageHeader } from '@/components/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { LeaveStatus } from '@/types'

type Filter = LeaveStatus | 'ALL'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'APPROVED', label: 'Validées' },
  { value: 'REJECTED', label: 'Refusées' },
  { value: 'ALL', label: 'Toutes' },
]

export function ManagerPage() {
  const [filter, setFilter] = useState<Filter>('PENDING')

  // The filter is part of the query key: each tab has its own cached result
  const leavesQuery = useQuery({
    queryKey: ['leaves', 'all', filter],
    queryFn: () => getAllLeaves(filter === 'ALL' ? undefined : filter),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Validation des congés" description="Les demandes de toute l’équipe, les plus proches en premier." />

      <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
        <TabsList>
          {FILTERS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className="px-3">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ErrorMessage error={leavesQuery.error} />

      {leavesQuery.isPending && (
        <div className="grid gap-3">
          {[1, 2, 3].map((key) => (
            <Skeleton key={key} className="h-24 w-full" />
          ))}
        </div>
      )}

      {leavesQuery.isSuccess && leavesQuery.data.length === 0 && (
        <EmptyState icon={InboxIcon} title="Rien à traiter" description="Aucune demande dans cette catégorie." />
      )}

      <ul className="grid gap-3">
        {leavesQuery.data?.map((leave) => (
          <li key={leave.id}>
            <LeaveDecisionCard leave={leave} />
          </li>
        ))}
      </ul>
    </div>
  )
}

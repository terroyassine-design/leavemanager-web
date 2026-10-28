import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SendIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { ApiError } from '@/api/client'
import { createLeave } from '@/api/leaves'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { LEAVE_TYPE_LABELS, todayIso } from '@/lib/format'
import type { CreateLeavePayload, LeaveType } from '@/types'
import { ErrorMessage } from './ErrorMessage'
import { FormField } from './FormField'

const EMPTY_FORM: CreateLeavePayload = { type: 'PAID', startDate: '', endDate: '', reason: '' }

export function LeaveForm() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<CreateLeavePayload>(EMPTY_FORM)

  const createMutation = useMutation({
    mutationFn: createLeave,
    onSuccess: (leave) => {
      setForm(EMPTY_FORM)
      toast.success('Demande envoyée', { description: `${leave.workingDays} jour(s) en attente de validation.` })
      // Refetch the lists so the new request appears
      queryClient.invalidateQueries({ queryKey: ['leaves'] })
    },
  })

  const fieldErrors = createMutation.error instanceof ApiError ? createMutation.error.fieldErrors : {}

  function update<K extends keyof CreateLeavePayload>(field: K, value: CreateLeavePayload[K]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createMutation.mutate(form)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle demande</CardTitle>
        <CardDescription>Seuls les jours ouvrés sont décomptés.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <FormField label="Type" htmlFor="type">
            <Select value={form.type} onValueChange={(value) => update('type', value as LeaveType)}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Du" htmlFor="startDate" error={fieldErrors.startDate}>
              <Input
                id="startDate"
                type="date"
                required
                min={todayIso()}
                value={form.startDate}
                aria-invalid={Boolean(fieldErrors.startDate)}
                onChange={(e) => update('startDate', e.target.value)}
              />
            </FormField>
            <FormField label="Au" htmlFor="endDate" error={fieldErrors.endDate}>
              <Input
                id="endDate"
                type="date"
                required
                min={form.startDate || todayIso()}
                value={form.endDate}
                aria-invalid={Boolean(fieldErrors.endDate)}
                onChange={(e) => update('endDate', e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Motif (facultatif)" htmlFor="reason">
            <Textarea
              id="reason"
              rows={2}
              maxLength={500}
              placeholder="Vacances, rendez-vous…"
              value={form.reason}
              onChange={(e) => update('reason', e.target.value)}
            />
          </FormField>

          {Object.keys(fieldErrors).length === 0 && <ErrorMessage error={createMutation.error} />}

          <Button type="submit" size="lg" className="w-full" disabled={createMutation.isPending}>
            <SendIcon />
            {createMutation.isPending ? 'Envoi…' : 'Envoyer la demande'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

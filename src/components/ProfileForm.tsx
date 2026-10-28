import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { ApiError } from '@/api/client'
import { updateProfile, type UpdateProfilePayload } from '@/api/profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { User } from '@/types'
import { ErrorMessage } from './ErrorMessage'
import { FormField } from './FormField'

export function ProfileForm({ user }: { user: User }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<UpdateProfilePayload>({ fullName: user.fullName, email: user.email })

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      // Update the cached user: the header and every page show the new name immediately
      queryClient.setQueryData(['me'], updated)
      toast.success('Profil mis à jour')
    },
  })

  const fieldErrors = updateMutation.error instanceof ApiError ? updateMutation.error.fieldErrors : {}
  const hasChanges = form.fullName !== user.fullName || form.email !== user.email

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    updateMutation.mutate(form)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>Votre nom est visible par votre manager.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <fieldset disabled={user.demo} className="grid gap-4">
            <FormField label="Nom complet" htmlFor="profile-fullName" error={fieldErrors.fullName}>
              <Input
                id="profile-fullName"
                autoComplete="name"
                value={form.fullName}
                aria-invalid={Boolean(fieldErrors.fullName)}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </FormField>
            <FormField label="Email" htmlFor="profile-email" error={fieldErrors.email}>
              <Input
                id="profile-email"
                type="email"
                autoComplete="email"
                value={form.email}
                aria-invalid={Boolean(fieldErrors.email)}
                onChange={(e) => setForm({ ...form, email: e.target.value.trim() })}
              />
            </FormField>
            {Object.keys(fieldErrors).length === 0 && <ErrorMessage error={updateMutation.error} />}
            <div>
              <Button type="submit" disabled={!hasChanges || updateMutation.isPending}>
                {updateMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
            </div>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  )
}

import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { ApiError } from '@/api/client'
import { changePassword } from '@/api/profile'
import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ErrorMessage } from './ErrorMessage'
import { FormField } from './FormField'

const EMPTY_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' }

export function PasswordForm({ disabled }: { disabled: boolean }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [mismatch, setMismatch] = useState(false)

  const { login: saveSession } = useAuth()

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (response) => {
      // The API revoked every previous token: keep this session alive with the new one
      saveSession(response)
      setForm(EMPTY_FORM)
      toast.success('Mot de passe modifié', { description: 'Vos autres sessions ont été déconnectées.' })
    },
  })

  const fieldErrors = passwordMutation.error instanceof ApiError ? passwordMutation.error.fieldErrors : {}

  function update(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setMismatch(false)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    // Checked in the browser only: the API never receives the confirmation
    if (form.newPassword !== form.confirmPassword) {
      setMismatch(true)
      return
    }
    passwordMutation.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe</CardTitle>
        <CardDescription>Votre mot de passe actuel est demandé pour confirmer le changement.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <fieldset disabled={disabled} className="grid gap-4">
            <FormField label="Mot de passe actuel" htmlFor="currentPassword" error={fieldErrors.currentPassword}>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={form.currentPassword}
                onChange={(e) => update('currentPassword', e.target.value)}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Nouveau mot de passe" htmlFor="newPassword" error={fieldErrors.newPassword}>
                <Input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.newPassword}
                  aria-invalid={Boolean(fieldErrors.newPassword)}
                  onChange={(e) => update('newPassword', e.target.value)}
                />
              </FormField>
              <FormField
                label="Confirmation"
                htmlFor="confirmPassword"
                error={mismatch ? 'Les deux mots de passe ne correspondent pas' : undefined}
              >
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  aria-invalid={mismatch}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                />
              </FormField>
            </div>
            {Object.keys(fieldErrors).length === 0 && <ErrorMessage error={passwordMutation.error} />}
            <div>
              <Button
                type="submit"
                disabled={!form.currentPassword || !form.newPassword || passwordMutation.isPending}
              >
                {passwordMutation.isPending ? 'Modification…' : 'Changer le mot de passe'}
              </Button>
            </div>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  )
}

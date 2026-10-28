import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { register, type RegisterPayload } from '@/api/auth'
import { ApiError } from '@/api/client'
import { useAuth } from '@/auth/useAuth'
import { AuthLayout } from '@/components/AuthLayout'
import { ErrorMessage } from '@/components/ErrorMessage'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function RegisterPage() {
  const { user, login: saveSession } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterPayload>({ fullName: '', email: '', password: '' })

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: (response) => {
      saveSession(response)
      navigate('/', { replace: true })
    },
  })

  if (user) return <Navigate to="/" replace />

  // Field-level messages sent back by the API's Bean Validation
  const fieldErrors = registerMutation.error instanceof ApiError ? registerMutation.error.fieldErrors : {}

  function update(field: keyof RegisterPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    registerMutation.mutate(form)
  }

  return (
    <AuthLayout title="Créer un compte" subtitle="Les nouveaux comptes ont le rôle Employé et 25 jours de congés.">
      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        <FormField label="Nom complet" htmlFor="fullName" error={fieldErrors.fullName}>
          <Input
            id="fullName"
            autoComplete="name"
            value={form.fullName}
            aria-invalid={Boolean(fieldErrors.fullName)}
            onChange={(e) => update('fullName', e.target.value)}
          />
        </FormField>
        <FormField label="Email" htmlFor="email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            aria-invalid={Boolean(fieldErrors.email)}
            onChange={(e) => update('email', e.target.value)}
          />
        </FormField>
        <FormField label="Mot de passe (8 caractères minimum)" htmlFor="password" error={fieldErrors.password}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            aria-invalid={Boolean(fieldErrors.password)}
            onChange={(e) => update('password', e.target.value)}
          />
        </FormField>
        {Object.keys(fieldErrors).length === 0 && <ErrorMessage error={registerMutation.error} />}
        <Button type="submit" size="lg" className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Création…' : 'Créer mon compte'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Déjà inscrit ?{' '}
        <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  )
}

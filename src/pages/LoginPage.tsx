import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { login, type LoginPayload } from '@/api/auth'
import { useAuth } from '@/auth/useAuth'
import { AuthLayout } from '@/components/AuthLayout'
import { ErrorMessage } from '@/components/ErrorMessage'
import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function LoginPage() {
  const { user, login: saveSession } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (response) => {
      saveSession(response)
      navigate('/', { replace: true })
    },
  })

  if (user) return <Navigate to="/" replace />

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <AuthLayout title="Connexion" subtitle="Accédez à votre espace congés.">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@entreprise.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>
        <FormField label="Mot de passe" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>
        <ErrorMessage error={loginMutation.error} />
        <Button type="submit" size="lg" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          Créer un compte
        </Link>
      </p>
    </AuthLayout>
  )
}

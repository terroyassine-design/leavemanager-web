import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/auth/AuthProvider'
import { PasswordForm } from './PasswordForm'

function renderForm() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PasswordForm disabled={false} />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

async function fillForm(newPassword: string, confirmation: string) {
  await userEvent.type(screen.getByLabelText('Mot de passe actuel'), 'Password123')
  await userEvent.type(screen.getByLabelText('Nouveau mot de passe'), newPassword)
  await userEvent.type(screen.getByLabelText('Confirmation'), confirmation)
  await userEvent.click(screen.getByRole('button', { name: 'Changer le mot de passe' }))
}

describe('PasswordForm', () => {
  it('does not call the API when the confirmation does not match', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    renderForm()

    await fillForm('NewPassword456', 'Different789')

    expect(screen.getByText('Les deux mots de passe ne correspondent pas')).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('sends the passwords and keeps the session with the new token', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          token: 'new-token',
          user: { id: 1, fullName: 'Jean', email: 'jean@test.com', role: 'EMPLOYEE', leaveBalance: 25, demo: false },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    renderForm()

    await fillForm('NewPassword456', 'NewPassword456')

    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toMatch(/\/api\/profile\/password$/)
    expect(init?.method).toBe('PUT')
    expect(JSON.parse(init?.body as string)).toEqual({ currentPassword: 'Password123', newPassword: 'NewPassword456' })
    // Previous tokens are revoked by the API: the new one must replace it
    await vi.waitFor(() => expect(localStorage.getItem('leavemanager.token')).toBe('new-token'))
  })
})

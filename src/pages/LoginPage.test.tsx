import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../auth/AuthProvider'
import { LoginPage } from './LoginPage'

function renderLoginPage() {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <LoginPage /> },
      { path: '/', element: <p>Page d’accueil</p> },
    ],
    { initialEntries: ['/login'] },
  )
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

function mockFetch(status: number, body: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  )
}

describe('LoginPage', () => {
  it('shows the API error message when credentials are wrong', async () => {
    mockFetch(401, { detail: 'Email ou mot de passe incorrect' })
    renderLoginPage()

    await userEvent.type(screen.getByLabelText('Email'), 'jean@test.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou mot de passe incorrect')
  })

  it('logs in with email and password and redirects to the home page', async () => {
    const fetchSpy = mockFetch(200, {
      token: 'jwt-token',
      user: { id: 1, fullName: 'Claire Martin', email: 'manager@demo.com', role: 'MANAGER', leaveBalance: 25, demo: true },
    })
    renderLoginPage()

    await userEvent.type(screen.getByLabelText('Email'), 'manager@demo.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'Password123')
    await userEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByText('Page d’accueil')).toBeInTheDocument()
    expect(localStorage.getItem('leavemanager.token')).toBe('jwt-token')
    expect(JSON.parse(fetchSpy.mock.calls[0][1]?.body as string)).toMatchObject({ email: 'manager@demo.com' })
  })
})

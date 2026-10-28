import { describe, expect, it, vi } from 'vitest'
import { apiFetch, ApiError, tokenStorage } from './client'

function mockFetch(status: number, body: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  )
}

describe('apiFetch', () => {
  it('sends the saved token as a Bearer header', async () => {
    tokenStorage.set('my-token')
    const fetchSpy = mockFetch(200, { ok: true })

    await apiFetch('/api/users/me')

    const [, init] = fetchSpy.mock.calls[0]
    expect(init?.headers).toMatchObject({ Authorization: 'Bearer my-token' })
  })

  it('turns a ProblemDetail response into an ApiError', async () => {
    mockFetch(409, { detail: 'Solde de congés insuffisant' })

    const error = (await apiFetch('/api/leaves', { method: 'POST', body: {} }).catch((e) => e)) as ApiError

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(409)
    expect(error.message).toBe('Solde de congés insuffisant')
  })

  it('exposes field validation errors', async () => {
    mockFetch(400, { detail: 'Données invalides', errors: { email: 'Email invalide' } })

    const error = (await apiFetch('/api/auth/register', { method: 'POST', body: {} }).catch((e) => e)) as ApiError

    expect(error.fieldErrors).toEqual({ email: 'Email invalide' })
  })

  it('clears the token when the API answers 401', async () => {
    tokenStorage.set('expired-token')
    mockFetch(401, {})

    await apiFetch('/api/users/me').catch(() => {})

    expect(tokenStorage.get()).toBeNull()
  })
})

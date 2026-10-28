// Single entry point for every HTTP call: adds the JWT and turns API errors into ApiError.

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const TOKEN_KEY = 'leavemanager.token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

/** Event fired when the token is rejected (expired), so the app can log the user out. */
export const SESSION_EXPIRED_EVENT = 'leavemanager:session-expired'

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH'
  body?: unknown
}

export async function apiFetch<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const token = tokenStorage.get()
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Impossible de joindre le serveur. Vérifiez que l’API est démarrée.')
  }

  if (response.status === 401 && token) {
    tokenStorage.clear()
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
  }

  if (!response.ok) {
    // The API answers errors with a ProblemDetail: { detail, errors? }
    const problem = await response.json().catch(() => null)
    throw new ApiError(response.status, problem?.detail ?? 'Une erreur inattendue est survenue', problem?.errors)
  }

  // 204 No Content: nothing to parse
  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}

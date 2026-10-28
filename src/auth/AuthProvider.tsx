import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProfile } from '../api/profile'
import { SESSION_EXPIRED_EVENT, tokenStorage } from '../api/client'
import type { AuthResponse } from '../types'
import { AuthContext } from './AuthContext'

/**
 * Keeps the JWT in localStorage and the current user in the TanStack Query cache (key ['me']),
 * so any screen can refresh the profile (e.g. the leave balance) by invalidating ['me'].
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState(tokenStorage.get)

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: getProfile,
    enabled: token !== null,
    retry: false,
  })

  const login = useCallback(
    (response: AuthResponse) => {
      tokenStorage.set(response.token)
      queryClient.setQueryData(['me'], response.user)
      setToken(response.token)
    },
    [queryClient],
  )

  const logout = useCallback(() => {
    tokenStorage.clear()
    queryClient.clear()
    setToken(null)
  }, [queryClient])

  // The API client fires this event when the token has expired
  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, logout)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, logout)
  }, [logout])

  const value = useMemo(
    () => ({
      user: token ? (meQuery.data ?? null) : null,
      isLoading: token !== null && meQuery.isPending,
      login,
      logout,
    }),
    [token, meQuery.data, meQuery.isPending, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

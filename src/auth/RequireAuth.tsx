import { Navigate, Outlet } from 'react-router'
import type { Role } from '../types'
import { useAuth } from './useAuth'

/** Route guard: redirects to /login when logged out, and home when the role does not match. */
export function RequireAuth({ role }: { role?: Role }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <p className="p-8 text-center text-muted-foreground">Chargement…</p>
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

import { createContext } from 'react'
import type { AuthResponse, User } from '../types'

export interface AuthContextValue {
  user: User | null
  /** True while the profile of a previously saved token is being loaded. */
  isLoading: boolean
  login: (response: AuthResponse) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

import type { AuthResponse } from '../types'
import { apiFetch } from './client'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  fullName: string
}

export const login = (payload: LoginPayload) =>
  apiFetch<AuthResponse>('/api/auth/login', { method: 'POST', body: payload })

export const register = (payload: RegisterPayload) =>
  apiFetch<AuthResponse>('/api/auth/register', { method: 'POST', body: payload })

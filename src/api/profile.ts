import type { AuthResponse, User } from '../types'
import { apiFetch } from './client'

export interface UpdateProfilePayload {
  fullName: string
  email: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export const getProfile = () => apiFetch<User>('/api/profile')

export const updateProfile = (payload: UpdateProfilePayload) =>
  apiFetch<User>('/api/profile', { method: 'PUT', body: payload })

/** Returns a new token: the API revokes every token issued before the change. */
export const changePassword = (payload: ChangePasswordPayload) =>
  apiFetch<AuthResponse>('/api/profile/password', { method: 'PUT', body: payload })

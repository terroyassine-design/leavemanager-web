import type { CreateLeavePayload, Leave, LeaveStatus } from '../types'
import { apiFetch } from './client'

// Employee
export const getMyLeaves = () => apiFetch<Leave[]>('/api/leaves/me')

export const createLeave = (payload: CreateLeavePayload) =>
  apiFetch<Leave>('/api/leaves', { method: 'POST', body: payload })

export const cancelLeave = (id: number) =>
  apiFetch<Leave>(`/api/leaves/${id}/cancel`, { method: 'PATCH' })

// Manager
export const getAllLeaves = (status?: LeaveStatus) =>
  apiFetch<Leave[]>(status ? `/api/manager/leaves?status=${status}` : '/api/manager/leaves')

export const approveLeave = (id: number, comment: string) =>
  apiFetch<Leave>(`/api/manager/leaves/${id}/approve`, { method: 'PATCH', body: { comment } })

export const rejectLeave = (id: number, comment: string) =>
  apiFetch<Leave>(`/api/manager/leaves/${id}/reject`, { method: 'PATCH', body: { comment } })

// Mirrors the JSON returned by leavemanager-api.

export type Role = 'EMPLOYEE' | 'MANAGER'
export type LeaveType = 'PAID' | 'SICK' | 'UNPAID'
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

export interface User {
  id: number
  fullName: string
  email: string
  role: Role
  leaveBalance: number
  /** Shared demo account: profile is read-only */
  demo: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Leave {
  id: number
  employeeId: number
  employeeName: string
  type: LeaveType
  startDate: string
  endDate: string
  workingDays: number
  reason: string | null
  status: LeaveStatus
  managerComment: string | null
  decidedByName: string | null
  createdAt: string
  decidedAt: string | null
}

export interface CreateLeavePayload {
  type: LeaveType
  startDate: string
  endDate: string
  reason?: string
}

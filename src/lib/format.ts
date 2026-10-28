import type { LeaveStatus, LeaveType, Role } from '../types'

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  PAID: 'Congé payé',
  SICK: 'Maladie',
  UNPAID: 'Sans solde',
}

export const STATUS_LABELS: Record<LeaveStatus, string> = {
  PENDING: 'En attente',
  APPROVED: 'Validée',
  REJECTED: 'Refusée',
  CANCELLED: 'Annulée',
}

export const ROLE_LABELS: Record<Role, string> = {
  EMPLOYEE: 'Employé',
  MANAGER: 'Manager',
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

/** "2026-11-23" -> "23 nov. 2026" (parsed as a local date, no timezone shift). */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number)
  return dateFormatter.format(new Date(year, month - 1, day))
}

export function formatDays(days: number): string {
  return `${days} jour${days > 1 ? 's' : ''}`
}

/** "Claire Martin" -> "CM" (avatar placeholder). */
export function initials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

/** Today as "YYYY-MM-DD" in local time, for <input type="date" min=...>. */
export function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

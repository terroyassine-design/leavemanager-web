import { describe, expect, it } from 'vitest'
import { formatDate, formatDays } from './format'

describe('formatDate', () => {
  it('formats an ISO date in French without timezone shift', () => {
    expect(formatDate('2026-11-23')).toBe('23 nov. 2026')
  })
})

describe('formatDays', () => {
  it('uses singular for one day', () => {
    expect(formatDays(1)).toBe('1 jour')
  })

  it('uses plural above one day', () => {
    expect(formatDays(5)).toBe('5 jours')
  })
})

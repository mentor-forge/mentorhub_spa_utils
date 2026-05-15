import { describe, it, expect } from 'vitest'
import { formatDate } from '../../src/utils/date'

describe('date utilities', () => {
  describe('formatDate', () => {
    it('should format a valid ISO date string', () => {
      const dateString = '2024-01-15T10:30:00Z'
      const result = formatDate(dateString)
      expect(result).toBeTruthy()
      expect(result).not.toBe('N/A')
    })

    it('should return "N/A" for null', () => {
      expect(formatDate(null)).toBe('N/A')
    })

    it('should return "N/A" for undefined', () => {
      expect(formatDate(undefined)).toBe('N/A')
    })

    it('should return "N/A" for empty string', () => {
      expect(formatDate('')).toBe('N/A')
    })

    it('should handle different date formats', () => {
      const dateString = '2024-12-31T23:59:59.000Z'
      const result = formatDate(dateString)
      expect(result).toBeTruthy()
      expect(result).not.toBe('N/A')
    })
  })
})

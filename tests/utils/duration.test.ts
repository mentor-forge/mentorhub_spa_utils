import { describe, it, expect } from 'vitest'
import { parseDurationIso, formatDurationIso, formatDurationHuman } from '../../src/utils/duration'

describe('duration utilities', () => {
  describe('parseDurationIso', () => {
    it('should parse a full day/hour/minute/second duration', () => {
      expect(parseDurationIso('P3DT4H30M15S')).toEqual({ days: 3, hours: 4, minutes: 30, seconds: 15 })
    })

    it('should parse a date-only duration', () => {
      expect(parseDurationIso('P3D')).toEqual({ days: 3, hours: 0, minutes: 0, seconds: 0 })
    })

    it('should parse a time-only duration', () => {
      expect(parseDurationIso('PT4H30M')).toEqual({ days: 0, hours: 4, minutes: 30, seconds: 0 })
    })

    it('should parse PT0S as all zeros', () => {
      expect(parseDurationIso('PT0S')).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    })

    it('should return all zeros for null/undefined/empty input', () => {
      expect(parseDurationIso(null)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      expect(parseDurationIso(undefined)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      expect(parseDurationIso('')).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    })

    it('should return all zeros for malformed input rather than throwing', () => {
      expect(parseDurationIso('not-a-duration')).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      expect(parseDurationIso('P')).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    })
  })

  describe('formatDurationIso', () => {
    it('should serialize all four units', () => {
      expect(formatDurationIso({ days: 3, hours: 4, minutes: 30, seconds: 15 })).toBe('P3DT4H30M15S')
    })

    it('should omit zero-value units', () => {
      expect(formatDurationIso({ days: 3, hours: 0, minutes: 0, seconds: 0 })).toBe('P3D')
      expect(formatDurationIso({ days: 0, hours: 4, minutes: 30, seconds: 0 })).toBe('PT4H30M')
    })

    it('should serialize an all-zero duration to PT0S', () => {
      expect(formatDurationIso({ days: 0, hours: 0, minutes: 0, seconds: 0 })).toBe('PT0S')
    })

    it('should round-trip through parseDurationIso', () => {
      const original = { days: 1, hours: 2, minutes: 3, seconds: 4 }
      expect(parseDurationIso(formatDurationIso(original))).toEqual(original)
    })

    it('should floor fractional and clamp negative inputs', () => {
      expect(formatDurationIso({ days: 1.9, hours: -5, minutes: 2.2, seconds: 0 })).toBe('P1DT2M')
    })
  })

  describe('formatDurationHuman', () => {
    it('should render a readable multi-unit summary', () => {
      expect(formatDurationHuman('P3DT4H30M')).toBe('3 days, 4 hours, 30 minutes')
    })

    it('should singularize single-unit values', () => {
      expect(formatDurationHuman('P1DT1H1M1S')).toBe('1 day, 1 hour, 1 minute, 1 second')
    })

    it('should render "0 seconds" for an all-zero duration', () => {
      expect(formatDurationHuman('PT0S')).toBe('0 seconds')
    })

    it('should render an em-dash for empty input', () => {
      expect(formatDurationHuman(null)).toBe('—')
      expect(formatDurationHuman(undefined)).toBe('—')
      expect(formatDurationHuman('')).toBe('—')
    })
  })
})

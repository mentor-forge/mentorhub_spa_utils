import { describe, it, expect } from 'vitest'
import { validationRules } from '../../src/utils/validation'

describe('validation rules', () => {
  describe('required', () => {
    it('should return true for non-empty string', () => {
      expect(validationRules.required('test')).toBe(true)
    })

    it('should return true for non-zero number', () => {
      expect(validationRules.required(123)).toBe(true)
    })

    it('should return error message for empty string', () => {
      expect(validationRules.required('')).toBe('This field is required')
    })

    it('should return error message for zero', () => {
      expect(validationRules.required(0)).toBe('This field is required')
    })
  })

  describe('namePattern', () => {
    it('should return true for valid name without spaces', () => {
      expect(validationRules.namePattern('valid-name')).toBe(true)
      expect(validationRules.namePattern('validname123')).toBe(true)
    })

    it('should return true for empty string', () => {
      expect(validationRules.namePattern('')).toBe(true)
    })

    it('should return error for name with spaces', () => {
      expect(validationRules.namePattern('name with spaces')).toBe('No whitespace, max 40 characters')
    })

    it('should return error for name longer than 40 characters', () => {
      const longName = 'a'.repeat(41)
      expect(validationRules.namePattern(longName)).toBe('No whitespace, max 40 characters')
    })

    it('should accept exactly 40 characters', () => {
      const name = 'a'.repeat(40)
      expect(validationRules.namePattern(name)).toBe(true)
    })
  })

  describe('descriptionPattern', () => {
    it('should return true for valid description', () => {
      expect(validationRules.descriptionPattern('Valid description')).toBe(true)
      expect(validationRules.descriptionPattern('')).toBe(true)
    })

    it('should return true for empty string', () => {
      expect(validationRules.descriptionPattern('')).toBe(true)
    })

    it('should return error for description with tabs', () => {
      expect(validationRules.descriptionPattern('description\twith\ttabs')).toBe('Max 255 characters, no tabs or newlines')
    })

    it('should return error for description with newlines', () => {
      expect(validationRules.descriptionPattern('description\nwith\nnewlines')).toBe('Max 255 characters, no tabs or newlines')
    })

    it('should return error for description longer than 255 characters', () => {
      const longDesc = 'a'.repeat(256)
      expect(validationRules.descriptionPattern(longDesc)).toBe('Max 255 characters, no tabs or newlines')
    })

    it('should accept exactly 255 characters', () => {
      const desc = 'a'.repeat(255)
      expect(validationRules.descriptionPattern(desc)).toBe(true)
    })
  })

  describe('wordPattern', () => {
    it('should return true for a valid word and empty string', () => {
      expect(validationRules.wordPattern('validword')).toBe(true)
      expect(validationRules.wordPattern('')).toBe(true)
    })

    it('should reject whitespace and >40 characters', () => {
      expect(validationRules.wordPattern('has space')).toBe('No whitespace, max 40 characters')
      expect(validationRules.wordPattern('a'.repeat(41))).toBe('No whitespace, max 40 characters')
    })
  })

  describe('sentencePattern', () => {
    it('should return true for a valid sentence and empty string', () => {
      expect(validationRules.sentencePattern('A valid sentence.')).toBe(true)
      expect(validationRules.sentencePattern('')).toBe(true)
    })

    it('should reject tabs/newlines and >255 characters', () => {
      expect(validationRules.sentencePattern('tab\there')).toBe('Max 255 characters, no tabs or newlines')
      expect(validationRules.sentencePattern('a'.repeat(256))).toBe('Max 255 characters, no tabs or newlines')
    })
  })

  describe('markdownPattern', () => {
    it('should return true for markdown up to 4096 characters, and empty string', () => {
      expect(validationRules.markdownPattern('# Heading\n\nSome *markdown*.')).toBe(true)
      expect(validationRules.markdownPattern('a'.repeat(4096))).toBe(true)
      expect(validationRules.markdownPattern('')).toBe(true)
    })

    it('should reject content over 4096 characters', () => {
      expect(validationRules.markdownPattern('a'.repeat(4097))).toBe('Max 4096 characters')
    })
  })

  describe('emailPattern', () => {
    it('should accept valid emails and empty string', () => {
      expect(validationRules.emailPattern('user@example.com')).toBe(true)
      expect(validationRules.emailPattern('')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(validationRules.emailPattern('not-an-email')).toBe('Must be a valid email address')
      expect(validationRules.emailPattern('user@')).toBe('Must be a valid email address')
    })
  })

  describe('urlPattern', () => {
    it('should accept http(s) URLs and empty string', () => {
      expect(validationRules.urlPattern('https://example.com')).toBe(true)
      expect(validationRules.urlPattern('http://example.com/path')).toBe(true)
      expect(validationRules.urlPattern('')).toBe(true)
    })

    it('should reject non-http(s) values', () => {
      expect(validationRules.urlPattern('ftp://example.com')).toBe('Must be a valid http(s):// URL')
      expect(validationRules.urlPattern('not a url')).toBe('Must be a valid http(s):// URL')
    })
  })

  describe('usPhonePattern', () => {
    it('should accept +1########## and ###-###-#### formats, and empty string', () => {
      expect(validationRules.usPhonePattern('+11234567890')).toBe(true)
      expect(validationRules.usPhonePattern('123-456-7890')).toBe(true)
      expect(validationRules.usPhonePattern('')).toBe(true)
    })

    it('should reject other formats', () => {
      expect(validationRules.usPhonePattern('1234567890')).toBe('Must be +1##########  or ###-###-####')
    })
  })

  describe('ipAddressPattern', () => {
    it('should accept IPv4 and IPv6 addresses, and empty string', () => {
      expect(validationRules.ipAddressPattern('192.168.1.1')).toBe(true)
      expect(validationRules.ipAddressPattern('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true)
      expect(validationRules.ipAddressPattern('')).toBe(true)
    })

    it('should reject invalid addresses', () => {
      expect(validationRules.ipAddressPattern('not an ip')).toBe('Must be a valid IPv4 or IPv6 address')
    })
  })

  describe('identifierPattern', () => {
    it('should accept a 24-hex-character ObjectId and empty string', () => {
      expect(validationRules.identifierPattern('507f1f77bcf86cd799439011')).toBe(true)
      expect(validationRules.identifierPattern('')).toBe(true)
    })

    it('should reject values that are not 24 hex characters', () => {
      expect(validationRules.identifierPattern('not-an-object-id')).toBe('Must be a 24-character hex identifier')
      expect(validationRules.identifierPattern('507f1f77bcf86cd79943901')).toBe('Must be a 24-character hex identifier')
    })
  })

  describe('nonNegativeInteger', () => {
    it('should accept non-negative integers and empty values', () => {
      expect(validationRules.nonNegativeInteger(0)).toBe(true)
      expect(validationRules.nonNegativeInteger(42)).toBe(true)
      expect(validationRules.nonNegativeInteger('')).toBe(true)
    })

    it('should reject negative numbers and non-integers', () => {
      expect(validationRules.nonNegativeInteger(-1)).toBe('Must be a non-negative whole number')
      expect(validationRules.nonNegativeInteger(1.5)).toBe('Must be a non-negative whole number')
    })
  })

  describe('ratingRange', () => {
    it('should accept integers 1-4 and empty values', () => {
      expect(validationRules.ratingRange(1)).toBe(true)
      expect(validationRules.ratingRange(4)).toBe(true)
      expect(validationRules.ratingRange('')).toBe(true)
    })

    it('should reject values outside 1-4 or non-integers', () => {
      expect(validationRules.ratingRange(0)).toBe('Must be a whole number between 1 and 4')
      expect(validationRules.ratingRange(5)).toBe('Must be a whole number between 1 and 4')
      expect(validationRules.ratingRange(2.5)).toBe('Must be a whole number between 1 and 4')
    })
  })

  describe('dateTimePattern', () => {
    it('should accept valid ISO-8601 date-time strings and empty string', () => {
      expect(validationRules.dateTimePattern('2024-01-15T10:30:00Z')).toBe(true)
      expect(validationRules.dateTimePattern('2024-01-15T10:30:00.123Z')).toBe(true)
      expect(validationRules.dateTimePattern('2024-01-15T10:30:00+05:00')).toBe(true)
      expect(validationRules.dateTimePattern('')).toBe(true)
    })

    it('should reject non-ISO strings and unparseable dates', () => {
      expect(validationRules.dateTimePattern('01/15/2024')).toBe('Must be a valid ISO-8601 date-time')
      expect(validationRules.dateTimePattern('not-a-date')).toBe('Must be a valid ISO-8601 date-time')
    })
  })

  describe('durationPattern', () => {
    it('should accept valid ISO-8601 durations and empty string', () => {
      expect(validationRules.durationPattern('P3DT4H30M')).toBe(true)
      expect(validationRules.durationPattern('P3D')).toBe(true)
      expect(validationRules.durationPattern('PT4H30M')).toBe(true)
      expect(validationRules.durationPattern('PT0S')).toBe(true)
      expect(validationRules.durationPattern('')).toBe(true)
    })

    it('should reject malformed durations', () => {
      expect(validationRules.durationPattern('3 days')).toBe('Must be a valid ISO-8601 duration (e.g. P3DT4H30M)')
      expect(validationRules.durationPattern('P')).toBe('Must be a valid ISO-8601 duration (e.g. P3DT4H30M)')
      expect(validationRules.durationPattern('PT')).toBe('Must be a valid ISO-8601 duration (e.g. P3DT4H30M)')
    })
  })
})

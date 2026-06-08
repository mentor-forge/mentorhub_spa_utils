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
})

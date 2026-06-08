import { describe, it, expect } from 'vitest'
import * as utils from '../../src/utils'

describe('utils/index', () => {
  it('should export formatDate', () => {
    expect(utils.formatDate).toBeDefined()
    expect(typeof utils.formatDate).toBe('function')
  })

  it('should export validationRules', () => {
    expect(utils.validationRules).toBeDefined()
    expect(typeof utils.validationRules).toBe('object')
    expect(utils.validationRules.required).toBeDefined()
    expect(utils.validationRules.namePattern).toBeDefined()
    expect(utils.validationRules.descriptionPattern).toBeDefined()
  })

  it('should export URL auth bootstrap helpers', () => {
    expect(utils.bootstrapAuthFromUrl).toBeDefined()
    expect(typeof utils.bootstrapAuthFromUrl).toBe('function')
    expect(utils.clearUrlSeededAuthLocalStorage).toBeDefined()
    expect(typeof utils.clearUrlSeededAuthLocalStorage).toBe('function')
  })

  it('should export IdP redirect helpers', () => {
    expect(utils.getIdpLoginBaseUrl).toBeDefined()
    expect(typeof utils.getIdpLoginBaseUrl).toBe('function')
    expect(utils.buildIdpLoginRedirectUrl).toBeDefined()
    expect(typeof utils.buildIdpLoginRedirectUrl).toBe('function')
    expect(utils.redirectToIdpLogin).toBeDefined()
    expect(typeof utils.redirectToIdpLogin).toBe('function')
  })
})

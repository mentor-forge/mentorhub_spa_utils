import { describe, expect, it } from 'vitest'
import {
  formatConfigValue,
  getCollectionName,
  getEnumeratorItemName,
  getEnumeratorItems,
  getEnumeratorItemValues,
  getEnumeratorVersion,
  getSourceColor,
  getTokenRoles,
  getTokenValue,
  getValue,
  getValueDescription,
  getVersionNumber,
} from '../../src/utils/admin'

describe('Admin display utilities', () => {
  it('formats configuration values and sources', () => {
    expect(formatConfigValue(null)).toBe('null')
    expect(formatConfigValue(undefined)).toBe('null')
    expect(formatConfigValue({ enabled: true })).toBe(JSON.stringify({ enabled: true }, null, 2))
    expect(formatConfigValue(false)).toBe('false')
    expect(getSourceColor('env')).toBe('success')
    expect(getSourceColor('unknown')).toBe('default')
  })

  it('reads current and legacy version fields and handles absent values', () => {
    expect(getCollectionName({ collection_name: 'profiles', name: 'legacy' })).toBe('profiles')
    expect(getCollectionName({ name: 'legacy' })).toBe('legacy')
    expect(getCollectionName({ collection: 'users' })).toBe('users')
    expect(getCollectionName({})).toBe('Unknown')
    expect(getVersionNumber({ current_version: 3, version: 2 })).toBe('3')
    expect(getVersionNumber({ version: 2 })).toBe('2')
    expect(getVersionNumber({ version_number: 1 })).toBe('1')
    expect(getVersionNumber({})).toBe('N/A')
  })

  it('formats enumerator entries and tolerates incomplete records', () => {
    const values = [{ value: 42, description: 'Answer' }]
    const items = [{ name: 'answers', values }]
    expect(getEnumeratorVersion({ version: 0 })).toBe('0')
    expect(getEnumeratorVersion({ version: null })).toBe('Unknown')
    expect(getEnumeratorVersion({})).toBe('Unknown')
    expect(getEnumeratorVersion(null)).toBe('Unknown')
    expect(getEnumeratorItems({ enumerators: items })).toEqual(items)
    expect(getEnumeratorItems({ enumerators: 'invalid' })).toEqual([])
    expect(getEnumeratorItems(null)).toEqual([])
    expect(getEnumeratorItemName(items[0])).toBe('answers')
    expect(getEnumeratorItemName({})).toBe('Unknown')
    expect(getEnumeratorItemValues(items[0])).toEqual(values)
    expect(getEnumeratorItemValues({})).toEqual([])
    expect(getValue(values[0])).toBe('42')
    expect(getValue({})).toBe('')
    expect(getValueDescription(values[0])).toBe('Answer')
    expect(getValueDescription({})).toBe('')
  })

  it('formats token claims and roles when present', () => {
    const token = { sub: 42, roles: ['admin', 7] }
    expect(getTokenValue(token, 'sub')).toBe('42')
    expect(getTokenValue(token, 'missing')).toBeNull()
    expect(getTokenValue(undefined, 'sub')).toBeNull()
    expect(getTokenRoles(token)).toEqual(['admin', '7'])
    expect(getTokenRoles({ roles: 'admin' })).toEqual([])
    expect(getTokenRoles(undefined)).toEqual([])
  })
})

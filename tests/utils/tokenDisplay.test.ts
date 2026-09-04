import { describe, expect, it } from 'vitest'
import { readConfigDisplayName, UNKNOWN_DISPLAY_NAME } from '../../src/utils/tokenDisplay'

describe('readConfigDisplayName', () => {
  it('returns trimmed token.display_name from config', () => {
    expect(readConfigDisplayName({ token: { display_name: '  Ada Lovelace  ' } })).toBe(
      'Ada Lovelace'
    )
  })

  it('returns unknown when config, token, or display_name is missing or blank', () => {
    expect(readConfigDisplayName(undefined)).toBe(UNKNOWN_DISPLAY_NAME)
    expect(readConfigDisplayName(null)).toBe(UNKNOWN_DISPLAY_NAME)
    expect(readConfigDisplayName({})).toBe(UNKNOWN_DISPLAY_NAME)
    expect(readConfigDisplayName({ token: null })).toBe(UNKNOWN_DISPLAY_NAME)
    expect(readConfigDisplayName({ token: {} })).toBe(UNKNOWN_DISPLAY_NAME)
    expect(readConfigDisplayName({ token: { display_name: '   ' } })).toBe(UNKNOWN_DISPLAY_NAME)
    expect(readConfigDisplayName({ token: { display_name: 42 } })).toBe(UNKNOWN_DISPLAY_NAME)
  })

  it('does not read name, given_name, email, user_id, or sub', () => {
    expect(
      readConfigDisplayName({
        token: {
          name: 'Full Name',
          given_name: 'Given',
          email: 'ada@example.com',
          user_id: 'legacy-user-id',
          sub: 'legacy-sub',
        },
      })
    ).toBe(UNKNOWN_DISPLAY_NAME)
  })
})

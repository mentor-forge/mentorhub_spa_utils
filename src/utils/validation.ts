/**
 * Common validation rules for form fields
 */
export const validationRules = {
  /**
   * Required field validation
   */
  required: (v: string | number) => !!v || 'This field is required',
  
  /**
   * Name pattern: no whitespace, max 40 characters
   */
  namePattern: (v: string | number) => {
    const str = String(v)
    if (!str) return true
    return /^[^\s]{1,40}$/.test(str) || 'No whitespace, max 40 characters'
  },
  
  /**
   * Description pattern: max 255 characters, no tabs or newlines
   */
  descriptionPattern: (v: string | number) => {
    const str = String(v)
    if (!str) return true
    return /^[^\t\n]{0,255}$/.test(str) || 'Max 255 characters, no tabs or newlines'
  },

  // -- Configurator-type-aligned rules (F017 stubs; wired per-type in F018/F019) --

  /**
   * `word` configurator type: 1-40 characters, no whitespace. Alias of `namePattern`.
   */
  wordPattern: (v: string | number) => {
    const str = String(v)
    if (!str) return true
    return /^[^\s]{1,40}$/.test(str) || 'No whitespace, max 40 characters'
  },

  /**
   * `sentence` configurator type: 0-255 characters, no tabs/newlines. Alias of `descriptionPattern`.
   */
  sentencePattern: (v: string | number) => {
    const str = String(v)
    if (!str) return true
    return /^[^\t\n]{0,255}$/.test(str) || 'Max 255 characters, no tabs or newlines'
  },

  /**
   * `markdown` configurator type: string up to 4096 characters.
   */
  markdownPattern: (v: string | number) => {
    const str = String(v)
    if (!str) return true
    return str.length <= 4096 || 'Max 4096 characters'
  },

  /**
   * `email` configurator type: standard email pattern.
   */
  emailPattern: (v: string | number) => {
    const str = String(v)
    if (!str) return true
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str) || 'Must be a valid email address'
  },

  /**
   * `url` configurator type: `http(s)://...` URI.
   */
  urlPattern: (v: string | number) => {
    const str = String(v)
    if (!str) return true
    return /^https?:\/\/[^\s]+$/.test(str) || 'Must be a valid http(s):// URL'
  },

  /**
   * `us_phone` configurator type: `+1##########` or `###-###-####`.
   */
  usPhonePattern: (v: string | number) => {
    const str = String(v)
    if (!str) return true
    return /^(\+1\d{10}|\d{3}-\d{3}-\d{4})$/.test(str) || 'Must be +1##########  or ###-###-####'
  },

  /**
   * `ip_address` configurator type: IPv4 or IPv6.
   */
  ipAddressPattern: (v: string | number) => {
    const str = String(v)
    if (!str) return true
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6 = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/
    return ipv4.test(str) || ipv6.test(str) || 'Must be a valid IPv4 or IPv6 address'
  },

  /**
   * `identifier` configurator type: 24-hex-character MongoDB ObjectId.
   */
  identifierPattern: (v: string | number) => {
    const str = String(v)
    if (!str) return true
    return /^[0-9a-fA-F]{24}$/.test(str) || 'Must be a 24-character hex identifier'
  },

  /**
   * `count` / `index` configurator types: non-negative integer.
   */
  nonNegativeInteger: (v: string | number) => {
    if (v === '' || v === undefined || v === null) return true
    const num = Number(v)
    return (Number.isInteger(num) && num >= 0) || 'Must be a non-negative whole number'
  },

  /**
   * `rating` configurator type: integer 1-4.
   */
  ratingRange: (v: string | number) => {
    if (v === '' || v === undefined || v === null) return true
    const num = Number(v)
    return (Number.isInteger(num) && num >= 1 && num <= 4) || 'Must be a whole number between 1 and 4'
  },
}

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
}

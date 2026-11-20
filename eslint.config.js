import typescriptParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
  {
    files: ['src/**/*.{js,ts,vue}'],
    rules: {
      'no-debugger': 'error',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
    },
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: { parser: typescriptParser },
  },
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: typescriptParser },
    },
  },
]

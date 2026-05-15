import { config } from '@vue/test-utils'

// Suppress expected console.error from AutoSaveField/AutoSaveSelect error-handling tests
const originalError = console.error
console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Auto-save error:')) {
    return
  }
  originalError.apply(console, args)
}

// Global stubs for Vuetify components
// This prevents Vue warnings about unresolved components during tests
config.global.stubs = {
  'v-text-field': {
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'label', 'disabled', 'error', 'errorMessages', 'hint', 'rules', 'variant', 'density', 'data-automation-id'],
    emits: ['update:modelValue', 'blur']
  },
  'v-textarea': {
    template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'label', 'disabled', 'error', 'errorMessages', 'hint', 'rules', 'rows', 'variant', 'density', 'data-automation-id'],
    emits: ['update:modelValue', 'blur']
  },
  'v-select': {
    template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'items', 'label', 'disabled', 'error', 'errorMessages', 'hint', 'variant', 'density', 'data-automation-id'],
    emits: ['update:modelValue', 'blur']
  },
  'v-progress-circular': {
    template: '<div class="v-progress-circular"></div>',
    props: ['size', 'width', 'indeterminate', 'color']
  },
  'v-icon': {
    template: '<span class="v-icon"></span>',
    props: ['size', 'color']
  }
}

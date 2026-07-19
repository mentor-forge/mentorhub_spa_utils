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
    props: ['modelValue', 'label', 'disabled', 'error', 'errorMessages', 'hint', 'rules', 'variant', 'density'],
    emits: ['update:modelValue', 'blur']
  },
  'v-textarea': {
    template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'label', 'disabled', 'error', 'errorMessages', 'hint', 'rules', 'rows', 'variant', 'density'],
    emits: ['update:modelValue', 'blur']
  },
  'v-select': {
    template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue', 'items', 'label', 'disabled', 'error', 'errorMessages', 'hint', 'rules', 'variant', 'density'],
    emits: ['update:modelValue', 'blur']
  },
  'v-autocomplete': {
    name: 'VAutocompleteStub',
    template: `
      <div class="v-autocomplete-stub">
        <input
          class="v-autocomplete-stub__input"
          :value="search"
          :disabled="disabled"
          @input="onSearch($event)"
          @blur="$emit('blur', $event)"
        />
        <div class="v-autocomplete-stub__chips">
          <span
            v-for="(chip, i) in (modelValue || [])"
            :key="i"
            class="v-autocomplete-stub__chip"
            :data-value="chip"
          >
            {{ chipTitle(chip) }}
            <button
              v-if="closableChips"
              type="button"
              class="v-autocomplete-stub__chip-close"
              @click="removeChip(i)"
            >×</button>
          </span>
        </div>
        <ul class="v-autocomplete-stub__items">
          <li
            v-for="item in filteredItems"
            :key="itemValue(item)"
            class="v-autocomplete-stub__item"
            :data-value="itemValue(item)"
            @click="selectItem(item)"
          >{{ itemTitle(item) }}</li>
        </ul>
      </div>
    `,
    props: [
      'modelValue',
      'items',
      'label',
      'disabled',
      'error',
      'errorMessages',
      'hint',
      'rules',
      'variant',
      'density',
      'multiple',
      'chips',
      'closableChips',
    ],
    emits: ['update:modelValue', 'blur'],
    data() {
      return { search: '' }
    },
    computed: {
      filteredItems() {
        const q = String(this.search || '').toLowerCase()
        const items = Array.isArray(this.items) ? this.items : []
        if (!q) return items
        return items.filter((item) => {
          const title = String(this.itemTitle(item)).toLowerCase()
          const value = String(this.itemValue(item)).toLowerCase()
          return title.includes(q) || value.includes(q)
        })
      },
    },
    methods: {
      itemTitle(item) {
        if (item && typeof item === 'object' && 'title' in item) return item.title
        return item
      },
      itemValue(item) {
        if (item && typeof item === 'object' && 'value' in item) return item.value
        return item
      },
      chipTitle(chip) {
        const items = Array.isArray(this.items) ? this.items : []
        const match = items.find((item) => this.itemValue(item) === chip)
        return match ? this.itemTitle(match) : chip
      },
      onSearch(event) {
        this.search = event.target.value
      },
      selectItem(item) {
        const value = this.itemValue(item)
        const current = Array.isArray(this.modelValue) ? [...this.modelValue] : []
        if (!current.includes(value)) {
          current.push(value)
          this.$emit('update:modelValue', current)
        }
        this.search = ''
      },
      removeChip(index) {
        const current = Array.isArray(this.modelValue) ? [...this.modelValue] : []
        current.splice(index, 1)
        this.$emit('update:modelValue', current)
      },
    },
  },
  'v-switch': {
    template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" />',
    props: ['modelValue', 'label', 'disabled', 'hint', 'color', 'density', 'hideDetails'],
    emits: ['update:modelValue']
  },
  'v-rating': {
    template: '<div class="v-rating-stub" @click="$emit(\'update:modelValue\', clickValue)"></div>',
    props: ['modelValue', 'length', 'clearable', 'halfIncrements', 'readonly', 'hover', 'color', 'density', 'disabled'],
    emits: ['update:modelValue'],
    data() {
      return { clickValue: 3 }
    }
  },
  'v-progress-circular': {
    template: '<div class="v-progress-circular"></div>',
    props: ['size', 'width', 'indeterminate', 'color']
  },
  'v-icon': {
    template: '<span class="v-icon"></span>',
    props: ['size', 'color']
  },
  // CardGrid resolves these at render time via resolveComponent('VRow'/'VCol')
  VRow: {
    name: 'VRow',
    template: '<div class="v-row mh-card-grid-stub"><slot /></div>',
  },
  VCol: {
    name: 'VCol',
    props: ['cols', 'sm', 'md', 'lg', 'xl'],
    template: '<div class="v-col mh-card-grid__col"><slot /></div>',
  },
}

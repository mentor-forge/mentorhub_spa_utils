<template>
  <template v-if="visible">
    <v-text-field
      v-if="editable"
      :model-value="currentValue"
      @update:model-value="handleInput"
      @blur="handleBlur"
      type="number"
      min="0"
      step="1"
      :label="label"
      :disabled="saving"
      :error="!!error"
      :error-messages="error"
      :hint="hint"
      :rules="resolvedRules"
      variant="outlined"
      density="comfortable"
      class="index-editor"
      :data-automation-id="automationId"
    >
      <template v-if="saving" #append-inner>
        <v-progress-circular size="16" width="2" indeterminate color="primary" />
      </template>
      <template v-else-if="saved" #append-inner>
        <v-icon size="16" color="success">mdi-check</v-icon>
      </template>
    </v-text-field>
    <div v-else class="index-editor index-editor--display" :data-automation-id="resolvedAutomationId">
      <div v-if="label" class="index-editor__display-label text-caption text-medium-emphasis">{{ label }}</div>
      <div class="index-editor__display-value">{{ displayValue }}</div>
    </div>
  </template>
</template>

<script setup lang="ts">
// F019: `index` configurator type — non-negative, zero-based integer, AutoSave on
// blur. Same shape as `CountEditor`; callers may pass a hint for zero-based semantics.
import { computed, ref, watch } from 'vue'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
import { validationRules } from '../../utils/validation'
import type { BaseEditorProps } from './types'

interface Props extends BaseEditorProps<number | undefined> {}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  visible: true,
})

const resolvedRules = computed(() => props.rules ?? [validationRules.nonNegativeInteger])

const context = useDataCardContext()

const sourceValue = computed<number | undefined>(() => {
  if (props.field && context) {
    const model = resolveDataCardModel(context)
    return model?.[props.field] as number | undefined
  }
  return props.modelValue
})

const saving = ref(false)
const saved = ref(false)
const error = ref<string | null>(null)
const currentValue = ref<number | undefined>(sourceValue.value)

watch(sourceValue, (newValue) => {
  currentValue.value = newValue
})

const displayValue = computed(() => {
  const value = currentValue.value
  return value === undefined || value === null ? '—' : String(value)
})

const resolvedAutomationId = computed(() => {
  if (!props.automationId) return undefined
  return props.automationId.endsWith('-display') ? props.automationId : `${props.automationId}-display`
})

function handleInput(value: string | number) {
  currentValue.value = value === '' || value === undefined || value === null ? undefined : Number(value)
  saved.value = false
  error.value = null
}

async function handleBlur() {
  if (currentValue.value === sourceValue.value) {
    return
  }

  saving.value = true
  error.value = null
  saved.value = false

  try {
    if (props.field && context) {
      await context.onSave(props.field, currentValue.value)
    } else if (props.onSave) {
      await props.onSave(currentValue.value)
    }
    saved.value = true
    setTimeout(() => {
      saved.value = false
    }, 2000)
  } catch (err: any) {
    error.value = err?.message || 'Failed to save'
    console.error('Auto-save error:', err)
  } finally {
    saving.value = false
  }
}

defineExpose({
  currentValue,
  saving,
  saved,
  error,
  resolvedRules,
  handleInput,
  handleBlur,
})
</script>

<style scoped>
.index-editor {
  width: 100%;
}

.index-editor--display {
  width: 100%;
}

.index-editor__display-label {
  line-height: 1.2;
}

.index-editor__display-value {
  word-break: break-word;
}
</style>

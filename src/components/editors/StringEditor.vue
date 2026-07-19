<template>
  <template v-if="visible">
    <v-textarea
      v-if="textarea && editable"
      :model-value="currentValue"
      @update:model-value="handleInput"
      @blur="handleBlur"
      :label="label"
      :disabled="saving"
      :error="!!error"
      :error-messages="error"
      :hint="hint"
      :rules="rules"
      :rows="rows"
      variant="outlined"
      density="comfortable"
      class="string-editor"
      :data-automation-id="resolvedAutomationId"
    >
      <template v-if="saving" #append-inner>
        <v-progress-circular size="16" width="2" indeterminate color="primary" />
      </template>
      <template v-else-if="saved" #append-inner>
        <v-icon size="16" color="success">mdi-check</v-icon>
      </template>
    </v-textarea>
    <v-text-field
      v-else-if="editable"
      :model-value="currentValue"
      @update:model-value="handleInput"
      @blur="handleBlur"
      :label="label"
      :disabled="saving"
      :error="!!error"
      :error-messages="error"
      :hint="hint"
      :rules="rules"
      variant="outlined"
      density="comfortable"
      class="string-editor"
      :data-automation-id="resolvedAutomationId"
    >
      <template v-if="saving" #append-inner>
        <v-progress-circular size="16" width="2" indeterminate color="primary" />
      </template>
      <template v-else-if="saved" #append-inner>
        <v-icon size="16" color="success">mdi-check</v-icon>
      </template>
    </v-text-field>
    <div v-else class="string-editor string-editor--display" :data-automation-id="resolvedAutomationId">
      <div v-if="label" class="string-editor__display-label text-caption text-medium-emphasis">{{ label }}</div>
      <div class="string-editor__display-value">{{ displayValue }}</div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
import type { StringEditorProps } from './types'

const props = withDefaults(defineProps<StringEditorProps>(), {
  editable: true,
  visible: true,
})

const context = useDataCardContext()

/** Prefer the injected `DataCard` context (via `field`) over standalone `modelValue`. */
const sourceValue = computed<string | number | undefined>(() => {
  if (props.field && context) {
    const model = resolveDataCardModel(context)
    return model?.[props.field] as string | number | undefined
  }
  return props.modelValue
})

const saving = ref(false)
const saved = ref(false)
const error = ref<string | null>(null)
const currentValue = ref(sourceValue.value)

watch(sourceValue, (newValue) => {
  currentValue.value = newValue
})

const displayValue = computed(() => {
  const value = currentValue.value
  return value === undefined || value === null || value === '' ? '—' : String(value)
})

const resolvedAutomationId = computed(() => {
  if (!props.automationId) return undefined
  if (props.editable) return props.automationId
  return props.automationId.endsWith('-display') ? props.automationId : `${props.automationId}-display`
})

function handleInput(value: string | number) {
  currentValue.value = value
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
  handleInput,
  handleBlur,
})
</script>

<style scoped>
.string-editor {
  width: 100%;
}

.string-editor--display {
  width: 100%;
}

.string-editor__display-label {
  line-height: 1.2;
}

.string-editor__display-value {
  word-break: break-word;
}
</style>

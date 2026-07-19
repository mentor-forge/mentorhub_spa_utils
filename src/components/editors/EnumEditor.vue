<template>
  <template v-if="visible">
    <v-select
      v-if="editable"
      :model-value="currentValue"
      @update:model-value="handleInput"
      @blur="handleBlur"
      :items="options"
      :label="label"
      :disabled="saving"
      :error="!!error"
      :error-messages="error"
      :hint="hint"
      :rules="rules"
      persistent-hint
      variant="outlined"
      density="comfortable"
      class="enum-editor"
      :data-automation-id="automationId"
    >
      <template v-if="saving" #append-inner>
        <v-progress-circular size="16" width="2" indeterminate color="primary" />
      </template>
      <template v-else-if="saved" #append-inner>
        <v-icon size="16" color="success">mdi-check</v-icon>
      </template>
    </v-select>
    <div v-else class="enum-editor enum-editor--display" :data-automation-id="resolvedAutomationId">
      <div v-if="label" class="enum-editor__display-label text-caption text-medium-emphasis">{{ label }}</div>
      <div class="enum-editor__display-value">{{ displayValue }}</div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
import { useEnumeratorOptions } from '../../composables/useEditorConfig'
import type { EnumEditorProps } from './types'

const props = withDefaults(defineProps<EnumEditorProps>(), {
  editable: true,
  visible: true,
})

const context = useDataCardContext()
const options = useEnumeratorOptions(
  () => props.enums,
  () => props.config
)

const sourceValue = computed<string | undefined>(() => {
  if (props.field && context) {
    const model = resolveDataCardModel(context)
    return model?.[props.field] as string | undefined
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
  if (value === undefined || value === null || value === '') return '—'
  const match = options.value.find((o) => o.value === value)
  return match?.title ?? value
})

const resolvedAutomationId = computed(() => {
  if (!props.automationId) return undefined
  return props.automationId.endsWith('-display') ? props.automationId : `${props.automationId}-display`
})

function handleInput(value: string) {
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
  options,
  saving,
  saved,
  error,
  handleInput,
  handleBlur,
})
</script>

<style scoped>
.enum-editor {
  width: 100%;
}

.enum-editor--display {
  width: 100%;
}

.enum-editor__display-label {
  line-height: 1.2;
}

.enum-editor__display-value {
  word-break: break-word;
}
</style>

<template>
  <template v-if="visible">
    <div v-if="editable" class="boolean-editor">
      <v-switch
        :model-value="currentValue"
        @update:model-value="handleChange"
        :label="label"
        :disabled="saving"
        :hint="hint"
        persistent-hint
        color="primary"
        density="comfortable"
        hide-details="auto"
        class="boolean-editor__control"
        :data-automation-id="automationId"
      />
      <span v-if="saving" class="boolean-editor__status">
        <v-progress-circular size="16" width="2" indeterminate color="primary" />
      </span>
      <span v-else-if="saved" class="boolean-editor__status">
        <v-icon size="16" color="success">mdi-check</v-icon>
      </span>
      <span v-if="error" class="boolean-editor__error text-error text-caption">{{ error }}</span>
    </div>
    <div v-else class="boolean-editor boolean-editor--display" :data-automation-id="resolvedAutomationId">
      <div v-if="label" class="boolean-editor__display-label text-caption text-medium-emphasis">{{ label }}</div>
      <div class="boolean-editor__display-value">{{ displayValue }}</div>
    </div>
  </template>
</template>

<script setup lang="ts">
// F019: `boolean` configurator type — AutoSave on change (not blur), per F015 lock.
import { computed, ref, watch } from 'vue'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
import type { BaseEditorProps } from './types'

interface Props extends BaseEditorProps<boolean | undefined> {}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  visible: true,
})

const context = useDataCardContext()

const sourceValue = computed<boolean | undefined>(() => {
  if (props.field && context) {
    const model = resolveDataCardModel(context)
    return model?.[props.field] as boolean | undefined
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
  if (currentValue.value === undefined || currentValue.value === null) return '—'
  return currentValue.value ? 'Yes' : 'No'
})

const resolvedAutomationId = computed(() => {
  if (!props.automationId) return undefined
  return props.automationId.endsWith('-display') ? props.automationId : `${props.automationId}-display`
})

async function handleChange(value: boolean) {
  currentValue.value = value
  saved.value = false
  error.value = null

  if (value === sourceValue.value) {
    return
  }

  saving.value = true

  try {
    if (props.field && context) {
      await context.onSave(props.field, value)
    } else if (props.onSave) {
      await props.onSave(value)
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
  handleChange,
})
</script>

<style scoped>
.boolean-editor {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}

.boolean-editor--display {
  display: block;
}

.boolean-editor__display-label {
  line-height: 1.2;
}
</style>

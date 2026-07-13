<template>
  <template v-if="visible">
    <div v-if="editable" class="rating-editor">
      <div v-if="label" class="rating-editor__label text-caption text-medium-emphasis">{{ label }}</div>
      <v-rating
        :model-value="currentValue ?? 0"
        @update:model-value="handleChange"
        length="4"
        :half-increments="false"
        clearable
        hover
        density="comfortable"
        color="primary"
        :disabled="saving"
        class="rating-editor__control"
        :data-automation-id="automationId"
      />
      <div v-if="hint" class="rating-editor__hint text-caption text-medium-emphasis">{{ hint }}</div>
      <span v-if="saving" class="rating-editor__status">
        <v-progress-circular size="16" width="2" indeterminate color="primary" />
      </span>
      <span v-else-if="saved" class="rating-editor__status">
        <v-icon size="16" color="success">mdi-check</v-icon>
      </span>
      <span v-if="error" class="rating-editor__error text-error text-caption">{{ error }}</span>
    </div>
    <div v-else class="rating-editor rating-editor--display" :data-automation-id="resolvedAutomationId">
      <div v-if="label" class="rating-editor__display-label text-caption text-medium-emphasis">{{ label }}</div>
      <div class="rating-editor__display-value">{{ displayValue }}</div>
    </div>
  </template>
</template>

<script setup lang="ts">
// F019: `rating` configurator type — integer 1-4, AutoSave on change (not blur), per
// F015 lock. `clearable` lets a user click the active star again to clear back to
// "no rating" (undefined on the wire); `half-increments` stays false per the catalog.
import { computed, ref, watch } from 'vue'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
import type { BaseEditorProps } from './types'

interface Props extends BaseEditorProps<number | undefined> {}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  visible: true,
})

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
  return value === undefined || value === null ? '—' : `${value} / 4`
})

const resolvedAutomationId = computed(() => {
  if (!props.automationId) return undefined
  return props.automationId.endsWith('-display') ? props.automationId : `${props.automationId}-display`
})

async function handleChange(value: number) {
  const normalized = value > 0 ? value : undefined
  currentValue.value = normalized
  saved.value = false
  error.value = null

  if (normalized === sourceValue.value) {
    return
  }

  saving.value = true

  try {
    if (props.field && context) {
      await context.onSave(props.field, normalized)
    } else if (props.onSave) {
      await props.onSave(normalized)
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
.rating-editor {
  width: 100%;
}

.rating-editor__label,
.rating-editor__display-label {
  line-height: 1.2;
}
</style>

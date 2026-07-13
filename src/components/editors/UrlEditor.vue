<template>
  <template v-if="visible">
    <StringEditor
      v-if="editable"
      :field="field"
      :model-value="modelValue"
      :on-save="onSave"
      :editable="editable"
      :automation-id="automationId"
      :label="label"
      :hint="hint"
      :rules="resolvedRules"
    />
    <div v-else class="url-editor url-editor--display" :data-automation-id="resolvedAutomationId">
      <div v-if="label" class="url-editor__display-label text-caption text-medium-emphasis">{{ label }}</div>
      <a
        v-if="isDisplayableLink"
        :href="String(currentValue)"
        target="_blank"
        rel="noopener noreferrer"
        class="url-editor__link"
      >{{ currentValue }}</a>
      <span v-else class="url-editor__display-value">{{ displayValue }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
// F018: `url` configurator type. In `editable=false` mode, render as a plain link
// (no separate View component) instead of the generic plain-text display StringEditor
// uses for other string types.
import { computed } from 'vue'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
import StringEditor from './StringEditor.vue'
import { validationRules } from '../../utils/validation'
import type { BaseEditorProps } from './types'

interface Props extends BaseEditorProps<string | number | undefined> {}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  visible: true,
})

const resolvedRules = computed(() => props.rules ?? [validationRules.urlPattern])

const context = useDataCardContext()

const currentValue = computed<string | number | undefined>(() => {
  if (props.field && context) {
    const model = resolveDataCardModel(context)
    return model?.[props.field] as string | number | undefined
  }
  return props.modelValue
})

const displayValue = computed(() => {
  const value = currentValue.value
  return value === undefined || value === null || value === '' ? '—' : String(value)
})

const isDisplayableLink = computed(() => {
  const value = currentValue.value
  if (value === undefined || value === null || value === '') return false
  return validationRules.urlPattern(value) === true
})

const resolvedAutomationId = computed(() => {
  if (!props.automationId) return undefined
  return props.automationId.endsWith('-display') ? props.automationId : `${props.automationId}-display`
})
</script>

<style scoped>
.url-editor {
  width: 100%;
}

.url-editor__display-label {
  line-height: 1.2;
}

.url-editor__link,
.url-editor__display-value {
  word-break: break-word;
}
</style>

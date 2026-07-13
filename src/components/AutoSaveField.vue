<template>
  <StringEditor
    :model-value="modelValue"
    :on-save="onSave"
    :label="label"
    :hint="hint"
    :rules="rules"
    :textarea="textarea"
    :rows="rows"
    :automation-id="automationId"
  />
</template>

<script setup lang="ts">
// F017: thin compatibility wrapper around the string-editor base (non-breaking).
// Keeps the `AutoSaveField` export name and prop surface for existing journey
// SPAs; typed editors (`StringEditor` and its derivatives) are the preferred
// public API going forward.
import StringEditor from './editors/StringEditor.vue'

interface Props {
  modelValue: string | number | undefined
  label: string
  onSave: (value: string | number) => Promise<void>
  hint?: string
  rules?: Array<(v: string | number) => boolean | string>
  textarea?: boolean
  rows?: number
  automationId?: string
}

defineProps<Props>()
</script>

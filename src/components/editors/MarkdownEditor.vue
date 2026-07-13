<template>
  <StringEditor
    :field="field"
    :model-value="modelValue"
    :on-save="onSave"
    :editable="editable"
    :visible="visible"
    :automation-id="automationId"
    :label="label"
    :hint="hint"
    :rules="resolvedRules"
    textarea
    :rows="rows"
  />
</template>

<script setup lang="ts">
// F018: `markdown` configurator type — multi-line, up to 4096 chars; preserve newlines/tabs.
import { computed } from 'vue'
import StringEditor from './StringEditor.vue'
import { validationRules } from '../../utils/validation'
import type { BaseEditorProps } from './types'

interface Props extends BaseEditorProps<string | number | undefined> {
  /** `v-textarea` row count. Defaults to 4. */
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  visible: true,
  rows: 4,
})

const resolvedRules = computed(() => props.rules ?? [validationRules.markdownPattern])
</script>

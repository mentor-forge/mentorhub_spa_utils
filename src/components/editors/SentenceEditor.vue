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
  />
</template>

<script setup lang="ts">
// F018: `sentence` configurator type — short description, no tabs/newlines, max 255 chars.
import { computed } from 'vue'
import StringEditor from './StringEditor.vue'
import { validationRules } from '../../utils/validation'
import type { BaseEditorProps } from './types'

interface Props extends BaseEditorProps<string | number | undefined> {}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  visible: true,
})

const resolvedRules = computed(() => props.rules ?? [validationRules.sentencePattern])
</script>

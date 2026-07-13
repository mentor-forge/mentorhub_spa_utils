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
// F018: `ip_address` configurator type — IPv4 or IPv6; view mode is plain text (StringEditor default display).
import { computed } from 'vue'
import StringEditor from './StringEditor.vue'
import { validationRules } from '../../utils/validation'
import type { BaseEditorProps } from './types'

interface Props extends BaseEditorProps<string | number | undefined> {}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  visible: true,
})

const resolvedRules = computed(() => props.rules ?? [validationRules.ipAddressPattern])
</script>

<template>
  <v-textarea
    v-if="textarea"
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
    persistent-hint
    variant="outlined"
    density="comfortable"
    :data-automation-id="automationId"
  >
    <template v-if="saving" #append-inner>
      <v-progress-circular
        size="16"
        width="2"
        indeterminate
        color="primary"
      />
    </template>
    <template v-else-if="saved" #append-inner>
      <v-icon size="16" color="success">mdi-check</v-icon>
    </template>
  </v-textarea>
  <v-text-field
    v-else
    :model-value="currentValue"
    @update:model-value="handleInput"
    @blur="handleBlur"
    :label="label"
    :disabled="saving"
    :error="!!error"
    :error-messages="error"
    :hint="hint"
    :rules="rules"
    persistent-hint
    variant="outlined"
    density="comfortable"
    :data-automation-id="automationId"
  >
    <template v-if="saving" #append-inner>
      <v-progress-circular
        size="16"
        width="2"
        indeterminate
        color="primary"
      />
    </template>
    <template v-else-if="saved" #append-inner>
      <v-icon size="16" color="success">mdi-check</v-icon>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

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

const props = defineProps<Props>()

const saving = ref(false)
const saved = ref(false)
const error = ref<string | null>(null)
const currentValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  currentValue.value = newValue
})

function handleInput(value: string | number) {
  currentValue.value = value
  saved.value = false
  error.value = null
}

async function handleBlur() {
  if (currentValue.value === props.modelValue) {
    return
  }

  saving.value = true
  error.value = null
  saved.value = false

  try {
    await props.onSave(currentValue.value!)
    saved.value = true
    setTimeout(() => {
      saved.value = false
    }, 2000)
  } catch (err: any) {
    error.value = err.message || 'Failed to save'
    console.error('Auto-save error:', err)
  } finally {
    saving.value = false
  }
}
</script>

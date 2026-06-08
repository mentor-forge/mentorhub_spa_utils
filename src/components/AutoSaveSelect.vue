<template>
  <v-select
    :model-value="currentValue"
    @update:model-value="handleInput"
    @blur="handleBlur"
    :items="items"
    :label="label"
    :disabled="saving"
    :error="!!error"
    :error-messages="error"
    :hint="hint"
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
  </v-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string | undefined
  label: string
  items: string[] | Array<{ title: string; value: string }>
  onSave: (value: string) => Promise<void>
  hint?: string
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

function handleInput(value: string) {
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

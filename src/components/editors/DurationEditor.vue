<template>
  <template v-if="visible">
    <div v-if="editable" class="duration-editor">
      <div v-if="label" class="duration-editor__label text-caption text-medium-emphasis">{{ label }}</div>
      <div class="duration-editor__controls" @focusout="handleContainerBlur">
        <v-text-field
          v-model.number="daysInput"
          type="number"
          min="0"
          step="1"
          label="Days"
          :disabled="saving"
          persistent-hint
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          class="duration-editor__field"
          :data-automation-id="automationId"
        />
        <v-text-field
          v-model.number="hoursInput"
          type="number"
          min="0"
          max="23"
          step="1"
          label="Hours"
          :disabled="saving"
          persistent-hint
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          class="duration-editor__field"
        />
        <v-text-field
          v-model.number="minutesInput"
          type="number"
          min="0"
          max="59"
          step="1"
          label="Minutes"
          :disabled="saving"
          persistent-hint
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          class="duration-editor__field"
        />
        <v-text-field
          v-model.number="secondsInput"
          type="number"
          min="0"
          max="59"
          step="1"
          label="Seconds"
          :disabled="saving"
          persistent-hint
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          class="duration-editor__field"
        />
      </div>
      <div v-if="hint || error" class="duration-editor__hint text-caption" :class="error ? 'text-error' : 'text-medium-emphasis'">
        {{ error || hint }}
      </div>
      <span v-if="saving" class="duration-editor__status">
        <v-progress-circular size="16" width="2" indeterminate color="primary" />
      </span>
      <span v-else-if="saved" class="duration-editor__status">
        <v-icon size="16" color="success">mdi-check</v-icon>
      </span>
    </div>
    <div v-else class="duration-editor duration-editor--display" :data-automation-id="resolvedAutomationId">
      <div v-if="label" class="duration-editor__display-label text-caption text-medium-emphasis">{{ label }}</div>
      <div class="duration-editor__display-value">{{ displayValue }}</div>
    </div>
  </template>
</template>

<script setup lang="ts">
// F019: `duration` configurator type (moved from F018 per the F015 post-ship
// amendment). Wire value is an ISO-8601 duration string (`P…T…`), but the primary
// edit UX is four structured Vuetify number fields (days/hours/minutes/seconds) —
// never a raw `P3DT4H30M` text field. View mode renders a readable summary via
// `formatDurationHuman`. AutoSave fires on blur of the *composite* control (all four
// fields together, via container `focusout`) rather than per-field blur, so tabbing
// between the day/hour/minute/second fields doesn't trigger repeated partial saves.
import { computed, ref, watch } from 'vue'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
import { parseDurationIso, formatDurationIso, formatDurationHuman } from '../../utils/duration'
import type { BaseEditorProps } from './types'

interface Props extends BaseEditorProps<string | undefined> {}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  visible: true,
})

const context = useDataCardContext()

const sourceValue = computed<string | undefined>(() => {
  if (props.field && context) {
    const model = resolveDataCardModel(context)
    return model?.[props.field] as string | undefined
  }
  return props.modelValue
})

const initialParts = parseDurationIso(sourceValue.value)
const daysInput = ref(initialParts.days)
const hoursInput = ref(initialParts.hours)
const minutesInput = ref(initialParts.minutes)
const secondsInput = ref(initialParts.seconds)

watch(sourceValue, (newValue) => {
  const parts = parseDurationIso(newValue)
  daysInput.value = parts.days
  hoursInput.value = parts.hours
  minutesInput.value = parts.minutes
  secondsInput.value = parts.seconds
})

const currentValue = computed(() =>
  formatDurationIso({
    days: daysInput.value || 0,
    hours: hoursInput.value || 0,
    minutes: minutesInput.value || 0,
    seconds: secondsInput.value || 0,
  })
)

const normalizedSource = computed(() => formatDurationIso(parseDurationIso(sourceValue.value)))

const displayValue = computed(() => formatDurationHuman(sourceValue.value))

const resolvedAutomationId = computed(() => {
  if (!props.automationId) return undefined
  return props.automationId.endsWith('-display') ? props.automationId : `${props.automationId}-display`
})

const saving = ref(false)
const saved = ref(false)
const error = ref<string | null>(null)

async function handleBlur() {
  const next = currentValue.value
  if (next === normalizedSource.value) {
    return
  }

  saving.value = true
  error.value = null
  saved.value = false

  try {
    if (props.field && context) {
      await context.onSave(props.field, next)
    } else if (props.onSave) {
      await props.onSave(next)
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

async function handleContainerBlur(event: FocusEvent) {
  const container = event.currentTarget as HTMLElement
  const next = event.relatedTarget as Node | null
  if (next && container.contains(next)) return
  await handleBlur()
}

defineExpose({
  daysInput,
  hoursInput,
  minutesInput,
  secondsInput,
  currentValue,
  saving,
  saved,
  error,
  handleBlur,
  handleContainerBlur,
})
</script>

<style scoped>
.duration-editor {
  width: 100%;
}

.duration-editor__controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.duration-editor__field {
  flex: 1 1 90px;
}

.duration-editor__label,
.duration-editor__display-label {
  line-height: 1.2;
}

.duration-editor__hint {
  margin-top: 4px;
}
</style>

<template>
  <template v-if="visible">
    <div v-if="editable" class="date-time-editor">
      <div v-if="label" class="date-time-editor__label text-caption text-medium-emphasis">{{ label }}</div>
      <div class="date-time-editor__controls" @focusout="handleContainerBlur">
        <v-text-field
          v-model="dateInput"
          type="date"
          label="Date"
          :disabled="saving"
          persistent-hint
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          class="date-time-editor__date"
          :data-automation-id="automationId"
        />
        <v-text-field
          v-model="timeInput"
          type="time"
          step="1"
          label="Time"
          :disabled="saving"
          persistent-hint
          variant="outlined"
          density="comfortable"
          hide-details="auto"
          class="date-time-editor__time"
        />
      </div>
      <div v-if="hint || error" class="date-time-editor__hint text-caption" :class="error ? 'text-error' : 'text-medium-emphasis'">
        {{ error || hint }}
      </div>
      <span v-if="saving" class="date-time-editor__status">
        <v-progress-circular size="16" width="2" indeterminate color="primary" />
      </span>
      <span v-else-if="saved" class="date-time-editor__status">
        <v-icon size="16" color="success">mdi-check</v-icon>
      </span>
    </div>
    <div v-else class="date-time-editor date-time-editor--display" :data-automation-id="resolvedAutomationId">
      <div v-if="label" class="date-time-editor__display-label text-caption text-medium-emphasis">{{ label }}</div>
      <div class="date-time-editor__display-value">{{ displayValue }}</div>
    </div>
  </template>
</template>

<script setup lang="ts">
// F019: `date-time` configurator type. Wire value is an ISO-8601 date-time string,
// but users pick date/time via standard Vuetify-styled `v-text-field` `type="date"` /
// `type="time"` controls (native browser calendar/clock pickers) rather than typing
// ISO-8601 directly. AutoSave fires on blur of the *composite* control (both fields
// together, via container `focusout`) so a user tabbing from the date field into the
// time field doesn't trigger a premature save with a stale/default time.
import { computed, ref, watch } from 'vue'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
import { formatDate } from '../../utils/date'
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

function splitIso(iso: string | undefined): { date: string; time: string } {
  if (!iso) return { date: '', time: '' }
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return { date: '', time: '' }
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    date: `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`,
    time: `${pad(parsed.getHours())}:${pad(parsed.getMinutes())}:${pad(parsed.getSeconds())}`,
  }
}

function combineToIso(date: string, time: string): string | undefined {
  if (!date) return undefined
  const [year, month, day] = date.split('-').map(Number)
  const [hours = 0, minutes = 0, seconds = 0] = (time || '00:00:00').split(':').map(Number)
  const combined = new Date(year, (month || 1) - 1, day || 1, hours, minutes, seconds)
  return Number.isNaN(combined.getTime()) ? undefined : combined.toISOString()
}

const initialParts = splitIso(sourceValue.value)
const dateInput = ref(initialParts.date)
const timeInput = ref(initialParts.time)

watch(sourceValue, (newValue) => {
  const parts = splitIso(newValue)
  dateInput.value = parts.date
  timeInput.value = parts.time
})

const currentValue = computed(() => combineToIso(dateInput.value, timeInput.value))

const displayValue = computed(() => {
  const value = sourceValue.value
  return value ? formatDate(value) : '—'
})

const resolvedAutomationId = computed(() => {
  if (!props.automationId) return undefined
  return props.automationId.endsWith('-display') ? props.automationId : `${props.automationId}-display`
})

const saving = ref(false)
const saved = ref(false)
const error = ref<string | null>(null)

async function handleBlur() {
  const next = currentValue.value
  if (next === sourceValue.value) {
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
  dateInput,
  timeInput,
  currentValue,
  saving,
  saved,
  error,
  handleBlur,
  handleContainerBlur,
})
</script>

<style scoped>
.date-time-editor {
  width: 100%;
}

.date-time-editor__controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.date-time-editor__date,
.date-time-editor__time {
  flex: 1 1 140px;
}

.date-time-editor__label,
.date-time-editor__display-label {
  line-height: 1.2;
}

.date-time-editor__hint {
  margin-top: 4px;
}
</style>

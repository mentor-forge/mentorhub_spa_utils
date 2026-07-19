<template>
  <template v-if="visible">
    <div v-if="editable" class="enum-array-editor" @focusout="handleContainerBlur">
      <v-autocomplete
        :model-value="currentValue"
        @update:model-value="handleInput"
        :items="options"
        :label="label"
        :disabled="saving"
        :error="!!error"
        :error-messages="error"
        :hint="hint"
        :rules="rules"
        multiple
        chips
        closable-chips
        persistent-hint
        variant="outlined"
        density="comfortable"
        class="enum-array-editor__control"
        :data-automation-id="automationId"
      />
      <span v-if="saving" class="enum-array-editor__status">
        <v-progress-circular size="16" width="2" indeterminate color="primary" />
      </span>
      <span v-else-if="saved" class="enum-array-editor__status">
        <v-icon size="16" color="success">mdi-check</v-icon>
      </span>
    </div>
    <div v-else class="enum-array-editor enum-array-editor--display" :data-automation-id="resolvedAutomationId">
      <div v-if="label" class="enum-array-editor__display-label text-caption text-medium-emphasis">{{ label }}</div>
      <div v-if="displayPills.length === 0" class="enum-array-editor__display-empty">—</div>
      <div v-else class="enum-array-editor__pills">
        <span
          v-for="pill in displayPills"
          :key="pill.value"
          class="enum-array-editor__pill"
          :data-automation-id="pillAutomationId(pill.value)"
        >
          {{ pill.title }}
        </span>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
import { useEnumeratorOptions } from '../../composables/useEditorConfig'
import type { EnumArrayEditorProps } from './types'

const props = withDefaults(defineProps<EnumArrayEditorProps>(), {
  editable: true,
  visible: true,
})

const context = useDataCardContext()
const options = useEnumeratorOptions(
  () => props.enums,
  () => props.config
)

const allowedValues = computed(() => new Set(options.value.map((o) => o.value)))

function cloneArray(values: string[] | undefined | null): string[] {
  return Array.isArray(values) ? [...values] : []
}

function arraysEqualOrdered(a: string[] | undefined | null, b: string[] | undefined | null): boolean {
  const left = Array.isArray(a) ? a : []
  const right = Array.isArray(b) ? b : []
  if (left.length !== right.length) return false
  return left.every((v, i) => v === right[i])
}

/**
 * Keep only wire values present in the named enumerator (order preserved).
 * When the enumerator has no values yet (loading / unknown name), return a
 * clone unchanged so startup population does not wipe the model.
 */
function constrainToEnum(values: string[] | undefined | null): string[] {
  const allowed = allowedValues.value
  if (allowed.size === 0) return cloneArray(values)
  return cloneArray(values).filter((v) => allowed.has(v))
}

const sourceValue = computed<string[] | undefined>(() => {
  if (props.field && context) {
    const model = resolveDataCardModel(context)
    const raw = model?.[props.field]
    return Array.isArray(raw) ? (raw as string[]) : undefined
  }
  return props.modelValue
})

const saving = ref(false)
const saved = ref(false)
const error = ref<string | null>(null)
const currentValue = ref<string[]>(cloneArray(sourceValue.value))

watch(sourceValue, (newValue) => {
  currentValue.value = cloneArray(newValue)
})

watch(options, (next) => {
  // Once options exist, drop selections that are not in the enumerator.
  // Skip while empty so delayed config load does not clear the model first.
  if (next.length === 0) return
  currentValue.value = constrainToEnum(currentValue.value)
})

const displayPills = computed(() => {
  const values = cloneArray(sourceValue.value)
  return values.map((value) => {
    const match = options.value.find((o) => o.value === value)
    return { value, title: match?.title ?? value }
  })
})

const resolvedAutomationId = computed(() => {
  if (!props.automationId) return undefined
  return props.automationId.endsWith('-display') ? props.automationId : `${props.automationId}-display`
})

function pillAutomationId(value: string): string | undefined {
  if (!props.automationId) return undefined
  const base = props.automationId.endsWith('-display')
    ? props.automationId.slice(0, -'-display'.length)
    : props.automationId
  return `${base}-pill-${value}`
}

function handleInput(value: string[] | null | undefined) {
  // Constrain to enumerator values; never mutate the incoming array reference.
  // With a known enumerator, reject free-form / unknown wire values.
  const allowed = allowedValues.value
  currentValue.value =
    allowed.size === 0
      ? []
      : cloneArray(value).filter((v) => allowed.has(v))
  saved.value = false
  error.value = null
}

async function handleBlur() {
  const next = cloneArray(currentValue.value)
  if (arraysEqualOrdered(next, sourceValue.value)) {
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
  currentValue,
  options,
  saving,
  saved,
  error,
  handleInput,
  handleBlur,
  handleContainerBlur,
  arraysEqualOrdered,
  constrainToEnum,
})
</script>

<style scoped>
.enum-array-editor {
  width: 100%;
  position: relative;
}

.enum-array-editor__control {
  width: 100%;
}

.enum-array-editor__status {
  position: absolute;
  right: 12px;
  top: 18px;
}

.enum-array-editor--display {
  width: 100%;
}

.enum-array-editor__display-label {
  line-height: 1.2;
}

.enum-array-editor__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.enum-array-editor__pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 16px;
  background: rgba(var(--v-theme-primary), 0.12);
  font-size: 0.875rem;
  line-height: 1.5;
}

.enum-array-editor__display-empty {
  word-break: break-word;
}
</style>

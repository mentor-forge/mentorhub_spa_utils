<template>
  <div
    v-if="visible"
    class="markdown-editor"
    :data-automation-id="automationId"
  >
    <div
      v-show="!isEditing"
      class="markdown-editor__display"
      :class="{ 'markdown-editor__display--editable': editable }"
      :data-automation-id="displayAutomationId"
      :tabindex="editable ? 0 : undefined"
      role="group"
      @click="startEditing"
      @keydown.enter.prevent="startEditing"
    >
      <div
        v-if="label"
        class="markdown-editor__display-label text-caption text-medium-emphasis"
      >
        {{ label }}
      </div>

      <div
        v-if="hasContent"
        class="markdown-editor__value"
        data-automation-id="markdown-field-display"
        v-html="renderedHtml"
      />
      <em
        v-else-if="editable"
        class="markdown-editor__placeholder"
        data-automation-id="markdown-field-display"
      >
        Click to add {{ placeholderLabel }}...
      </em>
      <span
        v-else
        class="markdown-editor__empty"
        data-automation-id="markdown-field-display"
      >—</span>

      <div v-if="editable" class="markdown-editor__edit-hint text-caption">
        <v-icon size="14">mdi-pencil</v-icon>
        Edit
      </div>
    </div>

    <v-textarea
      v-if="editable"
      v-show="isEditing"
      ref="textareaRef"
      :model-value="stringValue"
      @update:model-value="handleInput"
      @blur="handleBlur"
      @keydown.escape="isEditing = false"
      :label="label"
      :disabled="saving"
      :error="!!error"
      :error-messages="error"
      :hint="hint"
      :rules="resolvedRules"
      :rows="rows"
      auto-grow
      variant="outlined"
      density="comfortable"
      class="markdown-editor__textarea"
      :data-automation-id="inputAutomationId"
    >
      <template v-if="saving" #append-inner>
        <v-progress-circular size="16" width="2" indeterminate color="primary" />
      </template>
      <template v-else-if="saved" #append-inner>
        <v-icon size="16" color="success">mdi-check</v-icon>
      </template>
    </v-textarea>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
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

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

if (typeof marked.use === 'function') {
  marked.use({ gfm: true, breaks: true })
} else if (typeof (marked as { setOptions?: (opts: object) => void }).setOptions === 'function') {
  ;(marked as { setOptions: (opts: object) => void }).setOptions({ gfm: true, breaks: true })
}

const context = useDataCardContext()
const textareaRef = ref<{ focus?: () => void; $el?: HTMLElement } | null>(null)

const sourceValue = computed<string | number | undefined>(() => {
  if (props.field && context) {
    const model = resolveDataCardModel(context)
    return model?.[props.field] as string | number | undefined
  }
  return props.modelValue
})

const isEditing = ref(false)
const saving = ref(false)
const saved = ref(false)
const error = ref<string | null>(null)
const currentValue = ref<string | number | undefined>(sourceValue.value)

watch(sourceValue, (newValue) => {
  currentValue.value = newValue
})

const resolvedRules = computed(() => props.rules ?? [validationRules.markdownPattern])

const stringValue = computed(() => {
  const value = currentValue.value
  if (value === undefined || value === null) return ''
  return String(value)
})

const hasContent = computed(() => stringValue.value.length > 0)

const placeholderLabel = computed(() => (props.label ? props.label.toLowerCase() : 'content'))

const displayAutomationId = computed(() => {
  if (!props.automationId) return undefined
  return props.automationId.endsWith('-display')
    ? props.automationId
    : `${props.automationId}-display`
})

const inputAutomationId = computed(() =>
  props.automationId ? `${props.automationId}-input` : undefined
)

function renderMarkdown(raw: string): string {
  try {
    const parsed = marked.parse(raw)
    const html = typeof parsed === 'string' ? parsed : String(parsed)
    return DOMPurify.sanitize(html)
  } catch {
    return DOMPurify.sanitize(raw)
  }
}

const renderedHtml = computed(() => (hasContent.value ? renderMarkdown(stringValue.value) : ''))

function startEditing() {
  if (!props.editable) return
  isEditing.value = true
  nextTick(() => {
    const component = textareaRef.value
    if (component && typeof component.focus === 'function') {
      component.focus()
      return
    }
    const root = component?.$el
    const textarea =
      root instanceof HTMLTextAreaElement
        ? root
        : root?.querySelector?.('textarea')
    textarea?.focus?.()
  })
}

function handleInput(value: string | number) {
  currentValue.value = value
  saved.value = false
  error.value = null
  emit('update:modelValue', String(value ?? ''))
}

async function handleBlur(event?: FocusEvent) {
  isEditing.value = false
  if (event) {
    emit('blur', event)
  }

  if (currentValue.value === sourceValue.value) {
    return
  }

  saving.value = true
  error.value = null
  saved.value = false

  try {
    if (props.field && context) {
      await context.onSave(props.field, currentValue.value)
    } else if (props.onSave) {
      await props.onSave(currentValue.value)
    }
    saved.value = true
    setTimeout(() => {
      saved.value = false
    }, 2000)
  } catch (err: unknown) {
    const message = err && typeof err === 'object' && 'message' in err
      ? String((err as { message?: unknown }).message || 'Failed to save')
      : 'Failed to save'
    error.value = message || 'Failed to save'
    console.error('Auto-save error:', err)
  } finally {
    saving.value = false
  }
}

defineExpose({
  currentValue,
  isEditing,
  saving,
  saved,
  error,
  startEditing,
  handleInput,
  handleBlur,
})
</script>

<style scoped>
.markdown-editor {
  width: 100%;
}

.markdown-editor__display {
  width: 100%;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
}

.markdown-editor__display--editable {
  border: 1px dashed rgb(var(--v-theme-primary));
  cursor: pointer;
}

.markdown-editor__display--editable:hover,
.markdown-editor__display--editable:focus-visible {
  border-color: rgb(var(--v-theme-primary));
  outline: 2px solid rgba(var(--v-theme-primary), 0.35);
  outline-offset: 1px;
}

.markdown-editor__display-label {
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.markdown-editor__placeholder {
  display: block;
  font-style: italic;
  opacity: 0.7;
}

.markdown-editor__edit-hint {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  opacity: 0.75;
}

.markdown-editor__value {
  word-break: break-word;
}

.markdown-editor__value :deep(h1) {
  font-size: 1.4rem;
  margin: 0.4em 0 0.3em;
  line-height: 1.3;
}

.markdown-editor__value :deep(h2) {
  font-size: 1.25rem;
  margin: 0.4em 0 0.3em;
  line-height: 1.3;
}

.markdown-editor__value :deep(h3) {
  font-size: 1.1rem;
  margin: 0.35em 0 0.25em;
  line-height: 1.3;
}

.markdown-editor__value :deep(h4) {
  font-size: 1rem;
  margin: 0.3em 0 0.2em;
  line-height: 1.3;
}

.markdown-editor__value :deep(p) {
  margin: 0.35em 0;
}

.markdown-editor__value :deep(ul),
.markdown-editor__value :deep(ol) {
  margin: 0.35em 0;
  padding-left: 1.25rem;
}

.markdown-editor__value :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9em;
  padding: 0.1em 0.3em;
  border-radius: 3px;
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.markdown-editor__value :deep(pre) {
  margin: 0.5em 0;
  padding: 0.6rem 0.75rem;
  overflow-x: auto;
  border-radius: 4px;
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.markdown-editor__value :deep(pre code) {
  padding: 0;
  background: transparent;
}

.markdown-editor__value :deep(blockquote) {
  margin: 0.5em 0;
  padding-left: 0.75rem;
  border-left: 3px solid rgba(var(--v-theme-on-surface), 0.25);
  opacity: 0.9;
}

.markdown-editor__textarea {
  width: 100%;
}
</style>

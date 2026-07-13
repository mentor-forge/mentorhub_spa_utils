<template>
  <template v-if="visible">
    <div class="breadcrumb-display" :data-automation-id="automationId">
      <div v-if="label" class="breadcrumb-display__label text-caption text-medium-emphasis">{{ label }}</div>
      <dl class="breadcrumb-display__list">
        <div class="breadcrumb-display__row">
          <dt>From IP</dt>
          <dd :data-automation-id="fieldAutomationId('from-ip')">{{ fieldValue('from_ip') }}</dd>
        </div>
        <div class="breadcrumb-display__row">
          <dt>By User</dt>
          <dd :data-automation-id="fieldAutomationId('by-user')">{{ fieldValue('by_user') }}</dd>
        </div>
        <div class="breadcrumb-display__row">
          <dt>At Time</dt>
          <dd :data-automation-id="fieldAutomationId('at-time')">{{ formattedAtTime }}</dd>
        </div>
        <div class="breadcrumb-display__row">
          <dt>Correlation ID</dt>
          <dd :data-automation-id="fieldAutomationId('correlation-id')">{{ fieldValue('correlation_id') }}</dd>
        </div>
      </dl>
    </div>
  </template>
</template>

<script setup lang="ts">
// F019: `breadcrumb` configurator type — composite audit object `{from_ip, by_user,
// at_time, correlation_id}`. Display-only per F015 lock (name stays `BreadcrumbDisplay`,
// default `editable=false`): audit trails aren't user-edited, so this always renders
// the same read-only definition list regardless of the `editable` prop value (kept in
// the prop surface only for shared-contract parity with the other typed editors).
import { computed } from 'vue'
import { useDataCardContext, resolveDataCardModel } from '../../composables/useDataCardContext'
import { formatDate } from '../../utils/date'
import type { BaseEditorProps, BreadcrumbValue } from './types'

interface Props extends BaseEditorProps<BreadcrumbValue | undefined> {}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  visible: true,
})

const context = useDataCardContext()

const breadcrumb = computed<BreadcrumbValue | undefined>(() => {
  if (props.field && context) {
    const model = resolveDataCardModel(context)
    return model?.[props.field] as BreadcrumbValue | undefined
  }
  return props.modelValue
})

function fieldValue(key: keyof BreadcrumbValue): string {
  const value = breadcrumb.value?.[key]
  return value === undefined || value === null || value === '' ? '—' : String(value)
}

const formattedAtTime = computed(() => {
  const value = breadcrumb.value?.at_time
  return value ? formatDate(value) : '—'
})

function fieldAutomationId(suffix: string): string | undefined {
  if (!props.automationId) return undefined
  return `${props.automationId}-${suffix}-display`
}

defineExpose({
  breadcrumb,
  fieldValue,
  formattedAtTime,
})
</script>

<style scoped>
.breadcrumb-display {
  width: 100%;
}

.breadcrumb-display__label {
  line-height: 1.2;
  margin-bottom: 4px;
}

.breadcrumb-display__list {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 4px 12px;
  margin: 0;
}

.breadcrumb-display__row {
  display: contents;
}

.breadcrumb-display__row dt {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
}

.breadcrumb-display__row dd {
  margin: 0;
  word-break: break-word;
}
</style>

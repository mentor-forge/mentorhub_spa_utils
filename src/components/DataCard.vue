<template>
  <MhCard
    :title="title"
    :name="displayName"
    :color="color"
    collapsible
    :collapsed="collapsed"
    :automation-id="automationId"
    @update:collapsed="handleUpdateCollapsed"
  >
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <slot />
  </MhCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MhCard from './MhCard.vue'
import { provideDataCardContext, type DataCardModel } from '../composables/useDataCardContext'

interface Props {
  /** Reactive document object made available to descendant editors via provide/inject. */
  model: DataCardModel
  /** Called by descendant editors as `onSave(field, value)`; not invoked directly by `DataCard`. */
  onSave: (field: string, value: unknown) => Promise<void>
  /** Model property key whose live value renders next to the title (title-bar identifier). */
  nameField?: string
  title?: string
  color?: string
  /** Optional `v-model:collapsed`; omitted (uncontrolled) defaults to `MhCard`'s own local state. */
  collapsed?: boolean
  automationId?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  color: 'primary',
  // Explicit `undefined` default (see MhCard) keeps "not passed" (uncontrolled, delegate to
  // MhCard's local state) distinguishable from "passed as `false`" (controlled).
  collapsed: undefined,
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

provideDataCardContext({
  model: () => props.model,
  onSave: (field, value) => props.onSave(field, value),
})

const displayName = computed<string | undefined>(() => {
  if (!props.nameField) return undefined
  const value = props.model?.[props.nameField]
  return value === undefined || value === null ? undefined : String(value)
})

function handleUpdateCollapsed(value: boolean) {
  emit('update:collapsed', value)
}

defineExpose({
  displayName,
})
</script>

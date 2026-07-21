<template>
  <v-card
    class="mh-card"
    :class="{ 'mh-card--collapsed': isCollapsed }"
    variant="outlined"
    rounded="lg"
    elevation="2"
    :data-automation-id="automationId"
  >
    <v-toolbar
      :color="color"
      density="comfortable"
      class="mh-card__title-bar"
      flat
    >
      <v-toolbar-title class="mh-card__title" :data-automation-id="titleAutomationId">
        {{ title }}
        <span v-if="name" class="mh-card__name">{{ name }}</span>
      </v-toolbar-title>

      <div
        v-if="$slots.actions"
        class="mh-card__actions"
        :data-automation-id="actionsAutomationId"
      >
        <slot name="actions" />
      </div>

      <v-btn
        v-if="collapsible"
        icon
        variant="text"
        size="small"
        :data-automation-id="collapseAutomationId"
        @click="toggleCollapsed"
      >
        <v-icon>{{ isCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text v-show="!isCollapsed" class="mh-card__body">
      <slot />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  title?: string
  name?: string
  color?: string
  collapsible?: boolean
  collapsed?: boolean
  automationId?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<Props>(), {
  title: '',
  color: 'primary',
  collapsible: false,
  // Explicit `undefined` default (rather than omitting the key) stops Vue's implicit
  // boolean-prop cast-to-`false` for an absent `collapsed`, so "not passed" stays
  // distinguishable from "passed as `false`" for the uncontrolled/controlled check below.
  collapsed: undefined,
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

// Uncontrolled local state by default; when the parent binds `v-model:collapsed`
// (props.collapsed !== undefined) the parent becomes the source of truth. No persistence.
const localCollapsed = ref(false)

const isCollapsed = computed(() => (props.collapsed !== undefined ? props.collapsed : localCollapsed.value))

function toggleCollapsed() {
  const next = !isCollapsed.value
  if (props.collapsed !== undefined) {
    emit('update:collapsed', next)
  } else {
    localCollapsed.value = next
  }
}

const titleAutomationId = computed(() => (props.automationId ? `${props.automationId}-title-display` : undefined))
const collapseAutomationId = computed(() => (props.automationId ? `${props.automationId}-collapse-button` : undefined))
const actionsAutomationId = computed(() => (props.automationId ? `${props.automationId}-actions-display` : undefined))

defineExpose({
  isCollapsed,
  toggleCollapsed,
})
</script>

<style scoped>
.mh-card {
  /* Do not stretch to sibling row height — collapsed cards should shrink to the title bar. */
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  width: 100%;
  height: auto;
  flex: 0 0 auto;
  background-color: rgb(var(--v-theme-surface));
}

.mh-card--collapsed {
  /* Body is hidden; keep chrome tight to the title bar even inside stretched flex columns. */
  min-height: 0;
}

.mh-card__title-bar {
  flex: 0 0 auto;
}

.mh-card__title {
  flex: 1 1 auto;
}

.mh-card__name {
  margin-left: 8px;
  opacity: 0.85;
  font-weight: 400;
}

.mh-card__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.mh-card__body {
  width: 100%;
}
</style>

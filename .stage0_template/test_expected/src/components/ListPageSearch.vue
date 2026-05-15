<template>
  <v-text-field
    v-if="searchable"
    :model-value="searchQuery"
    :label="label"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-magnify"
    clearable
    :data-automation-id="automationId"
    @update:model-value="debouncedSearch"
  />
</template>

<script setup lang="ts">
interface Props {
  searchable: boolean
  searchQuery: string
  debouncedSearch: (value: string | null) => void
  label?: string
  placeholder?: string
  automationId?: string
}

withDefaults(defineProps<Props>(), {
  label: 'Search by name',
  placeholder: 'Search...',
})
</script>

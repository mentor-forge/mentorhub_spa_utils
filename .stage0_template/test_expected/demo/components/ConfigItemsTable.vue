<template>
  <v-data-table
    :items="items"
    :headers="headers"
    item-value="name"
    :items-per-page="-1"
    hide-default-footer
    class="elevation-1"
  >
    <template #item.value="{ item }">
      <code>{{ formatValue(item.value) }}</code>
    </template>
    <template #item.from="{ item }">
      <v-chip size="small" :color="getSourceColor(String(item.from || ''))">
        {{ item.from }}
      </v-chip>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { formatConfigValue, getSourceColor } from '../utils/admin'

interface Props {
  items: Array<Record<string, unknown>>
}

defineProps<Props>()

const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Value', key: 'value', sortable: false },
  { title: 'Source', key: 'from', sortable: true },
]

function formatValue(value: unknown): string {
  return formatConfigValue(value)
}
</script>

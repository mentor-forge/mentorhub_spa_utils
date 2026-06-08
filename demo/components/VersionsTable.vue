<template>
  <v-data-table
    :items="items"
    :headers="headers"
    item-value="collection_name"
    :items-per-page="-1"
    hide-default-footer
    class="elevation-1"
  >
    <template #item.current_version="{ item }">
      <code>{{ item.current_version }}</code>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
interface Props {
  items: Array<Record<string, unknown>>
}

defineProps<Props>()

const headers = [
  { title: 'Collection', key: 'collection_name', sortable: true },
  { title: 'Version', key: 'current_version', sortable: true },
]
</script>

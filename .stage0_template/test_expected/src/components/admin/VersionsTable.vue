<template>
  <div v-if="!items || items.length === 0" class="text-center pa-4">
    <v-alert type="info" variant="tonal">No version data available</v-alert>
  </div>
  <v-data-table
    v-else
    :items="items"
    :headers="headers"
    item-value="_id"
    :items-per-page="-1"
    hide-default-footer
    class="elevation-1"
  >
    <template #item.collection_name="{ item }">
      {{ getCollectionName(item) }}
    </template>
    <template #item.version="{ item }">
      {{ getVersionNumber(item) }}
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { getCollectionName, getVersionNumber } from '../../utils/admin'

interface Props {
  items?: Array<Record<string, unknown>>
}

defineProps<Props>()

const headers = [
  { title: 'Collection Name', key: 'collection_name', sortable: true },
  { title: 'Version', key: 'version', sortable: true },
]
</script>

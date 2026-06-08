<template>
  <div v-if="!items || items.length === 0" class="text-center pa-4">
    <v-alert type="info" variant="tonal">No enumerator data available</v-alert>
  </div>
  <div v-else>
    <v-expansion-panels v-for="(enumerator, index) in items" :key="index" class="mb-2">
      <v-expansion-panel>
        <v-expansion-panel-title>
          Version: {{ getEnumeratorVersion(enumerator) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div v-for="(enumItem, enumIndex) in getEnumeratorItems(enumerator)" :key="enumIndex" class="mb-4">
            <div class="text-subtitle-1 mb-2">
              <strong>Name:</strong> {{ getEnumeratorItemName(enumItem) }}
            </div>
            <div v-if="getEnumeratorItemValues(enumItem).length > 0" class="ml-4">
              <div v-for="(val, valIndex) in getEnumeratorItemValues(enumItem)" :key="valIndex" class="mb-1">
                <strong>{{ getValue(val) }}:</strong> {{ getValueDescription(val) }}
              </div>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import {
  getEnumeratorVersion,
  getEnumeratorItems,
  getEnumeratorItemName,
  getEnumeratorItemValues,
  getValue,
  getValueDescription,
} from '../../utils/admin'

interface Props {
  items?: Array<Record<string, unknown>>
}

defineProps<Props>()
</script>

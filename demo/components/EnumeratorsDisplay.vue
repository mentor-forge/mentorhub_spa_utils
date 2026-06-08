<template>
  <div>
    <v-card
      v-for="(enumerator, index) in items"
      :key="index"
      class="mb-4"
      variant="outlined"
    >
      <v-card-title class="text-subtitle-1">
        Version {{ getVersion(enumerator) }}
      </v-card-title>
      <v-card-text>
        <div
          v-for="(item, itemIndex) in getEnumeratorItems(enumerator)"
          :key="itemIndex"
          class="mb-4"
        >
          <h4 class="mb-2">{{ getItemName(item) }}</h4>
          <v-list density="compact">
            <v-list-item
              v-for="(value, valueIndex) in getItemValues(item)"
              :key="valueIndex"
            >
              <v-list-item-title>
                <code>{{ getValue(value) }}</code>
                <span v-if="getValueDescription(value)" class="ml-2 text-caption text-medium-emphasis">
                  - {{ getValueDescription(value) }}
                </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
interface Props {
  items: Array<Record<string, unknown>>
}

defineProps<Props>()

function getVersion(enumerator: unknown): string {
  if (typeof enumerator === 'object' && enumerator !== null) {
    const e = enumerator as Record<string, unknown>
    if (e.version !== undefined && e.version !== null) {
      return String(e.version)
    }
  }
  return 'Unknown'
}

function getEnumeratorItems(enumerator: unknown): Array<Record<string, unknown>> {
  if (typeof enumerator === 'object' && enumerator !== null) {
    const e = enumerator as Record<string, unknown>
    if (Array.isArray(e.enumerators)) {
      return e.enumerators as Array<Record<string, unknown>>
    }
  }
  return []
}

function getItemName(item: Record<string, unknown>): string {
  return String(item.name || 'Unknown')
}

function getItemValues(item: Record<string, unknown>): Array<Record<string, unknown>> {
  if (Array.isArray(item.values)) {
    return item.values as Array<Record<string, unknown>>
  }
  return []
}

function getValue(valueItem: Record<string, unknown>): string {
  return String(valueItem.value || '')
}

function getValueDescription(valueItem: Record<string, unknown>): string {
  return String(valueItem.description || '')
}
</script>

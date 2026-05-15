<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h5">Admin - Configuration</v-card-title>
          <v-card-text v-if="isLoading">
            <v-progress-linear indeterminate />
          </v-card-text>
          <v-card-text v-else-if="error">
            <v-alert type="error" variant="tonal">
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
          <v-card-text v-else-if="config">
            <v-tabs v-model="tab" class="mb-4">
              <v-tab value="config" data-automation-id="admin-tab-config">Config Items</v-tab>
              <v-tab value="versions" data-automation-id="admin-tab-versions">Versions</v-tab>
              <v-tab value="enumerators" data-automation-id="admin-tab-enumerators">Enumerators</v-tab>
              <v-tab value="token" data-automation-id="admin-tab-token">Token</v-tab>
            </v-tabs>

            <v-window v-model="tab">
              <!-- Config Items Tab -->
              <v-window-item value="config">
                <ConfigItemsTable :items="(config.config_items || []) as Array<Record<string, unknown>>" />
              </v-window-item>

              <!-- Versions Tab -->
              <v-window-item value="versions">
                <VersionsTable :items="(config.versions || []) as Array<Record<string, unknown>>" />
              </v-window-item>

              <!-- Enumerators Tab -->
              <v-window-item value="enumerators">
                <EnumeratorsDisplay :items="(config.enumerators || []) as Array<Record<string, unknown>>" />
              </v-window-item>

              <!-- Token Tab -->
              <v-window-item value="token">
                <TokenClaimsCard :token="config.token as Record<string, unknown> | undefined" />
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ConfigItemsTable from './admin/ConfigItemsTable.vue'
import VersionsTable from './admin/VersionsTable.vue'
import EnumeratorsDisplay from './admin/EnumeratorsDisplay.vue'
import TokenClaimsCard from './admin/TokenClaimsCard.vue'

export interface ConfigResponse {
  config_items?: Array<Record<string, unknown>>
  versions?: Array<Record<string, unknown>>
  enumerators?: Array<Record<string, unknown>>
  token?: Record<string, unknown>
}

export interface AdminPageProps {
  config: ConfigResponse | null
  isLoading?: boolean
  error?: Error | string | null
}

const props = withDefaults(defineProps<AdminPageProps>(), {
  isLoading: false,
  error: null,
})

const tab = ref('config')

const errorMessage = computed(() => {
  if (!props.error) return ''
  return props.error instanceof Error ? props.error.message : String(props.error)
})
</script>

<style scoped>
.config-json {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.config-json-small {
  background-color: rgba(0, 0, 0, 0.03);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.token-value {
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
}
</style>

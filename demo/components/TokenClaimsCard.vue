<template>
  <v-card v-if="token" variant="outlined">
    <v-card-title class="text-subtitle-1">Token Claims</v-card-title>
    <v-card-text>
      <v-list density="compact">
        <v-list-item>
          <v-list-item-title>Subject</v-list-item-title>
          <v-list-item-subtitle>
            <code class="token-value">{{ getTokenValue(token, 'sub') || 'N/A' }}</code>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Issued At</v-list-item-title>
          <v-list-item-subtitle>
            <code class="token-value">{{ getTokenValue(token, 'iat') || 'N/A' }}</code>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Expires At</v-list-item-title>
          <v-list-item-subtitle>
            <code class="token-value">{{ getTokenValue(token, 'exp') || 'N/A' }}</code>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Roles</v-list-item-title>
          <v-list-item-subtitle>
            <v-chip
              v-for="role in getTokenRoles(token)"
              :key="role"
              size="small"
              class="mr-1"
            >
              {{ role }}
            </v-chip>
            <span v-if="getTokenRoles(token).length === 0" class="text-medium-emphasis">None</span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-divider class="my-4" />
      <div class="config-json-small">
        <pre>{{ JSON.stringify(token, null, 2) }}</pre>
      </div>
    </v-card-text>
  </v-card>
  <v-alert v-else type="info" variant="tonal">
    No token data available
  </v-alert>
</template>

<script setup lang="ts">
import { getTokenValue, getTokenRoles } from '../utils/admin'

interface Props {
  token?: Record<string, unknown>
}

defineProps<Props>()
</script>

<style scoped>
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

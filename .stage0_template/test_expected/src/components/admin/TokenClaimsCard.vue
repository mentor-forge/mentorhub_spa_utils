<template>
  <div v-if="!token" class="text-center pa-4">
    <v-alert type="info" variant="tonal">No token data available</v-alert>
  </div>
  <v-card v-else variant="outlined">
    <v-card-title class="text-subtitle-1">
      <v-icon class="mr-2">mdi-shield-key</v-icon>
      Token Claims
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="getTokenValueUtil(props.token, 'remote_ip') || 'N/A'"
            label="IP Address"
            readonly
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-ip-network"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="getTokenValueUtil(props.token, 'user_id') || getTokenValueUtil(props.token, 'sub') || 'N/A'"
            label="ID"
            readonly
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-identifier"
          />
        </v-col>
        <v-col cols="12">
          <div class="text-subtitle-2 mb-2">Roles</div>
          <div v-if="roles.length === 0" class="text-grey">
            No roles assigned
          </div>
          <v-chip-group v-else>
            <v-chip
              v-for="role in roles"
              :key="role"
              color="primary"
              variant="flat"
              size="small"
            >
              {{ role }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getTokenValue as getTokenValueUtil, getTokenRoles } from '../../utils/admin'

interface Props {
  token?: Record<string, unknown>
}

const props = defineProps<Props>()

const roles = computed(() => getTokenRoles(props.token))
</script>

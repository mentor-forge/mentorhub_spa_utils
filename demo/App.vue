<template>
  <v-app>
    <PageFrame page-title="spa_utils Demo">
      <v-container fluid>
        <router-view />
      </v-container>
    </PageFrame>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { PageFrame } from '../src/index'
import { useAuth } from '../src/composables/useAuth'
import { provideEditorConfig } from '../src/composables/useEditorConfig'
import { useConfig } from './composables/useConfig'

const { isAuthenticated } = useAuth()
const { config, loadConfig } = useConfig()

// One startup `/api/config` fetch; enum editors resolve options from this reactive ref.
provideEditorConfig(config)

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await loadConfig()
    } catch (e) {
      console.warn('Failed to load config on mount:', e)
    }
  }
})
</script>

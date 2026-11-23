<template>
  <AdminPage :config="config" :is-loading="isLoading" :error="error" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AdminPage from '../../src/components/AdminPage.vue'
import { useConfig } from '../composables/useConfig'

const { config, isLoading, error, loadConfig } = useConfig()

onMounted(async () => {
  if (!config.value) {
    try {
      await loadConfig()
    } catch (err) {
      console.error('Failed to load config:', err)
    }
  }
})
</script>

<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon
        v-if="isAuthenticated"
        @click="drawer = !drawer"
        data-automation-id="nav-drawer-toggle"
        aria-label="Open navigation drawer"
      />
      <v-app-bar-title>spa_utils Demo</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-if="isAuthenticated"
      v-model="drawer"
      temporary
    >
      <v-list density="compact" nav>
        <v-list-item
          to="/demo"
          prepend-icon="mdi-view-dashboard"
          title="Component Demo"
          data-automation-id="nav-demo-link"
        />
        <v-list-item
          v-if="hasAdminRole"
          to="/admin"
          prepend-icon="mdi-cog"
          title="Admin (Config)"
          data-automation-id="nav-admin-link"
        />
      </v-list>

      <template v-slot:append>
        <v-divider />
        <v-list density="compact" nav>
          <v-list-item
            @click="handleLogout"
            prepend-icon="mdi-logout"
            title="Logout"
            data-automation-id="nav-logout-link"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { useConfig } from './composables/useConfig'

const router = useRouter()
const { isAuthenticated, logout, roles } = useAuth()
const { loadConfig } = useConfig()
const drawer = ref(false)

const hasAdminRole = computed(() => (roles.value || []).includes('admin'))

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await loadConfig()
    } catch (e) {
      console.warn('Failed to load config on mount:', e)
    }
  }
})

function handleLogout() {
  logout()
  drawer.value = false
  router.push('/')
}
</script>

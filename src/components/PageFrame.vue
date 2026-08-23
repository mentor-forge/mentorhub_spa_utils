<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon
      v-if="isAuthenticated"
      data-automation-id="nav-drawer-toggle"
      aria-label="Open navigation drawer"
      @click="toggleDrawer"
    />
    <v-app-bar-title data-automation-id="page-frame-title">
      {{ pageTitle }}
    </v-app-bar-title>
    <v-spacer />
    <a
      v-if="isAuthenticated"
      :href="profileHref"
      data-automation-id="nav-profile-link"
    >
      <v-avatar>
        <v-img v-if="profilePicture" :src="profilePicture" alt="" />
        <v-icon v-else>mdi-account</v-icon>
      </v-avatar>
    </a>
  </v-app-bar>

  <v-navigation-drawer
    v-if="isAuthenticated"
    v-model="drawer"
    temporary
  >
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.id"
        :href="item.href"
        :title="item.title"
        :data-automation-id="item.automationId"
      />
    </v-list>
    <v-divider />
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-logout"
        title="Logout"
        data-automation-id="nav-logout-link"
        @click="handleLogout"
      />
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <slot />
  </v-main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { redirectToIdpLogin } from '../utils/idpRedirect'
import { JOURNEY_APP_PATHS, buildJourneyUrl } from '../utils/journeyUrls'
import {
  readProfilePicture,
  visibleUniversalNavItems,
} from '../composables/universalNav'

const props = defineProps<{
  pageTitle: string
  customerName?: string
}>()

const { isAuthenticated, roles, logout } = useAuth()
const drawer = ref(false)

const navItems = computed(() =>
  visibleUniversalNavItems(roles.value, props.customerName)
)

const profileHref = computed(() => {
  const { journey, path } = JOURNEY_APP_PATHS.profile
  return buildJourneyUrl(journey, path)
})

const profilePicture = computed(() => readProfilePicture())

function toggleDrawer() {
  drawer.value = !drawer.value
}

function handleLogout() {
  const returnTo = `${window.location.origin}/`
  logout()
  drawer.value = false
  redirectToIdpLogin(returnTo)
}

defineExpose({ drawer, toggleDrawer, handleLogout })
</script>

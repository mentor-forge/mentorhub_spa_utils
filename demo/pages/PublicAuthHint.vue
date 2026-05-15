<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="6">
        <v-card>
          <v-card-title class="text-h5 text-center pa-4">
            Authentication required
          </v-card-title>
          <v-card-text class="text-body-1">
            <p class="mb-4">
              This demo does not call a backend login API. Use the Developer Edition welcome flow,
              your IdP, or paste a token via URL hash before loading the app (see
              <code>bootstrapAuthFromUrl</code> in <code>src/utils/urlAuthBootstrap.ts</code>).
            </p>
            <p class="mb-2">Expected hash format:</p>
            <pre
              class="text-caption bg-grey-darken-4 pa-2 rounded mb-4"
              data-automation-id="sign-in-hash-hint"
            >#access_token=JWT&amp;expires_at=ISO8601&amp;roles=admin,developer</pre>
            <p v-if="redirectHint" class="mb-4 text-medium-emphasis">
              After authenticating: <strong>{{ redirectHint }}</strong>
            </p>
            <v-btn
              color="primary"
              block
              :disabled="!isAuthenticated"
              data-automation-id="continue-to-app-button"
              @click="goContinue"
            >
              Continue
            </v-btn>
            <v-alert
              v-if="!isAuthenticated"
              type="info"
              variant="tonal"
              class="mt-4"
              data-automation-id="sign-in-info-alert"
            >
              Seed auth (e.g. from the welcome page) or run E2E helpers that set localStorage, then
              refresh or click Continue.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()

const redirectHint = computed(() => {
  const r = route.query.redirect as string | undefined
  return r && r.length > 0 ? r : '/demo'
})

function goContinue() {
  const target = redirectHint.value || '/demo'
  router.replace(target)
}
</script>

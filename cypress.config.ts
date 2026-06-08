import { defineConfig } from 'cypress'
import { e2eDefaultJwtSecret } from './cypress/config/jwtDefaults'
import { registerJwtSignTask } from './cypress/plugins/registerJwtSignTask'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8386',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    env: {
      JWT_SECRET: e2eDefaultJwtSecret(),
    },
    setupNodeEvents(on) {
      registerJwtSignTask(on)
    },
    // Assume services are already running - don't wait unnecessarily
    defaultCommandTimeout: 4000,
    requestTimeout: 5000,
    responseTimeout: 5000,
  },
})
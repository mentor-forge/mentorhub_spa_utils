# Mentor Hub — shared SPA utilities

Reusable Vue 3 + Vuetify components, composables, and utilities for **`mentorhub_spa_utils`** and other Mentor Hub SPAs.

## Prerequisites
- Mentor Hub [Developers Edition](https://github.com/mentor-forge/mentorhub/blob/main/CONTRIBUTING.md)
- Developer [SPA Standard Prerequisites](https://github.com/mentor-forge/mentorhub/blob/main/DeveloperEdition/standards/spa_standards.md)

## Usage

For complete working examples, see the [demo app](./demo/) which uses the standard journey-SPA auth flow (IdP redirect, shared `useAuth`, navigation drawer), **component demo page**, and **admin (config) page**. The dev server can proxy `/api` to a local api_utils demo.

### Authentication integration

Journey SPAs should use spa_utils for the full auth flow — no local `loginRedirect.ts` or duplicated `useAuth` module.

**1. Bootstrap before the router mounts** (`src/initAuth.ts`, imported first from `main.ts`):

```typescript
import { bootstrapAuthFromUrl } from '@mentor-forge/mentorhub_spa_utils'
import { syncAuthFromStorage } from '@mentor-forge/mentorhub_spa_utils'

bootstrapAuthFromUrl()
syncAuthFromStorage()
```

`bootstrapAuthFromUrl()` reads `#access_token=...&expires_at=...&roles=...` into `localStorage` and handles `?clear_stored_auth=1`. Call **`syncAuthFromStorage()`** again after clearing tokens (e.g. on `401`).

**2. Router guards and layout** — use shared **`useAuth()`** and **`hasStoredRole()`** from `@mentor-forge/mentorhub_spa_utils`. Redirect unauthenticated `requiresAuth` routes with **`redirectToIdpLogin(window.location.origin + to.fullPath)`** and `next(false)`.

**3. Logout** — clear auth via `logout()`, then **`redirectToIdpLogin(\`${window.location.origin}/\`)`**.

**4. Build-time config** — set **`VITE_IDP_LOGIN_URI`** for production (Developer Edition: `http://127.0.0.1:8080/login.html`). When unset, **`redirectToIdpLogin()`** falls back to that Developer Edition URL and uses **`location.replace`**.

See [demo/router.ts](./demo/router.ts) and [demo/bootstrap-auth.ts](./demo/bootstrap-auth.ts) for a working reference.

#### URL bootstrap (`urlAuthBootstrap`)

**Source:** [src/utils/urlAuthBootstrap.ts](./src/utils/urlAuthBootstrap.ts)

#### IdP redirect (`idpRedirect`)

**Source:** [src/utils/idpRedirect.ts](./src/utils/idpRedirect.ts)  
**Tests:** [tests/utils/idpRedirect.test.ts](./tests/utils/idpRedirect.test.ts)

#### useAuth composable

**Source:** [src/composables/useAuth.ts](./src/composables/useAuth.ts)  
**Tests:** [tests/composables/useAuth.test.ts](./tests/composables/useAuth.test.ts)

### Composables

Handle errors from queries/mutations with reactive error state. Returns `showError`, `errorMessage`, and `clearError` refs.

**Source:** [src/composables/useErrorHandler.ts](./src/composables/useErrorHandler.ts)  
**Tests:** [tests/composables/useErrorHandler.test.ts](./tests/composables/useErrorHandler.test.ts)  
**Demo:** See [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) for usage examples

#### useResourceList

Generic list page pattern with search support, data fetching, error handling, and navigation.

**Source:** [src/composables/useResourceList.ts](./src/composables/useResourceList.ts)  
**Tests:** [tests/composables/useResourceList.test.ts](./tests/composables/useResourceList.test.ts)  
**Example:** See [template_vue_vuetify CreatesListPage](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/pages/CreatesListPage.vue) for real-world usage

**Features:**
- Automatic search debouncing (300ms)
- Query key management with search query
- Error handling via useErrorHandler
- Navigation to item detail pages
- Configurable search functionality

**Returns:** `items`, `isLoading`, `showError`, `errorMessage`, `searchQuery`, `debouncedSearch`, `navigateToItem`

#### useInfiniteScroll

Infinite scroll list page pattern with server-side pagination, sorting, and search.

**Source:** [src/composables/useInfiniteScroll.ts](./src/composables/useInfiniteScroll.ts)  
**Tests:** [tests/composables/useInfiniteScroll.test.ts](./tests/composables/useInfiniteScroll.test.ts)  
**Example:** See [template_vue_vuetify ControlsListPage](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/pages/ControlsListPage.vue) for real-world usage

**Features:**
- Infinite scroll with cursor-based pagination
- Server-side sorting (click column headers to sort)
- Debounced search (300ms)
- Automatic query key management (includes search, sort, order)
- Loading states for initial load and "load more"
- Error handling via useErrorHandler

**Returns:** `items`, `isLoading`, `isFetchingNextPage`, `hasMore`, `loadMore`, `showError`, `errorMessage`, `searchQuery`, `debouncedSearch`, `sortBy`, `order`, `setSortBy`, `setOrder`

**Usage:**
```typescript
const {
  items,
  isLoading,
  hasMore,
  loadMore,
  searchQuery,
  debouncedSearch,
  sortBy,
  order,
  setSortBy,
  setOrder,
} = useInfiniteScroll<Control>({
  queryKey: ['controls'],
  queryFn: (params) => api.getControls(params),
  getItemId: (item) => item._id,
  limit: 20,
})
```

#### useRoles

Role-based access control with dependency injection pattern.

**Source:** [src/composables/useRoles.ts](./src/composables/useRoles.ts)  
**Tests:** [tests/composables/useRoles.test.ts](./tests/composables/useRoles.test.ts)  
**Example:** See [template_vue_vuetify useRoles wrapper](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/composables/useRoles.ts) for recommended implementation

**Recommended:** Create a wrapper in your app that provides app-specific auth and config. Accepts optional `AuthProvider` and `ConfigProvider` for dependency injection. Returns `roles`, `hasRole`, and `hasAnyRole`.

### Components

#### AutoSaveField

Text input or textarea with auto-save on blur.

**Source:** [src/components/AutoSaveField.vue](./src/components/AutoSaveField.vue)  
**Tests:** [tests/components/AutoSaveField.test.ts](./tests/components/AutoSaveField.test.ts)  
**Demo:** See [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) for working examples  
**E2E Tests:** [cypress/e2e/components.cy.ts](./cypress/e2e/components.cy.ts)

**Props:**
- `modelValue: string | number | undefined` - Current value
- `label: string` - Field label
- `onSave: (value: string | number) => Promise<void>` - Save callback
- `hint?: string` - Helper text
- `rules?: Array<(v: string | number) => boolean | string>` - Validation rules
- `textarea?: boolean` - Use textarea instead of text input
- `rows?: number` - Number of rows for textarea
- `automationId?: string` - Automation ID for testing

**Features:**
- Shows saving/saved/error states
- Only saves when value changes
- Displays validation errors

**Real-world example:** See [template_vue_vuetify ControlEditPage](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/pages/ControlEditPage.vue)

#### AutoSaveSelect

Select dropdown with auto-save on blur.

**Source:** [src/components/AutoSaveSelect.vue](./src/components/AutoSaveSelect.vue)  
**Tests:** [tests/components/AutoSaveSelect.test.ts](./tests/components/AutoSaveSelect.test.ts)  
**Demo:** See [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) for working examples  
**E2E Tests:** [cypress/e2e/components.cy.ts](./cypress/e2e/components.cy.ts)

**Props:**
- `modelValue: string | undefined` - Current value
- `label: string` - Field label
- `items: string[] | Array<{ title: string; value: string }>` - Select options
- `onSave: (value: string) => Promise<void>` - Save callback
- `hint?: string` - Helper text
- `automationId?: string` - Automation ID for testing

**Real-world example:** See [template_vue_vuetify ControlEditPage](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/pages/ControlEditPage.vue)

#### ListPageSearch

Reusable search field for list pages.

**Source:** [src/components/ListPageSearch.vue](./src/components/ListPageSearch.vue)  
**Demo:** See [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) for working examples  
**E2E Tests:** [cypress/e2e/components.cy.ts](./cypress/e2e/components.cy.ts)

**Real-world example:** See [template_vue_vuetify CreatesListPage](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/pages/CreatesListPage.vue) and [ControlsListPage](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/pages/ControlsListPage.vue)

### Utilities

#### formatDate

Format ISO date strings to localized strings. Returns `"N/A"` for null/undefined/empty strings.

**Source:** [src/utils/date.ts](./src/utils/date.ts)  
**Tests:** [tests/utils/date.test.ts](./tests/utils/date.test.ts)  
**Demo:** See [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) for usage examples  
**E2E Tests:** [cypress/e2e/utils.cy.ts](./cypress/e2e/utils.cy.ts)

**Real-world example:** See [template_vue_vuetify ControlsListPage](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/pages/ControlsListPage.vue)

#### validationRules

Common validation rules for form fields. Includes `required`, `namePattern` (no whitespace, max 40 chars), and `descriptionPattern` (max 255 chars, no tabs/newlines). Each rule returns `true` for valid input or an error message string for invalid input.

**Source:** [src/utils/validation.ts](./src/utils/validation.ts)  
**Tests:** [tests/utils/validation.test.ts](./tests/utils/validation.test.ts)  
**Demo:** See [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) for usage examples  
**E2E Tests:** [cypress/e2e/utils.cy.ts](./cypress/e2e/utils.cy.ts)

**Real-world example:** See [template_vue_vuetify ControlNewPage](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/pages/ControlNewPage.vue) and [ControlEditPage](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/pages/ControlEditPage.vue)

## Demo App

For complete working examples, see the [demo app](./demo/) — standard IdP auth redirect, **navigation drawer**, **component demo page**, and **admin (config) page**. See [Authentication integration](#authentication-integration) above.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, project structure, and contribution guidelines.

## See Also

- **Real-world usage:** [template_vue_vuetify](https://github.com/mentor-forge/stage0_template_vue_vuetify) - Complete SPA template using spa_utils
- **Backing service:** [api_utils](https://github.com/mentor-forge/stage0_template_flask_mongo) - Python utilities for API development
- **Standards:** [SPA Standards](https://github.com/mentor-forge/mentorhub/blob/main/DeveloperEdition/standards/spa_standards.md) - Mentor Hub SPA development standards
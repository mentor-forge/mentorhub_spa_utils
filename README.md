# Mentor Hub — shared SPA utilities

Reusable Vue 3 + Vuetify components, composables, and utilities for Mentor Hub journey SPAs (`@mentor-forge/mentorhub_spa_utils`).

## Prerequisites
- Mentor Hub [Developers Edition](https://github.com/mentor-forge/mentorhub/blob/main/CONTRIBUTING.md)
- Developer [SPA Standard Prerequisites](https://github.com/mentor-forge/mentorhub/blob/main/DeveloperEdition/standards/spa_standards.md)

## Usage

Install from CodeArtifact (run `mh` first for credentials):

```bash
npm install @mentor-forge/mentorhub_spa_utils@0.5.1
```

Working examples live in the [demo app](./demo/): IdP auth, navigation drawer, **type editor gallery** (`/demo/editors`), **cards dashboard** (`/demo/dashboard`), legacy component demos (`/demo`), and admin config (`/admin`).

### Preferred UI: Cards + type-aligned field editors

New list and view/edit pages should compose **`CardGrid` / `MhCard` / `DataCard`** with **configurator-type editors** under `src/components/editors/`. Prefer these over ad-hoc Vuetify fields or infinite-scroll list patterns.

#### MhCard / CardGrid / DataCard

Adaptive card chrome for list dashboards and declarative edit forms. Defaults use stock Vuetify/Material Design (`density="comfortable"`, `variant="outlined"` on form controls).

**Demo:** [DashboardPage.vue](./demo/pages/DashboardPage.vue) (`/demo/dashboard`), [EditorsPage.vue](./demo/pages/EditorsPage.vue) (`/demo/editors`)

| Component | Role |
|-----------|------|
| `MhCard` | Solid-color title bar (title + optional `name`), white body, `#actions` slot, optional collapse (`collapsible`; uncontrolled or `v-model:collapsed`; **no persistence**). Collapsed cards shrink to the title bar (do not stretch to sibling row height). |
| `CardGrid` | Responsive `VRow`/`VCol` grid. **Defaults:** `cols="12" sm="6" md="4" lg="3"`. Override via props. |
| `DataCard` | Form section: composes `MhCard`, takes `model` + optional `nameField` + `onSave`, and `provide`s context so child editors bind by `field` |

```vue
<CardGrid>
  <DataCard title="Identity" name-field="word" :model="doc" :on-save="saveField">
    <WordEditor field="word" label="Name" automation-id="profile-name" />
    <MarkdownEditor field="description" label="Description" automation-id="profile-description" />
  </DataCard>
</CardGrid>
```

**Sources:** [MhCard.vue](./src/components/MhCard.vue), [CardGrid.vue](./src/components/CardGrid.vue), [DataCard.vue](./src/components/DataCard.vue)  
**Context helpers:** [useDataCardContext.ts](./src/composables/useDataCardContext.ts)

#### Type-aligned editors (field components)

Configurator-type view/edit controls. Prefer these for new forms.

**Shared props:** `field` (when inside `DataCard`), standalone `modelValue` + `onSave`, `editable` (default `true` except Identifier/Breadcrumb), optional `visible`, `automationId` → `data-automation-id`, plus `label` / `hint` / `rules`.

**Save triggers:** blur for string / count / index / date-time / duration composites / **enum** / **enum_array** (array saves when focus leaves the whole control); **change** for boolean and rating.

| Type | Component | Notes |
|------|-----------|-------|
| `word` | `WordEditor` | 1–40 chars, no whitespace |
| `sentence` | `SentenceEditor` | 0–255, no tabs/newlines |
| `markdown` | `MarkdownEditor` | textarea, max 4096 |
| `email` | `EmailEditor` | email pattern |
| `url` | `UrlEditor` | URI; link in view mode |
| `us_phone` | `UsPhoneEditor` | US phone patterns |
| `ip_address` | `IpAddressEditor` | IPv4/IPv6 |
| `identifier` | `IdentifierEditor` | ObjectId; **default `editable=false`** |
| `boolean` | `BooleanEditor` | `v-switch`; save on change |
| `count` / `index` | `CountEditor` / `IndexEditor` | non-negative int |
| `rating` | `RatingEditor` | `v-rating` 1–4; save on change |
| `date-time` | `DateTimeEditor` | picker UX → ISO-8601 string |
| `duration` | `DurationEditor` | human units → ISO-8601 duration (not raw `P…T…` typing) |
| `enum` | `EnumEditor` | scalar string; options from runtime `/api/config` via `enums` name |
| `enum_array` | `EnumArrayEditor` | `string[]`; autocomplete + closable pills; same runtime enumerators |
| `breadcrumb` | `BreadcrumbDisplay` | display-only audit trail |

**Runtime enumerators (required for enum editors):** Allowed values come from **`/api/config`**, not OpenAPI and not hard-coded `items` arrays. Each SPA fetches config once at authenticated startup and provides it near the app root:

```typescript
import { provideEditorConfig } from '@mentor-forge/mentorhub_spa_utils'
import { useConfig } from './composables/useConfig' // app-owned startup fetch

const { config, loadConfig } = useConfig()
provideEditorConfig(config) // reactive Ref / ComputedRef / getter — editors update when load completes

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await loadConfig() // GET /api/config once
    } catch (e) {
      console.warn('Failed to load config on mount:', e)
    }
  }
})
```

Declarative usage inside a `DataCard` (no option lists on the component):

```vue
<EnumEditor field="status" enums="status" label="Status" automation-id="profile-status" />
<EnumArrayEditor field="tags" enums="tags" label="Tags" automation-id="profile-tags" />
```

- **`enums`**: case-sensitive enumerator name matching the dictionary property key; resolved against `config.enumerators[].enumerators[]`.
- **Wire values:** `enum` → `string`; `enum_array` → `string[]` (ordered as selected). Option **labels** use each value’s `description` when present, otherwise the wire `value`.
- **UX:** `EnumEditor` is a `v-select` (AutoSave on blur). `EnumArrayEditor` is a multi `v-autocomplete` with closable chips/pills; AutoSave when focus leaves the whole control. Missing/loading/unknown enumerators yield an empty option list without throwing.
- **Helpers:** `provideEditorConfig`, `useEditorConfig`, `resolveEnumeratorOptions` — see [useEditorConfig.ts](./src/composables/useEditorConfig.ts).

**Demo:** `/demo/editors`  
**Folder:** [src/components/editors/](./src/components/editors/)  
**Base:** [StringEditor.vue](./src/components/editors/StringEditor.vue) — abstract string input used by word/sentence/email/… derivatives

Import from the package root or `./components`:

```typescript
import {
  CardGrid,
  DataCard,
  WordEditor,
  MarkdownEditor,
  EnumEditor,
  EnumArrayEditor,
  provideEditorConfig,
} from '@mentor-forge/mentorhub_spa_utils'
```

### Harvesting a local control into spa_utils

`spa_utils` is the canonical home for UI that spans more than one journey SPA — the same role `api_utils.services` plays for shared API model services. When a journey SPA needs a control that is not yet in this package:

1. **Implement it locally first** in the journey SPA (`src/components/` or similar), against a real page.
2. **Follow the shared editor contract** so harvest is mechanical later:
   - Props: `field`, `modelValue` / `onSave`, `editable`, `visible`, `automationId`, `label` / `hint` / `rules`
   - Prefer `DataCard` inject via `useDataCardContext` when nested in a form card; keep standalone `modelValue` + `onSave` working for demos
   - Vuetify defaults: `density="comfortable"`, `variant="outlined"` unless the control type requires otherwise
   - Stable `data-automation-id` values per [SPA standards](https://github.com/mentor-forge/mentorhub/blob/main/DeveloperEdition/standards/spa_standards.md)
   - No journey-specific hardcoding (domain names, route paths, API clients) inside the control — inject behavior via props/callbacks
3. **Validate and AutoSave** like existing editors (blur vs change as appropriate); reuse or mirror `validationRules` patterns.
4. **Unit-test** the local control (Vitest / Vue Test Utils) with the same coverage targets as spa_utils components.
5. **When a second SPA needs it (or it is clearly shared), harvest:**
   - Move the component into `mentorhub_spa_utils` under `src/components/editors/` (or `src/components/` for layout)
   - Export from `src/components/index.ts` / package `./components`
   - Add demo coverage on `/demo/editors` (or dashboard) and Cypress where interactive
   - Document the type → component mapping in this README
   - Bump spa_utils (minor for additive surface), publish, then bump consumers and delete the local copy

Until harvest ships, keep the local control as a thin, contract-compatible duplicate — do not invent a parallel prop API that will block promotion.

### Deprecated: infinite-scroll list APIs

APIs and SPAs are migrating to **header-based offset/size pagination** with plain array responses (see `api_utils` Get List pattern). The cursor / infinite-scroll SPA helpers below remain exported for older consumers but are **deprecated** — do not use them in new pages.

| Deprecated export | Location | Replacement |
|-------------------|----------|-------------|
| `useInfiniteScroll` | [useInfiniteScroll.ts](./src/composables/useInfiniteScroll.ts) | List UIs: `CardGrid` + `MhCard` (or tables) driven by offset/size header pagination from the API. Prefer `useResourceList` only for simple non-cursor lists until a shared offset/size list composable exists. |
| `InfiniteScrollResponse` | same | Plain JSON array body + pagination response headers |
| `InfiniteScrollParams` | same | `offset` / `size` **request headers**; `sort_by` / `order` and filters as **query params** |
| `UseInfiniteScrollOptions` | same | — |

Cursor fields **`after_id`**, **`limit`**, **`has_more`**, and **`next_cursor`** must not appear in new SPA ↔ API contracts.

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

#### useErrorHandler

Handle errors from queries/mutations with reactive error state. Returns `showError`, `errorMessage`, and `clearError` refs.

**Source:** [src/composables/useErrorHandler.ts](./src/composables/useErrorHandler.ts)  
**Tests:** [tests/composables/useErrorHandler.test.ts](./tests/composables/useErrorHandler.test.ts)  
**Demo:** See [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) for usage examples

#### useResourceList

Generic list page pattern with search support, data fetching, error handling, and navigation. Still useful for simple lists; for card dashboards prefer **`CardGrid` + `MhCard`**.

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

#### useInfiniteScroll (deprecated)

> **Deprecated.** Cursor-based infinite scroll (`after_id` / `has_more` / `next_cursor`) is superseded by offset/size header pagination and card grids. Kept temporarily for older journey pages. See [Deprecated: infinite-scroll list APIs](#deprecated-infinite-scroll-list-apis).

**Source:** [src/composables/useInfiniteScroll.ts](./src/composables/useInfiniteScroll.ts)  
**Tests:** [tests/composables/useInfiniteScroll.test.ts](./tests/composables/useInfiniteScroll.test.ts)

#### useRoles

Role-based access control with dependency injection pattern.

**Source:** [src/composables/useRoles.ts](./src/composables/useRoles.ts)  
**Tests:** [tests/composables/useRoles.test.ts](./tests/composables/useRoles.test.ts)  
**Example:** See [template_vue_vuetify useRoles wrapper](https://github.com/mentor-forge/stage0_template_vue_vuetify/blob/main/src/composables/useRoles.ts) for recommended implementation

**Recommended:** Create a wrapper in your app that provides app-specific auth and config. Accepts optional `AuthProvider` and `ConfigProvider` for dependency injection. Returns `roles`, `hasRole`, and `hasAnyRole`.

### Legacy AutoSave components

> **Legacy / deprecated for new development.** Prefer configurator-type editors (`WordEditor`, `EnumEditor`, …) with `DataCard`. These components remain exported with unchanged public APIs for existing pages — do not remove them from consumers until those pages migrate.

#### AutoSaveField

Text input or textarea with auto-save on blur. **Compatibility wrapper** around `StringEditor` — export and props remain non-breaking. Prefer typed editors (`WordEditor`, `SentenceEditor`, …) for new forms.

**Source:** [src/components/AutoSaveField.vue](./src/components/AutoSaveField.vue)  
**Tests:** [tests/components/AutoSaveField.test.ts](./tests/components/AutoSaveField.test.ts)  
**Demo:** See [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) for working examples  
**E2E Tests:** [cypress/e2e/components/AutoSaveField.cy.ts](./cypress/e2e/components/AutoSaveField.cy.ts)

**Props:**
- `modelValue: string | number | undefined` - Current value
- `label: string` - Field label
- `onSave: (value: string | number) => Promise<void>` - Save callback
- `hint?: string` - Helper text
- `rules?: Array<(v: string | number) => boolean | string>` - Validation rules
- `textarea?: boolean` - Use textarea instead of text input
- `rows?: number` - Number of rows for textarea
- `automationId?: string` - Automation ID for testing

#### AutoSaveSelect

Select dropdown with auto-save on blur and a caller-supplied `items` list. **Legacy** — for new enum / discrete option fields prefer **`EnumEditor`** / **`EnumArrayEditor`** with runtime `/api/config` enumerators (`enums` prop + `provideEditorConfig`). Keep using `AutoSaveSelect` only on existing pages that already pass hard-coded `items`.

**Source:** [src/components/AutoSaveSelect.vue](./src/components/AutoSaveSelect.vue)  
**Tests:** [tests/components/AutoSaveSelect.test.ts](./tests/components/AutoSaveSelect.test.ts)  
**Demo:** See [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) for working examples  
**E2E Tests:** [cypress/e2e/components/AutoSaveSelect.cy.ts](./cypress/e2e/components/AutoSaveSelect.cy.ts)

**Props:**
- `modelValue: string | undefined` - Current value
- `label: string` - Field label
- `items: string[] | Array<{ title: string; value: string }>` - Select options
- `onSave: (value: string) => Promise<void>` - Save callback
- `hint?: string` - Helper text
- `automationId?: string` - Automation ID for testing

#### ListPageSearch

Reusable search field for list pages.

**Source:** [src/components/ListPageSearch.vue](./src/components/ListPageSearch.vue)  
**Demo:** See [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) for working examples

### Utilities

#### formatDate

Format ISO date strings to localized strings. Returns `"N/A"` for null/undefined/empty strings.

**Source:** [src/utils/date.ts](./src/utils/date.ts)  
**Tests:** [tests/utils/date.test.ts](./tests/utils/date.test.ts)

#### validationRules

Common validation rules for form fields. Includes legacy helpers (`required`, `namePattern`, `descriptionPattern`) plus configurator-aligned patterns (`wordPattern`, `sentencePattern`, `emailPattern`, `durationPattern`, etc.). Each rule returns `true` for valid input or an error message string for invalid input.

**Source:** [src/utils/validation.ts](./src/utils/validation.ts)  
**Tests:** [tests/utils/validation.test.ts](./tests/utils/validation.test.ts)

#### duration helpers

ISO-8601 duration parse/format used by `DurationEditor`.

**Source:** [src/utils/duration.ts](./src/utils/duration.ts)  
**Tests:** [tests/utils/duration.test.ts](./tests/utils/duration.test.ts)

## Demo App

For complete working examples, see the [demo app](./demo/) — standard IdP auth redirect, **navigation drawer**, **component demo** (`/demo`), **type editor gallery** (`/demo/editors`), **cards dashboard** (`/demo/dashboard`), and **admin (config)** page. See [Authentication integration](#authentication-integration) above.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, project structure, and contribution guidelines. When adding shared field controls, follow [Harvesting a local control into spa_utils](#harvesting-a-local-control-into-spa_utils).

## See Also

- **Real-world usage:** [template_vue_vuetify](https://github.com/mentor-forge/stage0_template_vue_vuetify) — SPA template using spa_utils
- **Shared API libraries:** [mentorhub_api_utils](https://github.com/mentor-forge/mentorhub_api_utils) — canonical `api_utils.services` and list pagination helpers
- **Standards:** [SPA Standards](https://github.com/mentor-forge/mentorhub/blob/main/DeveloperEdition/standards/spa_standards.md)

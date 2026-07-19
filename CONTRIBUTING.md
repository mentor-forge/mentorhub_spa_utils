# Contributing to mentorhub_spa_utils

Thank you for contributing to mentorhub_spa_utils! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js 24+** (see `package.json` `engines`)
- Mentor Hub [Developers Edition](https://github.com/mentor-forge/mentorhub/blob/main/CONTRIBUTING.md)

### Getting Started

```bash
# CodeArtifact auth (needed once per shell for @mentor-forge packages)
mh

# Install dependencies (use the lockfile — pin Cypress to the exact version in package.json)
npm install --include=dev

# Download the Cypress binary that matches the pinned package version
# (required after Cypress version changes, or when node_modules was installed with --ignore-scripts)
npm run cypress:install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run Dev Server (demo app)
# Assumes api_utils dev server running at localhost:8385
npm run dev

# Cypress E2E tests (interactive) — requires `npm run dev` on baseUrl http://localhost:8386
npm run cypress

# Cypress E2E tests (headless)
npm run cypress:run
```

**Note:** Cypress and `@bahmutov/cypress-esbuild-preprocessor` are **exact pins** (no `^`). If E2E commands hang or time out right after install, run `npm run cypress:install` and confirm `npx cypress --version` matches `package.json`.

## Project Structure

```
mentorhub_spa_utils/
├── src/
│   ├── composables/     # Reusable composables (useAuth, useDataCardContext, …)
│   ├── components/      # Vue components (MhCard, CardGrid, DataCard, AutoSave*, …)
│   │   ├── editors/     # Configurator-type editors (WordEditor, DurationEditor, …)
│   │   └── admin/       # Admin/config display components
│   ├── utils/           # Utility functions (validation, duration, urlAuthBootstrap, …)
│   └── index.ts         # Main export
├── demo/                # Demo app for testing components
│   ├── App.vue          # Layout: app bar, nav drawer, router-view; provideEditorConfig(startup config)
│   ├── main.ts          # Entry point
│   ├── bootstrap-auth.ts    # bootstrapAuthFromUrl + syncAuthFromStorage before app
│   ├── router.ts        # Routes: /demo, /demo/editors, /demo/dashboard, /admin
│   ├── composables/     # useConfig (typed RuntimeEditorConfig; demo-only); useAuth from src/composables
│   ├── pages/
│   │   ├── DemoPage.vue       # Legacy AutoSave / utility demos
│   │   ├── EditorsPage.vue    # Type-aligned editor gallery (DataCards), incl. Enum/EnumArray
│   │   ├── DashboardPage.vue  # CardGrid + MhCard list dashboard
│   │   └── AdminPage.vue      # Config (api_utils /api/config)
│   ├── components/      # Admin UI (config tables, token card)
│   └── utils/           # Admin helpers
├── tests/               # Unit test files
├── cypress/             # E2E test files
│   ├── e2e/             # Test specs (components, pages, navigation)
│   └── support/         # Support files and commands
├── dist/                # Build output
└── package.json
```

## Adding New Utilities

When adding new utilities, components, or composables:

1. **Add to appropriate directory:**
   - `src/composables/` for composables
   - `src/components/` for Vue components
   - `src/utils/` for utility functions

2. **Export from index file:**
   - Update `src/index.ts` to export your new utility

3. **Write tests with 90%+ coverage:**
   - Unit tests in `tests/` directory
   - Follow existing test patterns

4. **Add examples to the demo app:**
   - Typed editors / cards → [demo/pages/EditorsPage.vue](./demo/pages/EditorsPage.vue) or [DashboardPage.vue](./demo/pages/DashboardPage.vue)
   - Legacy / misc components → [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) (or AdminPage as appropriate)
   - Register routes in [demo/router.ts](./demo/router.ts) and drawer links in [demo/App.vue](./demo/App.vue) when adding pages
   - This helps users understand how to use your utility
   - **Enum-like / discrete option controls:** use `EnumEditor` / `EnumArrayEditor` with a declarative `enums` name and app-root `provideEditorConfig` from the startup `/api/config` fetch — do not hard-code option arrays or derive them from OpenAPI. Do not add new pages on `AutoSaveSelect` (legacy).

5. **Add E2E tests:**
   - Add tests in [cypress/e2e](./cypress/e2e)
   - Use automation IDs for reliable selectors
   - For enum editors, stub `GET /api/config` with a fixture (see [cypress/fixtures/editor-config.json](./cypress/fixtures/editor-config.json)) so options resolve without a live API

6. **Update README:**
   - Add documentation with links to source code and examples
   - Include props/parameters, return values, and usage examples

7. **Follow existing patterns and conventions:**
   - Match code style and structure
   - Use TypeScript types consistently
   - Add automation IDs to interactive elements

## Versioning and release

Consuming SPAs pin this library with an exact semver from CodeArtifact (for example `"@mentor-forge/mentorhub_spa_utils": "0.2.0"`). Bump **`package.json`** version on the release branch before opening the PR.

```bash
npm run patch   # 0.1.0 → 0.1.1 (no git tag)
npm run minor   # 0.1.0 → 0.2.0
npm run major   # 0.1.0 → 1.0.0
```

**Release flow:**

1. Merge the version bump to `main`.
2. Run `npm run tag-release` on `main` — creates and pushes `v{version}`; GitHub Actions publishes to CodeArtifact.

**Local publish** (SRE / debugging, skips CI): `aws sso login --profile mentorhub-shared` then `npm run publish-package`.

**npm / CodeArtifact auth:** `.npmrc` is gitignored (tokens must not be committed). Use `.npmrc.example` as the template; CI and `publish-package.sh` copy its comments and inject a short-lived `_authToken`. For local installs of `@mentor-forge/*` packages, run `mh` or copy `.npmrc.example` to `.npmrc` and add your token.

**`npm run build-package`** installs dev dependencies and builds **`dist/`** (Launch / automation). **`delete-package`** remains a no-op so Stage0 Launch npm steps always find that script.

## Testing Requirements

- **Unit tests:** 90%+ coverage required
- **E2E tests:** Add Cypress tests for all interactive components
- **All tests must pass** before merging

## Code Standards

- Follow the [SPA Standards](https://github.com/mentor-forge/mentorhub/blob/main/DeveloperEdition/standards/spa_standards.md)
- Use TypeScript for type safety
- Add automation IDs (`data-automation-id`) to all interactive elements
- Follow existing code patterns and conventions
- Write clear, self-documenting code

## Demo App

The demo app provides a full flow: **IdP login redirect** → **component demos** (navigation drawer) → **admin page** (config) when the user has the `admin` role. The dev server may proxy `/api` to an [api_utils](https://github.com/mentor-forge/mentorhub_api_utils) demo for config; SPAs do not use APIs as a credential-issuing login surface.

- **Shared auth:** [src/composables/useAuth.ts](./src/composables/useAuth.ts) — exported for journey SPAs; demo imports from `../src/composables/useAuth`
- **Auth bootstrap:** [demo/bootstrap-auth.ts](./demo/bootstrap-auth.ts) — `bootstrapAuthFromUrl` + `syncAuthFromStorage`; router/logout use `redirectToIdpLogin`
- **Layout & nav:** [demo/App.vue](./demo/App.vue) — app bar, hamburger, drawer (demo / admin / logout)
- **Router:** [demo/router.ts](./demo/router.ts) — `/` → `/demo`; unauthenticated routes redirect to `:8080/login.html`
- **Component demos:** [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) — AutoSaveField, AutoSaveSelect, ListPageSearch, formatDate, validationRules
- **Admin (config):** [demo/pages/AdminPage.vue](./demo/pages/AdminPage.vue) — config items, versions, enumerators, token (requires `admin` role)

Use the demo app to test your changes and provide examples for users.
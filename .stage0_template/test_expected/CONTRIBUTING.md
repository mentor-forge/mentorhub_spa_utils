# Contributing to mentorhub_spa_utils

Thank you for contributing to mentorhub_spa_utils! This guide will help you get started.

## Development Setup

### Prerequisites

- **Node.js 24+** (see `package.json` `engines`)
- Mentor Hub [Developers Edition](https://github.com/agile-learning-institute/mentorhub/blob/main/CONTRIBUTING.md)

### Getting Started

```bash
# Install dependencies
npm install --dev

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

# Cypress E2E tests (interactive)
npm run cypress

# Cypress E2E tests (headless)
npm run cypress:run
```

## Project Structure

```
mentorhub_spa_utils/
├── src/
│   ├── composables/     # Reusable composables
│   ├── components/      # Vue components
│   ├── utils/           # Utility functions (incl. urlAuthBootstrap for URL hash / clear query)
│   └── index.ts         # Main export
├── demo/                # Demo app for testing components
│   ├── App.vue          # Layout: app bar, nav drawer, router-view
│   ├── main.ts          # Entry point
│   ├── bootstrap-auth.ts    # bootstrapAuthFromUrl before app
│   ├── router.ts        # Routes: / (public auth hint), /demo, /admin
│   ├── composables/     # useAuth, useConfig (demo-only)
│   ├── pages/
│   │   ├── PublicAuthHint.vue  # Unauthenticated entry (IdP / hash; no backend login API)
│   │   ├── DemoPage.vue     # Component & utility demos
│   │   └── AdminPage.vue    # Config (api_utils /api/config)
│   ├── components/      # Admin UI (config tables, token card)
│   └── utils/           # Admin helpers
├── tests/               # Unit test files
├── cypress/             # E2E test files
│   ├── e2e/             # Test specs (components, utils, navigation)
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
   - Add to [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) (or AdminPage / PublicAuthHint as appropriate)
   - This helps users understand how to use your utility

5. **Add E2E tests:**
   - Add tests in [cypress/e2e](./cypress/e2e)
   - Use automation IDs for reliable selectors

6. **Update README:**
   - Add documentation with links to source code and examples
   - Include props/parameters, return values, and usage examples

7. **Follow existing patterns and conventions:**
   - Match code style and structure
   - Use TypeScript types consistently
   - Add automation IDs to interactive elements

## Versioning

Consuming SPAs pin this library via **git** (branch, tag, or commit). Bump **`package.json`** version when you cut a release tag so downstream changelog and support are clear.

```bash
npm run patch   # 0.1.0 → 0.1.1 (no git tag)
npm run minor   # 0.1.0 → 0.2.0
npm run major   # 0.1.0 → 1.0.0
```

**`npm run build-package`** installs dev dependencies and builds **`dist/`** (Launch / automation). **`publish-package`** and **`delete-package`** are **no-ops** (exit 0) so Stage0 Launch npm steps always find those scripts; there is no registry publish or package delete for this repo.

## Testing Requirements

- **Unit tests:** 90%+ coverage required
- **E2E tests:** Add Cypress tests for all interactive components
- **All tests must pass** before merging

## Code Standards

- Follow the [SPA Standards](https://github.com/agile-learning-institute/mentorhub/blob/main/DeveloperEdition/standards/spa_standards.md)
- Use TypeScript for type safety
- Add automation IDs (`data-automation-id`) to all interactive elements
- Follow existing code patterns and conventions
- Write clear, self-documenting code

## Demo App

The demo app provides a full flow: **sign-in** (localStorage or URL hash via `bootstrapAuthFromUrl`) → **component demos** (navigation drawer) → **admin page** (config) when the user has the `admin` role. The dev server may proxy `/api` to an [api_utils](https://github.com/agile-learning-institute/mentorhub_api_utils) demo for config; SPAs do not use APIs as a credential-issuing login surface.

- **Unauthenticated entry:** [demo/pages/PublicAuthHint.vue](./demo/pages/PublicAuthHint.vue) — hash / IdP instructions (uses [demo/bootstrap-auth.ts](./demo/bootstrap-auth.ts))
- **Layout & nav:** [demo/App.vue](./demo/App.vue) — app bar, hamburger, drawer (demo / admin / logout)
- **Component demos:** [demo/pages/DemoPage.vue](./demo/pages/DemoPage.vue) — AutoSaveField, AutoSaveSelect, ListPageSearch, formatDate, validationRules
- **Admin (config):** [demo/pages/AdminPage.vue](./demo/pages/AdminPage.vue) — config items, versions, enumerators, token (requires `admin` role)

Use the demo app to test your changes and provide examples for users.
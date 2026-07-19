# F027 – Demonstrate and document runtime-configured enum editors

**Status**: Pending  
**Type**: Feature  
**Depends On**: F026  
**Description**: Wire the Enum and EnumArray editors into the type-editor demo using the config fetched at application startup, add browser coverage for select and tag interactions, and document migration from legacy AutoSave components.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `demo/...`, `cypress/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — `/api/config` startup loading, runtime enumerators, AutoSave, and automation IDs
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/PENDING.F026.enum_type_editors.md` — editor API, runtime config provider, and completed Execution Notes
- `tasks/SHIPPED.F021.demo_type_editors_page.md`
- `tasks/SHIPPED.F023.document_cards_and_editors.md`
- `README.md`
- `demo/App.vue`
- `demo/composables/useConfig.ts`
- `demo/pages/EditorsPage.vue`
- `demo/pages/DemoPage.vue` — legacy component examples must remain
- `cypress/e2e/pages/editors.cy.ts`
- `cypress/e2e/components/AutoSaveSelect.cy.ts` — legacy coverage must remain

The API contract is already available: `/api/config.enumerators[]` contains version payloads, each payload contains named `enumerators[]`, and each named enumerator contains `values[]` entries with `value` and `description`. Do not add sibling repository paths to this task.

## Goals

### Startup config wiring

- Strengthen the demo config typing to use the exported runtime config interfaces from F026 rather than `Record<string, unknown>` for enumerators.
- Keep the existing single `/api/config` fetch on authenticated application startup.
- Provide that same reactive config object once near the demo application root through the F026 editor config provider; do not refetch config in either editor or the editor page.
- Loading or failed config fetches must leave the editors safe and empty without breaking navigation. Existing startup warning/error behavior may remain.

### Type Editor Gallery

- Add an `EnumEditor` example bound to a scalar string field and an `EnumArrayEditor` example bound to a string-array field inside a `DataCard`.
- Use real named `enums` references expected in runtime config, with no hard-coded editor option lists.
- Demonstrate the scalar select's description labels and wire values.
- Demonstrate the array editor's autocomplete, multiple values, closable pills, and DataCard field-level save log.
- Add stable automation IDs for the new card, scalar select, autocomplete input, chips, and read-only displays.
- Preserve the existing legacy `/demo` examples and routes, including `AutoSaveSelect`; this workflow adds preferred Type Editors without deleting old Components.

### Browser tests

- Extend the Type Editor Gallery Cypress suite to stub `/api/config` with a deterministic fixture containing at least two named enumerators and value/description pairs.
- Verify the scalar editor reads values from the startup config, selects a value, saves the string wire value, and records it in the save log.
- Verify the array editor autocompletes config values, renders multiple pills in the input area, removes a pill, leaves the configured order/value behavior intact, and saves a string array in the save log after leaving the control.
- Verify an empty or missing enumerator payload does not crash the page and does not offer invented options.
- Keep legacy AutoSaveSelect Cypress coverage unchanged and passing.

### Documentation and migration guidance

- Add `enum` → `EnumEditor` and `enum_array` → `EnumArrayEditor` to the configurator type-editor catalog.
- Document the declarative `enums` prop and application-root runtime config provider, including a concise startup-fetch usage example.
- State that allowed values come from `/api/config`, not OpenAPI or hard-coded component arrays.
- Document the scalar string and array-of-strings wire values, description-as-label behavior, blur/focusout save behavior, and array pills/autocomplete UX.
- Mark the older generic AutoSave components as legacy/deprecated-for-new-development while explicitly retaining their exports and compatibility. Do not claim a removal version or remove their existing documentation.
- Update contributing guidance if needed so new enum-like controls use runtime configuration and the typed-editor contract.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Add/update focused unit coverage for demo config startup wiring if the provider integration introduces testable logic.
- Start the demo/API environment required by the existing Cypress setup.
- `npm run test`
- `npm run build`
- `npm run cypress:run -- --spec cypress/e2e/pages/editors.cy.ts,cypress/e2e/components/AutoSaveSelect.cy.ts`
- Manually verify README examples match exported F026 APIs and the demo uses one startup config fetch.

## Outputs

- `demo/App.vue` — provide the startup-loaded reactive runtime config
- `demo/composables/useConfig.ts` — exported runtime config typing
- `demo/pages/EditorsPage.vue` — Enum and EnumArray declarative examples
- `cypress/fixtures/editor-config.json` — deterministic runtime enumerator payload
- `cypress/e2e/pages/editors.cy.ts` — scalar and tag-style editor workflows
- `README.md` — editor catalog, runtime config usage, and migration guidance
- `CONTRIBUTING.md` — only if runtime-enumerator contribution guidance is needed
- Matching demo unit test files only if startup provider logic is extracted or existing demo tests require updates

The agent must not remove or rename legacy components, modify their public APIs, or bump the package version in this task.

## Execution Notes

Reserved for implementation plan, commands, test results, decisions, and follow-ups.

# F026 – Runtime-configured Enum and EnumArray type editors

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F025  
**Description**: Add declarative `EnumEditor` and `EnumArrayEditor` components aligned with configurator `enum` and `enum_array` fields. Resolve allowed values from the runtime `/api/config` enumerator payload while retaining all legacy AutoSave components unchanged.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `src/composables/...`, `tests/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — runtime configurability, AutoSave, automation IDs, and testing standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F017.editor_foundation_and_autosave.md` — shared typed-editor and DataCard contracts
- `tasks/SHIPPED.F019.non_string_type_editors.md` — specialized editor conventions
- `README.md`
- `src/components/AutoSaveSelect.vue` — behavior reference only; do not replace, remove, rename, or change its public API
- `src/components/editors/types.ts`
- `src/components/editors/StringEditor.vue`
- `src/components/editors/BooleanEditor.vue`
- `src/composables/useDataCardContext.ts`
- `src/components/editors/index.ts`
- `src/components/index.ts`
- `tests/setup.ts`
- `tests/components/AutoSaveSelect.test.ts`

External runtime contract already supplied by the APIs:

- A scalar enum dictionary property has `type: "enum"` and an `enums` string naming an enumerator; its document value is a string.
- An enum-array dictionary property has `type: "enum_array"` and an `enums` string naming an enumerator; its document value is a string array.
- `/api/config` is fetched by each SPA at startup. Its `enumerators` payload contains version objects with `enumerators[]`; each named enumerator has `name` and `values[]`, and each value has `value` plus `description`.
- Runtime enumerator data is authoritative. Do not hard-code allowed values and do not derive them from OpenAPI.
- This contract is recorded here so execution remains within the spa_utils repository boundary; do not add sibling MongoDB/API repository paths to this task.

## Goals

### Runtime enumerator context

- Add exported TypeScript interfaces for the minimum runtime config/enumerator shape consumed by editors.
- Add a small reactive provide/inject contract, parallel to `DataCard` context, through which an application can provide the config object it fetched at startup.
- The provider must accept an asynchronously populated ref/getter so editors update when startup loading completes.
- Add an exported resolver that takes runtime config plus an `enums` name and returns Vuetify-ready options:
  - option `value` comes from the enumerator value's `value`;
  - option `title` uses `description` when present and falls back to `value`;
  - lookup is case-sensitive;
  - duplicate wire values are removed without inventing values;
  - loading, absent config, absent `enumerators`, and unknown names return an empty list without throwing.
- If multiple version payloads contain the same named enumerator, use a documented deterministic active/latest-version rule based on the numeric `version` field and cover it with tests.

### `EnumEditor`

- Create `src/components/editors/EnumEditor.vue` for configurator type `enum`.
- Extend the existing `BaseEditorProps<string | undefined>` contract and add required `enums: string`, matching the dictionary property key.
- Resolve options from the provided runtime config context. Allow an optional per-component config input only as a test/standalone override; do not expose a competing arbitrary `items` source as the primary API.
- Use a Vuetify `v-select` with the established `outlined`, `comfortable`, full-width editor styling.
- Match `AutoSaveSelect` behavior: update locally, AutoSave on blur only when the wire value changed, and show saving/saved/error affordances.
- Support standalone `modelValue`/`onSave`, preferred DataCard `field` binding, `editable`, `visible`, labels/hints/rules, and stable automation IDs. Read-only mode displays the selected description with the standard `-display` suffix and a clear empty fallback.

### `EnumArrayEditor`

- Create `src/components/editors/EnumArrayEditor.vue` for configurator type `enum_array`.
- Extend `BaseEditorProps<string[] | undefined>` and add the same required `enums: string`.
- Render an autocomplete/tag input using Vuetify `v-autocomplete` with multiple selection and closable chips/pills inside the input area.
- Autocomplete against both value and description while persisting only the string `value` entries.
- Restrict selection to values supplied by the named runtime enumerator; this is not a free-form combobox.
- Keep selected wire values ordered as selected and do not mutate arrays supplied by props or DataCard.
- AutoSave once focus leaves the complete autocomplete/chip control. Treat arrays with the same ordered values as unchanged even when their references differ.
- Read-only mode renders selected values as labeled pills, preserves stable per-pill automation IDs, and handles empty/unknown values safely.
- Implement the full shared editor contract and the same save/error/status behavior as the typed-editor family.

### Compatibility and exports

- Export both editors, runtime config types, provider/inject helper, and resolver through the existing package root and relevant `./components` or `./composables` entry points.
- Leave `AutoSaveField`, `AutoSaveSelect`, and all other older components in place with unchanged exports and public APIs. Typed editors are the preferred path for new development; removal is out of scope.
- Do not add an API client or fetch `/api/config` inside a field editor. Applications own startup fetching and provide the resulting reactive config.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Add unit tests for runtime config provide/inject and option resolution, including delayed startup population, description fallback, duplicates, case sensitivity, missing names/config, and version selection.
- Add `EnumEditor` unit tests for standalone and DataCard modes, config-derived options, unchanged blur, changed-value save, prop/context synchronization, loading/unknown enumerators, view/hidden modes, automation IDs, validation props, errors, and saved timeout.
- Add `EnumArrayEditor` unit tests for autocomplete filtering, add/remove pills, constrained values, array cloning/equality, whole-control focusout save, standalone and DataCard modes, delayed config, view/hidden modes, automation IDs, errors, and saved timeout.
- Extend the Vuetify test stubs with a realistic `v-autocomplete` multiple/chip stub; retain existing `v-select` and legacy AutoSaveSelect coverage.
- `npm run test`
- `npm run test:coverage`
- `npm run lint`
- `npm run build`

## Outputs

- `src/components/editors/types.ts` — enum value/config and editor prop types
- `src/composables/useEditorConfig.ts` — reactive runtime config provide/inject contract and enumerator option resolver
- `src/composables/index.ts` — public composable/type exports
- `src/components/editors/EnumEditor.vue`
- `src/components/editors/EnumArrayEditor.vue`
- `src/components/editors/index.ts` — editor/type exports
- `src/components/index.ts` — editor/type exports
- `tests/composables/useEditorConfig.test.ts`
- `tests/components/editors/EnumEditor.test.ts`
- `tests/components/editors/EnumArrayEditor.test.ts`
- `tests/setup.ts` — autocomplete/multiple-chip test support

The agent must not update legacy AutoSave component source, demo pages, documentation, or package versions in this task.

## Execution Notes

### Plan

1. Extended `src/components/editors/types.ts` with runtime enumerator shapes (`EnumeratorValue`, `NamedEnumerator`, `EnumeratorVersionPayload`, `RuntimeEditorConfig`, `EnumOption`) and `EnumEditorProps` / `EnumArrayEditorProps` (required `enums`, optional per-component `config` override).
2. Added `src/composables/useEditorConfig.ts` — `editorConfigKey` Symbol, `provideEditorConfig` / `useEditorConfig` / `resolveEditorConfig`, `resolveEnumeratorOptions` (description→title, case-sensitive name, de-dupe, empty on missing), and `useEnumeratorOptions` computed helper. **Version rule:** when the same enumerator `name` appears in multiple payloads, the payload with the highest numeric `version` wins (latest/active); non-numeric versions are ignored relative to numeric ones.
3. `EnumEditor.vue` — `v-select`, AutoSave on blur (AutoSaveSelect parity), DataCard `field` preference, display mode shows description (fallback value / `—`), optional `config` prop override.
4. `EnumArrayEditor.vue` — `v-autocomplete` multiple + closable chips; constrain to enumerator values; clone arrays; ordered equality; AutoSave on container `focusout` (whole control); display pills with `{automationId}-pill-{value}` IDs.
5. Exported editors/types from `editors/index.ts` and `components/index.ts`; composable helpers from `composables/index.ts`. Left `AutoSaveSelect` / `AutoSaveField` untouched.
6. Tests: `useEditorConfig`, `EnumEditor`, `EnumArrayEditor`; extended `tests/setup.ts` with a realistic `v-autocomplete` multiple/chip stub. Did not update demos, docs, or package version.

### Commands

- `npm run test` — **380/380 passed** (36 files)
- `npm run test:coverage` — new files at ≥98% lines (`EnumEditor` 100%, `EnumArrayEditor` 98.7%, `useEditorConfig` 98.66%). Overall `src/utils/**` threshold failures are **pre-existing** (untested `admin.ts`, `urlAuthBootstrap.ts`) — same caveat as F017/F019.
- `npm run lint` — **blocked in this environment**: `eslint` binary not present in `node_modules` (`eslint: command not found`). Script is `"lint": "eslint src"`; no local eslint install. Not a code defect from this task.
- `npm run build` — succeeded (`vite build` + `tsc --emitDeclarationOnly`); `dist/index.js` 89.14 kB / gzip 15.79 kB.

### Decisions

- Optional `config` prop on both editors is a test/standalone override only; production apps should `provideEditorConfig` with the startup `/api/config` ref.
- EnumArray delayed config: while options are empty, do not wipe `currentValue`; once options load, constrain selections. `handleInput` with an empty allowed set rejects free-form values (`[]`).
- Stub change: removed `data-automation-id` from Vuetify stub prop lists so the attribute falls through to the root element (enables automation-id assertions without competing prop binding).

### Blockers

None for the feature. Lint could not be executed here due to missing local `eslint` install (environment/tooling gap). Orchestrator may re-run `npm run lint` after `npm ci` / CodeArtifact auth if needed.

### Follow-ups

- F027: demo + document enum editors
- F028: patch version bump

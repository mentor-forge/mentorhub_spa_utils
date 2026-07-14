# F017 – Editor foundation: shared props, StringEditor base, AutoSave alignment

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F016  
**Description**: Establish the shared view/edit editor contract and an abstract string-input base. Make `AutoSaveField` a thin compatibility wrapper around the string base (non-breaking). Prefer typed editors as the new public API.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `src/utils/...`, `tests/...`, `cypress/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — AutoSave Components, Automation IDs, Testing Standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F015.peer_review_card_editor_approach.md` — naming / provide-inject / AutoSave decisions
- `README.md`
- `src/components/AutoSaveField.vue`
- `src/components/AutoSaveSelect.vue` — leave as-is this wave (no generic enum editor)
- `src/components/index.ts`
- `src/utils/validation.ts`
- `tests/components/AutoSaveField.test.ts`
- `cypress/e2e/components/AutoSaveField.cy.ts`

## Goals

### Shared editor contract (all typed editors)

Implement a common props/API surface using **F015 locked names**:

| Prop | Role |
|------|------|
| `field` | Model property key when inside `DataCard` (preferred over `data` / `dataKey`) |
| `modelValue` + `onSave` | Standalone binding for demos / pages not using `DataCard` |
| `editable` | View vs edit (single component family — **not** separate View/Edit components). Default `true` except Identifier / Breadcrumb (see catalog). When `editable=false`, render readonly Vuetify controls or plain display; keep the same `automationId` and use `-display` / control suffix norms from spa_standards |
| `visible` | Optional boolean; when `false`, hide the control without removing it from the form model (default `true`) |
| `automationId` | Maps to `data-automation-id` attribute |
| `label` / `hint` / `rules` | Optional presentation and validation hooks |

- **Width** — controls expand to fill the parent card/body horizontal space (`width: 100%` / Vuetify block behavior).
- **Density / variant defaults (F015 gap closure):** match existing AutoSave UX — `density="comfortable"` and `variant="outlined"` on Vuetify text/select/switch controls unless a typed editor needs a specific exception.
- **Save triggers:** string-family = AutoSave-on-blur (spa_standards). Boolean/Rating = change-based (document in F019). Keep saving/saved/error affordances matching current AutoSave UX.

### Abstract string input

- Introduce `StringEditor` (or similarly named base) under `src/components/editors/` used by word/sentence/email/url/… derivatives.
- Encapsulate Vuetify `v-text-field` / `v-textarea` usage, AutoSave state icons, and error display.
- **`AutoSaveField` (F015 locked):** make it a **thin compatibility wrapper** around the string base — **non-breaking**. Keep the `AutoSaveField` export name and existing prop surface (`modelValue`, `label`, `onSave`, `hint`, `rules`, `textarea`, `rows`, `automationId`). Typed editors are the preferred API going forward.
- **`AutoSaveSelect`:** leave as-is this wave; defer a generic enum/enumerator editor to a later workflow.

### Provide/inject readiness (contract pieces; DataCard wires in F020)

- Export a **Symbol** provide key (e.g. `dataCardContextKey`) and a typed inject interface / helper so F020 `DataCard` and editors share one contract.
- Editors prefer injected `DataCard` context when present; otherwise use standalone `modelValue` + `onSave`.
- Include inject typing (TypeScript interface for context: model, onSave, optional helpers).

### Validation helpers

- Extend `src/utils/validation.ts` with reusable rules aligned to configurator type constraints used by F018/F019 (at least stubs/exports for patterns that typed editors will consume). Full per-type wiring can complete in F018/F019.

### Planned component family (design catalog)

Folder: typed editors live under `src/components/editors/`; re-export from `src/components/index.ts`.

| Configurator type | Planned component | Base / notes |
|-------------------|-------------------|--------------|
| `word` | `WordEditor` | String base + max 40 / no whitespace |
| `sentence` | `SentenceEditor` | String base + 0–255 / no tabs-newlines |
| `markdown` | `MarkdownEditor` | Textarea + max 4096 |
| `email` | `EmailEditor` | String base + email pattern |
| `url` | `UrlEditor` | String base + URI pattern |
| `us_phone` | `UsPhoneEditor` | String base + US phone pattern |
| `ip_address` | `IpAddressEditor` | String base + IP format |
| `identifier` | `IdentifierEditor` | String base; **default `editable=false`** (ObjectId display-first) |
| `boolean` | `BooleanEditor` | `v-switch`; save on change |
| `count` | `CountEditor` | numeric ≥ 0 |
| `index` | `IndexEditor` | numeric ≥ 0 (zero-based) |
| `rating` | `RatingEditor` | `v-rating` 1–4; save on change |
| `date-time` | `DateTimeEditor` | ISO date-time via standard Vuetify date/time controls (wire ISO string; do not expect users to type the format) |
| `duration` | `DurationEditor` | Structured duration UX (days/hours/minutes/…); wire ISO-8601 duration string — same idea as `date-time`, not a patterned text field (F019) |
| `breadcrumb` | `BreadcrumbDisplay` | Composite **display** (name stays `BreadcrumbDisplay`); **default `editable=false`** |

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Update `tests/components/AutoSaveField.test.ts` and any Cypress AutoSave tests for the wrapper refactor (API must remain non-breaking).
- Add unit tests for the new string base / shared contract helpers / provide-key export.
- `npm run test`
- `npm run build`
- Existing Cypress: `npm run cypress:run` for AutoSaveField if the demo route still hosts them; otherwise run after F021 when demos move.

## Outputs

- `src/components/editors/` — string editor base and shared editor helpers as needed
- `src/components/editors/` or `src/composables/` — exported provide Symbol + typed inject helper (shared with F020)
- `src/components/AutoSaveField.vue` — thin wrapper around string base (non-breaking)
- `src/components/index.ts` — exports (`AutoSaveField` retained; new base/helpers exported)
- `src/utils/validation.ts` — extended type-aligned rules
- `tests/components/AutoSaveField.test.ts` and new base-editor tests
- `cypress/e2e/components/AutoSaveField.cy.ts` — updated only if behavior changes (should not for compatibility)

The agent must not update demo pages (F021) or documentation (F023) beyond what is required to keep the package buildable. Do not modify `AutoSaveSelect.vue` except for incidental shared-typing imports if truly required.

## Execution Notes

### Plan

Implemented only the F017 foundation pieces (no typed derivatives — those are F018/F019):

1. `src/composables/useDataCardContext.ts` — `dataCardContextKey` `Symbol` `InjectionKey<DataCardContext>`, `DataCardModel`/`DataCardContext` interfaces (`model: MaybeRefOrGetter<TModel>`, `onSave(field, value)`), `provideDataCardContext()`, typed `useDataCardContext()` inject helper, and `resolveDataCardModel()` to unwrap ref/getter/plain-object models. Re-exported from `src/composables/index.ts`.
2. `src/components/editors/types.ts` — `BaseEditorProps<TValue>` (F015-locked `field`/`modelValue`/`onSave`/`editable`/`visible`/`automationId`/`label`/`hint`/`rules`) and `StringEditorProps` (adds `textarea`/`rows`).
3. `src/components/editors/StringEditor.vue` — abstract string-input base. Encapsulates `v-text-field`/`v-textarea`, AutoSave saving/saved/error affordances, blur-triggered save, `density="comfortable"` + `variant="outlined"`, `width: 100%`. Prefers injected `DataCardContext` (`field` + context → `context.onSave(field, value)`) over standalone `modelValue`/`onSave`. `editable=false` renders a plain readonly display (not an input) and suffixes `automationId` with `-display` (idempotent if already suffixed) per spa_standards `-display` norm; the editable control keeps the automationId unsuffixed (matches existing `AutoSaveField` behavior — non-breaking). `visible=false` renders nothing (`v-if` on the whole template) without unmounting the component. Exposes `currentValue`/`saving`/`saved`/`error`/`handleInput`/`handleBlur` for tests and future composition.
4. `src/components/editors/index.ts` — exports `StringEditor` + prop types.
5. `src/components/AutoSaveField.vue` — reduced to a thin wrapper: forwards its unchanged prop surface (`modelValue`, `label`, `onSave`, `hint`, `rules`, `textarea`, `rows`, `automationId`) straight through to `StringEditor` (no `field`, so it always uses the standalone path). Export name and public props unchanged — non-breaking.
6. `src/components/index.ts` — added `StringEditor` + type exports; `AutoSaveField`/`AutoSaveSelect` untouched exports retained. `AutoSaveSelect.vue` left as-is (no edits at all, not even incidental typing).
7. `src/utils/validation.ts` — added stub/rule exports aligned to the F017 configurator-type catalog for F018/F019 to consume: `wordPattern`, `sentencePattern`, `markdownPattern`, `emailPattern`, `urlPattern`, `usPhonePattern`, `ipAddressPattern`, `identifierPattern`, `nonNegativeInteger`, `ratingRange`. Existing `required`/`namePattern`/`descriptionPattern` untouched.
8. Tests: rewrote `tests/components/AutoSaveField.test.ts` for the wrapper refactor (now asserts prop forwarding to `StringEditor` plus full end-to-end save/error/saving/saved behavior via the mounted `StringEditor` instance, since shallow-stubbing would hide the delegate). Added `tests/components/editors/StringEditor.test.ts` (standalone behavior, `editable`/`visible` contract, `DataCard` context provide/inject), `tests/composables/useDataCardContext.test.ts`, and extended `tests/utils/validation.test.ts` for the new rule stubs.

### Test results

- `npm run test` — **170/170 tests passed** (16 test files), including 17 new `StringEditor` tests, 13 updated `AutoSaveField` tests, new `useDataCardContext` composable tests, and new validation-rule stub tests. Pre-existing `[Vue warn] Failed to resolve component: v-card/...` noise in `MhCard.test.ts` is unrelated pre-existing behavior (Vuetify components aren't globally registered in unit tests) and not a failure.
- `npm run build` — succeeded (`vite build` + `tsc --emitDeclarationOnly`), package still builds cleanly with the new `editors/` and composable exports.
- `npm run test:coverage` — new files (`StringEditor.vue`, `useDataCardContext.ts`, `validation.ts`) are at 100% lines/branches/functions. The overall `src/components/**` and `src/utils/**` coverage-threshold failures are **pre-existing** (untested `AdminPage.vue`, `components/admin/*`, `utils/admin.ts`, `utils/urlAuthBootstrap.ts` — none touched by this task) and unrelated to F017.
- Cypress: not run — `AutoSaveField.cy.ts` targets `data-automation-id="demo-autosave-field"` on the editable control, whose `data-automation-id` is unchanged (unsuffixed) via `StringEditor`'s `editable=true` path, so behavior stays non-breaking; deferred per task note ("run after F021 when demos move" / optional this task).

### Notes / follow-ups for F018–F020

- `DataCard` (F020) should call `provideDataCardContext({ model, onSave })` from `src/composables`; typed editors read via `field` + injected context automatically once that lands — no changes needed to `StringEditor`.
- F018/F019 typed editors (`WordEditor`, `EmailEditor`, etc.) should extend `StringEditorProps`/`BaseEditorProps` from `src/components/editors/types.ts` and wrap `StringEditor` (word/sentence/email/url/us_phone/ip_address/identifier) the same way `AutoSaveField` does, adding their own `rules` default from the new `validationRules` stubs.
- No demo/doc changes made (out of scope per task); `AutoSaveSelect.vue` left byte-for-byte unchanged.

### Blockers

None.

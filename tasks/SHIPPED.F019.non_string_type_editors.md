# F019 – Type-aligned non-string view/edit editors

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F018  
**Description**: Implement configurator-type-aligned specialized editors (including duration and date-time UX that wire ISO strings) and the breadcrumb display using standard Vuetify controls, sharing the F017 editor contract.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `src/utils/validation.ts`, `tests/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F015.peer_review_card_editor_approach.md`
- `tasks/PENDING.F017.editor_foundation_and_autosave.md` — design catalog + shared contract
- `README.md`
- `src/components/AutoSaveSelect.vue` — pattern reference only; leave as-is (no generic enum editor this wave)
- `src/components/index.ts`
- F017/F018 editor base and validation utilities

## Goals

### Planned component design (specialized / non-string family)

Wire values remain configurator-correct (ISO strings, ints, bools). UX must not require users to know wire formats — same bar for `date-time` and `duration`.

| Type | Component | Control | Validation / behavior |
|------|-----------|---------|------------------------|
| `boolean` | `BooleanEditor` | `v-switch` (preferred) | true/false; **AutoSave on change** (not blur) — F015 locked |
| `count` | `CountEditor` | `v-text-field` `type="number"` or `v-number-input` if available in project Vuetify | integer ≥ 0; blur save when editable |
| `index` | `IndexEditor` | same as count | integer ≥ 0; zero-based semantics in label/hint |
| `rating` | `RatingEditor` | `v-rating` | integer 1–4 only; clear empty/half-star disabled; **AutoSave on change** (not blur) — F015 locked |
| `date-time` | `DateTimeEditor` | Prefer standard Vuetify date/time pickers; do not rely on users typing ISO-8601 | Model value is an ISO-8601 date-time string for API JSON |
| `duration` | `DurationEditor` | Structured duration editor built from Vuetify controls (e.g. numeric fields and/or selects for days, hours, minutes, seconds — exact composition is implementer choice within MD/Vuetify) | Users edit human units; component serializes/parses ISO-8601 duration (`P…T…`). **Do not** present a raw `P3DT4H30M` text field as the primary edit UX. View mode shows a readable summary (e.g. “3 days, 4 hours, 30 minutes”). Validate against the configurator duration pattern on the wire value. AutoSave on blur of the composite control (or on change when the composition is complete — document choice in Execution Notes). |
| `breadcrumb` | `BreadcrumbDisplay` | Read-only layout (fields or definition list) inside card body | Shows `from_ip`, `by_user`, `at_time`, `correlation_id`; **default `editable=false`** — display-only, not an edit form. Name stays `BreadcrumbDisplay`. May compose string/date editors in `editable=false` mode |

Shared contract parity with F018: `field`, optional `visible`, `editable` (where applicable), `automationId` → `data-automation-id`, full-width in card bodies, density/variant defaults, exports from `src/components/index.ts`.

**Out of scope (F015 defer):** generic enum / enumerator editor; `AutoSaveSelect` remains the discrete-select pattern for this wave.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Unit tests for each new editor/display component (validation bounds for count/index/rating; duration round-trip human units ↔ ISO-8601 string; date-time picker wires ISO string; breadcrumb renders all four fields; Boolean/Rating save on change; default `editable=false` for BreadcrumbDisplay).
- `npm run test`
- `npm run build`

## Outputs

- `src/components/editors/BooleanEditor.vue`
- `src/components/editors/CountEditor.vue`
- `src/components/editors/IndexEditor.vue`
- `src/components/editors/RatingEditor.vue`
- `src/components/editors/DateTimeEditor.vue`
- `src/components/editors/DurationEditor.vue`
- `src/components/editors/BreadcrumbDisplay.vue`
- Optional helpers under `src/utils/` for ISO duration parse/format if kept out of the Vue file
- `src/components/index.ts` — exports
- `src/utils/validation.ts` — rules as needed
- Matching `tests/components/editors/*.test.ts`

The agent must not update demo pages (F021) or docs (F023) in this task.

## Execution Notes

### Plan

Implemented the seven "specialized / non-string family" editors as self-contained components (not thin `StringEditor` wrappers, since each has its own value type / control / save-trigger semantics), following the same internal shape `StringEditor`/`UrlEditor` established in F017/F018: prefer injected `DataCard` context (via `field`) over standalone `modelValue`/`onSave`, `visible` gates the whole render (`v-if` on the outer `<template>`), `editable` toggles a writable control vs. a plain display, `automationId` stays unsuffixed on the editable control and gets a `-display` suffix (idempotent) in display mode, and `saving`/`saved`/`error` affordances match the existing AutoSave UX (`saved` auto-clears after 2s via `setTimeout`).

1. **`src/utils/validation.ts`** — added `dateTimePattern` (ISO-8601 date-time shape + `Date.parse` sanity check) and `durationPattern` (`P(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?` — day/hour/minute/second components only, matching the F015 catalog's duration vocabulary) to the existing rule stubs.
2. **`src/utils/duration.ts`** (new, optional helper file per the task's "Outputs" allowance) — `parseDurationIso(iso)` → `{days, hours, minutes, seconds}` (all-zero fallback for empty/invalid input rather than throwing), `formatDurationIso(parts)` → canonical ISO-8601 string (omits zero-value components; all-zero serializes to the shortest valid form `PT0S`), and `formatDurationHuman(iso)` → readable summary (e.g. "3 days, 4 hours, 30 minutes"; singularizes 1-unit values; renders `'—'` for empty input). Re-exported from `src/utils/index.ts`.
3. **`BooleanEditor.vue`** — `v-switch`, **AutoSave on `@update:model-value` (change), not blur**, per the F015 lock. Display mode renders "Yes"/"No" (em-dash when unset).
4. **`RatingEditor.vue`** — `v-rating` `length="4"` `:half-increments="false"` `clearable`, **AutoSave on change**, per the F015 lock. Clicking the active star again emits `0`, which the component normalizes to `undefined` on the wire (no rating). Display mode renders `"{n} / 4"` (em-dash when unrated).
5. **`CountEditor.vue`** / **`IndexEditor.vue`** — `v-text-field type="number" min="0"`, default `rules` to `[validationRules.nonNegativeInteger]`, **AutoSave on blur**. Chose `v-text-field` over the stable `v-number-input` (both are explicitly allowed by the task) to reuse the exact tested AutoSave-on-blur shape from `StringEditor`/`CountEditor`'s sibling string editors and the already-established `v-text-field` test stub — no behavioral difference for this integer-bounded use case. `IndexEditor` is otherwise identical to `CountEditor`, distinguished only by its zero-based-semantics hint (`resolvedHint` defaults to `'Zero-based index'`, overridable via the `hint` prop) — no shared base file was introduced since the task's Outputs list only names the two top-level files.
6. **`DateTimeEditor.vue`** — wire value is an ISO-8601 date-time string; users never see or type it. Renders two `v-text-field`s — `type="date"` and `type="time"` (`step="1"` for seconds) — which render the browser's native calendar/clock picker UI (satisfies "prefer standard Vuetify... do not rely on users typing ISO-8601" without an unregistered Vuetify **labs** dependency — see "Notes/decisions" below). Internal `dateInput`/`timeInput` refs are combined into a full ISO string (`combineToIso`) using local-time `Date` construction so the wire value round-trips correctly regardless of the browser's timezone. **AutoSave fires on blur of the composite control** (a `@focusout` handler on the wrapping `<div>` checks `event.relatedTarget`; only fires `handleBlur()` once focus leaves *both* sub-fields), not per-sub-field blur — otherwise tabbing from the date field into the time field would trigger a premature save with a stale/default time. Display mode uses the existing `formatDate()` util for a readable summary (never the raw ISO string).
7. **`DurationEditor.vue`** — wire value is an ISO-8601 duration string (`P…T…`, day/hour/minute/second components). Primary edit UX is **four structured `v-text-field type="number"` controls** (Days / Hours 0-23 / Minutes 0-59 / Seconds 0-59) — never a raw `P3DT4H30M` text field, per the task's explicit requirement. Uses `parseDurationIso`/`formatDurationIso` from the new `src/utils/duration.ts` helper to serialize/parse. **Chose AutoSave on blur of the composite control** (same `@focusout`-on-container pattern as `DateTimeEditor`, documented here per the task's "document choice" instruction) over per-field change-based saves, because a change-based save on the first field edited (e.g., typing "3" into Days) would save an incomplete/incorrect duration before the user finishes adjusting Hours/Minutes/Seconds. View mode renders `formatDurationHuman()`'s readable summary (e.g. "3 days, 4 hours, 30 minutes"), never the ISO string.
8. **`BreadcrumbDisplay.vue`** — composite read-only display (name unchanged, default `editable=false` per the F015 lock). Renders `from_ip`, `by_user`, `at_time` (via `formatDate()`), and `correlation_id` in a `<dl>` definition list, each with its own `{automationId}-{field}-display` automation id. Always renders the same read-only view regardless of the `editable` prop's value (kept in the prop surface only for shared-contract parity — a breadcrumb has no coherent "edit" concept as a whole object). Implemented as a standalone display (own value resolution + formatting) rather than composing the string/date editors in `editable=false` mode, since the task marks that composition as optional ("may compose...") and a self-contained implementation is simpler to reason about and test.
9. **`src/components/editors/types.ts`** — added `BreadcrumbValue` interface (`{from_ip?, by_user?, at_time?, correlation_id?}`), placed here (not in the `.vue` file) so it can be re-exported as a plain named type export without relying on `<script setup>` SFC type-export compilation behavior.
10. **`src/components/editors/index.ts`** / **`src/components/index.ts`** — exported all seven new components (plus the `BreadcrumbValue` type) alongside the existing F017/F018 exports.
11. **`tests/setup.ts`** — added minimal global stubs for `v-switch` (checkbox input emitting `update:modelValue`) and `v-rating` (clickable div stub emitting a fixed rating of `3` on click, for one real-DOM-interaction test per editor) — following the same pattern as the existing `v-text-field`/`v-select` stubs. `CountEditor`/`IndexEditor`/`DateTimeEditor`/`DurationEditor` reuse the existing `v-text-field` stub (no new stubs needed there).

### Notes / decisions

- **`DateTimeEditor` control choice:** the task's catalog says "prefer standard Vuetify date/time pickers." Vuetify 3.12's stable `v-date-picker`/`v-time-picker` require either an inline (large, calendar-sized) layout or a `v-menu`-based popup recipe; the only self-contained "text field + built-in calendar popup" component (`VDateInput`) lives in Vuetify **labs** and is not registered in this repo's `demo/main.ts` (`vuetify/components` only, no `vuetify/labs/components`). Depending on a labs component here would silently break for any consumer that doesn't also register labs components. Native `v-text-field type="date"` / `type="time"` render the browser's own calendar/clock picker UI — genuinely satisfying "don't make users type ISO-8601" — while staying on the stable, already-registered Vuetify surface. Documented here per the task's spirit of calling out non-obvious control choices.
- **Composite-control AutoSave timing:** both `DateTimeEditor` and `DurationEditor` use a container-level `@focusout` (checking `event.relatedTarget` against the container) rather than per-sub-field `@blur`, so a save only fires once focus leaves the *whole* multi-field control. This avoids saving an incomplete/stale composite value while the user is still tabbing between sub-fields.
- Did not touch `AutoSaveSelect.vue`, demo pages, or docs — out of scope per task.

### Test results

- `npm run test` — **318/318 tests passed** (32 test files), including 96 new tests across the 7 new editor test files (`BooleanEditor`, `CountEditor`, `IndexEditor`, `RatingEditor`, `DateTimeEditor`, `DurationEditor`, `BreadcrumbDisplay`), 15 new `duration.ts` util tests, and 8 new validation-rule tests (`dateTimePattern`, `durationPattern`). Each editor's test suite covers: standalone `modelValue`/`onSave`, the `editable`/`visible` contract (writable control vs. plain display vs. render-nothing), `DataCard` context provide/inject (`field` + injected model/`onSave`), save-trigger semantics (change vs. blur, including a composite-control focusout test for `DateTimeEditor`/`DurationEditor` proving sub-field-to-sub-field focus moves don't save prematurely), error handling, and the `saved`-state timeout. Pre-existing `[Vue warn] Failed to resolve component: v-card/...` noise in `MhCard.test.ts` is unrelated (same as noted in F017/F018).
- `npm run build` — succeeded (`vite build` + `tsc --emitDeclarationOnly`); package builds cleanly with the new exports (`dist/index.js` 77.47 kB / gzip 14.00 kB).
- `npm run test:coverage` — all seven new editor files and `duration.ts` are at 100% statement/line coverage (a couple of branch-coverage gaps remain in `DateTimeEditor`/`DurationEditor`/`RatingEditor` from Vue SFC-compiled internal function counting, not missing test scenarios). The overall `src/components/**`/`src/utils/**` threshold failures are **pre-existing** (untested `AdminPage.vue`, `components/admin/*`, `utils/admin.ts`, `utils/urlAuthBootstrap.ts`) and unrelated to F019, consistent with the same caveat documented in F017/F018.

### Blockers

None. `DataCard` (F020) and demo pages (F021) were intentionally left untouched per task scope.

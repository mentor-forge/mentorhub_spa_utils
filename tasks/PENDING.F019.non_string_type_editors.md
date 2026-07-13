# F019 – Type-aligned non-string view/edit editors

**Status**: Pending  
**Type**: Feature  
**Depends On**: F018  
**Description**: Implement configurator-type-aligned non-string editors and the breadcrumb display using standard Vuetify controls, sharing the F017 editor contract.

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

### Planned component design (non-string family)

| Type | Component | Control | Validation / behavior |
|------|-----------|---------|------------------------|
| `boolean` | `BooleanEditor` | `v-switch` (preferred) | true/false; **AutoSave on change** (not blur) — F015 locked |
| `count` | `CountEditor` | `v-text-field` `type="number"` or `v-number-input` if available in project Vuetify | integer ≥ 0; blur save when editable |
| `index` | `IndexEditor` | same as count | integer ≥ 0; zero-based semantics in label/hint |
| `rating` | `RatingEditor` | `v-rating` | integer 1–4 only; clear empty/half-star disabled; **AutoSave on change** (not blur) — F015 locked |
| `date-time` | `DateTimeEditor` | Prefer standard Vuetify date/time pickers; fallback outlined text field with ISO-8601 rules | store/display ISO-8601 strings consistent with API JSON |
| `breadcrumb` | `BreadcrumbDisplay` | Read-only layout (fields or definition list) inside card body | Shows `from_ip`, `by_user`, `at_time`, `correlation_id`; **default `editable=false`** — display-only, not an edit form. Name stays `BreadcrumbDisplay`. May compose string/date editors in `editable=false` mode |

Shared contract parity with F018: `field`, optional `visible`, `editable` (where applicable), `automationId` → `data-automation-id`, full-width in card bodies, density/variant defaults, exports from `src/components/index.ts`.

**Out of scope (F015 defer):** generic enum / enumerator editor; `AutoSaveSelect` remains the discrete-select pattern for this wave.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Unit tests for each new editor/display component (validation bounds for count/index/rating; breadcrumb renders all four fields; Boolean/Rating save on change; default `editable=false` for BreadcrumbDisplay).
- `npm run test`
- `npm run build`

## Outputs

- `src/components/editors/BooleanEditor.vue`
- `src/components/editors/CountEditor.vue`
- `src/components/editors/IndexEditor.vue`
- `src/components/editors/RatingEditor.vue`
- `src/components/editors/DateTimeEditor.vue`
- `src/components/editors/BreadcrumbDisplay.vue`
- `src/components/index.ts` — exports
- `src/utils/validation.ts` — rules as needed
- Matching `tests/components/editors/*.test.ts`

The agent must not update demo pages (F021) or docs (F023) in this task.

## Execution Notes

(reserved for execution agent)

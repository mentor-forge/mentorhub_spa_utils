# F017 – Editor foundation: shared props, StringEditor base, AutoSave alignment

**Status**: Pending  
**Type**: Feature  
**Depends On**: F016  
**Description**: Establish the shared view/edit editor contract and an abstract string-input base. Refactor existing AutoSave field patterns so type-specific editors compose one consistent declarative API (field key, visibility, editability, automation id, save behavior).

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
- `tasks/PENDING.F015.peer_review_card_editor_approach.md` — naming / provide-inject decisions
- `README.md`
- `src/components/AutoSaveField.vue`
- `src/components/AutoSaveSelect.vue`
- `src/components/index.ts`
- `src/utils/validation.ts`
- `tests/components/AutoSaveField.test.ts`
- `cypress/e2e/components/AutoSaveField.cy.ts`

## Goals

### Shared editor contract (all typed editors)

Document and implement a common props/API surface (exact names per F015), including:

- **Field binding** — property key on a parent model (e.g. `field` / `dataKey`; avoid reserved Vue prop pitfalls called out in F015).
- **Visibility** — show/hide the control without removing it from the form model.
- **Editability** — view (read-only display) vs edit (writable control); editable fields support AutoSave-on-blur (or agreed save trigger) with saving/saved/error affordances matching current AutoSave UX.
- **Automation** — `automationId` / `data-automation-id` for interactive and key display elements.
- **Label / hint / rules** — optional presentation and validation hooks.
- **Width** — controls expand to fill the parent card/body horizontal space.

### Abstract string input

- Introduce a base string editor (composition or wrapper) used by word/sentence/email/url/… derivatives.
- Encapsulate Vuetify `v-text-field` / `v-textarea` usage, AutoSave state icons, and error display.
- Existing `AutoSaveField` should either become this base or thin-wrap it — **no duplicate parallel string editors**. Update unit and Cypress tests accordingly. Prefer non-breaking re-exports where practical; if a breaking rename is required, note it for F023 and F025.

### Validation helpers

- Extend `src/utils/validation.ts` with reusable rules aligned to configurator type constraints used by F018/F019 (at least stubs/exports for patterns that typed editors will consume). Full per-type wiring can complete in F018/F019.

### Planned component family (design catalog)

The following names are the planned typed editors (implemented in F018/F019). This foundation must make each derivative thin:

| Configurator type | Planned component | Base / notes |
|-------------------|-------------------|--------------|
| `word` | `WordEditor` | String base + max 40 / no whitespace |
| `sentence` | `SentenceEditor` | String base + 0–255 / no tabs-newlines |
| `markdown` | `MarkdownEditor` | Textarea (or markdown-capable Vuetify control) + max 4096 |
| `email` | `EmailEditor` | String base + email pattern / type |
| `url` | `UrlEditor` | String base + URI pattern |
| `us_phone` | `UsPhoneEditor` | String base + US phone pattern |
| `duration` | `DurationEditor` | String base + ISO-8601 duration pattern |
| `ip_address` | `IpAddressEditor` | String base + IP format |
| `identifier` | `IdentifierEditor` | String base; often read-only ObjectId |
| `boolean` | `BooleanEditor` | `v-switch` or `v-checkbox` |
| `count` | `CountEditor` | numeric ≥ 0 |
| `index` | `IndexEditor` | numeric ≥ 0 (zero-based) |
| `rating` | `RatingEditor` | `v-rating` 1–4 |
| `date-time` | `DateTimeEditor` | ISO date-time via standard Vuetify date/time controls or text+rules |
| `breadcrumb` | `BreadcrumbDisplay` | Composite read-only display of four fields |

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Update `tests/components/AutoSaveField.test.ts` and any Cypress AutoSave tests for the refactor.
- Add unit tests for the new string base / shared contract helpers.
- `npm run test`
- `npm run build`
- Existing Cypress: `npm run cypress:run` for AutoSaveField (and related) if the demo route still hosts them; otherwise run after F021 when demos move.

## Outputs

- `src/components/` — string editor base and any shared editor helpers/composables as needed
- `src/components/AutoSaveField.vue` — refactored to align with base
- `src/components/index.ts` — exports
- `src/utils/validation.ts` — extended type-aligned rules
- `tests/components/AutoSaveField.test.ts` and new base-editor tests
- `cypress/e2e/components/AutoSaveField.cy.ts` — updated if selectors/API change
- Optional: `tests/utils/validation.test.ts` updates

The agent must not update demo pages (F021) or documentation (F023) beyond what is required to keep the package buildable.

## Execution Notes

(reserved for execution agent)

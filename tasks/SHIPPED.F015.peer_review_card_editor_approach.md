# F015 – Peer review: Card, DataCard, and type-aligned editor approach

**Status**: Shipped  
**Type**: Feature  
**Depends On**: none  
**Description**: Kickoff peer review of the planned reusable Card/layout system and configurator-type-aligned view/edit components. Identify gaps and anti-patterns, then adjust the remaining PENDING tasks in this workflow before implementation starts.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `CONTRIBUTING.md`, `src/...`, `demo/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Component Patterns, Automation IDs, Testing Standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `src/components/AutoSaveField.vue`
- `src/components/AutoSaveSelect.vue`
- `src/components/index.ts`
- `src/utils/validation.ts`
- `demo/pages/DemoPage.vue`
- `demo/router.ts`
- All `PENDING.F016.*` through `PENDING.F025.*` task files in `tasks/`

**Approach under review (author intent):**

1. **Cards & layout** — Reusable card with solid-color title bar (title + identifier), white body, right-justified action-icon slot, thin border, slight radius, shadow. List pages use a responsive card grid (mobile 1-col → desktop/wide multi-col). View/Edit pages use cards as input containers with show/hide toggle; controls expand to fill the card. Cards grow to available horizontal space.
2. **Type-aligned editors** — One reusable view/edit control family aligned to MongoDB configurator type names (`word`, `sentence`, `markdown`, `email`, `url`, `us_phone`, `duration`, `ip_address`, `identifier`, `boolean`, `count`, `index`, `rating`, `date-time`, `breadcrumb`). Prefer an abstract string-input base with typed derivatives; keep forms declarative (`DataCard` + editor children with `data`, visibility, editability, automation attrs).
3. **Existing editors** — Adjust `AutoSaveField` / `AutoSaveSelect` rather than leaving parallel patterns.
4. **Demo** — Demo server shows all inputs across several cards plus a cards-based dashboard page.
5. **Stack** — Standard Vuetify / Material Design controls, icons, and styles only; global theme tweaks later if needed.
6. **Close** — Version bump, then `ISSUE.md` files for downstream `*_spa` repos.

Configurator type semantics (vocabulary only — do not read sibling `mentorhub_mongodb_api` files during execution):

| Type | Constraint summary |
|------|--------------------|
| `word` | 1–40 chars, no whitespace |
| `sentence` | 0–255 chars, no tabs/newlines |
| `markdown` | string up to 4096 chars |
| `email` | email pattern |
| `url` | `http(s)://…` URI |
| `us_phone` | `+1##########` or `###-###-####` |
| `duration` | ISO-8601 duration |
| `ip_address` | IPv4/IPv6 |
| `identifier` | 24-hex ObjectId |
| `boolean` | true/false |
| `count` / `index` | non-negative integer |
| `rating` | integer 1–4 |
| `date-time` | ISO-8601 date-time |
| `breadcrumb` | object `{from_ip, by_user, at_time, correlation_id}` (typically display-only) |

## Goals

- Peer-review the approach above against Vue 3 + Vuetify 3 practice, spa_standards AutoSave/automation patterns, and package export boundaries (`src/components`, `src/utils`, demo only).
- Explicitly call out gaps and anti-patterns, including at least consideration of:
  - Prop naming vs Vue conventions (`data` reserved/confusing; prefer `dataKey` / `field` while keeping declarative usage clear)
  - Provide/inject vs prop-drilling for `DataCard` model binding
  - Collapse state persistence (none / local / parent-controlled)
  - View vs edit mode strategy (separate components vs `readonly` / `editable` prop)
  - Overlap with existing `AutoSaveField` / `AutoSaveSelect` / `validationRules`
  - Breadcrumb and identifier UX (usually read-only)
  - Whether `AutoSaveSelect` / enum editors belong in this wave or a follow-on
  - Breakpoint tokens for the card grid (Vuetify `cols` / `md` / `lg` / `xl`)
  - Package public API / breaking-change impact on journey SPAs
- Update `PENDING.F016`–`PENDING.F025` task files as needed (Goals, Outputs, Testing Expectations, sequenced Dependencies) so the serial chain reflects peer-review decisions.
- Leave a short **Peer review findings** subsection in this task’s **Execution Notes** summarizing decisions (keep/change/defer).

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- No product code changes required for this task.
- Verify every `PENDING.F016`–`PENDING.F025` file still satisfies `tasks/_PLANNING.md` layout (Status, Type, Depends On, Path anchoring, Context, Goals, Testing Expectations, Outputs, Execution Notes).
- Confirm the dependency chain remains a single serial sequence starting at F015.
- `npm run test` and `npm run build` only if incidental file edits could affect the package (normally N/A).

## Outputs

- `tasks/PENDING.F015.peer_review_card_editor_approach.md` — Execution Notes with peer review findings
- `tasks/PENDING.F016.*` through `tasks/PENDING.F025.*` — adjusted as required by the review (may rename short names only if Depends On references stay consistent; prefer editing content in place)

The agent must not update files outside this list (no `src/`, `demo/`, or docs changes in this task).

## Execution Notes

### Peer review findings

Reviewed against Vue 3 + Vuetify 3 practice, spa_standards AutoSave/automation patterns, and current package surface (`AutoSaveField`, `AutoSaveSelect`, `validationRules`). Overall approach is sound; gaps were naming ambiguity (`data`), incomplete inject typing, missing density/variant defaults, and unclear AutoSave migration. Decisions baked into F016–F025:

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Prop naming | **Keep/change:** `field` (model key), `model` (DataCard document), `nameField` (title-bar binding), `editable` + optional `visible`, `automationId` → `data-automation-id` | Avoids Vue `data` confusion; aligns with existing AutoSave `automationId` |
| Binding | **Keep:** `provide`/`inject` via exported Symbol; editors also keep standalone `modelValue` + `onSave` | Idiomatic Vue 3; demos work without DataCard |
| Collapse | **Keep/change:** uncontrolled local default; optional `v-model:collapsed`; **no persistence** | Simple; parent can control when needed; avoids stale localStorage |
| View vs edit | **Keep:** single `*Editor` / `BreadcrumbDisplay` family with `editable` prop (not separate View/Edit components) | One automation-id contract; matches spa_standards `-display` when readonly |
| AutoSaveField | **Change:** thin compatibility wrapper around string base; **no rename** of export | Non-breaking for journey SPAs; typed editors preferred going forward |
| AutoSaveSelect / enum | **Defer:** leave `AutoSaveSelect` as-is; no generic enum editor this wave | Out of configurator-type set; avoids scope creep |
| Identifier / breadcrumb | **Keep:** default `editable=false`; name stays `BreadcrumbDisplay` (display-first) | ObjectIds and audit trails are rarely user-edited |
| CardGrid breakpoints | **Keep:** defaults `cols="12" sm="6" md="4" lg="3"` with override props | Clear mobile→wide progression; documented for consumers |
| Package API | **Keep:** additive minor **`0.5.0`**; retain `AutoSaveField` export name | Pre-1.0 minor for additive surface; no forced SPA breakage |
| Component names | **Keep:** `MhCard`, `CardGrid`, `DataCard`, `*Editor`, `BreadcrumbDisplay` | Clear public API; `Mh` prefix disambiguates from Vuetify `v-card` |
| Boolean / Rating save | **Keep:** change-based `onSave` (not blur) | Blur is wrong for switch/rating UX; document in F019/F023 |
| Folder layout | **Keep:** `src/components/editors/` for typed editors; cards at `src/components/` | Editors folder scales; cards stay package-root components |
| Density / variant | **Add (gap):** default `density="comfortable"` + `variant="outlined"` | Match existing AutoSaveField/Select chrome |
| Provide key + typing | **Add (gap):** export Symbol provide key + typed inject interface in F017; wire in F020 | Prevents untyped string keys and ad-hoc inject contracts |

### Gap / anti-pattern resolutions applied

- Rejected prop name `data` / preferred `dataKey` → locked **`field`**.
- Rejected dual View/Edit component trees → locked **`editable`**.
- Rejected parallel AutoSave + typed string editors → wrapper + preferred typed API.
- Rejected collapse persistence → none.
- Deferred enum editor explicitly in F019/F023/F025.

### Downstream task updates

- F016–F025 Goals/Outputs/Testing Expectations updated in place with locked names, breakpoints, collapse, provide/inject, AutoSave wrapper, save triggers, folder layout, and `0.5.0`.
- Context links retargeted to `SHIPPED.F015...` where appropriate.
- Dependency chain unchanged: F015 → F016 → … → F025 (serial).

### Verification

- Task layout sections present on F016–F025 per `_PLANNING.md`.
- No `src/`, `demo/`, or docs edits in this task.
- No commit/push (orchestrator owns change control).

### Post-ship amendment (human review)

- **`duration` moved F018 → F019:** Like `date-time`, the wire type is an ISO string, but primary edit UX must be a structured duration control (human units), not a patterned text field requiring `P3DT4H30M` knowledge. Catalog and F017/F018/F019/F021 updated accordingly.

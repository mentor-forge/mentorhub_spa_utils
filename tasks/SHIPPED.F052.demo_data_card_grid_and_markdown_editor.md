# F052 – Demo DataCardGrid and MarkdownEditor

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F051  
**Description**: Show `DataCardGrid` and the rendered `MarkdownEditor` on the type-editor demo, and extend Cypress so click-to-edit and the grid root are exercised in the browser.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `demo/...`, `cypress/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/PENDING.F050.harvest_data_card_grid.md` (or `SHIPPED.F050.*`)
- `tasks/PENDING.F051.harvest_markdown_editor.md` (or `SHIPPED.F051.*`)
- `demo/pages/EditorsPage.vue`
- `cypress/e2e/pages/editors.cy.ts`
- `src/components/DataCardGrid.vue`
- `src/components/editors/MarkdownEditor.vue`

GitHub: [issue #41](https://github.com/mentor-forge/mentorhub_spa_utils/issues/41)

`CardGrid` remains the list-dashboard component until F054. This task only changes the editors gallery.

## Goals

- `/demo/editors` lays out its `DataCard`s in `DataCardGrid` instead of `CardGrid`.
- Existing card and field automation ids on that page stay stable (`editors-identity-card`, `editors-markdown`, and the rest of the gallery).
- The markdown demo value still starts as a heading plus bold text (`# Demo notes` and `**markdown**`).
- The page copy mentions rendered markdown and click-to-edit, and names `DataCardGrid` as the gallery layout.
- Cypress proves:
  - `[data-automation-id="data-card-grid"]` contains the identity and content cards
  - `[data-automation-id="editors-markdown"]` shows rendered "Demo notes" (a heading) and does not show a visible textarea until the display is activated
  - Clicking the markdown display, changing the text, and blurring saves through the page save log and returns to rendered markdown
  - Existing word/email validation and audit collapse specs still pass

### Craftsmanship Expectations

- Keep the demo a consumer of the shared components. Do not reimplement grid CSS or markdown parsing in `demo/`.
- Leave `/demo/dashboard` on `CardGrid` until F054 removes that list demo.
- Do not change editor props on the gallery except where the layout component swap requires it.

## Testing Expectations

Run all commands from this repository root.

- `npm run test`
- `npm run lint`
- `npm run build`
- With `npm run dev` running, `npm run cypress:run -- --spec cypress/e2e/pages/editors.cy.ts`
- If the full Cypress suite is already the local practice for demo changes, run `npm run cypress:run` and record failures that are unrelated to this page separately.
- Confirm the markdown spec uses the real display/edit path (click, type, blur, rendered result), not only `cy.get(...).should('exist')`.

## Outputs

- `demo/pages/EditorsPage.vue`
- `cypress/e2e/pages/editors.cy.ts`

The agent must not edit `DataCardGrid.vue`, `MarkdownEditor.vue`, `CardGrid.vue`, README, package version, dashboard demo, or any journey SPA in this task.

## Execution Notes

### Plan
1. In `demo/pages/EditorsPage.vue`, replace `CardGrid` with `DataCardGrid` (no props; fixed `data-automation-id="data-card-grid"`). Keep all card/field automation ids and the markdown seed value unchanged.
2. Update gallery copy to mention rendered markdown, click-to-edit, and `DataCardGrid` as the layout.
3. In `cypress/e2e/pages/editors.cy.ts`:
   - Assert `[data-automation-id="data-card-grid"]` contains identity and content cards.
   - Assert markdown shows rendered "Demo notes" heading and textarea is not visible until display is clicked.
   - Exercise click → type → blur → save log + re-rendered markdown.
   - Keep existing word/email validation and audit collapse specs.
4. Run `npm run test`, `npm run lint`, `npm run build`, start `npm run dev` if needed, then Cypress editors spec.

### Results
- **EditorsPage.vue**: Swapped `CardGrid` → `DataCardGrid`; copy now names `DataCardGrid`, rendered markdown, and click-to-edit. Seed markdown and all card/field automation ids unchanged. Dashboard left on `CardGrid`.
- **editors.cy.ts**: Grid containment + rendered-heading/hidden-textarea assertions; click-to-edit path clicks display, types into visible textarea, blurs, asserts save log and re-rendered markdown. Existing validation/audit/enum specs retained.
- `npm run test`: **42 files / 457 tests passed**
- `npm run lint`: **failed** — `eslint: command not found` (exit 127); recorded and continued per task rules
- `npm run build`: **passed**
- `npm run dev`: started on port 8386 (was not already running)
- `npm run cypress:run -- --spec cypress/e2e/pages/editors.cy.ts`: **14/14 passed** (39s)
- No blockers. Status left Pending for orchestrator confirmation.

**Orchestrator confirmation:** Re-ran `npm run cypress:run -- --spec cypress/e2e/pages/editors.cy.ts` against the dev server on `:8386` — **14/14 passed**, including click-to-edit markdown and the `data-card-grid` root.


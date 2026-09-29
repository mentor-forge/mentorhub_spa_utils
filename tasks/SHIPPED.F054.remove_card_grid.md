# F054 – Remove CardGrid

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F053  
**Description**: Remove the shared list `CardGrid` from this package. List card dashboards now belong to Discovery; this package keeps `MhCard`, `DataCard`, and `DataCardGrid`. Ship the removal in the **1.0.6** patch (F056). Downstream journey SPAs already host the list grid locally or no longer import it.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `src/components/...`, `demo/...`, `tests/...`, `cypress/...`, `README.md`, `CONTRIBUTING.md`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md` — current `CardGrid` contract, infinite-scroll replacement note, list-card note, `useResourceList` note
- `CONTRIBUTING.md` — component tree and `/demo/dashboard`
- `src/components/index.ts`
- `src/components/CardGrid.vue`
- `src/components/MhCard.vue` — keep; collapsed chrome stays here
- `src/components/DataCardGrid.vue`
- `tests/components/CardGrid.test.ts`
- `tests/components/DataCard.test.ts` — CardGrid composition case
- `tests/packaging/componentStyles.test.ts`
- `tests/setup.ts` — `VRow` / `VCol` stubs commented as CardGrid leftovers
- `demo/pages/DashboardPage.vue`
- `demo/pages/DemoPage.vue`
- `demo/pages/EditorsPage.vue` — should already use `DataCardGrid` after F052
- `demo/router.ts`
- `cypress/e2e/pages/dashboard.cy.ts`
- `cypress/e2e/navigation.cy.ts` — DemoPage dashboard link spec
- GitHub: [issue #33](https://github.com/mentor-forge/mentorhub_spa_utils/issues/33)

Do **not** read or edit journey SPA repositories. Discovery already hosts the list card grid. This task deletes the shared copy rather than leaving a deprecated alias.

### Locked removal decision

Delete the component. Do not keep a `CardGrid` re-export, a console deprecation warning, or a wrapper around `DataCardGrid`.

`MhCard` and `DataCard` stay. Multi-card edit/view layout is `DataCardGrid` only.

The in-repo list dashboard (`/demo/dashboard`) exists to demonstrate `CardGrid`. Remove that route, page, DemoPage link, and Cypress coverage. Do not rebuild a list dashboard on `DataCardGrid`.

## Goals

- `CardGrid` is gone from source, tests, demo, Cypress, and public exports.
- `dist` declarations and JS do not export `CardGrid`.
- `DataCardGrid`, `MarkdownEditor`, `MhCard`, and `DataCard` remain exported.
- `tests/components/DataCard.test.ts` proves two `DataCard`s render inside `DataCardGrid` instead of `CardGrid`.
- Packaging test still proves `dist/index.js` imports `./index.css`. Replace `.mh-card-grid` / eight-column assertions with the `DataCardGrid` contract (`.data-card-grid`, two columns, four columns). Keep an `MhCard` collapsed-class assertion only if `MhCard.vue` still emits `.mh-card--collapsed`.
- Remove the `VRow` / `VCol` test stubs in `tests/setup.ts` when nothing else resolves those names. Restore a stub only if a remaining component test fails without it.
- README and CONTRIBUTING present `MhCard` / `DataCard` / `DataCardGrid` as the card API. List card dashboards are Discovery's responsibility, not an export of this package.
- Infinite-scroll and `useResourceList` sections no longer tell consumers to build list UIs with `CardGrid`.
- The historical `0.5.3` stylesheet note may stay as history, but it must not tell readers to import `CardGrid` today.
- Do not pin package version **1.0.6** in this task.

### Craftsmanship Expectations

- Delete the obsolete list grid instead of preserving a second layout API.
- Do not move Discovery list behavior back into this package.
- Keep the editors gallery on `DataCardGrid` (F052). If any `CardGrid` usage remains on that page, replace it here.

## Testing Expectations

Run all commands from this repository root.

- Search `src/`, `demo/`, `tests/`, `cypress/`, `README.md`, and `CONTRIBUTING.md` for `CardGrid` and remove live references. Shipped task files under `tasks/SHIPPED.*` may keep the historical name.
- `npm run test`
- `npm run test:coverage` (record known unrelated threshold failures separately)
- `npm run lint`
- `npm run build`
- Inspect `dist/index.d.ts` and `dist/components/index.d.ts`: no `CardGrid`; `DataCardGrid`, `MhCard`, `DataCard`, and `MarkdownEditor` still present.
- `dist/index.css` contains `.data-card-grid` and does not contain `.mh-card-grid`.
- With `npm run dev` running, `npm run cypress:run -- --spec cypress/e2e/pages/editors.cy.ts,cypress/e2e/navigation.cy.ts`
- Confirm no spec still visits `/demo/dashboard`.

## Outputs

- `src/components/CardGrid.vue` (delete)
- `src/components/index.ts`
- `tests/components/CardGrid.test.ts` (delete)
- `tests/components/DataCard.test.ts`
- `tests/packaging/componentStyles.test.ts`
- `tests/setup.ts`
- `demo/pages/DashboardPage.vue` (delete)
- `demo/pages/DemoPage.vue`
- `demo/pages/EditorsPage.vue` (only if a `CardGrid` reference remains)
- `demo/router.ts`
- `cypress/e2e/pages/dashboard.cy.ts` (delete)
- `cypress/e2e/navigation.cy.ts`
- `README.md`
- `CONTRIBUTING.md`

The agent must not bump `package.json` version, edit `DataCardGrid` / `MarkdownEditor` behavior, author ISSUE seeds (F055), or edit journey SPAs.

## Execution Notes

### Plan
1. Delete `src/components/CardGrid.vue`; remove its export from `src/components/index.ts`.
2. Delete `tests/components/CardGrid.test.ts`; update `DataCard.test.ts` composition to use `DataCardGrid`; update packaging test for `.data-card-grid` (2/4 cols) and `./index.css` import; drop unused `VRow`/`VCol` stubs from `tests/setup.ts`.
3. Delete `demo/pages/DashboardPage.vue`, remove `/demo/dashboard` from `demo/router.ts` and DemoPage link; delete `cypress/e2e/pages/dashboard.cy.ts` and dashboard visit from `navigation.cy.ts`.
4. Rewrite README/CONTRIBUTING CardGrid sections: card API is MhCard / DataCard / DataCardGrid; list dashboards belong to Discovery; fix stale editors-page CardGrid note; leave infinite-scroll / useResourceList without CardGrid guidance.
5. Search live trees for remaining `CardGrid` / `.mh-card-grid` references (ignore `tasks/SHIPPED.*`).
6. Run unit, coverage, lint, build; Cypress editors + navigation against existing `:8386` if up; inspect dist for no CardGrid and present DataCardGrid/MhCard/DataCard/MarkdownEditor.

### Results

**Outcome: success** (CardGrid removal complete). One unrelated Cypress env failure noted below.

**Deleted**
- `src/components/CardGrid.vue`
- `tests/components/CardGrid.test.ts`
- `demo/pages/DashboardPage.vue`
- `cypress/e2e/pages/dashboard.cy.ts`

**Updated**
- `src/components/index.ts` — dropped `CardGrid` export (kept MhCard / DataCard / DataCardGrid / MarkdownEditor)
- `tests/components/DataCard.test.ts` — composition case mounts `DataCardGrid`
- `tests/packaging/componentStyles.test.ts` — asserts `.data-card-grid`, 2-col / 4-col repeats, no `.mh-card-grid`, `./index.css` import, `.mh-card--collapsed`
- `tests/setup.ts` — removed unused `VRow` / `VCol` stubs
- `demo/router.ts` — removed `/demo/dashboard`
- `demo/pages/DemoPage.vue` — removed Dashboard list item
- `cypress/e2e/navigation.cy.ts` — removed dashboard visit test
- `README.md` — card API is MhCard / DataCard / DataCardGrid; list dashboards → Discovery; infinite-scroll / useResourceList no longer recommend CardGrid; stale editors CardGrid note removed
- `CONTRIBUTING.md` — component tree and routes without CardGrid / DashboardPage

**Live `CardGrid` references outside `tasks/SHIPPED.*`:** none in `src/`, `demo/`, `tests/`, `cypress/`, `README.md`, `CONTRIBUTING.md`. (Task file itself still names CardGrid by design.)

**Commands**
- `npm run test` — **PASS** 41 files, **447** tests
- `npm run test:coverage` — tests **PASS** 447/447; known unrelated `src/utils/**` threshold failures (lines/funcs/stmts/branches < 100%) recorded and continued
- `npm run lint` — `eslint: command not found` (exit 127; pre-existing) recorded and continued
- `npm run build` — **PASS**; dist has no `\bCardGrid\b`; exports DataCardGrid, MhCard, DataCard, MarkdownEditor; `dist/index.css` has `.data-card-grid`, no `.mh-card-grid`; `dist/index.js` imports `./index.css`
- Cypress (`editors.cy.ts,navigation.cy.ts` against `:8386`): **editors 14/14 PASS**; **navigation 18/19** — 1 fail: `should show profile control with customer profile href` expects drawer `nav-profile-name-display` to contain `Cypress User` but live `/api/config` yields `unknown`. Reproduced on retry; unrelated to CardGrid removal (PageFrame/config token). No spec visits `/demo/dashboard`.

**Blockers:** none for F054 CardGrid removal. Soft note: navigation Cypress display_name env failure (not introduced here; not fixed — outside removal scope).

**Not done (per task):** no version bump, no DataCardGrid/MarkdownEditor behavior edits, no ISSUE seeds, no journey SPA edits.

**Orchestrator confirmation:** Re-ran `tests/components/DataCard.test.ts` and `tests/packaging/componentStyles.test.ts` — 16/16 passed. Re-ran `navigation.cy.ts` — 18/19. The one failure is `should show profile control with customer profile href` expecting `Cypress User` in `nav-profile-name-display`; the spec diff only removes the dashboard visit. No spec visits `/demo/dashboard`. README no longer presents `CardGrid` as a current export.


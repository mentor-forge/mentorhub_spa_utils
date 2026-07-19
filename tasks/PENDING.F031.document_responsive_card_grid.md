# F031 – Document responsive equal-height CardGrid

**Status**: Pending  
**Type**: Feature  
**Depends On**: F030  
**Description**: Document the fixed 1→8 CardGrid layout, equal-height and collapsed-card contracts, consumer width responsibility, and the migration away from Vuetify breakpoint props (shipped as a patch in early development).

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `demo/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- the status-prefixed task records matching `F029.harvest_responsive_card_grid.md` and `F030.demo_responsive_card_grid.md`
- `README.md`, especially “MhCard / CardGrid / DataCard” and “Harvesting a local control into spa_utils”
- `src/components/CardGrid.vue`
- `src/components/MhCard.vue`
- `demo/pages/DashboardPage.vue`

## Goals

- Update the README `CardGrid` contract from `VRow`/`VCol` overrides to fixed CSS Grid behavior.
- Document equal-width tracks and equal-height expanded cards within each visual row.
- Document that the stretch override is scoped to `CardGrid`; standalone/non-grid `MhCard` keeps intrinsic height.
- Document the collapsed contract: `.mh-card--collapsed` stays at title-bar/intrinsic height and does not stretch to its row siblings.
- Include the exact responsive breakpoint contract:
  - 1 column at 0
  - 2 at 600px (`sm`)
  - 3 at 960px (`md`)
  - 4 at 1280px (`lg`)
  - 5 at 1600px
  - 6 at 1920px (`xl`)
  - 7 at 2240px
  - 8 at 2560px (`xxl`), permanently capped at eight
- Document the slot and automation contracts: Fragment flattening, one item per meaningful VNode, key preservation/fallback, comment/null/text skip, and `automationId` on the root.
- Add a consumer migration note (visual/API impact, released as patch `0.5.3` per early-dev maintainer decision):
  - existing `CardGrid` consumers automatically receive CSS Grid and equal-height expanded cards;
  - `cols`, `sm`, `md`, `lg`, and `xl` props are removed;
  - consumers control available page/container width rather than column props;
  - consumers relying on intrinsic-height expanded cards must adjust their design or avoid `CardGrid`.
- Link the dashboard demo and explain how to verify 5–8 columns at wide viewport sizes.
- Note that other in-repo demo consumers such as `/demo/editors` also inherit the new fixed `CardGrid` layout after the removed breakpoint props are deleted.
- Keep documentation domain-independent and exclude Paths-specific content, routes, statuses, API behavior, and automation IDs.
- Ensure the harvesting workflow accurately describes this layout harvest and the required order: shared implementation/tests, demo/docs, version/release, then downstream adoption and local-prototype deletion.

## Testing Expectations

Run all commands from this repository root.

- Manually compare README claims with `CardGrid.vue`, `MhCard.vue`, unit tests, and the dashboard.
- Confirm no README example passes removed breakpoint props.
- Confirm no Paths/journey-specific behavior was added.
- `npm run test`
- `npm run build`

## Outputs

- `README.md`

The agent must not edit component implementation, tests, demo/Cypress files, package versions, publishing workflows, or any journey SPA in this task.

## Execution Notes


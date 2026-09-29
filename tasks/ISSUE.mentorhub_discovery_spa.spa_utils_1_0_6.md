Please create @_PLANNING.md tasks to implement this issue. Only create tasks;
do not execute tasks or edit files outside the @tasks folder.

Target repository: **`mentorhub_discovery_spa` only**.

This is the **first** `mentorhub_discovery_spa` issue for the spa_utils **1.0.6** wave. It **owns this repo’s `@mentor-forge/mentorhub_spa_utils@1.0.6` pin bump**.

# Pin spa_utils 1.0.6 — CardGrid removal, DataCardGrid, MarkdownEditor (Discovery SPA)

## Summary

Pin `@mentor-forge/mentorhub_spa_utils@1.0.6`. Package `CardGrid` is **removed** — stop importing it. Keep Discovery’s **local** list card grid for collection dashboards; do not move that grid into spa_utils. Adopt package `DataCardGrid` only for multi-card view/edit layouts (if any). Pick up the rendered resting-view `MarkdownEditor` (same import and props; `marked` / `dompurify` stay bundled in the package).

## Prerequisite

- `mentorhub_spa_utils` F050–F056 shipped and **`@mentor-forge/mentorhub_spa_utils@1.0.6`** published to CodeArtifact.

## Planning prompts (for `mentorhub_discovery_spa` `tasks/_PLANNING.md`)

- Pin `@mentor-forge/mentorhub_spa_utils` to **`1.0.6`** in `package.json` / lockfile; run `npm install --include=dev` after CodeArtifact auth (`mh`). This issue owns the bump.
- Delete any import of `CardGrid` from `@mentor-forge/mentorhub_spa_utils` — that export no longer exists.
- **Keep** Discovery’s local list card grid for home, members, resources, paths, plans, products, notifications, events (and similar). Do **not** import a list `CardGrid` from spa_utils, and do **not** push that list grid back into spa_utils.
- Use package `DataCardGrid` only for multi-card view/edit pages that need the fixed 1 / 2 / 4 column layout. Root class `data-card-grid`, hardcoded `data-automation-id="data-card-grid"`, no props. Not a Fragment/`v-for` flattener; not a list-dashboard component.
- `MarkdownEditor` keeps the same import and props (`field`, `modelValue`, `onSave`, `editable`, `visible`, `automationId`, `label`, `hint`, `rules`, `rows`). Resting view is sanitized rendered markdown. Editable fields enter the textarea on click or Enter; textarea automation id is `${automationId}-input`.
- Do **not** add `marked` or `dompurify` as SPA dependencies — they are bundled in spa_utils.
- Cypress: specs that typed into a markdown textarea without opening edit mode must activate the display first (`click` or `Enter` on the display), then type into `${automationId}-input`.

## Notes

- List card dashboards stay on Discovery only. Sibling SPAs must not reintroduce package `CardGrid` or new list dashboards.
- See spa_utils README **MhCard / DataCard / DataCardGrid** and **Type-aligned editors** (`markdown` / `MarkdownEditor`) for the shipped 1.0.6 API.

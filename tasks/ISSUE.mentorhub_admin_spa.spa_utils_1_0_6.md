Please create @_PLANNING.md tasks to implement this issue. Only create tasks;
do not execute tasks or edit files outside the @tasks folder.

Target repository: **`mentorhub_admin_spa` only**.

This is the **first** `mentorhub_admin_spa` issue for the spa_utils **1.0.6** wave. It **owns this repo’s `@mentor-forge/mentorhub_spa_utils@1.0.6` pin bump**.

# Pin spa_utils 1.0.6 — CardGrid removal, DataCardGrid, MarkdownEditor (Admin SPA)

## Summary

Pin `@mentor-forge/mentorhub_spa_utils@1.0.6`. Package `CardGrid` is **removed** — delete any spa_utils `CardGrid` import/layout. Do **not** reintroduce list card dashboards (collections stay on Discovery). Use `DataCard` / `DataCardGrid` for multi-card edit and detail pages. Pick up the rendered resting-view `MarkdownEditor` (same import and props; consumers do not install `marked` / `dompurify`).

## Prerequisite

- `mentorhub_spa_utils` F050–F056 shipped and **`@mentor-forge/mentorhub_spa_utils@1.0.6`** published to CodeArtifact.

## Planning prompts (for `mentorhub_admin_spa` `tasks/_PLANNING.md`)

- Pin `@mentor-forge/mentorhub_spa_utils` to **`1.0.6`** in `package.json` / lockfile; run `npm install --include=dev` after CodeArtifact auth (`mh`). This issue owns the bump.
- Delete any import of `CardGrid` from `@mentor-forge/mentorhub_spa_utils` — that export no longer exists. Remove layout that depended on it.
- Do **not** reintroduce list card dashboards; collections live on Discovery.
- Where pages need several edit/detail cards, adopt package `DataCardGrid` + `DataCard`. Root class `data-card-grid`, hardcoded `data-automation-id="data-card-grid"`, no props. Fixed columns: 1 below 641px, 2 from 641px, 4 from 1920px. Not a Fragment flattener; not a list-dashboard component.
- `MarkdownEditor` keeps the same import and props (`field`, `modelValue`, `onSave`, `editable`, `visible`, `automationId`, `label`, `hint`, `rules`, `rows`). Resting view is sanitized rendered markdown. Editable fields enter the textarea on click or Enter; textarea automation id is `${automationId}-input`.
- Do **not** add `marked` or `dompurify` as SPA dependencies — they are bundled in spa_utils.
- Cypress: specs that typed into a markdown textarea without opening edit mode must activate the display first, then type into `${automationId}-input`.

## Notes

- Admin remains settings / hosting / detail flows; Discovery owns list collections (including products-style catalogs).
- See spa_utils README **MhCard / DataCard / DataCardGrid** and **Type-aligned editors** (`markdown` / `MarkdownEditor`) for the shipped 1.0.6 API.

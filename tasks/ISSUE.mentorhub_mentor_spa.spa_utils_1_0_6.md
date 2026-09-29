Please create @_PLANNING.md tasks to implement this issue. Only create tasks;
do not execute tasks or edit files outside the @tasks folder.

Target repository: **`mentorhub_mentor_spa` only**.

This is the **first** `mentorhub_mentor_spa` issue for the spa_utils **1.0.6** wave. It **owns this repo’s `@mentor-forge/mentorhub_spa_utils@1.0.6` pin bump**.

# Pin spa_utils 1.0.6 — CardGrid removal, harvest DataCardGrid and MarkdownEditor (Mentor SPA)

## Summary

Pin `@mentor-forge/mentorhub_spa_utils@1.0.6`. Package `CardGrid` is **removed** — delete any spa_utils `CardGrid` import/layout. Do **not** reintroduce list card dashboards (collections stay on Discovery). After the pin, import package `DataCardGrid` and `MarkdownEditor` and **delete the SPA-local copies** of those two components so there is one implementation. Detail/edit pages keep working through the existing editor props; rendered markdown arrives with the bump.

## Prerequisite

- `mentorhub_spa_utils` F050–F056 shipped and **`@mentor-forge/mentorhub_spa_utils@1.0.6`** published to CodeArtifact.

## Planning prompts (for `mentorhub_mentor_spa` `tasks/_PLANNING.md`)

- Pin `@mentor-forge/mentorhub_spa_utils` to **`1.0.6`** in `package.json` / lockfile; run `npm install --include=dev` after CodeArtifact auth (`mh`). This issue owns the bump.
- Delete any import of `CardGrid` from `@mentor-forge/mentorhub_spa_utils` — that export no longer exists. Remove layout that depended on it.
- Do **not** reintroduce list card dashboards; collections live on Discovery.
- Switch imports of `DataCardGrid` and `MarkdownEditor` to `@mentor-forge/mentorhub_spa_utils`, then **delete** the SPA-local `DataCardGrid` and `MarkdownEditor` component files (and any local re-exports / demo wiring that duplicated them).
- Package `DataCardGrid`: class `data-card-grid`, hardcoded `data-automation-id="data-card-grid"`, no props. Fixed columns: 1 below 641px, 2 from 641px, 4 from 1920px. For multi-card view/edit only — not a Fragment flattener, not a list dashboard.
- Package `MarkdownEditor` keeps the same import path and props (`field`, `modelValue`, `onSave`, `editable`, `visible`, `automationId`, `label`, `hint`, `rules`, `rows`). Resting view is sanitized rendered markdown. Editable fields enter the textarea on click or Enter; textarea automation id is `${automationId}-input`.
- Do **not** add `marked` or `dompurify` as SPA dependencies — they are bundled in spa_utils. Remove local installs of those packages if they existed only for the SPA-local editor.
- Cypress: specs that typed into a markdown textarea without opening edit mode must activate the display first, then type into `${automationId}-input`. Update selectors that targeted deleted local components.

## Notes

- Mentor keeps detail/edit/create for resources, paths, plans, and encounters; Discovery owns list collections.
- Harvest goal: one shared `DataCardGrid` and `MarkdownEditor` implementation in spa_utils — no parallel local copies after this issue.
- See spa_utils README **MhCard / DataCard / DataCardGrid** and **Type-aligned editors** (`markdown` / `MarkdownEditor`) for the shipped 1.0.6 API.

# Adopt spa_utils 0.5.0 cards and type-aligned editors (Mentee SPA)

## Summary
Bump `@mentor-forge/mentorhub_spa_utils` to **0.5.0** and adopt `MhCard` / `CardGrid` / `DataCard` plus configurator-type editors for list and view/edit pages in `mentorhub_mentee_spa`.

## Prerequisite
- `mentorhub_spa_utils` F015–F024 shipped and **`0.5.0` published** to CodeArtifact.

## Planning prompts (for `mentorhub_mentee_spa` `tasks/_PLANNING.md`)
- Bump dependency to `@mentor-forge/mentorhub_spa_utils@0.5.0`; run CodeArtifact `mh` + `npm install` / `npm ci`.
- Convert list UIs to `CardGrid` (defaults `cols=12 sm=6 md=4 lg=3`) + `MhCard` with title-bar actions.
- Convert view/edit forms to `DataCard` (`model`, `nameField`, `onSave`) + typed editors (`field`, `editable`, `visible`, `automationId`).
- Prefer typed editors over new `AutoSaveField` usage; existing `AutoSaveField` remains supported (compatibility wrapper). Keep `AutoSaveSelect` / local selects — no enum editor in 0.5.0.
- Use structured `DurationEditor` / `DateTimeEditor` where those types appear (do not ask users to type ISO wire formats).
- Align Cypress to stable `data-automation-id`s; remove duplicate local card chrome where spa_utils replaces it.

## Notes
Adoption is **additive** — no forced rename of `AutoSaveField`.

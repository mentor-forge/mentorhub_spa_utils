# Adopt spa_utils 0.5.2 cards and type-aligned editors (Mentee SPA)

## Summary
Bump `@mentor-forge/mentorhub_spa_utils` to **0.5.2** and adopt `MhCard` / `CardGrid` / `DataCard` plus configurator-type editors, including the runtime-configured `EnumEditor` and tag-style `EnumArrayEditor`, for list and view/edit pages in `mentorhub_mentee_spa`.

## Prerequisite
- `mentorhub_spa_utils` F015–F028 shipped and **`0.5.2` published** to CodeArtifact.

## Planning prompts (for `mentorhub_mentee_spa` `tasks/_PLANNING.md`)
- Bump dependency to `@mentor-forge/mentorhub_spa_utils@0.5.2`; run CodeArtifact `mh` + `npm install` / `npm ci`.
- Convert list UIs to `CardGrid` (defaults `cols=12 sm=6 md=4 lg=3`) + `MhCard` with title-bar actions.
- Convert view/edit forms to `DataCard` (`model`, `nameField`, `onSave`) + typed editors (`field`, `editable`, `visible`, `automationId`).
- Load `/api/config` once at application startup and provide its reactive runtime config to the typed-editor context; do not fetch config from individual fields.
- Replace configurator `enum` fields with `EnumEditor` and pass their case-sensitive `enums` reference so allowed values and labels resolve from `/api/config.enumerators`.
- Replace configurator `enum_array` fields with `EnumArrayEditor`; use its constrained autocomplete and removable in-input pills while persisting ordered string arrays.
- Do not hard-code enumerator options or derive them from OpenAPI. Handle loading, missing config, and unknown enumerator names without inventing values.
- Prefer typed editors over new `AutoSaveField` / `AutoSaveSelect` usage. Existing legacy components and exports remain supported during migration.
- Use structured `DurationEditor` / `DateTimeEditor` where those types appear (do not ask users to type ISO wire formats).
- Align Vitest and Cypress coverage to stable `data-automation-id`s, including enum selection and EnumArray autocomplete/add/remove/save workflows; remove duplicate local controls and card chrome where spa_utils replaces them.

## Notes
Adoption is **additive**. Do not remove working legacy controls until their pages migrate and replacement behavior is covered.

# F055 – Downstream ISSUE seeds for CardGrid removal and editor harvest

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F054  
**Description**: Author paste-ready ISSUE files so each journey SPA can plan the **1.0.6** patch: stop importing `CardGrid`, and pick up `DataCardGrid` plus the rendered `MarkdownEditor` from this package.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `package.json`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md` — do **not** edit sibling SPA repos; do **not** read them for context
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F025.generate_downstream_spa_issue_md.md` — ISSUE seed pattern
- `tasks/SHIPPED.F039.downstream_page_frame_issues.md` — five-SPA seed set
- `README.md` — card and markdown docs after F053 and F054
- GitHub: [issue #33](https://github.com/mentor-forge/mentorhub_spa_utils/issues/33), [issue #41](https://github.com/mentor-forge/mentorhub_spa_utils/issues/41)

**Downstream SPA targets (markdown only; no commits outside this repo):**

- `mentorhub_discovery_spa`
- `mentorhub_customer_spa`
- `mentorhub_admin_spa`
- `mentorhub_mentor_spa`
- `mentorhub_mentee_spa`

Do **not** include coordinator. Do **not** open GitHub issues in this task.

**External prerequisite to state in every ISSUE:** spa_utils F050–F056 shipped and `@mentor-forge/mentorhub_spa_utils@1.0.6` published to CodeArtifact. F056 performs the patch bump after these seeds are written; the seeds still name **1.0.6**.

## Goals

Create one brief file per SPA:

- `tasks/ISSUE.mentorhub_discovery_spa.spa_utils_1_0_6.md`
- `tasks/ISSUE.mentorhub_customer_spa.spa_utils_1_0_6.md`
- `tasks/ISSUE.mentorhub_admin_spa.spa_utils_1_0_6.md`
- `tasks/ISSUE.mentorhub_mentor_spa.spa_utils_1_0_6.md`
- `tasks/ISSUE.mentorhub_mentee_spa.spa_utils_1_0_6.md`

Each file is paste-ready: title line, short summary, bullets for that SPA’s `_PLANNING.md`.

### All five SPAs

- Pin `@mentor-forge/mentorhub_spa_utils` to **1.0.6**. This SPA owns that pin if it is the first **1.0.6** issue for the repo; say so.
- `CardGrid` is **removed** from the package. Delete any import of `CardGrid` from `@mentor-forge/mentorhub_spa_utils`.
- `MarkdownEditor` keeps the same import and props (`field`, `modelValue`, `onSave`, `editable`, `visible`, `automationId`, `label`, `hint`, `rules`, `rows`). Resting view is sanitized rendered markdown. Editable fields enter the textarea on click or Enter; the textarea automation id is `${automationId}-input`. Cypress that typed into a markdown textarea without opening edit mode must activate the display first.
- Consumers do not install `marked` or `dompurify` themselves.
- Adopt `DataCardGrid` for multi-card view/edit pages that need 1 / 2 / 4 columns. Root automation id is `data-card-grid`. It is not a list-dashboard component and it does not flatten `v-for` Fragments.

### Discovery only

- Keep Discovery's **local** list card grid. Do not import list `CardGrid` from spa_utils, and do not move that list grid back into spa_utils.
- List pages stay on Discovery. `DataCardGrid` is only for multi-card edit/view layouts inside this SPA, if any.

### Customer, Admin, Mentee

- Do not reintroduce list card dashboards. Collections stay on Discovery.
- Where a page still imports `CardGrid` from spa_utils, remove that layout. Use `DataCard` / `DataCardGrid` for edit and detail cards.

### Mentor

- Same CardGrid removal and editor bump as the other non-Discovery SPAs.
- After the pin, import `DataCardGrid` and `MarkdownEditor` from spa_utils and delete the SPA-local copies of those two components so there is one implementation.
- Detail/edit pages keep working through the existing editor props; the new markdown behavior arrives with the bump.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Manual review: five files, all pin **1.0.6**, all say `CardGrid` is gone from this package, all describe the `MarkdownEditor` bump and `DataCardGrid`.
- Discovery keeps its local list grid. Mentor deletes local `DataCardGrid` and `MarkdownEditor` after switching imports. The other three do not reintroduce list dashboards.
- No code/test run required.

## Outputs

- `tasks/ISSUE.mentorhub_discovery_spa.spa_utils_1_0_6.md`
- `tasks/ISSUE.mentorhub_customer_spa.spa_utils_1_0_6.md`
- `tasks/ISSUE.mentorhub_admin_spa.spa_utils_1_0_6.md`
- `tasks/ISSUE.mentorhub_mentor_spa.spa_utils_1_0_6.md`
- `tasks/ISSUE.mentorhub_mentee_spa.spa_utils_1_0_6.md`

The agent must not update files outside this list.

## Execution Notes

### Plan

1. Follow F025/F039 ISSUE seed pattern (H1 title, Summary, Prerequisite, Planning prompts, Notes) from F055 goals and README DataCardGrid / MarkdownEditor docs — no sibling SPA repo reads.
2. Author five paste-ready `tasks/ISSUE.*.spa_utils_1_0_6.md` files: all pin **1.0.6** and own that bump; CardGrid gone from package; MarkdownEditor rendered resting view + `${automationId}-input`; DataCardGrid for multi-card edit/view only.
3. Differentiate: Discovery keeps local list grid; Mentor deletes local DataCardGrid/MarkdownEditor after switching imports; Customer/Admin/Mentee do not reintroduce list dashboards.
4. Manual review only; leave Status Pending and filename unchanged for orchestrator.

### Results

- Created five ISSUE seeds (Discovery / Customer / Admin / Mentor / Mentee), each pinning **1.0.6**, stating CardGrid is removed from spa_utils, describing DataCardGrid and the MarkdownEditor bump, and naming F050–F056 + CodeArtifact publish as prerequisite.
- Manual review passed: Discovery keeps its local list grid; Mentor deletes local DataCardGrid/MarkdownEditor after switching imports; Customer/Admin/Mentee do not reintroduce list dashboards.
- No code or test run (per task). No sibling repos modified.

**Orchestrator confirmation:** Five ISSUE files present. All pin **1.0.6**. Discovery keeps its local list grid. Mentor deletes local `DataCardGrid` and `MarkdownEditor` after the import switch. Customer, Admin, and Mentee do not reintroduce list dashboards.

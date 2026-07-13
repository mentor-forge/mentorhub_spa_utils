# F025 – Generate downstream SPA ISSUE.md planning seeds

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F024  
**Description**: Create concise `ISSUE.md` files under `tasks/` with copy suitable for opening issues in each journey `*_spa` repo. Those issues will feed `_PLANNING.md` work in the respective SPAs to adopt spa_utils Card/DataCard/type editors after `0.5.0` publishes.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `package.json`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md` — external repository boundaries (do **not** edit sibling SPA repos)
- `tasks/_ORCHESTRATE.md`
- `README.md` — final Card/DataCard/editor docs from F023
- `package.json` — published target version from F024 (`0.5.0`)
- `tasks/SHIPPED.F015.peer_review_card_editor_approach.md` — adoption notes (additive API; AutoSaveField compatibility)

**Downstream SPA targets (issue text only; no commits outside this repo):**

- `mentorhub_mentor_spa`
- `mentorhub_mentee_spa`
- `mentorhub_customer_spa`
- `mentorhub_coordinator_spa`

## Goals

- Create one brief ISSUE file per SPA under `tasks/`, named so the target repo is obvious, e.g.:
  - `tasks/ISSUE.mentorhub_mentor_spa.adopt_cards_and_type_editors.md`
  - `tasks/ISSUE.mentorhub_mentee_spa.adopt_cards_and_type_editors.md`
  - `tasks/ISSUE.mentorhub_customer_spa.adopt_cards_and_type_editors.md`
  - `tasks/ISSUE.mentorhub_coordinator_spa.adopt_cards_and_type_editors.md`
- Each file is **brief and concise** paste-ready issue body text including:
  - Title line
  - Short summary (adopt `@mentor-forge/mentorhub_spa_utils@0.5.0` MhCard / CardGrid / DataCard / type editors)
  - Bulleted planning prompts for that SPA’s `_PLANNING.md` (bump dependency; list pages → CardGrid with default breakpoints; edit/view pages → DataCard + typed editors with `field`/`editable`/`automationId`; prefer typed editors over `AutoSaveField` but keep existing AutoSaveField usage working; Cypress automation ids; remove duplicate local card chrome)
  - Note: `AutoSaveSelect` / generic enum editor not in this package wave — keep local select patterns where needed
  - Explicit **external prerequisite**: spa_utils F015–F024 shipped and package `0.5.0` published to CodeArtifact
  - Call out that adoption is **additive** (no forced AutoSaveField rename)
- Do **not** open GitHub issues from this task; only author the markdown seeds.
- Do **not** modify files in sibling `*_spa` repositories.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Manual review: each ISSUE file is concise, repo-specific enough to feed planning, and references package version `0.5.0`.
- No code/test run required unless incidental README touches occur (should not).

## Outputs

- `tasks/ISSUE.mentorhub_mentor_spa.adopt_cards_and_type_editors.md`
- `tasks/ISSUE.mentorhub_mentee_spa.adopt_cards_and_type_editors.md`
- `tasks/ISSUE.mentorhub_customer_spa.adopt_cards_and_type_editors.md`
- `tasks/ISSUE.mentorhub_coordinator_spa.adopt_cards_and_type_editors.md`

The agent must not update files outside this list.

## Execution Notes

### Results
- Created ISSUE.md seeds for mentor, mentee, customer, and coordinator SPAs targeting spa_utils **0.5.0**.
- No sibling SPA repos were modified.

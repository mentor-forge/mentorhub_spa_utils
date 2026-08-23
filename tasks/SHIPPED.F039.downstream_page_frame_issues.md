# F039 – Downstream ISSUE.md seeds for PageFrame and list-page removal

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F038  
**Description**: Author paste-ready `ISSUE.md` files under `tasks/` so each journey SPA can plan adoption of spa_utils `PageFrame` @ **1.0.0** and so non-Discovery SPAs remove local list-card pages (Discovery remains the only list CardGrid).

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `package.json`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `../mentorhub/tasks/SHIPPED.L022.welcome_nginx_journey_proxy.md` — `/{journey}/` on welcome **:8080**
- `tasks/_PLANNING.md` — do **not** edit sibling SPA repos; do **not** read them for context
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F025.generate_downstream_spa_issue_md.md` — ISSUE seed pattern
- `README.md` — PageFrame / `buildJourneyUrl` docs from F038

**Downstream SPA targets (markdown only; no commits outside this repo):**

- `mentorhub_discovery_spa`
- `mentorhub_customer_spa`
- `mentorhub_admin_spa`
- `mentorhub_mentor_spa`
- `mentorhub_mentee_spa`

Do **not** include coordinator. Do **not** open GitHub issues in this task.

**External prerequisite to state in every ISSUE:** spa_utils F033–F040 shipped and `@mentor-forge/mentorhub_spa_utils@1.0.0` published to CodeArtifact; Vue `base` + SPA nginx prefix (`/{journey}/`) already planned or shipped per mentorhub L022.

## Goals

Create one brief file per SPA:

- `tasks/ISSUE.mentorhub_discovery_spa.adopt_page_frame.md`
- `tasks/ISSUE.mentorhub_customer_spa.adopt_page_frame_remove_lists.md`
- `tasks/ISSUE.mentorhub_admin_spa.adopt_page_frame_remove_lists.md`
- `tasks/ISSUE.mentorhub_mentor_spa.adopt_page_frame_remove_lists.md`
- `tasks/ISSUE.mentorhub_mentee_spa.adopt_page_frame_remove_lists.md`

Each file is paste-ready: title line, short summary, bullets for that SPA’s `_PLANNING.md`.

### All five SPAs

- Pin `@mentor-forge/mentorhub_spa_utils` to **1.0.0**.
- Replace local app-bar / hamburger / logout chrome with imported `PageFrame`; `pageTitle` + default slot only.
- **Do not** pass nav items, ALB URLs, or role tables locally.
- Remove duplicate local nav that duplicates the universal catalog.
- Keep IdP bootstrap / `redirectToIdpLogin` as today.
- Cypress: hamburger automation ids from spa_utils; drop SPA-local drawer selectors where replaced.

### Discovery only (`mentorhub_discovery_spa`)

- **Keep** list CardGrid pages (home, members, resources, paths, plans, products, notifications as they exist or will exist). Discovery is the **only** list-card interface.
- Wire card and in-page deep links with `buildJourneyUrl` / F035 helpers so detail views open the owning SPA through welcome/ALB prefixes (not debug ports).
- Align in-app routes with the F035 locked paths (`/`, `members/`, `resources`, `paths`, `plans`, `products`, `notifications` under Vue base `/discovery/`).

### Customer, Admin, Mentor, Mentee

- **Remove existing list-card / CardGrid list pages** (and their routes, Cypress, nav entries). Users find collections on Discovery; this SPA keeps **detail / edit / create** pages that Discovery cards and universal nav target.
- Customer: keep **CustomerEditPage** at journey root `/customer/` and **profile** at `/customer/profile/`; remove org/member/resource-style list dashboards that duplicate Discovery.
- Admin: keep **Settings** at `/admin/settings`; remove list-card catalog pages that duplicate Discovery Products (and similar).
- Mentor: keep detail/edit for resources, paths, plans, encounters; remove list pages now hosted on Discovery (`/discovery/resources`, `/paths`, `/plans`).
- Mentee: keep journey/rating/note **detail** pages for Discovery card targets; remove list-card home/dashboard pages.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Manual review: five files, Discovery keeps lists, the other four remove lists, all pin **1.0.0** and forbid local nav config.
- No code/test run required.

## Outputs

- `tasks/ISSUE.mentorhub_discovery_spa.adopt_page_frame.md`
- `tasks/ISSUE.mentorhub_customer_spa.adopt_page_frame_remove_lists.md`
- `tasks/ISSUE.mentorhub_admin_spa.adopt_page_frame_remove_lists.md`
- `tasks/ISSUE.mentorhub_mentor_spa.adopt_page_frame_remove_lists.md`
- `tasks/ISSUE.mentorhub_mentee_spa.adopt_page_frame_remove_lists.md`

The agent must not update files outside this list.

## Execution Notes

### Plan

1. Follow F025 ISSUE seed pattern (H1 title, Summary, Prerequisite, Planning prompts, Notes) using F039 task goals and README/F035/F036 PageFrame docs — no sibling SPA repo reads.
2. Author five paste-ready files under `tasks/ISSUE.*`: Discovery keeps CardGrid lists + `buildJourneyUrl` wiring; Customer/Admin/Mentor/Mentee remove list-card pages and adopt `PageFrame` only (`pageTitle` + slot; no local nav).
3. Manual review: all five pin **1.0.0**, forbid local nav config, external prerequisite (F033–F040 + L022) in every file.

### Results

- Created five ISSUE seeds (Discovery adopt PageFrame + keep lists; four SPAs adopt PageFrame + remove lists).
- All files pin `@mentor-forge/mentorhub_spa_utils` **1.0.0**, forbid local nav/ALB/role props, and state F033–F040 + L022 external prerequisite.
- Manual review passed: Discovery retains CardGrid list pages and `buildJourneyUrl` guidance; Customer/Admin/Mentor/Mentee each document list-page removal and retained detail/edit routes.
- No code or test run (per task). No sibling repos modified. Changes left uncommitted for orchestrator.

**Orchestrator confirmation:** Manual review — five ISSUE files present; Discovery keeps lists + `buildJourneyUrl`; Customer/Admin/Mentor/Mentee remove lists; all pin **1.0.0** and forbid local nav config.

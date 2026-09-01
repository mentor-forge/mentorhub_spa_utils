# F045 – Downstream ISSUE seeds for `/config` and Events

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F044  
**Description**: Author paste-ready `ISSUE.md` files under `tasks/` so each journey SPA can plan a `/prefix/config` AdminPage route (and Discovery `/discovery/events`) after spa_utils **1.0.1** publishes.

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
- `tasks/SHIPPED.F039.downstream_page_frame_issues.md` — ISSUE seed pattern
- `tasks/SHIPPED.F025.generate_downstream_spa_issue_md.md`
- `README.md` — PageFrame catalog after F044
- `package.json` — current version **1.0.0**; planned patch **1.0.1** (F046)

**Downstream SPA targets (markdown only; no commits outside this repo):**

- `mentorhub_discovery_spa`
- `mentorhub_customer_spa`
- `mentorhub_admin_spa`
- `mentorhub_mentor_spa`
- `mentorhub_mentee_spa`

Do **not** include coordinator. Do **not** open GitHub issues in this task.

**External prerequisite to state in every ISSUE:** spa_utils F041–F046 shipped and `@mentor-forge/mentorhub_spa_utils@1.0.1` published to CodeArtifact; Vue `base` + SPA nginx prefix (`/{journey}/`) already planned or shipped per mentorhub L022.

## Goals

Create one brief file per SPA:

- `tasks/ISSUE.mentorhub_discovery_spa.config_route_and_events.md`
- `tasks/ISSUE.mentorhub_customer_spa.config_route.md`
- `tasks/ISSUE.mentorhub_admin_spa.config_route.md`
- `tasks/ISSUE.mentorhub_mentor_spa.config_route.md`
- `tasks/ISSUE.mentorhub_mentee_spa.config_route.md`

Each file is paste-ready: title line, short summary, bullets for that SPA’s `_PLANNING.md`.

### All five SPAs

- Pin `@mentor-forge/mentorhub_spa_utils` to **1.0.1** (catalog, logout `return_to=/discovery/`, Settings → hosting `/config`, Token claims).
- Add a Vue route for the packaged **`AdminPage`** at **`/{journey}/config`** (Vue `path: '/config'` under existing journey `base`).
- Do **not** pass nav items, ALB URLs, or role tables into `PageFrame`; Settings is already in the compiled catalog and must land in **this** SPA.
- Cypress: `nav-settings-link` is **admin-only** and opens this SPA’s `/config` page; Token tab `profile_id` / `customer_id` / `mentor_id`; hamburger no longer has Products / Customer / Customer Members; Notifications and Settings only for `admin`. Gate `/{journey}/config` with the admin role (non-admins redirected away).
- Keep IdP bootstrap; logout `return_to` is owned by spa_utils (`/discovery/`).

### Discovery only (`mentorhub_discovery_spa`)

- Add an **Events** surface at `/discovery/events` (CardGrid/list consistent with other Discovery collections) so `nav-events-link` is not a dead ALB path.
- Config route `/discovery/config` in addition to existing list pages.

### Admin (`mentorhub_admin_spa`)

- Config lives at `/admin/config`. `/admin/settings` may remain as a detail page but is **not** the Settings hamburger target after 1.0.1 (`nav-settings-link` → `/admin/config`).

### Customer, Mentor, Mentee

- Config route only (plus existing detail/edit pages). Do not restore Products / Customer / Members drawer rows locally.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Manual review: five files, all pin **1.0.1**, all require `/{journey}/config`, Discovery also requires `/discovery/events`, none instruct local nav config.
- No code/test run required.

## Outputs

- `tasks/ISSUE.mentorhub_discovery_spa.config_route_and_events.md`
- `tasks/ISSUE.mentorhub_customer_spa.config_route.md`
- `tasks/ISSUE.mentorhub_admin_spa.config_route.md`
- `tasks/ISSUE.mentorhub_mentor_spa.config_route.md`
- `tasks/ISSUE.mentorhub_mentee_spa.config_route.md`

The agent must not update files outside this list.

## Execution Notes

### Plan

1. Follow F039 ISSUE seed pattern (opening `_PLANNING.md` prompt, H1 title, Summary, Prerequisite, planning bullets, Notes) using F045 goals and README F041–F044 catalog / logout / hosting `/config` / Token docs — no sibling SPA repo reads, no invented GitHub issue numbers or URLs.
2. Author five paste-ready files under `tasks/ISSUE.*`: all pin **1.0.1** and add packaged `AdminPage` at `/{journey}/config` (`path: '/config'`); Discovery also adds Events at `/discovery/events`; Admin hamburger Settings → `/admin/config`; Customer/Mentor/Mentee config-only, no local Products/Customer/Members rows.
3. Manual review: all five pin **1.0.1**, require `/{journey}/config`, Discovery requires `/discovery/events`, none instruct local nav config; external prerequisite (F041–F046 + L022) in every file.

### Results

- Created five ISSUE seeds (Discovery config + Events; Admin Settings hamburger → `/admin/config`; Customer/Mentor/Mentee config-only).
- All files pin `@mentor-forge/mentorhub_spa_utils` **1.0.1**, forbid local nav/ALB/role props, and state F041–F046 + L022 external prerequisite. No GitHub issue numbers or URLs.
- Manual review passed: all five require `/{journey}/config` and admin-gated Cypress; Discovery also requires `/discovery/events`; Admin keeps `/admin/settings` as a non-hamburger detail page; none instruct local nav config or restore Products/Customer/Members drawer rows.
- No code or test run (per task). No sibling repos modified. Changes left uncommitted for orchestrator.

**Orchestrator confirmation:** Manual review of all five ISSUE files: each pins **1.0.1**, requires `/{journey}/config`, forbids local nav config, and states F041–F046 + L022. Discovery also requires `/discovery/events`. Admin hamburger Settings targets `/admin/config`.

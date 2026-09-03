# F048 – Document and verify display_name in demo/Cypress

**Status**: Pending  
**Type**: Feature  
**Depends On**: F047  
**Description**: Update package documentation and browser coverage so the new `display_name` behavior is verified at the demo/app-shell level.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `demo/...`, `cypress/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md` — Universal PageFrame and Admin config sections currently describe `picture`, `profile_id`, `customer_id`, and `mentor_id`
- `demo/App.vue`
- `demo/router.ts`
- `demo/pages/AdminPage.vue`
- `cypress/e2e/navigation.cy.ts`
- `cypress/e2e/pages/admin.cy.ts`
- `cypress/e2e/pages/admin-app.cy.ts`
- `cypress/support/commands.ts`
- `tasks/PENDING.F047.profile_display_name_claims.md` (or `SHIPPED.F047.*` at execution)

GitHub: [issue #36](https://github.com/mentor-forge/mentorhub_spa_utils/issues/36)

Live environments may not yet emit `display_name`; Cypress is allowed to stub/intercept config or token data so browser assertions stay deterministic while upstream token producers catch up.

## Goals

- Update README documentation so `PageFrame` explicitly documents that authenticated chrome shows `display_name` next to the profile avatar when the JWT claim is present.
- Update README Token/Admin docs so the Config Token tab documents `display_name`, `profile_id`, `customer_id`, `mentor_id`, IP Address, and Roles with the correct automation ids for read-only displays.
- Add Cypress coverage proving an authenticated admin session can see the rendered profile name in the top bar when `display_name` is present in the token fixture/stub.
- Add Cypress coverage proving the Config Token tab shows `display_name` in addition to the existing id claims.
- Preserve and re-assert the existing navigation/config-route behavior from the 1.0.1 wave; this task should extend those assertions rather than weaken them.
- If the demo/admin specs use token fixtures or `/api/config` intercepts, update them so `display_name` is included consistently.

### Craftsmanship Expectations

- Prefer extending existing Cypress specs/helpers instead of creating redundant parallel suites.
- Keep browser assertions focused on user-visible behavior and stable automation ids, not Vuetify-generated markup.
- Do not introduce demo-only logic for `display_name`; the demo should exercise the packaged implementation from F047.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- `npm run test`
- `npm run build`
- `npm run dev` when Cypress needs the demo app
- `npx cypress run --spec cypress/e2e/navigation.cy.ts,cypress/e2e/pages/admin.cy.ts,cypress/e2e/pages/admin-app.cy.ts`
- Record whether any assertions rely on intercepted token/config data because live Developer Edition tokens do not yet include `display_name`.

## Outputs

- `README.md`
- `cypress/e2e/navigation.cy.ts`
- `cypress/e2e/pages/admin.cy.ts`
- `cypress/e2e/pages/admin-app.cy.ts`
- `cypress/support/commands.ts`

The agent must not update files outside this list.

## Execution Notes


# F048 – Document and verify display_name in demo/Cypress

**Status**: Shipped  
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

**Plan**
- README: document PageFrame `display_name` next to the avatar (`nav-profile-name-display`, omitted when blank/missing) and Token tab fields (`display_name`, `profile_id`, `customer_id`, `mentor_id`, IP Address, Roles) with existing automation ids.
- Cypress: extend existing specs/helpers only. Live DE / `signCypressJwt` tokens still omit `display_name`, so stub it — patch the stored JWT payload for chrome (`readDisplayName` decodes localStorage, no signature check) and include `display_name` on `/api/config` intercept token fixtures for the Token tab.
- `commands.ts`: add `stubJwtDisplayName` to patch + reload. Navigation: assert admin chrome shows the stubbed name. Admin specs: keep id-claim assertions and add `admin-token-display-name-display`. No demo-only display_name logic.

**Completion**
- README documents PageFrame `display_name` chrome (`nav-profile-name-display`) and Token tab fields with automation ids. IP Address and Roles have no dedicated ids (label / chip group).
- `stubJwtDisplayName` in `commands.ts` patches the Cypress JWT payload and reloads. Navigation asserts compact chrome without the claim and stubbed `Ada Lovelace` inside `nav-profile-link`. Admin `/api/config` intercepts include `display_name`; Token tab asserts the value and missing → `N/A`.
- **Stubs required:** live DE and `signCypressJwt` still omit `display_name`. Chrome tests patch JWT localStorage; Token tab tests intercept `/api/config`.
- `npm run test`: 40 files, 443 passed.
- `npm run build`: succeeded (`@mentor-forge/mentorhub_spa_utils@1.0.2`).
- `npx cypress run --spec cypress/e2e/navigation.cy.ts,cypress/e2e/pages/admin.cy.ts,cypress/e2e/pages/admin-app.cy.ts`: 31 passed (19 + 8 + 4).


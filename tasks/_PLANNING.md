# API Task Automation Framework - Planning

This folder contains coding tasks that an orchestration agent can execute, based on the context and instructions in each task file. This file is a guide for an agent that is helping to plan changes by creating task files to achieve a goal. Create tasks following the [naming conventions](#naming-conventions) and guides below. 

Review **Context** Before creating any task files you should review the following files for context:
- ../mentorhub/DeveloperEdition/standards/spa_standards.md
- ./README.md
- ./tasks/_ORCHESTRATE.md
- ./tasks/_PLANNING.md (this file)

## Task File Layout

Each task file must contain the following sections under H1 and H2 headings.

- Under the top H1 task header:
  - Each task file should declare `Status:` **inside the file**, and also encode the status in the **filename prefix** so tasks are visually grouped in the IDE.
  - **Lifecycle statuses (in‑file)**:
    - `Pending`: Not yet started.
    - `Running`: Work is currently being done in the active session.
    - `Blocked`: Waiting on some external dependency or decision.
    - `Shipped`: Implemented, tested, and committed as per the change control process.
    - `Run as needed`: Not part of the main long‑running sequence; to be run manually or opportunistically.
  - **Filename status prefixes (for grouping)**:
    - `AS_NEEDED.` – Tasks that should **not** be part of the main long‑running sequence.
    - `BLOCKED.` – Tasks currently blocked.
    - `PENDING.` – Tasks that are ready to be picked up when their turn comes.
    - `RUNNING.` – (Optional) Tasks currently being executed in this session.
    - `SHIPPED.` – Tasks that are fully implemented and completed.
  - **Type**: `Feature` | `Defect` to describe why we are running this task
  - **Depends On**: `L010_update_profile_openapi` the required predecessor task **in this repo**, or `none` for parallel tasks
  - **Description**: A brief human description of the task.

- Under a **Path anchoring** H2 header:
  - All paths in task files are relative to **this api_utils repository root** (the directory that contains `Pipfile`).
  - Sibling repos must all be sibling folders under a common parent.
  - Standards: `../mentorhub/DeveloperEdition/standards/api_standards.md`
  - In-repo: `README.md`, `docs/openapi.yaml`, `api_utils/...`, `test/...`, `tasks/...`

- Under a **Context** H2 header:
  - A list of context files. This list should always include:
    - `../mentorhub/DeveloperEdition/standards/sre_standards.md`
    - `tasks/_PLANNING.md` and `tasks/_ORCHESTRATE.md`
    - `README.md`
  - Any other input files for the execution of the task.
  - `AS_NEEDED` tasks may include a **Parameters (edit before running)** subsection here for values to customize before promoting to `Pending`.

- Under a **Goals** H2 header:
  - A list of desired outcomes for the task.
  - Each item should describe the outcome (e.g. "OpenAPI `Profile` schema includes `full_name`").

- Under a **Testing Expectations** H2 header:
  - Can include the creation of new tests for new features.
  - Can include changing existing tests because of modified features.
  - Should always include a description of the tests that should be used to verify completion.
  - In this repo, that typically means some combination of:
    - `cd ../mentorhub_api_utils && pipenv run db && pipenv run dev` to setup backing services
    - `npm install` — refresh dependencies after changes (CodeArtifact auth; run `mh` first if needed)
    = `npm run test` — unit tests (pytest, excludes `@pytest.mark.e2e`)
    - `npm run dev` — run SPA demo server locally (for manual or E2E verification)
    - `npm run cypress:run` — end-to-end tests against a running dev server
  - Should always include the **Packaging verification** step:
    - `npm run build` — compile Python sources
  - All test files should be identified in **Outputs** (below).

- Under an **Outputs** H2 header:
  - A list of the files that will be created/updated/moved/renamed/etc.
  - `file_name.vue` will be updated to support `<Goal>`
  - List all files including new files to be created.
  - The agent will not update files not listed.

- Under an **Execution Notes** H2 header:
  - Reserved for the task execution agent to record plan, commands run, test results, and follow-ups.

## Naming Conventions
- **Recommended filename pattern** for new tasks:
  - `STATUS.LNNN.short_task_name.md` where STATUS is always PENDING, L is (F)eature or (D)efect, and NNN is a sequential task number.
  - Examples:
    - `PENDING.D001.example_defect.md`
    - `PENDING.F011.update_profile_openapi.md`
    - `PENDING.F012.add_profile_field_tests.md`
    - `PENDING.F013.update_profile_openapi.md`

## External repository boundaries

Task planning and execution in **this repo** (`mentorhub_spa_utils`) must not read or depend on other sibling repositories for input context, except:

- **`../mentorhub`** — platform standards and shared documentation (e.g. `DeveloperEdition/standards/api_standards.md`).
- **`../mentorhub_api_utils`** — shared Python utilities to run Demo API backing services.

Do **not** reference paths under CloudFormation repos in task **Context** or **Goals**. If work in another repository is a prerequisite, describe it as an **external prerequisite** in prose (e.g. “MongoDB dictionary must include field X”) and set **Status** to `Blocked` until a human confirms it — do not link to or read files in that repo.

## Dependency management

Domain APIs resolve `api-utils` and other packages from **AWS CodeArtifact**. When a task bumps or adds dependencies in `package.json` / `package-lock.json`, the execution agent must install them with:

```bash
npm install --include=dev
```

Run `mh` once per shell session before `npm install` if CodeArtifact credentials are not already available (see `README.md` and `../mentorhub/DeveloperEdition/standards/spa_standards.md`).


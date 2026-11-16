# Changelog

All notable changes to sdd-antigravity will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.3.0] - 2026-11-15

### Added
- **Pure SDD Standard v2.1 alignment**:
  - **Pre-Design `Validate-Gap` Check (`DÍVIDA-SDD-02`)**: Integrated into `sdd-design` and `sdd-change` for brownfield domain comparison before creating `DES-xxx` decisions.
  - **3-Layer 100% Passive Quality Gate (`DÍVIDA-SDD-01` & `DÍVIDA-SDD-03`)**: Unified milestone gate combining Layer 0 mechanical checks (`check-ids.mjs` + test execution evidence) with a two-stage passive `sdd-validator` report (`Stage 1: Strict GEARS & Scope Compliance` → `Stage 2: Constitution, Security & Global Infra Quality`).
  - **Scoped Low-Friction Interview & Proactive Scope Slicing (`DÍVIDA-SDD-05`)**: `sdd-architect`, `sdd-specify`, and `sdd-change` restrict code reading strictly to the touched domain, ask at most 3–5 focused questions with recommended defaults, and proactively propose splitting or narrowing oversized changes.
  - **Elastic Pagination with Auto-Compaction (`-02.md` — `DÍVIDA-SDD-06`)**: Enforces the 150-line file cap + 4–5 line paragraph density limit while supporting `10-validation-02.md` and `11-project-memory-02.md` overflow shards that are automatically detected by `scripts/session-start.mjs`, linked in the main header, and deleted once debts/active fronts are resolved.
  - **Deterministic Severity Taxonomy & Domain Calibration (`DÍVIDA-SDD-07`)**: Embeds the Universal SDD Severity Matrix (`Critical | High | Medium | Low`) inline in `rules/sdd-core-rules.md`, `GEMINI.md.template`, `agents/sdd-validator/system_prompt.md`, and `templates/specs/10-validation.md`, paired with project-specific risk calibration in `templates/constitution.md.template`.

### Changed
- **Unified `templates/specs/00..11` folder**: Moved `templates/11-project-memory.md` into `templates/specs/11-project-memory.md` so all 12 numbered canonical artifacts reside together and map cleanly to the flat `docs/sdd/` directory.
- `plugin.json` version bumped to `1.3.0`.

### Fixed (post-release audit)
- **Mechanical Say-Do Gate (`DÍVIDA-SDD-01`)**: The gate was only declarative. Added the `sdd-say-do-record` hook (`PostToolUse` on `run_command` and the file-writing tools → `scripts/say-do-record.mjs`) feeding a per-project ledger in the OS temp folder, and `scripts/say-do-audit.mjs` + `scripts/say-do-lib.mjs` to audit it. Fail-closed: only `VERIFIED_PASS` clears Layer 0; `NO_EVIDENCE`, undetermined exit codes and masked test commands are never a pass. Known limitation: a `run_command` that goes to background does not report its final result to the hook, so the gate test run must be synchronous.
- **Removed the "emergency hotfix" bypass** from `sdd-change`: every post-baseline change, however small or urgent, goes through `proposal → apply → archive`.
- **`check-ids` vs. templates**: `templates/specs/08-acceptance.md` declared `AC-001 (FR-001)`, a format the ID guard never recognised as a declaration, and `09-traceability.md` cited concrete IDs; a freshly initialised project failed Layer 0 with 3 orphans. The AC ID now stands alone with a `Requirement:` field and the matrix row uses placeholders.
- **Layer 0 short-circuit**: `sdd-validate`, `sdd-change` (archive) and the `sdd-validator` prompt no longer invoke Stages 1–2 over a failing mechanical floor, and the validator requires the raw output of both Layer 0 commands.
- **`session-start` hook**: accepts both the canonical ledger format and the Markdown variant (`### TASK-001` / `- **Status:**`), no longer lists the ledger legend as a task, and warns when `11-project-memory.md` or `10-validation.md` exceed 150 lines.
- **Constitution interview** (`sdd-init`, `sdd-adopt`) now asks for the domain criticality calibration (section 6) and the official test command.
- Script paths in skills now point to `<raiz-do-plugin>/scripts/...` instead of a path relative to the user project; dated amendment notes require explicit **user** approval; baseline immutability wording fixed from `00–11` to `00–06`, `08`, `09` (volatile `07`, `10`, `11` exempt); `sdd-change` headings relabelled to the 3 canonical states; `sdd-implement` no longer auto-promotes the next task to `In Progress`.
- **Maturity lifecycle enforced (`Draft → Reviewed → Approved`)**: only the user promotes an artifact (batch approval allowed); consuming a `Reviewed` artifact that is not yet `Approved` records a maturity debt (`Type: Maturity`) with a snapshot of the consumed IDs and clause text, closed unchanged or after revalidating the dependents; item-level `Auto-Approved` allowed only for items that do not touch constitution sections 4 and 6, derive 1:1 from a user-approved item (or apply a written convention) and carry a `Motivo:` line. Specify, design, tasks and change skills, the rules and the `sdd-validator` checklist were updated (`Auto-Approved` outside the criteria is `High`).
- **User Risk Acceptance formalized**: a `Critical`/`High` debt stops blocking only with a user acceptance recorded in the `VAL` (who, date, rationale, review trigger); the severity is kept, Layer 0 failures cannot be accepted, and accepting a constitution violation requires an entry in the new constitution section 8 (*Exceções vigentes*). The `implement` entry gate now blocks only `Critical`/`High` debts **without** acceptance (it used to block accepted debts too).
- **Elastic pagination without a paragraph cap**: the unverifiable "4–5 lines per paragraph" limit was removed. The pagination trigger is now 150 lines **or** characters: 16,000 for `10-validation.md` and 7,000 for `11-project-memory.md`. The memory ceiling comes from the platform's injection budget (the Antigravity docs publish no limit, so the plugin assumes 10,000 characters across all `injectSteps` (an assumption not confirmed by the Antigravity developers)) minus ~3,000 characters reserved for alerts, active tasks and active changes. The session hook never relies on the platform cut: it injects by priority and, when the memory does not fit, injects only *Estado Atual*, *Próximos Passos* and *Pendências* with an explicit instruction to read the whole file. Documented in the README, the hook header and the `11-project-memory.md` template. The `10-validation.md` template defines the mandatory debt content (`Issue`, `Evidence`, `Impact`, `Recommendation`, `Closure Criteria`, `History`, plus `Type`, `Links`/`Parent`, `Risk Acceptance`), debt fragmentation and a short greppable `Status`; session hooks warn on either threshold.
- **Session hooks list active changes** (`docs/sdd/changes/<name>/`), one line each with the count of unfinished and `In Progress` tasks, flagging changes with no active task (archive likely pending).
- **Constitution template**: section numbering 1–8 declared canonical (skills and validators cite "section 6" and "section 8"); new section 8 *Exceções vigentes*; section 3 asks for the official Say-Do test command in every plugin.
- **`<raiz-do-plugin>` resolved mechanically**: `scripts/session-start.mjs` computes the plugin root from its own location on every invocation (never written to project files) and injects it, also in projects without `docs/sdd/` so `sdd-init`/`sdd-adopt` can copy the templates; skills and `GEMINI.md.template` now point to that line instead of an example path.
- **Session protocol no longer stalls the turn**: "confirm state and next step in up to 5 lines" now adds "and proceed with the user's request in the same turn". In the Hermes runtime test a local model confirmed the state and ended the turn without acting, which in single-prompt modes means the request is never executed.
- **Runtime test on Antigravity IDE 2.7.0 (Windows)**: the IDE loads the globally installed plugin and runs its `PreInvocation` and `PostToolUse` hooks (hook cwd = the `hooks.json` directory). Three platform behaviours found and handled:
  - **False `VERIFIED_PASS` fixed**: `run_command` reports `error: ""` even when the command exits with code 1, so the recorder took every command as exit 0 and a failing `npm test` passed the gate. The exit code is now read from the conversation transcript (`transcriptPath`, step `stepIdx`: "Command exited with code N"); because the IDE writes that step only after the hook fires, the recorder stores the command as **pending** and `say-do-audit.mjs` resolves it at audit time (`scripts/transcript-exit.mjs`). No evidence → undetermined, never a pass. Verified in the IDE: `VERIFIED_PASS` after a green run and `FAILED_AFTER_EDIT` (exit 1) after a red one.
  - **Tool names of the 2.x IDE**: `write_file` / `edit_file` (argument `Path`) added to the `PostToolUse` matcher and the recorder; the legacy names stay accepted.
  - **State repeated in every answer**: `PreInvocation` fires before every model call (also mid-turn after each tool), and each injection carried the "confirm state" instruction, so the model restated the phase in every reply. The state is still injected on every call (ephemeral messages do not persist), but the instruction now goes only on the first call of the conversation.
- README: validated install option (global), the Say-Do behaviour of the IDE and the synchronous test-run requirement.

## [1.2.0] - 2026-09-17

### Changed
- **Canonical flat structure**: Reference to `docs/sdd/specs/` in `GEMINI.md.template` replaced with `docs/sdd/` (flat), aligning with the canonical standard and the Claude plugin.
- **`scripts/session-start.mjs`**: Now filters tasks to active only (Pending/In Progress/Blocked, max 15 entries) instead of injecting the entire ledger. Token-efficient "Memory-as-Index" strategy — `changes/*/tasks.md` are never loaded by the hook; they are read on-demand by skills.
- **`skills/sdd-init/SKILL.md`**: Complete canonical structure initialization including `docs/sdd/changes/`, `docs/sdd/archive/validation-log.md`, and `docs/sdd/archive/memory-history.md`.
- **`skills/sdd-adopt/SKILL.md`**: Full 4-phase brownfield process with complete canonical structure initialization.
- **`skills/sdd-change/SKILL.md`**: Expanded from 20 to ~50 lines with full 3-state lifecycle (`proposal` → `apply` → `archive`), dynamic task discovery rules, consolidation steps into baseline, debt hygiene, and memory rotation.
- **`skills/sdd-implement/SKILL.md`**: Clarified protocol for change tasks vs baseline tasks (Memory-as-Index: read only the active change's ledger). Added memory rotation rule and transition to archive step when closing a change.

### Added
- **`templates/archive/memory-history.md`**: New append-only cold storage template for finalized change summaries rotated out of `11-project-memory.md`.
- Memory rotation rule in `11-project-memory.md` template: keep ~5 most recent changes, rotate older ones to `archive/memory-history.md`.

## [1.1.0] - 2026-09-16

### Added
- **Skill `sdd-specify`**: New skill covering specification phases 00→03 (Brief, Discovery, Spec/Intent Blocks, Requirements/GEARS), filling the gap between `sdd-init` and `sdd-design`.
- **Agent `sdd-architect`**: Subagent specialized in specification and design phases. Read-only for code, outputs artifacts in `docs/sdd/`.
- **Agent `sdd-doc-writer`**: Subagent specialized in documentation. Generates README updates and feature docs (user-facing + technical with Mermaid diagrams).
- P1–P11 principles listed inline in `GEMINI.md.template` for Cold Session resilience.
- Anti-recurrence rule in `sdd-validator` system prompt.
- Milestone gate workflow embedded in `sdd-implement` (steps 6–10: mechanical guard, validator audit, debt hygiene).
- Link to canonical Hall repository in `GEMINI.md.template`.

### Changed
- **`sdd-validator`** system prompt expanded from 11 lines to comprehensive audit checklist (12-point checklist, milestone gate rules, anti-recurrence policy, structured output format with severity and verdict).
- **`sdd-implement`** now includes automatic quality gate at milestone closing (previously required separate `sdd-validate` invocation).
- `constitution.md.template` section 6 now uses generic model placeholders (`{{MODEL_DOCS}}`, `{{MODEL_CODE}}`, `{{MODEL_ARCH}}`) instead of Claude-specific model names.
- `plugin.json` version bumped to `1.1.0`.

### Removed
- `CLAUDE.md.template` residual file (belonged to the Claude plugin, not Antigravity).

## [1.0.0] - 2026-09-08

### Added
- Initial release with 7 skills: `sdd-init`, `sdd-adopt`, `sdd-change`, `sdd-design`, `sdd-tasks`, `sdd-implement`, `sdd-validate`.
- Core rules (`always_on`) enforcing P1–P11 and GEARS syntax.
- `sdd-validator` subagent (read-only auditor).
- `session-start.mjs` PreInvocation hook injecting project memory and task status.
- `check-ids.mjs` mechanical ID guard (zero-config, grammar-based, exclusion-scoped).
- Full template suite: Constitution, Specs 00–10, GEMINI.md, delta-spec, proposal, memory.
- MIT License.

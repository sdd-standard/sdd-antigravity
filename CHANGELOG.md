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

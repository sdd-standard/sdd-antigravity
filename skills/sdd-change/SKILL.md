---
name: sdd-change
description: Inicia o fluxo de Delta Specs para propor uma alteração no sistema (proposal → delta-spec → tasks → apply → archive). Ciclo completo de 3 estados com consolidação e arquivamento.
---

# SDD Change (Delta Specs — Ciclo Completo)

O fluxo `change` é usado para alterações evolutivas no projeto, utilizando Delta Specs.
Nunca edite os artefatos base em `docs/sdd/` diretamente após o baseline.

## Fluxo de 3 Estados: `proposal` → `apply` → `archive`

### 1. Proposal
1. Peça ao usuário qual é o objetivo da mudança (Intent).
2. Crie a estrutura `docs/sdd/changes/<nome-da-mudanca>/`.
3. Escreva o `proposal.md` contendo: Why, What, Scope (in/out), Success Criteria, artefatos impactados.
4. Peça aprovação da proposal ao usuário.

### 2. Delta Spec + Tasks
5. Escreva o `delta-spec.md` com seções `ADDED`, `MODIFIED` e `REMOVED`. Todo requisito DEVE usar a sintaxe GEARS canônica:
   `[Where <static>] [While <state>] [When <trigger>] the <subject> shall <behavior>.` (keywords em inglês).
   Em brownfield, se a área tocada nunca foi especificada, o delta ADDED inclui a spec "as-built" mínima daquela área (spec-on-touch).
6. Peça aprovação do `delta-spec`.
7. Quebre a mudança em tarefas atômicas no `tasks.md` dentro da pasta de change (com todos os campos canônicos: ID, Title, Goal, Related Requirements, Done When, Status).
8. Acione o **sdd-validator** para conferir o delta contra constitution e rastreabilidade (gate pré-apply).

### 3. Apply (implementação via sdd-implement)
9. Instrua o usuário a usar a skill `sdd-implement` para executar as tarefas do ledger da mudança (`docs/sdd/changes/<nome>/tasks.md`).

#### Novas tasks descobertas durante o Apply
- **Subtarefa técnica** (refinamento do mesmo requisito): declare a task em `tasks.md` com todos os campos canônicos e consulte/informe o usuário antes de executá-la. NUNCA implemente código sem task formal (P1/P8).
- **Novo comportamento de negócio** ou alteração de requisito existente: atualize o `delta-spec.md` PRIMEIRO (ADDED ou MODIFIED em GEARS), obtenha consentimento do usuário, e só então crie a task.

### 4. Archive (consolidação + arquivamento)
Ao concluir TODAS as tasks da mudança:

10. **Gate final**: rode a guarda mecânica (`scripts/check-ids.mjs .`) e acione o **sdd-validator** para auditar a implementação contra os requisitos do delta.
11. **Consolide na baseline**: incorpore os itens do delta-spec nos artefatos centrais de `docs/sdd/`:
    - ADDED/MODIFIED → `02-spec.md`, `03-requirements.md`, `05-design.md`, `08-acceptance.md`
    - Atualize `09-traceability.md` com a nova cadeia Intent → FR → DES → TASK → AC
    - REMOVED → remova ou deprecie nos artefatos correspondentes
12. **Higiene de dívida**: se a mudança resolveu débitos do `10-validation.md`, MOVA essas entradas para `docs/sdd/archive/validation-log.md` com "Fechado por: sdd-change <nome>". O 10-validation guarda SÓ dívida ativa.
13. **Arquive a pasta**: mova `docs/sdd/changes/<nome>/` inteira para `docs/sdd/archive/<nome>/`.
14. **Atualize a memória**: registre o fechamento em `11-project-memory.md`. Mantenha apenas as ~5 mudanças mais recentes no memory; mudanças anteriores já consolidadas ficam referenciadas em `docs/sdd/archive/memory-history.md` (append-only, consultável para investigação de bugs).

> [!IMPORTANT]
> Hotfix emergencial: pode pular o delta, mas registre em `11-project-memory.md` e confira se a spec continua verdadeira; se não, crie a mudança retroativa.

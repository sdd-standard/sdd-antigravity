---
name: sdd-tasks
description: Quebra requisitos e design em tarefas atômicas no ledger (07-tasks.md), critérios de aceite (08-acceptance.md) e matriz de rastreabilidade (09-traceability.md).
---

# SDD Tasks (Fases 07 a 09 — v2.1)

Deriva tarefas de execução (*coding tasks*), critérios de aceite e rastreabilidade a partir dos requisitos e do design estabelecidos.

## Passos:
1. **Leitura de Base**: Analise `03-requirements.md`, `05-design.md` e `06-roadmap.md` (ou a `delta-spec.md` ativa).
2. **Geração do Ledger (`07-tasks.md`)**:
   - Identifique os passos atômicos necessários para implementar o design.
   - Crie tarefas no `07-tasks.md` seguindo o formato canônico do ledger com `ID` (`TASK-xxx`), `Title`, `Goal`, `Inputs`, `Related Requirements` (`FR-xxx`, `DES-xxx`), `Done When`, `Recommended Agent`, `Dependencies` e `Status: Pending`.
3. **Critérios de Aceite (`08-acceptance.md`)**:
   - Derive critérios `AC-xxx` em formato `Given / When / Then` diretamente a partir dos requisitos GEARS.
4. **Matriz de Rastreabilidade (`09-traceability.md`)**:
   - Conecte ponta a ponta: `Intent Block (IB-xxx) → Requisito (FR/NFR-xxx) → Design (DES-xxx) → Task (TASK-xxx) → Critério de Aceite (AC-xxx)`.
5. **Guarda Mecânica Pré-Implementação**:
   - Execute `node "scripts/check-ids.mjs" .` para garantir que nenhum ID ficou órfão antes de iniciar o código.
   - Atualize `docs/sdd/11-project-memory.md` (respeitando o teto de 150 linhas e paginação elástica `-02.md`).

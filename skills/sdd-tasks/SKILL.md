---
name: sdd-tasks
description: Quebra requisitos e design em tarefas atômicas no ledger (07-tasks.md), critérios de aceite (08-acceptance.md) e matriz de rastreabilidade (09-traceability.md).
---

# SDD Tasks (Fases 07 a 09 — v2.1)

Deriva tarefas de execução (*coding tasks*), critérios de aceite e rastreabilidade a partir dos requisitos e do design estabelecidos.

## Passos:
1. **Leitura de Base**: Analise `03-requirements.md`, `05-design.md` e `06-roadmap.md` (ou a `delta-spec.md` ativa). Pré-condição: base pelo menos em `Reviewed`. Se a base estiver só em `Reviewed`, registre antes a dívida de maturidade (`Type: Maturity`, com snapshot dos IDs e do texto consumidos) no `10-validation.md`; o `Status` dos artefatos só muda por decisão do usuário.
2. **Geração do Ledger (`07-tasks.md`)**:
   - Identifique os passos atômicos necessários para implementar o design.
   - Crie tarefas no `07-tasks.md` seguindo o formato canônico do ledger com `ID` (`TASK-xxx`), `Title`, `Goal`, `Inputs`, `Related Requirements` (`FR-xxx`, `DES-xxx`), `Done When`, `Recommended Agent`, `Dependencies` e `Status: Pending`.
3. **Critérios de Aceite (`08-acceptance.md`)**:
   - Derive critérios `AC-xxx` em formato `Given / When / Then` diretamente a partir dos requisitos GEARS.
   - Formato de declaração (lido pelo `check-ids.mjs`): o ID fica **sozinho na linha** (ou seguido de ` — título`) e o requisito coberto vai no campo `Requirement: FR-xxx` — nunca entre parênteses na linha do ID.
4. **Matriz de Rastreabilidade (`09-traceability.md`)**:
   - Conecte ponta a ponta: `Intent Block (IB-xxx) → Requisito (FR/NFR-xxx) → Design (DES-xxx) → Task (TASK-xxx) → Critério de Aceite (AC-xxx)`.
5. **Guarda Mecânica Pré-Implementação**:
   - Execute `node "<raiz-do-plugin>/scripts/check-ids.mjs" .` na raiz do projeto (`<raiz-do-plugin>` é informada pelo hook do plugin no início de cada turno) para garantir que nenhum ID ficou órfão antes de iniciar o código.
   - Atualize `docs/sdd/11-project-memory.md` (respeitando o gatilho de paginação (150 linhas ou 7.000 caracteres) e paginação elástica `-02.md`).

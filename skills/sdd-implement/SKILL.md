---
name: sdd-implement
description: Executa as tarefas marcadas como In Progress no ledger de tarefas e aciona ao final de cada milestone o Quality Gate 100% Passivo em 3 Camadas.
---

# SDD Implement (Execução Guiada & Gate Passivo em 3 Camadas — v2.1)

A fase de código real. Só altere código se você foi chamado por essa skill ou se o usuário explicitamente pediu para executar uma task ativa.

## Passos:
1. **Protocolo de sessão**: Leia `constitution.md` → `11-project-memory.md` → `10-validation.md` → ledger ativo.
   - **Baseline (greenfield)**: ledger é `docs/sdd/07-tasks.md`.
   - **Mudança ativa**: o memory indica qual change está em apply → leia APENAS `docs/sdd/changes/<ativa>/tasks.md` (nunca carregue todos os changes; verifique se há avisos de paginação elástica `-02.md`).
2. **Selecione a task**: a `In Progress` existente, ou a primeira `Pending` sem dependências bloqueadas. Confirme com o usuário em 1 linha.
3. **Gate de entrada**: A task tem `Related Requirements` e `Done When`? Há achados `Critical`/`High` abertos no `10-validation.md`? Se sim → pare e reporte.
4. **Implemente**: Marque `Status: In Progress` no ledger **antes** de tocar no código. Revise a especificação vinculada (`FR-XXX`, `DES-XXX`) e implemente as alterações no código e nos testes automatizados.
5. **Gate de saída da task (Evidência para o Say-Do Gate)**:
   - **Execute a suíte de testes no terminal** após a última edição de código e confirme `exit code 0`.
   - Testes verdes + `Done When` satisfeito → mude Status para `Done` e atualize `11-project-memory.md` no mesmo turno. Avance a próxima task para `In Progress`.
   - Se esta era a **última task de uma mudança ativa** (`changes/<nome>/tasks.md`): instrua o usuário a prosseguir com o passo de **Archive** da skill `sdd-change` (consolidação do delta na baseline + arquivamento da pasta).

---

## Quality Gate de Milestone (100% Passivo em 3 Camadas — ao concluir a última task de um milestone):

> **Regra Inegociável de Passividade:** Todas as 3 camadas do Gate abaixo são **100% PASSIVAS (`read-only`)**. Elas apenas inspecionam e reportam divergências/erros para que **você (o implementador/orquestrador)** realize as correções.

6. **Camada 0 — Piso Mecânico Passivo (`check-ids.mjs` + Comprovação de Execução)**:
   - Execute na raiz do projeto:
     ```bash
     node "scripts/check-ids.mjs" .
     ```
     Ele varre o repositório INTEIRO (exclusão, nunca inclusão) e aponta siglas órfãs. `Exit 1` = há órfãs → corrija ANTES do gate.
   - Verifique que o comando real da suíte de testes/build foi executado na sessão com `exit code 0` após a última alteração de arquivo de código (*Say-Do Check*). Entregue ambas as evidências ao validador.

7. **Camadas 1 e 2 — Acione o subagente `sdd-validator` (100% Passivo / Read-Only)**:
   - Ele auditará o milestone inteiro lendo o código real (`arquivo:linha`) sem editar nada, entregando seu relatório dividido em:
     - **Camada 1 (Estágio 1 — Conformidade Estrita GEARS & Escopo)**: Verifica cobertura de cada `FR-xxx`, `NFR-xxx`, `AC-xxx` e ausência de escopo inventado (*anti-scope-creep*).
     - **Camada 2 (Estágio 2 — Qualidade, Constitution e Infra Global)**: Verifica aderência à `constitution.md`, segurança e interações com infra global (middlewares, rotas raiz, auth, banco).

8. **Tratamento de achados pelo Implementador**:
   - Achado `Critical`/`High` → o implementador corrige no mesmo gate SE a correção for apenas tornar o código conforme a spec já aprovada (corrija e re-rode os testes). Se exigir *mudar a spec*, o achado só pode passar como **`APROVADO COM RESSALVA`** mediante aceite **EXPLÍCITO** do usuário. Sem aceite → **`BLOQUEADO`**; o milestone não avança.
   - Registre um bloco **"Registro do gate Mn"** no ledger, logo abaixo da última task do milestone.
   - Regra de destino: achado **CORRIGIDO** no gate morre nesse bloco. **Todo achado que fica ABERTO — qualquer severidade — também é registrado no `10-validation.md` global** como dívida ativa (com ponteiro cruzado ledger↔global).

9. **Higiene de dívida, memória e Paginação Elástica (*Overflow Sharding*)**:
   - **Dívidas Sanadas → Cold Storage**: Se uma dívida do `10-validation.md` (ou `10-validation-02.md`) for RESOLVIDA neste gate, MOVA a entrada para `docs/sdd/archive/validation-log.md` (append-only). O `10-validation.md` guarda SÓ dívida ativa.
   - **Rotação de Memória**: Mantenha apenas as ~5 mudanças/milestones mais recentes no `11-project-memory.md`. Mudanças anteriores já consolidadas devem ser movidas para `docs/sdd/archive/memory-history.md` (append-only) com ponteiro no memory para consultas futuras.
   - **Paginação Elástica e Auto-Exclusão (`-02.md`)**:
     - Se `10-validation.md` ou `11-project-memory.md` ultrapassar **150 linhas** (mantendo parágrafos curtos de até 4–5 linhas), crie `10-validation-02.md` ou `11-project-memory-02.md` e linke no topo do arquivo principal.
     - Se, após sanar dívidas ou rotacionar memória, os itens de um arquivo `-02.md` voltarem a caber dentro das 150 linhas do arquivo principal, **repatrie os itens para o arquivo principal, remova o link do cabeçalho e EXCLUA o arquivo `-02.md`**.

10. **Apresente resultado**: O milestone seguinte só inicia após aprovação manual do usuário. Ofereça o commit (nunca commite sem pedido explícito).

## Regras estritas:
- Se surgir necessidade de mudar a spec durante a implementação → PARE e use `sdd-change`. Código nunca diverge da spec silenciosamente.
- Exceção: divergência que apenas RESTRINGE o design pode virar nota de emenda datada no artefato (aprovada no turno, com ponteiro de reconciliação).
- Se a task concluir funcionalidade visível: acione o subagente `sdd-doc-writer` (`README.md` + docs de feature) antes do commit.
- NUNCA instale dependência nova sem confirmação explícita do usuário.

> [!IMPORTANT]
> Nenhum código sem task `In Progress`. Nenhum milestone avança com `Critical`/`High` sem aceite explícito.

---
name: sdd-implement
description: Executa as tarefas marcadas como In Progress no ledger de tarefas, focando na implementação técnica. Inclui gate de milestone automático com validação ao fechar blocos de tarefas.
---

# SDD Implement

A fase de código real. Só altere código se você foi chamado por essa skill ou se o usuário explicitamente pediu para executar uma task ativa.

## Passos:
1. **Protocolo de sessão**: Leia `constitution.md` → `11-project-memory.md` → `10-validation.md` → ledger ativo.
   - **Baseline (greenfield)**: ledger é `docs/sdd/07-tasks.md`.
   - **Mudança ativa**: o memory indica qual change está em apply → leia APENAS `docs/sdd/changes/<ativa>/tasks.md` (nunca carregue todos os changes).
2. **Selecione a task**: a `In Progress` existente, ou a primeira `Pending` sem dependências bloqueadas. Confirme com o usuário em 1 linha.
3. **Gate de entrada**: A task tem `Related Requirements` e `Done When`? Há achados Critical/High abertos no `10-validation.md`? Se sim → pare e reporte.
4. **Implemente**: Revise a especificação vinculada (`FR-XXX`, `DES-XXX`). Implemente as alterações no código.
5. **Gate de saída da task**: Testes verdes + `Done When` satisfeito → mude Status para `Done` e atualize `11-project-memory.md`. Avance a próxima task para `In Progress`.
   - Se esta era a **última task de uma mudança ativa** (`changes/<nome>/tasks.md`): instrua o usuário a prosseguir com o passo de **Archive** da skill `sdd-change` (consolidação do delta na baseline + arquivamento da pasta).

## Gate de Milestone (ao concluir a última task de um milestone):

6. **Guarda mecânica primeiro**: Execute na raiz do projeto:
   ```
   node "scripts/check-ids.mjs" .
   ```
   Ele varre o repositório INTEIRO (exclusão, nunca inclusão) e aponta siglas órfãs. Exit 1 = há órfãs → corrija ANTES do gate. Entregue a saída ao validador como evidência.

7. **Acione o subagente `sdd-validator`**: Ele auditará o milestone inteiro contra os FR/NFR/AC (leitura de código real, não relatórios).

8. **Tratamento de achados**:
   - Achado Critical/High → tente resolver SE a correção for apenas tornar o código conforme a spec já aprovada. Se exigir *mudar a spec*, o achado só pode passar como **APROVADO COM RESSALVA** mediante aceite **EXPLÍCITO** do usuário. Sem aceite → **BLOQUEADO**; o milestone não avança.
   - Registre um bloco **"Registro do gate Mn"** no ledger, logo abaixo da última task do milestone.
   - Regra de destino: achado CORRIGIDO no gate morre nesse bloco. **Todo achado que fica ABERTO — qualquer severidade — também é registrado no `10-validation.md` global** como dívida ativa (com ponteiro cruzado ledger↔global).

9. **Higiene de dívida**: Se uma dívida do `10-validation.md` for RESOLVIDA neste gate, MOVA a entrada para `docs/sdd/archive/validation-log.md` (append-only). O `10-validation.md` guarda SÓ dívida ativa.

9b. **Rotação de memória**: Mantenha apenas as ~5 mudanças/milestones mais recentes no `11-project-memory.md`. Mudanças anteriores já consolidadas devem ser movidas para `docs/sdd/archive/memory-history.md` (append-only) com ponteiro no memory para consultas futuras (ex: investigação de bugs).

10. **Apresente resultado**: O milestone seguinte só inicia após aprovação manual do usuário. Ofereça o commit (nunca commite sem pedido explícito).

## Regras estritas:
- Se surgir necessidade de mudar a spec durante a implementação → PARE e use `sdd-change`. Código nunca diverge da spec silenciosamente.
- Exceção: divergência que apenas RESTRINGE o design pode virar nota de emenda datada no artefato (aprovada no turno, com ponteiro de reconciliação).
- Se a task concluir funcionalidade visível: acione o subagente `sdd-doc-writer` (README + docs de feature) antes do commit.
- NUNCA instale dependência nova sem confirmação explícita do usuário.

> [!IMPORTANT]
> Nenhum código sem task `In Progress`. Nenhum milestone avança com Critical/High sem aceite explícito.

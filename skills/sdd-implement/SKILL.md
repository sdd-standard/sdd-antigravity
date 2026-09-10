---
name: sdd-implement
description: Executa as tarefas marcadas como In Progress no ledger de tarefas, focando na implementação técnica.
---

# SDD Implement

A fase de código real. Só altere código se você foi chamado por essa skill ou se o usuário explicitamente pediu para executar uma task ativa.

## Passos:
1. Leia o `07-tasks.md`. Encontre as tasks marcadas como `In Progress`.
2. Revise a especificação vinculada a esta task (`FR-XXX`, `DES-XXX`).
3. Implemente as alterações no código.
4. Após concluir com sucesso e validar minimamente (rodar testes locais se aplicável), mude a task para `Done` e atualize a próxima para `In Progress`.
5. Se for o fim do milestone, acione a skill `sdd-validate` para o quality gate.

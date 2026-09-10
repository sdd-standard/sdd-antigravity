---
name: sdd-change
description: Inicia o fluxo de Delta Specs para propor uma alteração no sistema (proposal -> delta-spec -> tasks -> apply).
---

# SDD Change

O fluxo `change` é usado para alterações evolutivas no projeto, utilizando Delta Specs.

## Passos:
1. Peça ao usuário qual é o objetivo da mudança (Intent).
2. Crie a estrutura `docs/sdd/changes/<nome-da-mudanca>/`.
3. Escreva o `proposal.md` contendo o *Why* e *What*.
4. Peça aprovação da proposal.
5. Escreva o `delta-spec.md` com seções `ADDED`, `MODIFIED` e `REMOVED`. Todo requisito DEVE usar a sintaxe GEARS canônica:
   `[Where <static>] [While <state>] [When <trigger>] the <subject> shall <behavior>.` (keywords em inglês).
6. Peça aprovação do `delta-spec`.
7. Quebre a mudança em tarefas atômicas no `tasks.md` dentro da pasta de change (com `Done When` e Status).
8. Ao final, instrua o usuário a usar a skill `sdd-implement` para executar as tarefas.

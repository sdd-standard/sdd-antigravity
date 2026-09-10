---
name: sdd-validate
description: Aciona o subagente sdd-validator para auditar o código implementado frente à especificação e gerar log de dívida.
---

# SDD Validate

Skill responsável pelo Quality Gate ao final de um ciclo de desenvolvimento.

## Passos:
1. Verifique se o script de integridade de IDs existe (`scripts/check-ids.mjs`). Se existir, execute-o.
2. Invoque o subagente `sdd-validator`. O subagente vai analisar as specs recentes e o código modificado.
3. Obtenha o output do validador.
4. Pegue as falhas não resolvidas listadas pelo validador e coloque no `docs/sdd/10-validation.md` (o log de dívida).
5. Se as falhas forem Critical/High, marque a tarefa no `07-tasks.md` como bloqueada e avise o usuário que o código não pode ser comitado sem correção ou aprovação explícita.

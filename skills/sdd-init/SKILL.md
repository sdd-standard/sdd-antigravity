---
name: sdd-init
description: Inicia um novo projeto SDD Greenfield. Entrevista o usuário para a Constitution e gera a baseline de arquivos.
---

# SDD Init (Greenfield)

Esta skill inicia o workflow SDD do zero.

## Passos:
1. Faça uma breve entrevista com o usuário para entender as diretrizes arquiteturais, regras de linting, testes e padrões que formarão a **Constitution**.
2. Crie a pasta `docs/sdd/` na raiz do workspace com a estrutura canônica completa:
   - `docs/sdd/constitution.md` — baseado na entrevista e nos princípios P1 a P11.
   - `docs/sdd/00-project-brief.md` — objetivo macro com Intent Blocks.
   - `docs/sdd/07-tasks.md` — ledger de execução inicial (vazio).
   - `docs/sdd/11-project-memory.md` — estado inicial.
   - `docs/sdd/10-validation.md` — backlog de dívida (vazio, do template).
   - `docs/sdd/changes/` — pasta vazia para futuras mudanças.
   - `docs/sdd/archive/validation-log.md` — log append-only de débitos resolvidos (do template, vazio).
   - `docs/sdd/archive/memory-history.md` — histórico de mudanças finalizadas (do template, vazio).
3. Instancie o arquivo `GEMINI.md` na raiz do projeto (usando `templates/GEMINI.md.template`), que manterá as diretrizes e regras SDD no contexto de qualquer sessão neste projeto.
4. Crie o arquivo de regras editáveis por projeto `.agents/rules/sdd-project-rules.md` importando as restrições da Constitution para o próprio Antigravity policiar no dia a dia.

> [!IMPORTANT]
> Nunca modifique arquivos sem antes planejar e pedir confirmação.

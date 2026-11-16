---
name: sdd-init
description: Inicia um novo projeto SDD Greenfield no Antigravity IDE. Entrevista o usuário para a Constitution e gera a baseline de arquivos em docs/sdd/ e GEMINI.md.
---

# SDD Init (Greenfield — v2.1)

Esta skill inicia o workflow **Spec-Driven Development (SDD Puro v2.1)** do zero.

## Passos:
1. **Verificação Inicial**: Confirme que `docs/sdd/` ainda não existe (se já existir, pare e oriente usar `sdd-adopt` ou continuar de onde parou).
2. **Entrevista Concisa da Constitution (Baixa Fricção)**:
   - Faça uma entrevista enxuta e direta com o usuário (máx. 3 a 5 perguntas agrupadas com recomendações padrão) para entender as diretrizes arquiteturais, stack tecnológica, regras de linting, política de testes e modelos do ambiente que formarão a **Constitution**.
3. **Criação da Árvore Canônica Flat (`docs/sdd/`)**:
   Copie os templates do plugin (`templates/specs/*` → `docs/sdd/` e `templates/archive/*` → `docs/sdd/archive/`) na raiz do workspace:
   - `docs/sdd/constitution.md` — baseado na entrevista (`templates/constitution.md.template`) e nos princípios P1 a P11.
   - `docs/sdd/00-project-brief.md` a `docs/sdd/09-traceability.md` — esqueletos canônicos (a partir de `templates/specs/`).
   - `docs/sdd/07-tasks.md` — ledger de execução inicial (vazio).
   - `docs/sdd/10-validation.md` — backlog vivo de dívida ativa (a partir de `templates/specs/10-validation.md`, com suporte a paginação elástica `-02.md`).
   - `docs/sdd/11-project-memory.md` — estado inicial de memória (a partir de `templates/specs/11-project-memory.md`, com suporte a paginação elástica `-02.md`).
   - `docs/sdd/changes/` — pasta vazia para futuras mudanças.
   - `docs/sdd/archive/validation-log.md` — cold storage append-only de débitos resolvidos (do template, vazio).
   - `docs/sdd/archive/memory-history.md` — cold storage append-only de mudanças finalizadas (do template, vazio).
4. **Contexto Nativo do Antigravity (`GEMINI.md` e Regras)**:
   - Instancie o arquivo `GEMINI.md` na raiz do projeto (usando `templates/GEMINI.md.template`), que manterá as diretrizes e regras SDD no contexto de qualquer sessão neste projeto.
   - Crie o arquivo de regras editáveis por projeto `.agents/rules/sdd-project-rules.md` importando as restrições da Constitution para o próprio Antigravity policiar no dia a dia.

> [!IMPORTANT]
> Nunca pule a entrevista da `constitution.md` — ela governa todas as fases. Nunca modifique arquivos sem antes planejar e pedir confirmação.

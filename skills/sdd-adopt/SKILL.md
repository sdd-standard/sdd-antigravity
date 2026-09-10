---
name: sdd-adopt
description: Escaneia um projeto existente (brownfield) e gera uma baseline SDD inicial baseada no que já está construído.
---

# SDD Adopt (Brownfield)

Esta skill cria a fundação SDD em projetos que já existem mas não tinham documentação viva.

## Passos:
1. Escaneie as convenções atuais do código (linguagem, framework, padrões de teste).
2. Entreviste o usuário para formalizar essas convenções na `constitution.md`.
3. Gere o `00-project-brief.md` com base no contexto do que já está implementado.
4. Faça o setup do `11-project-memory.md` e do ledger `07-tasks.md`.
5. Instancie o arquivo `GEMINI.md` na raiz do projeto (via `templates/GEMINI.md.template`) para persistir o protocolo de sessão e regras.
6. Gere o `.agents/rules/sdd-project-rules.md` para proteger o projeto.
> [!NOTE]
> Não faça engenharia reversa completa de todos os requisitos do projeto. Gere apenas o baseline estrutural. O resto evoluirá via Spec-on-Touch com o `sdd-change`.

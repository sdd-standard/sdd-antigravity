---
name: sdd-adopt
description: Escaneia um projeto existente (brownfield) e gera uma baseline SDD inicial baseada no que já está construído via Spec-on-Touch.
---

# SDD Adopt (Brownfield — v2.1)

Esta skill cria a fundação SDD em projetos que já existem mas não tinham documentação viva.

> **Princípio de Ouro Brownfield:** **NÃO faça retro-spec nem leia o código legado inteiro.** Crie apenas a baseline estrutural mínima (*As-Built*) + **Spec-on-Touch** (a especificação cresce incrementalmente apenas nas áreas tocadas por novas mudanças via `sdd-change`).

## Fase 1 — Levantamento Estrutural Leve (Sem Varredura Massiva)
1. Escaneie apenas os manifestos e convenções estruturais da raiz (linguagem, framework, padrões de teste, CI, estrutura de pastas de 1º/2º nível).
2. Identifique os macro-módulos/*bounded contexts* aparentes e integrações externas.
3. Liste em até 3 a 5 perguntas diretas (com recomendação padrão) apenas o que NÃO dá para inferir dos manifestos (SLAs, regras de negócio implícitas, decisões históricas).

## Fase 2 — Constitution Extraída + Entrevista
4. Entreviste o usuário para formalizar as convenções na `constitution.md` em duas partes: (a) convenções OBSERVADAS no código — confirme com o usuário; (b) regras DESEJADAS daqui em diante.

## Fase 3 — Baseline Mínima "As-Built" (Estrutura Flat em `docs/sdd/`)
5. Crie a estrutura canônica em `docs/sdd/` utilizando os modelos de `templates/specs/` e `templates/archive/`:
   - `constitution.md` — governança extraída + desejada (`templates/constitution.md.template`).
   - `00-project-brief.md` — o que o sistema é hoje e por que existe (`templates/specs/00-project-brief.md`).
   - `02-spec.md` — capacidades atuais em alto nível (sem GEARS retroativo; seção `"As-Built"`).
   - `04-domain-model.md` — mapa dos *bounded contexts* e linguagem ubíqua observada.
   - `05-design.md` — arquitetura *as-built* + decisões conhecidas (marque históricas como `"legado"`).
   - `07-tasks.md` — ledger vazio (`templates/specs/07-tasks.md`).
   - `10-validation.md` — lacunas e dívidas conhecidas (`templates/specs/10-validation.md`, com suporte a paginação elástica `10-validation-02.md` se > 150 linhas).
   - `11-project-memory.md` — estado inicial (`templates/specs/11-project-memory.md`, com suporte a paginação elástica `11-project-memory-02.md`).
   - `changes/` — pasta vazia para futuras mudanças.
   - `archive/validation-log.md` — log de débitos (`templates/archive/validation-log.md`, vazio).
   - `archive/memory-history.md` — histórico de mudanças finalizadas (`templates/archive/memory-history.md`, vazio).
   - *Nota:* **NÃO** crie `01`, `03`, `06`, `08`, `09` retroativos — serão criados por mudança, quando necessário.
6. Instancie o `GEMINI.md` na raiz do projeto (via `templates/GEMINI.md.template`), preservando instruções existentes do usuário.
7. Gere o `.agents/rules/sdd-project-rules.md` para proteger o projeto.

## Fase 4 — Operação Contínua
8. A partir daqui, TODA feature/alteração entra via `sdd-change` (Delta Specs com inspeção escopada apenas ao domínio tocado). Cada delta consolidado enriquece as specs.
9. Feature grande demais para um delta? Use `sdd-specify` escopado àquela feature (ou fatie em múltiplas changes sequenciais).

> [!NOTE]
> Não faça engenharia reversa completa de todos os requisitos do projeto. Gere apenas o baseline estrutural. O resto evoluirá via Spec-on-Touch com o `sdd-change`.

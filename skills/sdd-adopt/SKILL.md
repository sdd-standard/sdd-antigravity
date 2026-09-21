---
name: sdd-adopt
description: Escaneia um projeto existente (brownfield) e gera uma baseline SDD inicial baseada no que já está construído.
---

# SDD Adopt (Brownfield)

Esta skill cria a fundação SDD em projetos que já existem mas não tinham documentação viva.

Princípio: NÃO faça retro-spec do sistema inteiro. Baseline mínima + spec-on-touch: a especificação cresce incrementalmente, apenas nas áreas tocadas por mudanças.

## Fase 1 — Levantamento
1. Escaneie as convenções atuais do código (linguagem, framework, padrões de teste, CI, estrutura de pastas).
2. Identifique os macro-módulos/bounded contexts aparentes e integrações externas.
3. Liste o que NÃO dá para inferir (SLAs, regras de negócio implícitas, decisões históricas) como perguntas ao usuário.

## Fase 2 — Constitution extraída + entrevista
4. Entreviste o usuário para formalizar as convenções na `constitution.md` em duas partes: (a) convenções OBSERVADAS no código — confirme com o usuário; (b) regras DESEJADAS daqui em diante.

## Fase 3 — Baseline mínima "as-built"
5. Crie a estrutura canônica completa em `docs/sdd/`:
   - `constitution.md` — governança extraída + desejada.
   - `00-project-brief.md` — o que o sistema é hoje e por que existe.
   - `02-spec.md` — capacidades atuais em alto nível (sem GEARS retroativo; seção "As-Built").
   - `04-domain-model.md` — mapa dos bounded contexts e linguagem ubíqua observada.
   - `05-design.md` — arquitetura as-built + decisões conhecidas (marque históricas como "legado").
   - `07-tasks.md` — ledger vazio.
   - `10-validation.md` — lacunas conhecidas.
   - `11-project-memory.md` — estado inicial.
   - `changes/` — pasta vazia para futuras mudanças.
   - `archive/validation-log.md` — log de débitos (do template, vazio).
   - `archive/memory-history.md` — histórico de mudanças finalizadas (do template, vazio).
   - NÃO crie 01, 03, 06, 08, 09 retroativos — serão criados por mudança, quando necessário.
6. Instancie o `GEMINI.md` na raiz do projeto (via `templates/GEMINI.md.template`) para persistir o protocolo de sessão e regras.
7. Gere o `.agents/rules/sdd-project-rules.md` para proteger o projeto.

## Fase 4 — Operação
8. A partir daqui, TODA feature/alteração entra via `sdd-change` (delta specs). Cada delta consolidado enriquece as specs.
9. Feature grande demais para um delta? Use `sdd-specify` escopado àquela feature.

> [!NOTE]
> Não faça engenharia reversa completa de todos os requisitos do projeto. Gere apenas o baseline estrutural. O resto evoluirá via Spec-on-Touch com o `sdd-change`.

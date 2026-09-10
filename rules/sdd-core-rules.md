---
trigger: always_on
description: Regras e Fundamentos do Spec-Driven Development (SDD Puro) para Antigravity IDE.
---

# SDD Core Rules & Metodologia (Spec-Driven Development)

Este projeto opera sob a metodologia **Spec-Driven Development (SDD)**. A especificação é o artefato primário, versionado, vivo e central. Código, testes, tarefas, design e documentação são derivados dela.

---

## 1. Princípios Inegociáveis (P1 a P11)

- **P1 — A especificação é a fonte da verdade**: Mudanças começam sempre na spec (`docs/sdd/`), nunca no código.
- **P2 — Constitution vem antes da especificação**: Princípios inegociáveis (`constitution.md`) governam todas as fases do projeto.
- **P3 — A especificação deve ser viva**: Evolui com o projeto. Spec desatualizada é spec morta.
- **P4 — Rastreabilidade obrigatória**: Cadeia inquebrável: `Objetivo (Intent) → Requisito (GEARS) → Decisão de Design (DES) → Tarefa (TASK) → Critério de Aceite (AC) → Teste → Código`.
- **P5 — Requisitos verificáveis**: Nunca use termos vagos ("rápido", "simples"). Use métricas observáveis.
- **P6 — Ambiguidade tratada cedo**: Lacunas não resolvidas NUNCA são preenchidas com suposições — marque imediatamente como `PENDENTE DE DEFINIÇÃO` e registre em `10-validation.md`.
- **P7 — Design vem antes da execução**: Arquitetura, componentes e trade-offs justificados antes de tasks e código.
- **P8 — Tarefas derivam dos artefatos**: Nenhuma tarefa nasce do nada; cada task no `07-tasks.md` aponta para um requisito ou decisão.
- **P9 — Validação é gate contínuo**: Cada fase é validada antes de avançar. Ao fechar milestones, o subagente `sdd-validator` audita o código real.
- **P10 — SDD não é Waterfall**: Especificar o suficiente para reduzir risco incrementalmente, aprender e consolidar.
- **P11 — Estado fora do chat (Engenharia de Contexto)**: O chat é volátil. TODO o estado, decisões e tarefas residem em arquivos versionados (`docs/sdd/`). A memória entre sessões é persistida em `11-project-memory.md` (máx. 150 linhas, sobrescrita por evento).

---

## 2. Sintaxes Formais

### Intent Block (Captura o PORQUÊ)
Usado em Discovery, Épicos e Visão Geral (`02-spec.md` ou `proposal.md`):
```text
Intent Block:
Goal:        <objetivo de negócio ou do usuário>
Expectation: <expectativa mensurável em alto nível>
Action:      <capacidade ou mudança que será construída>
Result:      <resultado observável ou valor entregue>
```

### GEARS — Generalized EARS (Formaliza O QUE deve acontecer)
Sintaxe canônica para todos os requisitos funcionais e não-funcionais (`03-requirements.md` e `delta-spec.md`).
**Regra rígida: Keywords SEMPRE em inglês, mesmo com conteúdo em português.**

```text
[Where <static precondition / feature flag / config>]
[While <stateful precondition / runtime state>]
[When <trigger / event>]
the <subject> shall <behavior observável>.
```

- `Where`: Pré-condição estática (ambiente, flag ativada).
- `While`: Pré-condição dinâmica de estado (ex: "While user account is locked").
- `When`: Gatilho ou evento (ex: "When the user submits valid credentials").
- `<subject>`: O componente, serviço ou ator específico (não apenas "o sistema").
- `shall`: Comportamento estrito e mensurável.

Exemplos:
```text
When the user submits valid credentials,
the authentication service shall issue a signed JWT session token.

Where multi-factor authentication is enabled,
when the user submits valid primary credentials,
the authentication service shall request a second authentication factor.
```

---

## 3. Regras Estritas de Execução

1. **NUNCA modifique código sem uma task `In Progress`**: O arquivo `docs/sdd/07-tasks.md` (ou `tasks.md` da delta-spec) é o ledger de execução. Não gere código se a tarefa não estiver formalmente ativa e rastreada a um requisito.
2. **Mudanças pós-baseline são Delta Specs**: Após a baseline inicial de specs (`00` a `10`), NUNCA edite diretamente os arquivos centrais. Use o ciclo de vida de mudanças (`sdd-change`):
   - `proposal.md` ➔ `delta-spec.md` (seções ADDED / MODIFIED / REMOVED em GEARS) ➔ `tasks.md` ➔ Implementação ➔ Validação ➔ Consolidação nas specs e arquivamento em `archive/`.
3. **Confirmação de dependências**: SEMPRE peça permissão explícita ao usuário antes de adicionar bibliotecas ou dependências ao projeto.
4. **Higiene de Validação**: Toda não-conformidade levantada pelo `sdd-validator` entra em `10-validation.md`. Nenhum milestone avança com achados Critical ou High em aberto.

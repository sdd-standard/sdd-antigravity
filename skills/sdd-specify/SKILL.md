---
name: sdd-specify
description: Conduz as fases de especificação SDD (00→03) — Project Brief, Discovery, Spec (Intent Blocks) e Requirements (GEARS). Use após o bootstrap (sdd-init/sdd-adopt) para capturar e formalizar intenção e requisitos.
---

# SDD Specify (Fases 00 a 03)

Esta skill guia a captura estruturada de intenção e a formalização de requisitos, delegando ao agente `sdd-architect` quando disponível.

## Pré-condições:
- `docs/sdd/constitution.md` deve existir. Se não existir, oriente o usuário a rodar `sdd-init` ou `sdd-adopt` primeiro.
- Leia `11-project-memory.md` e verifique o estado dos artefatos 00–03 existentes.

## Passos:
1. Identifique a fase mais antiga incompleta, nesta ordem:
   - `00-project-brief.md` → `01-discovery.md` → `02-spec.md` → `03-requirements.md`
2. Conduza **um artefato por vez**:
   a. Resuma seu entendimento do contexto atual.
   b. Liste lacunas e pontos não definidos.
   c. Faça perguntas de descoberta (segurança, LGPD, NFRs, RTO/RPO sempre).
   d. Gere o artefato em `docs/sdd/`.
3. Valide cada artefato com o usuário antes de avançar (Status: `Draft → Reviewed → Approved`).
4. Ao concluir cada artefato, atualize `docs/sdd/11-project-memory.md`.

## Regras de sintaxe:
- **Intent Blocks** no `02-spec.md`: captura o PORQUÊ (Goal / Expectation / Action / Result).
- **GEARS** no `03-requirements.md`: formaliza O QUE (keywords `Where`/`While`/`When`/`shall` em inglês).
  - `Where` = pré-condição estática (ambiente, flag, configuração).
  - `While` = pré-condição dinâmica de estado (runtime).
  - `When` = gatilho ou evento de entrada.
- Lacunas críticas → `PENDENTE DE DEFINIÇÃO` + registro em `10-validation.md`. Nunca invente requisito crítico.
- Termos vagos viram métrica: "rápido" → tempo, "seguro" → mecanismo, "disponível" → SLA.

## Próximo passo:
Ao concluir `03-requirements.md`, oriente o usuário a usar a skill `sdd-design` para as fases 04→06.

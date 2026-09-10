# sdd-workflow — Plugin de Spec-Driven Development para Antigravity IDE (Gemini)

> **A implementação oficial do padrão Spec-Driven Development (SDD) para o ecossistema Google Antigravity e Gemini.**

[![Standard: Pure SDD](https://img.shields.io/badge/Standard-Pure%20SDD%20v2.0-blue.svg)](https://github.com/sdd-standard/spec-driven-development)
[![Platform: Google Antigravity](https://img.shields.io/badge/Platform-Google%20Antigravity%20IDE-orange.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Sobre o Projeto & Propósito

Este plugin operacionaliza no **Google Antigravity IDE** o conjunto de regras e workflows do **Spec-Driven Development (SDD Puro)**.

Enquanto a programação conversacional (*vibe coding*) proporciona uma velocidade criativa fantástica, projetos que crescem sem uma especificação estruturada sofrem com "amnésia" de contexto entre sessões, desvios silenciosos de regras de negócio e acúmulo descontrolado de dívida técnica. 

O **SDD** canaliza o poder do Gemini em torno de artefatos vivos e versionados:
- **A especificação é a fonte da verdade**: Mudanças começam sempre na spec (`docs/sdd/`), nunca direto no código.
- **Engenharia de Contexto (P11)**: O estado da sessão não depende do histórico volátil do chat; é injetado silenciosamente no início de cada invocação via hooks.
- **Rastreabilidade e Quality Gates**: Requisitos em sintaxe formal **GEARS** derivam decisões de design, que derivam tarefas no ledger, que por sua vez são auditadas por um subagente validador blindado.

> 📖 **Manifesto e Fundamentação Teórica:**  
> Para entender a fundo os 11 Princípios Inegociáveis (P1–P11), a sintaxe GEARS, os Intent Blocks e o comparativo com outros frameworks, visite o repositório central:  
> 👉 **[sdd-standard/spec-driven-development](https://github.com/sdd-standard/spec-driven-development)**

---

## Instalação

O Antigravity suporta plugins tanto em nível de **workspace (projeto)** quanto em nível **global (usuário)**.

### Opção A — Instalação por Workspace (Recomendado para times / versionado)
Adicione o plugin dentro da pasta `.agents/plugins/sdd-workflow` na raiz do seu projeto:

```bash
# Na raiz do seu repositório/projeto:
git clone https://github.com/sdd-standard/sdd-antigravity.git .agents/plugins/sdd-workflow
```

> **Estrutura esperada:**
> ```text
> seu-projeto/
> ├── .agents/
> │   └── plugins/
> │       └── sdd-workflow/
> │           ├── plugin.json
> │           ├── hooks.json
> │           ├── rules/
> │           ├── skills/
> │           ├── agents/
> │           └── ...
> ```

### Opção B — Instalação Global (Disponível em todos os seus projetos no Antigravity)
Clone ou copie o plugin para a raiz de customizações globais do Antigravity no seu sistema:

- **Windows**: `%USERPROFILE%\.gemini\config\plugins\sdd-workflow\`
- **Linux/macOS**: `~/.gemini/config/plugins/sdd-workflow/`

No Windows (PowerShell):
```powershell
git clone https://github.com/sdd-standard/sdd-antigravity.git "$HOME\.gemini\config\plugins\sdd-workflow"
```

### Opção C — Registro Declarativo (`plugins.json`)
Você também pode declarar o plugin explicitamente no arquivo `.agents/plugins.json` (ou `~/.gemini/config/plugins.json`):

```json
{
  "plugins": [
    {
      "name": "sdd-workflow",
      "path": "./caminho/para/sdd-antigravity"
    }
  ]
}
```

---

## O que vem no pacote

| Componente | Conteúdo | Papel no SDD |
|---|---|---|
| `skills/` (7) | `sdd-init`, `sdd-adopt`, `sdd-change`, `sdd-design`, `sdd-tasks`, `sdd-implement`, `sdd-validate` | Habilidades executadas sob demanda pelo Gemini (`SKILL.md`) com Progressive Disclosure. |
| `rules/` | `sdd-core-rules.md` | Regras globais (`always_on`) que garantem os 11 princípios, sintaxe GEARS e impedem modificação de código sem task `In Progress`. |
| `agents/` | `sdd-validator/` | Subagente auditor isolado. Não altera código; aponta divergências (`arquivo:linha`) contra as specs e registra débitos no gate. |
| `hooks.json` | `sdd-session-start` (`PreInvocation`) | Injeta automaticamente a memória viva (`11-project-memory.md`) e status de tasks (`07-tasks.md`) no início de cada sessão (P11). |
| `templates/` | Templates completos para Constitution, Specs 00–10, `GEMINI.md`, delta-spec, proposal e memory. | Esqueletos que as skills copiam e adaptam ao inicializar projetos. |
| `scripts/` | `session-start.mjs`, `check-ids.mjs` | Automações determinísticas de contexto e validação mecânica de rastreabilidade de IDs. |

---

## Como Usar

### 1. Projeto Novo (Greenfield)
Peça ao assistente no Antigravity:
> *"Inicie um novo projeto usando a skill sdd-init"*

O assistente executará a entrevista da **Constitution**, gerará a árvore inicial `docs/sdd/` com as regras e criará `GEMINI.md` e `.agents/rules/sdd-project-rules.md` para governança editável do projeto.

Fluxo seguinte:
`sdd-design` ➔ `sdd-tasks` ➔ `sdd-implement` ➔ `sdd-validate` ➔ `sdd-change`.

---

### 2. Projeto Existente (Brownfield)
Peça ao assistente:
> *"Adote o SDD neste projeto com a skill sdd-adopt"*

O assistente analisa os padrões reais do repositório, gera a baseline mínima (`docs/sdd/constitution.md`, `00-project-brief.md`, memória e tasks) sem fazer engenharia reversa massiva e desnecessária.
A partir daí:
- **Evolução Contínua**: Mudanças usam `sdd-change` (proposal ➔ delta-spec ➔ tasks ➔ apply ➔ archive).
- **Spec-on-Touch**: Se uma mudança encostar em uma área sem spec prévia, o delta inclui a especificação mínima correspondente.

---

### 3. Alterações e Features (`sdd-change`)
Peça ao assistente:
> *"Quero propor uma mudança na feature X usando sdd-change"*

Gera a pasta `docs/sdd/changes/<nome>/` contendo:
1. `proposal.md` (Why e What)
2. `delta-spec.md` (Requisitos GEARS: ADDED / MODIFIED / REMOVED)
3. `tasks.md` (Ledger de execução com status)

---

### 4. Quality Gate e Validação (`sdd-validate`)
Ao concluir um milestone ou tarefa:
> *"Valide a implementação recente com sdd-validate"*

O subagente `sdd-validator` entra em cena:
- Executa a conferência mecânica com `scripts/check-ids.mjs`.
- Compara a implementação real com as especificações GEARS.
- Reporta divergências e alimenta o log de débitos técnicos em `docs/sdd/10-validation.md`.

---

## Princípios Garantidos pelo Plugin

- **P1 — Especificação no Centro**: Mudanças começam na spec, nunca no código.
- **P2 — Constitution Precede a Spec**: Regras inegociáveis de arquitetura e qualidade governam tudo.
- **P4/P5 — Rastreabilidade e GEARS**: Requisitos claros em sintaxe testável.
- **P11 — Estado Fora do Chat**: Memória viva persistida em Markdown e injetada a cada invocação via hooks.

---

## Licença

Distribuído sob a licença [MIT](./LICENSE).

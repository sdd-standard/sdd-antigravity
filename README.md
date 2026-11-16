# sdd-workflow — Plugin de Spec-Driven Development para Antigravity IDE (Gemini)

> **A implementação oficial do padrão Spec-Driven Development (SDD Puro v2.1) para o ecossistema Google Antigravity e Gemini.**

[![Standard: Pure SDD](https://img.shields.io/badge/Standard-Pure%20SDD%20v2.1-blue.svg)](https://github.com/sdd-standard/spec-driven-development)
[![Platform: Google Antigravity](https://img.shields.io/badge/Platform-Google%20Antigravity%20IDE-orange.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## Sobre o Projeto & Propósito

Este plugin operacionaliza no **Google Antigravity IDE** o conjunto de regras e workflows do **Spec-Driven Development (SDD Puro v2.1)**.

Enquanto a programação conversacional (*vibe coding*) proporciona uma velocidade criativa fantástica, projetos que crescem sem uma especificação estruturada sofrem com "amnésia" de contexto entre sessões, desvios silenciosos de regras de negócio e acúmulo descontrolado de dívida técnica. 

O **SDD Puro v2.1** canaliza o poder do Gemini em torno de artefatos vivos e versionados:
- **A especificação é a fonte da verdade (P1/P2)**: Mudanças começam sempre na spec (`docs/sdd/`), governada pela `constitution.md`.
- **Entrevista Escopada, Baixa Fricção e Fatiamento de Escopo**: O arquiteto (`sdd-architect`) inspeciona **apenas** o código do domínio em pauta (jamais varre o repositório inteiro), realiza diagnóstico de `Validate-Gap`, faz poucas perguntas cirúrgicas com recomendação padrão e sugere fragmentar ou estreitar *changes* grandes demais.
- **Engenharia de Contexto com Paginação Elástica (P11)**: O estado da sessão é injetado silenciosamente no início de cada invocação via hooks (`session-start.mjs`), com teto de 150 linhas por arquivo, parágrafos curtos (máx. 4–5 linhas) e suporte nativo a transbordo estruturado (`10-validation-02.md`, `11-project-memory-02.md`) que se auto-exclui quando as pendências são sanadas.
- **Quality Gate 100% Passivo em 3 Camadas**:
  - **Camada 0 (Piso Mecânico Passivo):** Guarda determinística de IDs (`check-ids.mjs`) + comprovação de testes executados com `exit code 0` após a última edição.
  - **Camadas 1 e 2 (`sdd-validator` 100% Read-Only):** Auditoria dividida em **Estágio 1 (Conformidade Estrita GEARS e Anti-Scope-Creep)** e **Estágio 2 (Qualidade, Constitution e Infra Global)**. Nenhuma camada do gate edita arquivos — apenas reporta divergências para o implementador corrigir.

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
| `skills/` (8) | `sdd-init`, `sdd-adopt`, `sdd-specify`, `sdd-change`, `sdd-design`, `sdd-tasks`, `sdd-implement`, `sdd-validate` | Habilidades executadas sob demanda pelo Gemini (`SKILL.md`) com Progressive Disclosure. |
| `rules/` | `sdd-core-rules.md` | Regras globais (`always_on`) que garantem os 11 princípios, sintaxe GEARS, paginação elástica e impedem modificação de código sem task `In Progress`. |
| `agents/` (3) | `sdd-architect/`, `sdd-validator/`, `sdd-doc-writer/` | Architect: especificação, entrevista escopada e design. Validator: auditor 100% passivo (`read-only`) em 2 estágios. Doc-writer: redator de README e docs de features. |
| `hooks.json` | `sdd-session-start` (`PreInvocation`) | Injeta automaticamente a memória viva (`11-project-memory.md`), avisos de paginação elástica (`-02.md`) e status de tasks (`07-tasks.md`) no início de cada sessão (P11). |
| `templates/` | Templates completos para Constitution, `GEMINI.md`, `specs/00..11` (incluindo `11-project-memory.md`), `changes/` e `archive/`. | Esqueletos que as skills copiam e adaptam na estrutura canônica flat `docs/sdd/`. |
| `scripts/` | `session-start.mjs`, `check-ids.mjs` | Automações determinísticas de contexto e validação mecânica de rastreabilidade de IDs. |

---

## Como Usar

### 1. Projeto Novo (Greenfield)
Peça ao assistente no Antigravity:
> *"Inicie um novo projeto usando a skill sdd-init"*

O assistente executará a entrevista enxuta da **Constitution**, gerará a árvore canônica flat `docs/sdd/` (`00` a `11`) e criará `GEMINI.md` e `.agents/rules/sdd-project-rules.md` para governança editável do projeto.

Fluxo seguinte:
`sdd-specify` ➔ `sdd-design` ➔ `sdd-tasks` ➔ `sdd-implement` ➔ `sdd-change`.

> **Nota:** A validação (Quality Gate Passivo em 3 Camadas) ocorre automaticamente ao fechar milestones dentro da skill `sdd-implement`. A skill `sdd-validate` está disponível para validações manuais a qualquer momento.

---

### 2. Projeto Existente (Brownfield)
Peça ao assistente:
> *"Adote o SDD neste projeto com a skill sdd-adopt"*

O assistente analisa os manifestos e padrões reais do repositório, gera a baseline mínima (`docs/sdd/constitution.md`, `00-project-brief.md`, `02`, `04`, `05`, `07`, `10` e `11-project-memory.md`) sem fazer engenharia reversa massiva e desnecessária.
A partir daí:
- **Evolução Contínua**: Mudanças usam `sdd-change` (`proposal` ➔ `delta-spec` ➔ `tasks` ➔ `apply` ➔ `archive`).
- **Spec-on-Touch & Validate-Gap**: O agente inspeciona apenas o domínio tocado pela mudança, diagnostica o gap contra o código existente e inclui a especificação mínima correspondente no delta.

---

### 3. Alterações e Features (`sdd-change`)
Peça ao assistente:
> *"Quero propor uma mudança na feature X usando sdd-change"*

Inspeciona escopadamente o módulo em pauta, sugere fatiar caso a mudança seja grande demais e gera `docs/sdd/changes/<nome>/` contendo:
1. `proposal.md` (Intent Block, Why e What)
2. `delta-spec.md` (Requisitos GEARS: `ADDED` / `MODIFIED` / `REMOVED`)
3. `tasks.md` (Ledger de execução com status)

---

### 4. Quality Gate 100% Passivo em 3 Camadas (`sdd-validate`)
Ao concluir um milestone ou tarefa:
> *"Valide a implementação recente com sdd-validate"*

O Gate opera em 3 camadas estritamente passivas (`read-only`):
1. **Camada 0 (Piso Mecânico):** Executa `scripts/check-ids.mjs` e confirma execução real dos testes.
2. **Camada 1 (Estágio 1 do `sdd-validator`):** Audita conformidade cláusula a cláusula com as especificações GEARS e ausência de escopo inventado.
3. **Camada 2 (Estágio 2 do `sdd-validator`):** Audita qualidade, `constitution.md` e infraestrutura global, alimentando `docs/sdd/10-validation.md` (com paginação elástica `10-validation-02.md` quando necessário).

---

## Licença

Distribuído sob a licença [MIT](./LICENSE).

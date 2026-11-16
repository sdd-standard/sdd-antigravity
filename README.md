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
- **Engenharia de Contexto com Paginação Elástica (P11)**: O estado da sessão é injetado silenciosamente no início de cada invocação via hooks (`session-start.mjs`), com gatilho de paginação de 150 linhas ou 7.000/16.000 caracteres por arquivo (sem cortar o conteúdo das dívidas) e suporte nativo a transbordo estruturado (`10-validation-02.md`, `11-project-memory-02.md`) que se auto-exclui quando as pendências são sanadas.
- **Quality Gate 100% Passivo em 3 Camadas**:
  - **Camada 0 (Piso Mecânico Passivo):** Guarda determinística de IDs (`check-ids.mjs`) + comprovação de testes executados com `exit code 0` após a última edição.
  - **Camadas 1 e 2 (`sdd-validator` 100% Read-Only):** Auditoria dividida em **Estágio 1 (Conformidade Estrita GEARS e Anti-Scope-Creep)** e **Estágio 2 (Qualidade, Constitution e Infra Global)**. Nenhuma camada do gate edita arquivos — apenas reporta divergências para o implementador corrigir.

> 📖 **Manifesto e Fundamentação Teórica:**  
> Para entender a fundo os 11 Princípios Inegociáveis (P1–P11), a sintaxe GEARS, os Intent Blocks e o comparativo com outros frameworks, visite o repositório central:  
> 👉 **[sdd-standard/spec-driven-development](https://github.com/sdd-standard/spec-driven-development)**

---

## Instalação

O Antigravity suporta plugins tanto em nível de **workspace (projeto)** quanto em nível **global (usuário)**.

> **Validado no Antigravity IDE 2.7.0 (Windows):** a **Opção B (global)** — o IDE carregou o plugin, executou os hooks `PreInvocation` e `PostToolUse` e o Say-Do Gate funcionou de ponta a ponta. As opções A e C ainda não foram verificadas no IDE.

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
| `hooks.json` | `sdd-session-start` (`PreInvocation`) · `sdd-say-do-record` (`PostToolUse`) | O primeiro injeta automaticamente a memória viva (`11-project-memory.md`), a raiz do plugin (resolve `<raiz-do-plugin>` nas skills), avisos de paginação elástica (`-02.md`, gatilho de 150 linhas ou de caracteres), tasks ativas (`07-tasks.md`) e changes ativas no início de cada invocação (P11). O segundo registra passivamente edições de arquivo e comandos de terminal no ledger do Say-Do Gate. |
| `templates/` | Templates completos para Constitution, `GEMINI.md`, `specs/00..11` (incluindo `11-project-memory.md`), `changes/` e `archive/`. | Esqueletos que as skills copiam e adaptam na estrutura canônica flat `docs/sdd/`. |
| `scripts/` | `session-start.mjs`, `check-ids.mjs`, `say-do-record.mjs`, `say-do-audit.mjs`, `say-do-lib.mjs`, `transcript-exit.mjs` | Automações determinísticas de contexto, validação mecânica de rastreabilidade de IDs e Say-Do Gate (ledger de execução fora do repositório, na pasta temporária do SO). |

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
1. **Camada 0 (Piso Mecânico):** Executa `scripts/check-ids.mjs` (IDs órfãos) e `scripts/say-do-audit.mjs` (*Say-Do Gate*: comprova, pelo ledger do hook `PostToolUse`, que os testes rodaram com `exit code 0` após a última edição de código). Sem evidência não há aprovação, e com a Camada 0 falhando o validador não é acionado.
2. **Camada 1 (Estágio 1 do `sdd-validator`):** Audita conformidade cláusula a cláusula com as especificações GEARS e ausência de escopo inventado.
3. **Camada 2 (Estágio 2 do `sdd-validator`):** Audita qualidade, `constitution.md` e infraestrutura global, alimentando `docs/sdd/10-validation.md` (com paginação elástica `10-validation-02.md` quando necessário).

---

## Say-Do Gate no Antigravity IDE (comportamento validado na 2.7.0)

O teste real no IDE mostrou três particularidades da plataforma, já tratadas pelo plugin:

1. **O exit code não vem no payload.** O `PostToolUse` de um `run_command` chega com `error` vazio mesmo quando o comando sai com código 1. O código real só aparece no transcript da conversa (`transcriptPath`), no passo `stepIdx` (`Command exited with code N.`).
2. **O transcript é gravado depois do hook.** No momento em que o `PostToolUse` dispara, esse passo ainda não existe. Por isso `say-do-record.mjs` grava o comando com o exit code **pendente** (`transcriptPath` + `stepIdx`) e `say-do-audit.mjs` resolve o código na hora da auditoria (`transcript-exit.mjs`). Sem o passo, ou com o comando em background, o código fica **indeterminado e nunca conta como prova** (fail-closed).
3. **Nomes das ferramentas na 2.x:** `write_file` e `edit_file` (argumento `Path`) e `run_command` (`CommandLine`); os nomes antigos (`write_to_file`, `replace_file_content`) continuam aceitos. O hook roda com o diretório do próprio `hooks.json` como diretório de trabalho, então os caminhos `./scripts/...` resolvem dentro do plugin.

Rode a suíte de testes do gate de forma **síncrona** (aguardando o comando terminar): um comando que vai para background não registra exit code.

---

## Orçamento de injeção de contexto (premissa não confirmada)

A documentação do Antigravity não publica um limite para o contexto injetado por hooks. Como outras plataformas agênticas cortam em 10.000 caracteres, **este plugin assume o mesmo limite**, somando todos os `injectSteps` de uma invocação. **Essa limitação é uma previsão nossa e não foi confirmada pelos desenvolvedores do Antigravity**; se um limite oficial for publicado, o orçamento em `scripts/session-start.mjs` (`INJECTION_BUDGET`) e o gatilho da memória devem ser revistos.

O hook de início de sessão nunca depende desse corte. Ele monta a injeção por prioridade, dentro de **10.000 caracteres**:

1. alertas de paginação, shards `-02.md`, tasks ativas (até 15, títulos com até 80 caracteres) e changes ativas (até 10) — juntos, no máximo cerca de 3.000 caracteres;
2. o `11-project-memory.md` **inteiro**, se couber no que sobrou;
3. se não couber: só as seções **Estado Atual**, **Próximos Passos Imediatos** e **Pendências em Aberto**, precedidas do aviso `MEMÓRIA INCOMPLETA NESTA INJEÇÃO`, que manda o agente ler o arquivo inteiro antes de agir e aplicar a higiene (rotação ou shard `-02.md`).

Por isso o gatilho de paginação da memória neste plugin é **150 linhas ou 7.000 caracteres** (10.000 menos a reserva de ~3.000). O `10-validation.md` não é injetado (o hook só cita os shards) e segue o gatilho canônico de 150 linhas ou 16.000 caracteres. A `constitution.md` não é injetada por hook: o agente a lê inteira com a ferramenta de leitura, sem limite.

---

## Licença

Distribuído sob a licença [MIT](./LICENSE).

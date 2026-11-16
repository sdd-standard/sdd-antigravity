---
name: sdd-change
description: Inicia o fluxo de Delta Specs para propor uma alteração no sistema (proposal → apply → archive) com Inspeção Escopada, Entrevista de Baixa Fricção, Fatiamento de Escopo, Validate-Gap e Paginação Elástica.
---

# SDD Change (Delta Specs — Ciclo Completo v2.1)

O fluxo `change` é usado para alterações evolutivas no projeto, utilizando Delta Specs.
Nunca edite os artefatos base em `docs/sdd/` diretamente após o baseline.

## Fluxo de 3 Estados: `proposal` → `apply` → `archive`

### 1. Proposal (Com Inspeção Escopada e Fatiamento Proativo)
1. **Inspeção Estritamente Escopada (*Scoped Inspection*)**:
   - Ao ouvir o objetivo da mudança do usuário, **NUNCA leia ou escaneie o código legado inteiro do repositório**.
   - Localize e leia **apenas os arquivos/módulos do domínio que será modificado ou discutido**, além de `constitution.md`, `11-project-memory.md` e `10-validation.md` (verificando se já existem dívidas ativas daquele domínio).
2. **Detecção de Change Grande Demais (*Scope Slicing*)**:
   - Se detectar que a mudança pedida pelo usuário é muito extensa (ex.: altera múltiplos *bounded contexts*, mistura grande refatoração com nova feature ou geraria dezenas de tasks), **pare antes de criar arquivos e proponha ao usuário**:
     - **Opção A (Fragmentar):** Dividir em múltiplas changes menores e sequenciais (`changes/<parte-1>/`, `changes/<parte-2>/`); ou
     - **Opção B (Estreitar + Registrar Dívida/Futuro):** Focar a change atual apenas no núcleo imediato e registrar as demais modificações solicitadas como **dívidas ativas / escopo futuro** em `docs/sdd/10-validation.md` (ou `06-roadmap.md`).
3. **Entrevista de Estresse de Baixa Fricção (Anti-Burocracia)**:
   - Com base no que você viu no código do domínio tocado, faça no máximo **3 a 5 perguntas cirúrgicas** sobre aspectos que o usuário não previu (contratos quebrados, migração de dados, falhas, segurança), **sempre sugerindo uma opção recomendada**.
4. **Geração e Aprovação da Proposal**:
   - Crie a estrutura `docs/sdd/changes/<nome-da-mudanca>/`.
   - Escreva o `proposal.md` contendo: `Intent Block`, `Why`, `What`, `Scope (in/out)`, `Success Criteria` e `Artefatos impactados`.
   - Peça aprovação da `proposal.md` ao usuário.

---

### 2. Validate-Gap, Delta Spec + Tasks
5. **Diagnóstico `Validate-Gap` (Brownfield)**:
   - Confronte o código atual do módulo tocado com a proposta aprovada, identificando o que já existe (*as-built*) vs. o que será adicionado/modificado/removido.
   - **Spec-on-Touch**: Em brownfield, se a área tocada nunca foi especificada, o delta `ADDED` inclui a spec *as-built* mínima daquela área.
6. **Escrita do `delta-spec.md`**:
   - Escreva o `delta-spec.md` com seções `ADDED`, `MODIFIED` e `REMOVED`. Todo requisito DEVE usar a sintaxe GEARS canônica:
     `[Where <static>] [While <state>] [When <trigger>] the <subject> shall <behavior>.` (keywords em inglês).
   - Peça aprovação do `delta-spec.md`.
7. **Tasks e Gate Pré-Apply Passivo**:
   - Quebre a mudança em tarefas atômicas no `tasks.md` dentro da pasta de change (com todos os campos canônicos: `ID`, `Title`, `Goal`, `Related Requirements`, `Done When`, `Status`).
   - Acione o **`sdd-validator` (100% passivo / read-only)** para conferir o delta contra a `constitution.md` e rastreabilidade (gate pré-apply).

---

### 3. Apply (implementação via `sdd-implement`)
8. Instrua o usuário a usar a skill `sdd-implement` para executar as tarefas do ledger da mudança (`docs/sdd/changes/<nome>/tasks.md`).

#### Novas tasks descobertas durante o Apply
- **Subtarefa técnica** (refinamento do mesmo requisito): declare a task em `tasks.md` com todos os campos canônicos e consulte/informe o usuário antes de executá-la. NUNCA implemente código sem task formal (P1/P8).
- **Novo comportamento de negócio** ou alteração de requisito existente: atualize o `delta-spec.md` PRIMEIRO (`ADDED` ou `MODIFIED` em GEARS), obtenha consentimento do usuário, e só então crie a task.

---

### 4. Archive (Gate Passivo em 3 Camadas + Consolidação + Higiene Elástica)
Ao concluir TODAS as tasks da mudança:

9. **Gate Final Passivo em 3 Camadas**:
   - Rode a **Camada 0 Passiva**: guarda mecânica (`node "scripts/check-ids.mjs" .`) + comprovação de testes executados com `exit code 0` após a última edição.
   - Acione o **`sdd-validator` (100% passivo)** para auditar a implementação contra os requisitos do delta em 2 estágios (`1. Conformidade GEARS` e `2. Qualidade & Infra Global`).
10. **Consolide na baseline**: incorpore os itens do `delta-spec.md` nos artefatos centrais de `docs/sdd/`:
    - `ADDED`/`MODIFIED` → `02-spec.md`, `03-requirements.md`, `04-domain-model.md`, `05-design.md`, `08-acceptance.md`
    - Atualize `09-traceability.md` com a nova cadeia `Intent → FR → DES → TASK → AC`
    - `REMOVED` → remova ou deprecie nos artefatos correspondentes
11. **Higiene de dívida e Paginação Elástica (*Overflow Sharding*)**:
    - Se a mudança resolveu débitos do `10-validation.md` (ou `10-validation-02.md`), **MOVA** essas entradas para `docs/sdd/archive/validation-log.md` com `"Fechado por: sdd-change <nome>"`. O `10-validation.md` guarda SÓ dívida ativa.
    - Se novos achados abertos fizerem `10-validation.md` passar de 150 linhas, crie/atualize `10-validation-02.md` e linke no topo.
    - Se, após sanar dívidas, o conteúdo de `10-validation-02.md` voltar a caber no `10-validation.md` principal (`≤ 150 linhas`), **consolide no arquivo principal, remova o link e EXCLUA o arquivo `10-validation-02.md`**.
12. **Arquive a pasta**: mova `docs/sdd/changes/<nome>/` inteira para `docs/sdd/archive/<nome>/`.
13. **Atualize a memória**: registre o fechamento em `11-project-memory.md`. Mantenha apenas as ~5 mudanças mais recentes no memory; mudanças anteriores já consolidadas ficam referenciadas em `docs/sdd/archive/memory-history.md` (compactando e excluindo `11-project-memory-02.md` se não for mais necessário).

> [!IMPORTANT]
> Hotfix emergencial: pode pular o delta, mas registre em `11-project-memory.md` e confira se a spec continua verdadeira; se não, crie a mudança retroativa.

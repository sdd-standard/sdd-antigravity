// PreInvocation: injeta o estado SDD do projeto no início de cada invocação.
//
// ORÇAMENTO DE INJEÇÃO (premissa do plugin, NÃO confirmada pelos desenvolvedores do Antigravity):
// a documentação do Antigravity não publica um limite para o contexto injetado por hook. Outras
// plataformas agênticas cortam em 10.000 caracteres, então este hook assume o mesmo orçamento,
// somando TODOS os `injectSteps`, e nunca depende de um corte da plataforma. Prioridade:
//   1. raiz do plugin, alertas, tasks ativas e changes ativas (pequenos e com tamanho máximo);
//   2. a memória (`11-project-memory.md`) inteira, se couber no que sobra;
//   3. se não couber: só as seções críticas (Estado Atual, Próximos Passos, Pendências) e uma
//      instrução explícita para ler o arquivo inteiro antes de agir.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const INJECTION_BUDGET = 10000; // premissa (não confirmada) — ver cabeçalho
const SAFETY_MARGIN = 300;
const LINE_CAP = 150;
// Gatilho de paginação (linhas OU caracteres, o que vier primeiro). Não corta nada: indica que é hora de
// rotacionar ou criar o shard `-02.md`. Memória: orçamento de 10.000 − ~3.000 reservados para alertas,
// tasks e changes. Validation: não é injetado; o teto é higiene de leitura do padrão.
const CHAR_CAPS = { '11-project-memory.md': 7000, '10-validation.md': 16000 };
const MAX_TASKS = 15;
const MAX_CHANGES = 10;
const MAX_TITLE = 80;

// Raiz do plugin calculada a cada execução a partir da localização deste script (nunca gravada
// em arquivo do projeto): resolve o marcador `<raiz-do-plugin>` usado nas skills, em qualquer projeto.
const PLUGIN_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Aceita o formato canônico do template (`TASK-001` sozinho na linha + `Status: ...`)
// e a variante em Markdown (`### TASK-001` + `- **Status:** ...`).
const RE_TASK_HEADER = /^\s*(?:#{1,6}\s*)?(?:\*\*)?(TASK-[A-Za-z0-9_-]*\d)(?:\*\*)?\s*(?:[—–:-]\s*(.*))?$/;
const fieldRe = (name) => new RegExp(`^\\s*(?:[-*]\\s+)?(?:\\*\\*)?${name}(?::\\*\\*|\\*\\*:|:)[ \\t]*(.*)$`, 'i');
const RE_STATUS = fieldRe('Status');
const RE_TITLE = fieldRe('Title');
const RE_ACTIVE = /^(Pending|In Progress|Blocked)\b/i;

// Texto antes da primeira task (legenda do ledger) e blocos "Registro do gate" (linhas `>`) são ignorados.
function parseActiveTasks(text) {
  const tasks = [];
  let current = null;
  let fenced = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const header = line.match(RE_TASK_HEADER);
    if (header) {
      current = { id: header[1], title: (header[2] || '').trim(), status: null };
      tasks.push(current);
      continue;
    }
    if (!current || line.trimStart().startsWith('>')) continue;
    if (current.status === null) {
      const s = line.match(RE_STATUS);
      if (s) { current.status = s[1].trim().replace(/^\*+|\*+$/g, '').trim(); continue; }
    }
    if (!current.title) {
      const t = line.match(RE_TITLE);
      if (t) current.title = t[1].trim();
    }
  }
  return tasks.filter(t => t.status && RE_ACTIVE.test(t.status));
}

function readOr(file, fallback = '') {
  try { return fs.readFileSync(file, 'utf8'); } catch { return fallback; }
}

const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
// Seções críticas da memória, em ordem de prioridade (títulos do template; aceita variações).
const CRITICAL_SECTIONS = [/^estado atual|^current state/, /^proximos passos|^next steps/, /^pendencias|^open items|^blockers/];

function criticalSections(md) {
  const lines = md.split(/\r?\n/);
  const picked = [];
  for (const re of CRITICAL_SECTIONS) {
    for (let i = 0; i < lines.length; i++) {
      const h = lines[i].match(/^(#{1,6})\s+(.*)$/);
      if (!h || !re.test(norm(h[2]))) continue;
      let j = i + 1;
      while (j < lines.length) {
        const n = lines[j].match(/^(#{1,6})\s+/);
        if (n && n[1].length <= h[1].length) break;
        j++;
      }
      picked.push(lines.slice(i, j).join('\n').trimEnd());
      break;
    }
  }
  return picked.join('\n\n');
}

function fitLines(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, Math.max(0, max));
  const nl = cut.lastIndexOf('\n');
  return nl > 0 ? cut.slice(0, nl) : cut;
}

function memoryWithinBudget(memory, budget) {
  if (memory.length <= budget) return memory;
  const notice =
    `> MEMÓRIA INCOMPLETA NESTA INJEÇÃO: \`docs/sdd/11-project-memory.md\` tem ${memory.length} caracteres e ` +
    `não cabe no orçamento de injeção assumido para o Antigravity (${INJECTION_BUDGET}). Abaixo vão só as seções críticas. ` +
    `Leia o arquivo inteiro com a ferramenta de leitura antes de agir e aplique a higiene (rotação para ` +
    `\`archive/memory-history.md\` ou shard \`-02.md\`).\n\n`;
  const core = criticalSections(memory) || memory;
  return notice + fitLines(core, budget - notice.length);
}

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  let input;
  try {
    input = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
  } catch (e) {
    console.error('Failed to parse stdin:', e);
    process.exit(1);
  }

  const workspace = input.workspacePaths?.[0] || process.cwd();

  // Raiz do plugin: emitida mesmo sem `docs/sdd/` porque `sdd-init`/`sdd-adopt` precisam dela
  // para copiar os templates antes de a árvore existir.
  const rootStep = {
    ephemeralMessage: `SDD: raiz do plugin sdd-workflow = \`${PLUGIN_ROOT.replace(/\\/g, '/')}\` (substitui \`<raiz-do-plugin>\` nas skills; não grave este caminho em arquivos do projeto).`
  };

  const sddRoot = path.join(workspace, 'docs', 'sdd');
  if (!fs.existsSync(sddRoot)) {
    console.log(JSON.stringify({ injectSteps: [rootStep] }));
    return;
  }

  // ── Prioridade 1: alertas, shards, tasks e changes (tamanho limitado) ──
  const fixedSteps = [];

  const overCap = Object.entries(CHAR_CAPS)
    .map(([name, charCap]) => {
      const text = readOr(path.join(sddRoot, name));
      return { name, lines: text ? text.split(/\r?\n/).length : 0, chars: text.length, charCap };
    })
    .filter(f => f.lines > LINE_CAP || f.chars > f.charCap)
    .map(f => `\`docs/sdd/${f.name}\` (${f.lines} linhas, ${f.chars} caracteres; teto ${LINE_CAP} linhas ou ${f.charCap} caracteres)`);
  if (overCap.length > 0) {
    fixedSteps.push({
      ephemeralMessage: `SDD Context — ALERTA de Paginação Elástica: ${overCap.join(', ')} ultrapassa(m) o teto. Antes de prosseguir, aplique a higiene: mova itens resolvidos/antigos para \`docs/sdd/archive/\` e, se o conteúdo ATIVO ainda não couber, crie o shard \`-02.md\` com índice no topo. Nunca resuma nem corte o conteúdo de uma dívida para caber.`
    });
  }

  try {
    const overflowFiles = fs.readdirSync(sddRoot).filter(name => /-0[2-9]\.md$/i.test(name)).sort();
    if (overflowFiles.length > 0) {
      const listStr = overflowFiles.map(f => `\`docs/sdd/${f}\``).join(', ');
      fixedSteps.push({
        ephemeralMessage: `SDD Context — Paginação Elástica Ativa: Existem arquivos complementares de memória/dívida (${listStr}). Consulte-os sob demanda se a tarefa atual tocar nos escopos indicados no cabeçalho principal.`
      });
    }
  } catch {}

  const tasksPath = path.join(sddRoot, '07-tasks.md');
  if (fs.existsSync(tasksPath)) {
    const active = parseActiveTasks(fs.readFileSync(tasksPath, 'utf8'));
    if (active.length > 0) {
      const shown = active.slice(0, MAX_TASKS).map(t => `- ${t.id} [${t.status}] ${clip(t.title || '(sem título)', MAX_TITLE)}`);
      const more = active.length > MAX_TASKS ? `\n(+${active.length - MAX_TASKS} não exibidas)` : '';
      fixedSteps.push({
        ephemeralMessage: `SDD Context: Tasks não concluídas (${active.length}):\n${shown.join('\n')}${more}\n\nSiga o protocolo: confirme estado e próximo passo em até 5 linhas antes de agir.`
      });
    }
  }

  try {
    const changesDir = path.join(sddRoot, 'changes');
    const names = fs.existsSync(changesDir)
      ? fs.readdirSync(changesDir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort()
      : [];
    if (names.length > 0) {
      const lines = names.slice(0, MAX_CHANGES).map(name => {
        const active = parseActiveTasks(readOr(path.join(changesDir, name, 'tasks.md')));
        const inProgress = active.filter(t => /^In Progress\b/i.test(t.status)).length;
        const label = clip(name, MAX_TITLE);
        return active.length > 0
          ? `- \`changes/${label}/\` — ${active.length} task(s) não concluída(s), ${inProgress} In Progress`
          : `- \`changes/${label}/\` — sem tasks ativas (verifique se falta o archive)`;
      });
      const more = names.length > MAX_CHANGES ? `\n(+${names.length - MAX_CHANGES} changes não exibidas)` : '';
      fixedSteps.push({ ephemeralMessage: `SDD Context: Changes ativas (${names.length}):\n${lines.join('\n')}${more}` });
    }
  } catch {}

  // ── Prioridade 2: memória no orçamento que sobrou (somando todos os steps) ──
  const injectSteps = [rootStep];
  const memoryPath = path.join(sddRoot, '11-project-memory.md');
  if (fs.existsSync(memoryPath)) {
    const prefix = 'SDD Context: Memory state loaded (`docs/sdd/11-project-memory.md`):\n```markdown\n';
    const suffix = '\n```';
    const used = [rootStep, ...fixedSteps].reduce((n, s) => n + s.ephemeralMessage.length, 0);
    const budget = INJECTION_BUDGET - SAFETY_MARGIN - used - prefix.length - suffix.length;
    const memory = fs.readFileSync(memoryPath, 'utf8').trim();
    injectSteps.push({ ephemeralMessage: prefix + memoryWithinBudget(memory, budget) + suffix });
  }
  injectSteps.push(...fixedSteps);

  console.log(JSON.stringify({ injectSteps }));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

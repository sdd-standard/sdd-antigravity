import fs from 'fs';
import path from 'path';

async function main() {
  // Read stdin
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const inputStr = Buffer.concat(chunks).toString('utf-8');
  let input;
  try {
    input = JSON.parse(inputStr);
  } catch (e) {
    console.error("Failed to parse stdin:", e);
    process.exit(1);
  }

  const workspace = input.workspacePaths?.[0] || process.cwd();

  const sddRoot = path.join(workspace, 'docs', 'sdd');
  if (!fs.existsSync(sddRoot)) {
    // Projeto sem SDD: silencioso
    console.log(JSON.stringify({ injectSteps: [] }));
    return;
  }

  const memoryPath = path.join(sddRoot, '11-project-memory.md');
  const tasksPath = path.join(sddRoot, '07-tasks.md');

  const injectSteps = [];

  // Camada 1: Memory (always inject — it's the index/pointer for everything)
  if (fs.existsSync(memoryPath)) {
    const memory = fs.readFileSync(memoryPath, 'utf8');
    injectSteps.push({
      ephemeralMessage: "SDD Context: Memory state loaded (`docs/sdd/11-project-memory.md`):\n```markdown\n" + memory + "\n```"
    });
  }

  // Camada 1b: Detecção de Paginação Elástica (Overflow Shards -02.md, -03.md)
  try {
    const entries = fs.readdirSync(sddRoot);
    const overflowFiles = entries
      .filter(name => /-0[2-9]\.md$/i.test(name))
      .sort();
    if (overflowFiles.length > 0) {
      const listStr = overflowFiles.map(f => `\`docs/sdd/${f}\``).join(', ');
      injectSteps.push({
        ephemeralMessage: `SDD Context — Paginação Elástica Ativa: Existem arquivos complementares de memória/dívida (${listStr}). Consulte-os sob demanda se a tarefa atual tocar nos escopos indicados no cabeçalho principal.`
      });
    }
  } catch {}

  // Camada 1c: Tasks — filtered to active only (Pending/In Progress/Blocked), max 15
  // Token-efficient: does NOT load changes/*/tasks.md (those are loaded on-demand by skills)
  if (fs.existsSync(tasksPath)) {
    const tasks = fs.readFileSync(tasksPath, 'utf8');
    const blocks = tasks.split(/\n(?=TASK-)/);
    const active = blocks
      .filter(b => /Status:\s*(Pending|In Progress|Blocked)/i.test(b))
      .map(b => {
        const id = b.match(/TASK-[A-Za-z0-9_-]+/)?.[0] || '?';
        const title = b.match(/Title:\s*(.+)/)?.[1]?.trim() || '?';
        const status = b.match(/Status:\s*(.+)/)?.[1]?.trim() || '?';
        return `- ${id} [${status}] ${title}`;
      })
      .slice(0, 15);

    if (active.length > 0) {
      injectSteps.push({
        ephemeralMessage: `SDD Context: Tasks não concluídas (${active.length}):\n${active.join("\n")}\n\nSiga o protocolo: confirme estado e próximo passo em até 5 linhas antes de agir.`
      });
    }
  }

  console.log(JSON.stringify({ injectSteps }));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

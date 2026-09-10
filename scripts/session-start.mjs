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
  
  // We only care about injecting at the very beginning of the loop or session.
  // We can do it on every invocation, but ephemeralMessages are transient.
  
  const memoryPath = path.join(workspace, 'docs', 'sdd', '11-project-memory.md');
  const tasksPath = path.join(workspace, 'docs', 'sdd', '07-tasks.md');

  const injectSteps = [];

  if (fs.existsSync(memoryPath)) {
    const memory = fs.readFileSync(memoryPath, 'utf8');
    injectSteps.push({
      ephemeralMessage: "SDD Context: Memory state loaded:\n```markdown\n" + memory + "\n```"
    });
  }

  if (fs.existsSync(tasksPath)) {
    const tasks = fs.readFileSync(tasksPath, 'utf8');
    injectSteps.push({
      ephemeralMessage: "SDD Context: Current Tasks status:\n```markdown\n" + tasks + "\n```"
    });
  }

  console.log(JSON.stringify({ injectSteps }));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

// PostToolUse (Antigravity): alimenta passivamente o ledger do Say-Do Gate.
// Nunca bloqueia nem altera a ferramenta: qualquer erro aqui é engolido e a saída é sempre `{}`.
//
// Contrato do Antigravity (docs/hooks): stdin traz `toolCall: { name, args }`, `error`
// (vazio em sucesso; ex.: "exit status 1" em falha) e `workspacePaths`.
//
// Limitação conhecida: se o `run_command` for para background (comando mais longo que
// `WaitMsBeforeAsync`), o resultado final não chega a este hook. Por isso as skills pedem que a
// suíte de testes do gate seja executada de forma síncrona, aguardando a conclusão.
import { appendEvent, findProjectRoot, terminalEvent, writeEvent } from "./say-do-lib.mjs";

const WRITE_TOOLS = new Set(["write_to_file", "replace_file_content", "multi_replace_file_content"]);

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));

  const root = findProjectRoot(input.workspacePaths?.[0] ?? process.cwd());
  if (!root) return; // projeto sem docs/sdd/: silencioso, custo zero

  const name = input.toolCall?.name ?? "";
  const args = input.toolCall?.args ?? {};
  const error = String(input.error ?? "").trim();
  const base = { session: input.conversationId ?? null };

  if (name === "run_command") {
    const command = String(args.CommandLine ?? args.command ?? "");
    let exitCode = 0;
    if (error) {
      const m = /exit (?:status|code) (-?\d+)/i.exec(error);
      exitCode = m ? Number(m[1]) : null; // falhou sem exit code legível: indeterminado
    }
    if (command) appendEvent(root, { ...base, ...terminalEvent(command, exitCode) });
  } else if (WRITE_TOOLS.has(name) && !error) {
    appendEvent(root, { ...base, ...writeEvent(args.TargetFile ?? args.AbsolutePath ?? args.path ?? "") });
  }
}

main().catch(() => {}).finally(() => {
  console.log("{}");
});

// PostToolUse (Antigravity): alimenta passivamente o ledger do Say-Do Gate.
// Nunca bloqueia nem altera a ferramenta: qualquer erro aqui é engolido e a saída é sempre `{}`.
//
// Contrato observado no Antigravity IDE 2.7.0: stdin traz `toolCall: { name, args }`, `stepIdx`,
// `transcriptPath`, `error` e `workspacePaths`. O exit code do `run_command` NÃO vem no `error`
// (fica vazio mesmo com código 1) e, quando o hook dispara, o transcript ainda não tem o resultado.
// Por isso o evento guarda `pending: { transcriptPath, stepIdx }` e o `say-do-audit.mjs` resolve o
// código na hora da auditoria (ver transcript-exit.mjs). Sem evidência → indeterminado (fail-closed).
//
// Limitação conhecida: se o `run_command` for para background (comando mais longo que
// `WaitMsBeforeAsync`), o transcript não registra o exit code e o evento fica indeterminado. Por isso as
// skills pedem que a suíte de testes do gate seja executada de forma síncrona, aguardando a conclusão.
import { appendEvent, findProjectRoot, terminalEvent, writeEvent } from "./say-do-lib.mjs";
import { exitCodeFromTranscript } from "./transcript-exit.mjs";

// Nomes das ferramentas de escrita: `write_file`/`edit_file` (IDE 2.x) e os nomes antigos (`write_to_file`, `replace_file_content`...).
const WRITE_TOOLS = new Set(["write_file", "edit_file", "write_to_file", "replace_file_content", "multi_replace_file_content"]);

// Formato antigo/documentado: "exit status N" no `error`.
const EXIT_IN_ERROR_RE = /exit(?:ed with)? (?:status|code) (-?\d+)/i;

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
    if (!command) return;
    const fromError = EXIT_IN_ERROR_RE.exec(error);
    const exitCode = fromError ? Number(fromError[1]) : exitCodeFromTranscript(input.transcriptPath, input.stepIdx);
    const event = { ...base, ...terminalEvent(command, exitCode) };
    if (exitCode === null && input.transcriptPath && Number.isInteger(input.stepIdx)) {
      event.pending = { transcriptPath: input.transcriptPath, stepIdx: input.stepIdx };
    }
    appendEvent(root, event);
  } else if (WRITE_TOOLS.has(name) && !error) {
    appendEvent(root, { ...base, ...writeEvent(args.Path ?? args.TargetFile ?? args.AbsolutePath ?? args.path ?? "") });
  }
}

main().catch(() => {}).finally(() => {
  console.log("{}");
});

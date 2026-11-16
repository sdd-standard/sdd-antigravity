// Exit code de `run_command` lido do transcript do Antigravity (exclusivo deste plugin).
//
// Validado no Antigravity IDE 2.7.0: o payload do PostToolUse chega com `error` VAZIO mesmo quando o
// comando sai com código 1. O código real só aparece no transcript da conversa (`transcriptPath`), no passo
// `stepIdx` ("Command exited with code N."). Além disso, no momento em que o hook dispara o IDE ainda NÃO
// gravou esse passo (corrida). Por isso o gravador guarda `pending: { transcriptPath, stepIdx }` e a auditoria
// resolve o código depois, quando o passo já existe. Sem evidência legível → null (indeterminado, fail-closed).
import { readFileSync } from "node:fs";

const EXIT_IN_STEP_RE = /Command exited with code (-?\d+)/i;

export function exitCodeFromTranscript(transcriptPath, stepIdx) {
  if (!transcriptPath || !Number.isInteger(stepIdx)) return null;
  let lines;
  try {
    lines = readFileSync(transcriptPath, "utf8").split(/\r?\n/);
  } catch {
    return null;
  }
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i].includes(`"step_index":${stepIdx},`)) continue;
    try {
      const step = JSON.parse(lines[i]);
      if (step.step_index !== stepIdx) continue;
      const m = EXIT_IN_STEP_RE.exec(String(step.content ?? ""));
      return m ? Number(m[1]) : null; // ex.: comando foi para background → indeterminado
    } catch {
      return null;
    }
  }
  return null;
}

// Preenche, na hora da auditoria, o exit code dos comandos que ficaram pendentes no momento do hook.
export function resolvePendingExitCodes(events) {
  return events.map((e) => {
    if (e.kind !== "terminal" || e.exitCode !== null || !e.pending) return e;
    const code = exitCodeFromTranscript(e.pending.transcriptPath, e.pending.stepIdx);
    return code === null ? e : { ...e, exitCode: code, exitCodeSource: "transcript" };
  });
}

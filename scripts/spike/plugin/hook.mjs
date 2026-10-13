// SPIKE — Fase 2. Hook UserPromptSubmit mínimo (sem dependências).
// Protocolo de saída testado: exit 0 = libera; JSON {"decision":"block","reason"} = barra;
// {"systemMessage"} = aviso ao usuário sem bloquear (fail-open).
import { appendFileSync } from 'node:fs';

const BASE = process.env.GUARDIAN_URL ?? 'http://127.0.0.1:7070';
const LOG = new URL('../spike-hook.jsonl', import.meta.url);
const t0 = Date.now();
const registrar = (evento, dados = {}) =>
  appendFileSync(LOG, JSON.stringify({ t: new Date().toISOString(), ms: Date.now() - t0, evento, ...dados }) + '\n');

const sair = (saida) => {
  registrar('saida', { saida });
  if (saida) process.stdout.write(JSON.stringify(saida));
  process.exit(0);
};

let entrada = '';
for await (const c of process.stdin) entrada += c;
const payload = JSON.parse(entrada || '{}');
registrar('entrada', { prompt: payload.prompt, chaves: Object.keys(payload) });

let r;
try {
  r = await (await fetch(`${BASE}/hook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(3000),
  })).json();
} catch (e) {
  sair({ systemMessage: '⚠️ guardIAn offline: prompt não avaliado' });
}

if (r.action === 'allow') sair(null);
if (r.action === 'block') sair({ decision: 'block', reason: `🛡️ guardIAn: ${r.reason}` });

if (r.action === 'hold') {
  process.stderr.write(`🛡️ guardIAn: prompt retido por ${r.hold_seconds}s (id ${r.id})\n`);
  try {
    const d = await (await fetch(`${BASE}/wait/${r.id}`, { signal: AbortSignal.timeout((r.hold_seconds + 5) * 1000) })).json();
    if (d.action === 'allow') sair(null);
    sair({ decision: 'block', reason: `🛡️ guardIAn: ${d.reason}` });
  } catch (e) {
    sair({ decision: 'block', reason: '🛡️ guardIAn: espera interrompida — prompt descartado.' });
  }
}

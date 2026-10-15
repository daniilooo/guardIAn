// guardIAn — hook UserPromptSubmit do Claude Code (portão de entrada, R1).
// Sem dependências e em JavaScript puro: roda em qualquer Node ≥ 18 da máquina do usuário.
// Contrato: vault/03_ARCHITECTURE/API_CONTRACTS.md. Saída validada no spike (CLAUDE_CODE_HOOKS.md):
//   exit 0 sem saída            → prompt segue para a LLM
//   {"decision":"block",...}    → prompt barrado, motivo exibido
//   {"systemMessage":"..."}     → aviso ao usuário, prompt segue (nada vai para a LLM)
// Nunca grava o prompt em disco nem o envia a outro lugar além do servidor local.

// Espelho de packages/shared/src/constantes.ts (testado em hook.test.ts).
export const HOOK_PRAZO_INTERNO_SEGUNDOS = 68; // I11: < timeout de 75s do hooks.json
export const MENSAGEM_OFFLINE = '⚠️ guardIAn offline: prompt não avaliado';
const PREFIXO = '🛡️ guardIAn: ';
const TIMEOUT_AVALIACAO_MS = 20_000;

const BASE = process.env.GUARDIAN_URL ?? `http://127.0.0.1:${process.env.GUARDIAN_PORT || 7070}`;
const PRAZO_MS = Number(process.env.GUARDIAN_HOOK_PRAZO_MS) || HOOK_PRAZO_INTERNO_SEGUNDOS * 1000;
const inicio = Date.now();
const restante = () => Math.max(0, PRAZO_MS - (Date.now() - inicio));

function liberar(aviso) {
  if (aviso) process.stdout.write(JSON.stringify({ systemMessage: aviso }));
  process.exit(0);
}

function barrar(motivo) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason: PREFIXO + motivo }));
  process.exit(0);
}

async function lerEntrada() {
  let bruto = '';
  for await (const parte of process.stdin) bruto += parte;
  return JSON.parse(bruto);
}

let entrada;
try {
  entrada = await lerEntrada();
} catch {
  liberar(); // entrada ilegível: nunca travar o usuário
}

// Lê só os campos usados; o CLI pode mandar outros (S14).
const corpo = {
  source: 'claude_code',
  cwd: String(entrada.cwd ?? process.cwd()),
  prompt: String(entrada.prompt ?? ''),
  ...(entrada.session_id ? { session_id: String(entrada.session_id) } : {}),
  ...(entrada.prompt_id ? { prompt_id: String(entrada.prompt_id) } : {}),
};

let resposta;
try {
  const r = await fetch(`${BASE}/api/hook/prompt`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(corpo),
    signal: AbortSignal.timeout(Math.min(TIMEOUT_AVALIACAO_MS, restante())),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  resposta = await r.json();
} catch {
  liberar(MENSAGEM_OFFLINE); // R17 — fail-open com aviso
}

if (resposta.action === 'allow') liberar(resposta.message);
if (resposta.action === 'block') barrar(resposta.reason);

if (resposta.action === 'hold') {
  // R5 — aguarda a decisão na UI. I11: o hook decide sozinho antes do timeout do CLI.
  try {
    const r = await fetch(`${BASE}/api/hook/prompt/${resposta.prompt_id}/wait`, {
      signal: AbortSignal.timeout(restante()),
    });
    const decisao = await r.json();
    if (r.ok && decisao.action === 'allow') liberar();
    barrar(`${resposta.reason}\n${decisao.reason ?? 'Prompt não liberado.'}`);
  } catch {
    // Prazo interno esgotado ou servidor caiu durante a espera: o prompt barrado não passa.
    barrar(`${resposta.reason}\nTempo de decisão esgotado: prompt descartado.`);
  }
}

liberar(); // resposta desconhecida: fail-open

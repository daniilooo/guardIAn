// SPIKE — Fase 2. Código descartável: servidor mínimo para validar o portão do Claude Code.
// Sem JEV, sem banco. Decide por marcadores no texto do prompt:
//   "#barrar"  -> block imediato
//   "#segurar" -> hold (até HOLD_SECONDS), liberado por POST /release/:id ou /cancel/:id
//   outro      -> allow
// Registra todo payload recebido em scripts/spike/spike-log.jsonl (para ver o texto de slash commands).
import http from 'node:http';
import { appendFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.SPIKE_PORT ?? 7070);
const HOLD_SECONDS = Number(process.env.SPIKE_HOLD_SECONDS ?? 60);
const LOG = new URL('./spike-log.jsonl', import.meta.url);
const pendentes = new Map(); // id -> { resolve, timer }

const log = (evento, dados) => {
  const linha = { t: new Date().toISOString(), evento, ...dados };
  appendFileSync(LOG, JSON.stringify(linha) + '\n');
  console.log(evento, JSON.stringify(dados));
};

const lerCorpo = (req) =>
  new Promise((ok) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => ok(b ? JSON.parse(b) : {}));
  });

const responder = (res, status, corpo) => {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(corpo));
};

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    const [, rota, id] = url.pathname.split('/');

    if (req.method === 'POST' && rota === 'hook') {
      const payload = await lerCorpo(req);
      const prompt = String(payload.prompt ?? '');
      log('hook.recebido', { cwd: payload.cwd, session_id: payload.session_id, prompt, chaves: Object.keys(payload) });
      if (prompt.trim().startsWith('/guardian')) return responder(res, 200, { action: 'block', reason: `✅ comando ${prompt.trim()} tratado pelo hook (sem LLM).` });
      if (prompt.includes('#barrar')) return responder(res, 200, { action: 'block', reason: 'Barrado pelo spike (#barrar).' });
      if (prompt.includes('#segurar')) {
        const pid = randomUUID().slice(0, 8);
        pendentes.set(pid, null);
        log('hold.criado', { id: pid, liberar: `curl -X POST http://127.0.0.1:${PORT}/release/${pid}` });
        return responder(res, 200, { action: 'hold', id: pid, hold_seconds: HOLD_SECONDS });
      }
      return responder(res, 200, { action: 'allow' });
    }

    if (req.method === 'GET' && rota === 'wait' && pendentes.has(id)) {
      const t0 = Date.now();
      const decisao = await new Promise((resolve) => {
        const timer = setTimeout(() => resolve({ action: 'block', reason: 'Expirou (60s) — prompt descartado.' }), HOLD_SECONDS * 1000);
        pendentes.set(id, { resolve, timer });
      });
      pendentes.delete(id);
      log('hold.decidido', { id, ...decisao, esperou_ms: Date.now() - t0 });
      return responder(res, 200, decisao);
    }

    if (req.method === 'POST' && (rota === 'release' || rota === 'cancel')) {
      const p = pendentes.get(id);
      if (!p) return responder(res, 409, { erro: 'inexistente, expirado ou ainda sem espera ativa' });
      clearTimeout(p.timer);
      p.resolve(rota === 'release' ? { action: 'allow' } : { action: 'block', reason: 'Cancelado pelo usuário.' });
      return responder(res, 200, { ok: true });
    }

    if (rota === 'pendentes') return responder(res, 200, [...pendentes.keys()]);
    responder(res, 404, { erro: 'rota inexistente' });
  })
  .listen(PORT, '127.0.0.1', () => console.log(`spike server em http://127.0.0.1:${PORT} (hold ${HOLD_SECONDS}s)`));

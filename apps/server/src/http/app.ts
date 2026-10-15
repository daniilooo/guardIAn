import { ORIGEM, type EventoSse } from '@guardian/shared';
import Fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify';
import type { Eventos } from '../aplicacao/eventos.ts';
import type { Servico } from '../aplicacao/servico.ts';
import { servirUi } from './estaticos.ts';

export interface DependenciasApp {
  servico: Servico;
  eventos: Eventos;
  /** Hosts aceitos no cabeçalho Host/Origin (proteção contra DNS rebinding e CSRF local). */
  hostsPermitidos: string[];
  logger?: FastifyServerOptions['logger'];
  /** Intervalo do heartbeat do SSE. */
  heartbeatMs?: number;
  /** Pasta da UI compilada (apps/web/dist). Sem ela, só a API é servida. */
  pastaWeb?: string;
}

const MAX_PROMPT = 1_000_000;

export function criarApp(deps: DependenciasApp): FastifyInstance {
  const { servico, eventos, hostsPermitidos } = deps;
  // Logs nunca incluem corpo de requisição (prompts) — só método, URL e status.
  const app = Fastify({ logger: deps.logger ?? false, bodyLimit: 2 * 1024 * 1024 });

  // Segurança local (vault/07_SECURITY/SECURITY.md): Host precisa ser o nosso; Origin, se houver, também.
  app.addHook('onRequest', async (req, reply) => {
    if (!hostsPermitidos.includes(req.headers.host ?? '')) {
      return reply.code(403).send({ erro: 'host não permitido' });
    }
    const origem = req.headers.origin;
    if (origem && !hostsPermitidos.some((h) => origem === `http://${h}`)) {
      return reply.code(403).send({ erro: 'origem não permitida' });
    }
  });

  const corpoPrompt = {
    type: 'object',
    required: ['prompt'],
    properties: { prompt: { type: 'string', maxLength: MAX_PROMPT } },
  } as const;
  const corpoCwd = {
    type: 'object',
    required: ['cwd'],
    properties: { cwd: { type: 'string', minLength: 1 } },
  } as const;
  const paramId = {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', format: 'uuid' } },
  } as const;

  app.get('/api/health', async () => ({ server: 'ok', jev: servico.saudeJev() }));

  // ---- Hook (plugin → servidor) ----
  app.post<{
    Body: { source?: string; session_id?: string; prompt_id?: string; cwd: string; prompt: string };
  }>(
    '/api/hook/prompt',
    {
      schema: {
        body: {
          type: 'object',
          required: ['cwd', 'prompt'],
          properties: {
            source: { type: 'string', enum: [ORIGEM.CLAUDE_CODE, ORIGEM.CODEX] },
            session_id: { type: 'string' },
            prompt_id: { type: 'string' },
            cwd: { type: 'string', minLength: 1 },
            prompt: { type: 'string', maxLength: MAX_PROMPT },
          },
        },
      },
    },
    async (req) => {
      const { source = ORIGEM.CLAUDE_CODE, ...resto } = req.body;
      return servico.receberDoHook({ ...resto, source: source as typeof ORIGEM.CLAUDE_CODE });
    },
  );

  app.get<{ Params: { id: string } }>(
    '/api/hook/prompt/:id/wait',
    { schema: { params: paramId } },
    async (req, reply) => {
      const resposta = await servico.aguardarDecisao(req.params.id, (cancelar) => {
        // I12 — a resposta foi encerrada antes da decisão (Esc/Ctrl+C mata o hook).
        // Depois de uma decisão normal o evento também dispara, mas aí não há retenção ativa.
        reply.raw.once('close', cancelar);
      });
      if (!resposta) return reply.code(404).send({ erro: 'prompt não encontrado' });
      return resposta;
    },
  );

  // ---- Projetos ----
  app.get('/api/projects', async () => servico.listarProjetos());
  app.post<{ Body: { cwd: string } }>(
    '/api/projects/activate',
    { schema: { body: corpoCwd } },
    async (req) => servico.ativarProjeto(req.body.cwd),
  );
  app.post<{ Body: { cwd: string } }>(
    '/api/projects/deactivate',
    { schema: { body: corpoCwd } },
    async (req) => servico.desativarProjeto(req.body.cwd),
  );

  // ---- Prompts (UI) ----
  app.get<{
    Querystring: {
      project_id: string;
      column?: 'all' | 'released';
      before?: string;
      limit?: number;
    };
  }>(
    '/api/prompts',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['project_id'],
          properties: {
            project_id: { type: 'string' },
            column: { type: 'string', enum: ['all', 'released'], default: 'all' },
            before: { type: 'string' },
            limit: { type: 'integer', minimum: 1, maximum: 200, default: 50 },
          },
        },
      },
    },
    async (req) =>
      servico.listarPrompts({
        projectId: req.query.project_id === 'playground' ? null : req.query.project_id,
        apenasLiberados: req.query.column === 'released',
        ...(req.query.before ? { antesDe: req.query.before } : {}),
        limite: req.query.limit ?? 50,
      }),
  );

  app.post<{ Params: { id: string }; Body: { confirm: true } }>(
    '/api/prompts/:id/override',
    {
      schema: {
        params: paramId,
        body: { type: 'object', required: ['confirm'], properties: { confirm: { const: true } } },
      },
    },
    async (req, reply) => {
      const r = servico.override(req.params.id);
      if (r.ok) return r.prompt;
      const erros = {
        403: 'prompt com segredo não pode ser liberado',
        404: 'prompt não encontrado',
        409: 'prompt não está mais aguardando decisão',
      };
      return reply.code(r.erro).send({ erro: erros[r.erro] });
    },
  );

  app.post<{ Params: { id: string } }>(
    '/api/prompts/:id/cancel',
    { schema: { params: paramId } },
    async (req, reply) => {
      const r = servico.cancelar(req.params.id);
      if (r.ok) return r.prompt;
      return reply.code(r.erro).send({
        erro: r.erro === 404 ? 'prompt não encontrado' : 'prompt não está mais aguardando decisão',
      });
    },
  );

  // ---- Playground (R8) ----
  app.post<{ Body: { prompt: string } }>(
    '/api/playground/evaluate',
    { schema: { body: corpoPrompt } },
    async (req, reply) => {
      const avaliado = await servico.avaliarNoPlayground(req.body.prompt);
      if (!avaliado)
        return reply.code(400).send({ erro: 'comandos /guardian-* não são avaliados' });
      return avaliado;
    },
  );

  // ---- SSE ----
  app.get('/api/events', (req, reply) => {
    reply.hijack();
    const res = reply.raw;
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    });
    const enviar = (e: EventoSse) => res.write(`event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`);
    enviar({ type: 'jev.status', jev: servico.saudeJev() });
    const cancelar = eventos.assinar(enviar);
    const heartbeat = setInterval(() => res.write(': ping\n\n'), deps.heartbeatMs ?? 15_000);
    heartbeat.unref();
    req.raw.on('close', () => {
      clearInterval(heartbeat);
      cancelar();
    });
  });

  if (deps.pastaWeb) servirUi(app, deps.pastaWeb);

  return app;
}

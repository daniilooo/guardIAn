import { Writable } from 'node:stream';
import type { NotasPorCriterio, PromptAvaliado } from '@guardian/shared';
import { afterEach, describe, expect, it } from 'vitest';
import { criarEventos } from '../aplicacao/eventos.ts';
import { criarServico } from '../aplicacao/servico.ts';
import { abrirBanco } from '../infra/db/conexao.ts';
import { criarRepositorios } from '../infra/db/repositorios.ts';
import {
  criarAvaliadorFake,
  notasIguais,
  type AvaliadorFake,
} from '../infra/jev/avaliador-fake.ts';
import { criarApp } from './app.ts';

// Integração: Fastify + SQLite em memória + AvaliadorFake. Nenhuma chamada de rede ao JEV (I10).
const HOST = '127.0.0.1:7070';
const CWD = '/home/dev/projeto-x';
const BOM = 'Em apps/server/src/auth.ts valide o email e retorne 400 quando inválido';
const segredo = 'gh' + 'p_' + 'x'.repeat(36);

function montar(opcoes: { avaliador?: AvaliadorFake; retencaoMs?: number; logs?: string[] } = {}) {
  const repos = criarRepositorios(abrirBanco(':memory:'));
  const eventos = criarEventos();
  const avaliador = opcoes.avaliador ?? criarAvaliadorFake();
  const servico = criarServico({
    repos,
    avaliador,
    eventos,
    retencaoMs: opcoes.retencaoMs ?? 5_000,
    urlUi: `http://${HOST}`,
  });
  const hostsPermitidos = [HOST];
  const logger = opcoes.logs
    ? {
        level: 'trace',
        stream: new Writable({
          write(chunk, _enc, cb) {
            opcoes.logs!.push(String(chunk));
            cb();
          },
        }),
      }
    : false;
  const app = criarApp({ servico, eventos, hostsPermitidos, logger, heartbeatMs: 50 });
  abertos.push(() => {
    servico.encerrar();
    return app.close();
  });

  const chamar = async (
    method: 'GET' | 'POST',
    url: string,
    payload?: object,
    headers: Record<string, string> = {},
  ) => {
    const r = await app.inject({ method, url, payload, headers: { host: HOST, ...headers } });
    return { status: r.statusCode, corpo: r.body ? r.json() : null };
  };
  const hook = (prompt: string, cwd = CWD) =>
    chamar('POST', '/api/hook/prompt', { source: 'claude_code', cwd, prompt, session_id: 's1' });
  const listar = async (coluna: 'all' | 'released' = 'all', projeto?: string) => {
    const id = projeto ?? (await chamar('GET', '/api/projects')).corpo[0].id;
    return (await chamar('GET', `/api/prompts?project_id=${id}&column=${coluna}`))
      .corpo as PromptAvaliado[];
  };
  return { app, repos, servico, avaliador, eventos, hostsPermitidos, chamar, hook, listar };
}

const abertos: (() => Promise<unknown>)[] = [];
afterEach(async () => {
  while (abertos.length) await abertos.pop()!();
});

const notas = (n: number): NotasPorCriterio => notasIguais(n);

describe('saúde e segurança local', () => {
  it('responde o health com o estado do JEV', async () => {
    const { chamar } = montar();
    expect(await chamar('GET', '/api/health')).toEqual({
      status: 200,
      corpo: { server: 'ok', jev: 'desconhecido' },
    });
  });

  it('recusa Host estranho (DNS rebinding)', async () => {
    const { chamar } = montar();
    expect((await chamar('GET', '/api/health', undefined, { host: 'evil.com' })).status).toBe(403);
  });

  it('recusa Origin de outra página (CSRF local)', async () => {
    const { chamar } = montar();
    const r = await chamar(
      'POST',
      '/api/projects/activate',
      { cwd: CWD },
      { origin: 'https://evil.com' },
    );
    expect(r.status).toBe(403);
    const ok = await chamar(
      'POST',
      '/api/projects/activate',
      { cwd: CWD },
      { origin: `http://${HOST}` },
    );
    expect(ok.status).toBe(200);
  });

  it('valida o corpo das requisições', async () => {
    const { chamar } = montar();
    expect((await chamar('POST', '/api/hook/prompt', { cwd: CWD })).status).toBe(400);
    expect((await chamar('POST', '/api/prompts/nao-uuid/override', { confirm: true })).status).toBe(
      400,
    );
  });
});

describe('comandos /guardian-* (R14 / R15 / D42)', () => {
  it('ativa e desativa o projeto pelo hook, sem avaliar', async () => {
    const { hook, chamar, avaliador } = montar();
    const ativo = await hook('/guardian-active');
    expect(ativo.corpo).toMatchObject({ action: 'block' });
    expect(ativo.corpo.reason).toContain('guardIAn ativado em "projeto-x"');
    expect((await chamar('GET', '/api/projects')).corpo).toMatchObject([
      { path: CWD, name: 'projeto-x', active: true },
    ]);

    const inativo = await hook('/guardian:guardian-inactive');
    expect(inativo.corpo.reason).toContain('desativado');
    expect((await chamar('GET', '/api/projects')).corpo[0].active).toBe(false);
    expect(avaliador.chamadas).toEqual([]);
  });

  it('responde comando desconhecido com a lista de comandos', async () => {
    const { hook } = montar();
    expect((await hook('/guardian-status')).corpo.reason).toContain('/guardian-active');
  });
});

describe('portão de entrada (R1 / R13)', () => {
  it('projeto inativo passa direto e não registra nada', async () => {
    const { hook, chamar, avaliador, listar } = montar();
    await chamar('POST', '/api/projects/deactivate', { cwd: CWD });
    expect((await hook('oi')).corpo).toEqual({ action: 'allow' });
    expect((await hook(BOM)).corpo).toEqual({ action: 'allow' });
    expect(await listar()).toEqual([]);
    expect(avaliador.chamadas).toEqual([]);
  });

  it('subdiretório pertence ao projeto ativo', async () => {
    const { hook, listar } = montar();
    await hook('/guardian-active');
    await hook(BOM, `${CWD}/apps/server`);
    expect(await listar()).toHaveLength(1);
  });

  it('diretório com prefixo parecido NÃO pertence ao projeto', async () => {
    const { hook, avaliador } = montar();
    await hook('/guardian-active');
    expect((await hook(BOM, `${CWD}-outro`)).corpo).toEqual({ action: 'allow' });
    expect(avaliador.chamadas).toEqual([]);
  });

  it('prompt bom é liberado sem mensagem e aparece nas duas colunas', async () => {
    const { hook, listar } = montar();
    await hook('/guardian-active');
    expect((await hook(BOM)).corpo).toEqual({ action: 'allow' });
    const [p] = await listar();
    expect(p).toMatchObject({ status: 'APROVADO', final_decision: 'LIBERADO', score_total: 100 });
    expect(await listar('released')).toHaveLength(1);
  });

  it('ressalva libera com aviso ao usuário e notas por critério', async () => {
    const { hook, listar } = montar({ avaliador: criarAvaliadorFake({ notas: notas(0.6) }) });
    await hook('/guardian-active');
    const r = await hook(BOM);
    expect(r.corpo.action).toBe('allow');
    expect(r.corpo.message).toMatch(/^🟡 guardIAn: Nota 60% — Clareza do pedido 60%/);
    expect((await listar())[0]).toMatchObject({
      status: 'APROVADO_COM_RESSALVA',
      scores: notas(0.6),
    });
  });

  it('JEV indisponível libera com ⚪ e atualiza o health (R7)', async () => {
    const { hook, listar, chamar } = montar({
      avaliador: criarAvaliadorFake({ falha: 'timeout' }),
    });
    await hook('/guardian-active');
    const r = await hook(BOM);
    expect(r.corpo).toMatchObject({ action: 'allow' });
    expect(r.corpo.message).toContain('JEV indisponível');
    expect((await listar('released'))[0]).toMatchObject({
      status: 'JEV_INDISPONIVEL',
      jev_failure: 'timeout',
    });
    expect((await chamar('GET', '/api/health')).corpo.jev).toBe('indisponivel');
  });
});

describe('segredos (R16 / I2 / I3 / D38)', () => {
  it('barra definitivamente, salva mascarado e nunca chama o JEV', async () => {
    const { hook, listar, chamar, avaliador, repos } = montar();
    await hook('/guardian-active');
    const r = await hook(`faça o deploy usando ${segredo} no servidor de produção`);
    expect(r.corpo.action).toBe('block');
    expect(r.corpo.reason).toContain('Segredo detectado (github_token)');

    const [p] = await listar();
    expect(p).toMatchObject({
      status: 'BARRADO',
      block_reason: 'SEGREDO_DETECTADO',
      final_decision: 'BLOQUEADO',
      can_override: false,
      secret_types: ['github_token'],
    });
    expect(p!.text_masked).toContain('[SEGREDO:github_token]');
    expect(avaliador.chamadas).toEqual([]);
    expect(JSON.stringify(repos.prompts.porId(p!.id))).not.toContain(segredo);
    expect(JSON.stringify(r.corpo)).not.toContain(segredo);

    expect((await chamar('POST', `/api/prompts/${p!.id}/override`, { confirm: true })).status).toBe(
      403,
    );
  });
});

describe('retenção e override (R5 / R6 / I7 / I8)', () => {
  it('prompt curto fica retido e expira sem decisão', async () => {
    const { hook, listar, chamar } = montar({ retencaoMs: 100 });
    await hook('/guardian-active');
    const r = await hook('arruma isso');
    expect(r.corpo).toMatchObject({ action: 'hold', hold_seconds: 0 });
    expect(r.corpo.reason).toContain('Prompt muito curto');
    const [retido] = await listar();
    expect(retido).toMatchObject({ final_decision: 'RETIDO', can_override: true });
    expect(retido!.hold_expires_at).toBeTruthy();

    const espera = await chamar('GET', `/api/hook/prompt/${r.corpo.prompt_id}/wait`);
    expect(espera.corpo).toEqual({
      action: 'block',
      reason: 'Tempo de decisão esgotado (60s): prompt descartado.',
    });
    expect((await listar())[0]).toMatchObject({
      final_decision: 'DESCARTADO_TIMEOUT',
      can_override: false,
    });
    // I8 — override depois da expiração é recusado.
    const tarde = await chamar('POST', `/api/prompts/${r.corpo.prompt_id}/override`, {
      confirm: true,
    });
    expect(tarde.status).toBe(409);
  });

  it('nota baixa retida + "Enviar mesmo assim" libera o hook e vai para a coluna direita', async () => {
    const { hook, listar, chamar } = montar({
      avaliador: criarAvaliadorFake({ notas: notas(0.2) }),
    });
    await hook('/guardian-active');
    const r = await hook(BOM);
    expect(r.corpo.action).toBe('hold');
    expect(r.corpo.reason).toContain('Nota 20%');
    expect(await listar('released')).toEqual([]);

    const espera = chamar('GET', `/api/hook/prompt/${r.corpo.prompt_id}/wait`);
    const ov = await chamar('POST', `/api/prompts/${r.corpo.prompt_id}/override`, {
      confirm: true,
    });
    expect(ov.corpo).toMatchObject({ status: 'APROVADO_PELO_USUARIO', final_decision: 'LIBERADO' });
    expect((await espera).corpo).toEqual({ action: 'allow' });
    expect(await listar('released')).toHaveLength(1);

    // I7 — a decisão é única.
    const de_novo = await chamar('POST', `/api/prompts/${r.corpo.prompt_id}/override`, {
      confirm: true,
    });
    expect(de_novo.status).toBe(409);
  });

  it('override antes de o hook começar a esperar também libera', async () => {
    const { hook, chamar } = montar({ avaliador: criarAvaliadorFake({ notas: notas(0) }) });
    await hook('/guardian-active');
    const { corpo } = await hook(BOM);
    await chamar('POST', `/api/prompts/${corpo.prompt_id}/override`, { confirm: true });
    expect((await chamar('GET', `/api/hook/prompt/${corpo.prompt_id}/wait`)).corpo).toEqual({
      action: 'allow',
    });
  });

  it('"Cancelar" descarta na hora', async () => {
    const { hook, chamar, listar } = montar();
    await hook('/guardian-active');
    const { corpo } = await hook('arruma isso');
    const espera = chamar('GET', `/api/hook/prompt/${corpo.prompt_id}/wait`);
    expect((await chamar('POST', `/api/prompts/${corpo.prompt_id}/cancel`)).status).toBe(200);
    expect((await espera).corpo.action).toBe('block');
    expect((await listar())[0]!.final_decision).toBe('CANCELADO');
  });

  it('I12 — conexão do hook encerrada (Esc no CLI) cancela a retenção na hora', async () => {
    const { app, hook, hostsPermitidos, repos } = montar({ retencaoMs: 10_000 });
    await app.listen({ host: '127.0.0.1', port: 0 });
    const porta = (app.server.address() as { port: number }).port;
    hostsPermitidos.push(`127.0.0.1:${porta}`);
    await hook('/guardian-active');
    const { corpo } = await hook('arruma isso');

    const controle = new AbortController();
    const espera = fetch(`http://127.0.0.1:${porta}/api/hook/prompt/${corpo.prompt_id}/wait`, {
      signal: controle.signal,
    }).catch(() => 'abortado');
    await new Promise((r) => setTimeout(r, 50));
    controle.abort();
    expect(await espera).toBe('abortado');

    await expect
      .poll(() => repos.prompts.porId(corpo.prompt_id)?.finalDecision, { timeout: 1000 })
      .toBe('CANCELADO_NO_CLI');
  });

  it('retenções órfãs (servidor reiniciado) são descartadas', async () => {
    const { hook, servico, repos } = montar();
    await hook('/guardian-active');
    const projeto = repos.projetos.porCaminho(CWD)!;
    repos.prompts.inserir({
      id: '00000000-0000-4000-8000-000000000000',
      projectId: projeto.id,
      source: 'claude_code',
      textMasked: 'antigo',
      wordCount: 1,
      status: 'BARRADO',
      secretTypes: [],
      finalDecision: 'RETIDO',
      createdAt: new Date().toISOString(),
    });
    expect(servico.descartarRetencoesOrfas()).toBe(1);
    expect(repos.prompts.porId('00000000-0000-4000-8000-000000000000')?.finalDecision).toBe(
      'DESCARTADO_TIMEOUT',
    );
  });
});

describe('playground (R8 / I6)', () => {
  it('avalia, registra e nunca libera', async () => {
    const { chamar, avaliador } = montar({ avaliador: criarAvaliadorFake({ notas: notas(0.8) }) });
    const r = await chamar('POST', '/api/playground/evaluate', { prompt: BOM });
    expect(r.corpo).toMatchObject({
      source: 'playground',
      project_id: null,
      status: 'APROVADO',
      final_decision: 'AVALIADO_PLAYGROUND',
    });
    expect(avaliador.chamadas).toEqual([BOM]);
    const lista = (await chamar('GET', '/api/prompts?project_id=playground')).corpo;
    expect(lista).toHaveLength(1);
    expect(
      (await chamar('GET', '/api/prompts?project_id=playground&column=released')).corpo,
    ).toEqual([]);
  });

  it('recusa comandos no playground', async () => {
    const { chamar } = montar();
    expect(
      (await chamar('POST', '/api/playground/evaluate', { prompt: '/guardian-active' })).status,
    ).toBe(400);
  });
});

describe('SSE e logs', () => {
  it('transmite o estado do JEV e os prompts novos', async () => {
    const { app, hostsPermitidos } = montar();
    await app.listen({ host: '127.0.0.1', port: 0 });
    const base = `http://127.0.0.1:${(app.server.address() as { port: number }).port}`;
    hostsPermitidos.push(base.slice(7));

    const controle = new AbortController();
    const resposta = await fetch(`${base}/api/events`, { signal: controle.signal });
    expect(resposta.headers.get('content-type')).toContain('text/event-stream');
    const leitor = resposta.body!.getReader();
    let recebido = '';
    const ler = async (ate: string) => {
      while (!recebido.includes(ate))
        recebido += new TextDecoder().decode((await leitor.read()).value);
    };

    await ler('event: jev.status');
    await fetch(`${base}/api/playground/evaluate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: BOM }),
    });
    await ler('event: prompt.created');
    expect(recebido).toContain('"source":"playground"');
    controle.abort();
  });

  it('nunca registra o texto do prompt nos logs', async () => {
    const logs: string[] = [];
    const { hook } = montar({ logs });
    await hook('/guardian-active');
    await hook(`marcador-unico-xyz ${BOM}`);
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.join('')).not.toContain('marcador-unico-xyz');
  });
});

import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { criarEventos } from '../apps/server/src/aplicacao/eventos.ts';
import { criarServico } from '../apps/server/src/aplicacao/servico.ts';
import { criarApp } from '../apps/server/src/http/app.ts';
import { abrirBanco } from '../apps/server/src/infra/db/conexao.ts';
import { criarRepositorios } from '../apps/server/src/infra/db/repositorios.ts';
import {
  criarAvaliadorFake,
  notasIguais,
  type AvaliadorFake,
} from '../apps/server/src/infra/jev/avaliador-fake.ts';
import {
  HOOK_PRAZO_INTERNO_SEGUNDOS,
  HOOK_TIMEOUT_SEGUNDOS,
  MENSAGENS,
} from '../packages/shared/src/index.ts';

// Executa o hook.mjs real como processo separado (como o Claude Code faz) contra o servidor
// real com SQLite em memória e AvaliadorFake (I10).
const HOOK = fileURLToPath(new URL('../plugins/claude-code/hook.mjs', import.meta.url));
const HOOKS_JSON = fileURLToPath(
  new URL('../plugins/claude-code/hooks/hooks.json', import.meta.url),
);
const CWD = '/home/dev/projeto-plugin';
const BOM = 'Em apps/server/src/auth.ts valide o email e retorne 400 quando inválido';

const abertos: (() => Promise<unknown>)[] = [];
afterEach(async () => {
  while (abertos.length) await abertos.pop()!();
});

async function servidor(opcoes: { avaliador?: AvaliadorFake; retencaoMs?: number } = {}) {
  const repos = criarRepositorios(abrirBanco(':memory:'));
  const eventos = criarEventos();
  const servico = criarServico({
    repos,
    avaliador: opcoes.avaliador ?? criarAvaliadorFake(),
    eventos,
    retencaoMs: opcoes.retencaoMs ?? 10_000,
    urlUi: 'http://127.0.0.1:7070',
  });
  const hostsPermitidos: string[] = [];
  const app = criarApp({ servico, eventos, hostsPermitidos });
  await app.listen({ host: '127.0.0.1', port: 0 });
  const porta = (app.server.address() as { port: number }).port;
  hostsPermitidos.push(`127.0.0.1:${porta}`);
  abertos.push(() => {
    servico.encerrar();
    return app.close();
  });
  return { url: `http://127.0.0.1:${porta}`, repos };
}

interface SaidaHook {
  codigo: number | null;
  saida: Record<string, string> | null;
}

function executarHook(
  prompt: string,
  url: string,
  env: Record<string, string> = {},
): Promise<SaidaHook> {
  return new Promise((resolver) => {
    const filho = spawn(process.execPath, [HOOK], {
      env: { ...process.env, GUARDIAN_URL: url, ...env },
    });
    let stdout = '';
    filho.stdout.on('data', (d) => (stdout += d));
    filho.on('close', (codigo) => resolver({ codigo, saida: stdout ? JSON.parse(stdout) : null }));
    filho.stdin.end(
      JSON.stringify({
        session_id: 's1',
        prompt_id: 'p1',
        cwd: CWD,
        hook_event_name: 'UserPromptSubmit',
        campo_novo_do_cli: 'ignorado',
        prompt,
      }),
    );
  });
}

async function ativo(opcoes?: Parameters<typeof servidor>[0]) {
  const s = await servidor(opcoes);
  await executarHook('/guardian-active', s.url);
  return s;
}

describe('hook.mjs — contrato com o Claude Code', () => {
  it('espelha as constantes de packages/shared e cabe no timeout do hooks.json (I11)', () => {
    const fonte = readFileSync(HOOK, 'utf8');
    expect(fonte).toContain(`HOOK_PRAZO_INTERNO_SEGUNDOS = ${HOOK_PRAZO_INTERNO_SEGUNDOS};`);
    expect(fonte).toContain(`MENSAGEM_OFFLINE = '${MENSAGENS.servidorOffline}'`);
    const timeout = JSON.parse(readFileSync(HOOKS_JSON, 'utf8')).hooks.UserPromptSubmit[0].hooks[0]
      .timeout;
    expect(timeout).toBe(HOOK_TIMEOUT_SEGUNDOS);
  });

  it('servidor offline: libera com aviso (R17)', async () => {
    const r = await executarHook(BOM, 'http://127.0.0.1:9');
    expect(r).toEqual({ codigo: 0, saida: { systemMessage: MENSAGENS.servidorOffline } });
  });

  it('entrada ilegível: libera sem travar', async () => {
    const filho = spawn(process.execPath, [HOOK]);
    filho.stdin.end('não é json');
    const codigo = await new Promise((r) => filho.on('close', r));
    expect(codigo).toBe(0);
  });

  it('projeto inativo: libera em silêncio (R13)', async () => {
    const { url } = await servidor();
    expect(await executarHook(BOM, url)).toEqual({ codigo: 0, saida: null });
  });

  it.each(['/guardian-active', '/guardian:guardian-active'])(
    '%s é executado pelo hook e não vai à LLM (D42)',
    async (comando) => {
      const { url, repos } = await servidor();
      const r = await executarHook(comando, url);
      expect(r.saida).toMatchObject({ decision: 'block' });
      expect(r.saida!.reason).toContain('🛡️ guardIAn: ✅ guardIAn ativado em "projeto-plugin"');
      expect(repos.projetos.porCaminho(CWD)?.active).toBe(true);
    },
  );

  it('🟢 libera em silêncio', async () => {
    const { url } = await ativo();
    expect(await executarHook(BOM, url)).toEqual({ codigo: 0, saida: null });
  });

  it('🟡 libera com aviso ao usuário (D54)', async () => {
    const { url } = await ativo({ avaliador: criarAvaliadorFake({ notas: notasIguais(0.6) }) });
    const r = await executarHook(BOM, url);
    expect(r.codigo).toBe(0);
    expect(r.saida!.systemMessage).toMatch(/^🟡 guardIAn: Nota 60%/);
    expect(r.saida).not.toHaveProperty('decision');
  });

  it('🔒 segredo é barrado na hora (R16)', async () => {
    const { url } = await ativo();
    const r = await executarHook(`deploy com ${'gh' + 'p_' + 'x'.repeat(36)} agora por favor`, url);
    expect(r.saida).toMatchObject({ decision: 'block' });
    expect(r.saida!.reason).toContain('Segredo detectado');
  });
});

describe('hook.mjs — retenção (R5 / R6 / I11 / I12)', () => {
  it('"Enviar mesmo assim" durante a espera libera o prompt', async () => {
    const { url, repos } = await ativo();
    const execucao = executarHook('arruma isso', url);
    await expect.poll(() => repos.prompts.retidos().length).toBe(1);
    const id = repos.prompts.retidos()[0]!.id;
    const ov = await fetch(`${url}/api/prompts/${id}/override`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ confirm: true }),
    });
    expect(ov.status).toBe(200);
    expect(await execucao).toEqual({ codigo: 0, saida: null });
  });

  it('"Cancelar" barra com o motivo da retenção e do cancelamento', async () => {
    const { url, repos } = await ativo({
      avaliador: criarAvaliadorFake({ notas: notasIguais(0.2) }),
    });
    const execucao = executarHook(BOM, url);
    await expect.poll(() => repos.prompts.retidos().length).toBe(1);
    await fetch(`${url}/api/prompts/${repos.prompts.retidos()[0]!.id}/cancel`, { method: 'POST' });
    const r = await execucao;
    expect(r.saida).toMatchObject({ decision: 'block' });
    expect(r.saida!.reason).toContain('Nota 20%');
    expect(r.saida!.reason).toContain('Cancelado pelo usuário');
  });

  it('prazo interno esgotado: o hook barra sozinho e o servidor registra CANCELADO_NO_CLI', async () => {
    const { url, repos } = await ativo({ retencaoMs: 10_000 });
    const r = await executarHook('arruma isso', url, { GUARDIAN_HOOK_PRAZO_MS: '400' });
    expect(r.saida).toMatchObject({ decision: 'block' });
    expect(r.saida!.reason).toContain('Tempo de decisão esgotado');
    await expect
      .poll(
        () =>
          repos.prompts.listar({
            projectId: repos.projetos.porCaminho(CWD)!.id,
            apenasLiberados: false,
            limite: 1,
          })[0]?.finalDecision,
      )
      .toBe('CANCELADO_NO_CLI');
  });
});

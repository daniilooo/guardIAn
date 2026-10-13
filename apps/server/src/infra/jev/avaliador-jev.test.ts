import { CRITERIOS } from '@guardian/shared';
import { describe, expect, it, vi } from 'vitest';
import { criarAvaliadorJev, URL_JEV } from './avaliador-jev.ts';

// Nenhum teste acessa a rede (I10): o fetch é sempre substituído.
const CHAVE = 'chave-de-teste-nao-real';

function respostaJev(score = 4) {
  return {
    model: 'jev-1.13.0',
    answers: Object.fromEntries(
      CRITERIOS.map(({ id }) => [
        id,
        { type: 'score', score, probabilities: { '4': 1 }, confidence: 0.9 },
      ]),
    ),
    usage: { input_tokens: 713, output_tokens: 63 },
  };
}

const ok = (corpo: unknown) =>
  vi.fn(async () => new Response(JSON.stringify(corpo), { status: 200 }));
const status = (s: number) => vi.fn(async () => new Response('erro', { status: s }));

describe('criarAvaliadorJev', () => {
  it('envia o prompt e as 4 perguntas Score numa única chamada', async () => {
    const fetch = ok(respostaJev());
    await criarAvaliadorJev({ apiKey: CHAVE, fetch }).avaliar('texto mascarado');

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(URL_JEV);
    expect((init.headers as Record<string, string>).authorization).toBe(`Bearer ${CHAVE}`);
    const corpo = JSON.parse(init.body as string);
    expect(corpo.state).toBe('texto mascarado');
    expect(corpo.model).toBe('jev-latest');
    expect(Object.keys(corpo.questions)).toEqual(CRITERIOS.map((c) => c.id));
    for (const q of Object.values(corpo.questions) as { type: string; criteria: string[] }[]) {
      expect(q.type).toBe('score');
      expect(q.criteria).toHaveLength(5);
    }
  });

  it('normaliza as notas e devolve metadados', async () => {
    const r = await criarAvaliadorJev({ apiKey: CHAVE, fetch: ok(respostaJev(2)) }).avaliar('x');
    expect(r).toMatchObject({
      ok: true,
      notas: { clareza: 0.5, onde_mexer: 0.5, o_que_fazer: 0.5, resultado: 0.5 },
      modelo: 'jev-1.13.0',
      uso: { input_tokens: 713, output_tokens: 63 },
    });
  });

  it('sem chave não chama a rede', async () => {
    const fetch = ok(respostaJev());
    const r = await criarAvaliadorJev({ apiKey: undefined, fetch }).avaliar('x');
    expect(r).toMatchObject({ ok: false, falha: 'sem_chave' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it.each([
    [401, 'autenticacao'],
    [403, 'autenticacao'],
    [429, 'limite'],
    [529, 'sobrecarga'],
    [500, 'http'],
  ])('HTTP %d → %s', async (codigo, falha) => {
    const r = await criarAvaliadorJev({ apiKey: CHAVE, fetch: status(codigo) }).avaliar('x');
    expect(r).toMatchObject({ ok: false, falha });
  });

  it('timeout → indisponível', async () => {
    const fetch = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_, rejeitar) =>
          init?.signal?.addEventListener('abort', () => rejeitar(init.signal?.reason)),
        ),
    );
    const r = await criarAvaliadorJev({ apiKey: CHAVE, fetch, timeoutMs: 20 }).avaliar('x');
    expect(r).toMatchObject({ ok: false, falha: 'timeout' });
  });

  it('erro de rede → indisponível', async () => {
    const fetch = vi.fn(async () => {
      throw new TypeError('fetch failed');
    });
    expect(await criarAvaliadorJev({ apiKey: CHAVE, fetch }).avaliar('x')).toMatchObject({
      ok: false,
      falha: 'rede',
    });
  });

  it.each([
    ['sem answers', { model: 'jev' }],
    ['critério faltando', { answers: { clareza: { score: 1 } } }],
  ])('resposta inválida (%s) → indisponível', async (_caso, corpo) => {
    const r = await criarAvaliadorJev({ apiKey: CHAVE, fetch: ok(corpo) }).avaliar('x');
    expect(r).toMatchObject({ ok: false, falha: 'resposta_invalida' });
  });

  it('JSON malformado → indisponível', async () => {
    const fetch = vi.fn(async () => new Response('{nope', { status: 200 }));
    expect(await criarAvaliadorJev({ apiKey: CHAVE, fetch }).avaliar('x')).toMatchObject({
      ok: false,
      falha: 'resposta_invalida',
    });
  });

  it('nunca expõe a chave no resultado', async () => {
    for (const fetch of [ok(respostaJev()), status(401)]) {
      const r = await criarAvaliadorJev({ apiKey: CHAVE, fetch }).avaliar('x');
      expect(JSON.stringify(r)).not.toContain(CHAVE);
    }
  });
});

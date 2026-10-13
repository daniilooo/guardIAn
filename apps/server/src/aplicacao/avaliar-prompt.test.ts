import { MENSAGENS, MOTIVO_BLOQUEIO, STATUS } from '@guardian/shared';
import { describe, expect, it } from 'vitest';
import { criarAvaliadorFake, notasIguais } from '../infra/jev/avaliador-fake.ts';
import { avaliarPrompt, permiteOverride, type Avaliacao } from './avaliar-prompt.ts';

const github = 'gh' + 'p_' + 'x'.repeat(36);
const BOM = 'Em apps/server/src/auth.ts valide o email e retorne 400';

async function avaliado(prompt: string, avaliador = criarAvaliadorFake()): Promise<Avaliacao> {
  const r = await avaliarPrompt(prompt, { avaliador, projetoAtivo: true });
  if (r.tipo !== 'avaliado') throw new Error(`esperado avaliado, veio ${r.tipo}`);
  return r.avaliacao;
}

describe('avaliarPrompt — ordem do pipeline (I4)', () => {
  it('comando vem antes de tudo, mesmo com segredo ou projeto inativo', async () => {
    const avaliador = criarAvaliadorFake();
    const r = await avaliarPrompt(`/guardian-active ${github}`, { avaliador, projetoAtivo: false });
    expect(r).toEqual({
      tipo: 'comando',
      comando: { tipo: 'comando', comando: 'guardian-active' },
    });
    expect(avaliador.chamadas).toEqual([]);
  });

  it('projeto inativo passa direto sem avaliar (R13)', async () => {
    const avaliador = criarAvaliadorFake();
    expect(await avaliarPrompt('oi', { avaliador, projetoAtivo: false })).toEqual({
      tipo: 'projeto_inativo',
    });
    expect(avaliador.chamadas).toEqual([]);
  });

  it('segredo barra antes do tamanho e nunca chega ao JEV (R16 / I2)', async () => {
    const avaliador = criarAvaliadorFake();
    const a = await avaliado(github, avaliador);
    expect(a).toMatchObject({
      status: STATUS.BARRADO,
      motivo: MOTIVO_BLOQUEIO.SEGREDO_DETECTADO,
      textoMascarado: '[SEGREDO:github_token]',
      tiposSegredo: ['github_token'],
      mensagem: MENSAGENS.segredoDetectado,
    });
    expect(avaliador.chamadas).toEqual([]);
    expect(JSON.stringify(a)).not.toContain(github);
  });

  it('menos de 5 palavras barra sem chamar o JEV (R2)', async () => {
    const avaliador = criarAvaliadorFake();
    const a = await avaliado('um dois três quatro', avaliador);
    expect(a).toMatchObject({
      status: STATUS.BARRADO,
      motivo: MOTIVO_BLOQUEIO.PROMPT_CURTO,
      palavras: 4,
    });
    expect(a.mensagem).toBe(MENSAGENS.promptCurto);
    expect(avaliador.chamadas).toEqual([]);
  });

  it('5 palavras já vão para o JEV', async () => {
    const avaliador = criarAvaliadorFake();
    await avaliado('um dois três quatro cinco', avaliador);
    expect(avaliador.chamadas).toEqual(['um dois três quatro cinco']);
  });
});

describe('avaliarPrompt — faixas (R3)', () => {
  it.each([
    [1, STATUS.APROVADO, null],
    [0.75, STATUS.APROVADO, null],
    [0.5, STATUS.APROVADO_COM_RESSALVA, null],
    [0.25, STATUS.BARRADO, MOTIVO_BLOQUEIO.NOTA_BAIXA],
  ])('notas %d → %s', async (nota, status, motivo) => {
    const a = await avaliado(BOM, criarAvaliadorFake({ notas: notasIguais(nota) }));
    expect(a).toMatchObject({ status, motivo, notaTotal: nota * 100 });
    expect(a.notas).toEqual(notasIguais(nota));
  });

  it('JEV indisponível libera com marcador próprio (R7)', async () => {
    const a = await avaliado(BOM, criarAvaliadorFake({ falha: 'timeout' }));
    expect(a).toMatchObject({ status: STATUS.JEV_INDISPONIVEL, motivo: null, notaTotal: null });
    expect(a.jev).toMatchObject({ ok: false, falha: 'timeout' });
  });
});

describe('permiteOverride (R5 / R6 / D38)', () => {
  it('permite para prompt curto e nota baixa', async () => {
    expect(permiteOverride(await avaliado('arruma isso'))).toBe(true);
    const fraco = await avaliado(BOM, criarAvaliadorFake({ notas: notasIguais(0) }));
    expect(permiteOverride(fraco)).toBe(true);
  });

  it('nunca permite para segredo', async () => {
    expect(permiteOverride(await avaliado(`deploy com ${github} agora mesmo por favor`))).toBe(
      false,
    );
  });

  it('não se aplica a prompts liberados', async () => {
    expect(permiteOverride(await avaliado(BOM))).toBe(false);
  });
});

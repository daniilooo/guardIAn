import { STATUS } from '@guardian/shared';
import { describe, expect, it } from 'vitest';
import { notasIguais } from '../infra/jev/avaliador-fake.ts';
import { classificarFaixa, normalizarScore, notaComposta } from './nota.ts';

describe('normalizarScore', () => {
  it.each([
    [0, 0],
    [2, 0.5],
    [4, 1],
    [5, 1],
    [-1, 0],
  ])('score %d → %d', (score, esperado) => {
    expect(normalizarScore(score)).toBe(esperado);
  });
});

describe('notaComposta (R3)', () => {
  it('é a média com peso igual', () => {
    expect(notaComposta({ clareza: 1, onde_mexer: 0.5, o_que_fazer: 0.5, resultado: 0 })).toBe(50);
  });
});

describe('classificarFaixa (R3 / H4)', () => {
  it.each([
    [0, STATUS.BARRADO],
    [49.999, STATUS.BARRADO],
    [50, STATUS.APROVADO_COM_RESSALVA],
    [74.999, STATUS.APROVADO_COM_RESSALVA],
    [75, STATUS.APROVADO],
    [100, STATUS.APROVADO],
  ])('nota %d → %s', (nota, status) => {
    expect(classificarFaixa(nota)).toBe(status);
  });

  it('exatamente 50% composto passa como ressalva', () => {
    expect(classificarFaixa(notaComposta(notasIguais(0.5)))).toBe(STATUS.APROVADO_COM_RESSALVA);
  });
});

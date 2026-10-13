import { describe, expect, it } from 'vitest';
import {
  COMANDOS,
  CRITERIOS,
  HOOK_PRAZO_INTERNO_SEGUNDOS,
  HOOK_TIMEOUT_SEGUNDOS,
  LIMIAR_APROVADO,
  LIMIAR_RESSALVA,
  MIN_PALAVRAS,
  RETENCAO_SEGUNDOS,
} from './constantes.ts';
import { MARCADORES } from './dominio.ts';

describe('constantes de negócio', () => {
  it('mantém os valores aprovados no intake (R2, R3, R5)', () => {
    expect(MIN_PALAVRAS).toBe(5);
    expect(LIMIAR_RESSALVA).toBe(50);
    expect(LIMIAR_APROVADO).toBe(75);
    expect(RETENCAO_SEGUNDOS).toBe(60);
  });

  it('ordena as faixas: 0 < ressalva < aprovado ≤ 100', () => {
    expect(0).toBeLessThan(LIMIAR_RESSALVA);
    expect(LIMIAR_RESSALVA).toBeLessThan(LIMIAR_APROVADO);
    expect(LIMIAR_APROVADO).toBeLessThanOrEqual(100);
  });

  it('garante I11: retenção < prazo interno do hook < timeout do CLI', () => {
    expect(RETENCAO_SEGUNDOS).toBeLessThan(HOOK_PRAZO_INTERNO_SEGUNDOS);
    expect(HOOK_PRAZO_INTERNO_SEGUNDOS).toBeLessThan(HOOK_TIMEOUT_SEGUNDOS);
  });

  it('tem 4 critérios com pesos que somam 1', () => {
    expect(CRITERIOS).toHaveLength(4);
    expect(CRITERIOS.reduce((soma, c) => soma + c.peso, 0)).toBeCloseTo(1);
  });

  it('expõe os comandos do plugin com o prefixo guardian', () => {
    expect(COMANDOS.every((c) => c.startsWith('guardian-'))).toBe(true);
  });

  it('só libera para a LLM os marcadores de aprovação (I1)', () => {
    expect(MARCADORES.BARRADO.liberado).toBe(false);
    expect(MARCADORES.SEGREDO_DETECTADO.liberado).toBe(false);
    expect(MARCADORES.APROVADO.liberado).toBe(true);
  });
});

import {
  CRITERIOS,
  LIMIAR_APROVADO,
  LIMIAR_RESSALVA,
  NIVEIS_RUBRICA,
  STATUS,
  type NotasPorCriterio,
  type Status,
} from '@guardian/shared';

/** Converte o `score` do JEV (0..NIVEIS-1) para 0..1. */
export function normalizarScore(score: number, niveis: number = NIVEIS_RUBRICA): number {
  return Math.min(1, Math.max(0, score / (niveis - 1)));
}

/** R3 — média ponderada dos critérios, em 0..100 (sem arredondar: a faixa usa o valor exato). */
export function notaComposta(notas: NotasPorCriterio): number {
  return CRITERIOS.reduce((soma, { id, peso }) => soma + notas[id] * peso, 0) * 100;
}

/** R3 / H4 — < 50 barrado · 50 a < 75 ressalva · ≥ 75 aprovado. I5: decisão no nosso código. */
export function classificarFaixa(nota: number): Status {
  if (nota < LIMIAR_RESSALVA) return STATUS.BARRADO;
  if (nota < LIMIAR_APROVADO) return STATUS.APROVADO_COM_RESSALVA;
  return STATUS.APROVADO;
}

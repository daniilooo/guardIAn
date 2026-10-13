import { encontrarSegredos } from '@guardian/shared';

export interface ResultadoMascaramento {
  texto: string;
  tipos: string[];
}

/**
 * R16 / I3 — substitui cada segredo por `[SEGREDO:<tipo>]`.
 * Ocorrências sobrepostas (ex.: `token = "ghp_..."`) viram um único trecho mascarado.
 */
export function mascararSegredos(texto: string): ResultadoMascaramento {
  const trechos: { inicio: number; fim: number; tipo: string }[] = [];
  for (const o of encontrarSegredos(texto)) {
    const ultimo = trechos.at(-1);
    if (ultimo && o.inicio < ultimo.fim) ultimo.fim = Math.max(ultimo.fim, o.fim);
    else trechos.push({ ...o });
  }

  let resultado = texto;
  for (const { inicio, fim, tipo } of [...trechos].reverse()) {
    resultado = `${resultado.slice(0, inicio)}[SEGREDO:${tipo}]${resultado.slice(fim)}`;
  }
  const tipos = [...new Set(encontrarSegredos(texto).map((o) => o.tipo))];
  return { texto: resultado, tipos };
}

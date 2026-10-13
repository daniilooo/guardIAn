import { CRITERIOS, type NotasPorCriterio } from '@guardian/shared';
import type { Avaliador, FalhaAvaliador, ResultadoAvaliador } from '../../aplicacao/avaliador.ts';

// Avaliador para testes e CI (I10): nunca acessa a rede.

export interface AvaliadorFake extends Avaliador {
  /** Textos recebidos, para provar o que foi (ou não) enviado ao "JEV". */
  readonly chamadas: string[];
}

export function notasIguais(valor: number): NotasPorCriterio {
  return Object.fromEntries(CRITERIOS.map(({ id }) => [id, valor])) as NotasPorCriterio;
}

export function criarAvaliadorFake(
  config: { notas?: NotasPorCriterio; falha?: FalhaAvaliador } = {},
): AvaliadorFake {
  const chamadas: string[] = [];
  const notas = config.notas ?? notasIguais(1);
  return {
    chamadas,
    async avaliar(texto: string): Promise<ResultadoAvaliador> {
      chamadas.push(texto);
      if (config.falha) return { ok: false, falha: config.falha, latenciaMs: 0 };
      const detalhes = Object.fromEntries(
        CRITERIOS.map(({ id }) => [id, { score: notas[id] * 4, probabilities: {}, confidence: 1 }]),
      ) as Extract<ResultadoAvaliador, { ok: true }>['detalhes'];
      return {
        ok: true,
        notas,
        detalhes,
        modelo: 'fake',
        uso: { input_tokens: 0, output_tokens: 0 },
        latenciaMs: 0,
      };
    },
  };
}

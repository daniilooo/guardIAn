import type { CriterioId, NotasPorCriterio } from '@guardian/shared';

/** Porta Avaliador (ADR-0003): JEV real ou fake. Nunca lança — falhas viram `ok: false`. */
export interface Avaliador {
  avaliar(textoMascarado: string): Promise<ResultadoAvaliador>;
}

export interface DetalheCriterio {
  score: number;
  probabilities: Record<string, number>;
  confidence: number;
}

export type FalhaAvaliador =
  | 'sem_chave'
  | 'timeout'
  | 'rede'
  | 'autenticacao'
  | 'limite'
  | 'sobrecarga'
  | 'http'
  | 'resposta_invalida';

export type ResultadoAvaliador =
  | {
      ok: true;
      /** Notas normalizadas 0..1 por critério. */
      notas: NotasPorCriterio;
      detalhes: Record<CriterioId, DetalheCriterio>;
      modelo: string;
      uso: { input_tokens: number; output_tokens: number };
      latenciaMs: number;
    }
  | { ok: false; falha: FalhaAvaliador; latenciaMs: number };

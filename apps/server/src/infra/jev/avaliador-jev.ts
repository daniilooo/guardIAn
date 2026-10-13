import { CRITERIOS, NIVEIS_RUBRICA, type CriterioId } from '@guardian/shared';
import type {
  Avaliador,
  DetalheCriterio,
  FalhaAvaliador,
  ResultadoAvaliador,
} from '../../aplicacao/avaliador.ts';
import { normalizarScore } from '../../dominio/nota.ts';
import { RUBRICA } from './rubrica.ts';

// Único lugar que fala com a TypeSafe (MODULE_MAP). HTTP direto, sem SDK (D48):
// uma tentativa só, para o timeout total caber no prazo do hook (I11).

export const URL_JEV = 'https://api.typesafe.ai/v1/systemone';

export interface OpcoesAvaliadorJev {
  apiKey: string | undefined;
  modelo?: string;
  timeoutMs?: number;
  url?: string;
  fetch?: typeof globalThis.fetch;
}

export function montarPerguntas() {
  return Object.fromEntries(
    CRITERIOS.map(({ id }) => [
      id,
      { type: 'score', instructions: RUBRICA[id].instrucao, criteria: RUBRICA[id].niveis },
    ]),
  );
}

function falhaPorStatus(status: number): FalhaAvaliador {
  if (status === 401 || status === 403) return 'autenticacao';
  if (status === 429) return 'limite';
  if (status === 503 || status === 529) return 'sobrecarga';
  return 'http';
}

interface RespostaJev {
  model?: unknown;
  answers?: Record<string, { score?: unknown; probabilities?: unknown; confidence?: unknown }>;
  usage?: { input_tokens?: unknown; output_tokens?: unknown };
}

function extrairDetalhes(corpo: RespostaJev): Record<CriterioId, DetalheCriterio> | null {
  const detalhes = {} as Record<CriterioId, DetalheCriterio>;
  for (const { id } of CRITERIOS) {
    const r = corpo.answers?.[id];
    if (typeof r?.score !== 'number' || !Number.isFinite(r.score)) return null;
    detalhes[id] = {
      score: r.score,
      probabilities: (r.probabilities ?? {}) as Record<string, number>,
      confidence: typeof r.confidence === 'number' ? r.confidence : 0,
    };
  }
  return detalhes;
}

export function criarAvaliadorJev(opcoes: OpcoesAvaliadorJev): Avaliador {
  const {
    apiKey,
    modelo = 'jev-latest',
    timeoutMs = 10_000,
    url = URL_JEV,
    fetch = globalThis.fetch,
  } = opcoes;
  const perguntas = montarPerguntas();

  return {
    async avaliar(textoMascarado: string): Promise<ResultadoAvaliador> {
      const inicio = performance.now();
      const falhar = (falha: FalhaAvaliador): ResultadoAvaliador => ({
        ok: false,
        falha,
        latenciaMs: Math.round(performance.now() - inicio),
      });
      if (!apiKey) return falhar('sem_chave');

      let resposta: Response;
      try {
        resposta = await fetch(url, {
          method: 'POST',
          headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
          body: JSON.stringify({ state: textoMascarado, model: modelo, questions: perguntas }),
          signal: AbortSignal.timeout(timeoutMs),
        });
      } catch (erro) {
        const nome = (erro as { name?: string }).name;
        return falhar(nome === 'TimeoutError' || nome === 'AbortError' ? 'timeout' : 'rede');
      }
      if (!resposta.ok) return falhar(falhaPorStatus(resposta.status));

      let corpo: RespostaJev;
      try {
        corpo = (await resposta.json()) as RespostaJev;
      } catch {
        return falhar('resposta_invalida');
      }
      const detalhes = extrairDetalhes(corpo);
      if (!detalhes) return falhar('resposta_invalida');

      const notas = Object.fromEntries(
        CRITERIOS.map(({ id }) => [id, normalizarScore(detalhes[id].score, NIVEIS_RUBRICA)]),
      ) as Record<CriterioId, number>;
      return {
        ok: true,
        notas,
        detalhes,
        modelo: typeof corpo.model === 'string' ? corpo.model : modelo,
        uso: {
          input_tokens: Number(corpo.usage?.input_tokens ?? 0),
          output_tokens: Number(corpo.usage?.output_tokens ?? 0),
        },
        latenciaMs: Math.round(performance.now() - inicio),
      };
    },
  };
}

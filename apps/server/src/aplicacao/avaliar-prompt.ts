import {
  MENSAGENS,
  MIN_PALAVRAS,
  MOTIVO_BLOQUEIO,
  STATUS,
  type MotivoBloqueio,
  type NotasPorCriterio,
  type Status,
} from '@guardian/shared';
import { reconhecerComando, type ReconhecimentoComando } from '../dominio/comandos.ts';
import { classificarFaixa, notaComposta } from '../dominio/nota.ts';
import { contarPalavras } from '../dominio/palavras.ts';
import { mascararSegredos } from '../dominio/segredos.ts';
import type { Avaliador, ResultadoAvaliador } from './avaliador.ts';

export interface Avaliacao {
  status: Status;
  motivo: MotivoBloqueio | null;
  /** Texto já mascarado — o único que pode ser persistido, logado ou enviado (I3). */
  textoMascarado: string;
  tiposSegredo: string[];
  palavras: number;
  /** Nota composta 0..100, null quando o JEV não avaliou. */
  notaTotal: number | null;
  notas: NotasPorCriterio | null;
  jev: ResultadoAvaliador | null;
  mensagem: string | null;
}

export type ResultadoPipeline =
  | { tipo: 'comando'; comando: ReconhecimentoComando }
  | { tipo: 'projeto_inativo' }
  | { tipo: 'avaliado'; avaliacao: Avaliacao };

export interface DependenciasPipeline {
  avaliador: Avaliador;
  projetoAtivo: boolean;
}

/**
 * Pipeline do portão de entrada. Ordem invariante (I4):
 * comando → projeto ativo → segredo → tamanho → JEV → faixa.
 */
export async function avaliarPrompt(
  prompt: string,
  { avaliador, projetoAtivo }: DependenciasPipeline,
): Promise<ResultadoPipeline> {
  const comando = reconhecerComando(prompt);
  if (comando) return { tipo: 'comando', comando };
  if (!projetoAtivo) return { tipo: 'projeto_inativo' };

  const { texto: textoMascarado, tipos: tiposSegredo } = mascararSegredos(prompt);
  const palavras = contarPalavras(textoMascarado);
  const base = { textoMascarado, tiposSegredo, palavras, notaTotal: null, notas: null, jev: null };

  if (tiposSegredo.length > 0) {
    return {
      tipo: 'avaliado',
      avaliacao: {
        ...base,
        status: STATUS.BARRADO,
        motivo: MOTIVO_BLOQUEIO.SEGREDO_DETECTADO,
        mensagem: MENSAGENS.segredoDetectado,
      },
    };
  }

  if (palavras < MIN_PALAVRAS) {
    return {
      tipo: 'avaliado',
      avaliacao: {
        ...base,
        status: STATUS.BARRADO,
        motivo: MOTIVO_BLOQUEIO.PROMPT_CURTO,
        mensagem: MENSAGENS.promptCurto,
      },
    };
  }

  const jev = await avaliador.avaliar(textoMascarado);
  if (!jev.ok) {
    return {
      tipo: 'avaliado',
      avaliacao: { ...base, jev, status: STATUS.JEV_INDISPONIVEL, motivo: null, mensagem: null },
    };
  }

  const notaTotal = notaComposta(jev.notas);
  const status = classificarFaixa(notaTotal);
  return {
    tipo: 'avaliado',
    avaliacao: {
      ...base,
      jev,
      notas: jev.notas,
      notaTotal,
      status,
      motivo: status === STATUS.BARRADO ? MOTIVO_BLOQUEIO.NOTA_BAIXA : null,
      mensagem: null,
    },
  };
}

/** R5 / R6 / D38 — só prompts barrados por tamanho ou nota podem ser liberados manualmente. */
export function permiteOverride(avaliacao: Avaliacao): boolean {
  return (
    avaliacao.motivo === MOTIVO_BLOQUEIO.PROMPT_CURTO ||
    avaliacao.motivo === MOTIVO_BLOQUEIO.NOTA_BAIXA
  );
}

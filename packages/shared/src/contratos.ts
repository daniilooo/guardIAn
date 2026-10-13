// Contratos HTTP entre plugin, servidor e UI (vault/03_ARCHITECTURE/API_CONTRACTS.md).
// Mudança no contrato do hook é gate humano G5.
import type { CriterioId } from './constantes.ts';
import type { DecisaoFinal, MotivoBloqueio, Origem, Status } from './dominio.ts';

/** Campos do payload do UserPromptSubmit usados pelo guardIAn (os demais são ignorados — S14). */
export interface EntradaHook {
  source: Origem;
  session_id?: string;
  prompt_id?: string;
  cwd: string;
  prompt: string;
}

export type RespostaHook =
  /** `message` vira um aviso ao usuário (systemMessage), nunca contexto para a LLM. */
  | { action: 'allow'; message?: string }
  | { action: 'block'; reason: string }
  | { action: 'hold'; prompt_id: string; hold_seconds: number; reason: string };

export type RespostaEspera = { action: 'allow' } | { action: 'block'; reason: string };

export interface Projeto {
  id: string;
  path: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type NotasPorCriterio = Record<CriterioId, number>;

export interface PromptAvaliado {
  id: string;
  project_id: string | null;
  source: Origem;
  text_masked: string;
  word_count: number;
  created_at: string;
  status: Status;
  block_reason: MotivoBloqueio | null;
  secret_types: string[];
  score_total: number | null;
  scores: NotasPorCriterio | null;
  final_decision: DecisaoFinal;
  hold_expires_at: string | null;
  /** Mensagem exibida ao usuário (ex.: "Prompt muito curto…"). */
  message: string | null;
  /** R6 / D38 — true só enquanto o prompt está retido e não contém segredo. */
  can_override: boolean;
  /** ⚪ — motivo técnico quando o JEV não avaliou. */
  jev_failure: string | null;
}

export type SaudeJev = 'disponivel' | 'indisponivel' | 'desconhecido';

export interface Saude {
  server: 'ok';
  jev: SaudeJev;
}

export type EventoSse =
  | { type: 'prompt.created'; prompt: PromptAvaliado }
  | { type: 'prompt.updated'; prompt: PromptAvaliado }
  | { type: 'project.updated'; project: Projeto }
  | { type: 'jev.status'; jev: SaudeJev };

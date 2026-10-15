import {
  CRITERIOS,
  MARCADORES,
  type DecisaoFinal,
  type EventoSse,
  type Projeto,
  type PromptAvaliado,
  type TipoMarcador,
} from '@guardian/shared';

// Lógica pura da UI (sem React), testada em logica.test.ts.

export const ABA_PLAYGROUND = 'playground';

/** Marcador visual do prompt (BUSINESS_RULES.md#marcadores). */
export function tipoMarcador(p: PromptAvaliado): TipoMarcador {
  if (p.block_reason === 'SEGREDO_DETECTADO') return 'SEGREDO_DETECTADO';
  return p.status;
}

export function marcadorDe(p: PromptAvaliado) {
  return MARCADORES[tipoMarcador(p)];
}

const DESFECHOS: Record<DecisaoFinal, string> = {
  LIBERADO: 'Enviado à LLM',
  RETIDO: 'Aguardando decisão',
  BLOQUEADO: 'Não enviado',
  DESCARTADO_TIMEOUT: 'Descartado: 60s sem decisão',
  CANCELADO: 'Descartado por você',
  CANCELADO_NO_CLI: 'Cancelado no terminal',
  AVALIADO_PLAYGROUND: 'Só avaliado (playground)',
};

export const rotuloDesfecho = (d: DecisaoFinal): string => DESFECHOS[d];

export function segundosRestantes(expiraEm: string | null, agora: number): number {
  if (!expiraEm) return 0;
  return Math.max(0, Math.ceil((Date.parse(expiraEm) - agora) / 1000));
}

export const pct = (n: number): string => `${Math.round(n * 100)}%`;

export function barrasDe(p: PromptAvaliado) {
  if (!p.scores) return [];
  return CRITERIOS.map(({ id, rotulo }) => ({ id, rotulo, valor: p.scores![id] }));
}

export interface EstadoPrompts {
  porId: Record<string, PromptAvaliado>;
}

export const estadoInicial: EstadoPrompts = { porId: {} };

export function incluirPrompts(estado: EstadoPrompts, lista: PromptAvaliado[]): EstadoPrompts {
  if (lista.length === 0) return estado;
  const porId = { ...estado.porId };
  for (const p of lista) porId[p.id] = p;
  return { porId };
}

/** Prompts de uma aba (projeto ou playground), mais recentes primeiro. */
export function promptsDaAba(
  estado: EstadoPrompts,
  aba: string,
  coluna: 'todos' | 'liberados',
): PromptAvaliado[] {
  const projeto = aba === ABA_PLAYGROUND ? null : aba;
  return Object.values(estado.porId)
    .filter((p) => p.project_id === projeto)
    .filter((p) => coluna === 'todos' || p.final_decision === 'LIBERADO')
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function aplicarEventoProjetos(projetos: Projeto[], evento: EventoSse): Projeto[] {
  if (evento.type !== 'project.updated') return projetos;
  const outros = projetos.filter((p) => p.id !== evento.project.id);
  return [...outros, evento.project].sort((a, b) => a.name.localeCompare(b.name));
}

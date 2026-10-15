import type { PromptAvaliado } from '@guardian/shared';

/** Prompt de exemplo para testes da UI. */
export function prompt(parcial: Partial<PromptAvaliado> = {}): PromptAvaliado {
  return {
    id: 'p1',
    project_id: 'proj',
    source: 'claude_code',
    text_masked: 'Em auth.ts valide o email do usuário',
    word_count: 7,
    created_at: '2026-10-13T10:00:00.000Z',
    status: 'APROVADO',
    block_reason: null,
    secret_types: [],
    score_total: 90,
    scores: { clareza: 0.9, onde_mexer: 1, o_que_fazer: 0.8, resultado: 0.9 },
    final_decision: 'LIBERADO',
    hold_expires_at: null,
    message: null,
    can_override: false,
    jev_failure: null,
    ...parcial,
  };
}

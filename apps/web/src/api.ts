import type { Projeto, PromptAvaliado, Saude } from '@guardian/shared';

// Cliente da API local (vault/03_ARCHITECTURE/API_CONTRACTS.md). Mesma origem do servidor.

async function pedir<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init);
  const corpo = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((corpo as { erro?: string }).erro ?? `HTTP ${r.status}`);
  return corpo as T;
}

const json = (corpo: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(corpo),
});

export const api = {
  saude: () => pedir<Saude>('/api/health'),
  projetos: () => pedir<Projeto[]>('/api/projects'),
  prompts: (aba: string, coluna: 'all' | 'released', antesDe?: string) => {
    const q = new URLSearchParams({ project_id: aba, column: coluna, limit: '50' });
    if (antesDe) q.set('before', antesDe);
    return pedir<PromptAvaliado[]>(`/api/prompts?${q}`);
  },
  override: (id: string) =>
    pedir<PromptAvaliado>(`/api/prompts/${id}/override`, json({ confirm: true })),
  cancelar: (id: string) => pedir<PromptAvaliado>(`/api/prompts/${id}/cancel`, { method: 'POST' }),
  playground: (prompt: string) =>
    pedir<PromptAvaliado>('/api/playground/evaluate', json({ prompt })),
};

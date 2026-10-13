import type { EventoSse } from '@guardian/shared';

/** Barramento em memória para o SSE. */
export function criarEventos() {
  const ouvintes = new Set<(e: EventoSse) => void>();
  return {
    publicar(evento: EventoSse): void {
      for (const ouvinte of ouvintes) ouvinte(evento);
    },
    assinar(ouvinte: (e: EventoSse) => void): () => void {
      ouvintes.add(ouvinte);
      return () => ouvintes.delete(ouvinte);
    },
  };
}

export type Eventos = ReturnType<typeof criarEventos>;

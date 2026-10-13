import type { PromptAvaliado } from '@guardian/shared';
import { marcadorDe } from '../logica.ts';

const CORES = {
  vermelho: 'bg-vermelho/12 text-vermelho ring-vermelho/30',
  amarelo: 'bg-amarelo/15 text-texto ring-amarelo/50',
  verde: 'bg-verde/12 text-verde ring-verde/30',
  azul: 'bg-azul/12 text-azul ring-azul/30',
  cinza: 'bg-cinza/15 text-texto-2 ring-cinza/40',
} as const;

/** Status sempre com ícone + rótulo, nunca só cor. */
export function Marcador({ prompt }: { prompt: PromptAvaliado }) {
  const m = marcadorDe(prompt);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${CORES[m.cor]}`}
    >
      <span aria-hidden>{m.emoji}</span>
      {m.rotulo}
    </span>
  );
}

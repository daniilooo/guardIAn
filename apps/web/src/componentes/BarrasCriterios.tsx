import { LIMIAR_RESSALVA } from '@guardian/shared';
import type { PromptAvaliado } from '@guardian/shared';
import { barrasDe, pct } from '../logica.ts';

/**
 * R4 — uma barra horizontal por critério (magnitude 0–100%, série única em um tom).
 * Marca vertical no limiar de 50%. Valor sempre em texto; tooltip no hover.
 */
export function BarrasCriterios({ prompt }: { prompt: PromptAvaliado }) {
  const barras = barrasDe(prompt);
  if (barras.length === 0) return null;
  return (
    <dl className="grid gap-1.5" aria-label="Nota por critério">
      {barras.map(({ id, rotulo, valor }) => (
        <div
          key={id}
          className="group grid grid-cols-[8.5rem_1fr_2.75rem] items-center gap-2 text-xs"
          title={`${rotulo}: ${pct(valor)}`}
        >
          <dt className="truncate text-texto-2">{rotulo}</dt>
          <dd className="relative m-0 h-2.5 rounded-full bg-trilho" aria-hidden>
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-barra transition-[width] group-hover:brightness-110"
              style={{ width: `${Math.max(valor * 100, valor > 0 ? 2 : 0)}%` }}
            />
            <span
              className="absolute -inset-y-0.5 w-px bg-limiar/60"
              style={{ left: `${LIMIAR_RESSALVA}%` }}
            />
          </dd>
          <dd className="m-0 text-right font-medium tabular-nums text-texto">{pct(valor)}</dd>
        </div>
      ))}
    </dl>
  );
}

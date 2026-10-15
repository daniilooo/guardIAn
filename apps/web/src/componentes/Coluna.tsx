import type { PromptAvaliado } from '@guardian/shared';
import { useState } from 'react';
import { CartaoPrompt } from './CartaoPrompt.tsx';

interface Props {
  titulo: string;
  descricao: string;
  prompts: PromptAvaliado[];
  vazio: string;
  onAprovar?: (p: PromptAvaliado) => void;
  onCarregarMais: (antesDe: string) => Promise<number>;
}

export function Coluna({ titulo, descricao, prompts, vazio, onAprovar, onCarregarMais }: Props) {
  const [carregando, setCarregando] = useState(false);
  const [fim, setFim] = useState(false);
  const ultimo = prompts.at(-1);

  async function mais() {
    if (!ultimo) return;
    setCarregando(true);
    try {
      if ((await onCarregarMais(ultimo.created_at)) === 0) setFim(true);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="flex min-w-0 flex-col gap-3" aria-label={titulo}>
      <header className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="m-0 text-sm font-semibold">{titulo}</h2>
          <p className="m-0 text-xs text-texto-3">{descricao}</p>
        </div>
        <span className="rounded-full bg-superficie-2 px-2 py-0.5 text-xs tabular-nums text-texto-2">
          {prompts.length}
        </span>
      </header>
      {prompts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-borda p-6 text-center text-sm text-texto-3">
          {vazio}
        </p>
      ) : (
        <>
          {prompts.map((p) => (
            <CartaoPrompt key={p.id} prompt={p} {...(onAprovar ? { onAprovar } : {})} />
          ))}
          {prompts.length >= 50 && !fim && (
            <button
              type="button"
              onClick={mais}
              disabled={carregando}
              className="self-center rounded-md px-3 py-1.5 text-xs font-medium text-texto-2 ring-1 ring-borda hover:bg-superficie-2 disabled:opacity-50"
            >
              {carregando ? 'Carregando…' : 'Carregar mais'}
            </button>
          )}
        </>
      )}
    </section>
  );
}

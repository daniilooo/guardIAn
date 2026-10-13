import { MENSAGENS, type PromptAvaliado } from '@guardian/shared';
import { useEffect, useRef } from 'react';

interface Props {
  prompt: PromptAvaliado;
  ocupado: boolean;
  onEnviar: () => void;
  onCancelar: () => void;
  onFechar: () => void;
}

/** R6 — aviso antes de liberar um prompt barrado. */
export function ModalOverride({ prompt, ocupado, onEnviar, onCancelar, onFechar }: Props) {
  const primeiro = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    primeiro.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onFechar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onFechar]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-override"
        className="w-full max-w-md rounded-xl bg-superficie p-5 shadow-xl ring-1 ring-borda"
      >
        <h2 id="titulo-override" className="m-0 text-base font-semibold">
          Enviar um prompt barrado?
        </h2>
        <p className="mt-2 text-sm text-texto-2">{MENSAGENS.overrideAviso}</p>
        {prompt.message && (
          <p className="mt-2 rounded-md bg-superficie-2 p-2 text-xs text-texto-2">
            {prompt.message}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={primeiro}
            type="button"
            disabled={ocupado}
            onClick={onCancelar}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-texto ring-1 ring-borda hover:bg-superficie-2 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={ocupado}
            onClick={onEnviar}
            className="rounded-md bg-azul px-3 py-1.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            Enviar mesmo assim
          </button>
        </div>
      </div>
    </div>
  );
}

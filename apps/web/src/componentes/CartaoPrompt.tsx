import type { PromptAvaliado } from '@guardian/shared';
import { useEffect, useState } from 'react';
import { rotuloDesfecho, segundosRestantes } from '../logica.ts';
import { BarrasCriterios } from './BarrasCriterios.tsx';
import { Marcador } from './Marcador.tsx';

interface Props {
  prompt: PromptAvaliado;
  onAprovar?: (p: PromptAvaliado) => void;
}

function useAgora(ativo: boolean) {
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    if (!ativo) return;
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, [ativo]);
  return agora;
}

/** Hora; prompts de outros dias mostram também a data. */
export function momento(iso: string, agora = new Date()): string {
  const d = new Date(iso);
  const hora = d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  if (d.toDateString() === agora.toDateString()) return hora;
  return `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${hora}`;
}

export function CartaoPrompt({ prompt, onAprovar }: Props) {
  const retido = prompt.final_decision === 'RETIDO';
  const agora = useAgora(retido);
  const restam = segundosRestantes(prompt.hold_expires_at, agora);
  const [expandido, setExpandido] = useState(false);
  const longo = prompt.text_masked.length > 240;

  return (
    <article
      className="rounded-lg bg-superficie p-3 ring-1 ring-borda"
      aria-label="Prompt avaliado"
    >
      <header className="flex flex-wrap items-center gap-2">
        <Marcador prompt={prompt} />
        {prompt.score_total !== null && (
          <span className="text-xs font-semibold tabular-nums text-texto">
            {Math.round(prompt.score_total)}%
          </span>
        )}
        <span className="ml-auto text-xs tabular-nums text-texto-3">
          {momento(prompt.created_at)}
        </span>
      </header>

      <p
        className={`mt-2 mb-0 whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-texto ${
          !expandido && longo ? 'line-clamp-4' : ''
        }`}
      >
        {prompt.text_masked}
      </p>
      {longo && (
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className="mt-1 text-xs font-medium text-azul hover:underline"
        >
          {expandido ? 'mostrar menos' : 'mostrar tudo'}
        </button>
      )}

      {/* Com barras, a mensagem ("Nota 39% — …") só repetiria os valores. */}
      {prompt.message && !prompt.scores && (
        <p className="mt-2 mb-0 text-xs text-texto-2">{prompt.message}</p>
      )}

      {prompt.scores && (
        <div className="mt-3">
          <BarrasCriterios prompt={prompt} />
        </div>
      )}

      <footer className="mt-3 flex flex-wrap items-center gap-2 text-xs text-texto-3">
        <span>{rotuloDesfecho(prompt.final_decision)}</span>
        <span aria-hidden>·</span>
        <span>{prompt.word_count} palavra(s)</span>
        {prompt.can_override && restam > 0 && onAprovar && (
          <span className="ml-auto flex items-center gap-2">
            <span className="tabular-nums text-vermelho" aria-live="polite">
              {restam}s para decidir
            </span>
            <button
              type="button"
              onClick={() => onAprovar(prompt)}
              className="rounded-md bg-superficie-2 px-2.5 py-1 font-semibold text-texto ring-1 ring-borda hover:brightness-95"
            >
              Aprovar manualmente
            </button>
          </span>
        )}
      </footer>
    </article>
  );
}

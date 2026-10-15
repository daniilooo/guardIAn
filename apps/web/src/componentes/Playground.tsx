import type { PromptAvaliado } from '@guardian/shared';
import { useState } from 'react';
import { api } from '../api.ts';
import { CartaoPrompt } from './CartaoPrompt.tsx';

interface Props {
  historico: PromptAvaliado[];
  onAvaliado: (p: PromptAvaliado) => void;
}

/** R8 — avalia um prompt de teste. Nunca envia a nenhuma LLM (consome créditos do JEV). */
export function Playground({ historico, onAvaliado }: Props) {
  const [texto, setTexto] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function avaliar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    setOcupado(true);
    setErro(null);
    try {
      onAvaliado(await api.playground(texto));
    } catch (falha) {
      setErro((falha as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={avaliar} className="flex flex-col gap-3">
        <label htmlFor="prompt-teste" className="text-sm font-semibold">
          Prompt de teste
        </label>
        <textarea
          id="prompt-teste"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={8}
          placeholder="Ex.: Em apps/server/src/auth.ts, na função validateEmail, rejeite emails sem domínio. Esperado: o teste auth.test.ts passa."
          className="w-full resize-y rounded-lg bg-superficie p-3 font-mono text-[13px] text-texto ring-1 ring-borda outline-none focus:ring-2 focus:ring-azul"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={ocupado || !texto.trim()}
            className="rounded-md bg-azul px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            {ocupado ? 'Avaliando…' : 'Avaliar'}
          </button>
          <span className="text-xs text-texto-3">
            Nada é enviado à LLM. Cada avaliação consome créditos do JEV.
          </span>
        </div>
        {erro && <p className="m-0 text-sm text-vermelho">{erro}</p>}
      </form>
      <section className="flex flex-col gap-3" aria-label="Histórico do playground">
        <h2 className="m-0 text-sm font-semibold">Avaliações</h2>
        {historico.length === 0 ? (
          <p className="rounded-lg border border-dashed border-borda p-6 text-center text-sm text-texto-3">
            As avaliações aparecem aqui.
          </p>
        ) : (
          historico.map((p) => <CartaoPrompt key={p.id} prompt={p} />)
        )}
      </section>
    </div>
  );
}

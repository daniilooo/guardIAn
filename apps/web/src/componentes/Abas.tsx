import type { Projeto } from '@guardian/shared';
import { ABA_PLAYGROUND } from '../logica.ts';

interface Props {
  projetos: Projeto[];
  selecionada: string;
  onSelecionar: (id: string) => void;
}

/** Abas: um projeto por aba (R9/R15) + Playground (R8). */
export function Abas({ projetos, selecionada, onSelecionar }: Props) {
  const abas = [
    ...projetos.map((p) => ({ id: p.id, nome: p.name, ativo: p.active, dica: p.path })),
    { id: ABA_PLAYGROUND, nome: 'Playground', ativo: true, dica: 'Avalia sem enviar à LLM' },
  ];
  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-borda"
      role="tablist"
      aria-label="Projetos"
    >
      {abas.map((a) => {
        const atual = a.id === selecionada;
        return (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={atual}
            title={a.dica}
            onClick={() => onSelecionar(a.id)}
            className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm whitespace-nowrap ${
              atual
                ? 'border-azul font-semibold text-texto'
                : 'border-transparent text-texto-2 hover:text-texto'
            }`}
          >
            {a.id === ABA_PLAYGROUND ? (
              <span aria-hidden>🧪</span>
            ) : (
              <span
                className={`size-2 rounded-full ${a.ativo ? 'bg-verde' : 'bg-cinza'}`}
                aria-label={a.ativo ? 'filtro ativo' : 'filtro inativo'}
              />
            )}
            {a.nome}
          </button>
        );
      })}
    </nav>
  );
}

import type { PromptAvaliado } from '@guardian/shared';
import { useCallback, useEffect, useState } from 'react';
import { api } from './api.ts';
import { Abas } from './componentes/Abas.tsx';
import { Coluna } from './componentes/Coluna.tsx';
import { ModalOverride } from './componentes/ModalOverride.tsx';
import { Playground } from './componentes/Playground.tsx';
import { ABA_PLAYGROUND, incluirPrompts, promptsDaAba } from './logica.ts';
import { usarGuardian } from './usarGuardian.ts';

const CHAVE_ABA = 'guardian.aba';
// Aba inicial: a do link (#<id>), senão a última usada neste navegador.
const lerAba = () => {
  const doLink = decodeURIComponent(window.location.hash.slice(1));
  if (doLink) return doLink;
  try {
    return localStorage.getItem(CHAVE_ABA);
  } catch {
    return null;
  }
};

export function App() {
  const g = usarGuardian();
  const [aba, setAba] = useState<string | null>(lerAba);
  const [emOverride, setEmOverride] = useState<PromptAvaliado | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Aba válida: a lembrada, senão o primeiro projeto ativo, senão o playground.
  const abaAtual =
    aba && (aba === ABA_PLAYGROUND || g.projetos.some((p) => p.id === aba))
      ? aba
      : (g.projetos.find((p) => p.active)?.id ?? g.projetos[0]?.id ?? ABA_PLAYGROUND);

  const { carregarAba } = g;
  useEffect(() => {
    carregarAba(abaAtual).catch(() => {});
  }, [abaAtual, carregarAba, g.versao]);

  const selecionar = (id: string) => {
    setAba(id);
    window.history.replaceState(null, '', `#${encodeURIComponent(id)}`);
    try {
      localStorage.setItem(CHAVE_ABA, id);
    } catch {
      /* preferência opcional */
    }
  };

  const decidir = useCallback(
    async (acao: 'override' | 'cancelar') => {
      if (!emOverride) return;
      setOcupado(true);
      setErro(null);
      try {
        const atualizado = await (acao === 'override' ? api.override : api.cancelar)(emOverride.id);
        g.setPrompts((e) => incluirPrompts(e, [atualizado]));
      } catch (falha) {
        setErro((falha as Error).message);
      } finally {
        setOcupado(false);
        setEmOverride(null);
      }
    },
    [emOverride, g],
  );

  const projeto = g.projetos.find((p) => p.id === abaAtual);

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 px-4 py-4">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="m-0 text-lg font-bold">
          <span aria-hidden>🛡️</span> guardIAn
        </h1>
        <span className="text-xs text-texto-3">portão de qualidade para prompts</span>
        <div className="ml-auto flex items-center gap-3 text-xs text-texto-2">
          <span className="flex items-center gap-1.5">
            <span
              className={`size-2 rounded-full ${g.conexao === 'conectado' ? 'bg-verde' : 'bg-vermelho'}`}
            />
            {g.conexao === 'conectado'
              ? 'Ao vivo'
              : g.conexao === 'conectando'
                ? 'Conectando…'
                : 'Reconectando…'}
          </span>
          <span>
            JEV:{' '}
            <strong className="font-semibold text-texto">
              {
                {
                  disponivel: 'disponível',
                  indisponivel: 'indisponível',
                  desconhecido: 'aguardando',
                }[g.jev]
              }
            </strong>
          </span>
        </div>
      </header>

      {g.jev === 'indisponivel' && (
        <div
          role="alert"
          className="rounded-lg bg-cinza/15 px-4 py-2.5 text-sm text-texto ring-1 ring-cinza/40"
        >
          <strong>⚪ JEV indisponível.</strong> Os prompts estão sendo liberados sem avaliação
          (marcados como JEV INDISPONÍVEL). Verifique a chave <code>TYPESAFE_API_KEY</code> e a
          conexão.
        </div>
      )}
      {erro && (
        <div
          role="alert"
          className="rounded-lg bg-vermelho/10 px-4 py-2.5 text-sm text-vermelho ring-1 ring-vermelho/30"
        >
          {erro}
        </div>
      )}

      <Abas projetos={g.projetos} selecionada={abaAtual} onSelecionar={selecionar} />

      {abaAtual === ABA_PLAYGROUND ? (
        <Playground
          historico={promptsDaAba(g.prompts, ABA_PLAYGROUND, 'todos')}
          onAvaliado={(p) => g.setPrompts((e) => incluirPrompts(e, [p]))}
        />
      ) : (
        <>
          {projeto && !projeto.active && (
            <p className="m-0 text-sm text-texto-2">
              ⏸️ Filtro desativado neste projeto. Use <code>/guardian-active</code> no Claude Code
              para reativar.
            </p>
          )}
          <main className="grid gap-6 lg:grid-cols-2">
            <Coluna
              titulo="Todos os prompts"
              descricao="Tudo o que foi enviado neste projeto"
              prompts={promptsDaAba(g.prompts, abaAtual, 'todos')}
              vazio={
                g.projetos.length === 0
                  ? 'Nenhum projeto ainda. No Claude Code, rode /guardian-active no projeto que deseja filtrar.'
                  : 'Nenhum prompt neste projeto ainda.'
              }
              onAprovar={setEmOverride}
              onCarregarMais={(antes) => g.carregarMais(abaAtual, 'all', antes)}
            />
            <Coluna
              titulo="Liberados para a LLM"
              descricao="Só o que o guardIAn deixou passar"
              prompts={promptsDaAba(g.prompts, abaAtual, 'liberados')}
              vazio="Nenhum prompt liberado ainda."
              onCarregarMais={(antes) => g.carregarMais(abaAtual, 'released', antes)}
            />
          </main>
        </>
      )}

      {emOverride && (
        <ModalOverride
          prompt={emOverride}
          ocupado={ocupado}
          onEnviar={() => decidir('override')}
          onCancelar={() => decidir('cancelar')}
          onFechar={() => setEmOverride(null)}
        />
      )}
    </div>
  );
}

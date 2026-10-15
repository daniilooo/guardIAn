import type { EventoSse, Projeto, SaudeJev } from '@guardian/shared';
import { useCallback, useEffect, useState } from 'react';
import { api } from './api.ts';
import {
  aplicarEventoProjetos,
  estadoInicial,
  incluirPrompts,
  type EstadoPrompts,
} from './logica.ts';

export type Conexao = 'conectando' | 'conectado' | 'desconectado';

/** Estado da UI alimentado por REST (carga inicial) + SSE (tempo real, com reconexão). */
export function usarGuardian() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [prompts, setPrompts] = useState<EstadoPrompts>(estadoInicial);
  const [jev, setJev] = useState<SaudeJev>('desconhecido');
  const [conexao, setConexao] = useState<Conexao>('conectando');
  const [versao, setVersao] = useState(0);

  const carregarAba = useCallback(async (aba: string) => {
    const [todos, liberados] = await Promise.all([
      api.prompts(aba, 'all'),
      api.prompts(aba, 'released'),
    ]);
    setPrompts((e) => incluirPrompts(e, [...todos, ...liberados]));
  }, []);

  const carregarMais = useCallback(
    async (aba: string, coluna: 'all' | 'released', antesDe: string) => {
      const lista = await api.prompts(aba, coluna, antesDe);
      setPrompts((e) => incluirPrompts(e, lista));
      return lista.length;
    },
    [],
  );

  useEffect(() => {
    api
      .projetos()
      .then(setProjetos)
      .catch(() => {});
  }, []);

  useEffect(() => {
    let fonte: EventSource | null = null;
    let encerrado = false;
    const conectar = () => {
      fonte = new EventSource('/api/events');
      fonte.onopen = () => {
        setConexao('conectado');
        // A cada (re)conexão recarrega a lista de projetos e força recarga da aba atual.
        api
          .projetos()
          .then(setProjetos)
          .catch(() => {});
        setVersao((v) => v + 1);
      };
      fonte.onerror = () => {
        if (!encerrado) setConexao('desconectado');
      };
      const tratar = (msg: MessageEvent<string>) => {
        const evento = JSON.parse(msg.data) as EventoSse;
        if (evento.type === 'jev.status') setJev(evento.jev);
        else if (evento.type === 'project.updated')
          setProjetos((p) => aplicarEventoProjetos(p, evento));
        else setPrompts((e) => incluirPrompts(e, [evento.prompt]));
      };
      for (const tipo of ['jev.status', 'project.updated', 'prompt.created', 'prompt.updated']) {
        fonte.addEventListener(tipo, tratar as EventListener);
      }
    };
    conectar();
    return () => {
      encerrado = true;
      fonte?.close();
    };
  }, []);

  return { projetos, prompts, jev, conexao, versao, carregarAba, carregarMais, setPrompts };
}

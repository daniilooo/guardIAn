// R5 / I12 — retenções em memória. Cada prompt retido tem um prazo; a primeira
// decisão (override, cancelamento, expiração, queda da conexão) vence e é única (I7).

export type DesfechoRetencao = 'LIBERADO' | 'CANCELADO' | 'DESCARTADO_TIMEOUT' | 'CANCELADO_NO_CLI';

interface Retencao {
  timer: NodeJS.Timeout;
  esperas: Set<(d: DesfechoRetencao) => void>;
}

export function criarRetencoes(aoDecidir: (id: string, desfecho: DesfechoRetencao) => void) {
  const ativas = new Map<string, Retencao>();

  function decidir(id: string, desfecho: DesfechoRetencao): boolean {
    const r = ativas.get(id);
    if (!r) return false;
    ativas.delete(id);
    clearTimeout(r.timer);
    aoDecidir(id, desfecho);
    for (const resolver of r.esperas) resolver(desfecho);
    return true;
  }

  return {
    abrir(id: string, prazoMs: number): void {
      const timer = setTimeout(() => decidir(id, 'DESCARTADO_TIMEOUT'), prazoMs);
      timer.unref();
      ativas.set(id, { timer, esperas: new Set() });
    },
    ativa(id: string): boolean {
      return ativas.has(id);
    },
    decidir,
    /** Aguarda o desfecho. `null` se não há retenção ativa para o id. */
    aguardar(id: string): Promise<DesfechoRetencao> | null {
      const r = ativas.get(id);
      if (!r) return null;
      return new Promise((resolver) => r.esperas.add(resolver));
    },
    /** I12 — chamado quando a conexão do hook cai. */
    conexaoEncerrada(id: string): void {
      decidir(id, 'CANCELADO_NO_CLI');
    },
    encerrarTodas(): void {
      for (const id of [...ativas.keys()]) decidir(id, 'DESCARTADO_TIMEOUT');
    },
  };
}

export type Retencoes = ReturnType<typeof criarRetencoes>;

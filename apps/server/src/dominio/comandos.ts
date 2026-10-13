import { COMANDOS, type Comando } from '@guardian/shared';

// R14 / D42 — aceita `/guardian-x` e a forma com namespace do plugin `/guardian:guardian-x` (S13).
const PADRAO_COMANDO = /^\/(?:guardian:)?(guardian-[a-z0-9-]+)(?:\s|$)/i;

export type ReconhecimentoComando =
  { tipo: 'comando'; comando: Comando } | { tipo: 'comando_desconhecido'; nome: string };

/** Identifica comandos do guardIAn. Retorna null para prompts comuns. */
export function reconhecerComando(prompt: string): ReconhecimentoComando | null {
  const nome = PADRAO_COMANDO.exec(prompt.trim())?.[1]?.toLowerCase();
  if (!nome) return null;
  return (COMANDOS as readonly string[]).includes(nome)
    ? { tipo: 'comando', comando: nome as Comando }
    : { tipo: 'comando_desconhecido', nome };
}

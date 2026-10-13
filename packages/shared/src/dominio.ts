// Vocabulário do domínio (vault/02_BUSINESS/DOMAIN_GLOSSARY.md e STATE_MACHINES.md).

export const STATUS = {
  BARRADO: 'BARRADO',
  APROVADO_COM_RESSALVA: 'APROVADO_COM_RESSALVA',
  APROVADO: 'APROVADO',
  APROVADO_PELO_USUARIO: 'APROVADO_PELO_USUARIO',
  JEV_INDISPONIVEL: 'JEV_INDISPONIVEL',
} as const;
export type Status = (typeof STATUS)[keyof typeof STATUS];

export const MOTIVO_BLOQUEIO = {
  SEGREDO_DETECTADO: 'SEGREDO_DETECTADO',
  PROMPT_CURTO: 'PROMPT_CURTO',
  NOTA_BAIXA: 'NOTA_BAIXA',
} as const;
export type MotivoBloqueio = (typeof MOTIVO_BLOQUEIO)[keyof typeof MOTIVO_BLOQUEIO];

export const DECISAO_FINAL = {
  LIBERADO: 'LIBERADO',
  RETIDO: 'RETIDO',
  DESCARTADO_TIMEOUT: 'DESCARTADO_TIMEOUT',
  CANCELADO: 'CANCELADO',
  CANCELADO_NO_CLI: 'CANCELADO_NO_CLI',
  AVALIADO_PLAYGROUND: 'AVALIADO_PLAYGROUND',
} as const;
export type DecisaoFinal = (typeof DECISAO_FINAL)[keyof typeof DECISAO_FINAL];

export const ORIGEM = {
  CLAUDE_CODE: 'claude_code',
  CODEX: 'codex',
  PLAYGROUND: 'playground',
} as const;
export type Origem = (typeof ORIGEM)[keyof typeof ORIGEM];

/** Marcadores visuais (BUSINESS_RULES.md#marcadores). */
export const MARCADORES = {
  BARRADO: { rotulo: 'BARRADO', cor: 'vermelho', emoji: '🔴', liberado: false },
  SEGREDO_DETECTADO: {
    rotulo: 'BARRADO — SEGREDO DETECTADO',
    cor: 'vermelho',
    emoji: '🔴🔒',
    liberado: false,
  },
  APROVADO_COM_RESSALVA: {
    rotulo: 'APROVADO COM RESSALVA',
    cor: 'amarelo',
    emoji: '🟡',
    liberado: true,
  },
  APROVADO: { rotulo: 'APROVADO', cor: 'verde', emoji: '🟢', liberado: true },
  APROVADO_PELO_USUARIO: {
    rotulo: 'APROVADO PELO USUÁRIO',
    cor: 'azul',
    emoji: '🔵',
    liberado: true,
  },
  JEV_INDISPONIVEL: { rotulo: 'JEV INDISPONÍVEL', cor: 'cinza', emoji: '⚪', liberado: true },
} as const;
export type TipoMarcador = keyof typeof MARCADORES;

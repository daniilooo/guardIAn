// Regras de negócio numéricas (vault/02_BUSINESS/BUSINESS_RULES.md).
// Alterar qualquer valor aqui é gate humano G2.

/** R2 — prompts com menos palavras que isto são barrados localmente. */
export const MIN_PALAVRAS = 5;

/** R3 — nota composta (0–100) mínima para APROVADO COM RESSALVA. Exatamente 50 passa (H4). */
export const LIMIAR_RESSALVA = 50;

/** R3 — nota composta (0–100) mínima para APROVADO. */
export const LIMIAR_APROVADO = 75;

/** R5 — tempo que um prompt barrado aguarda override antes de ser descartado. */
export const RETENCAO_SEGUNDOS = 60;

/** I11 — prazo interno do hook: passou disso, o hook barra por conta própria. */
export const HOOK_PRAZO_INTERNO_SEGUNDOS = 68;

/** I11 — timeout configurado no Claude Code; se estourar, o CLI libera o prompt. */
export const HOOK_TIMEOUT_SEGUNDOS = 75;

export const HOST_PADRAO = '127.0.0.1';
export const PORTA_PADRAO = 7070;

/** R3 — critérios avaliados pelo JEV, com peso igual. */
export const CRITERIOS = [
  { id: 'clareza', rotulo: 'Clareza do pedido', peso: 0.25 },
  { id: 'onde_mexer', rotulo: 'Onde mexer', peso: 0.25 },
  { id: 'o_que_fazer', rotulo: 'O que fazer', peso: 0.25 },
  { id: 'resultado', rotulo: 'Resultado esperado', peso: 0.25 },
] as const;

export type CriterioId = (typeof CRITERIOS)[number]['id'];

/** H2 — níveis da rubrica Score de cada critério (0 a NIVEIS_RUBRICA - 1). */
export const NIVEIS_RUBRICA = 5;

/** R14 / D42 — comandos executados pelo próprio hook (aceitos também como `/guardian:<comando>`). */
export const COMANDOS = ['guardian-active', 'guardian-inactive'] as const;
export type Comando = (typeof COMANDOS)[number];

export const MENSAGENS = {
  promptCurto: 'Prompt muito curto, seja mais específico.',
  servidorOffline: '⚠️ guardIAn offline: prompt não avaliado',
  segredoDetectado: 'Segredo detectado no prompt. Remova o segredo e envie novamente.',
  retencaoExpirada: 'Tempo de decisão esgotado (60s): prompt descartado.',
  overrideAviso:
    'Este prompt não atende aos critérios mínimos. O resultado retornado pela LLM pode ser diferente do que você quer.',
} as const;

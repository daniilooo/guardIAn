import { HOST_PADRAO, PORTA_PADRAO } from '@guardian/shared';

// Único ponto que lê variáveis de ambiente (MODULE_MAP). A chave nunca é logada.

export interface Config {
  host: string;
  porta: number;
  caminhoBanco: string;
  typesafeApiKey: string | undefined;
  jevModelo: string;
  jevTimeoutMs: number;
  nivelLog: string;
}

function numero(valor: string | undefined, padrao: number): number {
  const n = Number(valor);
  return valor && Number.isFinite(n) && n > 0 ? n : padrao;
}

export function lerConfig(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    host: env.GUARDIAN_HOST || HOST_PADRAO,
    porta: numero(env.GUARDIAN_PORT, PORTA_PADRAO),
    caminhoBanco: env.GUARDIAN_DB_PATH || './data/guardian.db',
    typesafeApiKey: env.TYPESAFE_API_KEY || undefined,
    jevModelo: env.JEV_MODEL || 'jev-latest',
    jevTimeoutMs: numero(env.JEV_TIMEOUT_MS, 10_000),
    nivelLog: env.LOG_LEVEL || 'info',
  };
}

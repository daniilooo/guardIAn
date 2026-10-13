// Padrões de segredo (R16, ADR-0007). Fonte única: usados pelo produto (Fase 4),
// pelo pre-commit e pelo CI (scripts/check-secrets.ts).
// Falso positivo bloqueia o prompt SEM override (D38) — prefira padrões precisos.

export interface PadraoSegredo {
  tipo: string;
  descricao: string;
  regex: RegExp;
}

export const PADROES_SEGREDO: readonly PadraoSegredo[] = [
  {
    tipo: 'anthropic_key',
    descricao: 'Chave da API Anthropic',
    regex: /sk-ant-[A-Za-z0-9_-]{20,}/,
  },
  {
    tipo: 'openai_key',
    descricao: 'Chave da API OpenAI',
    regex: /sk-(?!ant-)(?:proj-)?[A-Za-z0-9_-]{32,}/,
  },
  { tipo: 'github_token', descricao: 'Token do GitHub', regex: /gh[pousr]_[A-Za-z0-9]{36,}/ },
  {
    tipo: 'github_pat',
    descricao: 'Token fine-grained do GitHub',
    regex: /github_pat_[A-Za-z0-9_]{40,}/,
  },
  {
    tipo: 'aws_access_key',
    descricao: 'Access key da AWS',
    regex: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/,
  },
  { tipo: 'google_api_key', descricao: 'Chave de API do Google', regex: /AIza[0-9A-Za-z_-]{35}/ },
  { tipo: 'slack_token', descricao: 'Token do Slack', regex: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
  {
    tipo: 'stripe_key',
    descricao: 'Chave secreta do Stripe',
    regex: /\b[rs]k_live_[A-Za-z0-9]{24,}/,
  },
  {
    tipo: 'private_key',
    descricao: 'Chave privada PEM',
    regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  },
  {
    tipo: 'jwt',
    descricao: 'JSON Web Token',
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  },
  {
    tipo: 'connection_string',
    descricao: 'Connection string com senha',
    regex: /\b[a-z][a-z0-9+.-]*:\/\/[^\s:/@]+:[^\s:/@]{3,}@[^\s/]+/i,
  },
  {
    tipo: 'atribuicao_segredo',
    descricao: 'Atribuição literal de senha/segredo/token',
    regex:
      /\b(?:password|passwd|senha|secret|token|api[_-]?key)\b["']?\s*[:=]\s*["']?[A-Za-z0-9_\-+/=!@#$%^&*]{12,}["']?/i,
  },
];

export interface OcorrenciaSegredo {
  tipo: string;
  inicio: number;
  fim: number;
}

/** Encontra todas as ocorrências de segredo no texto (sem expor o valor). */
export function encontrarSegredos(texto: string): OcorrenciaSegredo[] {
  const ocorrencias: OcorrenciaSegredo[] = [];
  for (const { tipo, regex } of PADROES_SEGREDO) {
    for (const m of texto.matchAll(new RegExp(regex.source, regex.flags.replace('g', '') + 'g'))) {
      ocorrencias.push({ tipo, inicio: m.index, fim: m.index + m[0].length });
    }
  }
  return ocorrencias.sort((a, b) => a.inicio - b.inicio);
}

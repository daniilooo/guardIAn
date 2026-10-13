import { describe, expect, it } from 'vitest';
import { encontrarSegredos, PADROES_SEGREDO } from './segredos.ts';

// Fixtures sintéticas montadas em tempo de execução: o arquivo de teste não contém
// nenhum literal que case com os padrões (senão o próprio scanner o barraria).
const r = (n: number, c = 'a') => c.repeat(n);
const POSITIVOS: Record<string, string> = {
  anthropic_key: `minha chave é ${'sk-' + 'ant-api03-' + r(40)}`,
  openai_key: `OPENAI=${'sk-' + 'proj-' + r(40, 'B')}`,
  github_token: `${'gh' + 'p_' + r(36, 'x')}`,
  github_pat: `${'github' + '_pat_' + r(50, 'Z')}`,
  aws_access_key: `aws ${'AK' + 'IA' + r(16, 'Q')} fim`,
  google_api_key: `${'AI' + 'za' + r(35, 'k')}`,
  slack_token: `${'xo' + 'xb-' + r(20, '1')}`,
  stripe_key: `${'sk' + '_live_' + r(24, 'm')}`,
  private_key: `${'-----BEGIN ' + 'RSA PRIVATE KEY-----'}\nMIIE...`,
  jwt: `Bearer ${'ey' + 'J' + r(20)}.${'ey' + 'J' + r(20)}.${r(20)}`,
  connection_string: `use ${'postgres://' + 'admin:' + 'superSenha' + '@db.local:5432/app'}`,
  atribuicao_segredo: `${'pass' + 'word'} = "${r(16, 'p')}"`,
};

describe('padrões de segredo (R16)', () => {
  it('cobre todos os tipos com um exemplo positivo', () => {
    expect(Object.keys(POSITIVOS).sort()).toEqual(PADROES_SEGREDO.map((p) => p.tipo).sort());
  });

  it.each(Object.entries(POSITIVOS))('detecta %s', (tipo, texto) => {
    expect(encontrarSegredos(texto).map((o) => o.tipo)).toContain(tipo);
  });

  it.each([
    ['nome de variável sem valor', 'TYPESAFE_API_KEY='],
    ['leitura de env', 'const apiKey = process.env.TYPESAFE_API_KEY;'],
    ['tipo TypeScript', 'token: string'],
    ['prefixo truncado em documentação', 'chaves como sk-ant-… são mascaradas'],
    ['URL sem credencial', 'https://api.typesafe.ai/v1/systemone'],
    ['prompt comum', 'Em apps/server/src/auth.ts, valide o token do usuário e retorne 401'],
  ])('não acusa %s', (_caso, texto) => {
    expect(encontrarSegredos(texto)).toEqual([]);
  });

  it('não classifica chave Anthropic também como OpenAI', () => {
    expect(encontrarSegredos(POSITIVOS.anthropic_key!).map((o) => o.tipo)).toEqual([
      'anthropic_key',
    ]);
  });

  it('retorna posições ordenadas sem expor o valor', () => {
    const texto = `a ${POSITIVOS.github_token} b ${POSITIVOS.anthropic_key}`;
    const achados = encontrarSegredos(texto);
    expect(achados.map((a) => a.tipo)).toEqual(['github_token', 'anthropic_key']);
    expect(achados[0]).not.toHaveProperty('valor');
  });
});

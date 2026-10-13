import { describe, expect, it } from 'vitest';
import { arquivoEnvProibido, verificarConteudo } from './check-secrets.ts';

describe('check-secrets', () => {
  it.each([
    ['.env', true],
    ['apps/server/.env.local', true],
    ['.env.example', false],
    ['docs/env.md', false],
  ])('arquivo %s proibido? %s', (arquivo, esperado) => {
    expect(arquivoEnvProibido(arquivo)).toBe(esperado);
  });

  it('reporta a linha e o tipo, sem o valor', () => {
    const token = 'gh' + 'p_' + 'x'.repeat(36);
    const achados = verificarConteudo('a.ts', `linha 1\nconst t = '${token}';\n`);
    expect(achados).toEqual([{ arquivo: 'a.ts', linha: 2, tipo: 'github_token' }]);
  });

  it('ignora arquivos binários', () => {
    expect(verificarConteudo('img.png', 'abc\0' + 'gh' + 'p_' + 'x'.repeat(36))).toEqual([]);
  });
});

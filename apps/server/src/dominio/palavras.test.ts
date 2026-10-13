import { describe, expect, it } from 'vitest';
import { contarPalavras } from './palavras.ts';

describe('contarPalavras (R2)', () => {
  it.each([
    ['', 0],
    ['arruma isso', 2],
    ['um dois três quatro', 4],
    ['um dois três quatro cinco', 5],
    ['  espaços   extras\n e\tquebras  aqui ', 5],
    ['- - - ok', 1],
    ['ação é útil, não?', 4],
    ['corrija auth.ts:42 agora', 3],
    ['[SEGREDO:github_token] use isto', 3],
  ])('"%s" tem %i palavra(s)', (texto, esperado) => {
    expect(contarPalavras(texto)).toBe(esperado);
  });
});

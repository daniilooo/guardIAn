import { describe, expect, it } from 'vitest';
import { validarMensagem } from './check-commit-msg.ts';

describe('validarMensagem (Conventional Commits)', () => {
  it.each([
    'feat(server): adiciona rota de avaliação',
    'fix: corrige timeout do hook',
    'feat(shared)!: muda contrato do hook',
    'docs(vault): registra decisão\n\ncorpo explicativo',
    '# comentário do git\nchore: ajusta configuração',
    'Merge pull request #4 from daniilooo/develop',
    'Revert "feat: algo"',
  ])('aceita: %s', (msg) => {
    expect(validarMensagem(msg)).toBeNull();
  });

  it.each([
    'adiciona rota',
    'feature: tipo inválido',
    'feat(Server): escopo com maiúscula',
    'feat:sem espaço',
    `feat: ${'x'.repeat(73)}`,
    '',
  ])('rejeita: %s', (msg) => {
    expect(validarMensagem(msg)).toMatch(/Conventional Commits/);
  });
});

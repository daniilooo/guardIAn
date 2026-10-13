import { describe, expect, it } from 'vitest';
import { mascararSegredos } from './segredos.ts';

// Fixtures sintéticas montadas em tempo de execução (ver packages/shared/src/segredos.test.ts).
const github = 'gh' + 'p_' + 'x'.repeat(36);
const anthropic = 'sk-' + 'ant-api03-' + 'a'.repeat(40);

describe('mascararSegredos (R16 / I3)', () => {
  it('mantém texto sem segredo', () => {
    expect(mascararSegredos('corrija o login')).toEqual({ texto: 'corrija o login', tipos: [] });
  });

  it('mascara um segredo e informa o tipo', () => {
    const r = mascararSegredos(`use ${github} no deploy`);
    expect(r).toEqual({ texto: 'use [SEGREDO:github_token] no deploy', tipos: ['github_token'] });
  });

  it('mascara vários segredos preservando o resto', () => {
    const r = mascararSegredos(`a ${github} b ${anthropic} c`);
    expect(r.texto).toBe('a [SEGREDO:github_token] b [SEGREDO:anthropic_key] c');
  });

  it('une ocorrências sobrepostas num único trecho', () => {
    const r = mascararSegredos(`token = "${github}" ok`);
    expect(r.texto).toBe('[SEGREDO:atribuicao_segredo] ok');
    expect(r.tipos.sort()).toEqual(['atribuicao_segredo', 'github_token']);
  });

  it('nunca devolve o valor original', () => {
    const r = mascararSegredos(`${github}\n${anthropic}`);
    expect(r.texto).not.toContain(github);
    expect(r.texto).not.toContain(anthropic);
  });
});

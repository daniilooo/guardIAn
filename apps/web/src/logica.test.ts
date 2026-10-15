import { describe, expect, it } from 'vitest';
import {
  ABA_PLAYGROUND,
  aplicarEventoProjetos,
  barrasDe,
  estadoInicial,
  incluirPrompts,
  marcadorDe,
  promptsDaAba,
  segundosRestantes,
  tipoMarcador,
} from './logica.ts';
import { prompt } from './teste-fixtures.ts';

describe('marcadores', () => {
  it('segredo tem marcador próprio, mesmo com status BARRADO', () => {
    const p = prompt({ status: 'BARRADO', block_reason: 'SEGREDO_DETECTADO' });
    expect(tipoMarcador(p)).toBe('SEGREDO_DETECTADO');
    expect(marcadorDe(p).rotulo).toBe('BARRADO — SEGREDO DETECTADO');
  });

  it.each([
    ['BARRADO', 'vermelho'],
    ['APROVADO_COM_RESSALVA', 'amarelo'],
    ['APROVADO', 'verde'],
    ['APROVADO_PELO_USUARIO', 'azul'],
    ['JEV_INDISPONIVEL', 'cinza'],
  ] as const)('%s → %s', (status, cor) => {
    expect(marcadorDe(prompt({ status })).cor).toBe(cor);
  });
});

describe('segundosRestantes', () => {
  const agora = Date.parse('2026-10-13T10:00:00.000Z');
  it.each([
    [null, 0],
    ['2026-10-13T10:01:00.000Z', 60],
    ['2026-10-13T10:00:00.400Z', 1],
    ['2026-10-13T09:59:00.000Z', 0],
  ])('%s → %i', (expira, esperado) => {
    expect(segundosRestantes(expira, agora)).toBe(esperado);
  });
});

describe('colunas', () => {
  const estado = incluirPrompts(estadoInicial, [
    prompt({ id: 'a', created_at: '2026-10-13T10:00:00Z' }),
    prompt({
      id: 'b',
      created_at: '2026-10-13T10:05:00Z',
      status: 'BARRADO',
      final_decision: 'RETIDO',
    }),
    prompt({ id: 'c', project_id: 'outro' }),
    prompt({
      id: 'd',
      project_id: null,
      source: 'playground',
      final_decision: 'AVALIADO_PLAYGROUND',
    }),
  ]);

  it('coluna esquerda: todos do projeto, mais recentes primeiro', () => {
    expect(promptsDaAba(estado, 'proj', 'todos').map((p) => p.id)).toEqual(['b', 'a']);
  });

  it('coluna direita: só os liberados', () => {
    expect(promptsDaAba(estado, 'proj', 'liberados').map((p) => p.id)).toEqual(['a']);
  });

  it('playground lista só prompts sem projeto', () => {
    expect(promptsDaAba(estado, ABA_PLAYGROUND, 'todos').map((p) => p.id)).toEqual(['d']);
  });

  it('atualização substitui o prompt existente (override move para a direita)', () => {
    const novo = incluirPrompts(estado, [
      prompt({
        id: 'b',
        created_at: '2026-10-13T10:05:00Z',
        status: 'APROVADO_PELO_USUARIO',
        final_decision: 'LIBERADO',
      }),
    ]);
    expect(promptsDaAba(novo, 'proj', 'liberados').map((p) => p.id)).toEqual(['b', 'a']);
  });
});

it('barrasDe segue a ordem dos critérios', () => {
  expect(barrasDe(prompt()).map((b) => b.rotulo)).toEqual([
    'Clareza do pedido',
    'Onde mexer',
    'O que fazer',
    'Resultado esperado',
  ]);
  expect(barrasDe(prompt({ scores: null }))).toEqual([]);
});

it('aplicarEventoProjetos insere/atualiza e ordena por nome', () => {
  const base = { path: '/x', active: true, created_at: '', updated_at: '' };
  const lista = aplicarEventoProjetos([{ ...base, id: '1', name: 'zeta' }], {
    type: 'project.updated',
    project: { ...base, id: '2', name: 'alfa' },
  });
  expect(lista.map((p) => p.name)).toEqual(['alfa', 'zeta']);
});

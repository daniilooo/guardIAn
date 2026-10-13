import { describe, expect, it } from 'vitest';
import { reconhecerComando } from './comandos.ts';

describe('reconhecerComando (R14 / D42)', () => {
  it.each([
    ['/guardian-active', 'guardian-active'],
    ['/guardian-inactive', 'guardian-inactive'],
    ['/guardian:guardian-active', 'guardian-active'],
    ['  /GUARDIAN-ACTIVE  ', 'guardian-active'],
    ['/guardian-active agora mesmo', 'guardian-active'],
  ])('reconhece %s', (prompt, comando) => {
    expect(reconhecerComando(prompt)).toEqual({ tipo: 'comando', comando });
  });

  it('marca comando guardian desconhecido sem avaliá-lo', () => {
    expect(reconhecerComando('/guardian-status')).toEqual({
      tipo: 'comando_desconhecido',
      nome: 'guardian-status',
    });
  });

  it.each([
    'guardian-active',
    '/help',
    '/outro-plugin:guardian-active',
    'use /guardian-active para ativar',
    'Implemente o comando /guardian-active no plugin',
  ])('não trata como comando: %s', (prompt) => {
    expect(reconhecerComando(prompt)).toBeNull();
  });
});

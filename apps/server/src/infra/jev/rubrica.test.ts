import { CRITERIOS, NIVEIS_RUBRICA } from '@guardian/shared';
import { describe, expect, it } from 'vitest';
import { RUBRICA } from './rubrica.ts';

describe('RUBRICA (H2)', () => {
  it.each(CRITERIOS.map((c) => c.id))('%s tem instrução e 5 níveis distintos', (id) => {
    expect(RUBRICA[id].instrucao.length).toBeGreaterThan(10);
    expect(RUBRICA[id].niveis).toHaveLength(NIVEIS_RUBRICA);
    expect(new Set(RUBRICA[id].niveis).size).toBe(NIVEIS_RUBRICA);
  });
});

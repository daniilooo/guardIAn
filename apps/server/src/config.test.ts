import { describe, expect, it } from 'vitest';
import { lerConfig } from './config.ts';

describe('lerConfig', () => {
  it('usa padrões seguros', () => {
    expect(lerConfig({})).toMatchObject({
      host: '127.0.0.1',
      porta: 7070,
      caminhoBanco: './data/guardian.db',
      typesafeApiKey: undefined,
      jevModelo: 'jev-latest',
      jevTimeoutMs: 10_000,
    });
  });

  it.each(['127.0.0.1', 'localhost', '::1'])('aceita loopback %s', (host) => {
    expect(lerConfig({ GUARDIAN_HOST: host }).host).toBe(host);
  });

  it.each(['0.0.0.0', '192.168.0.10', '::'])('recusa expor o servidor em %s (ADR-0006)', (host) => {
    expect(() => lerConfig({ GUARDIAN_HOST: host })).toThrow(/só pode escutar em/);
  });

  it('ignora números inválidos', () => {
    expect(lerConfig({ GUARDIAN_PORT: 'abc', JEV_TIMEOUT_MS: '-5' })).toMatchObject({
      porta: 7070,
      jevTimeoutMs: 10_000,
    });
  });

  it('chave vazia conta como ausente', () => {
    expect(lerConfig({ TYPESAFE_API_KEY: '' }).typesafeApiKey).toBeUndefined();
  });
});

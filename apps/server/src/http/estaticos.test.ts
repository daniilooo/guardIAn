import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import Fastify from 'fastify';
import { describe, expect, it } from 'vitest';
import { servirUi } from './estaticos.ts';

function montar() {
  const base = mkdtempSync(join(tmpdir(), 'guardian-ui-'));
  const dist = join(base, 'dist');
  mkdirSync(join(dist, 'assets'), { recursive: true });
  writeFileSync(join(dist, 'index.html'), '<html>ui</html>');
  writeFileSync(join(dist, 'assets', 'app-123.js'), 'console.log(1)');
  writeFileSync(join(base, 'segredo.txt'), 'fora da pasta');
  const app = Fastify();
  servirUi(app, dist);
  return app;
}

describe('servirUi', () => {
  it('serve o index.html na raiz sem cache', async () => {
    const r = await montar().inject({ url: '/' });
    expect(r.statusCode).toBe(200);
    expect(r.headers['content-type']).toContain('text/html');
    expect(r.headers['cache-control']).toBe('no-cache');
    expect(r.body).toBe('<html>ui</html>');
  });

  it('serve assets com cache imutável', async () => {
    const r = await montar().inject({ url: '/assets/app-123.js' });
    expect(r.headers['content-type']).toContain('text/javascript');
    expect(r.headers['cache-control']).toContain('immutable');
  });

  it('cai no index.html para rotas da SPA', async () => {
    expect((await montar().inject({ url: '/projetos/x' })).body).toBe('<html>ui</html>');
  });

  it.each(['/../segredo.txt', '/%2e%2e/segredo.txt', '/assets/../../segredo.txt'])(
    'não sai da pasta (%s)',
    async (url) => {
      const r = await montar().inject({ url });
      expect(r.body).not.toContain('fora da pasta');
    },
  );

  it('mantém 404 JSON para /api desconhecida', async () => {
    const r = await montar().inject({ url: '/api/nao-existe' });
    expect(r.statusCode).toBe(404);
    expect(r.json()).toEqual({ erro: 'rota inexistente' });
  });
});

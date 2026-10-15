import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import type { FastifyInstance } from 'fastify';

// Serve a UI compilada (apps/web/dist) na mesma origem da API. Sem dependência extra:
// só GET, sem listagem de diretório, caminhos confinados à pasta (path traversal) e
// fallback para index.html (SPA). Rotas /api/* desconhecidas continuam 404 JSON.

const TIPOS: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

export function servirUi(app: FastifyInstance, pasta: string): void {
  const raiz = resolve(pasta);
  if (!existsSync(resolve(raiz, 'index.html'))) {
    app.get('/', async (_req, reply) =>
      reply
        .type('text/plain; charset=utf-8')
        .send('UI não compilada. Rode: pnpm --filter @guardian/web build'),
    );
    return;
  }

  app.get('/*', async (req, reply) => {
    const caminho = decodeURIComponent(req.url.split('?')[0] ?? '/');
    if (caminho.startsWith('/api/')) return reply.code(404).send({ erro: 'rota inexistente' });

    const alvo = resolve(raiz, `.${caminho}`);
    const dentro = alvo === raiz || alvo.startsWith(raiz + sep);
    const arquivo =
      dentro && (await stat(alvo).catch(() => null))?.isFile() ? alvo : resolve(raiz, 'index.html');

    // Arquivos com hash no nome podem ficar em cache; o index.html nunca.
    const imutavel = arquivo.includes(`${sep}assets${sep}`);
    return reply
      .type(TIPOS[extname(arquivo)] ?? 'application/octet-stream')
      .header('cache-control', imutavel ? 'public, max-age=31536000, immutable' : 'no-cache')
      .header('x-content-type-options', 'nosniff')
      .send(await readFile(arquivo));
  });
}

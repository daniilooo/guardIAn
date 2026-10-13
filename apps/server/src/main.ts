// Ponto de entrada: `pnpm start` (Node puro, type stripping). Compõe as dependências.
import { fileURLToPath } from 'node:url';
import { RETENCAO_SEGUNDOS } from '@guardian/shared';
import { criarEventos } from './aplicacao/eventos.ts';
import { criarServico } from './aplicacao/servico.ts';
import { lerConfig } from './config.ts';
import { criarApp } from './http/app.ts';
import { abrirBanco } from './infra/db/conexao.ts';
import { criarRepositorios } from './infra/db/repositorios.ts';
import { criarAvaliadorJev } from './infra/jev/avaliador-jev.ts';

const config = lerConfig();
const eventos = criarEventos();
const urlUi = `http://${config.host}:${config.porta}`;
const servico = criarServico({
  repos: criarRepositorios(abrirBanco(config.caminhoBanco)),
  avaliador: criarAvaliadorJev({
    apiKey: config.typesafeApiKey,
    modelo: config.jevModelo,
    timeoutMs: config.jevTimeoutMs,
  }),
  eventos,
  retencaoMs: RETENCAO_SEGUNDOS * 1000,
  urlUi,
});

const app = criarApp({
  servico,
  eventos,
  hostsPermitidos: [`${config.host}:${config.porta}`, `localhost:${config.porta}`],
  logger: { level: config.nivelLog },
  pastaWeb: fileURLToPath(new URL('../../web/dist', import.meta.url)),
});

const orfas = servico.descartarRetencoesOrfas();
if (orfas) app.log.warn(`${orfas} retenção(ões) antiga(s) descartada(s) após reinício`);
if (!config.typesafeApiKey)
  app.log.warn('TYPESAFE_API_KEY ausente: prompts serão liberados como JEV INDISPONÍVEL');

for (const sinal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(sinal, async () => {
    servico.encerrar();
    await app.close();
    process.exit(0);
  });
}

await app.listen({ host: config.host, port: config.porta });
app.log.info(`guardIAn em ${urlUi}`);

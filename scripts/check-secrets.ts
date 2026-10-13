// Detector de segredos do repositório (pre-commit e CI).
// Usa os mesmos padrões do produto (packages/shared — ADR-0007).
// Uso: node scripts/check-secrets.ts [--staged]
// Saída: apenas arquivo:linha:tipo — nunca o valor (o log do CI é público).
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { encontrarSegredos } from '../packages/shared/src/segredos.ts';

const ENV_PROIBIDO = /(^|\/)\.env(\..+)?$/;
const ENV_PERMITIDO = /(^|\/)\.env\.example$/;

export interface Achado {
  arquivo: string;
  linha: number;
  tipo: string;
}

export function verificarConteudo(arquivo: string, conteudo: string): Achado[] {
  if (conteudo.includes('\0')) return []; // binário
  return encontrarSegredos(conteudo).map(({ tipo, inicio }) => ({
    arquivo,
    linha: conteudo.slice(0, inicio).split('\n').length,
    tipo,
  }));
}

export function arquivoEnvProibido(arquivo: string): boolean {
  return ENV_PROIBIDO.test(arquivo) && !ENV_PERMITIDO.test(arquivo);
}

function git(...args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function main(): void {
  const staged = process.argv.includes('--staged');
  const arquivos = (
    staged
      ? git('diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z')
      : git('ls-files', '-z')
  )
    .split('\0')
    .filter(Boolean);

  const envs = arquivos.filter(arquivoEnvProibido);
  const achados = arquivos
    .filter((a) => !arquivoEnvProibido(a))
    .flatMap((a) => verificarConteudo(a, staged ? git('show', `:${a}`) : readFileSync(a, 'utf8')));

  for (const e of envs) console.error(`::error::Arquivo .env não pode ser versionado: ${e}`);
  for (const a of achados)
    console.error(`::error::Possível segredo (${a.tipo}) em ${a.arquivo}:${a.linha}`);

  if (envs.length || achados.length) process.exit(1);
  console.log(`Nenhum segredo ou .env encontrado (${arquivos.length} arquivo(s) verificados).`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

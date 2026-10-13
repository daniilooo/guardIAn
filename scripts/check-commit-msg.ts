// Valida Conventional Commits em PT-BR (hook commit-msg e título de PR no CI).
// Uso: node scripts/check-commit-msg.ts <arquivo-da-mensagem>
//      node scripts/check-commit-msg.ts --text "<título>"
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const TIPOS = ['feat', 'fix', 'docs', 'test', 'refactor', 'chore', 'ci', 'build', 'perf'];
const CABECALHO = new RegExp(`^(${TIPOS.join('|')})(\\([a-z0-9-]+\\))?!?: .{1,72}$`);
const ISENTOS = /^(Merge |Revert "|fixup! |squash! |amend! )/;

export function validarMensagem(mensagem: string): string | null {
  const cabecalho = mensagem.split('\n').find((l) => l.trim() && !l.startsWith('#')) ?? '';
  if (ISENTOS.test(cabecalho) || CABECALHO.test(cabecalho)) return null;
  return (
    `Mensagem fora do padrão Conventional Commits: "${cabecalho}"\n` +
    `Formato: <tipo>(<escopo>): <resumo até 72 caracteres>\n` +
    `Tipos: ${TIPOS.join(', ')} — ex.: feat(server): adiciona rota de avaliação`
  );
}

function main(): void {
  const [arg, valor] = process.argv.slice(2);
  const mensagem = arg === '--text' ? (valor ?? '') : readFileSync(arg ?? '', 'utf8');
  const erro = validarMensagem(mensagem);
  if (erro) {
    console.error(`::error::${erro}`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();

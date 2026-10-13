// Smoke test do adaptador de produção contra o JEV real.
// CONSOME CRÉDITOS TypeSafe (gate G10): 3 chamadas. Nunca roda no CI.
// Uso: node --env-file=.env apps/server/scripts/jev-smoke.ts
import { avaliarPrompt } from '../src/aplicacao/avaliar-prompt.ts';
import { criarAvaliadorJev } from '../src/infra/jev/avaliador-jev.ts';

const EXEMPLOS: [string, string][] = [
  ['🔴', 'arruma o bug do login por favor'],
  ['🟡', 'No arquivo auth.ts, corrija a validação de email do login'],
  [
    '🟢',
    'Em apps/server/src/auth.ts, na função validateEmail, rejeite emails sem domínio. Esperado: "a@" retorna 400 e o teste auth.test.ts passa.',
  ],
];

const avaliador = criarAvaliadorJev({
  apiKey: process.env.TYPESAFE_API_KEY,
  modelo: process.env.JEV_MODEL || undefined,
  timeoutMs: Number(process.env.JEV_TIMEOUT_MS) || undefined,
});

let divergencias = 0;
for (const [esperado, prompt] of EXEMPLOS) {
  const r = await avaliarPrompt(prompt, { avaliador, projetoAtivo: true });
  if (r.tipo !== 'avaliado') throw new Error(`resultado inesperado: ${r.tipo}`);
  const { status, notaTotal, notas, jev } = r.avaliacao;
  const faixa =
    { BARRADO: '🔴', APROVADO_COM_RESSALVA: '🟡', APROVADO: '🟢' }[status as string] ?? '⚪';
  if (faixa !== esperado) divergencias++;
  console.log(
    `${esperado} esperado → ${faixa} ${status} ${notaTotal?.toFixed(1) ?? '-'}% | ` +
      (jev?.ok
        ? `${jev.latenciaMs}ms ${jev.modelo} notas ${JSON.stringify(notas)}`
        : `falha: ${jev?.ok === false ? jev.falha : '-'}`),
  );
}
process.exit(divergencias ? 1 : 0);

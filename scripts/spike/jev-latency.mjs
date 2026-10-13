// SPIKE — Fase 2. Mede latência do JEV e testa a rubrica (rascunho H2) com os 3 exemplos-alvo.
// CONSOME CRÉDITOS TypeSafe (gate G10): 3 chamadas por execução.
// Uso: node --env-file=.env scripts/spike/jev-latency.mjs [pt|en]
// Nunca imprime a chave.
const KEY = process.env.TYPESAFE_API_KEY;
if (!KEY) {
  console.error('TYPESAFE_API_KEY ausente no ambiente (.env).');
  process.exit(1);
}
const MODEL = process.env.JEV_MODEL || 'jev-latest';
const IDIOMA = process.argv[2] ?? 'pt';

const RUBRICA = {
  pt: {
    clareza: ['Quão claro e inequívoco é o pedido feito neste prompt para um assistente de programação?',
      ['Incompreensível ou sem pedido identificável', 'Pedido vago; várias interpretações plausíveis', 'Pedido identificável, mas com ambiguidades relevantes', 'Pedido claro, com pequenas ambiguidades', 'Pedido claro, específico e sem ambiguidade']],
    onde_mexer: ['O prompt indica onde a mudança deve ser feita (arquivos, módulos, telas, funções, componentes)?',
      ['Nenhuma indicação de local', 'Local apenas implícito ou genérico', 'Área geral indicada (ex.: backend, tela de login)', 'Componente ou módulo identificado', 'Local preciso (arquivo, função, rota ou componente nomeado)']],
    o_que_fazer: ['O prompt descreve a ação concreta a ser executada?',
      ['Nenhuma ação descrita', 'Ação genérica ("melhora isso", "arruma")', 'Ação identificável, sem detalhes', 'Ação descrita com alguns detalhes ou restrições', 'Ação detalhada, com passos ou restrições claras']],
    resultado: ['O prompt define o resultado esperado ou um critério para saber que a tarefa está pronta?',
      ['Nenhum resultado esperado', 'Resultado apenas implícito', 'Resultado mencionado de forma vaga', 'Resultado descrito de forma verificável em parte', 'Resultado claro e verificável (comportamento, saída, teste, critério de aceite)']],
  },
  en: {
    clareza: ['How clear and unambiguous is the request this prompt makes to a coding assistant?',
      ['Incomprehensible or no identifiable request', 'Vague request; several plausible interpretations', 'Identifiable request with relevant ambiguities', 'Clear request with minor ambiguities', 'Clear, specific and unambiguous request']],
    onde_mexer: ['Does the prompt say where the change must be made (files, modules, screens, functions, components)?',
      ['No location given', 'Location only implicit or generic', 'General area given (e.g. backend, login screen)', 'Component or module identified', 'Precise location (named file, function, route or component)']],
    o_que_fazer: ['Does the prompt describe the concrete action to perform?',
      ['No action described', 'Generic action ("improve this", "fix it")', 'Identifiable action without details', 'Action described with some details or constraints', 'Detailed action with clear steps or constraints']],
    resultado: ['Does the prompt define the expected result or a criterion to know the task is done?',
      ['No expected result', 'Result only implicit', 'Result mentioned vaguely', 'Result partly verifiable', 'Clear, verifiable result (behavior, output, test, acceptance criterion)']],
  },
};

const EXEMPLOS = [
  ['🔴 esperado', 'arruma o bug do login por favor'],
  ['🟡 esperado', 'No arquivo auth.ts, corrija a validação de email do login'],
  ['🟢 esperado', 'Em apps/server/src/auth.ts, na função validateEmail, rejeite emails sem domínio. Esperado: "a@" retorna 400 e o teste auth.test.ts passa.'],
];

const questions = Object.fromEntries(
  Object.entries(RUBRICA[IDIOMA]).map(([id, [instructions, criteria]]) => [id, { type: 'score', instructions, criteria }]),
);

for (const [alvo, state] of EXEMPLOS) {
  const t0 = performance.now();
  let r;
  try {
    r = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST',
      headers: { authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ state, model: MODEL, questions }),
      signal: AbortSignal.timeout(30000),
    });
  } catch (e) {
    console.log(`${alvo} | falha de rede: ${e.name}`);
    continue;
  }
  const ms = Math.round(performance.now() - t0);
  if (!r.ok) {
    console.log(`${alvo} | HTTP ${r.status} em ${ms}ms | ${(await r.text()).slice(0, 200)}`);
    continue;
  }
  const d = await r.json();
  const notas = Object.fromEntries(Object.entries(d.answers).map(([k, a]) => [k, +(a.score / 4).toFixed(2)]));
  const conf = Object.fromEntries(Object.entries(d.answers).map(([k, a]) => [k, +a.confidence.toFixed(2)]));
  const total = Math.round((Object.values(notas).reduce((a, b) => a + b, 0) / 4) * 100);
  const faixa = total < 50 ? '🔴' : total < 75 ? '🟡' : '🟢';
  console.log(`${alvo} → ${faixa} ${total}% | ${ms}ms | modelo ${d.model} | notas ${JSON.stringify(notas)} | confidence ${JSON.stringify(conf)} | usage ${JSON.stringify(d.usage)}`);
}

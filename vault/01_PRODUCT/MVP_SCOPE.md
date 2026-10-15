# Escopo do MVP

## Dentro do MVP
1. **Interceptação** de prompts do **Claude Code** via plugin (hook `UserPromptSubmit`) — antes de a LLM receber.
2. **Ativação por projeto**: `/guardian-active` e `/guardian-inactive`.
3. **Bloqueios locais**: segredo detectado (R16), menos de 5 palavras (R2).
4. **Avaliação JEV** em 4 critérios, nota composta e faixas (R3).
5. **Retenção de 60s** para prompts barrados, com **override** pela UI (R5, R6).
6. **Fail-open**: JEV indisponível (R7) ou servidor offline (R17).
7. **UI local**: abas por projeto, coluna "Todos" × "Liberados", marcadores, 4 barras horizontais por prompt, modal de override, aviso de JEV indisponível.
8. **Playground**: avalia sem enviar à LLM.
9. **Persistência SQLite** de prompts (mascarados), avaliações e decisões.
10. Chave do JEV apenas em `.env`; `.env.example` versionado.

## Fora do MVP
Ver [[POST_MVP_BACKLOG]]: Codex, sugestão/reescrita de prompt, guardrails amplos, Docker, auto-start do servidor, IA local, autenticação, retenção/expurgo de histórico, métricas de custo.

## Definition of MVP Done
O MVP está pronto quando **todos** forem verdadeiros:
- [x] Prompt enviado pelo Claude Code em projeto ativo é interceptado **antes** da LLM — ✅ testes de pipeline/servidor/hook, e2e no Claude Code real, homologação, avaliado e barrado/liberado conforme R2, R3, R16.
- [x] Projeto inativo não é avaliado; comandos `/guardian-*` nunca são barrados. — ✅ executados pelo hook (D42; o CLI rotula como "blocked by hook", mas o comando é aplicado e nada vai à LLM)
- [x] UI em `127.0.0.1:7070` mostra abas, as duas colunas em tempo real, marcadores coloridos e barras por critério. — ✅ Fase 7, screenshots claro/escuro/mobile, homologação
- [x] Override funciona ponta a ponta dentro de 60s; após 60s o prompt é descartado. — ✅ testes de retenção (incl. I12), homologação passos 3–6b
- [x] Prompt com segredo é barrado, salvo mascarado e não chega ao JEV nem à LLM. — ✅ testes de banco/logs/SSE/hook, homologação passo 9
- [x] JEV indisponível → prompt liberado com marcador ⚪ e aviso na UI; servidor offline → prompt liberado com aviso no terminal. — ✅ homologação passos 10–11
- [x] Playground avalia sem enviar nada a nenhuma LLM. — ✅ testes + homologação passo 12
- [x] Chave só no `.env`; `.env.example` versionado. — ✅ `.gitignore`, pre-commit e CI barram `.env`
- [x] Testes essenciais (regras, faixas, segredos, fluxo do hook) passam no CI. — ✅ 191 testes no GitHub Actions
- [x] README com instalação local em poucos comandos. — ✅ README da v1.0.0
- [x] Roteiro [[HOMOLOGATION_SCRIPT]] executado e aprovado pelo engenheiro. — ✅ [[HOMOLOGATION_RESULT]] (2026-10-15)
- [x] Documentação mínima (este vault) atualizada. — ✅

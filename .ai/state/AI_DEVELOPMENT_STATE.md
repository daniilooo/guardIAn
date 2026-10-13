# Estado do desenvolvimento com IA

> Arquivo operacional para troca de sessão/LLM. O estado do **produto** está em `vault/00_HOME/PROJECT_STATUS.md`.

| Campo | Valor |
|---|---|
| Fase atual | **FASE 6 — Plugin Claude Code** (não iniciada) |
| Etapa atual | Fase 5 concluída; PR para develop |
| Branch atual | `feature/5-servidor-persistencia` |
| Última entrega | Fase 5 — servidor e persistência |
| Última decisão | D51–D58 |
| Tarefas em andamento | nenhuma |
| Bloqueios | nenhum |
| Próxima ação | PR da Fase 5 → `v0.5.0` → Fase 6 (plugin) / Fase 7 (UI) |
| Testes atuais | 138 testes verdes (`pnpm test`) |
| Release atual | `v0.4.0` |
| Remoto | `origin = git@github.com:daniilooo/guardIAn.git` — `main` e `develop` publicados |

## HANDOFF

- **Data/ferramenta:** 2026-10-13 — Claude Code (Opus)
- **Contexto:** Fase 5 — servidor e persistência.
- **Estado:** `apps/server` completo para o MVP: `config.ts`, `main.ts` (composição; `pnpm start`), `infra/db` (schema, conexão com migrations, repositórios), `aplicacao/servico.ts` (casos de uso), `aplicacao/retencao.ts` (60s + I12), `aplicacao/eventos.ts` (SSE), `http/app.ts` (rotas + Host/Origin). 138 testes; ponta a ponta com curl OK.
- **Alterações:** `apps/server/**`, `packages/shared` (BLOQUEADO, `message`/`can_override`/`jev_failure`, `allow.message`), docs (DATA_MODEL e API_CONTRACTS congelados, decisões D51–D58, segurança, runbook, CHANGELOG 0.5.0).
- **Decisões:** D51–D58.
- **Pendências:** push/PR (G8), merge e `v0.5.0` (humano).
- **Próximo passo:** Fase 6 — `plugins/claude-code`: `.claude-plugin/plugin.json`, `hooks/hooks.json` (timeout 75), `hook.mjs` sem dependências (POST `/api/hook/prompt`; `hold` → long-poll com prazo interno de 68s, I11; `allow.message` → `systemMessage`; offline → `systemMessage` de R17), `commands/guardian-active.md` e `guardian-inactive.md` (só descrição/autocomplete), `marketplace.json` na raiz. Referência: `scripts/spike/plugin/hook.mjs`.
- **Arquivos relevantes:** `vault/03_ARCHITECTURE/API_CONTRACTS.md`, `vault/15_KNOWLEDGE/CLAUDE_CODE_HOOKS.md`, `packages/shared/src/constantes.ts`.

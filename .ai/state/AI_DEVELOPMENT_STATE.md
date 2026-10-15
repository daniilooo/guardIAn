# Estado do desenvolvimento com IA

> Arquivo operacional para troca de sessão/LLM. O estado do **produto** está em `vault/00_HOME/PROJECT_STATUS.md`.

| Campo | Valor |
|---|---|
| Fase atual | **FASE 8 — QA e Homologação** (não iniciada) |
| Etapa atual | Fases 6 e 7 concluídas; branches empilhadas aguardando push/PR |
| Branch atual | `feature/7-ui` (sobre `feature/6-plugin-claude-code`) |
| Última entrega | Fases 6 (plugin) e 7 (UI) |
| Última decisão | D59–D67 |
| Tarefas em andamento | nenhuma |
| Bloqueios | nenhum |
| Próxima ação | PR Fase 6 → develop; PR Fase 7 → develop (após o 6); releases; Fase 8 |
| Testes atuais | 179 testes verdes (`pnpm test`) |
| Release atual | `v0.5.0` |
| Remoto | `origin = git@github.com:daniilooo/guardIAn.git` — `main` e `develop` publicados |

## HANDOFF

- **Data/ferramenta:** 2026-10-13 — Claude Code (Opus)
- **Contexto:** Fases 6 (plugin) e 7 (UI), em branches empilhadas para evitar conflito nos documentos do roadmap.
- **Estado:** `feature/6-plugin-claude-code` (plugin `guardian`: `hook.mjs`, comandos, marketplace; testes em `tests/`; validado no Claude Code real) e `feature/7-ui` sobre ela (`apps/web` React/Vite/Tailwind; servidor serve `apps/web/dist`; screenshots claro/escuro/mobile conferidos). 179 testes.
- **Alterações:** `plugins/claude-code/**`, `.claude-plugin/marketplace.json`, `tests/`, `apps/web/**`, `apps/server/src/http/estaticos.ts`, scripts `start`/`dev`/`dev:web`, docs (D59–D67, S15/RK12, CHANGELOG 0.6.0/0.7.0).
- **Decisões:** D59–D67.
- **Pendências:** push e PRs (G8): Fase 6 → develop; Fase 7 → develop depois do merge da 6. Releases `v0.6.0`/`v0.7.0` (humano). Decisão aberta: desligar "branch atualizada" no ruleset da main.
- **Próximo passo:** Fase 8 — QA paralelo (regras, API, hook, UI, segurança), security-review, execução do `HOMOLOGATION_SCRIPT.md` pelo engenheiro com JEV real, calibração fina da rubrica.
- **Arquivos relevantes:** `vault/08_TESTING/HOMOLOGATION_SCRIPT.md`, `vault/11_ROADMAP/DEVELOPMENT_PLAN.md#fase-8`, `plugins/claude-code/README.md`.

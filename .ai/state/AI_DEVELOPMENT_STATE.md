# Estado do desenvolvimento com IA

> Arquivo operacional para troca de sessão/LLM. O estado do **produto** está em `vault/00_HOME/PROJECT_STATUS.md`.

| Campo | Valor |
|---|---|
| Fase atual | **FASE 3 — Fundação técnica** (em andamento) |
| Etapa atual | Tooling verde localmente; PR para develop |
| Branch atual | `feature/3-fundacao-tecnica` |
| Última entrega | Fase 2 — Spike do portão (PR #3) |
| Última decisão | D45–D47 |
| Tarefas em andamento | nenhuma |
| Bloqueios | nenhum |
| Próxima ação | CI verde no PR da Fase 3 → merge (humano) → `v0.3.0` → Fase 4 |
| Testes atuais | 46 testes verdes (`pnpm test`) |
| Release atual | `v0.2.0` |
| Remoto | `origin = git@github.com:daniilooo/guardIAn.git` — `main` e `develop` publicados |

## HANDOFF

- **Data/ferramenta:** 2026-10-13 — Claude Code (Opus)
- **Contexto:** Fase 3 — fundação técnica do monorepo.
- **Estado:** pnpm 12 workspaces, TS 6.0, ESLint 10 (flat), Prettier, Vitest 5, lefthook 2. `packages/shared` com constantes de negócio, domínio, contratos HTTP e padrões de segredo. Scripts `check-secrets.ts` e `check-commit-msg.ts` (Node puro) usados pelo lefthook e pelo CI. 46 testes verdes. Hooks comprovadamente bloqueiam mensagem inválida e segredo.
- **Alterações:** raiz (`package.json`, `pnpm-workspace.yaml`, `tsconfig*.json`, `eslint.config.js`, `.prettier*`, `vitest.config.ts`, `lefthook.yml`), `packages/shared/*`, `scripts/check-*.ts`, CI, docs.
- **Decisões:** D45 (TS 6.0, TD2), D46 (scripts TS via Node puro), D47 (fonte única hook/CI).
- **Pendências:** CI verde no PR; merge e release `v0.3.0` (humano).
- **Próximo passo:** Fase 4 — núcleo de avaliação em `apps/server/src/dominio/` (isenção/comandos nas duas formas, contagem de palavras, mascaramento de segredos, nota composta e faixas) + porta `Avaliador` com `AvaliadorJev` (HTTP direto ou SDK) e `AvaliadorFake`.
- **Arquivos relevantes:** `packages/shared/src/*`, `vault/11_ROADMAP/DEVELOPMENT_PLAN.md#fase-4`, `vault/02_BUSINESS/JEV_RUBRIC.md`, `scripts/spike/jev-latency.mjs` (referência de chamada HTTP).

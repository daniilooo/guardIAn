# Estado do desenvolvimento com IA

> Arquivo operacional para troca de sessão/LLM. O estado do **produto** está em `vault/00_HOME/PROJECT_STATUS.md`.

| Campo | Valor |
|---|---|
| Fase atual | **FASE 4 — Núcleo de avaliação** (em andamento) |
| Etapa atual | Núcleo pronto; smoke com JEV real aguardando G10 |
| Branch atual | `feature/4-nucleo-avaliacao` (local) |
| Última entrega | Fase 3 — `v0.3.0` |
| Última decisão | D48–D50 |
| Tarefas em andamento | nenhuma |
| Bloqueios | nenhum |
| Próxima ação | Smoke do JEV (G10) → push/PR (G8) → `v0.4.0` → Fase 5 |
| Testes atuais | 115 testes verdes (`pnpm test`) |
| Release atual | `v0.3.0` |
| Remoto | `origin = git@github.com:daniilooo/guardIAn.git` — `main` e `develop` publicados |

## HANDOFF

- **Data/ferramenta:** 2026-10-13 — Claude Code (Opus)
- **Contexto:** Fase 4 — núcleo de avaliação.
- **Estado:** `apps/server` criado (sem Fastify ainda). Domínio puro: `dominio/comandos.ts` (2 formas + desconhecido), `palavras.ts`, `segredos.ts` (mascaramento com sobreposição), `nota.ts` (normalização, composta, faixa). Aplicação: porta `Avaliador` e `avaliarPrompt` (ordem I4) + `permiteOverride`. Infra: `AvaliadorJev` (HTTP direto, D48), `AvaliadorFake`, `rubrica.ts`. 115 testes; mutações de limite e ordem são detectadas.
- **Alterações:** `apps/server/**`, docs (plano, decisões D48–D50, integrações, módulos, rubrica, agente backend).
- **Decisões:** D48 (HTTP direto), D49 (comando desconhecido não avaliado), D50 (faixa sem arredondamento).
- **Pendências:** `node --env-file=.env apps/server/scripts/jev-smoke.ts` (G10, 3 chamadas); push/PR (G8).
- **Próximo passo:** Fase 5 — Fastify em 127.0.0.1, config.ts, SQLite + Drizzle, rotas de API_CONTRACTS, retenção 60s com long-poll e I12 (close da conexão), SSE, health.
- **Arquivos relevantes:** `apps/server/src/aplicacao/avaliar-prompt.ts`, `vault/03_ARCHITECTURE/API_CONTRACTS.md`, `vault/03_ARCHITECTURE/DATA_MODEL.md`, `vault/11_ROADMAP/DEVELOPMENT_PLAN.md#fase-5`.

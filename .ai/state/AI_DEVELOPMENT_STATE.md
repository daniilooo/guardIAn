# Estado do desenvolvimento com IA

> Arquivo operacional para troca de sessão/LLM. O estado do **produto** está em `vault/00_HOME/PROJECT_STATUS.md`.

| Campo | Valor |
|---|---|
| Fase atual | **FASE 3 — Fundação técnica** (não iniciada) |
| Etapa atual | Fase 2 concluída; PR #3 aguardando merge |
| Branch atual | `feature/2-spike-portao` (PR aberto para develop) |
| Última entrega | Fase 2 — Spike do portão (PR #3) |
| Última decisão | D44 — queda da conexão do hook encerra a retenção (I12) |
| Tarefas em andamento | nenhuma |
| Bloqueios | nenhum |
| Próxima ação | Após merge: PR develop→main + tag v0.2.0 (humano); iniciar Fase 3 em `feature/3-fundacao-tecnica` |
| Testes atuais | não há código |
| Release atual | nenhuma tag ainda (proposta: `v0.2.0`) |
| Remoto | `origin = git@github.com:daniilooo/guardIAn.git` — `main` e `develop` publicados |

## HANDOFF

- **Data/ferramenta:** 2026-10-12 — Claude Code (Opus)
- **Contexto:** Fase 2 (Spike do portão) concluída. Hook `UserPromptSubmit` validado em modo `-p` (T1–T7) e interativo (espera de 60s, Esc, comando com namespace). JEV medido.
- **Estado:** branch `feature/2-spike-portao`, PR #3 para `develop` aberto; nenhum código de produto ainda.
- **Alterações:** `scripts/spike/*` (descartável), knowledge (hooks, JEV), ADR-0005, invariantes I11/I12, R14, máquina de estados, modelo de dados, testes, roadmap, riscos, CHANGELOG.
- **Decisões:** D42 (comandos no hook), D43 (I11), D44 (I12). H2 validada; H7 (rubrica PT-BR) aberta.
- **Pendências:** merge do PR #3 e release `v0.2.0` (humano).
- **Próximo passo:** Fase 3 — `pnpm-workspace.yaml`, `package.json` raiz (`packageManager: pnpm@12.11.2`, `engines.node >=22`), tsconfig base, ESLint, Prettier, Vitest, `packages/shared` (status, motivos, constantes 5/50/75/60, contratos), lefthook, check-secrets reaproveitando os padrões de `scripts/ci/check-secrets.sh`. O job `qualidade` do CI ativa sozinho quando o `package.json` existir.
- **Arquivos relevantes:** `vault/11_ROADMAP/DEVELOPMENT_PLAN.md#fase-3`, `.ai/hooks/README.md`, `vault/06_INFRASTRUCTURE/CI_CD.md`, `vault/15_KNOWLEDGE/CLAUDE_CODE_HOOKS.md`.

# Estado do desenvolvimento com IA

> Arquivo operacional para troca de sessão/LLM. O estado do **produto** está em `vault/00_HOME/PROJECT_STATUS.md`.

| Campo | Valor |
|---|---|
| Fase atual | **FASE 2 — Spike do portão** (não iniciada) |
| Etapa atual | Aguardando decisão humana para iniciar |
| Branch atual | `develop` |
| Última entrega | Bootstrap AI-Native (Fase 1) |
| Última decisão | S1: segredo salvo **mascarado** no SQLite |
| Tarefas em andamento | nenhuma |
| Bloqueios | nenhum |
| Próxima ação | Criar `feature/2-spike-portao` e executar o spike (ver `DEVELOPMENT_PLAN.md#fase-2`) |
| Testes atuais | não há código |
| Release atual | nenhuma (próxima: `v0.2.0` ao fim da Fase 2, sugerido) |
| Remoto | `origin = git@github.com:daniilooo/guardIAn.git` — `main` e `develop` publicados |

## HANDOFF

- **Data/ferramenta:** 2026-10-12 — Claude Code (Opus)
- **Contexto:** Intake completo (6 blocos) e bootstrap da infraestrutura AI-Native. Nenhum código de produto escrito, por decisão explícita.
- **Estado:** Fase 1 concluída. `main` e `develop` publicados no GitHub com o commit de bootstrap. pnpm habilitado via corepack.
- **Alterações:** criados `vault/` (Obsidian), `.ai/` (workflow, agentes, contratos, skills, adapters), `.claude/` (wrappers), `CLAUDE.md`, `AGENTS.md`, `README.md`, `.env.example`, `.gitignore`, `docs/*.html`, esqueleto `apps/ packages/ plugins/ infra/ scripts/`.
- **Decisões:** ver `vault/10_DECISIONS/DECISION_LOG.md` (D01–D38) e ADRs 0001–0007.
- **Pendências:** classificar modelos Codex por tier.
- **Próximo passo:** iniciar a Fase 2 — spike que comprova no Claude Code real: bloqueio via `UserPromptSubmit`, espera de 60s com liberação por sinal externo, comportamento com slash commands, timeout do hook configurado em 75s.
- **Arquivos relevantes:** `vault/11_ROADMAP/DEVELOPMENT_PLAN.md`, `vault/15_KNOWLEDGE/CLAUDE_CODE_HOOKS.md`, `vault/02_BUSINESS/BUSINESS_RULES.md`.

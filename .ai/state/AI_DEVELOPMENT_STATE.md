# Estado do desenvolvimento com IA

> Arquivo operacional para troca de sessão/LLM. O estado do **produto** está em `vault/00_HOME/PROJECT_STATUS.md`.

| Campo | Valor |
|---|---|
| Fase atual | **FASE 2 — Spike do portão** (em andamento) |
| Etapa atual | Testes automatizados do hook concluídos (T1–T7) |
| Branch atual | `feature/2-spike-portao` (commit local, sem push) |
| Última entrega | Esteira de CI + rulesets (PRs #1 e #2) |
| Última decisão | S1: segredo salvo **mascarado** no SQLite |
| Tarefas em andamento | nenhuma |
| Bloqueios | nenhum |
| Próxima ação | Aguardar `.env` + G10 para `jev-latency.mjs`; teste interativo; decisão sobre comandos no hook |
| Testes atuais | não há código |
| Release atual | nenhuma (próxima: `v0.2.0` ao fim da Fase 2, sugerido) |
| Remoto | `origin = git@github.com:daniilooo/guardIAn.git` — `main` e `develop` publicados |

## HANDOFF

- **Data/ferramenta:** 2026-10-12 — Claude Code (Opus)
- **Contexto:** Fase 2 (Spike do portão). Validar empiricamente o hook `UserPromptSubmit` antes do código definitivo.
- **Estado:** spike em `scripts/spike/` (servidor + plugin descartáveis, sem dependências). Testes T1–T7 executados com `claude -p --plugin-dir`, todos conforme esperado. Achado crítico: o hook que estoura o timeout do CLI deixa o prompt passar (nova invariante I11).
- **Alterações:** `scripts/spike/*`, `vault/15_KNOWLEDGE/CLAUDE_CODE_HOOKS.md`, ADR-0005, `BUSINESS_INVARIANTS.md` (I11), `RISKS.md` (RK1 mitigado, RK10), roadmap (md + html), status.
- **Decisões:** nenhuma nova regra de negócio aplicada; proposta de tratar `/guardian-*` no hook aguarda G2/G5.
- **Pendências:** (1) `.env` com `TYPESAFE_API_KEY` + autorização G10 → `node --env-file=.env scripts/spike/jev-latency.mjs pt` (e `en`), registrar em `TYPESAFE_JEV.md`; (2) teste interativo: aparência da espera e Esc/Ctrl+C durante retenção; (3) decisão sobre comandos no hook.
- **Próximo passo:** executar as pendências e fechar a Fase 2 (skill `release`, sugerido `v0.2.0`).
- **Arquivos relevantes:** `scripts/spike/README.md`, `vault/15_KNOWLEDGE/CLAUDE_CODE_HOOKS.md`, `vault/03_ARCHITECTURE/ADR/ADR-0005-interceptacao-via-plugin-hook.md`.

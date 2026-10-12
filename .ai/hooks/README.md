# Hooks

Existem **dois tipos** — não confundir:

| Tipo | O quê | Onde |
|---|---|---|
| **Hooks de desenvolvimento** | Protegem o código do guardIAn (git) | `lefthook.yml` (criado na Fase 3) |
| **Hook do produto** | É o próprio guardIAn interceptando prompts (`UserPromptSubmit` do Claude Code) | `plugins/claude-code/` (Fase 6) |

Hooks executam apenas tarefas **determinísticas**. Nada de decisão arquitetural em hook.

## Hooks de desenvolvimento (lefthook)

| Nome | Momento | Comando | Objetivo | Tempo esperado | Bloqueante |
|---|---|---|---|---|---|
| format | pre-commit | `prettier --check {staged_files}` | Formatação | ~2s | ✅ |
| lint | pre-commit | `eslint {staged_files}` | Lint rápido | ~3s | ✅ |
| secrets | pre-commit | `node scripts/check-secrets.mjs {staged_files}` + bloqueio de `.env` | Impedir segredos no git | ~1s | ✅ |
| commit-msg | commit-msg | validação Conventional Commits | Padrão de mensagem | <1s | ✅ |
| typecheck | pre-push | `pnpm typecheck` | Tipos | ~10s | ✅ |
| test | pre-push | `pnpm test` | Testes (sem JEV real) | ~10–30s | ✅ |
| build | pre-push | `pnpm build` | Build | ~15s | ✅ |

> O detector do pre-commit pode reaproveitar os padrões do módulo de segredos do produto (`packages/shared`) — uma única fonte de padrões.

## CI (GitHub Actions)
Em PR para `develop` e `main`: install → lint → typecheck → test → build. Sem segredos, sem JEV real.

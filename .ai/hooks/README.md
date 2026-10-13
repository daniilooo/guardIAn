# Hooks

Existem **dois tipos** — não confundir:

| Tipo | O quê | Onde |
|---|---|---|
| **Hooks de desenvolvimento** | Protegem o código do guardIAn (git) | `lefthook.yml` (instalado pelo `pnpm install` via `prepare`) |
| **Hook do produto** | É o próprio guardIAn interceptando prompts (`UserPromptSubmit` do Claude Code) | `plugins/claude-code/` (Fase 6) |

Hooks executam apenas tarefas **determinísticas**. Nada de decisão arquitetural em hook.

## Hooks de desenvolvimento (lefthook)

| Nome | Momento | Comando | Objetivo | Tempo esperado | Bloqueante |
|---|---|---|---|---|---|
| format | pre-commit | `prettier --check --ignore-unknown {staged_files}` | Formatação | ~1s | ✅ |
| lint | pre-commit | `eslint --no-warn-ignored {staged_files}` | Lint rápido | ~2s | ✅ |
| secrets | pre-commit | `node scripts/check-secrets.ts --staged` (bloqueia também `.env`) | Impedir segredos no git | <1s | ✅ |
| conventional-commits | commit-msg | `node scripts/check-commit-msg.ts {1}` | Padrão de mensagem | <1s | ✅ |
| typecheck-test-build | pre-push | `pnpm typecheck && pnpm test && pnpm build` | Tipos, testes (sem JEV real) e build | ~5s hoje | ✅ |

> Fonte única: `scripts/check-secrets.ts` usa os padrões de `packages/shared/src/segredos.ts` (os mesmos do produto) e `scripts/check-commit-msg.ts` é usado pelo hook **e** pelo CI. Ambos rodam em Node puro (type stripping), sem dependências.
> Emergência: `git commit --no-verify` pula os hooks, mas o CI aplica as mesmas verificações.

## CI (GitHub Actions)
Em PR para `develop` e `main`: install → format:check → lint → typecheck → test → build. Sem segredos, sem JEV real. Detalhes: `vault/06_INFRASTRUCTURE/CI_CD.md`.

# DEPLOY — homologação e release (MVP local)

O MVP roda **apenas em localhost**. Não há deploy em nuvem.

## Ambientes
| Ambiente | O quê |
|---|---|
| Desenvolvimento | `pnpm dev` na sua máquina |
| Homologação | Build de produção local (`pnpm build && pnpm start`) + plugin instalado no Claude Code a partir do repositório, usado num **projeto de teste separado** |
| Release | Tag `vX.Y.Z` em `main` |

## Homologação
1. DevOps prepara o build e confirma `.env` presente (sem exibir conteúdo).
2. Humano executa o roteiro `vault/08_TESTING/HOMOLOGATION_SCRIPT.md`.
3. Resultados registrados em `vault/12_RELEASES/`.

## Release
Skill `release`. Merge em `main` e tag são **gate humano**.

## Rollback
Reinstalar a tag anterior do plugin/servidor (`git checkout vX.Y.Z && pnpm install && pnpm build`). O SQLite deve ter backup antes de migrations (skill `database-migration`).

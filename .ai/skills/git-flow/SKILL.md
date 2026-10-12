---
name: git-flow
description: Branches, PRs e versionamento do guardIAn (main/develop/feature/fix/hotfix, SemVer).
---
# Skill: git-flow

## Branches
| Branch | Origem | Destino | Quem faz merge |
|---|---|---|---|
| `main` | — | — | humano (merge commit) |
| `develop` | `main` | — | humano |
| `feature/<fase>-<slug>` | `develop` | `develop` (squash) | humano |
| `fix/<slug>` | `develop` | `develop` (squash) | humano |
| `hotfix/<slug>` | `main` | `main` + `develop` | humano |
| `release/x.y.z` | `develop` | `main` | humano (opcional no MVP) |

Ex.: `feature/2-spike-portao`, `fix/hook-timeout`.

## Criar branch (LLM pode)
```bash
git switch develop && git pull --ff-only   # pull só se houver remoto configurado e autorizado
git switch -c feature/<fase>-<slug>
```

## Push e PR (somente com autorização explícita do humano)
```bash
git push -u origin feature/<fase>-<slug>
gh pr create --base develop --title "<conventional title>" --body-file <relatorio.md>
```
Corpo do PR = relatório do Reporter (resumo, mudanças, testes, riscos) + checklist de gates.

## Proibido para LLM
Merge, tag, push em `main`/`develop`, `--force`, apagar branch remota.

## Versionamento (SemVer)
- Cada fase concluída do roadmap → `v0.<fase>.0` (sugestão, decidida na skill `release`).
- MVP homologado → `v1.0.0`.

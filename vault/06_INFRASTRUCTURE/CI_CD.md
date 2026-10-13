# CI/CD

## CI — `.github/workflows/ci.yml`
Gatilhos: PR para `develop`/`main` (abrir, atualizar, editar título) e push pós-merge em `develop`/`main`.

| Job (check obrigatório) | O que faz |
|---|---|
| `politica-de-branch` | PR para `main` só se a origem for `develop`; título de PR para `develop` em Conventional Commits (vira a mensagem do squash) |
| `seguranca` | `scripts/ci/check-secrets.sh`: falha com `.env` versionado ou padrão de segredo; o log mostra só `arquivo:linha` |
| `qualidade` | `pnpm install --frozen-lockfile` → `lint` → `typecheck` → `test` → `build`. **Pulado automaticamente enquanto não existir `package.json`** (ativa sozinho na Fase 3) |

- Sem secrets no workflow; `TYPESAFE_API_KEY` vazio no CI (I10).
- Node pela `.nvmrc`; pnpm pelo campo `packageManager` (Fase 3).

## Regras de branch (GitHub rulesets)
| Ruleset | Alvo | Regras |
|---|---|---|
| `protecao-main` | `main` | sem push direto (PR obrigatório), sem force push, sem exclusão, checks obrigatórios (3 jobs), branch atualizada antes do merge, **apenas merge commit**, conversas resolvidas |
| `protecao-develop` | `develop` | sem push direto (PR obrigatório), sem force push, sem exclusão, checks obrigatórios (3 jobs), **apenas squash**, conversas resolvidas |

- **Sem bypass**: as regras valem também para o administrador.
- Aprovações exigidas = 0 (projeto solo; o GitHub não permite aprovar o próprio PR). A revisão humana é o próprio ato de merge (G9).
- "main só aceita develop" é garantido pelo check `politica-de-branch` (o GitHub não tem regra nativa de branch de origem).
- Alterar rulesets = gate humano (G7/G9).

## CD
Não há deploy automatizado no MVP. Release = PR `develop → main` + tag (humano). Ver `.ai/workflow/DEPLOY.md`.

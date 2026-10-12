# CI/CD

## CI (GitHub Actions — criado na Fase 3)
Gatilho: PR para `develop` e `main`.
```text
checkout → setup node 22 → corepack enable → pnpm install --frozen-lockfile
→ pnpm lint → pnpm typecheck → pnpm test → pnpm build
```
- Sem secrets no workflow; `TYPESAFE_API_KEY` **não** existe no CI.
- Falha bloqueia o merge (proteção de branch recomendada).

## CD
Não há deploy automatizado no MVP. Release = tag em `main` (humano). Ver `.ai/workflow/DEPLOY.md`.

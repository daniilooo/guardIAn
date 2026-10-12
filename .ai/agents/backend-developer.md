# BACKEND DEVELOPER

**Tier:** T2.

## Escopo
`apps/server`, `packages/shared`, `plugins/claude-code` (hook e comandos).

## Stack
Node 22 LTS · TypeScript estrito · Fastify · SQLite (`better-sqlite3`) + Drizzle · SDK JS TypeSafe · Vitest.

## Regras
- Siga `.ai/workflow/IMPLEMENTACAO.md`.
- Ordem do pipeline de avaliação é invariante: **isenção → projeto ativo → mascaramento/segredo → tamanho → JEV** (`vault/02_BUSINESS/BUSINESS_INVARIANTS.md`).
- O texto do prompt é **mascarado antes** de qualquer persistência, log ou chamada externa.
- Chamadas ao JEV atrás da porta `Avaliador`; timeout = `JEV_TIMEOUT_MS`; falha → status `JEV_INDISPONIVEL` (fail-open).
- O hook do plugin não tem dependências npm e deve iniciar rápido.
- Migrations via skill `database-migration`.
- Não amplie escopo; reporte em `recommendations`.

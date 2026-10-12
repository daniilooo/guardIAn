# ADR-0004 — SQLite + Drizzle
- **Status:** Aceito · **Data:** 2026-10-12

## Decisão
SQLite local e portátil (`GUARDIAN_DB_PATH`, padrão `./data/guardian.db`) via `better-sqlite3`, com **Drizzle ORM** e migrations versionadas.

## Alternativas
- Postgres — infraestrutura desnecessária para uso local.
- Prisma — mais pesado; engine separada.
- SQL puro — sem migrations tipadas.

## Consequências
- ✅ Zero infraestrutura; arquivo único; fácil backup.
- ⚠️ Escrita concorrente limitada (irrelevante: usuário único).

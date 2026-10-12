---
name: database-migration
description: Alterações de schema SQLite via Drizzle com backup e gate para mudanças destrutivas.
---
# Skill: database-migration

1. Altere o schema Drizzle em `apps/server` e gere a migration (`pnpm --filter server db:generate`).
2. Revise o SQL gerado. É **destrutiva** (drop/rename de coluna/tabela, perda de dados)? → **gate humano**.
3. Antes de aplicar em banco existente: backup `cp $GUARDIAN_DB_PATH $GUARDIAN_DB_PATH.bak-<data>`.
4. Aplique e rode os testes de integração.
5. Atualize `vault/03_ARCHITECTURE/DATA_MODEL.md`.
6. Nunca persista texto de prompt sem mascaramento (invariante I3).

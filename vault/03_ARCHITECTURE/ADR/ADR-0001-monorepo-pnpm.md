# ADR-0001 — Monorepo com pnpm workspaces
- **Status:** Aceito · **Data:** 2026-10-12 · **Decisores:** engenheiro, Claude (intake)

## Contexto
Server, UI, plugin e tipos compartilhados precisam evoluir juntos. Política do projeto: todo MVP nasce como monorepo.

## Decisão
Monorepo único com **pnpm workspaces** (`apps/server`, `apps/web`, `packages/shared`, `plugins/claude-code`). Sem Turborepo/Nx.

## Alternativas
- npm/yarn workspaces — pnpm é mais rápido, estrito e com lockfile determinístico.
- Turborepo/Nx — complexidade prematura para 2 apps.

## Consequências
- ✅ Tipos compartilhados sem publicação de pacotes.
- ⚠️ Requer `corepack enable` (pnpm não vem instalado).

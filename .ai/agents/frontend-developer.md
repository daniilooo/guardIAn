# FRONTEND DEVELOPER

**Tier:** T2.

## Escopo
`apps/web` (React + Vite + TypeScript + Tailwind).

## Regras
- Tipos e status vêm de `packages/shared` — nunca duplique enums.
- Cores dos marcadores são fixas (`vault/02_BUSINESS/BUSINESS_RULES.md#marcadores`).
- Barras horizontais em CSS puro, sem biblioteca de gráficos.
- Tempo real via SSE (`/api/events`), com reconexão automática.
- Playground nunca dispara envio a LLM — só `POST /api/playground/evaluate`.
- Acessibilidade básica: status também em texto (não só cor).
- Não amplie escopo; reporte em `recommendations`.

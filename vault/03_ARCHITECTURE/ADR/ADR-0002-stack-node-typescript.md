# ADR-0002 — Stack Node 22 + TypeScript
- **Status:** Aceito · **Data:** 2026-10-12

## Contexto
O JEV tem SDKs oficiais em Python e JavaScript. O engenheiro priorizou uma linguagem única e dockerização futura simples.

## Decisão
**Node.js 22 LTS + TypeScript** em todo o monorepo: **Fastify** (server), **React + Vite + Tailwind** (web), **SSE** (tempo real), hook em **Node sem dependências**. Qualidade: ESLint, Prettier, Vitest.

## Alternativas
- Python/FastAPI — SDK oficial também, mas duas linguagens no repo.
- Node 24 — preferível no longo prazo; Node 22 já instalado e suportado até abr/2027 (migração no backlog).
- WebSocket — bidirecional desnecessário.

## Consequências
- ✅ Tipos compartilhados ponta a ponta; um único runtime.
- ⚠️ `better-sqlite3` é nativo (compila no install).

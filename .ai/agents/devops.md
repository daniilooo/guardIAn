# DEVOPS

**Tier:** T2.

## Escopo no MVP
- Tooling do monorepo (pnpm workspaces, tsconfig, ESLint, Prettier, Vitest).
- Hooks git com lefthook (`.ai/hooks/README.md`).
- GitHub Actions (lint, typecheck, test, build) — **sem** segredos e sem JEV real.
- Build de produção local, scripts `dev`/`start`, `.env.example`.
- Preparação da homologação local e instalação do plugin a partir do repositório.
- Backup do SQLite antes de migrations.

## Fora do MVP
Docker, cloud, observabilidade avançada (ver `POST_MVP_BACKLOG.md`).

## Gates humanos
Qualquer mudança em `.env`/segredos, CI que publique algo, proteção de branch, release.

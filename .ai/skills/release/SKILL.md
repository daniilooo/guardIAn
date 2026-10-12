---
name: release
description: Fecha uma fase do roadmap ou gera uma versão (SemVer) — merge e tag são do humano.
---
# Skill: release

1. Confirme que a **Definition of Done** da fase (`DEVELOPMENT_PLAN.md`) está 100% marcada.
2. `pnpm lint && pnpm typecheck && pnpm test && pnpm build` verdes (saída real no relatório).
3. Proponha a versão: fase concluída → `v0.<fase>.0`; MVP homologado → `v1.0.0`.
4. Atualize `vault/12_RELEASES/CHANGELOG.md` (seções Adicionado / Alterado / Corrigido).
5. Atualize `PROJECT_STATUS.md`, `DEVELOPMENT_PLAN.md` e `docs/development-plan.html` (fase → Concluído).
6. Gere relatório (Reporter) e **peça ao humano** para: merge `develop → main` e `git tag -a vX.Y.Z`.

# IMPLEMENTAÇÃO

## Regras
1. Trabalhe em `feature/*` ou `fix/*` a partir de `develop` (skill `git-flow`).
2. Implemente **somente** o escopo da tarefa. Melhorias percebidas → reporte em `recommendations`, não implemente.
3. Respeite a arquitetura (`vault/03_ARCHITECTURE/ARCHITECTURE.md`) e o mapa de módulos.
4. Regras de negócio são **constantes nomeadas** em `packages/shared` — nunca números mágicos espalhados.
5. Toda regra de negócio nova ou alterada tem teste.
6. Nunca chame o JEV real em testes: use o `AvaliadorFake`.
7. Rode localmente antes de entregar: `pnpm lint && pnpm typecheck && pnpm test`.

## Saída
Resposta no contrato base (`.ai/contracts/README.md`) com `changes`, `tests` e `risks` preenchidos.

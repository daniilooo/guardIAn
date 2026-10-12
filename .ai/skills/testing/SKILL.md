---
name: testing
description: Como escrever e rodar testes no guardIAn sem gastar créditos do JEV.
---
# Skill: testing

Estratégia: `vault/08_TESTING/TEST_STRATEGY.md`.

1. **Unitário (Vitest)** para todo o núcleo de regras: contagem de palavras, detecção/mascaramento de segredos, composição de score, faixas, isenções.
2. **Integração** do servidor com Fastify `inject` + SQLite em memória + `AvaliadorFake`.
3. **Hook**: testar o script com stdin simulado e servidor fake (ou `inject`).
4. **Nunca** chamar `api.typesafe.ai` em testes/CI. O `AvaliadorFake` aceita notas pré-definidas por critério e modos `erro`/`timeout`.
5. Fixtures de segredo **sintéticas** (formato válido, valor falso).
6. Casos de limite obrigatórios: 4 vs 5 palavras; 49,9% vs 50% vs 74,9% vs 75%; espera expirando em 60s; override após expiração (deve falhar); override em prompt com segredo (deve falhar).
7. Rode `pnpm test` e reporte a saída real.

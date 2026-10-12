# Estratégia de testes

| Nível | Ferramenta | Cobre | Quando |
|---|---|---|---|
| Unitário | Vitest | Domínio puro: isenção, palavras, segredos/mascaramento, nota composta, faixas | Sempre (pre-push e CI) |
| Integração | Vitest + Fastify `inject` + SQLite em memória + `AvaliadorFake` | Rotas, pipeline, retenção/override/expiração, SSE | Sempre |
| Hook | Vitest executando `hook.mjs` com stdin simulado contra servidor de teste | allow/block/hold, fail-open offline, isenção | Fase 6 em diante |
| UI | Vitest + Testing Library (componentes críticos) | Card, barras, modal de override | Fase 7 |
| Manual | [[HOMOLOGATION_SCRIPT]] | Ponta a ponta no Claude Code real | Fase 8 |
| JEV real | Script manual, poucas chamadas, com G10 | Calibração da rubrica | Fases 4 e 8 |

## Casos de limite obrigatórios
4 × 5 palavras · 49,9% × 50% · 74,9% × 75% · retenção expirando em 60s · override após expiração (409) · override em segredo (403) · JEV timeout/429/529/401 → ⚪ · segredo em prompt curto (segredo vence, I4) · `/guardian-active` com projeto já ativo.

## Regra de ouro
CI e testes automatizados **nunca** chamam a TypeSafe (I10).

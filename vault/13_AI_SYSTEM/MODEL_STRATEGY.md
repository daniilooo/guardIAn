# Estratégia de modelos (multi-LLM)

O workflow é **independente de fornecedor**: agentes declaram um **tier**, e cada adapter mapeia o tier para um modelo concreto.

| Tier | Uso | Agentes |
|---|---|---|
| **T1 — barato** | exploração, buscas, relatórios, tarefas mecânicas | Explorer, Reporter |
| **T2 — intermediário** | orquestração, implementação, testes, revisão | Orchestrator, Developers, QA, Reviewer, DevOps, Architect (padrão) |
| **T3 — avançado** | arquitetura crítica, segurança crítica, incidentes complexos, decisões difíceis | Architect (escalado), investigações difíceis |

## Mapeamento atual
| Tier | Claude Code | Codex | Local |
|---|---|---|---|
| T1 | Haiku | a definir | fora do MVP |
| T2 | Sonnet | a definir | fora do MVP |
| T3 | Opus | a definir | fora do MVP |

## Regras de escalonamento
- Comece no tier do agente. Escale para T3 **só** quando: decisão difícil de reverter, segurança/segredos, falha repetida (2×) em T2, ou pedido explícito do humano.
- Nunca use T3 por padrão para o Orquestrador.
- Pergunta factual nunca justifica T2/T3.

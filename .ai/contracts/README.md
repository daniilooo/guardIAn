# Contratos entre agentes

Objetivo: **reduzir tokens e perda de contexto**. Agentes recebem só o necessário — nunca o histórico inteiro da conversa nem o vault inteiro.

> Contexto mínimo suficiente > contexto máximo disponível.

## Pedido (Orquestrador → agente)

```yaml
task_id: GDN-<fase>-<seq>          # ex.: GDN-4-03
objective: <uma frase>
context: <3–8 linhas: por que, estado atual>
constraints: [<regras R*, ADRs, limites de escopo>]
inputs: [<arquivos/trechos relevantes, com caminho>]
expected_output: <formato esperado>
acceptance_criteria: [<verificáveis>]
allowed_tools: [<read, edit, bash:pnpm test, ...>]
forbidden_actions: [<push, chamar JEV real, editar .env, ...>]
references: [<vault/...md#seção>]
```

## Resposta (agente → Orquestrador)

```yaml
task_id:
status: concluido | parcial | bloqueado | falhou
summary: <até 5 linhas>
findings: [<fatos com arquivo:linha>]
decisions: [<decisões tomadas e por quê>]
changes: [<arquivo: o que mudou>]
risks: [<riscos introduzidos ou percebidos>]
tests: <comando executado + resultado>
artifacts: [<arquivos gerados>]
recommendations: [<fora do escopo — não implementado>]
needs_human_decision: [<pergunta objetiva + opções + recomendação>]
```

## Variações por agente

| Agente | Campos obrigatórios na resposta | Campos que pode omitir |
|---|---|---|
| Explorer | `findings` (com referência), `summary` | `changes`, `tests`, `decisions` |
| Architect | `decisions`, `risks`, `artifacts` (ADR), `needs_human_decision` | `tests` |
| Developer | `changes`, `tests`, `risks` | — |
| QA | `tests`, `findings` (falhas/edge cases) | `decisions` |
| Reviewer | `findings` priorizados (crítico/importante/sugestão) | `changes` |
| DevOps | `changes`, `risks`, `needs_human_decision` | — |
| Reporter | `summary` no formato do público pedido | demais |

Arquivos YAML de referência: `request.yaml`, `response.yaml`.

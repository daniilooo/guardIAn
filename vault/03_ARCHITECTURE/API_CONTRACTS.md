# Contratos da API (proposta — consolidada nas Fases 5/6)

Base: `http://127.0.0.1:7070`. JSON. Tipos em `packages/shared`.

## Hook (plugin → servidor)
| Método | Rota | Corpo / resposta |
|---|---|---|
| POST | `/api/hook/prompt` | `{source, session_id, cwd, prompt}` → `{action: "allow"\|"block"\|"hold", prompt_id?, status?, reason?, hold_seconds?}` |
| GET | `/api/hook/prompt/:id/wait` | long-poll até a decisão ou expiração → `{action: "allow"\|"block", reason}` |
| POST | `/api/projects/activate` | `{cwd}` → `{project}` |
| POST | `/api/projects/deactivate` | `{cwd}` → `{project}` |

## UI → servidor
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/projects` | lista de projetos (abas) |
| GET | `/api/prompts?project_id=&column=all\|released&cursor=` | lista paginada |
| POST | `/api/prompts/:id/override` | `{confirm: true}` → 200 · 409 expirado/decidido · 403 segredo |
| POST | `/api/prompts/:id/cancel` | descarta prompt retido |
| POST | `/api/playground/evaluate` | `{prompt}` → avaliação (nunca libera) |
| GET | `/api/health` | `{server: "ok", jev: "disponivel"\|"indisponivel"\|"desconhecido"}` |
| GET | `/api/events` | SSE: `prompt.created`, `prompt.updated`, `project.updated`, `jev.status` |

## Regras de contrato
- Nenhuma resposta contém o texto original de um segredo nem a chave da TypeSafe.
- Mudança de contrato do hook = gate humano (afeta plugin instalado).

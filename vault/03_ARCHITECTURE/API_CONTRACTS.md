# Contratos da API (congelados na Fase 5)

Base: `http://127.0.0.1:7070`. JSON. Tipos em `packages/shared/src/contratos.ts`. Implementação: `apps/server/src/http/app.ts`.

**Proteções em todas as rotas:** `Host` precisa ser `127.0.0.1:<porta>` ou `localhost:<porta>` (DNS rebinding); `Origin`, se presente, precisa ser o próprio servidor (CSRF local). Corpo máximo 2 MB.

## Hook (plugin → servidor)
| Método | Rota | Corpo → resposta |
|---|---|---|
| POST | `/api/hook/prompt` | `{source?, session_id?, prompt_id?, cwd, prompt}` → `RespostaHook` |
| GET | `/api/hook/prompt/:id/wait` | long-poll até a decisão → `{action:"allow"}` ou `{action:"block", reason}`. **Fechar a conexão antes cancela a retenção (I12)** |

`RespostaHook`:
| `action` | Quando | Campos |
|---|---|---|
| `allow` | projeto inativo, 🟢, 🟡, ⚪ | `message?`: aviso ao usuário em 🟡/⚪ (o hook usa `systemMessage`) |
| `block` | comando `/guardian-*` (com confirmação), segredo (definitivo) | `reason` |
| `hold` | 🔴 por tamanho ou nota | `prompt_id`, `hold_seconds`, `reason` |

## UI → servidor
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | `{server:"ok", jev:"disponivel"\|"indisponivel"\|"desconhecido"}` |
| GET | `/api/projects` | projetos (abas) |
| POST | `/api/projects/activate` · `/deactivate` | `{cwd}` → `Projeto` |
| GET | `/api/prompts?project_id=<id\|playground>&column=all\|released&before=<iso>&limit=<1..200>` | `PromptAvaliado[]`, mais recentes primeiro |
| POST | `/api/prompts/:id/override` | `{confirm:true}` → 200 `PromptAvaliado` · 403 segredo · 404 · 409 já decidido/expirado |
| POST | `/api/prompts/:id/cancel` | 200 · 404 · 409 |
| POST | `/api/playground/evaluate` | `{prompt}` → `PromptAvaliado` (nunca libera) · 400 para comandos |
| GET | `/api/events` | SSE: `jev.status` (ao conectar e quando muda), `prompt.created`, `prompt.updated`, `project.updated`; heartbeat a cada 15s |

`PromptAvaliado` inclui `can_override` (true só se `RETIDO` e sem segredo), `message`, `scores` (0..1 por critério) e `jev_failure`.

## Regras de contrato
- Nenhuma resposta contém o texto original de um segredo nem a chave da TypeSafe.
- Logs do Fastify não registram corpo de requisição.
- Mudança de contrato do hook = gate G5.

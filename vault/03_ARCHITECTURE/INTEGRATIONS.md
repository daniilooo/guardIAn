# Integrações

## TypeSafe — JEV
| Item | Valor |
|---|---|
| Endpoint | `POST https://api.typesafe.ai/v1/systemone` |
| Auth | `Authorization: Bearer $TYPESAFE_API_KEY` |
| Cliente | **HTTP direto** via `fetch` (D48) em `apps/server/src/infra/jev/avaliador-jev.ts` — SDK não usado |
| Modelo | `JEV_MODEL` (padrão `jev-latest`) |
| Primitiva usada | **Score** (4 perguntas numa chamada) |
| Erros | 401 chave inválida · 422 validação · 429 rate limit · 529 sobrecarga |
| Timeout | `JEV_TIMEOUT_MS` (padrão 10s) → ⚪ JEV INDISPONÍVEL |
| Retry | Nenhum: uma tentativa; falha → ⚪ JEV INDISPONÍVEL (R7) |
| Custo | Créditos por chamada (`usage.input_tokens/output_tokens` registrados) |
| Privacidade | Recebe o texto do prompt **já sem segredos** |

Detalhes aprendidos: [[TYPESAFE_JEV]].

## Claude Code — hook `UserPromptSubmit`
| Item | Valor |
|---|---|
| Entrada (stdin JSON) | `session_id`, `transcript_path`, `cwd`, `hook_event_name`, `prompt` |
| Bloquear | exit code 2 (stderr exibido) ou JSON `{"decision":"block","reason":"..."}` |
| Liberar | exit 0 |
| Timeout | configurável por hook (padrão 60s) → usar **75s** |
| Distribuição | plugin (`.claude-plugin/plugin.json` + `hooks/hooks.json`) via marketplace no repo |

Detalhes e pontos a validar: [[CLAUDE_CODE_HOOKS]].

## GitHub
Via `gh` CLI (sem MCP). Remoto: `git@github.com:daniilooo/guardIAn.git`.

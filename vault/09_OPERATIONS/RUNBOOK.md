# Runbook (MVP local)

> Comandos-alvo; válidos a partir das Fases 5/6.

## Subir
```bash
pnpm start            # http://127.0.0.1:7070
```

## Problemas comuns
| Sintoma | Causa provável | Ação |
|---|---|---|
| Terminal: "guardIAn offline" | Servidor parado | `pnpm start` |
| Todos os prompts ⚪ | Chave inválida, sem internet, 429/529 | Ver `/api/health` e logs; checar `TYPESAFE_API_KEY` (sem exibi-la) |
| Claude Code aborta durante a espera | Timeout do hook < 60s | Conferir `timeout: 75` em `plugins/claude-code/hooks/hooks.json` |
| Porta ocupada | Outro processo na 7070 | Alterar `GUARDIAN_PORT` |
| Banco corrompido | — | Restaurar `*.bak-*` (skill `database-migration`) |

## Backup
`cp data/guardian.db data/guardian.db.bak-$(date +%F)`

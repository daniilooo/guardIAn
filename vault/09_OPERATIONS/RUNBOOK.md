# Runbook (MVP local)

> Servidor disponível desde a Fase 5; plugin na Fase 6; UI na Fase 7.

## Subir
```bash
pnpm start            # http://127.0.0.1:7070 (lê .env se existir)
pnpm dev              # só o servidor, reiniciando ao salvar
pnpm dev:web          # UI com hot reload em http://127.0.0.1:5173 (usa o servidor da 7070)
curl -s http://127.0.0.1:7070/api/health
```

## Problemas comuns
| Sintoma | Causa provável | Ação |
|---|---|---|
| Terminal: "guardIAn offline" | Servidor parado | `pnpm start` |
| Todos os prompts ⚪ | Chave inválida, sem internet, 429/529 | Ver `/api/health` e logs; checar `TYPESAFE_API_KEY` (sem exibi-la) |
| Claude Code aborta durante a espera | Timeout do hook < 60s | Conferir `timeout: 75` em `plugins/claude-code/hooks/hooks.json` |
| Porta ocupada | Outro processo na 7070 | Alterar `GUARDIAN_PORT` |
| Página "UI não compilada" | `apps/web/dist` ausente | `pnpm --filter @guardian/web build` (o `pnpm start` já faz) |
| Banco corrompido | — | Restaurar `*.bak-*` (skill `database-migration`) |
| Log "retenção(ões) antiga(s) descartada(s)" | Servidor reiniciado com prompts retidos | Esperado (D58) |
| 403 "host não permitido" | Acesso por IP/host diferente de 127.0.0.1/localhost | Use `http://127.0.0.1:<porta>` |

## Backup
`cp data/guardian.db data/guardian.db.bak-$(date +%F)`

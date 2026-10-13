# Spike do portão (Fase 2) — DESCARTÁVEL

Valida o mecanismo de interceptação do Claude Code antes do código definitivo. Não é código de produção.

```bash
node scripts/spike/server.mjs                         # terminal 1
claude --plugin-dir scripts/spike/plugin              # terminal 2 (num projeto de teste)
```
Marcadores no prompt: `#barrar`, `#segurar` (libera com `curl -X POST http://127.0.0.1:7070/release/<id>`).
Logs: `spike-log.jsonl` (servidor) e `spike-hook.jsonl` (hook) — ignorados pelo git.

## Teste interativo (manual)
```bash
node scripts/spike/server.mjs                                   # terminal 1
mkdir -p /tmp/proj-teste && cd /tmp/proj-teste
claude --plugin-dir <repo>/scripts/spike/plugin                 # terminal 2
```
1. Envie `teste #segurar diga oi` → observe como a TUI mostra a espera.
2. Repita e pressione **Esc** durante a espera → o prompt é descartado ou passa? (veja `spike-hook.jsonl`)
3. Libere outro com `curl -X POST http://127.0.0.1:7070/release/<id>` (o id aparece no terminal 1).

## Latência do JEV (consome créditos — G10)
```bash
node --env-file=.env scripts/spike/jev-latency.mjs pt
node --env-file=.env scripts/spike/jev-latency.mjs en
```

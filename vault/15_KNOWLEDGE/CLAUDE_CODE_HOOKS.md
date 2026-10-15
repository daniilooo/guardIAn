# Conhecimento — Hooks e plugins do Claude Code

> Validado empiricamente no **Spike da Fase 2** (2026-10-12, Claude Code 2.1.296, `claude -p` + `--plugin-dir`). Código do spike: tag `v0.2.0`, pasta `scripts/spike/` (removida da árvore na `v1.0.0`; a implementação final está em `plugins/claude-code/`).

## `UserPromptSubmit` — resultados
| # | Pergunta | Resultado | Evidência |
|---|---|---|---|
| S1 | O hook roda **antes** da LLM? | ✅ Sim — prompt barrado nunca gera resposta | T1 |
| S2 | Campos de entrada (stdin) | `session_id`, `transcript_path`, `cwd`, **`prompt_id`**, `permission_mode`, `hook_event_name`, `prompt` | logs T1–T7 |
| S3 | Bloquear com motivo | ✅ stdout `{"decision":"block","reason":"..."}` + exit 0. O CLI mostra: `UserPromptSubmit operation blocked by hook:` + motivo + `Original prompt: ...` | T1 |
| S4 | Liberar | ✅ exit 0 sem stdout → prompt segue à LLM (nenhum token extra) | T2 |
| S5 | Segurar e liberar por sinal externo | ✅ hook em long-poll; `curl /release/:id` libera; LLM responde | T3 (≈3,4s de espera) |
| S6 | Expiração de 60s | ✅ servidor responde block aos 60s; prompt descartado (duração total 64s) | T4 |
| S7 | Hook ultrapassa o `timeout` (75s) | ⚠️ **O Claude Code mata o hook e o prompt PASSA para a LLM** (fail-open do CLI) | T5 (servidor com hold 100s → resposta da LLM aos 80s) |
| S8 | Slash commands disparam o hook? | ✅ Sim, com o **texto bruto**: `/guardian-active` e `/guardian-spike:guardian-active` (forma curta e com namespace funcionam) | T6a/T6b |
| S9 | Hook pode tratar o comando sozinho? | ✅ Sim — bloqueando com mensagem de confirmação; **zero tokens de LLM**. Apresentação: "blocked by hook" (texto fixo do CLI) | T6c |
| S10 | Aviso sem bloquear (servidor offline) | ✅ stdout `{"systemMessage":"..."}` + exit 0 → aviso exibido e prompt segue | T7 |
| S11 | Espera de 60s na TUI interativa | ✅ prompt retido até o fim e descartado com a mensagem do hook | Teste manual 1 |
| S12 | **Esc** durante a retenção | ✅ o CLI mata o hook e **descarta** o prompt (nada vai à LLM). ⚠️ O servidor **não percebe** e mantém a retenção aberta até expirar | Teste manual 2 + logs |
| S13 | Autocomplete da TUI | Insere a forma com namespace (`/guardian-spike:guardian-active`) → o hook precisa reconhecer as duas formas | Teste manual 3 |
| S15 | O CLI grava o prompt barrado no histórico local da sessão (`~/.claude/projects/...`) e o repete na mensagem "Original prompt" | ⚠️ Fora do controle do guardIAn: um segredo barrado não vai à LLM, mas fica no arquivo de sessão local do CLI (RK12) | Fase 6 (e2e) |
| S14 | Campos de entrada variam por versão/modo | No modo interativo apareceu também `scratchpad_dir` → o hook deve ler só os campos que usa e ignorar o resto | Teste manual |

## Consequências para o design
1. **I11 (nova invariante):** o hook **deve decidir sozinho antes do timeout do CLI**. O timeout do hook (75s) precisa ser maior que a retenção (60s) + margem, e o hook tem seu próprio relógio que **barra** ao estourar a retenção. Se o hook morrer pelo timeout do CLI, um prompt barrado vaza para a LLM.
2. Comandos `/guardian-*` podem ser tratados **no hook** (chamada à API + bloqueio com mensagem) em vez de ir à LLM. Ver proposta em [[ADR-0005-interceptacao-via-plugin-hook]].
3. Reconhecer as duas formas: `/guardian-active` e `/<plugin>:guardian-active`.
4. `prompt_id` do CLI pode servir de chave de correlação.

5. **I12 (nova invariante):** se a conexão de espera do hook cair (Esc, Ctrl+C, CLI fechado), o servidor encerra a retenção **imediatamente** como `CANCELADO_NO_CLI`, emite o evento SSE e o override deixa de estar disponível. Implementação: escutar `close` da requisição de long-poll (Fase 5).

## Formato
```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command", "command": "node ${CLAUDE_PLUGIN_ROOT}/hook.mjs", "timeout": 75 } ] }
    ]
  }
}
```
Plugin: `.claude-plugin/plugin.json`, `hooks/hooks.json`, `commands/*.md`. Teste local: `claude --plugin-dir <dir>`.

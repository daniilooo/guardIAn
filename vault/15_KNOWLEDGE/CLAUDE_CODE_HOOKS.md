# Conhecimento — Hooks e plugins do Claude Code

> Base conhecida em 2026-10-12. Itens marcados **[validar]** são confirmados na Fase 2.

## `UserPromptSubmit`
- Executa quando o usuário envia um prompt, **antes** de o Claude processá-lo.
- Entrada (stdin, JSON): `session_id`, `transcript_path`, `cwd`, `permission_mode`, `hook_event_name: "UserPromptSubmit"`, `prompt`.
- **Bloquear:** exit code `2` (prompt apagado, stderr mostrado ao usuário) **ou** stdout JSON `{"decision": "block", "reason": "..."}`.
- **Liberar:** exit `0` (stdout pode adicionar contexto — **não** usar, para não gastar tokens).
- **Timeout:** padrão 60s, configurável por hook (`"timeout": 75`). **[validar]** comportamento ao estourar (provavelmente o prompt segue → fail-open).
- **[validar]** slash commands (incluindo de plugin) disparam o hook? Com o texto bruto (`/guardian-active`) ou expandido?

## Plugins
- Manifesto: `.claude-plugin/plugin.json`.
- Hooks do plugin: `hooks/hooks.json` (mesmo formato do settings), caminhos com `${CLAUDE_PLUGIN_ROOT}`.
- Comandos: `commands/<nome>.md` → `/<nome>` (pode aparecer como `/guardian:<nome>`) **[validar]**.
- Marketplace: `.claude-plugin/marketplace.json` na raiz do repositório → `/plugin marketplace add daniilooo/guardIAn`.

## Rascunho de `hooks.json`
```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command", "command": "node ${CLAUDE_PLUGIN_ROOT}/hook.mjs", "timeout": 75 } ] }
    ]
  }
}
```

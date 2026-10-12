# Jornadas do usuário

## J1 — Ativar o guardIAn num projeto
1. Usuário sobe o servidor (`pnpm start`) e abre `http://127.0.0.1:7070`.
2. No Claude Code, dentro do projeto, digita `/guardian-active`.
3. O projeto aparece como **aba** na UI.

## J2 — Prompt aprovado (caminho feliz)
```mermaid
sequenceDiagram
  actor U as Usuário
  participant CC as Claude Code
  participant H as Hook guardIAn
  participant S as Servidor
  participant J as JEV
  participant UI as UI
  U->>CC: prompt
  CC->>H: UserPromptSubmit (antes da LLM)
  H->>S: POST /api/hook/prompt
  S->>S: isenção? ativo? segredo? ≥5 palavras?
  S->>J: 4 perguntas Score (1 chamada)
  J-->>S: notas por critério
  S->>S: nota composta ≥ 50%
  S-->>UI: SSE prompt.created (🟢/🟡)
  S-->>H: allow
  H-->>CC: segue para a LLM
```

## J3 — Prompt barrado e override
```mermaid
sequenceDiagram
  actor U as Usuário
  participant CC as Claude Code
  participant H as Hook
  participant S as Servidor
  participant UI as UI
  U->>CC: prompt fraco
  CC->>H: UserPromptSubmit
  H->>S: POST /api/hook/prompt
  S-->>UI: 🔴 BARRADO + barras
  S-->>H: hold (prompt_id)
  H->>S: aguarda decisão (até 60s)
  U->>UI: "Aprovar manualmente"
  UI->>U: aviso: resultado pode divergir do desejado
  U->>UI: "Enviar mesmo assim"
  UI->>S: POST /api/prompts/:id/override
  S-->>H: allow
  S-->>UI: 🔵 APROVADO PELO USUÁRIO (coluna direita)
  H-->>CC: segue para a LLM
```
Se ninguém clicar em 60s → prompt descartado, nada é enviado. "Cancelar" → descartado imediatamente.

## J4 — Prompt com segredo
Usuário cola uma chave no prompt → 🔴 **BARRADO — SEGREDO DETECTADO** imediatamente, sem JEV, sem override (D38). Histórico mostra o prompt com `[SEGREDO:<tipo>]`.

## J5 — Playground
Usuário abre a aba Playground, digita um prompt, clica "Avaliar" → vê marcador e barras. **Nada é enviado à LLM.** (Consome créditos do JEV.)

## J6 — JEV fora do ar
Prompt passa direto com marcador ⚪ **JEV INDISPONÍVEL**; banner de aviso no topo da UI.

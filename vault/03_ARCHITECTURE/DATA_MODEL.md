# Modelo de dados (consolidado na Fase 5)

Fonte executável: `apps/server/src/infra/db/schema.ts` · migrations em `apps/server/drizzle/` (aplicadas na inicialização).

```mermaid
erDiagram
  PROJECTS ||--o{ PROMPTS : possui
  PROJECTS {
    text id PK "uuid"
    text path UK "cwd absoluto do projeto"
    text name "basename do path"
    int active "boolean"
    text created_at
    text updated_at
  }
  PROMPTS {
    text id PK "uuid"
    text project_id FK "null no playground"
    text source "claude_code | codex | playground"
    text session_id "do CLI"
    text cli_prompt_id "prompt_id do CLI"
    text text_masked "NUNCA o texto original com segredo (I3)"
    int word_count
    text status "BARRADO | APROVADO_COM_RESSALVA | APROVADO | APROVADO_PELO_USUARIO | JEV_INDISPONIVEL"
    text block_reason "SEGREDO_DETECTADO | PROMPT_CURTO | NOTA_BAIXA | null"
    text secret_types "json"
    text message "mensagem exibida ao usuário"
    real score_total "0..100"
    real score_clareza "0..1"
    real score_onde_mexer "0..1"
    real score_o_que_fazer "0..1"
    real score_resultado "0..1"
    text jev_raw "json: score, probabilities, confidence por critério"
    text jev_model
    text jev_failure "motivo técnico do ⚪"
    int input_tokens
    int output_tokens
    int latency_ms
    text final_decision "LIBERADO | RETIDO | BLOQUEADO | DESCARTADO_TIMEOUT | CANCELADO | CANCELADO_NO_CLI | AVALIADO_PLAYGROUND"
    text hold_expires_at
    text decided_at
    text created_at
  }
```

## Regras
- **Uma tabela `prompts`** guarda o prompt e sua avaliação (relação 1:1; D51).
- `text_masked` é gravado **após** o mascaramento (I3). Não existe coluna com o texto original.
- Coluna esquerda da UI = todos os prompts do projeto; coluna direita = `final_decision = LIBERADO`.
- Índice `(project_id, created_at)` para as listas paginadas.
- Prompts `RETIDO` sem retenção ativa na memória (servidor reiniciado) viram `DESCARTADO_TIMEOUT` na inicialização.
- Datas ISO-8601 UTC. Migrations via `pnpm --filter @guardian/server db:generate`; destrutivas são gate G4.

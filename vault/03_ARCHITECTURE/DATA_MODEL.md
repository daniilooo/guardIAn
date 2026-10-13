# Modelo de dados (proposta — consolidada na Fase 5)

```mermaid
erDiagram
  PROJECT ||--o{ PROMPT : possui
  PROMPT ||--|| EVALUATION : tem
  PROJECT {
    text id PK
    text path UK "cwd absoluto"
    text name "basename"
    int active "0/1"
    text created_at
    text updated_at
  }
  PROMPT {
    text id PK "uuid"
    text project_id FK "null no playground"
    text source "claude_code | codex | playground"
    text session_id "do CLI, se houver"
    text text_masked "NUNCA o texto original com segredo"
    int word_count
    text created_at
  }
  EVALUATION {
    text prompt_id PK,FK
    text status "BARRADO | APROVADO_COM_RESSALVA | APROVADO | APROVADO_PELO_USUARIO | JEV_INDISPONIVEL"
    text block_reason "SEGREDO_DETECTADO | PROMPT_CURTO | NOTA_BAIXA | null"
    text secret_types "json, ex.: [anthropic_key]"
    real score_total "0..100, null se não avaliado"
    real score_clareza "0..1"
    real score_onde_mexer "0..1"
    real score_o_que_fazer "0..1"
    real score_resultado "0..1"
    text jev_raw "json: probabilities + confidence por critério"
    text jev_model
    int input_tokens
    int output_tokens
    int latency_ms
    text final_decision "LIBERADO | RETIDO | DESCARTADO_TIMEOUT | CANCELADO | CANCELADO_NO_CLI | AVALIADO_PLAYGROUND"
    text decided_at
    text hold_expires_at
  }
```

## Regras
- `text_masked` é gravado **após** mascaramento (I3). Não existe coluna com o texto original.
- Coluna esquerda da UI = todos os `PROMPT` do projeto; coluna direita = `final_decision = LIBERADO`.
- Datas em ISO-8601 UTC.
- Migrations com Drizzle Kit; destrutivas são gate humano.

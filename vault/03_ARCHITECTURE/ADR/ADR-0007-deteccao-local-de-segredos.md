# ADR-0007 — Detecção local de segredos com mascaramento
- **Status:** Aceito · **Data:** 2026-10-12

## Contexto
R16: prompts com segredo devem ser barrados e salvos. Salvar o texto puro transformaria o SQLite num cofre desprotegido; enviar ao JEV vazaria o segredo para terceiros.

## Decisão
- Detecção **local e determinística** por padrões (prefixos conhecidos: Anthropic, OpenAI, GitHub, AWS, Google, Slack, Stripe, JWT, chaves privadas PEM, connection strings com senha, atribuições `password=`/`secret=`/`token=`), com espaço para heurística de entropia.
- O segredo é **mascarado** (`[SEGREDO:<tipo>]`) **antes** de persistir, logar, emitir SSE ou chamar rede (I2, I3). Decisão do engenheiro: **S1 — salvar mascarado** (D33).
- Sem override (D38).
- Os padrões ficam em `packages/shared` e são reaproveitados pelo pre-commit.

## Consequências
- ✅ Segredo nunca sai da máquina nem fica em disco.
- ⚠️ Falsos negativos possíveis (formatos desconhecidos) — risco registrado; falsos positivos bloqueiam sem override — o usuário reescreve o prompt.

# Conhecimento — TypeSafe / JEV

Fonte: https://docs.typesafe.ai (consultado em 2026-10-12; índice em `/llms.txt`).

- JEV é um modelo **"System One"**: recebe `state` + perguntas tipadas, devolve respostas estruturadas. **Não** gera texto nem substitui a LLM do CLI.
- Primitivas: **Choice** (opção + probabilidades + confidence), **Score** (nível numa rubrica), **Noul** (probabilidade de verdadeiro 0–1). Podem ser misturadas; rodam em **paralelo** numa chamada.
- **Score:** `criteria` = lista ordenada de 2 a 10 níveis (índice = nível). `score` = valor esperado (Σ nível × probabilidade), `probabilities` por nível, `legend`, `confidence` 0–1 (concentração das probabilidades). Níveis podem ser objetos `{what, examples}`.
- Normalização recomendada: `score / (len(criteria) - 1)`; pesos no nosso código (padrão *Composite scoring*).
- API: `POST https://api.typesafe.ai/v1/systemone`, `Authorization: Bearer`, modelo `jev-latest`. Resposta inclui `model` (ex.: `jev-1.13.0`) e `usage` (tokens).
- Erros: 401, 422, 429 (backoff), 529 (sobrecarga). SDKs fazem retry por padrão.
- SDKs: Python (`typesafe-sdk`) e JavaScript (`TypeSafeClient`, `score()`, `choice()`, `noul()`), env `TYPESAFE_API_KEY`.
- Não documentado: latência, limites numéricos de rate, tamanho máximo de `state`, preço → **medir no spike**.
- Páginas úteis: `/patterns/composite-scoring`, `/patterns/confidence-routing`, `/cookbooks/llm_guardrails`, `/model-jaggedness/jev-1.13`, `/agent-skill` (skill pronta para Claude Code/Codex gerarem integrações).

## A preencher no spike
- Latência p50/p95 de 1 chamada com 4 Scores: _?_
- Instruções em PT-BR funcionam bem? _?_

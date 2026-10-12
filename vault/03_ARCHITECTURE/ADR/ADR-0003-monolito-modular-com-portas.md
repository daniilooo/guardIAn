# ADR-0003 — Monólito modular com portas Avaliador e AdaptadorCLI
- **Status:** Aceito · **Data:** 2026-10-12

## Contexto
O sistema é pequeno, local e de usuário único. Há duas variações reais: a fonte de notas (JEV real × fake/indisponível) e o CLI interceptado (Claude Code × Codex).

## Decisão
Monólito em camadas (`http → aplicacao → dominio ← infra`) com **apenas duas portas**: `Avaliador` e `AdaptadorCLI`. A **decisão de faixa é calculada no nosso domínio** a partir das notas normalizadas (padrão *composite scoring* da TypeSafe).

## Alternativas
- Hexagonal/Clean completo, DDD tático, CQRS — custo sem benefício no MVP.
- Deixar o JEV decidir aprovar/barrar (Choice) — perde testabilidade e controle dos limiares.

## Consequências
- ✅ Domínio puro e testável; limiares sob nosso controle.
- ⚠️ Novas portas só com problema real (ADR novo).

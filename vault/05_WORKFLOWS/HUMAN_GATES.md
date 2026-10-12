# Gates humanos

Ações que **exigem autorização explícita do engenheiro**. A IA para, apresenta o contexto (resumo, opções, recomendação) e aguarda.

| # | Gate |
|---|---|
| G1 | Mudança arquitetural ou ADR novo/alterado |
| G2 | Mudança em regra de negócio R1–R17 ou invariante I1–I10 (inclui faixas, 5 palavras, 60s) |
| G3 | Mudança na rubrica do JEV ([[JEV_RUBRIC]]) |
| G4 | Migration destrutiva no SQLite / exclusão de dados |
| G5 | Alteração do hook de interceptação ou do contrato hook ↔ servidor |
| G6 | Nova dependência relevante (runtime) |
| G7 | Qualquer coisa envolvendo `.env`, segredos ou chaves |
| G8 | Push, abertura de PR |
| G9 | Merge em `develop`/`main`, tag, release |
| G10 | Chamadas reais à API TypeSafe (consomem créditos) |
| G11 | Ampliar o escopo do MVP |
| G12 | Ativar dogfooding (`/guardian-active` neste repositório) |

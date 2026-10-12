# COMMIT / PUSH / PR

Procedimento detalhado: skills `commit` e `git-flow`.

| Ação | LLM pode? |
|---|---|
| Criar `feature/*`, `fix/*` | ✅ |
| Commitar na própria branch | ✅ (via skill `commit`) |
| Push da própria branch | ⚠️ somente com autorização explícita |
| Abrir PR | ⚠️ somente com autorização explícita |
| Merge em `develop` | ❌ humano |
| Merge em `main`, tag, release | ❌ humano |
| Push em `main`/`develop`, force push | ❌ nunca |

Antes de pedir autorização de push/PR, apresente o relatório do Reporter (resumo, testes, riscos).

# REVISÃO

Executada pelo **Reviewer** (`agents/reviewer.md`) com a skill `code-review`.

## Entrada mínima
- diff (`git diff develop...HEAD`)
- critérios de aceite da tarefa
- regras/arquitetura relevantes (trechos, não o vault inteiro)
- resultado dos testes

## Foco
Bugs, regressões, violação de regra de negócio, violação arquitetural, vazamento de segredo, complexidade desnecessária, duplicação, ausência de teste.

## Saída
Achados priorizados (crítico / importante / sugestão) com arquivo:linha. Crítico bloqueia o commit/PR.

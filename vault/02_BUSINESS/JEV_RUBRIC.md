# Rubrica do JEV (rascunho — H2)

> **Status: rascunho.** Será calibrada na Fase 4 (poucas chamadas reais, com autorização) e na Fase 8. Alterar a rubrica é **gate humano**.

## Como é usada
Uma única chamada `POST /v1/systemone` com `state` = prompt (já mascarado) e **4 perguntas `score`** (rodam em paralelo no JEV). Cada critério tem **5 níveis (0–4)**. O JEV devolve `score` (valor esperado 0–4), `probabilities` e `confidence`.

```text
nota_criterio = score / 4                      (0..1)
nota_composta = média(4 critérios) × 100       (%)
```
`confidence` é salvo, mas não decide nada no MVP (H3). Idioma das instruções (PT-BR × EN) a validar no spike/Fase 4.

## C1 — Clareza do pedido
Instrução: *"Quão claro e inequívoco é o pedido feito neste prompt para um assistente de programação?"*
| Nível | Descrição |
|---|---|
| 0 | Incompreensível ou sem pedido identificável |
| 1 | Pedido vago; várias interpretações plausíveis |
| 2 | Pedido identificável, mas com ambiguidades relevantes |
| 3 | Pedido claro, com pequenas ambiguidades |
| 4 | Pedido claro, específico e sem ambiguidade |

## C2 — Onde mexer
Instrução: *"O prompt indica onde a mudança deve ser feita (arquivos, módulos, telas, funções, componentes)?"*
| Nível | Descrição |
|---|---|
| 0 | Nenhuma indicação de local |
| 1 | Local apenas implícito ou genérico ("no sistema") |
| 2 | Área geral indicada (ex.: "no backend", "na tela de login") |
| 3 | Componente/módulo identificado |
| 4 | Local preciso (arquivo, função, rota ou componente nomeado) |

## C3 — O que fazer
Instrução: *"O prompt descreve a ação concreta a ser executada?"*
| Nível | Descrição |
|---|---|
| 0 | Nenhuma ação descrita |
| 1 | Ação genérica ("melhora isso", "arruma") |
| 2 | Ação identificável, sem detalhes |
| 3 | Ação descrita com alguns detalhes ou restrições |
| 4 | Ação detalhada, com passos ou restrições claras |

## C4 — Resultado esperado
Instrução: *"O prompt define o resultado esperado ou um critério para saber que a tarefa está pronta?"*
| Nível | Descrição |
|---|---|
| 0 | Nenhum resultado esperado |
| 1 | Resultado apenas implícito |
| 2 | Resultado mencionado de forma vaga |
| 3 | Resultado descrito de forma verificável em parte |
| 4 | Resultado claro e verificável (comportamento, saída, teste, critério de aceite) |

## Exemplos de calibração (alvo)
| Prompt | Faixa esperada |
|---|---|
| "arruma o bug do login por favor" | 🔴 |
| "No arquivo `auth.ts`, corrija a validação de email do login" | 🟡 |
| "Em `apps/server/src/auth.ts`, na função `validateEmail`, rejeite emails sem domínio. Esperado: `a@` retorna 400 e o teste `auth.test.ts` passa." | 🟢 |

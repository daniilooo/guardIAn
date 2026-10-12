# Visão do produto

## Problema
A LLM sempre devolve **alguma coisa** — mas nem sempre o que se quer. A causa mais comum é o prompt mal estruturado ou pouco detalhado. Cada prompt ruim consome tokens, gera retrabalho e aumenta o custo mensal de IA.

## Para quem
Qualquer pessoa que usa IA para **construir** algo: amador, desenvolvedor, engenheiro. Ver [[PERSONAS]].

## Proposta de valor
Uma camada **antes** da LLM que funciona com **dois portões**:
1. **Portão de entrada** — o prompt é capturado antes de qualquer processamento pela LLM e avaliado pelo JEV em 4 critérios: *Clareza do pedido*, *Onde mexer*, *O que fazer*, *Resultado esperado*.
2. **Portão de saída** — só os prompts aprovados (ou aprovados manualmente pelo usuário) seguem para a LLM.

Tudo é visível numa UI local estilo ferramenta de observabilidade.

## Resultado esperado
O usuário passa a enviar prompts melhores, desperdiça menos tokens e entende **onde** seus prompts são fracos (barras por critério).

## Referências
Nenhum produto equivalente conhecido (intake de 2026-10-12).

## Diferenciais
- Avaliação **antes** do gasto com a LLM.
- Decisão determinística no nosso código, alimentada por notas calibradas (JEV) — ver [[ADR-0003-monolito-modular-com-portas]].
- Bloqueio de segredos antes de saírem da máquina.

## Visão pós-MVP
Camada mais ampla de **guardrails** para IA, suporte a Codex e outros CLIs, sugestões de melhoria de prompt. Ver [[POST_MVP_BACKLOG]].

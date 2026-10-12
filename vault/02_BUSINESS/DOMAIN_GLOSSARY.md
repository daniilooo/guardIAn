# Glossário de domínio

| Termo | Definição |
|---|---|
| **Prompt** | Texto enviado pelo usuário ao CLI, capturado pelo guardIAn antes da LLM |
| **Portão de entrada** | Etapa que recebe e avalia o prompt |
| **Portão de saída** | Etapa que libera (ou não) o prompt para a LLM |
| **JEV** | Modelo "System One" da TypeSafe que devolve notas estruturadas (não gera texto) |
| **Critério** | Uma das 4 dimensões avaliadas: Clareza do pedido, Onde mexer, O que fazer, Resultado esperado |
| **Nota do critério** | Valor 0–1 (normalizado) devolvido pelo JEV para um critério |
| **Nota composta** | Média ponderada (25% cada) das notas dos critérios, em % |
| **Avaliação** | Resultado de aplicar regras locais + JEV a um prompt |
| **Marcador / status** | Classificação visível: BARRADO, SEGREDO DETECTADO, APROVADO COM RESSALVA, APROVADO, APROVADO PELO USUÁRIO, JEV INDISPONÍVEL |
| **Motivo de bloqueio** | `SEGREDO_DETECTADO`, `PROMPT_CURTO` ou `NOTA_BAIXA` |
| **Retenção** | Janela de 60s em que um prompt barrado aguarda decisão |
| **Override** | Liberação manual de um prompt barrado ("Enviar mesmo assim") |
| **Descartado** | Prompt barrado que expirou ou foi cancelado; nunca chega à LLM |
| **Projeto** | Diretório de trabalho do CLI; exibido como aba; pode estar ativo ou inativo |
| **Playground** | Área de testes que avalia sem enviar à LLM |
| **Isenção** | Prompt que o guardIAn ignora por regra (`/guardian-*`) |
| **Mascaramento** | Substituição de um segredo por `[SEGREDO:<tipo>]` antes de qualquer persistência ou envio |

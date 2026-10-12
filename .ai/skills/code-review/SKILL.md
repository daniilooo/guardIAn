---
name: code-review
description: Revisão crítica de diff focada em bugs, regras de negócio, segurança e simplicidade.
---
# Skill: code-review

1. Obtenha o diff: `git diff develop...HEAD` (ou o informado).
2. Leia **apenas** as regras/ADRs que o diff toca.
3. Para cada arquivo, pergunte:
   - Qual entrada concreta faz isso falhar?
   - Alguma regra R1–R16 ou invariante foi violada? (ordem do pipeline, mascaramento antes de persistir, isenção `/guardian-*`, limiares 5 palavras / 50% / 75%, espera 60s)
   - Algum texto de prompt chega a log, DB ou rede **sem mascaramento**?
   - O JEV real pode ser chamado em teste?
   - Existe abstração sem uso real? Duplicação de tipos que deveriam estar em `packages/shared`?
   - Há teste cobrindo o comportamento novo?
4. Classifique: **crítico** (bloqueia) · **importante** · **sugestão**. Cada achado com `arquivo:linha` e cenário de falha.
5. Não reescreva o código — aponte.

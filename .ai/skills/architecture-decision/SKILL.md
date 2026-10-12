---
name: architecture-decision
description: Registra uma decisão arquitetural como ADR no vault.
---
# Skill: architecture-decision

Use quando a decisão for **difícil de reverter**, afetar mais de um módulo, adicionar dependência relevante, mudar contrato do hook/API ou envolver segurança.

1. Próximo número: veja `vault/03_ARCHITECTURE/ADR/README.md`.
2. Copie `.ai/templates/ADR.md` para `vault/03_ARCHITECTURE/ADR/ADR-NNNN-<slug>.md`.
3. Preencha: Contexto, Decisão, Alternativas consideradas, Consequências, Status (`Proposto`).
4. Adicione a linha no índice `ADR/README.md` e em `vault/10_DECISIONS/DECISION_LOG.md`.
5. **Gate humano:** status só vira `Aceito` com aprovação explícita.
6. Se substitui outro ADR, marque o antigo como `Substituído por ADR-NNNN`.

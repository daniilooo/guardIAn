# Agentes

Só existem agentes que **se pagam**. Projeto pessoal, localhost e SQLite não justificam PO, PM, DBA, SRE ou FinOps dedicados.

| Agente | Tier | Paralelizável | Papel |
|---|---|---|---|
| [orchestrator](orchestrator.md) | T2 | — | Triagem, decomposição, coordenação, gates |
| [explorer](explorer.md) | T1 | ✅ | Perguntas factuais sobre o repositório |
| [reporter](reporter.md) | T1 | — | Comunicação humana dos resultados |
| [architect](architect.md) | T2 (T3 se crítico) | — | Desenho de solução, ADR, anti-overengineering |
| [backend-developer](backend-developer.md) | T2 | ✅ | Server, núcleo de avaliação, plugin/hook |
| [frontend-developer](frontend-developer.md) | T2 | ✅ | UI React |
| [qa](qa.md) | T2 | ✅ | Testes, edge cases, roteiro de aceite |
| [reviewer](reviewer.md) | T2 | ✅ | Revisão crítica do diff |
| [devops](devops.md) | T2 | — | Tooling, hooks git, CI, build, homologação local |

Tiers: `vault/13_AI_SYSTEM/MODEL_STRATEGY.md`. Contratos: `.ai/contracts/README.md`.

Segurança não é um agente separado: é a skill `security-review`, aplicada pelo Reviewer/QA quando a mudança toca segredos, hook ou persistência.

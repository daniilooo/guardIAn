# AGENTS.md — adapter para Codex e demais agentes

Este arquivo é só um **adapter**. A inteligência do projeto não mora aqui.

1. Leia **`.ai/README.md`** — o workflow oficial vive em `.ai/`.
2. A fonte da verdade de produto, regras de negócio e arquitetura vive em **`vault/`** (comece por `vault/00_HOME/START_HERE.md`).
3. Antes de executar qualquer demanda:
   1. leia o estado atual (`vault/00_HOME/PROJECT_STATUS.md` e o HANDOFF em `.ai/state/AI_DEVELOPMENT_STATE.md`);
   2. consulte apenas as regras necessárias para a demanda;
   3. siga o workflow (`.ai/workflow/START.md`);
   4. respeite os **gates humanos** (`vault/05_WORKFLOWS/HUMAN_GATES.md`).
4. Toda comunicação é em **português do Brasil**.

## Específico do Codex / agentes genéricos

- Papéis (agentes) estão em `.ai/agents/*.md`. Quando a ferramenta não suportar subagentes, assuma o papel lendo o arquivo correspondente e siga o contrato de `.ai/contracts/`.
- Skills estão em `.ai/skills/*/SKILL.md`: leia e siga o procedimento quando a demanda corresponder.
- Detalhes e limitações: `.ai/adapters/codex/README.md`.
- Nunca leia nem exiba o conteúdo de `.env`.

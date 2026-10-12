---
name: handoff
description: Atualiza o estado e escreve o bloco HANDOFF antes de encerrar sessão ou trocar de LLM.
---
# Skill: handoff

Execute antes de: encerrar sessão longa, trocar de LLM, pausar no meio de uma tarefa.

1. Atualize `.ai/state/AI_DEVELOPMENT_STATE.md` — tabela de estado (fase, etapa, branch, última entrega, testes…).
2. Substitua o bloco **HANDOFF** usando `.ai/templates/HANDOFF.md`:
   Contexto · Estado · Alterações · Decisões · Pendências · Próximo passo · Arquivos relevantes.
3. Se o estado do produto mudou, atualize `vault/00_HOME/PROJECT_STATUS.md`.
4. Decisões novas → `vault/10_DECISIONS/DECISION_LOG.md`.
5. Seja específico: a próxima LLM **não** terá esta conversa. Inclua comandos exatos e caminhos.
6. Não inclua segredos.

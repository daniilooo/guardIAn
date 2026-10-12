# Manual de desenvolvimento com IA — guardIAn

## 1. Princípios
- O **vault** é a fonte da verdade; o **workflow** (`.ai/`) pertence ao projeto; as LLMs são **executores intercambiáveis**.
- Tudo em **PT-BR**.
- **Contexto mínimo suficiente**: agentes recebem só o necessário (`.ai/contracts/`).
- MVP primeiro; polish depois. Nada de escopo silencioso.

## 2. Como iniciar o projeto
```bash
git clone git@github.com:daniilooo/guardIAn.git && cd guardIAn
git switch develop
# A partir da Fase 3:
corepack enable && pnpm install
cp .env.example .env   # preencha TYPESAFE_API_KEY (nunca commite)
```

## 3. Como abrir o Vault no Obsidian
1. Instale o Obsidian (https://obsidian.md).
2. Na tela inicial, escolha **"Open folder as vault"**.
3. Selecione a pasta **`vault/`** dentro do repositório.
4. Recursos: nada a instalar. Mermaid e links `[[...]]` são nativos. Opcional: *Settings → Files and links → Use [[Wikilinks]]* (já é o padrão) e *Core plugins → Graph view* para ver as relações.
5. Abra **`00_HOME/START_HERE.md`** e navegue pelos links.

> `.obsidian/workspace*.json` não é versionado (estado pessoal do editor).

## 4. Como iniciar o Claude Code
```bash
cd guardIAn && claude
```
Cole `.ai/prompts/INICIAR_SESSAO.md`. O Claude lê `CLAUDE.md` → `.ai/README.md` → status → handoff. Subagentes em `.claude/agents/`, skills em `.claude/skills/` (`/commit`, `/handoff`, `/gdn-code-review`…).

## 5. Como iniciar o Codex
```bash
cd guardIAn && codex
```
Cole `.ai/prompts/INICIAR_SESSAO.md`. O Codex lê `AGENTS.md` automaticamente. Ele **assume os papéis** lendo `.ai/agents/*.md` e segue as skills em `.ai/skills/*/SKILL.md`.

## 6. Workflow de uma demanda
```text
nova demanda → ORCHESTRATOR (triagem) → EXPLORER (fatos) → ARCHITECT (se estrutural + gate)
→ DEVELOPER (implementação) → QA (testes) → REVIEWER (diff) → REPORTER (relatório)
→ GATE HUMANO (push/PR) → commit/push → atualizar status/handoff
```

### Exemplo A — pergunta factual
> "Onde é calculada a nota composta?"

Orquestrador → Explorer (T1) → resposta com `arquivo:linha`. Fim.

### Exemplo B — feature média
> "Implementar a detecção de segredos (Fase 4)."

1. Orquestrador classifica como **média**, confirma que está na fase atual, cria `feature/4-deteccao-segredos`.
2. Explorer lista onde ficam `packages/shared` e `dominio/`.
3. Backend Developer implementa padrões + mascaramento + testes.
4. QA (`QA_SEGURANCA`) adiciona casos positivos/negativos.
5. Reviewer usa `gdn-security-review`.
6. Reporter gera relatório; skill `commit`.
7. **Gate G8**: pede autorização para push/PR.

### Exemplo C — mudança de regra
> "Quero que o limite seja 6 palavras."

Toca R2 → **gate G2**: Orquestrador apresenta impacto, pede aprovação, atualiza [[BUSINESS_RULES]] + constante + testes + [[DECISION_LOG]].

## 7. Trocando de LLM

### Trocando de Claude para Codex
1. No Claude: cole `.ai/prompts/TROCAR_LLM.md` (parte "saindo") → executa a skill `handoff`.
2. (Opcional) commit do estado: `docs(ai): handoff`.
3. Abra o Codex no repositório.
4. Ele lê `AGENTS.md` → `.ai/README.md` → `START_HERE` → `PROJECT_STATUS` → HANDOFF.
5. Cole `.ai/prompts/INICIAR_SESSAO.md` e continue o workflow.

### Trocando de Codex para Claude
Mesmo processo, invertido: handoff no Codex → `claude` → `CLAUDE.md` → … → `INICIAR_SESSAO.md`.

### Utilizando modelo local
Fora do MVP. Quando habilitado: qualquer modelo que leia arquivos pode seguir `.ai/README.md` e os contratos. Recomendado só para T1 (Explorer/Reporter). Ver `.ai/adapters/local/README.md`.

## 8. Regras de handoff
Antes de interromper uma sessão longa ou trocar de LLM, **sempre** atualize `.ai/state/AI_DEVELOPMENT_STATE.md` com o bloco HANDOFF (Contexto, Estado, Alterações, Decisões, Pendências, Próximo passo, Arquivos relevantes).

## 9. Onde registrar o quê
| Tipo | Onde |
|---|---|
| Decisão estrutural | ADR em `03_ARCHITECTURE/ADR/` |
| Decisão menor / hipótese | [[DECISION_LOG]] |
| Regra de negócio | [[BUSINESS_RULES]] (gate G2) |
| Ideia fora do MVP | [[POST_MVP_BACKLOG]] |
| Estado do produto | [[PROJECT_STATUS]] |
| Estado da sessão de IA | `.ai/state/AI_DEVELOPMENT_STATE.md` |
| Progresso de fase | [[DEVELOPMENT_PLAN]] + `docs/development-plan.html` |
| Aprendizado técnico | `15_KNOWLEDGE/` |

## 10. Mapa visual
`docs/ai-development-system.html` (abra no navegador).

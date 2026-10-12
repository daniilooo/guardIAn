# .ai — Sistema de desenvolvimento AI-Native do guardIAn

O workflow **pertence ao projeto**, não a uma LLM. Claude Code, Codex ou qualquer outra ferramenta são **executores intercambiáveis** que leem este diretório.

## Ordem de leitura (toda sessão nova)

1. Adapter da sua ferramenta: `CLAUDE.md` / `AGENTS.md` / `.ai/adapters/<ferramenta>/README.md`
2. **Este arquivo**
3. `vault/00_HOME/START_HERE.md` — o que é o produto
4. `vault/00_HOME/PROJECT_STATUS.md` — onde estamos
5. `.ai/state/AI_DEVELOPMENT_STATE.md` — **HANDOFF** da última sessão
6. `.ai/workflow/START.md` — como tratar a demanda

Leia o resto **sob demanda** (contexto mínimo suficiente).

## Mapa

| Diretório | Conteúdo |
|---|---|
| `workflow/` | Etapas do fluxo de desenvolvimento e quando usar cada uma |
| `agents/` | Definição de cada papel (responsabilidade, tier de modelo, limites, contrato) |
| `contracts/` | Formato padrão de pedido e resposta entre agentes |
| `skills/` | Procedimentos reutilizáveis (commit, review, ADR, release…) |
| `hooks/` | Especificação dos hooks de desenvolvimento (git) |
| `prompts/` | Prompts prontos para iniciar sessão, trocar de LLM etc. |
| `templates/` | Modelos: ADR, HANDOFF, tarefa, relatório, fase |
| `state/` | Estado operacional da IA + HANDOFF |
| `adapters/` | Como cada ferramenta (Claude, Codex, local) mapeia este sistema |

## Regras inegociáveis

1. **Idioma:** comunicação, documentação, relatórios e commits em **PT-BR**. Código segue a convenção da stack.
2. **Fonte da verdade:** decisões relevantes vão para o `vault/`. Nada estrutural pode depender do histórico de chat.
3. **Gates humanos:** `vault/05_WORKFLOWS/HUMAN_GATES.md`. Na dúvida, pare e pergunte.
4. **Escopo:** não amplie o MVP silenciosamente. Ideias novas → `vault/11_ROADMAP/POST_MVP_BACKLOG.md`.
5. **Segredos:** nunca leia, exiba, registre ou commite `.env`, chaves ou tokens. Documente apenas **nomes** de variáveis.
6. **Handoff:** antes de encerrar uma sessão longa ou trocar de LLM, atualize `state/AI_DEVELOPMENT_STATE.md` (skill `handoff`).
7. **Créditos TypeSafe:** testes automatizados e CI **nunca** chamam o JEV real. Chamadas reais só com intenção explícita do humano.
8. **Simplicidade sustentável vence sofisticação prematura.**

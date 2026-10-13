# guardIAn

> Portão de qualidade para prompts. O guardIAn intercepta o prompt **antes** de ele chegar à LLM que vai codar (Claude Code, Codex…), avalia sua qualidade com o **JEV** (TypeSafe) e só deixa passar o que tem chance real de gerar o resultado esperado — economizando tokens, custo e retrabalho.

**Status:** Bootstrap concluído — implementação ainda não iniciada. Veja [`vault/00_HOME/PROJECT_STATUS.md`](vault/00_HOME/PROJECT_STATUS.md).

## O produto em 30 segundos

```text
Você digita o prompt no Claude Code
        │
        ▼
[ PORTÃO DE ENTRADA ]  guardIAn (plugin + servidor local)
   ├─ tem segredo?            → 🔴 BARRADO (segredo mascarado no histórico)
   ├─ menos de 5 palavras?    → 🔴 BARRADO
   └─ JEV avalia 4 critérios  → Clareza · Onde mexer · O que fazer · Resultado esperado
        │
        ├─ < 50%   → 🔴 BARRADO  (aguarda 60s por "Enviar mesmo assim")
        ├─ 50–74%  → 🟡 APROVADO COM RESSALVA
        └─ ≥ 75%   → 🟢 APROVADO
        ▼
[ PORTÃO DE SAÍDA ] → LLM
```

UI local em `http://127.0.0.1:7070`: abas por projeto, coluna com **todos** os prompts × coluna com os **liberados**, barras por critério, override manual e playground.

## Como executar

> O servidor e a UI ainda não existem (Fases 5–7). O tooling já funciona: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

```bash
corepack enable          # habilita o pnpm (Node ≥ 22.18); sem sudo: corepack enable --install-directory ~/.local/bin
pnpm install             # instala dependências e os hooks git (lefthook)
cp .env.example .env     # preencha TYPESAFE_API_KEY
pnpm start               # http://127.0.0.1:7070
```

No Claude Code, dentro do projeto que deseja filtrar:

```text
/plugin marketplace add daniilooo/guardIAn
/plugin install guardian
/guardian-active         # liga o filtro neste projeto
/guardian-inactive       # desliga
```

## Onde está a documentação

| O quê | Onde |
|---|---|
| Fonte única da verdade (produto, regras, arquitetura, roadmap) | [`vault/`](vault/00_HOME/START_HERE.md) — Vault Obsidian |
| Workflow de desenvolvimento com IA (agentes, skills, contratos) | [`.ai/`](.ai/README.md) |
| Roadmap visual | [`docs/development-plan.html`](docs/development-plan.html) |
| Mapa visual do sistema de desenvolvimento com IA | [`docs/ai-development-system.html`](docs/ai-development-system.html) |

## Como abrir o Vault no Obsidian

1. Instale o [Obsidian](https://obsidian.md).
2. **Open folder as vault** → selecione a pasta `vault/` deste repositório.
3. Abra `00_HOME/START_HERE.md`.

Nenhum plugin externo é necessário (Mermaid é nativo).

## Como trabalhar com IA neste projeto

Qualquer LLM (Claude Code, Codex, outra) começa pelo seu adapter (`CLAUDE.md` / `AGENTS.md`) → [`.ai/README.md`](.ai/README.md) → `START_HERE` → `PROJECT_STATUS` → handoff. Manual completo: [`vault/13_AI_SYSTEM/AI_DEVELOPMENT_MANUAL.md`](vault/13_AI_SYSTEM/AI_DEVELOPMENT_MANUAL.md).

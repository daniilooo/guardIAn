# 🛡️ guardIAn

> **Portão de qualidade para prompts.** O guardIAn intercepta cada prompt **antes** de ele chegar à LLM que vai codar (Claude Code), avalia sua qualidade com o **JEV** (TypeSafe) e só deixa passar o que tem chance real de gerar o resultado esperado. Menos tokens desperdiçados, menos retrabalho.

**Versão:** `1.0.0` (MVP homologado) · **Roda em:** `http://127.0.0.1:7070` (somente local)

## Como funciona

```text
Você digita o prompt no Claude Code
        │
        ▼  hook do plugin (antes da LLM)
[ guardIAn ]
   ├─ /guardian-*            → executa o comando (nada vai à LLM)
   ├─ projeto inativo        → passa direto
   ├─ segredo no prompt?     → 🔒 BARRADO (salvo mascarado, sem override)
   ├─ menos de 5 palavras?   → 🔴 BARRADO
   └─ JEV avalia 4 critérios → Clareza · Onde mexer · O que fazer · Resultado esperado
        │
        ├─ < 50%   → 🔴 BARRADO: retido por 60s; aprove na UI para enviar mesmo assim
        ├─ 50–74%  → 🟡 APROVADO COM RESSALVA (segue, com aviso)
        └─ ≥ 75%   → 🟢 APROVADO
        ▼
       LLM
```

A UI mostra abas por projeto, a coluna **Todos os prompts** ao lado da coluna **Liberados para a LLM**, as notas de cada critério em barras, o botão de override e um **Playground** para testar prompts sem enviá-los a nenhuma LLM.

## Requisitos

- **Node.js ≥ 22.18** e **pnpm** (`corepack enable`; sem sudo: `corepack enable --install-directory ~/.local/bin`)
- **Claude Code**
- Uma chave da API **TypeSafe** (JEV): https://docs.typesafe.ai

## Instalação e uso

```bash
git clone git@github.com:daniilooo/guardIAn.git && cd guardIAn
pnpm install
cp .env.example .env        # preencha TYPESAFE_API_KEY
pnpm start                  # compila a UI e sobe em http://127.0.0.1:7070
```

No Claude Code, uma única vez:

```text
/plugin install guardian --marketplace daniilooo/guardIAn
```

Depois, em cada projeto que você quer filtrar:

| Comando | Efeito |
|---|---|
| `/guardian-active` | Passa a avaliar os prompts deste projeto (vira uma aba na UI) |
| `/guardian-inactive` | Para de avaliar; o histórico é mantido |

Para atualizar o plugin: `claude plugin marketplace update guardian && claude plugin update guardian`.

## Comportamento em falhas

| Situação | Resultado |
|---|---|
| JEV fora do ar, sem chave ou sem internet | O prompt passa como ⚪ **JEV INDISPONÍVEL**, com aviso no terminal e na UI |
| Servidor do guardIAn desligado | O prompt passa, com o aviso "⚠️ guardIAn offline" |
| Esc durante a retenção | O prompt é descartado, e a UI marca "Cancelado no terminal" |

## Privacidade e segurança

- O servidor só escuta em **loopback** e recusa qualquer outro host. Ele não tem autenticação.
- Segredos (chaves de API, tokens, senhas, chaves privadas…) são **mascarados antes** de qualquer gravação, log ou envio, e o prompt é barrado. Ele **nunca** chega ao JEV nem à LLM.
- O texto dos prompts (já mascarado) é enviado à API da TypeSafe para avaliação e fica num **SQLite local** (`data/guardian.db`).
- Limitação conhecida: o próprio Claude Code guarda no histórico local da sessão o prompt barrado. Se você colou uma credencial real, revogue-a.

## Desenvolvimento

```bash
pnpm dev          # servidor com reload (porta 7070)
pnpm dev:web      # UI com hot reload em http://127.0.0.1:5173
pnpm test         # 191 testes (nenhum chama a TypeSafe)
pnpm lint && pnpm typecheck && pnpm build
```

Monorepo pnpm: `apps/server` (Fastify + SQLite/Drizzle), `apps/web` (React + Vite + Tailwind), `packages/shared` (regras e contratos), `plugins/claude-code` (hook e comandos). Os hooks git (lefthook) e o CI (GitHub Actions) aplicam formatação, lint, testes e varredura de segredos.

## Documentação

| O quê | Onde |
|---|---|
| Fonte única da verdade: produto, regras, arquitetura, decisões, roadmap | [`vault/`](vault/00_HOME/START_HERE.md) (abra a pasta como *vault* no Obsidian) |
| Workflow de desenvolvimento com IA (agentes, skills, contratos) | [`.ai/`](.ai/README.md) e [manual](vault/13_AI_SYSTEM/AI_DEVELOPMENT_MANUAL.md) |
| Roadmap visual | [`docs/development-plan.html`](docs/development-plan.html) |
| Sistema de desenvolvimento com IA | [`docs/ai-development-system.html`](docs/ai-development-system.html) |
| Operação e problemas comuns | [`vault/09_OPERATIONS/RUNBOOK.md`](vault/09_OPERATIONS/RUNBOOK.md) |
| Histórico de versões | [`vault/12_RELEASES/CHANGELOG.md`](vault/12_RELEASES/CHANGELOG.md) |

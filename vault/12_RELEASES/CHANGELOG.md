# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/) · SemVer.

## [Não lançado]

## [1.0.0] — MVP
Primeira versão completa e homologada do guardIAn.

### Destaques
- Portão pré-LLM para o Claude Code: plugin `guardian` com hook `UserPromptSubmit` e comandos `/guardian-active` / `/guardian-inactive`.
- Avaliação pelo JEV em 4 critérios, com faixas 🔴 < 50% · 🟡 50–74% · 🟢 ≥ 75%; bloqueio local de prompts curtos e de segredos (mascarados).
- Retenção de 60s com override pela UI; Esc no terminal cancela na hora.
- UI local com abas por projeto, colunas Todos × Liberados, barras por critério, Playground e tempo real.
- Fail-open com aviso quando o JEV ou o servidor estão indisponíveis.
- 191 testes, CI com varredura de segredos, homologação aprovada.

### Alterado
- Versão do plugin e do projeto: `1.0.0`.
- README reescrito para a v1.0.0.

### Removido
- Spike descartável da Fase 2 (`scripts/spike/`), preservado na tag `v0.2.0`.

### Corrigido
- Registro da homologação: o plugin homologado veio do marketplace.

## [0.8.0] — QA e Homologação
### Adicionado
- Relatório de QA e security review; roteiro de homologação com comandos prontos.
- Homologação do MVP aprovada pelo engenheiro.
### Corrigido
- Servidor recusa `GUARDIAN_HOST` fora de loopback (segurança).
- Hook mostra o erro real quando o servidor recusa a avaliação, em vez de "offline".
- UI mostra a data em prompts de dias anteriores.

## [0.7.0] — UI
### Adicionado
- UI web (React + Vite + Tailwind) em `http://127.0.0.1:7070`: abas por projeto e Playground, colunas Todos × Liberados, marcadores, 4 barras por critério, override com contador de 60s, banner de JEV indisponível, tempo real via SSE.
- Servidor serve a UI compilada; `pnpm start` compila antes de subir.

## [0.6.0] — Plugin Claude Code
### Adicionado
- Plugin `guardian` (`plugins/claude-code`): hook `UserPromptSubmit` sem dependências, comandos `/guardian-active` e `/guardian-inactive`.
- Marketplace na raiz do repositório: `/plugin install guardian --marketplace daniilooo/guardIAn`.
- Testes executando o hook real contra o servidor; validação no Claude Code real.

## [0.5.0] — Servidor e persistência
### Adicionado
- Servidor Fastify local (`pnpm start`/`pnpm dev`) com SQLite + Drizzle e migrations automáticas.
- API completa: hook (avaliação, retenção 60s com long-poll), projetos, prompts, override/cancelar, playground, health e SSE.
- I12: fechar a conexão de espera cancela a retenção na hora.
- Proteções de `Host`/`Origin`; logs sem conteúdo de prompts.

## [0.4.0] — Núcleo de avaliação
### Adicionado
- `apps/server`: domínio de avaliação (comandos, palavras, mascaramento de segredos, nota composta e faixas) e pipeline `avaliarPrompt` (ordem I4).
- Porta `Avaliador` com `AvaliadorJev` (HTTP direto) e `AvaliadorFake`; rubrica de produção.
- Smoke manual do adaptador contra o JEV real.

## [0.3.0] — Fundação técnica
### Adicionado
- Monorepo pnpm 12 com TypeScript 6.0, ESLint 10, Prettier, Vitest 5 e lefthook.
- `packages/shared`: constantes de negócio, domínio, contratos HTTP e padrões de segredo.
- `scripts/check-secrets.ts` e `scripts/check-commit-msg.ts` como fonte única para hooks e CI.
### Alterado
- CI executa format, lint, typecheck, test e build.
### Corrigido
- Padrão de chave OpenAI casava também com chaves Anthropic.

## [0.2.0] — Spike do portão
### Adicionado
- Spike descartável (`scripts/spike/`) validando o hook `UserPromptSubmit`: bloqueio, liberação, retenção de 60s, expiração, slash commands, fail-open e Esc.
- Medição real do JEV (272–569 ms; rubrica 3/3 em PT e EN).
- Esteira de CI e rulesets de `main`/`develop`.
### Alterado
- R14: comandos `/guardian-*` executados pelo próprio hook (D42).
- Novas invariantes I11 (hook decide antes do timeout do CLI) e I12 (queda da conexão encerra a retenção).

## [0.1.0] — Bootstrap
### Adicionado
- Bootstrap AI-Native: vault Obsidian, sistema `.ai/`, adapters Claude/Codex, agentes, skills, roadmap e documentação (Fase 1).

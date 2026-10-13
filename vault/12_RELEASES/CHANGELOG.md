# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/pt-BR/) · SemVer.

## [Não lançado]

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

---
name: commit
description: Cria um commit seguro em Conventional Commits PT-BR após ler o diff, rodar validações e checar segredos.
---
# Skill: commit

1. **Contexto:** `git status` e `git diff --staged` (se nada staged, `git diff`). Confirme que está em `feature/*`, `fix/*` ou `hotfix/*` — **nunca** commite direto em `main` ou `develop` (exceto o commit inicial do bootstrap).
2. **Arquivos indevidos — não incluir:** `.env*` (exceto `.env.example`), `*.db`, `data/`, `node_modules/`, `dist/`, `coverage/`, arquivos de IDE, binários grandes não intencionais.
3. **Segredos:** procure no diff padrões de chave/token (`sk-`, `ghp_`, `AKIA`, `-----BEGIN`, `TYPESAFE_API_KEY=` com valor…). Achou → **pare** e avise o humano.
4. **Validações** (quando o tooling existir): `pnpm lint && pnpm typecheck && pnpm test`. Falhou → não commite; reporte a saída.
5. **Adicione arquivos explicitamente** pelo nome (evite `git add -A` cego).
6. **Mensagem** (Conventional Commits, PT-BR, imperativo):
   ```text
   <tipo>(<escopo>): <resumo em até 72 caracteres>

   <por que a mudança foi feita, se não for óbvio>

   Refs: GDN-<fase>-<seq>
   ```
   Tipos: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`, `build`, `perf`. Escopos: `server`, `web`, `shared`, `plugin`, `vault`, `ai`, `infra`.
   Mudança que quebra contrato → `feat(shared)!:` + rodapé `BREAKING CHANGE:`.
7. Acrescente a linha de co-autoria da ferramenta, se ela exigir.
8. Não faça push (ver `git-flow`).

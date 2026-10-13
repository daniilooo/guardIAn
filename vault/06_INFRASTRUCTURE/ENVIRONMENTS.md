# Ambientes

| Ambiente | Como | Banco | JEV |
|---|---|---|---|
| Desenvolvimento | `pnpm dev` (Vite + Fastify watch) | `data/guardian.db` | real só com G10; padrão fake recomendado |
| Testes / CI | `pnpm test` ([[CI_CD]]) | SQLite em memória | **sempre fake** |
| Homologação | `pnpm build && pnpm start` + plugin instalado; projeto de teste separado | `data/guardian.db` | real |
| Produção | Não existe no MVP (uso pessoal local = homologação aprovada) | — | — |

## Variáveis de ambiente
Ver `.env.example`: `TYPESAFE_API_KEY`, `JEV_MODEL`, `JEV_TIMEOUT_MS`, `GUARDIAN_HOST`, `GUARDIAN_PORT`, `GUARDIAN_DB_PATH`, `LOG_LEVEL`.

Requisitos: Node 22 LTS (`.nvmrc`), pnpm via `corepack enable` (sem sudo: `corepack enable --install-directory ~/.local/bin`), Claude Code. Versão do pnpm fixada em `packageManager` na Fase 3.

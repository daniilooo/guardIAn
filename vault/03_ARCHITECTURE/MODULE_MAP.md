# Mapa de módulos

```text
guardIAn/
├── apps/
│   ├── server/                 Fastify + SQLite + JEV
│   │   └── src/
│   │       ├── http/           rotas e SSE
│   │       ├── aplicacao/      casos de uso
│   │       ├── dominio/        regras puras (isenção, palavras, segredos, nota, faixa)
│   │       ├── infra/
│   │       │   ├── jev/        AvaliadorJev (único lugar que fala com a TypeSafe), AvaliadorFake, rubrica
│   │       │   ├── db/         schema Drizzle, migrations, repositórios
│   │       │   └── sse/
│   │       └── config.ts       leitura de env (única)
│   │   └── scripts/            jev-smoke.ts (manual, G10)
│   └── web/                    React + Vite + Tailwind
│       └── src/ (abas, colunas, card de prompt, barras, modal override, playground, banner JEV)
├── packages/
│   └── shared/                 tipos, enums de status/motivo, constantes de negócio, contratos HTTP, padrões de segredo
├── plugins/
│   └── claude-code/            .claude-plugin/plugin.json, hooks/hooks.json, hook.mjs, commands/
├── scripts/                    spike, check-secrets (pre-commit)
├── vault/                      fonte da verdade
├── .ai/                        sistema AI-native
└── docs/                       HTMLs de roadmap e do sistema de IA
```

## Regras de dependência
- `dominio/` não importa nada de `infra/`, `http/` nem do SDK.
- Somente `infra/jev/` fala com a API TypeSafe.
- `web` e `plugin` dependem só de `shared` e da API HTTP — nunca de `server` diretamente.
- Somente `config.ts` lê `process.env`.

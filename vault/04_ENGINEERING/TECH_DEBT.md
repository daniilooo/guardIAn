# Dívida técnica

| # | Item | Origem | Impacto | Quando pagar |
|---|---|---|---|---|
| TD1 | Node 22 em vez de 24 LTS | Ambiente local | Baixo (suporte até abr/2027) | Pós-MVP |
| TD3 | `esbuild` vulnerável (moderada, GHSA-67mh-4wv8-2f99) dentro do `drizzle-kit` | Dependência de dev; servidor de dev do esbuild não é usado | Baixo | Quando o drizzle-kit atualizar |
| TD2 | TypeScript fixado em 6.0 (TS 7 nativo já existe) | `typescript-eslint` 8.71 só suporta TS < 6.1 | Baixo | Quando o typescript-eslint suportar TS 7 |

Registre aqui atalhos conscientes tomados durante o MVP.

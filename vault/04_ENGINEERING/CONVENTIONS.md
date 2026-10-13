# Convenções

## Idioma
- Comunicação, docs, commits, PRs: **PT-BR**.
- Código: identificadores do **domínio em português** (`avaliarPrompt`, `notaComposta`, `Avaliador`), termos técnicos consagrados em inglês (`Controller`, `Repository`, `handler`). Seja consistente dentro de cada módulo.
- Mensagens exibidas ao usuário: PT-BR.

## TypeScript
- `strict: true`, `noUncheckedIndexedAccess`, ESM. Base em `tsconfig.base.json`.
- **Imports relativos com extensão `.ts`** (`import { x } from './y.ts'`) e só sintaxe apagável (`erasableSyntaxOnly`: nada de `enum`/`namespace`) — permite rodar scripts com o Node puro (type stripping, Node ≥ 22.18).
- Pacotes internos consumidos pelo código-fonte: `@guardian/shared` exporta `./src/index.ts`.
- Enums de negócio como `as const` + tipo derivado em `packages/shared`.
- Nada de números mágicos de negócio: `MIN_PALAVRAS = 5`, `LIMIAR_RESSALVA = 50`, `LIMIAR_APROVADO = 75`, `RETENCAO_SEGUNDOS = 60`.
- Funções de domínio puras; I/O só em `infra/` e `http/`.

## Testes
- Arquivo ao lado: `x.ts` → `x.test.ts`. Nomes de teste em PT-BR descrevendo comportamento.

## Formatação
Prettier (aspas simples, `printWidth` 100; Markdown/vault/docs ignorados) + ESLint flat config (`@eslint/js` + `typescript-eslint` recomendados + `eslint-config-prettier`).

## Documentação
Documente o que **será reutilizado, afeta decisões, protege regras ou evita investigação futura**. Nada de documentação burocrática.

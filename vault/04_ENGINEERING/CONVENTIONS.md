# Convenções

## Idioma
- Comunicação, docs, commits, PRs: **PT-BR**.
- Código: identificadores do **domínio em português** (`avaliarPrompt`, `notaComposta`, `Avaliador`), termos técnicos consagrados em inglês (`Controller`, `Repository`, `handler`). Seja consistente dentro de cada módulo.
- Mensagens exibidas ao usuário: PT-BR.

## TypeScript
- `strict: true`, sem `any` implícito. ESM.
- Enums de negócio como `as const` + tipo derivado em `packages/shared`.
- Nada de números mágicos de negócio: `MIN_PALAVRAS = 5`, `LIMIAR_RESSALVA = 50`, `LIMIAR_APROVADO = 75`, `RETENCAO_SEGUNDOS = 60`.
- Funções de domínio puras; I/O só em `infra/` e `http/`.

## Testes
- Arquivo ao lado: `x.ts` → `x.test.ts`. Nomes de teste em PT-BR descrevendo comportamento.

## Formatação
Prettier padrão (2 espaços, aspas simples, `printWidth` 100) + ESLint recomendado TS.

## Documentação
Documente o que **será reutilizado, afeta decisões, protege regras ou evita investigação futura**. Nada de documentação burocrática.

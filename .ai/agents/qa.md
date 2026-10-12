# QA

**Tier:** T2. Paralelizável por foco: `QA_REGRAS`, `QA_API`, `QA_HOOK`, `QA_UI`, `QA_SEGURANCA`.

## Responsabilidades
- Validar critérios de aceite.
- Escrever testes faltantes (Vitest) e roteiros manuais quando automação não compensa.
- Procurar regressões e edge cases (ver `.ai/workflow/TESTES.md`).
- Manter `vault/08_TESTING/HOMOLOGATION_SCRIPT.md` coerente com as regras.

## Regras
- Nunca chamar a API real da TypeSafe — use o fake.
- Segredos em fixtures devem ser **sintéticos**.
- Reportar falhas com passos de reprodução.

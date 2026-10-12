# TESTES

Estratégia completa: `vault/08_TESTING/TEST_STRATEGY.md`.

## Checklist do QA
- [ ] Critérios de aceite da tarefa cobertos por teste ou roteiro manual
- [ ] Regras de negócio afetadas (R1–R16) têm teste unitário
- [ ] Limites testados: 4/5 palavras, 49%/50%/74%/75%, 60s de espera, JEV com timeout/erro
- [ ] Nenhum teste chama a API real da TypeSafe
- [ ] Nenhum segredo real em fixture (use valores sintéticos com formato válido)
- [ ] `pnpm test` verde

## Paralelização
O Orquestrador pode lançar instâncias de QA em paralelo: `QA_REGRAS` (núcleo), `QA_API` (servidor), `QA_HOOK` (plugin), `QA_UI` (frontend), `QA_SEGURANCA` (segredos/mascaramento).

# Riscos

| # | Risco | Prob. | Impacto | Mitigação | Fase |
|---|---|---|---|---|---|
| RK1 | Hook do Claude Code não suporta segurar 60s / liberar por sinal externo | ~~Média~~ **Mitigado** | Alto | Validado no spike (S5/S6) | 2 |
| RK10 | Hook morto pelo timeout do CLI libera prompt barrado | Média | Alto | I11: relógio interno do hook < timeout; teste automatizado na Fase 6 | 6 |
| RK11 | UI oferece override para prompt já descartado pelo CLI (Esc) | Alta | Médio | I12: encerrar retenção ao fechar a conexão; teste na Fase 5 | 5 |
| RK2 | Latência do JEV no caminho de cada prompt irrita o usuário | Média | Alto | Medir no spike; timeout `JEV_TIMEOUT_MS`; 1 chamada para 4 critérios | 2, 4 |
| RK3 | Rubrica mal calibrada barra prompts bons (ou aprova ruins) | Alta | Alto | Exemplos-alvo, calibração com chamadas reais, ajuste na homologação | 4, 8 |
| RK4 | Mensagens curtas de continuidade ("sim", "continue") sempre barradas pela regra de 5 palavras | Alta | Médio | Override (H1); observar na homologação; contexto de sessão no pós-MVP | 8 |
| RK5 | Consumo de créditos TypeSafe | Média | Médio | Fake em testes/CI, G10, dogfooding desligado, projeto inativo não avalia | Todas |
| RK6 | Falso negativo na detecção de segredos | Média | Alto | Padrões amplos + testes; documentar limites | 4 |
| RK7 | Falso positivo de segredo bloqueia sem override (D38) | Baixa | Médio | Padrões precisos + mensagem clara de como reescrever | 4 |
| RK8 | Mudanças no contrato de hooks/plugins do Claude Code | Baixa | Alto | Adapter isolado; teste do hook | 6 |
| RK9 | Suporte a hooks de prompt no Codex inexistente/diferente | Média | Médio | Pós-MVP; investigar antes de prometer | Pós |

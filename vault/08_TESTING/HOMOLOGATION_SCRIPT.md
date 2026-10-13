# Roteiro de homologação (aceite do MVP)

Pré-requisitos: build de produção rodando (`pnpm start`), UI aberta em `http://127.0.0.1:7070`, plugin instalado no Claude Code, **projeto de teste separado**, `.env` com chave válida.

| # | Passo | Resultado esperado | OK |
|---|---|---|---|
| 1 | No projeto de teste, `/guardian-active` | Aba do projeto aparece na UI; comando não é barrado | ☐ |
| 2 | Enviar `arruma isso` | 🔴 BARRADO "Prompt muito curto, seja mais específico." na coluna esquerda; LLM não responde | ☐ |
| 3 | Enviar prompt vago com ≥5 palavras | 🔴 BARRADO com 4 barras; CLI aguardando | ☐ |
| 4 | Não fazer nada por 60s | Prompt descartado; LLM não responde | ☐ |
| 5 | Repetir 3 e clicar "Aprovar manualmente" → ver aviso → "Cancelar" | Descartado | ☐ |
| 6 | Repetir 3 → "Aprovar manualmente" → "Enviar mesmo assim" | LLM responde; prompt 🔵 na coluna direita | ☐ |
| 6b | Repetir 3 e pressionar **Esc** durante a espera | Prompt descartado; card muda para cancelado na hora; botão de override some | ☐ |
| 7 | Enviar prompt mediano | 🟡 nas duas colunas; LLM responde | ☐ |
| 8 | Enviar prompt completo (onde, o quê, resultado) | 🟢 nas duas colunas; LLM responde | ☐ |
| 9 | Enviar prompt com chave sintética (`sk-ant-api03-...`) | 🔴🔒 SEGREDO DETECTADO; histórico mostra `[SEGREDO:...]`; sem botão de override; LLM não responde | ☐ |
| 10 | Invalidar a chave TypeSafe e enviar prompt | ⚪ JEV INDISPONÍVEL; banner na UI; LLM responde | ☐ |
| 11 | Parar o servidor e enviar prompt | Terminal mostra "⚠️ guardIAn offline: prompt não avaliado"; LLM responde | ☐ |
| 12 | Playground: avaliar 1 prompt | Marcador + barras; nada enviado à LLM | ☐ |
| 13 | `/guardian-inactive` e enviar prompt curto | Passa direto, sem registro | ☐ |
| 14 | Reiniciar servidor | Histórico preservado (SQLite) | ☐ |
| 15 | `git status` / inspecionar `data/guardian.db` | Nenhum segredo em texto puro; `.env` não versionado | ☐ |

Resultado registrado em `12_RELEASES/`.

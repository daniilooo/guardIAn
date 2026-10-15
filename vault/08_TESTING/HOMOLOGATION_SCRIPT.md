# Roteiro de homologação (aceite do MVP)

> Executado pelo **engenheiro**, no Claude Code real, com o **JEV real** (consome créditos — G10 implícito na homologação: ~6 avaliações). Registre o resultado em [[HOMOLOGATION_RESULT]].

## Preparação (uma vez)
```bash
cd ~/Projetos/guardIAn && git switch main && git pull
pnpm install
pnpm start                      # compila a UI e sobe em http://127.0.0.1:7070 (deixe rodando)
```
1. Abra **http://127.0.0.1:7070** no navegador.
2. Num **projeto de teste separado** (ex.: `mkdir -p ~/guardian-homolog && cd ~/guardian-homolog && git init`), abra o Claude Code: `claude`.
3. Instale o plugin: `/plugin install guardian --marketplace daniilooo/guardIAn` (reinicie o Claude Code se ele pedir).

## Roteiro
| # | Passo (no Claude Code) | Resultado esperado | OK |
|---|---|---|---|
| 1 | `/guardian-active` | Mensagem "✅ guardIAn ativado em …"; aba do projeto aparece na UI; a LLM **não** responde | ☐ |
| 2 | `arruma isso` | Prompt retido (🔴 BARRADO "Prompt muito curto…" na coluna esquerda, contador de 60s); a LLM não responde | ☐ |
| 3 | Não fazer nada por 60s | Terminal: "…Tempo de decisão esgotado"; cartão vira "Descartado: 60s sem decisão" | ☐ |
| 4 | `melhora o layout da página de produtos que está feio` | 🔴 BARRADO por nota, com **4 barras** na UI; terminal aguardando | ☐ |
| 5 | Na UI: **Aprovar manualmente** → ler o aviso → **Cancelar** | Cartão "Descartado por você"; terminal mostra o motivo; nada vai à LLM | ☐ |
| 6 | Repetir o 4 → **Aprovar manualmente** → **Enviar mesmo assim** | A LLM responde; cartão 🔵 APROVADO PELO USUÁRIO aparece na coluna direita | ☐ |
| 6b | Repetir o 4 e pressionar **Esc** no terminal durante a espera | Cartão vira "Cancelado no terminal" na hora; botão de aprovação some | ☐ |
| 7 | `No arquivo src/app.ts, adicione validação de email no cadastro` | Provável 🟡: terminal mostra aviso "🟡 guardIAn: Nota …"; a LLM responde; cartão nas duas colunas | ☐ |
| 8 | `Em src/app.ts, na função cadastrar, rejeite emails sem domínio e retorne erro 400. Esperado: o teste app.test.ts passa.` | 🟢 APROVADO sem aviso; a LLM responde; cartão nas duas colunas | ☐ |
| 9 | Um prompt com um token falso: `use o token ` + `ghp_` + 36 letras `a` + ` no deploy de hoje` | 🔴🔒 SEGREDO DETECTADO na hora; UI mostra `[SEGREDO:github_token]`; **sem** botão de aprovação; a LLM não responde | ☐ |
| 10 | Parar o servidor, trocar `TYPESAFE_API_KEY` no `.env` por um valor inválido, `pnpm start` e repetir o 8 | ⚪ JEV INDISPONÍVEL; banner na UI; terminal "⚪ guardIAn: JEV indisponível…"; a LLM responde. **Restaure a chave depois** | ☐ |
| 11 | Parar o servidor (Ctrl+C) e enviar qualquer prompt | Terminal: "⚠️ guardIAn offline: prompt não avaliado"; a LLM responde | ☐ |
| 12 | Subir o servidor de novo; na UI, aba **Playground**: avaliar o prompt do passo 7 | Marcador + barras; nada é enviado à LLM; aparece só no Playground | ☐ |
| 13 | `/guardian-inactive` e enviar `oi` | "⏸️ guardIAn desativado…"; `oi` vai direto à LLM, sem registro; aba com ponto cinza | ☐ |
| 14 | Reiniciar o servidor e recarregar a UI | Histórico preservado (SQLite) | ☐ |
| 15 | `git status` no repositório do guardIAn e `grep -c ghp_ data/guardian.db` | `.env` e `data/` fora do git; nenhum token em texto puro no banco (`0`) | ☐ |

## Observações para a calibração (opcional, mas valiosa)
Anote prompts **reais seus** que o guardIAn barrou e você achou injusto (ou aprovou e não deveria). Eles orientam o ajuste fino da rubrica (G3).

> Lembrete RK12: o Claude Code guarda no histórico local da sessão o prompt barrado do passo 9. Como o token é falso, não há risco.

# Log de decisões

Decisões do intake (2026-10-12). Decisões estruturais têm ADR. Formato: `D<n> — decisão — origem`.

## Produto e regras
| # | Decisão | Origem |
|---|---|---|
| D01 | guardIAn é um portão **antes** da LLM de código, com UI estilo observabilidade | Engenheiro |
| D02 | Avaliador = **JEV (TypeSafe)**, parte do produto | Engenheiro |
| D03 | 4 critérios: Clareza do pedido, Onde mexer, O que fazer, Resultado esperado | Engenheiro |
| D04 | Faixas: <50% barrado · 50–74% ressalva · ≥75% aprovado | Engenheiro (proposta aceita) |
| D05 | MVP mostra **barras horizontais** por critério; sem sugestão/reescrita de prompt | Engenheiro |
| D06 | Captura obrigatoriamente **antes** do envio à LLM | Engenheiro |
| D07 | <5 palavras → barrado "Prompt muito curto, seja mais específico." | Engenheiro |
| D08 | Barrado fica retido 60s; sem decisão → ignorado silenciosamente | Engenheiro |
| D09 | Override com aviso + Cancelar / Enviar mesmo assim → 🔵 aprovado pelo usuário | Engenheiro |
| D10 | JEV fora → bypass + marcador JEV INDISPONÍVEL + aviso | Engenheiro |
| D11 | Projeto = diretório do CLI, registro automático | Engenheiro (proposta aceita) |
| D12 | SQLite portátil guarda prompts e decisões | Engenheiro |
| D13 | Definition of MVP Done ([[MVP_SCOPE]]) | Engenheiro (proposta aceita) |
| D14 | Começar com um CLI (Claude Code); alternar/incluir depois | Engenheiro |
| D30 | Servidor offline → fail-open com aviso no terminal | Engenheiro (proposta aceita) |
| D33 | Prompt com segredo é barrado, nunca enviado ao JEV/LLM, e salvo **mascarado** | Engenheiro (S1) |
| D38 | Prompt com segredo **não tem override** — nunca chega à LLM nem ao JEV (confirma H6) | Engenheiro |

## Stack e arquitetura
| # | Decisão | Origem |
|---|---|---|
| D15 | Node/TypeScript (simplifica dockerização futura) — [[ADR-0002-stack-node-typescript]] | Engenheiro |
| D16 | React + Vite + TS + Tailwind; barras em CSS puro | Proposta aceita |
| D17 | Tempo real via SSE | Proposta aceita |
| D18 | pnpm workspaces — [[ADR-0001-monorepo-pnpm]] | Proposta aceita |
| D19 | Processo único em `127.0.0.1:7070`, subida manual, sem Docker no MVP | Proposta aceita |
| D20 | Sem autenticação no MVP | Proposta aceita |
| D21 | Monólito modular com 2 portas — [[ADR-0003-monolito-modular-com-portas]] | Proposta aceita |
| D22 | ESLint + Prettier + Vitest | Delegado ao Claude |
| D29 | Plugin do Claude Code (e Codex no futuro) com `/guardian-active` e `/guardian-inactive` — [[ADR-0005-interceptacao-via-plugin-hook]] | Engenheiro |

## Processo
| # | Decisão | Origem |
|---|---|---|
| D23 | GitHub (`daniilooo/guardIAn`) + GitFlow main/develop/feature/fix/hotfix | Engenheiro |
| D24 | LLM cria branch e commita; push/PR com autorização; merge/release só humano | Proposta aceita |
| D25 | Gates humanos conforme [[HUMAN_GATES]] | Proposta aceita |
| D26 | Engenheiro revisa sozinho | Engenheiro |
| D27 | Tiers do Codex "a definir"; IA local (Qwen) fora por ora | Engenheiro |
| D28 | Sem MCPs; GitHub via `gh`; sem Jira | Engenheiro |
| D31 | Homologação = roteiro de aceite local num projeto de teste | Proposta aceita |
| D32 | CI no GitHub Actions, sem chamar o JEV real | Proposta aceita |
| D34 | Dogfooding desligado (economia de créditos) | Engenheiro |
| D35 | Hooks de dev via lefthook (pre-commit, commit-msg, pre-push) | Proposta aceita |
| D36 | Node 22 LTS (já instalado) em vez de 24 | Claude, registrado como TD1 |
| D37 | Fase 2 = Spike do portão antes de qualquer código definitivo (maior risco técnico) | Claude |
| D39 | Esteira de CI antecipada (politica-de-branch, seguranca, qualidade) | Engenheiro |
| D40 | `main` e `develop` sem push direto — só merge via PR; `main` só aceita PR de `develop` (rulesets + check) | Engenheiro |
| D41 | Hotfix sai de `main` e entra via `develop` (consequência de D40); `release/*` removido | Claude |
| D42 | Comandos `/guardian-*` são executados pelo próprio hook (zero tokens de LLM); R14 reescrita | Engenheiro (recomendação do spike) |
| D43 | Nova invariante I11: o hook decide sempre antes do timeout do CLI | Spike (S7) |
| D44 | Nova invariante I12: queda da conexão do hook encerra a retenção como `CANCELADO_NO_CLI` | Spike (S12) |
| D45 | TypeScript 6.0 (não 7) por compatibilidade com typescript-eslint (TD2); `@types/node` 22 | Claude (Fase 3) |
| D46 | Scripts de tooling em TypeScript executados pelo Node puro (type stripping); `engines.node >= 22.18` | Claude (Fase 3) |
| D47 | Detector de segredos e validador de commit são fonte única para hook **e** CI; `scripts/ci/check-secrets.sh` removido | Claude (Fase 3) |

## Hipóteses (confirmar ou derrubar)
| # | Hipótese | Status |
|---|---|---|
| H1 | Override vale também para prompts barrados por <5 palavras | Aberta |
| H2 | Cada critério = pergunta Score com 5 níveis (0–4), rubrica em [[JEV_RUBRIC]] | ✅ Validada no spike (3/3 faixas corretas em PT e EN) |
| H3 | `confidence` do JEV é salvo, mas não usado na decisão | Aberta |
| H4 | Exatamente 50% passa como 🟡 | Aberta |
| H5 | Cada fase concluída gera `v0.<fase>.0`; MVP homologado = `v1.0.0` | Aberta |
| H6 | Prompts com segredo **não** têm override | ✅ Confirmada → D38 |
| H7 | Rubrica enviada ao JEV em **PT-BR** (mesma precisão do EN; EN usa ~12% menos tokens de entrada) | Aberta |

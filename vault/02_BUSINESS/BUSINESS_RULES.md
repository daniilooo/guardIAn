# Regras de negócio

> Alterar qualquer regra desta página é **gate humano** ([[HUMAN_GATES]]). No código, todo limiar é constante nomeada em `packages/shared`.

## Interceptação
| # | Regra |
|---|---|
| **R1** | O guardIAn intercepta o prompt **antes** de a LLM recebê-lo. Nenhum prompt de projeto ativo chega à LLM sem passar pelo portão. |
| **R13** | O hook roda em todo prompt, mas **só avalia se o projeto atual estiver ativo**. Projeto inativo → passa direto, sem registro e sem custo. |
| **R14** | Comandos do próprio guardIAn (`/guardian-*`) **nunca** são avaliados nem barrados. |
| **R15** | `/guardian-active` registra/ativa o projeto (vira aba). `/guardian-inactive` desativa o filtro, mantendo o histórico. |
| **R9** | **Projeto** = diretório (`cwd`) da sessão do CLI; registrado automaticamente no `/guardian-active`. |

## Bloqueios locais (determinísticos, antes do JEV)
| # | Regra |
|---|---|
| **R16** | Prompt contendo **segredo** (chave de API, token, senha, chave privada, connection string com credencial…) → 🔴 **BARRADO — SEGREDO DETECTADO**. Não é enviado ao JEV nem à LLM. É salvo com o segredo **mascarado** (`[SEGREDO:<tipo>]`). **Sem override** — bloqueio definitivo (D38). |
| **R2** | Prompt com **menos de 5 palavras** → 🔴 **BARRADO** com a mensagem *"Prompt muito curto, seja mais específico."* Não consome o JEV. Permite override (**H1**). |

## Avaliação pelo JEV
| # | Regra |
|---|---|
| **R3** | 4 critérios com **peso igual (25%)**: *Clareza do pedido*, *Onde mexer*, *O que fazer*, *Resultado esperado*. Nota composta = média das notas normalizadas (0–100%). Faixas: **< 50%** 🔴 BARRADO · **50% a < 75%** 🟡 APROVADO COM RESSALVA · **≥ 75%** 🟢 APROVADO. Exatamente 50% passa (**H4**). |
| **R4** | Todo prompt avaliado pelo JEV (aprovado ou barrado) exibe **4 barras horizontais**, uma por critério. |
| **R7** | JEV indisponível (erro, timeout `JEV_TIMEOUT_MS`, sem chave, sem internet) → **bypass**: o prompt é liberado, registrado com ⚪ **JEV INDISPONÍVEL**, e a UI mostra aviso global. |

## Retenção e override
| # | Regra |
|---|---|
| **R5** | Prompt barrado (exceto segredo) fica **retido por 60 segundos** aguardando decisão. Sem decisão → **descartado silenciosamente**; nada é enviado. |
| **R6** | "Aprovar manualmente" abre aviso explicando que o resultado pode divergir do desejado porque o prompt não atende aos critérios, com **Cancelar** e **Enviar mesmo assim**. "Enviar mesmo assim" libera o prompt, que aparece na coluna direita como 🔵 **APROVADO PELO USUÁRIO**. "Cancelar" descarta. |

## Playground, persistência e infraestrutura
| # | Regra |
|---|---|
| **R8** | Playground **nunca** envia nada a nenhuma LLM (aplica R16 e R2 e consulta o JEV). |
| **R10** | Prompts (mascarados), avaliações e decisões persistem em **SQLite** local. |
| **R11** | Chave do JEV apenas em `.env` (fora do git); `.env.example` versionado. |
| **R12** | MVP com **um** CLI (Claude Code); arquitetura permite plugar outros. |
| **R17** | Servidor guardIAn offline → **fail-open**: o prompt passa e o terminal mostra *"⚠️ guardIAn offline: prompt não avaliado"*. |

## Marcadores
| Marcador | Cor | Coluna esquerda (Todos) | Coluna direita (Liberados) |
|---|---|---|---|
| 🔴 BARRADO | vermelho | ✅ | ❌ |
| 🔴🔒 BARRADO — SEGREDO DETECTADO | vermelho | ✅ | ❌ |
| 🟡 APROVADO COM RESSALVA | amarelo | ✅ | ✅ |
| 🟢 APROVADO | verde | ✅ | ✅ |
| 🔵 APROVADO PELO USUÁRIO | azul | ✅ | ✅ |
| ⚪ JEV INDISPONÍVEL | cinza | ✅ | ✅ |

## Hipóteses ativas
H1 (override também para <5 palavras) · H2 (rubrica de 5 níveis) · H3 (confidence salvo, não usado) · H4 (50% exato passa) · H5 (MVP = v1.0.0). Ver [[DECISION_LOG]].

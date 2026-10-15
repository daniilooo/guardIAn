# Relatório de QA — Fase 8

_2026-10-15 · Claude Code (Opus) · escopo: `v0.7.0` (servidor, plugin, UI)_

## Cobertura automatizada
| Área | Testes | Destaques |
|---|---|---|
| Regras / domínio (`QA_REGRAS`) | 115 | limites 4/5 palavras e 49,999/50/74,999/75, ordem I4, mascaramento, mutações detectadas |
| API / servidor (`QA_API`) | 32 | retenção, override 403/409, cancelar, I12 com conexão real, playground, SSE, Host/Origin, config |
| Hook (`QA_HOOK`) | 13 | `hook.mjs` real como processo: offline, erro HTTP, comandos, 🟢/🟡/🔒, override, cancelar, prazo interno (I11) |
| UI (`QA_UI`) | 21 | lógica (marcadores, colunas, contador) e componentes (cartão, segredo sem override, modal, data) |
| Tooling | 10 | detector de segredos e validador de commit |
| **Total** | **191** | CI verde; nenhum teste acessa a TypeSafe (I10) |

## Achados e correções
| # | Severidade | Achado | Correção |
|---|---|---|---|
| F1 | **Importante (segurança)** | `GUARDIAN_HOST=0.0.0.0` era aceito: servidor sem autenticação exposto na rede local, contrariando o ADR-0006 | `config.ts` recusa qualquer host fora de `127.0.0.1`/`localhost`/`::1` (testado) |
| F2 | Médio | Hook mostrava "guardIAn offline" quando o servidor estava no ar mas recusava a avaliação (ex.: prompt > 1 MB) | Mensagem distinta com o status HTTP real (testado com o hook real) |
| F3 | Baixo (UX) | Cartões mostravam só a hora; prompts de dias anteriores ficavam ambíguos | Data + hora para outros dias (testado) |

Sondado e **sem problema**: URL malformada no servidor estático (Fastify responde 400), XSS no texto do prompt (React escapa), `/api/*` inexistente com UI ativa (404 JSON).

## Security review (skill `security-review`)
| Item | Resultado |
|---|---|
| Servidor só em loopback | ✅ agora imposto pela config (F1) |
| Mascaramento antes de DB/log/SSE/rede (I2/I3) | ✅ testes de banco, resposta, logs e SSE |
| Segredo nunca chega ao JEV/LLM; sem override (D38) | ✅ testes de servidor, hook e UI |
| Chave TypeSafe nunca exposta | ✅ só em `config.ts`; teste garante ausência no resultado |
| Fail-open sem vazar informação | ✅ mensagens genéricas |
| Host/Origin (DNS rebinding / CSRF local) | ✅ testado; proxy de dev remove `Origin` |
| Servidor estático | ✅ confinado à pasta, só GET, `nosniff` |
| Dependências de produção | ✅ `pnpm audit --prod`: nenhuma vulnerabilidade |
| Dependências de desenvolvimento | ⚠️ 1 moderada no `esbuild` antigo dentro do `drizzle-kit` (servidor de dev do esbuild, não usado) → TD3 |
| Limitações conhecidas | RK12 (histórico local do Claude Code guarda o prompt barrado) — fora do controle do guardIAn |

**Achados críticos abertos: nenhum.**

## Pendente para fechar a fase
- Execução do [[HOMOLOGATION_SCRIPT]] pelo engenheiro, com JEV real, no Claude Code real.
- Ajuste fino da rubrica, se a homologação apontar falsos positivos/negativos (G3).

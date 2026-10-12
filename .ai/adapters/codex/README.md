# Adapter — OpenAI Codex CLI

## Como o Codex consome o sistema
| Conceito `.ai/` | No Codex |
|---|---|
| Entrada | `AGENTS.md` (raiz) — lido automaticamente |
| Agentes | Sem subagentes declarativos garantidos: o Codex **assume o papel** lendo `.ai/agents/<nome>.md` e segue o contrato |
| Skills | Ler e seguir `.ai/skills/<nome>/SKILL.md` diretamente (suporte nativo a skills no repositório: **a verificar**) |
| Hooks de dev | lefthook (independe da ferramenta) |

## Mapeamento de tiers
| Tier | Modelo |
|---|---|
| T1 | **a definir** (estudo do humano em andamento) |
| T2 | **a definir** |
| T3 | **a definir** |

Modelos vistos na configuração local (2026-10-12): `gpt-5.6-terra`, `gpt-6-astra`, `gpt-6.1-sol`.

## Iniciar
```bash
cd guardIAn && codex
```
Depois use `.ai/prompts/INICIAR_SESSAO.md`.

## Pendências
- Classificar modelos por tier.
- Verificar suporte a hooks de prompt (para o futuro plugin Codex do **produto**) — pós-MVP.

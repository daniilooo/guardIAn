# Adapter — Claude Code

## Como o Claude Code consome o sistema
| Conceito `.ai/` | No Claude Code |
|---|---|
| Entrada | `CLAUDE.md` (raiz) |
| Agentes | `.claude/agents/<nome>.md` — frontmatter (nome, descrição, modelo) + "leia `.ai/agents/<nome>.md`" |
| Skills | `.claude/skills/<nome>/SKILL.md` — wrapper que aponta para `.ai/skills/<nome>/SKILL.md`. Exceção: `code-review` e `security-review` viram **`gdn-code-review`** e **`gdn-security-review`** para não colidir com skills nativas do Claude Code |
| Hooks de dev | lefthook (independe da ferramenta) |
| Permissões | `.claude/settings.json` (nega leitura de `.env`) |

## Mapeamento de tiers
| Tier | Modelo |
|---|---|
| T1 | `haiku` |
| T2 | `sonnet` |
| T3 | `opus` |

Sessão principal (Orquestrador): recomenda-se Sonnet; use `/model opus` só para decisões T3.

## Capacidades
Subagentes ✅ · Skills ✅ · Hooks ✅ · MCP ✅ (nenhum relevante configurado) · Terminal ✅ · Internet ✅ (WebFetch/WebSearch).

## Iniciar
```bash
cd guardIAn && claude
```
Depois use `.ai/prompts/INICIAR_SESSAO.md`.

## Observação sobre o produto
O plugin do **produto** guardIAn (em `plugins/claude-code/`) é diferente desta configuração de desenvolvimento. **Dogfooding desligado** (economia de créditos TypeSafe) — não ative `/guardian-active` neste repositório sem decisão humana.

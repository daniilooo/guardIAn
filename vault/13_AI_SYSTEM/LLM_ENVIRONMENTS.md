# Ambientes de LLM e MCPs

_Inventário de 2026-10-12._

| Ferramenta | Versão | Subagentes | Skills | Hooks | MCP | Terminal | Internet | No workflow |
|---|---|---|---|---|---|---|---|---|
| Claude Code | 2.1.296 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **Sim (principal)** |
| Codex CLI | 0.162.0 | assume papéis | a verificar | a verificar | ✅ | ✅ | ✅ | Sim (adapter `AGENTS.md`) |
| Ollama (`qwen3:8b`) | 0.40.0 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Não (pós-MVP) |

## MCPs
Nenhum MCP é usado no workflow. GitHub é acessado via `gh` CLI.

| Integração | Finalidade | Quem usa | Proibido | Aprovação humana |
|---|---|---|---|---|
| `gh` CLI | PRs, issues | Orchestrator, DevOps | merge, release, deletar branch/repo | push e PR (G8) |
| MCPs da conta (Gmail, Spotify, Claude Docs) | — | **nenhum agente** | qualquer uso no projeto | — |

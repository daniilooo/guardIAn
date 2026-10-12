# Skills (especificação portável)

A lógica vive **aqui**. Cada ferramenta tem um wrapper fino (ex.: `.claude/skills/<nome>/SKILL.md`) que apenas aponta para cá.

| Skill | Quando usar |
|---|---|
| [commit](commit/SKILL.md) | Criar commit seguro e bem descrito |
| [git-flow](git-flow/SKILL.md) | Criar branch, preparar PR, nomear versões |
| [code-review](code-review/SKILL.md) | Revisar diff antes do PR |
| [testing](testing/SKILL.md) | Escrever/rodar testes seguindo a estratégia |
| [architecture-decision](architecture-decision/SKILL.md) | Registrar ADR |
| [database-migration](database-migration/SKILL.md) | Alterar schema SQLite com segurança |
| [security-review](security-review/SKILL.md) | Mudanças que tocam segredos, hook, persistência, rede |
| [release](release/SKILL.md) | Fechar fase / gerar versão |
| [handoff](handoff/SKILL.md) | Encerrar sessão ou trocar de LLM |

Não criadas (sem benefício no MVP): `jira` (sem ferramenta de gestão — backlog no vault + GitHub Issues), `deploy` (só localhost; coberto por `release`), `dependency-update`, `documentation` (regra de documentação está no workflow).

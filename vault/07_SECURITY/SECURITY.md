# Segurança

## Política de segredos (projeto)
- **Nunca** armazenar no vault, no git, em logs ou em issues: senhas, tokens, chaves privadas, `TYPESAFE_API_KEY`.
- Documentar apenas **nomes** de variáveis (`.env.example`).
- `.env` no `.gitignore`; Claude Code com `deny` de leitura de `.env` (`.claude/settings.json`).
- Pre-commit bloqueia segredos e arquivos `.env` (Fase 3).

## Segurança do produto
| Ameaça | Mitigação |
|---|---|
| Usuário cola segredo no prompt | R16: detecção local, bloqueio, mascaramento antes de persistir; nunca enviado ao JEV/LLM ([[ADR-0007-deteccao-local-de-segredos]]) |
| Banco local expõe segredos | Só `text_masked` é gravado (I3) |
| Outro processo/host acessa a API | Bind em `127.0.0.1` apenas; CORS restrito à própria origem |
| Página web maliciosa chama `127.0.0.1:7070` (CSRF local) | Rotas mutáveis exigem `Content-Type: application/json` e verificam `Origin`; considerar token local no pós-MVP |
| Chave TypeSafe vaza pela UI/API | Chave só no `config.ts` do servidor; nunca serializada |
| Prompt enviado a terceiro (TypeSafe) | Aceito pelo engenheiro; somente texto mascarado é enviado |
| Servidor offline remove proteção | Fail-open consciente (R17), aviso no terminal |

## Privacidade
Prompts (mascarados) ficam em SQLite local sem expurgo no MVP. Expurgo/retensão → pós-MVP.

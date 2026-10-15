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
| Outro processo/host acessa a API | Bind **imposto** a loopback (`config.ts` recusa outros hosts — F1); CORS restrito à própria origem |
| Página web maliciosa chama `127.0.0.1:7070` (CSRF local / DNS rebinding) | Todas as rotas validam `Host` e `Origin` (D55, com testes); corpo JSON validado por schema; token local no pós-MVP |
| Chave TypeSafe vaza pela UI/API | Chave só no `config.ts` do servidor; nunca serializada (teste) |
| Prompt vaza em logs | Fastify sem log de corpo; teste garante que o texto do prompt não aparece nos logs |
| Prompt enviado a terceiro (TypeSafe) | Aceito pelo engenheiro; somente texto mascarado é enviado |
| Servidor offline remove proteção | Fail-open consciente (R17), aviso no terminal |
| Segredo barrado fica no histórico local do Claude Code (S15) | Limitação do CLI, fora do controle do guardIAn; o segredo não chega à LLM nem à TypeSafe. Orientar o usuário a revogar a credencial colada (RK12) |

## Privacidade
Prompts (mascarados) ficam em SQLite local sem expurgo no MVP. Expurgo/retensão → pós-MVP.

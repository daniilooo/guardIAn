---
name: security-review
description: Revisão de segurança para mudanças em segredos, hook, persistência, rede ou dependências.
---
# Skill: security-review

Referência: `vault/07_SECURITY/SECURITY.md`.

Checklist:
- [ ] Servidor escuta **somente** em `127.0.0.1`.
- [ ] Prompt mascarado **antes** de DB, log, SSE e chamada à TypeSafe (invariantes I2/I3).
- [ ] Prompt com segredo nunca chega ao JEV nem à LLM; override bloqueado (D38).
- [ ] `TYPESAFE_API_KEY` só lida de variável de ambiente; nunca logada, nunca enviada à UI.
- [ ] Nenhum endpoint devolve a chave ou o texto original de um segredo.
- [ ] Hook falha **aberto** sem vazar informação (mensagem genérica de offline).
- [ ] CORS/origem: UI e API na mesma origem; nada de `*`.
- [ ] Dependência nova? Verificar manutenção e licença → gate humano.
- [ ] Padrões de detecção de segredos têm testes positivos e negativos.

Achado crítico → bloqueia merge e é reportado ao humano.

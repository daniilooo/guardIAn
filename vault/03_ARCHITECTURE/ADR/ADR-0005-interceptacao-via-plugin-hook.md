# ADR-0005 — Interceptação via plugin com hook UserPromptSubmit
- **Status:** Aceito (comportamento a validar na Fase 2 — Spike) · **Data:** 2026-10-12

## Contexto
O produto precisa capturar o prompt **antes** de a LLM recebê-lo (R1) e segurá-lo por até 60s (R5). A ativação deve ser por projeto via `/guardian-active` / `/guardian-inactive`.

## Decisão
Distribuir o guardIAn como **plugin do Claude Code** com:
- hook `UserPromptSubmit` (script Node sem dependências, timeout **75s**) que consulta o servidor local;
- comandos `/guardian-active` e `/guardian-inactive`;
- o próprio repositório como marketplace.

Opção a avaliar no spike: o hook tratar `/guardian-*` diretamente (chama a API e bloqueia com mensagem de confirmação), evitando gastar tokens da LLM com o comando.

## Alternativas
- Proxy HTTP entre CLI e API da Anthropic — intrusivo, frágil, envolve credenciais.
- Wrapper de terminal — não captura de forma confiável.
- Hook global em `~/.claude/settings.json` — substituído pelo plugin (instalação e ativação mais limpas).

## Pontos a validar (spike)
1. Hook segura 60s sem o Claude Code abortar (com `timeout: 75`).
2. Bloqueio apaga o prompt e mostra o motivo.
3. Slash commands disparam `UserPromptSubmit`? Com que texto?
4. Nome final dos comandos do plugin (namespacing `guardian:`).

## Consequências
- ✅ Captura nativa, antes da LLM, sem tocar credenciais.
- ⚠️ Dependência do contrato de hooks do Claude Code; Codex exigirá adapter próprio.

# ADR-0005 — Interceptação via plugin com hook UserPromptSubmit
- **Status:** Aceito — validado no spike (Fase 2) · **Data:** 2026-10-12

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

## Resultado do spike (detalhes em [[CLAUDE_CODE_HOOKS]])
1. ✅ Hook segura 60s com `timeout: 75` e libera por sinal externo.
2. ✅ Bloqueio mostra o motivo; prompt não chega à LLM.
3. ✅ Slash commands disparam o hook com o texto bruto (`/guardian-active` e `/guardian:guardian-active`).
4. ⚠️ Se o hook estourar o timeout do CLI, o prompt **passa** → nova invariante **I11**: o hook decide sempre antes do timeout.

## Proposta pendente (gate G2/G5)
Tratar `/guardian-active` e `/guardian-inactive` **dentro do hook**: o hook chama `POST /api/projects/activate|deactivate` e bloqueia com a mensagem "✅ guardIAn ativado neste projeto". Vantagens: zero tokens de LLM, sem prompt de permissão de Bash, resposta instantânea. Custo: o CLI exibe o rótulo fixo "blocked by hook". Implica reescrever R14 como: *"comandos `/guardian-*` nunca são avaliados; são executados pelo próprio hook"*.

## Consequências
- ✅ Captura nativa, antes da LLM, sem tocar credenciais.
- ⚠️ Dependência do contrato de hooks do Claude Code; Codex exigirá adapter próprio.

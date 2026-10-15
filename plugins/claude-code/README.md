# guardIAn — plugin do Claude Code

Avalia cada prompt com o JEV **antes** de ele chegar à LLM (hook `UserPromptSubmit`) e barra os que não atendem aos critérios.

## Instalação

Pré-requisito: o servidor do guardIAn rodando (`pnpm start` no repositório, `http://127.0.0.1:7070`).

```text
/plugin install guardian --marketplace daniilooo/guardIAn
```

## Uso

| Comando | Efeito |
|---|---|
| `/guardian-active` | Passa a avaliar os prompts deste projeto |
| `/guardian-inactive` | Para de avaliar (o histórico é mantido) |

Os comandos são executados pelo próprio hook: nada é enviado à LLM.

## Comportamento

| Situação | O que acontece |
|---|---|
| 🟢 Aprovado | O prompt segue normalmente |
| 🟡 Aprovado com ressalva / ⚪ JEV indisponível | Segue, com um aviso no terminal |
| 🔴 Barrado (curto ou nota < 50%) | Fica retido por até 60s: aprove em `http://127.0.0.1:7070` para enviar mesmo assim |
| 🔒 Segredo detectado | Barrado definitivamente; nada é enviado |
| Servidor offline | O prompt segue com o aviso "guardIAn offline" |

Variáveis opcionais: `GUARDIAN_PORT` (padrão 7070) ou `GUARDIAN_URL`.

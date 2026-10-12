# ADR-0006 — Fail-open e servidor apenas em loopback
- **Status:** Aceito · **Data:** 2026-10-12

## Decisão
- JEV indisponível → prompt liberado com ⚪ JEV INDISPONÍVEL (R7).
- Servidor offline → hook libera e avisa no terminal (R17).
- Bloqueios locais (segredo, <5 palavras) continuam valendo enquanto o servidor estiver no ar.
- Servidor escuta **somente** em `127.0.0.1`; sem autenticação no MVP; subida manual.

## Consequências
- ✅ O guardIAn nunca trava o trabalho do usuário.
- ⚠️ Com o servidor desligado, não há proteção (inclusive contra segredos). Documentado na UI/README.

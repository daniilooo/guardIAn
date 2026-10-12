# Invariantes de negócio

Condições que **sempre** devem ser verdadeiras. Violação = bug crítico.

| # | Invariante |
|---|---|
| **I1** | Um prompt de projeto ativo **nunca** chega à LLM com status 🔴 BARRADO, a menos que exista override registrado e feito dentro da janela de 60s. |
| **I2** | Um prompt com segredo detectado **nunca** é enviado ao JEV, à LLM, ao log ou à UI em texto original. |
| **I3** | O mascaramento acontece **antes** de qualquer persistência, log, evento SSE ou chamada de rede. |
| **I4** | Ordem do pipeline: **isenção (`/guardian-*`) → projeto ativo → segredo → tamanho (<5 palavras) → JEV → faixa**. Uma etapa que decide encerra o pipeline. |
| **I5** | A decisão (faixa) é calculada **no nosso código**, de forma determinística, a partir das notas — o JEV não decide sozinho. |
| **I6** | Playground nunca libera nada para LLM. |
| **I7** | Um prompt tem **uma** decisão final; após `LIBERADO`, `DESCARTADO` ou `CANCELADO`, não muda mais. |
| **I8** | Override após a expiração (60s) é rejeitado. |
| **I9** | Falha do JEV ou do servidor nunca trava o CLI do usuário (fail-open, R7/R17), **exceto** bloqueios locais determinísticos (R2, R16) que já tenham sido decididos. |
| **I10** | Testes automatizados e CI nunca chamam a API real da TypeSafe. |

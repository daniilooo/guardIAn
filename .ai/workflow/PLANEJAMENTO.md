# PLANEJAMENTO

## Entrada
Demanda classificada como pequena, média ou grande (ver `START.md`).

## Passos
1. **Explorer** levanta fatos: arquivos afetados, testes existentes, regras envolvidas (contexto mínimo).
2. Decomponha em tarefas com o template `.ai/templates/TASK.md` — cada tarefa com **critério de aceite verificável**.
3. Identifique dependências e o que pode rodar **em paralelo** (ex.: backend e frontend com contrato já definido).
4. Se houver decisão estrutural → **Architect** (ver `agents/architect.md`) antes de implementar.
5. Defina a estratégia de teste de cada tarefa (unitário / integração / manual).

## Saída
Lista de tarefas com contratos prontos para os agentes executores.

## Antipadrões
- Planejar além da fase atual.
- Criar abstrações "para o futuro" (ex.: suporte a N CLIs antes de o primeiro funcionar).

# Máquinas de estado

## Ciclo de vida do prompt (CLI)
```mermaid
stateDiagram-v2
  [*] --> Recebido
  Recebido --> ExecutadoPeloHook: /guardian-* (R14)
  Recebido --> PassaDireto: projeto inativo (R13)
  Recebido --> BarradoSegredo: segredo detectado (R16)
  Recebido --> Retido: < 5 palavras (R2)
  Recebido --> EmAvaliacao: ≥ 5 palavras
  EmAvaliacao --> Liberado: nota ≥ 50% (🟢/🟡)
  EmAvaliacao --> Retido: nota < 50% (🔴)
  EmAvaliacao --> Liberado: JEV indisponível (⚪)
  Retido --> Liberado: Enviar mesmo assim (🔵)
  Retido --> Descartado: Cancelar
  Retido --> Descartado: 60s sem decisão
  BarradoSegredo --> Descartado
  ExecutadoPeloHook --> [*]
  PassaDireto --> [*]
  Liberado --> [*]
  Descartado --> [*]
```
`ExecutadoPeloHook` e `PassaDireto` **não** são persistidos como prompts. O comando altera apenas o estado do projeto.

## Prompt do playground
```mermaid
stateDiagram-v2
  [*] --> Recebido
  Recebido --> Avaliado: segredo / curto / JEV
  Avaliado --> [*]
```

## Projeto
```mermaid
stateDiagram-v2
  [*] --> Ativo: /guardian-active
  Ativo --> Inativo: /guardian-inactive
  Inativo --> Ativo: /guardian-active
```

## Saúde do JEV (UI)
```mermaid
stateDiagram-v2
  [*] --> Desconhecido
  Desconhecido --> Disponivel: chamada OK
  Disponivel --> Indisponivel: erro/timeout
  Indisponivel --> Disponivel: chamada OK
```

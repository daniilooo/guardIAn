import type { CriterioId } from '@guardian/shared';

// Rubrica enviada ao JEV (vault/02_BUSINESS/JEV_RUBRIC.md — H2 validada, H7 PT-BR).
// Alterar textos ou níveis é gate humano G3. Níveis do mais fraco (0) ao mais forte (4).
export const RUBRICA: Record<CriterioId, { instrucao: string; niveis: string[] }> = {
  clareza: {
    instrucao:
      'Quão claro e inequívoco é o pedido feito neste prompt para um assistente de programação?',
    niveis: [
      'Incompreensível ou sem pedido identificável',
      'Pedido vago; várias interpretações plausíveis',
      'Pedido identificável, mas com ambiguidades relevantes',
      'Pedido claro, com pequenas ambiguidades',
      'Pedido claro, específico e sem ambiguidade',
    ],
  },
  onde_mexer: {
    instrucao:
      'O prompt indica onde a mudança deve ser feita (arquivos, módulos, telas, funções, componentes)?',
    niveis: [
      'Nenhuma indicação de local',
      'Local apenas implícito ou genérico',
      'Área geral indicada (ex.: backend, tela de login)',
      'Componente ou módulo identificado',
      'Local preciso (arquivo, função, rota ou componente nomeado)',
    ],
  },
  o_que_fazer: {
    instrucao: 'O prompt descreve a ação concreta a ser executada?',
    niveis: [
      'Nenhuma ação descrita',
      'Ação genérica ("melhora isso", "arruma")',
      'Ação identificável, sem detalhes',
      'Ação descrita com alguns detalhes ou restrições',
      'Ação detalhada, com passos ou restrições claras',
    ],
  },
  resultado: {
    instrucao:
      'O prompt define o resultado esperado ou um critério para saber que a tarefa está pronta?',
    niveis: [
      'Nenhum resultado esperado',
      'Resultado apenas implícito',
      'Resultado mencionado de forma vaga',
      'Resultado descrito de forma verificável em parte',
      'Resultado claro e verificável (comportamento, saída, teste, critério de aceite)',
    ],
  },
};

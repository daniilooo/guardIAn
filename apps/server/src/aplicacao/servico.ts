import { randomUUID } from 'node:crypto';
import { basename } from 'node:path';
import {
  CRITERIOS,
  DECISAO_FINAL,
  MARCADORES,
  MENSAGENS,
  MOTIVO_BLOQUEIO,
  ORIGEM,
  STATUS,
  type EntradaHook,
  type Projeto,
  type PromptAvaliado,
  type RespostaEspera,
  type RespostaHook,
  type SaudeJev,
} from '@guardian/shared';
import type { LinhaProjeto, LinhaPrompt, NovaLinhaPrompt } from '../infra/db/schema.ts';
import type { Repositorios } from '../infra/db/repositorios.ts';
import type { Avaliador } from './avaliador.ts';
import { avaliarPrompt, type Avaliacao } from './avaliar-prompt.ts';
import type { Eventos } from './eventos.ts';
import { criarRetencoes, type DesfechoRetencao } from './retencao.ts';

export interface DependenciasServico {
  repos: Repositorios;
  avaliador: Avaliador;
  eventos: Eventos;
  /** R5 — janela de retenção (60s em produção; menor nos testes). */
  retencaoMs: number;
  /** Endereço da UI, citado nas mensagens do terminal. */
  urlUi: string;
  agora?: () => Date;
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function paraProjeto(l: LinhaProjeto): Projeto {
  return {
    id: l.id,
    path: l.path,
    name: l.name,
    active: l.active,
    created_at: l.createdAt,
    updated_at: l.updatedAt,
  };
}

export function paraPrompt(l: LinhaPrompt): PromptAvaliado {
  const notas = [l.scoreClareza, l.scoreOndeMexer, l.scoreOQueFazer, l.scoreResultado];
  return {
    id: l.id,
    project_id: l.projectId,
    source: l.source as PromptAvaliado['source'],
    text_masked: l.textMasked,
    word_count: l.wordCount,
    created_at: l.createdAt,
    status: l.status as PromptAvaliado['status'],
    block_reason: l.blockReason as PromptAvaliado['block_reason'],
    secret_types: l.secretTypes,
    score_total: l.scoreTotal,
    scores: notas.every((n) => n !== null)
      ? {
          clareza: l.scoreClareza!,
          onde_mexer: l.scoreOndeMexer!,
          o_que_fazer: l.scoreOQueFazer!,
          resultado: l.scoreResultado!,
        }
      : null,
    final_decision: l.finalDecision as PromptAvaliado['final_decision'],
    hold_expires_at: l.holdExpiresAt,
    message: l.message,
    can_override:
      l.finalDecision === DECISAO_FINAL.RETIDO &&
      l.blockReason !== MOTIVO_BLOQUEIO.SEGREDO_DETECTADO,
    jev_failure: l.jevFailure,
  };
}

/** Texto curto para o terminal explicando a nota (R4). */
function resumoNotas(a: Avaliacao): string {
  if (!a.notas || a.notaTotal === null) return '';
  const partes = CRITERIOS.map(({ id, rotulo }) => `${rotulo} ${pct(a.notas![id])}`);
  return `Nota ${Math.round(a.notaTotal)}% — ${partes.join(' · ')}`;
}

function mensagemDaAvaliacao(a: Avaliacao): string | null {
  if (a.motivo === MOTIVO_BLOQUEIO.NOTA_BAIXA) return `${resumoNotas(a)} (mínimo 50%).`;
  if (a.status === STATUS.APROVADO_COM_RESSALVA) return `${resumoNotas(a)}.`;
  if (a.status === STATUS.JEV_INDISPONIVEL)
    return 'JEV indisponível: prompt liberado sem avaliação.';
  return a.mensagem;
}

export function criarServico(deps: DependenciasServico) {
  const { repos, avaliador, eventos, retencaoMs, urlUi } = deps;
  const agora = deps.agora ?? (() => new Date());
  let saudeJev: SaudeJev = 'desconhecido';

  const publicarPrompt = (tipo: 'prompt.created' | 'prompt.updated', linha: LinhaPrompt) =>
    eventos.publicar({ type: tipo, prompt: paraPrompt(linha) });

  const retencoes = criarRetencoes((id, desfecho: DesfechoRetencao) => {
    const campos: Partial<NovaLinhaPrompt> = {
      finalDecision: desfecho,
      decidedAt: agora().toISOString(),
    };
    if (desfecho === 'LIBERADO') campos.status = STATUS.APROVADO_PELO_USUARIO;
    const linha = repos.prompts.atualizar(id, campos);
    if (linha) publicarPrompt('prompt.updated', linha);
  });

  function atualizarSaudeJev(a: Avaliacao): void {
    if (!a.jev) return;
    const nova: SaudeJev = a.jev.ok ? 'disponivel' : 'indisponivel';
    if (nova !== saudeJev) {
      saudeJev = nova;
      eventos.publicar({ type: 'jev.status', jev: nova });
    }
  }

  function persistir(
    a: Avaliacao,
    extra: Pick<
      NovaLinhaPrompt,
      'projectId' | 'source' | 'sessionId' | 'cliPromptId' | 'finalDecision'
    > & {
      holdExpiresAt?: string | null;
    },
  ): LinhaPrompt {
    const jevOk = a.jev?.ok ? a.jev : null;
    const linha = repos.prompts.inserir({
      id: randomUUID(),
      ...extra,
      textMasked: a.textoMascarado,
      wordCount: a.palavras,
      status: a.status,
      blockReason: a.motivo,
      secretTypes: a.tiposSegredo,
      message: mensagemDaAvaliacao(a),
      scoreTotal: a.notaTotal,
      scoreClareza: a.notas?.clareza ?? null,
      scoreOndeMexer: a.notas?.onde_mexer ?? null,
      scoreOQueFazer: a.notas?.o_que_fazer ?? null,
      scoreResultado: a.notas?.resultado ?? null,
      jevRaw: jevOk?.detalhes ?? null,
      jevModel: jevOk?.modelo ?? null,
      jevFailure: a.jev && !a.jev.ok ? a.jev.falha : null,
      inputTokens: jevOk?.uso.input_tokens ?? null,
      outputTokens: jevOk?.uso.output_tokens ?? null,
      latencyMs: a.jev?.latenciaMs ?? null,
      decidedAt: extra.finalDecision === DECISAO_FINAL.RETIDO ? null : agora().toISOString(),
      createdAt: agora().toISOString(),
    });
    publicarPrompt('prompt.created', linha);
    return linha;
  }

  function salvarProjeto(cwd: string, active: boolean): LinhaProjeto {
    const existente = repos.projetos.porCaminho(cwd);
    const momento = agora().toISOString();
    const linha = repos.projetos.salvar({
      id: existente?.id ?? randomUUID(),
      path: cwd,
      name: existente?.name ?? (basename(cwd) || cwd),
      active,
      createdAt: existente?.createdAt ?? momento,
      updatedAt: momento,
    });
    eventos.publicar({ type: 'project.updated', project: paraProjeto(linha) });
    return linha;
  }

  return {
    saudeJev: () => saudeJev,

    ativarProjeto: (cwd: string) => paraProjeto(salvarProjeto(cwd, true)),
    desativarProjeto: (cwd: string) => paraProjeto(salvarProjeto(cwd, false)),
    listarProjetos: () => repos.projetos.listar().map(paraProjeto),

    listarPrompts(filtro: {
      projectId: string | null;
      apenasLiberados: boolean;
      antesDe?: string;
      limite: number;
    }) {
      return repos.prompts.listar(filtro).map(paraPrompt);
    },

    /** Portão de entrada (R1). */
    async receberDoHook(entrada: EntradaHook): Promise<RespostaHook> {
      const projeto = repos.projetos.quePossui(entrada.cwd);
      const r = await avaliarPrompt(entrada.prompt, {
        avaliador,
        projetoAtivo: projeto?.active ?? false,
      });

      if (r.tipo === 'comando') {
        if (r.comando.tipo === 'comando_desconhecido') {
          return {
            action: 'block',
            reason: `Comando desconhecido: /${r.comando.nome}. Disponíveis: /guardian-active, /guardian-inactive.`,
          };
        }
        // Ativação/desativação valem para o diretório do projeto já registrado, ou para o cwd.
        const alvo = projeto?.path ?? entrada.cwd;
        if (r.comando.comando === 'guardian-active') {
          const p = salvarProjeto(alvo, true);
          return {
            action: 'block',
            reason: `✅ guardIAn ativado em "${p.name}". Acompanhe em ${urlUi}`,
          };
        }
        const p = salvarProjeto(alvo, false);
        return { action: 'block', reason: `⏸️ guardIAn desativado em "${p.name}".` };
      }
      if (r.tipo === 'projeto_inativo') return { action: 'allow' };

      const a = r.avaliacao;
      atualizarSaudeJev(a);
      const base = {
        projectId: projeto!.id,
        source: entrada.source,
        sessionId: entrada.session_id ?? null,
        cliPromptId: entrada.prompt_id ?? null,
      };

      if (a.motivo === MOTIVO_BLOQUEIO.SEGREDO_DETECTADO) {
        persistir(a, { ...base, finalDecision: DECISAO_FINAL.BLOQUEADO });
        return {
          action: 'block',
          reason: `🔒 Segredo detectado (${a.tiposSegredo.join(', ')}). O prompt não foi enviado. ${MENSAGENS.segredoDetectado}`,
        };
      }

      if (a.status === STATUS.BARRADO) {
        const expira = new Date(agora().getTime() + retencaoMs).toISOString();
        const linha = persistir(a, {
          ...base,
          finalDecision: DECISAO_FINAL.RETIDO,
          holdExpiresAt: expira,
        });
        retencoes.abrir(linha.id, retencaoMs);
        return {
          action: 'hold',
          prompt_id: linha.id,
          hold_seconds: Math.round(retencaoMs / 1000),
          reason: `🔴 ${linha.message} Retido por ${Math.round(retencaoMs / 1000)}s: para enviar mesmo assim, aprove em ${urlUi}`,
        };
      }

      const linha = persistir(a, { ...base, finalDecision: DECISAO_FINAL.LIBERADO });
      const marcador =
        a.status === STATUS.APROVADO_COM_RESSALVA
          ? MARCADORES.APROVADO_COM_RESSALVA
          : a.status === STATUS.JEV_INDISPONIVEL
            ? MARCADORES.JEV_INDISPONIVEL
            : null;
      return marcador
        ? { action: 'allow', message: `${marcador.emoji} guardIAn: ${linha.message}` }
        : { action: 'allow' };
    },

    /** Long-poll do hook (R5). `aoDesconectar` registra o I12. */
    async aguardarDecisao(
      id: string,
      registrarDesconexao: (cancelar: () => void) => void,
    ): Promise<RespostaEspera | null> {
      const espera = retencoes.aguardar(id);
      if (espera) registrarDesconexao(() => retencoes.conexaoEncerrada(id));
      if (espera) await espera;
      const linha = repos.prompts.porId(id);
      if (!linha) return null;
      if (linha.finalDecision === DECISAO_FINAL.LIBERADO) return { action: 'allow' };
      const motivos: Record<string, string> = {
        DESCARTADO_TIMEOUT: MENSAGENS.retencaoExpirada,
        CANCELADO: 'Cancelado pelo usuário: prompt descartado.',
        CANCELADO_NO_CLI: 'Cancelado no terminal: prompt descartado.',
      };
      return { action: 'block', reason: motivos[linha.finalDecision] ?? 'Prompt não liberado.' };
    },

    /** R6 / D38 / I8 — "Enviar mesmo assim". */
    override(
      id: string,
    ): { ok: true; prompt: PromptAvaliado } | { ok: false; erro: 403 | 404 | 409 } {
      const linha = repos.prompts.porId(id);
      if (!linha) return { ok: false, erro: 404 };
      if (linha.blockReason === MOTIVO_BLOQUEIO.SEGREDO_DETECTADO) return { ok: false, erro: 403 };
      if (!retencoes.decidir(id, 'LIBERADO')) return { ok: false, erro: 409 };
      return { ok: true, prompt: paraPrompt(repos.prompts.porId(id)!) };
    },

    cancelar(id: string): { ok: true; prompt: PromptAvaliado } | { ok: false; erro: 404 | 409 } {
      if (!repos.prompts.porId(id)) return { ok: false, erro: 404 };
      if (!retencoes.decidir(id, 'CANCELADO')) return { ok: false, erro: 409 };
      return { ok: true, prompt: paraPrompt(repos.prompts.porId(id)!) };
    },

    /** R8 / I6 — avalia e registra, nunca libera. */
    async avaliarNoPlayground(prompt: string): Promise<PromptAvaliado | null> {
      const r = await avaliarPrompt(prompt, { avaliador, projetoAtivo: true });
      if (r.tipo !== 'avaliado') return null;
      atualizarSaudeJev(r.avaliacao);
      return paraPrompt(
        persistir(r.avaliacao, {
          projectId: null,
          source: ORIGEM.PLAYGROUND,
          sessionId: null,
          cliPromptId: null,
          finalDecision: DECISAO_FINAL.AVALIADO_PLAYGROUND,
        }),
      );
    },

    /** Retenções abertas antes de um reinício nunca serão respondidas: descarta (fail-safe). */
    descartarRetencoesOrfas(): number {
      const orfas = repos.prompts.retidos().filter((l) => !retencoes.ativa(l.id));
      for (const l of orfas) {
        repos.prompts.atualizar(l.id, {
          finalDecision: DECISAO_FINAL.DESCARTADO_TIMEOUT,
          decidedAt: agora().toISOString(),
        });
      }
      return orfas.length;
    },

    encerrar: () => retencoes.encerrarTodas(),
  };
}

export type Servico = ReturnType<typeof criarServico>;

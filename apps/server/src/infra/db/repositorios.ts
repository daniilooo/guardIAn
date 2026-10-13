import { and, desc, eq, inArray, lt, sql } from 'drizzle-orm';
import type { Banco } from './conexao.ts';
import {
  projects,
  prompts,
  type LinhaProjeto,
  type LinhaPrompt,
  type NovaLinhaPrompt,
} from './schema.ts';

export function criarRepositorios(db: Banco) {
  return {
    projetos: {
      listar(): LinhaProjeto[] {
        return db.select().from(projects).orderBy(projects.name).all();
      },
      porId(id: string): LinhaProjeto | undefined {
        return db.select().from(projects).where(eq(projects.id, id)).get();
      },
      porCaminho(path: string): LinhaProjeto | undefined {
        return db.select().from(projects).where(eq(projects.path, path)).get();
      },
      /** Projeto cujo caminho é o próprio cwd ou um ancestral dele (o mais específico). */
      quePossui(cwd: string): LinhaProjeto | undefined {
        return db
          .select()
          .from(projects)
          .where(
            sql`${cwd} = ${projects.path} OR substr(${cwd}, 1, length(${projects.path}) + 1) = ${projects.path} || '/'`,
          )
          .orderBy(desc(sql`length(${projects.path})`))
          .get();
      },
      salvar(linha: LinhaProjeto): LinhaProjeto {
        return db
          .insert(projects)
          .values(linha)
          .onConflictDoUpdate({
            target: projects.path,
            set: { active: linha.active, updatedAt: linha.updatedAt },
          })
          .returning()
          .get();
      },
    },

    prompts: {
      inserir(linha: NovaLinhaPrompt): LinhaPrompt {
        return db.insert(prompts).values(linha).returning().get();
      },
      porId(id: string): LinhaPrompt | undefined {
        return db.select().from(prompts).where(eq(prompts.id, id)).get();
      },
      atualizar(id: string, campos: Partial<NovaLinhaPrompt>): LinhaPrompt | undefined {
        return db.update(prompts).set(campos).where(eq(prompts.id, id)).returning().get();
      },
      listar(filtro: {
        projectId: string | null;
        apenasLiberados: boolean;
        antesDe?: string;
        limite: number;
      }): LinhaPrompt[] {
        const condicoes = [
          filtro.projectId === null
            ? sql`${prompts.projectId} IS NULL`
            : eq(prompts.projectId, filtro.projectId),
        ];
        if (filtro.apenasLiberados) condicoes.push(eq(prompts.finalDecision, 'LIBERADO'));
        if (filtro.antesDe) condicoes.push(lt(prompts.createdAt, filtro.antesDe));
        return db
          .select()
          .from(prompts)
          .where(and(...condicoes))
          .orderBy(desc(prompts.createdAt))
          .limit(filtro.limite)
          .all();
      },
      /** Retenções que ficaram abertas (ex.: servidor reiniciado). */
      retidos(): LinhaPrompt[] {
        return db
          .select()
          .from(prompts)
          .where(inArray(prompts.finalDecision, ['RETIDO']))
          .all();
      },
    },
  };
}

export type Repositorios = ReturnType<typeof criarRepositorios>;

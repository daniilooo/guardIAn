import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Modelo de dados (vault/03_ARCHITECTURE/DATA_MODEL.md). Datas em ISO-8601 UTC.
// I3: não existe coluna com o texto original do prompt — só `text_masked`.

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  path: text('path').notNull().unique(),
  name: text('name').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const prompts = sqliteTable(
  'prompts',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').references(() => projects.id),
    source: text('source').notNull(),
    sessionId: text('session_id'),
    cliPromptId: text('cli_prompt_id'),
    textMasked: text('text_masked').notNull(),
    wordCount: integer('word_count').notNull(),
    status: text('status').notNull(),
    blockReason: text('block_reason'),
    secretTypes: text('secret_types', { mode: 'json' }).$type<string[]>().notNull(),
    message: text('message'),
    scoreTotal: real('score_total'),
    scoreClareza: real('score_clareza'),
    scoreOndeMexer: real('score_onde_mexer'),
    scoreOQueFazer: real('score_o_que_fazer'),
    scoreResultado: real('score_resultado'),
    jevRaw: text('jev_raw', { mode: 'json' }),
    jevModel: text('jev_model'),
    jevFailure: text('jev_failure'),
    inputTokens: integer('input_tokens'),
    outputTokens: integer('output_tokens'),
    latencyMs: integer('latency_ms'),
    finalDecision: text('final_decision').notNull(),
    holdExpiresAt: text('hold_expires_at'),
    decidedAt: text('decided_at'),
    createdAt: text('created_at').notNull(),
  },
  (t) => [index('prompts_project_created_idx').on(t.projectId, t.createdAt)],
);

export type LinhaProjeto = typeof projects.$inferSelect;
export type LinhaPrompt = typeof prompts.$inferSelect;
export type NovaLinhaPrompt = typeof prompts.$inferInsert;

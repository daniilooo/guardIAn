# apps/server

Servidor local do guardIAn (Fastify + SQLite/Drizzle + SDK TypeSafe). Recebe prompts do hook, aplica as regras, consulta o JEV, persiste e transmite eventos via SSE. Serve também a UI compilada.

Arquitetura: `vault/03_ARCHITECTURE/ARCHITECTURE.md`. Implementação: Fases 4–5.

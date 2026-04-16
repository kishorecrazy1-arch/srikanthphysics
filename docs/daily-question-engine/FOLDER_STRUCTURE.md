# Daily Question Engine — layout

| Area | Path |
|------|------|
| **DB migration (Supabase / Postgres)** | `supabase/migrations/20260420190000_daily_question_engine.sql` |
| **FastAPI service** | `python/daily_question_engine/` (see `README.md` there) |
| **TS types + prompt mirror** | `src/dailyEngine/types.ts`, `src/dailyEngine/promptBuilder.ts` |
| **Admin UI** | `src/pages/admin/MultiSyllabusDailyEngine.tsx` → route `/admin/daily-question-engine` |
| **Vite dev proxy** | `vite.config.ts` → `/daily-engine-api` → `http://127.0.0.1:8000` |
| **Sample HTTP JSON** | `docs/daily-question-engine/sample-api-response.json` |

Apply the SQL migration in the Supabase SQL editor or `supabase db push` before starting the Python API.

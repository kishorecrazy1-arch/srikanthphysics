# Daily Question Engine (FastAPI)

Multi-syllabus AI MCQ generator for Srikanth’s Academy. Works alongside the existing Vite + Supabase React app.

## Folder structure

```
python/daily_question_engine/
├── README.md                 ← this file
├── requirements.txt
├── pyproject.toml            ← Vercel FastAPI entry (`app = app.main:app`) + deps
├── .env                      ← copy from .env.example (not committed)
├── .env.example
├── run.py                    ← pointer / dev note
└── app/
    ├── __init__.py
    ├── main.py               ← FastAPI app + CORS
    ├── config.py             ← pydantic-settings (DATABASE_URL, ANTHROPIC_*)
    ├── db.py                 ← SQLAlchemy + hash dedupe helpers
    ├── prompt_builder.py     ← reusable MCQ prompt text
    ├── routers/
    │   ├── catalog.py        ← GET syllabus tree
    │   ├── generate.py       ← POST /v1/generate (Anthropic → JSON → inserts)
    │   └── questions.py      ← GET /v1/questions
    └── services/
        └── json_extract.py   ← tolerant JSON parse from model output
```

Related repo files:

- `render.yaml` (repo root) — optional **Render** Web Service blueprint (monorepo `rootDir`); skip if you use Vercel Python below
- `supabase/migrations/20260420190000_daily_question_engine.sql` — `dqe_*` tables + seed catalog
- `src/dailyEngine/` — TypeScript types + prompt mirror for future in-app generation
- `src/pages/admin/MultiSyllabusDailyEngine.tsx` — admin UI (cascading selects + generate)
- `docs/daily-question-engine/sample-api-response.json` — example payload

## Database (`dqe_*` tables)

Logical mapping to your spec:

| Spec name       | Physical table      |
|----------------|---------------------|
| syllabus       | `dqe_syllabus`      |
| subjects       | `dqe_subject`       |
| topics         | `dqe_topic`         |
| subtopics      | `dqe_subtopic`      |
| questions      | `dqe_question`      |
| daily_schedule | `dqe_daily_schedule`|

Dedupe: `UNIQUE (subtopic_id, content_hash, generated_for_date)` where `content_hash = SHA256(subtopic_id + "|" + normalized_stem)`.

## Run locally

```bash
cd python/daily_question_engine
python -m venv .venv
.\.venv\Scripts\activate   # Windows
pip install -r requirements.txt
copy .env.example .env    # then edit DATABASE_URL + ANTHROPIC_API_KEY
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health: `GET http://localhost:8000/health`

## Production: AI generation on the live site

The **React app on Vercel** starts AI jobs by calling your **FastAPI** service. You can host that service on **Vercel (Python)** or on **Render** / any other URL — the main site only needs **`DAILY_ENGINE_URL`** (see below).

### Engine env (every host)

| Variable | Purpose |
|----------|--------|
| `DATABASE_URL` | Supabase **Postgres** URI (same DB as the app). |
| `ANTHROPIC_API_KEY` | Anthropic secret (generation runs here). |
| `ANTHROPIC_MODEL` | Optional; defaults in `app/config.py`. |
| `CORS_ORIGINS` | Only if the **browser** calls the engine host directly. Not needed if you use **`DAILY_ENGINE_URL`** + `/api/daily-engine` on the main Vercel project. |

Check: `GET https://YOUR-ENGINE-URL/health` → JSON `{"status":"ok",...}`. Opening `/` returns a small JSON pointer (not “Not Found”).

### Option A — Host the engine on Vercel (no Render)

[Vercel supports FastAPI](https://vercel.com/docs/frameworks/backend/fastapi) as Python Functions. This folder includes **`pyproject.toml`** with `[project.scripts] app = "app.main:app"` so Vercel finds the ASGI app.

1. In Vercel → **Add New Project** → same GitHub repo as the site (a **second** project is easiest).
2. **Root Directory:** `python/daily_question_engine`
3. This folder includes **`vercel.json`** so Vercel does **not** inherit the repo root’s **Vite** `npm run build` (which caused `vite: command not found`). Commit/push it, then redeploy.
4. Set the engine env vars above (`DATABASE_URL`, `ANTHROPIC_API_KEY`, …) on **this** project → **Deploy**.
5. Copy the deployment URL (e.g. `https://daily-question-engine-xxx.vercel.app`).

**Limits:** Vercel runs **serverless** functions — huge **daily-batch** runs may hit **timeout** on lower plans; single **Generate** is usually fine. For always-on or very long jobs, use Railway / Fly / a VPS instead.

### Option B — Host the engine on Render (`render.yaml`)

**Blueprint:** Render → **New** → **Blueprint** → connect repo → set secrets when prompted.

**Manual Web Service:** Root `python/daily_question_engine`, build `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, health `/health`. Starter plan avoids free-tier sleep for admin use.

### Point the main Vite site (first Vercel project) at the engine

1. **Settings → Environment Variables** on the **frontend** project.
2. **`DAILY_ENGINE_URL`** (server-only) = your engine base URL (Vercel Python **or** Render **or** anything else) — no trailing `/`, no `/v1`.  
   The admin UI uses **`/api/daily-engine/...`**; a serverless route forwards there after Supabase session check. Ensure **`SUPABASE_URL`** + **`SUPABASE_SERVICE_ROLE_KEY`** (or anon) exist so the proxy can validate JWTs.
3. **Optional:** **`VITE_DAILY_ENGINE_API`** = same engine URL only if you want the **browser** to call the engine directly (then set **`CORS_ORIGINS`** on the engine host).
4. **Redeploy** the frontend after env changes.

### Use it

1. Open **`/admin/daily-question-engine`** while logged in.
2. Generate or run **daily batch** as before.

If you see **CORS** errors, you are using **`VITE_DAILY_ENGINE_API`** without matching **`CORS_ORIGINS`** on the engine — prefer **`DAILY_ENGINE_URL`** + proxy.

## HTTP API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/catalog/syllabi` | List syllabi |
| GET | `/v1/catalog/subjects?syllabus_id=<uuid>` | Subjects |
| GET | `/v1/catalog/topics?subject_id=<uuid>` | Topics |
| GET | `/v1/catalog/subtopics?topic_id=<uuid>` | Subtopics |
| POST | `/v1/generate` | Body JSON → generate + insert (one subtopic) |
| POST | `/v1/generate/daily-batch` | Walk many subtopics (all syllabi or one `syllabus_slug`); fills each up to `count` for `for_date` when `only_missing` is true |
| GET | `/v1/questions?subtopic_id=<uuid>&for_date=YYYY-MM-DD` | List stored questions |

### `POST /v1/generate` body

```json
{
  "subtopic_id": "uuid",
  "difficulty": "medium",
  "count": 7,
  "for_date": "2026-04-20"
}
```

### `POST /v1/generate/daily-batch` body

Runs the same generator as `/v1/generate` **sequentially** for up to `max_subtopics` subtopics (ordered across the catalog). Use a **hosted** engine URL + cron for unattended daily content.

```json
{
  "for_date": "2026-04-20",
  "difficulty": "medium",
  "count": 7,
  "syllabus_slug": null,
  "only_missing": true,
  "max_subtopics": 25
}
```

- **`syllabus_slug`**: omit or `null` for **all** syllabi; or e.g. `"foundation_math_science"` for one program.
- **`only_missing`**: when `true`, only subtopics with **fewer than `count`** `dqe_question` rows for `for_date` are selected (top-up behavior).
- **`max_subtopics`**: safety cap per request (1–150). Run multiple times or raise on a long-timeout worker to cover the full tree.

### Sample success JSON

See `docs/daily-question-engine/sample-api-response.json`.

## Cron / scheduler

Example Windows Task Scheduler / Linux cron calling the HTTP runner (engine must be listening):

```bash
cd python/daily_question_engine
.\.venv\Scripts\python -m app.jobs.daily --base-url http://127.0.0.1:8000 --subtopic-id <UUID> --difficulty medium --count 7
```

`app/jobs/daily.py` uses `urllib` (no extra deps). For production, point `--base-url` at your deployed API or call the generate logic in-process from a worker.

## Future-ready hooks (not implemented yet)

- **PYQs:** add `dqe_question.source = 'pyq'` + `exam_year`, `paper_code`.
- **Adaptive difficulty:** store per-user skill estimates; pass `difficulty` distribution into prompt.
- **Performance:** join `dqe_question` attempts in a new `dqe_attempt` table keyed by `user_id`.

## AI provider note

This service uses **Anthropic** (matches your existing `@anthropic-ai/sdk` usage). OpenAI can be added behind the same `prompt_builder` with a thin `llm_client` interface.

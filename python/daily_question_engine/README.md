# Daily Question Engine (FastAPI)

Multi-syllabus AI MCQ generator for Srikanth’s Academy. Works alongside the existing Vite + Supabase React app.

## Folder structure

```
python/daily_question_engine/
├── README.md                 ← this file
├── requirements.txt
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

- `render.yaml` (repo root) — **Render** Web Service blueprint for this engine (monorepo `rootDir`)
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

## Production: AI generation on the live site (Vercel + Render)

The **React app on Vercel** only starts AI jobs by calling your **FastAPI** service. This project is set up to host that service on **Render** (see `render.yaml` at the repo root).

### Step 1 — Deploy the engine on Render

**Option A — Blueprint (recommended)**  
1. Push this repo to GitHub (including `render.yaml`).  
2. In [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.  
3. Connect the repo; Render should detect `render.yaml` and propose a **Web Service** named `daily-question-engine`.  
4. Create the blueprint. When prompted, set **secret** environment variables (see Step 2).

**Option B — Manual Web Service**  
1. **New** → **Web Service** → connect the same repo.  
2. **Root Directory:** `python/daily_question_engine`  
3. **Build Command:** `pip install -r requirements.txt`  
4. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`  
   (`PORT` is provided by Render.)  
5. **Health Check Path:** `/health`  

Use at least the **Starter** plan if you need the service to stay awake for admin generation (free tier can spin down after idle).

### Step 2 — Environment variables on Render

| Variable | Purpose |
|----------|--------|
| `DATABASE_URL` | Supabase **Postgres** connection string (same DB as the app; use SSL URI from Supabase dashboard). |
| `ANTHROPIC_API_KEY` | Your Anthropic secret key (the engine calls the API from here). |
| `ANTHROPIC_MODEL` | Optional; defaults in `app/config.py` if unset. |
| `CORS_ORIGINS` | **Required for the browser:** include your live origins, e.g. `https://www.srikanthsacademy.com,https://srikanthsacademy.com` (no spaces). |

Check: open `https://YOUR-ENGINE-URL/health` in a browser; you should see JSON `{"status":"ok",...}`.

### Step 3 — Point the frontend at the engine (Vercel)

1. Vercel → your project → **Settings → Environment Variables**.
2. Add **`VITE_DAILY_ENGINE_API`** = your Render service URL **only**, e.g. `https://daily-question-engine.onrender.com`  
   - **No** trailing slash.  
   - **No** `/v1` suffix (the app appends `/v1/generate`, etc.).
3. **Redeploy** the site so Vite bakes the value into the build.

### Step 4 — Use it

1. Open **`/admin/daily-question-engine`** on the live site (while logged in).
2. Pick syllabus → subtopic, set date/count, click **Generate daily questions**, or use **Run daily batch** for many subtopics (still hits the same engine).

If the button does nothing or the network tab shows **CORS errors**, fix `CORS_ORIGINS` on the engine host and redeploy the engine.

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

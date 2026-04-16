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

## HTTP API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/catalog/syllabi` | List syllabi |
| GET | `/v1/catalog/subjects?syllabus_id=<uuid>` | Subjects |
| GET | `/v1/catalog/topics?subject_id=<uuid>` | Topics |
| GET | `/v1/catalog/subtopics?topic_id=<uuid>` | Subtopics |
| POST | `/v1/generate` | Body JSON → generate + insert |
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

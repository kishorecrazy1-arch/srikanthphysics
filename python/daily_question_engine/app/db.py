from __future__ import annotations

import hashlib
import json
from contextlib import contextmanager
from typing import Any, Generator, Iterable, Mapping

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Connection, Engine

from .config import settings


def _engine() -> Engine:
    if not settings.database_url:
        raise RuntimeError("DATABASE_URL is not set (use your Supabase Postgres connection string).")
    return create_engine(settings.database_url, pool_pre_ping=True)


@contextmanager
def get_connection() -> Generator[Connection, None, None]:
    eng = _engine()
    with eng.begin() as conn:
        yield conn


def content_hash(stem: str, subtopic_id: str) -> str:
    raw = (subtopic_id.strip().lower() + "|" + stem.strip().lower()).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def fetch_all(conn: Connection, sql: str, params: Mapping[str, Any] | None = None) -> list[dict[str, Any]]:
    result = conn.execute(text(sql), params or {})
    cols = result.keys()
    return [dict(zip(cols, row)) for row in result.fetchall()]


def fetch_one(conn: Connection, sql: str, params: Mapping[str, Any] | None = None) -> dict[str, Any] | None:
    rows = fetch_all(conn, sql, params)
    return rows[0] if rows else None


def insert_questions(
    conn: Connection,
    rows: Iterable[dict[str, Any]],
) -> int:
    sql = text(
        """
        INSERT INTO public.dqe_question (
          syllabus_id, subject_id, topic_id, subtopic_id,
          difficulty, question_text, options, correct_answer, explanation,
          concept_tag, content_hash, generated_for_date, ai_provider
        ) VALUES (
          :syllabus_id, :subject_id, :topic_id, :subtopic_id,
          :difficulty, :question_text, CAST(:options AS jsonb), :correct_answer, CAST(:explanation AS jsonb),
          :concept_tag, :content_hash, :generated_for_date, :ai_provider
        )
        ON CONFLICT (subtopic_id, content_hash, generated_for_date) DO NOTHING
        """
    )
    n = 0
    for r in rows:
        conn.execute(sql, r)
        n += 1
    return n


def explanation_json(steps: list[str], concept: str | None) -> str:
    payload = {
        "steps": [{"title": f"Step {i+1}", "content": s} for i, s in enumerate(steps)],
        "keyConcept": concept or "",
        "relatedFormulas": [],
    }
    return json.dumps(payload)


def options_json(opts: dict[str, str], correct_letter: str) -> str:
    c = correct_letter.upper().strip()[:1]
    arr = [{"id": k, "text": v, "isCorrect": (k == c)} for k, v in sorted(opts.items())]
    return json.dumps(arr)

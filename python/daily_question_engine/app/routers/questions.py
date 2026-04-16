from __future__ import annotations

from fastapi import APIRouter, Query

from ..db import fetch_all, get_connection

router = APIRouter()


@router.get("/questions")
def list_questions(
    subtopic_id: str = Query(...),
    for_date: str | None = Query(None, description="YYYY-MM-DD; omit for all dates"),
):
    with get_connection() as conn:
        if for_date:
            return fetch_all(
                conn,
                """
                SELECT id::text, syllabus_id::text, subject_id::text, topic_id::text, subtopic_id::text,
                       difficulty, question_text, options, correct_answer, explanation, concept_tag,
                       generated_for_date::text, ai_provider, created_at
                FROM public.dqe_question
                WHERE subtopic_id = CAST(:st AS uuid) AND generated_for_date = CAST(:fd AS date)
                ORDER BY created_at DESC
                """,
                {"st": subtopic_id, "fd": for_date},
            )
        return fetch_all(
            conn,
            """
            SELECT id::text, syllabus_id::text, subject_id::text, topic_id::text, subtopic_id::text,
                   difficulty, question_text, options, correct_answer, explanation, concept_tag,
                   generated_for_date::text, ai_provider, created_at
            FROM public.dqe_question
            WHERE subtopic_id = CAST(:st AS uuid)
            ORDER BY generated_for_date DESC NULLS LAST, created_at DESC
            LIMIT 200
            """,
            {"st": subtopic_id},
        )

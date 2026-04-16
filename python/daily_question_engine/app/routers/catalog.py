from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from ..db import fetch_all, get_connection

router = APIRouter()


@router.get("/syllabi")
def get_syllabi():
    with get_connection() as conn:
        return fetch_all(
            conn,
            """
            SELECT id::text, slug, name, kind, display_order, created_at
            FROM public.dqe_syllabus
            ORDER BY display_order, name
            """,
        )


@router.get("/subjects")
def get_subjects(syllabus_id: str = Query(..., description="UUID of dqe_syllabus")):
    with get_connection() as conn:
        return fetch_all(
            conn,
            """
            SELECT id::text, syllabus_id::text, name, slug, display_order, created_at
            FROM public.dqe_subject
            WHERE syllabus_id = CAST(:sid AS uuid)
            ORDER BY display_order, name
            """,
            {"sid": syllabus_id},
        )


@router.get("/topics")
def get_topics(subject_id: str = Query(..., description="UUID of dqe_subject")):
    with get_connection() as conn:
        return fetch_all(
            conn,
            """
            SELECT id::text, subject_id::text, name, slug, display_order, created_at
            FROM public.dqe_topic
            WHERE subject_id = CAST(:subid AS uuid)
            ORDER BY display_order, name
            """,
            {"subid": subject_id},
        )


@router.get("/subtopics")
def get_subtopics(topic_id: str = Query(..., description="UUID of dqe_topic")):
    with get_connection() as conn:
        return fetch_all(
            conn,
            """
            SELECT id::text, topic_id::text, name, slug, display_order, created_at
            FROM public.dqe_subtopic
            WHERE topic_id = CAST(:tid AS uuid)
            ORDER BY display_order, name
            """,
            {"tid": topic_id},
        )

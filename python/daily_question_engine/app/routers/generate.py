from __future__ import annotations



from datetime import datetime, timezone



import anthropic

from fastapi import APIRouter, HTTPException

from pydantic import BaseModel, Field, field_validator

from sqlalchemy import text



from ..config import settings

from ..db import (

    content_hash,

    explanation_json,

    fetch_all,

    fetch_one,

    get_connection,

    insert_questions,

    options_json,

)

from ..prompt_builder import build_daily_mcq_user_message, build_system_preamble

from ..services.json_extract import extract_json_object



router = APIRouter()





class GenerateBody(BaseModel):

    subtopic_id: str

    difficulty: str = Field(default="medium")

    count: int = Field(default=5, ge=5, le=10)

    for_date: str | None = None  # YYYY-MM-DD; default UTC today



    @field_validator("difficulty")

    @classmethod

    def _diff(cls, v: str) -> str:

        x = (v or "medium").lower().strip()

        if x not in ("easy", "medium", "hard"):

            raise ValueError("difficulty must be easy, medium, or hard")

        return x





class DailyBatchBody(BaseModel):

    """Generate MCQs for many subtopics in one request (sequential Anthropic calls)."""



    for_date: str | None = None

    difficulty: str = Field(default="medium")

    count: int = Field(default=7, ge=5, le=10)

    syllabus_slug: str | None = Field(

        default=None,

        description="If set, only subtopics under this dqe_syllabus.slug (e.g. foundation_math_science).",

    )

    only_missing: bool = Field(

        default=True,

        description="If true, only subtopics with fewer than `count` questions for for_date.",

    )

    max_subtopics: int = Field(default=25, ge=1, le=150, description="Safety cap per HTTP request.")



    @field_validator("difficulty")

    @classmethod

    def _diff_batch(cls, v: str) -> str:

        x = (v or "medium").lower().strip()

        if x not in ("easy", "medium", "hard"):

            raise ValueError("difficulty must be easy, medium, or hard")

        return x





def _fail_schedule(subtopic_id: str, for_d: str, err: str) -> None:

    try:

        with get_connection() as conn:

            conn.execute(

                text(

                    """

                    UPDATE public.dqe_daily_schedule

                    SET status = 'failed', completed_at = now(), error_message = :err

                    WHERE subtopic_id = CAST(:st AS uuid) AND for_date = CAST(:fd AS date)

                    """

                ),

                {"st": subtopic_id, "fd": for_d, "err": err[:2000]},

            )

    except Exception:  # noqa: BLE001

        pass





def _subtopic_ids_for_daily_batch(

    conn,

    *,

    for_date: str,

    syllabus_slug: str | None,

    only_missing: bool,

    target_count: int,

    max_subtopics: int,

) -> list[str]:

    params: dict[str, object] = {"for_date": for_date, "target": target_count, "lim": max_subtopics}

    syllabus_clause = ""

    if syllabus_slug:

        syllabus_clause = "AND y.slug = :slug"

        params["slug"] = syllabus_slug

    missing_clause = ""

    if only_missing:

        missing_clause = """

          AND (

            SELECT COUNT(*)::int FROM public.dqe_question q

            WHERE q.subtopic_id = st.id AND q.generated_for_date = CAST(:for_date AS date)

          ) < :target

        """

    sql = f"""

        SELECT st.id::text AS subtopic_id

        FROM public.dqe_subtopic st

        JOIN public.dqe_topic t ON t.id = st.topic_id

        JOIN public.dqe_subject s ON s.id = t.subject_id

        JOIN public.dqe_syllabus y ON y.id = s.syllabus_id

        WHERE 1=1

        {syllabus_clause}

        {missing_clause}

        ORDER BY y.display_order, s.display_order, t.display_order, st.display_order

        LIMIT :lim

    """

    rows = fetch_all(conn, sql, params)

    return [str(r["subtopic_id"]) for r in rows]





def generate_questions_inner(body: GenerateBody) -> dict:

    """Core implementation for one subtopic (used by /generate and /generate/daily-batch)."""

    if not settings.anthropic_api_key:

        raise HTTPException(500, "ANTHROPIC_API_KEY is not configured on the engine.")



    for_d = body.for_date or datetime.now(timezone.utc).date().isoformat()



    with get_connection() as conn:

        ctx = fetch_one(

            conn,

            """

            SELECT

              st.id::text AS subtopic_id,

              t.id::text AS topic_id,

              s.id::text AS subject_id,

              y.id::text AS syllabus_id,

              st.name AS subtopic_name,

              t.name AS topic_name,

              s.name AS subject_name,

              y.name AS syllabus_name

            FROM public.dqe_subtopic st

            JOIN public.dqe_topic t ON t.id = st.topic_id

            JOIN public.dqe_subject s ON s.id = t.subject_id

            JOIN public.dqe_syllabus y ON y.id = s.syllabus_id

            WHERE st.id = CAST(:st AS uuid)

            """,

            {"st": body.subtopic_id},

        )

        if not ctx:

            raise HTTPException(404, "subtopic_id not found")



        conn.execute(

            text(

                """

                INSERT INTO public.dqe_daily_schedule (

                  syllabus_id, subject_id, topic_id, subtopic_id, for_date, question_count, status

                ) VALUES (

                  CAST(:syllabus_id AS uuid),

                  CAST(:subject_id AS uuid),

                  CAST(:topic_id AS uuid),

                  CAST(:subtopic_id AS uuid),

                  CAST(:for_date AS date),

                  :count,

                  'running'

                )

                ON CONFLICT (subtopic_id, for_date) DO UPDATE

                SET status = 'running', question_count = EXCLUDED.question_count, error_message = NULL

                """

            ),

            {

                "syllabus_id": ctx["syllabus_id"],

                "subject_id": ctx["subject_id"],

                "topic_id": ctx["topic_id"],

                "subtopic_id": ctx["subtopic_id"],

                "for_date": for_d,

                "count": body.count,

            },

        )



    user_msg = build_daily_mcq_user_message(

        syllabus_name=ctx["syllabus_name"],

        subject_name=ctx["subject_name"],

        topic_name=ctx["topic_name"],

        subtopic_name=ctx["subtopic_name"],

        difficulty=body.difficulty,

        count=body.count,

    )



    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    resp = client.messages.create(

        model=settings.anthropic_model,

        max_tokens=8192,

        temperature=0.35,

        system=build_system_preamble(),

        messages=[{"role": "user", "content": user_msg}],

    )

    raw = "".join(getattr(b, "text", "") for b in resp.content)

    try:

        payload = extract_json_object(raw)

    except Exception as e:  # noqa: BLE001

        _fail_schedule(ctx["subtopic_id"], for_d, str(e))

        raise HTTPException(502, f"Model did not return valid JSON: {e}") from e



    items = payload.get("questions")

    if not isinstance(items, list) or not items:

        _fail_schedule(ctx["subtopic_id"], for_d, "Empty questions array")

        raise HTTPException(502, "Model JSON missing 'questions' array")



    rows = []

    out_preview = []

    for q in items:

        try:

            stem = str(q["question_text"]).strip()

            opts = {k: str(q["options"][k]).strip() for k in ("A", "B", "C", "D")}

            ans = str(q["correct_answer"]).strip().upper()[:1]

            steps = [str(s).strip() for s in q.get("explanation_steps", []) if str(s).strip()]

            tag = str(q.get("concept_tag") or "").strip() or None

        except Exception as e:  # noqa: BLE001

            _fail_schedule(ctx["subtopic_id"], for_d, str(e))

            raise HTTPException(502, f"Bad question object: {e}") from e



        if ans not in ("A", "B", "C", "D") or ans not in opts:

            _fail_schedule(ctx["subtopic_id"], for_d, "correct_answer not in options")

            raise HTTPException(502, "correct_answer must be A–D matching options keys")



        h = content_hash(stem, ctx["subtopic_id"])

        rows.append(

            {

                "syllabus_id": ctx["syllabus_id"],

                "subject_id": ctx["subject_id"],

                "topic_id": ctx["topic_id"],

                "subtopic_id": ctx["subtopic_id"],

                "difficulty": body.difficulty.lower(),

                "question_text": stem,

                "options": options_json(opts, ans),

                "correct_answer": ans,

                "explanation": explanation_json(steps, tag),

                "concept_tag": tag,

                "content_hash": h,

                "generated_for_date": for_d,

                "ai_provider": "anthropic",

            }

        )

        out_preview.append({"question_text": stem, "correct_answer": ans, "concept_tag": tag})



    with get_connection() as conn:

        insert_questions(conn, rows)

        conn.execute(

            text(

                """

                UPDATE public.dqe_daily_schedule

                SET status = 'completed', completed_at = now(), error_message = NULL

                WHERE subtopic_id = CAST(:st AS uuid) AND for_date = CAST(:fd AS date)

                """

            ),

            {"st": body.subtopic_id, "fd": for_d},

        )



    return {

        "ok": True,

        "subtopic_id": body.subtopic_id,

        "for_date": for_d,

        "requested": body.count,

        "parsed": len(rows),

        "questions": out_preview,

    }





@router.post("/generate")

def generate_questions(body: GenerateBody):

    return generate_questions_inner(body)





@router.post("/generate/daily-batch")

def generate_daily_batch(body: DailyBatchBody):

    """

    Walk subtopics across all syllabi (or one syllabus) and run the same generator as /generate for each.

    Respects `max_subtopics` to avoid timeouts; run cron multiple times or increase cap on a worker host.

    """

    if not settings.anthropic_api_key:

        raise HTTPException(500, "ANTHROPIC_API_KEY is not configured on the engine.")



    for_d = body.for_date or datetime.now(timezone.utc).date().isoformat()



    with get_connection() as conn:

        ids = _subtopic_ids_for_daily_batch(

            conn,

            for_date=for_d,

            syllabus_slug=(body.syllabus_slug.strip() if body.syllabus_slug else None),

            only_missing=body.only_missing,

            target_count=body.count,

            max_subtopics=body.max_subtopics,

        )



    results: list[dict[str, object]] = []

    ok_n = 0

    fail_n = 0

    for sid in ids:

        try:

            r = generate_questions_inner(

                GenerateBody(

                    subtopic_id=sid,

                    difficulty=body.difficulty,

                    count=body.count,

                    for_date=for_d,

                )

            )

            ok_n += 1

            results.append({"subtopic_id": sid, "ok": True, "parsed": r.get("parsed")})

        except HTTPException as e:

            fail_n += 1

            detail = e.detail

            if not isinstance(detail, str):

                detail = str(detail)

            results.append({"subtopic_id": sid, "ok": False, "status": e.status_code, "error": detail})

        except Exception as e:  # noqa: BLE001

            fail_n += 1

            results.append({"subtopic_id": sid, "ok": False, "error": str(e)})



    return {

        "ok": True,

        "for_date": for_d,

        "selected_subtopics": len(ids),

        "succeeded": ok_n,

        "failed": fail_n,

        "only_missing": body.only_missing,

        "syllabus_slug": (body.syllabus_slug or "").strip() or None,

        "results": results,

    }



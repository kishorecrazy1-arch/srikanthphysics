"""
Reusable MCQ prompt for any syllabus path (Anthropic / OpenAI compatible user message).
"""


def build_daily_mcq_user_message(
    *,
    syllabus_name: str,
    subject_name: str,
    topic_name: str,
    subtopic_name: str,
    difficulty: str,
    count: int,
) -> str:
    count = max(5, min(10, int(count)))
    difficulty = difficulty.lower().strip()
    return f"""You are an expert assessment author for {syllabus_name}.

Generate exactly {count} multiple-choice questions for:
- Subject: {subject_name}
- Topic: {topic_name}
- Subtopic: {subtopic_name}
- Difficulty (uniform across all items): {difficulty}

Requirements for EACH question:
- 4 options labeled A, B, C, D (distinct, plausible distractors).
- One clearly correct answer.
- Step-by-step explanation (2–5 short steps) appropriate for the difficulty.
- A short "concept_tag" (e.g. "Conservation of momentum").

Return ONLY valid JSON (no markdown fences) in this exact shape:
{{
  "questions": [
    {{
      "question_text": "string",
      "options": {{ "A": "string", "B": "string", "C": "string", "D": "string" }},
      "correct_answer": "A|B|C|D",
      "explanation_steps": ["string", "string"],
      "concept_tag": "string"
    }}
  ]
}}

Ensure conceptual clarity and exam-level rigor for the listed syllabus."""


def build_system_preamble() -> str:
    return (
        "You output only compact JSON for downstream parsing. "
        "Never include commentary outside the JSON object."
    )

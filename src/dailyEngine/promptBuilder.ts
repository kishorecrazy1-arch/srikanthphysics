/**
 * Reusable MCQ prompt (same semantics as `python/daily_question_engine/app/prompt_builder.py`).
 * Use when calling Anthropic/OpenAI from the browser or a Node serverless function.
 */

export function buildDailyMcqUserMessage(params: {
  syllabusName: string;
  subjectName: string;
  topicName: string;
  subtopicName: string;
  difficulty: string;
  count: number;
}): string {
  const count = Math.min(10, Math.max(5, Math.floor(params.count)));
  const difficulty = params.difficulty.toLowerCase().trim();
  return `You are an expert assessment author for ${params.syllabusName}.

Generate exactly ${count} multiple-choice questions for:
- Subject: ${params.subjectName}
- Topic: ${params.topicName}
- Subtopic: ${params.subtopicName}
- Difficulty (uniform across all items): ${difficulty}

Requirements for EACH question:
- 4 options labeled A, B, C, D (distinct, plausible distractors).
- One clearly correct answer.
- Step-by-step explanation (2–5 short steps) appropriate for the difficulty.
- A short "concept_tag" (e.g. "Conservation of momentum").

Return ONLY valid JSON (no markdown fences) in this exact shape:
{
  "questions": [
    {
      "question_text": "string",
      "options": { "A": "string", "B": "string", "C": "string", "D": "string" },
      "correct_answer": "A|B|C|D",
      "explanation_steps": ["string", "string"],
      "concept_tag": "string"
    }
  ]
}

Ensure conceptual clarity and exam-level rigor for the listed syllabus.`;
}

export function buildSystemPreamble(): string {
  return (
    'You output only compact JSON for downstream parsing. ' +
    'Never include commentary outside the JSON object.'
  );
}

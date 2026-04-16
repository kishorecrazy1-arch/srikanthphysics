/** Fields consumed by `QAQuestionCard` after normalizing Supabase `questions` rows. */
export type QADisplayFields = {
  id: string;
  question_text: string;
  solution_steps: string[];
  final_answer: string;
  explanation: string;
  formulas_used: string[];
  difficulty_level: string;
};

/**
 * Daily Q&A rows in Supabase often store the write-up under `explanation` as an object
 * `{ steps: [{ title, content }], relatedFormulas, keyConcept }`, while `QAQuestionCard`
 * expects `solution_steps: string[]` and/or a string `explanation`. Without this, “Show Answer” opens an empty panel.
 */
export function normalizeDbRowToQAFields(
  q: Record<string, unknown>,
  difficultyLevel: string
): QADisplayFields {
  const question_text =
    (typeof q.question_text === 'string' && q.question_text) ||
    (typeof q.text === 'string' && q.text) ||
    '';

  let solution_steps: string[] = [];
  if (Array.isArray(q.solution_steps)) {
    solution_steps = q.solution_steps.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  } else if (typeof q.solution_steps === 'string' && q.solution_steps.trim()) {
    solution_steps = [q.solution_steps.trim()];
  }

  let formulas_used: string[] = [];
  if (Array.isArray(q.formulas_used)) {
    formulas_used = q.formulas_used.filter((x): x is string => typeof x === 'string');
  }

  let final_answer = typeof q.final_answer === 'string' ? q.final_answer.trim() : '';

  const exp = q.explanation;
  if (exp && typeof exp === 'object' && !Array.isArray(exp)) {
    const o = exp as { steps?: unknown; keyConcept?: unknown; relatedFormulas?: unknown };
    if (solution_steps.length === 0 && Array.isArray(o.steps)) {
      for (const s of o.steps) {
        if (typeof s === 'string' && s.trim()) {
          solution_steps.push(s.trim());
        } else if (s && typeof s === 'object' && 'content' in s) {
          const c = (s as { content?: unknown }).content;
          if (typeof c === 'string' && c.trim()) solution_steps.push(c.trim());
        }
      }
    }
    if (formulas_used.length === 0 && Array.isArray(o.relatedFormulas)) {
      formulas_used = o.relatedFormulas.filter((x): x is string => typeof x === 'string');
    }
    if (!final_answer && typeof o.keyConcept === 'string' && o.keyConcept.trim()) {
      final_answer = o.keyConcept.trim();
    }
  }

  let explanationStr = '';
  if (typeof q.explanation === 'string' && q.explanation.trim()) {
    explanationStr = q.explanation.trim();
  } else if (solution_steps.length > 0) {
    explanationStr = solution_steps.join('\n\n');
  }

  return {
    id: (typeof q.id === 'string' && q.id) || crypto.randomUUID(),
    question_text,
    solution_steps,
    final_answer,
    explanation: explanationStr,
    formulas_used,
    difficulty_level: (typeof q.difficulty_level === 'string' && q.difficulty_level) || difficultyLevel,
  };
}

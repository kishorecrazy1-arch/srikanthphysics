import type { Question as EnhancedQuestion } from '../types/enhanced';

/** DB `questions.options` JSONB: array of { id, text, isCorrect } */
export function optionsRecordToJsonbArray(
  optionsObj: Record<string, string>,
  correctLetter: string
): { id: string; text: string; isCorrect: boolean }[] {
  return (['A', 'B', 'C', 'D'] as const)
    .filter((k) => optionsObj[k] != null && String(optionsObj[k]).trim() !== '')
    .map((id) => ({
      id,
      text: optionsObj[id],
      isCorrect: id === correctLetter.toUpperCase().slice(0, 1),
    }));
}

export function levelStringToLegacyDifficulty(level: string): 'easy' | 'medium' | 'hard' {
  if (level === 'level_2') return 'medium';
  if (level === 'level_3') return 'hard';
  return 'easy';
}

/**
 * Row shape matching `public.questions` from migrations (topic learning + difficulty_level).
 * Uses `subtopic` (text), not `subtopic_id`.
 */
export function buildBasicsMcqSupabaseRow(p: {
  id: string;
  topicId: string;
  subtopicName: string;
  questionText: string;
  optionsObj: Record<string, string>;
  correctLetter: string;
  /** level_1 | level_2 | level_3 — maps to legacy `difficulty` and DB difficulty_level */
  level: string;
  generatedDate: string;
  aiGenerated?: boolean;
  solutionSteps?: string[];
}): Record<string, unknown> {
  const letter = p.correctLetter.toUpperCase().slice(0, 1);
  const steps =
    p.solutionSteps && p.solutionSteps.length > 0
      ? p.solutionSteps.map((content, i) => ({
          title: `Step ${i + 1}`,
          content,
        }))
      : [
          { title: 'Step 1', content: 'Read the problem and identify knowns and unknowns.' },
          { title: 'Step 2', content: `Apply the relevant physics for ${p.subtopicName}.` },
          { title: 'Step 3', content: 'Solve and check units.' },
        ];

  return {
    id: p.id,
    topic_id: p.topicId,
    segment_type: 'basics',
    question_text: p.questionText,
    options: optionsRecordToJsonbArray(p.optionsObj, letter),
    difficulty: levelStringToLegacyDifficulty(p.level),
    question_type: 'calculation',
    subtopic: p.subtopicName,
    explanation: {
      steps,
      keyConcept: p.subtopicName,
      relatedFormulas: [] as string[],
    },
    ai_generated: p.aiGenerated ?? false,
    generated_date: p.generatedDate,
    // Prefer DB constraint values from migrations (level_1/2/3); queries also accept legacy labels
    difficulty_level: p.level === 'level_3' ? 'level_3' : p.level === 'level_2' ? 'level_2' : 'level_1',
  };
}

export function buildBasicsMcqRowFromEnhanced(
  q: EnhancedQuestion,
  topicId: string,
  subtopicName: string,
  generatedDate: string
): Record<string, unknown> {
  const optionsObj: Record<string, string> = { ...(q.content?.options || {}) };
  const rawCorrect = q.solution?.final_answer;
  let correctLetter =
    typeof rawCorrect === 'string' && /^[A-D]$/i.test(rawCorrect.trim())
      ? rawCorrect.trim().toUpperCase().slice(0, 1)
      : 'A';
  if (Object.keys(optionsObj).length > 0 && !optionsObj[correctLetter]) {
    correctLetter = (Object.keys(optionsObj)[0] || 'A').toUpperCase().slice(0, 1);
  }

  const levelFromDifficulty: Record<string, string> = {
    Foundation: 'level_1',
    Intermediate: 'level_2',
    Advanced: 'level_3',
  };
  const level = levelFromDifficulty[q.difficulty_level] || 'level_1';

  return buildBasicsMcqSupabaseRow({
    id: q.id,
    topicId,
    subtopicName,
    questionText: q.content?.text || '',
    optionsObj,
    correctLetter,
    level,
    generatedDate,
    aiGenerated: true,
    solutionSteps: q.solution?.steps || [],
  });
}

import type { SupabaseClient } from '@supabase/supabase-js';

export type BasicsLevel = 'level_1' | 'level_2' | 'level_3';

/** Same difficulty labels / DB variants as `BasicsSection` “Daily Questions”. */
export function homeworkDifficultyVariantsForLevel(selectedLevel: BasicsLevel): string[] {
  const difficultyMap: Record<BasicsLevel, string> = {
    level_1: 'Foundation',
    level_2: 'Intermediate',
    level_3: 'Advanced',
  };
  const difficultyLevel = difficultyMap[selectedLevel] || 'Intermediate';
  if (difficultyLevel === 'Foundation') return [difficultyLevel, 'level_1'];
  if (difficultyLevel === 'Intermediate') return [difficultyLevel, 'level_2'];
  return [difficultyLevel, 'level_3'];
}

export function difficultyLabelForLevel(selectedLevel: BasicsLevel): string {
  if (selectedLevel === 'level_1') return 'Foundation';
  if (selectedLevel === 'level_2') return 'Intermediate';
  return 'Advanced';
}

export type ApHomeworkQaFetchResult = {
  rows: Record<string, unknown>[];
  /** True when no rows existed for `generated_date = todayIso` and older rows were returned. */
  usedRecentFallback: boolean;
};

/**
 * Same Supabase filter as AP Physics topic → Basics → “Daily Questions” (homework / application).
 * Prefers `generated_date = today`; if none, returns the most recent set for that subtopic (read-only).
 */
export async function fetchApHomeworkQaPool(
  client: SupabaseClient,
  topicId: string,
  subtopicName: string,
  todayIso: string,
  difficultyVariants: string[]
): Promise<ApHomeworkQaFetchResult> {
  const base = () =>
    client
      .from('questions')
      .select('*')
      .eq('topic_id', topicId)
      .eq('segment_type', 'homework')
      .eq('question_type', 'application')
      .in('difficulty_level', difficultyVariants)
      .eq('subtopic', subtopicName);

  const { data: todayRows, error: e1 } = await base()
    .eq('generated_date', todayIso)
    .order('created_at', { ascending: true })
    .limit(40);

  if (e1) throw e1;
  if (todayRows && todayRows.length > 0) {
    return { rows: todayRows as Record<string, unknown>[], usedRecentFallback: false };
  }

  const { data: anyRows, error: e2 } = await base()
    .order('created_at', { ascending: false })
    .limit(40);

  if (e2) throw e2;
  const rows = (anyRows || []) as Record<string, unknown>[];
  return { rows, usedRecentFallback: rows.length > 0 };
}

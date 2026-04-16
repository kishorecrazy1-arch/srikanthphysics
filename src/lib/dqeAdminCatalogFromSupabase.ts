import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  DailyDifficulty,
  DqeQuestionRow,
  DqeSubject,
  DqeSubtopic,
  DqeSyllabus,
  DqeTopic,
  McqOptionRow,
  SyllabusKind,
} from '../dailyEngine/types';

function asSyllabusKind(v: string): SyllabusKind {
  if (v === 'ap' || v === 'iit_jee' || v === 'cbse' || v === 'neet' || v === 'foundation') return v;
  return 'ap';
}

export async function adminDqeFetchSyllabi(client: SupabaseClient): Promise<DqeSyllabus[]> {
  const { data, error } = await client
    .from('dqe_syllabus')
    .select('id, slug, name, kind, display_order, created_at')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return (data || []).map((r) => ({
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    kind: asSyllabusKind(String(r.kind)),
    display_order: Number(r.display_order ?? 0),
    created_at: r.created_at != null ? String(r.created_at) : undefined,
  }));
}

export async function adminDqeFetchSubjects(client: SupabaseClient, syllabusId: string): Promise<DqeSubject[]> {
  const { data, error } = await client
    .from('dqe_subject')
    .select('id, syllabus_id, name, slug, display_order, created_at')
    .eq('syllabus_id', syllabusId)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return (data || []).map((r) => ({
    id: String(r.id),
    syllabus_id: String(r.syllabus_id),
    name: String(r.name),
    slug: String(r.slug),
    display_order: Number(r.display_order ?? 0),
    created_at: r.created_at != null ? String(r.created_at) : undefined,
  }));
}

export async function adminDqeFetchTopics(client: SupabaseClient, subjectId: string): Promise<DqeTopic[]> {
  const { data, error } = await client
    .from('dqe_topic')
    .select('id, subject_id, name, slug, display_order, created_at')
    .eq('subject_id', subjectId)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return (data || []).map((r) => ({
    id: String(r.id),
    subject_id: String(r.subject_id),
    name: String(r.name),
    slug: String(r.slug),
    display_order: Number(r.display_order ?? 0),
    created_at: r.created_at != null ? String(r.created_at) : undefined,
  }));
}

export async function adminDqeFetchSubtopics(client: SupabaseClient, topicId: string): Promise<DqeSubtopic[]> {
  const { data, error } = await client
    .from('dqe_subtopic')
    .select('id, topic_id, name, slug, display_order, created_at')
    .eq('topic_id', topicId)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw error;
  return (data || []).map((r) => ({
    id: String(r.id),
    topic_id: String(r.topic_id),
    name: String(r.name),
    slug: String(r.slug),
    display_order: Number(r.display_order ?? 0),
    created_at: r.created_at != null ? String(r.created_at) : undefined,
  }));
}

function normalizeMcqOptions(raw: unknown, correctLetter: string): McqOptionRow[] {
  const correct = correctLetter.trim().toUpperCase();
  if (Array.isArray(raw)) {
    return raw.map((o) => {
      if (!o || typeof o !== 'object') return { id: '?', text: '', isCorrect: false };
      const id = String((o as { id?: string }).id || '')
        .trim()
        .toUpperCase();
      const text = String((o as { text?: string }).text || '').trim();
      const isCorrect =
        Boolean((o as { isCorrect?: boolean }).isCorrect) || (correct.length === 1 && id === correct);
      return { id: id || '?', text, isCorrect };
    });
  }
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    return (['A', 'B', 'C', 'D'] as const).map((id) => ({
      id,
      text: String(o[id] ?? o[id.toLowerCase()] ?? '').trim(),
      isCorrect: id === correct,
    }));
  }
  return [];
}

export async function adminDqeFetchQuestions(
  client: SupabaseClient,
  subtopicId: string,
  forDate: string
): Promise<DqeQuestionRow[]> {
  const { data, error } = await client
    .from('dqe_question')
    .select(
      'id, syllabus_id, subject_id, topic_id, subtopic_id, difficulty, question_text, options, correct_answer, explanation, concept_tag, generated_for_date, ai_provider, created_at'
    )
    .eq('subtopic_id', subtopicId)
    .eq('generated_for_date', forDate)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((r) => {
    const correct = String((r as { correct_answer?: string }).correct_answer || '').trim();
    const diff = String((r as { difficulty?: string }).difficulty || 'medium').toLowerCase();
    const difficulty: DailyDifficulty =
      diff === 'easy' || diff === 'hard' || diff === 'medium' ? diff : 'medium';
    const opts = normalizeMcqOptions((r as { options?: unknown }).options, correct);
    return {
      id: String((r as { id: string }).id),
      syllabus_id: String((r as { syllabus_id: string }).syllabus_id),
      subject_id: (r as { subject_id: string | null }).subject_id != null ? String((r as { subject_id: string }).subject_id) : null,
      topic_id: (r as { topic_id: string | null }).topic_id != null ? String((r as { topic_id: string }).topic_id) : null,
      subtopic_id: (r as { subtopic_id: string | null }).subtopic_id != null ? String((r as { subtopic_id: string }).subtopic_id) : null,
      difficulty,
      question_text: String((r as { question_text?: string }).question_text || ''),
      options: opts,
      correct_answer: correct,
      explanation: (r as { explanation?: unknown }).explanation ?? null,
      concept_tag:
        (r as { concept_tag: string | null }).concept_tag != null
          ? String((r as { concept_tag: string }).concept_tag)
          : null,
      generated_for_date:
        (r as { generated_for_date: string | null }).generated_for_date != null
          ? String((r as { generated_for_date: string }).generated_for_date)
          : null,
      ai_provider:
        (r as { ai_provider: string | null }).ai_provider != null
          ? String((r as { ai_provider: string }).ai_provider)
          : null,
      created_at:
        (r as { created_at?: string }).created_at != null ? String((r as { created_at: string }).created_at) : undefined,
    };
  });
}

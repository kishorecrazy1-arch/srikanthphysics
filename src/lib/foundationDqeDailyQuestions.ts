import type { SupabaseClient } from '@supabase/supabase-js';
import { normalizeMcqCorrectLetter } from './mcqAnswerNormalize';

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;

export type DqeSubtopicRef = {
  subtopicId: string;
  subtopicName: string;
  subtopicSlug: string;
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  syllabusId: string;
  syllabusName: string;
  syllabusSlug: string;
};

export type GeneratedMcqShape = {
  question: string;
  options: Record<'A' | 'B' | 'C' | 'D', string>;
  correct: string;
  explanation: string;
  difficulty?: string;
  examStyle?: string;
  sourceQuestionId?: string;
};

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function words(s: string): string[] {
  return norm(s)
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function scoreFoundationToDqeRow(unitName: string, foundationTopic: string, row: DqeSubtopicRef): number {
  const ft = words(foundationTopic);
  const fu = words(unitName);
  const blob = norm(`${row.topicName} ${row.subtopicName} ${row.subjectName} ${row.syllabusName}`);
  let score = 0;
  for (const w of ft) {
    if (blob.includes(w)) score += 5;
  }
  for (const w of fu) {
    if (blob.includes(w) && w.length > 4) score += 2;
  }
  const phrasePairs: [RegExp, number][] = [
    [/dimension|si unit|measurement|significant|fundamental|derived|quantity/i, 14],
    [/kinematic|velocity|acceleration|displacement|graph|projectile|motion/i, 12],
    [/newton|force|f\s*=\s*ma|momentum|collision|impulse/i, 12],
    [/work|energy|power|potential|kinetic/i, 10],
    [/torque|rotation|angular|inertia/i, 10],
    [/gravitation|orbit|kepler|satellite/i, 10],
    [/oscillat|shm|pendulum|wave|harmonic/i, 8],
    [/electric|coulomb|field|current|ohm/i, 8],
    [/optics|lens|mirror|light|refraction/i, 8],
    [/heat|thermo|gas|entropy/i, 6],
  ];
  const u = `${unitName} ${foundationTopic}`;
  for (const [re, pts] of phrasePairs) {
    if (re.test(u) && re.test(blob)) score += pts;
  }
  return score;
}

/**
 * All Foundation-kind rows in `dqe_*` (multi-syllabus engine catalog).
 */
export async function fetchFoundationDqeSubtopicCatalog(client: SupabaseClient): Promise<DqeSubtopicRef[]> {
  const { data, error } = await client.from('dqe_subtopic').select(`
      id,
      name,
      slug,
      topic_id,
      topic:dqe_topic (
        id,
        name,
        slug,
        subject:dqe_subject (
          id,
          name,
          slug,
          syllabus:dqe_syllabus (
            id,
            name,
            slug,
            kind
          )
        )
      )
    `);

  if (error) throw error;

  const out: DqeSubtopicRef[] = [];
  for (const row of data || []) {
    const t = row.topic as
      | {
          id: string;
          name: string;
          slug: string;
          subject?: {
            id: string;
            name: string;
            slug: string;
            syllabus?: { id: string; name: string; slug: string; kind: string };
          };
        }
      | null
      | undefined;
    if (!t?.subject?.syllabus) continue;
    const y = t.subject.syllabus;
    if (y.kind !== 'foundation') continue;
    out.push({
      subtopicId: String(row.id),
      subtopicName: String(row.name),
      subtopicSlug: String(row.slug),
      topicId: String(t.id),
      topicName: String(t.name),
      subjectId: String(t.subject.id),
      subjectName: String(t.subject.name),
      syllabusId: String(y.id),
      syllabusName: String(y.name),
      syllabusSlug: String(y.slug),
    });
  }
  return out;
}

export function resolveFoundationToDqeSubtopic(
  unitName: string,
  foundationTopic: string,
  catalog: DqeSubtopicRef[]
): DqeSubtopicRef | null {
  if (catalog.length === 0) return null;
  let best: DqeSubtopicRef | null = null;
  let bestScore = -1;
  for (const row of catalog) {
    const sc = scoreFoundationToDqeRow(unitName, foundationTopic, row);
    if (sc > bestScore) {
      bestScore = sc;
      best = row;
    }
  }
  if (best && bestScore >= 4) return best;
  return null;
}

const SEEN_IDS_CAP = 400;

export function foundationDqeSeenStorageKey(email: string, subtopicId: string, todayIso: string): string {
  const safe = email.replace(/[^a-z0-9@._+-]/gi, '_').slice(0, 120);
  const st = subtopicId.replace(/[^a-z0-9-]/gi, '_').slice(0, 80);
  return `foundation_dqe_seen_${safe}_${st}_${todayIso}`;
}

export function readFoundationDqeSeenSet(storageKey: string): Set<string> {
  if (typeof localStorage === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === 'string' && x.length > 0));
  } catch {
    return new Set();
  }
}

export function rememberFoundationDqeSeenId(storageKey: string, id: string): void {
  if (typeof localStorage === 'undefined' || !id) return;
  const set = readFoundationDqeSeenSet(storageKey);
  set.add(id);
  const arr = [...set];
  const trimmed = arr.length > SEEN_IDS_CAP ? arr.slice(arr.length - SEEN_IDS_CAP) : arr;
  localStorage.setItem(storageKey, JSON.stringify(trimmed));
}

function explanationFromDqeRow(row: Record<string, unknown>): string {
  const exp = row.explanation;
  if (typeof exp === 'string') return exp;
  if (exp && typeof exp === 'object' && !Array.isArray(exp)) {
    const steps = (exp as { steps?: unknown }).steps;
    if (Array.isArray(steps)) {
      return steps
        .map((s) => {
          if (s && typeof s === 'object' && 'content' in s && typeof (s as { content: unknown }).content === 'string') {
            return (s as { content: string }).content;
          }
          if (typeof s === 'string') return s;
          return '';
        })
        .filter(Boolean)
        .join('\n\n');
    }
  }
  return '';
}

export function dqeQuestionRowId(row: Record<string, unknown>): string {
  const id = row.id;
  if (id == null) return '';
  if (typeof id === 'string') return id.trim();
  return String(id).trim();
}

/**
 * Load `dqe_question` rows for a Foundation engine subtopic (today first, then recent).
 * Tries difficulties in order until any rows are returned.
 */
export async function fetchDqeQuestionPoolForSubtopic(
  client: SupabaseClient,
  subtopicId: string,
  todayIso: string
): Promise<Record<string, unknown>[]> {
  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

  for (const difficulty of difficulties) {
    const { data: todayRows, error: e1 } = await client
      .from('dqe_question')
      .select('*')
      .eq('subtopic_id', subtopicId)
      .eq('difficulty', difficulty)
      .eq('generated_for_date', todayIso)
      .order('created_at', { ascending: true })
      .limit(80);
    if (e1) throw e1;
    if (todayRows && todayRows.length > 0) return todayRows as Record<string, unknown>[];

    const { data: anyRows, error: e2 } = await client
      .from('dqe_question')
      .select('*')
      .eq('subtopic_id', subtopicId)
      .eq('difficulty', difficulty)
      .order('created_at', { ascending: false })
      .limit(80);
    if (e2) throw e2;
    if (anyRows && anyRows.length > 0) return anyRows as Record<string, unknown>[];
  }

  return [];
}

/** Map `dqe_question` row → Foundation daily practice card shape */
export function dqeQuestionRowToGeneratedMcq(row: Record<string, unknown>, meta: DqeSubtopicRef): GeneratedMcqShape | null {
  const question =
    (typeof row.question_text === 'string' && row.question_text.trim()) ||
    (typeof row.text === 'string' && row.text.trim()) ||
    '';
  if (!question) return null;

  const options: Record<'A' | 'B' | 'C' | 'D', string> = { A: '', B: '', C: '', D: '' };
  let correct = '';
  const letterFromRow = normalizeMcqCorrectLetter(row.correct_answer ?? row.correctAnswer);

  const rawOpts = row.options;
  if (Array.isArray(rawOpts)) {
    for (const o of rawOpts) {
      if (!o || typeof o !== 'object') continue;
      const id = String((o as { id?: string }).id || '')
        .trim()
        .toUpperCase();
      const text = String((o as { text?: string }).text || '').trim();
      const isCorrect =
        Boolean((o as { isCorrect?: boolean }).isCorrect) ||
        (letterFromRow !== '' && id === letterFromRow);
      if (id === 'A' || id === 'B' || id === 'C' || id === 'D') options[id] = text || `Option ${id}`;
      if (isCorrect && (id === 'A' || id === 'B' || id === 'C' || id === 'D')) correct = id;
    }
    if (!correct && letterFromRow) correct = letterFromRow;
  } else if (rawOpts && typeof rawOpts === 'object' && !Array.isArray(rawOpts)) {
    const o = rawOpts as Record<string, unknown>;
    for (const k of OPTION_KEYS) {
      const v = o[k] ?? o[k.toLowerCase()];
      options[k] = typeof v === 'string' ? v.trim() : '';
    }
    if (letterFromRow) correct = letterFromRow;
  }

  if (!options.A || !options.B || !options.C || !options.D) return null;
  if (!/^[ABCD]$/.test(correct)) return null;

  const dl = row.difficulty;
  const difficulty = typeof dl === 'string' ? dl : undefined;

  const expl = explanationFromDqeRow(row);
  const tag = typeof row.concept_tag === 'string' && row.concept_tag.trim() ? row.concept_tag.trim() : '';

  return {
    question,
    options,
    correct,
    explanation: expl || (tag ? `Key concept: ${tag}` : 'See explanation steps in your course notes.'),
    difficulty: difficulty || 'easy',
    examStyle: meta.syllabusName || 'Foundation',
    sourceQuestionId: dqeQuestionRowId(row) || undefined,
  };
}

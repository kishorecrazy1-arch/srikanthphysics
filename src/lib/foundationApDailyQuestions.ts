import type { SupabaseClient } from '@supabase/supabase-js';
import { normalizeMcqCorrectLetter } from './mcqAnswerNormalize';

export type ApSubtopicRef = {
  topicId: string;
  topicName: string;
  subtopicName: string;
};

export type GeneratedMcq = {
  question: string;
  subQuestions?: string[];
  formulas?: string[];
  options: Record<'A' | 'B' | 'C' | 'D', string>;
  correct: string;
  explanation: string;
  formula?: string;
  difficulty?: string;
  examStyle?: string;
  tip?: string;
  answer?: Record<string, string>;
  /** Supabase row id — used to avoid repeats in one session */
  sourceQuestionId?: string;
};

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;

/** Stable id from a `questions` row (Supabase may return uuid as string; coerce for de-dupe). */
export function questionRowId(row: Record<string, unknown>): string {
  const id = row.id;
  if (id == null) return '';
  if (typeof id === 'string') return id.trim();
  if (typeof id === 'number' && Number.isFinite(id)) return String(id);
  const s = String(id).trim();
  return s;
}

const SEEN_IDS_CAP = 400;

/** localStorage key: questions already shown today for this Foundation→AP match (avoids repeats across sessions). */
export function foundationDailySeenStorageKey(
  email: string,
  topicId: string,
  subtopicName: string,
  todayIso: string
): string {
  const safe = email.replace(/[^a-z0-9@._+-]/gi, '_').slice(0, 120);
  const subSlug = subtopicName.slice(0, 80).replace(/\s+/g, '_');
  return `foundation_daily_seen_${safe}_${topicId}_${subSlug}_${todayIso}`;
}

export function readFoundationDailySeenSet(storageKey: string): Set<string> {
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

export function rememberFoundationDailySeenId(storageKey: string, id: string): void {
  if (typeof localStorage === 'undefined' || !id) return;
  const set = readFoundationDailySeenSet(storageKey);
  set.add(id);
  const arr = [...set];
  const trimmed = arr.length > SEEN_IDS_CAP ? arr.slice(arr.length - SEEN_IDS_CAP) : arr;
  localStorage.setItem(storageKey, JSON.stringify(trimmed));
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function words(s: string): string[] {
  return norm(s)
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function unitTopicFilter(unitName: string): ((apTopicName: string) => boolean) | null {
  const u = unitName.toLowerCase();
  if (u.includes('units') && u.includes('measurement')) return (n) => n.toLowerCase().includes('kinematics');
  if (u.includes('kinematics')) return (n) => n.toLowerCase().includes('kinematics');
  if (u.includes('laws of motion')) return (n) => /newton|force|dynamic/i.test(n);
  if (u.includes('work') && u.includes('energy')) return (n) => /work|energy|power/i.test(n);
  if (u.includes('rotational motion')) return (n) => /rotat|torque|angular|roll/i.test(n);
  if (u.includes('gravitation')) return (n) => /circular|gravitation|orbit|kepler|satellite/i.test(n);
  if (u.includes('momentum') || u.includes('collision')) return (n) => /momentum|collision|impulse/i.test(n);
  if (u.includes('oscillation')) return (n) => /oscillat|wave|harmonic|shm|pendulum/i.test(n);
  if (u.includes('properties of matter') || u.includes('thermodynamics'))
    return (n) => /fluid|energy|oscillat|work|pressure/i.test(n);
  if (u.includes('electrostatic') || u.includes('electricity') || u.includes('optics') || u.includes('dual nature'))
    return (n) => /energy|oscillat|wave|work/i.test(n);
  return null;
}

function scoreSubtopic(unitName: string, foundationTopic: string, apTopicName: string, apSubtopicName: string): number {
  const ft = words(foundationTopic);
  const fu = words(unitName);
  const sub = norm(apSubtopicName);
  const top = norm(apTopicName);
  let score = 0;
  for (const w of ft) {
    if (sub.includes(w)) score += 6;
    else if (top.includes(w)) score += 2;
  }
  for (const w of fu) {
    if (sub.includes(w) && w.length > 4) score += 1;
  }
  const phrasePairs: [RegExp, number][] = [
    [/newton|f\s*=\s*ma|first law|second law|third law/i, 12],
    [/impulse|momentum/i, 10],
    [/kinematic|projectile|free fall|acceleration|displacement|velocity|graph/i, 10],
    [/work|energy|power|conservation|potential|kinetic/i, 10],
    [/torque|angular|rotation|inertia|equilibrium/i, 10],
    [/gravitation|orbit|kepler|escape|satellite/i, 10],
    [/shm|harmonic|pendulum|oscillat|period|frequency/i, 10],
    [/coulomb|electric field|flux|charge/i, 8],
    [/ohm|resistance|drift|current|series|parallel/i, 8],
    [/hooke|young|bulk|rigidity|pressure|bernoulli/i, 8],
    [/gas|thermo|heat|specific heat/i, 6],
    [/dimensional|significant|si unit|measurement error/i, 8],
  ];
  const blob = `${apTopicName} ${apSubtopicName}`;
  for (const [re, pts] of phrasePairs) {
    if (re.test(foundationTopic) && re.test(blob)) score += pts;
  }
  return score;
}

export async function fetchApSubtopicCatalog(client: SupabaseClient): Promise<ApSubtopicRef[]> {
  const { data: topics, error: tErr } = await client.from('topics').select('id,name').order('display_order');
  if (tErr) throw tErr;
  const { data: subs, error: sErr } = await client.from('subtopics').select('topic_id,name').order('display_order');
  if (sErr) throw sErr;
  const topicNames = new Map<string, string>();
  for (const t of topics || []) {
    if (t && typeof t.id === 'string' && typeof t.name === 'string') topicNames.set(t.id, t.name);
  }
  const out: ApSubtopicRef[] = [];
  for (const s of subs || []) {
    if (!s || typeof s.topic_id !== 'string' || typeof s.name !== 'string') continue;
    const topicName = topicNames.get(s.topic_id) || '';
    out.push({ topicId: s.topic_id, topicName, subtopicName: s.name });
  }
  return out;
}

export function resolveFoundationToApSubtopic(
  unitName: string,
  foundationTopic: string,
  catalog: ApSubtopicRef[]
): ApSubtopicRef | null {
  if (catalog.length === 0) return null;
  const filterFn = unitTopicFilter(unitName);
  const pool = filterFn ? catalog.filter((c) => filterFn(c.topicName)) : catalog;
  const search = pool.length > 0 ? pool : catalog;

  let best: ApSubtopicRef | null = null;
  let bestScore = -1;
  for (const c of search) {
    const sc = scoreSubtopic(unitName, foundationTopic, c.topicName, c.subtopicName);
    if (sc > bestScore) {
      bestScore = sc;
      best = c;
    }
  }
  if (best && bestScore >= 4) return best;

  let fallback: ApSubtopicRef | null = null;
  let fbScore = -1;
  for (const c of catalog) {
    const sc = scoreSubtopic(unitName, foundationTopic, c.topicName, c.subtopicName);
    if (sc > fbScore) {
      fbScore = sc;
      fallback = c;
    }
  }
  return fallback;
}

function explanationFromRow(row: Record<string, unknown>): string {
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
          return '';
        })
        .filter(Boolean)
        .join('\n\n');
    }
  }
  const sol = row.solution_steps;
  if (Array.isArray(sol)) {
    return sol.filter((x): x is string => typeof x === 'string').join('\n\n');
  }
  return '';
}

/** Legacy sample rows used the same five-step boilerplate for every MCQ. */
function isGenericTemplateExplanation(text: string): boolean {
  const t = text.trim();
  return (
    t.length > 0 &&
    t.includes('Step 1: Identify the given information') &&
    t.includes('Select the appropriate physics formula')
  );
}

function mcqExplanationWhenTemplateOrEmpty(
  question: string,
  options: Record<'A' | 'B' | 'C' | 'D', string>,
  correct: string,
  rawExplanation: string
): string {
  const letter = /^[ABCD]$/i.test(correct) ? correct.toUpperCase().slice(0, 1) : '';
  const optText = letter && (options as Record<string, string>)[letter] ? (options as Record<string, string>)[letter] : '';
  const hint =
    letter && optText
      ? `Correct answer: ${letter}) ${optText}`
      : 'Use kinematics and energy ideas for this prompt; the stored row did not include a specific write-up.';
  if (!rawExplanation.trim() || isGenericTemplateExplanation(rawExplanation)) {
    return `${hint}\n\nThis question was saved with a generic placeholder explanation. Regenerate today’s “Strengthen Your Basics” set in AP Physics (with AI) to replace it with full worked solutions, or ask your instructor to refresh the bank.`;
  }
  return rawExplanation;
}

/** Map `public.questions` basics row → UI shape used by Foundation daily practice */
export function apBasicsRowToGeneratedMcq(row: Record<string, unknown>): GeneratedMcq | null {
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

  const dl = row.difficulty_level;
  const difficulty =
    typeof dl === 'string' ? dl : typeof row.difficulty === 'string' ? String(row.difficulty) : undefined;

  const rid = questionRowId(row);
  const rawExpl = explanationFromRow(row);
  const explanation = mcqExplanationWhenTemplateOrEmpty(question, options, correct, rawExpl);

  return {
    question,
    options,
    correct,
    explanation: explanation.trim() ? explanation : 'See AP Physics solution steps in topic practice.',
    difficulty: difficulty || 'Foundation',
    examStyle: 'AP Physics 1',
    sourceQuestionId: rid || undefined,
  };
}

const DIFFICULTY_VARIANTS = ['Foundation', 'level_1'];

/**
 * Load AP daily basics MCQs for a topic/subtopic (same filters as BasicsSection).
 * Prefers `generated_date = today`; if empty, uses recent basics for that subtopic.
 */
export async function fetchApBasicsQuestionPool(
  client: SupabaseClient,
  topicId: string,
  subtopicName: string,
  todayIso: string
): Promise<Record<string, unknown>[]> {
  let query = client
    .from('questions')
    .select('*')
    .eq('topic_id', topicId)
    .eq('segment_type', 'basics')
    .eq('subtopic', subtopicName)
    .in('difficulty_level', DIFFICULTY_VARIANTS)
    .eq('generated_date', todayIso)
    /** Same ordering as AP BasicsSection daily MCQs */
    .order('created_at', { ascending: true })
    .limit(80);

  const { data: todayRows, error: e1 } = await query;
  if (e1) throw e1;
  if (todayRows && todayRows.length > 0) return todayRows as Record<string, unknown>[];

  const { data: anyRows, error: e2 } = await client
    .from('questions')
    .select('*')
    .eq('topic_id', topicId)
    .eq('segment_type', 'basics')
    .eq('subtopic', subtopicName)
    .in('difficulty_level', DIFFICULTY_VARIANTS)
    .order('created_at', { ascending: true })
    .limit(80);

  if (e2) throw e2;
  return (anyRows || []) as Record<string, unknown>[];
}

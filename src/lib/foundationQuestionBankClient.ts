import { supabase } from './supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

/** Same unit aliases as server `api/foundation-question.ts` */
const NAME_ALIASES: Record<string, string> = {
  'Units & Measurements': 'Units and Measurements',
  'Units and Measurements': 'Units & Measurements',
  'Dual Nature, Atoms & Nuclei': 'Dual Nature, Atoms and Nuclei',
  'Dual Nature, Atoms and Nuclei': 'Dual Nature, Atoms & Nuclei',
};

export function expandNameVariants(s: string): string[] {
  const t = s.trim();
  const out = new Set<string>([t]);
  const mapped = NAME_ALIASES[t];
  if (mapped) out.add(mapped);
  if (t.includes('&')) out.add(t.replace(/\s*&\s*/g, ' and '));
  return [...out];
}

function normalizeKey(s: string): string {
  return s
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[()]/g, '');
}

export type PickFoundationBankOptions = {
  /**
   * When every row in the topic pool was already used (stem hash in `usedQuestionHashes`),
   * still pick randomly from the full pool. Default false so callers can try the AI API first
   * (AP-style fresh questions) and only use this for offline / no-key fallback.
   */
  allowRepeatWhenExhausted?: boolean;
  /** Row IDs already shown this session — prevents the same bank row from appearing twice when stems match or hashes lag. */
  excludeRowIds?: number[];
};

export type FoundationBankRow = {
  id: number;
  unit: string;
  topic: string;
  question: string;
  options: unknown;
  correct: string;
  explanation: string | null;
  formula: string | null;
  difficulty: string | null;
  exam_style: string | null;
  level: number;
  section: string;
};

function parseOptionsArray(raw: unknown): string[] | null {
  if (!Array.isArray(raw) || raw.length !== 4) return null;
  const texts = raw.map((x) => (typeof x === 'string' ? x.trim() : ''));
  if (texts.some((t) => !t)) return null;
  return texts;
}

function securePickIndex(n: number): number {
  if (n <= 0) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]! % n;
}

function hashQuestionStem(text: string): string {
  const n = text.replace(/\s+/g, ' ').trim().toLowerCase();
  let h = 5381;
  const cap = Math.min(n.length, 600);
  for (let i = 0; i < cap; i++) {
    h = (h * 33) ^ n.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

/**
 * Pick a row from public.foundation_questions (same filters as server bank path).
 * Uses browser Supabase so practice works even when /api/foundation-question has no keys or no match.
 */
export async function tryPickFoundationBankQuestionClient(
  unitName: string,
  topicName: string,
  usedQuestionHashes: string[],
  client: SupabaseClient = supabase,
  options?: PickFoundationBankOptions
): Promise<FoundationBankRow | null> {
  const allowRepeatWhenExhausted = options?.allowRepeatWhenExhausted === true;
  const excludeRowIds = (options?.excludeRowIds ?? []).filter((n): n is number => Number.isFinite(n) && n > 0);
  const unitSet = expandNameVariants(unitName);
  const topicSet = expandNameVariants(topicName);

  const { data, error } = await client
    .from('foundation_questions')
    .select('*')
    .eq('level', 1)
    .eq('section', 'Ordinary Thinking')
    .in('unit', unitSet);

  if (error) {
    console.warn('foundation_questions client fetch:', error.message);
    return null;
  }
  if (!Array.isArray(data) || data.length === 0) return null;

  const rows = data as FoundationBankRow[];
  const topicKeys = new Set(topicSet.map(normalizeKey));

  let pool = rows.filter((r) => topicSet.includes(r.topic.trim()));
  if (pool.length === 0) {
    pool = rows.filter((r) => topicKeys.has(normalizeKey(r.topic)));
  }
  if (pool.length === 0) {
    pool = rows.filter((r) => normalizeKey(r.topic).includes(normalizeKey(topicName)) || normalizeKey(topicName).includes(normalizeKey(r.topic)));
  }
  if (pool.length === 0) {
    pool = rows;
  }

  let workingPool = pool;
  if (excludeRowIds.length > 0) {
    const ex = new Set(excludeRowIds);
    const idFiltered = pool.filter((r) => !ex.has(r.id));
    if (idFiltered.length > 0) {
      workingPool = idFiltered;
    } else if (!allowRepeatWhenExhausted) {
      return null;
    }
  }

  let candidates = workingPool.filter((r) => !usedQuestionHashes.includes(hashQuestionStem(r.question)));
  if (candidates.length === 0) {
    if (!allowRepeatWhenExhausted) return null;
    candidates = workingPool;
  }

  const row = candidates[securePickIndex(candidates.length)]!;
  if (!parseOptionsArray(row.options)) return null;
  return row;
}

/** Build JSON text compatible with `normalizeMcqFromUnknown` in FoundationDailyPractice */
export function foundationBankRowToMcqJson(row: FoundationBankRow): string {
  const opts = parseOptionsArray(row.options);
  if (!opts) return '{}';
  return JSON.stringify({
    question: row.question,
    options: opts,
    correct: String(row.correct ?? '').trim(),
    explanation: row.explanation ?? '',
    formula: row.formula ?? undefined,
    difficulty: row.difficulty ?? undefined,
    examStyle: row.exam_style ?? undefined,
  });
}

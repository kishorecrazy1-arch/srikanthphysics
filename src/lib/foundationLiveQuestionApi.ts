/** Client for `POST /api/foundation-question` (Level-2 MCQ + server shuffle). */

export interface FoundationLiveGeneratedQuestion {
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
  sourceQuestionId?: string;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Same stem hash as `api/foundation-question.ts` for `usedQuestionHashes`. */
export function hashQuestionStemClient(text: string): string {
  const n = text.replace(/\s+/g, ' ').trim().toLowerCase();
  let h = 5381;
  const cap = Math.min(n.length, 600);
  for (let i = 0; i < cap; i++) {
    h = (h * 33) ^ n.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

function readLetterOptions(opts: unknown): Record<'A' | 'B' | 'C' | 'D', string> | null {
  if (Array.isArray(opts) && opts.length === 4) {
    const texts = opts.map((x) => (typeof x === 'string' ? x.trim() : ''));
    if (texts.some((t) => !t)) return null;
    return { A: texts[0]!, B: texts[1]!, C: texts[2]!, D: texts[3]! };
  }
  if (!isRecord(opts)) return null;
  const pick = (u: string, l: string): string | undefined => {
    const a = opts[u];
    const b = opts[l];
    if (typeof a === 'string' && a.trim()) return a.trim();
    if (typeof b === 'string' && b.trim()) return b.trim();
    return undefined;
  };
  const A = pick('A', 'a');
  const B = pick('B', 'b');
  const C = pick('C', 'c');
  const D = pick('D', 'd');
  if (!A || !B || !C || !D) return null;
  return { A, B, C, D };
}

function resolveCorrectLetter(correct: unknown): 'A' | 'B' | 'C' | 'D' | null {
  if (typeof correct !== 'string') return null;
  const c = correct.trim();
  if (c.length === 0) return null;
  const letter = c.charAt(0).toUpperCase();
  if (letter === 'A' || letter === 'B' || letter === 'C' || letter === 'D') {
    return letter;
  }
  if (/^[1-4]$/.test(c)) {
    return (['A', 'B', 'C', 'D'] as const)[parseInt(c, 10) - 1] ?? null;
  }
  return null;
}

function readStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).map((s) => s.trim());
}

export type FoundationLiveMcqPayload = {
  question: FoundationLiveGeneratedQuestion;
  scenarioType?: string;
};

export type FoundationLiveMcqResult =
  | { ok: true; payload: FoundationLiveMcqPayload }
  | { ok: false; status: number; message: string };

function parseErrorBody(raw: string, status: number): string {
  try {
    const j = JSON.parse(raw) as { error?: unknown; code?: unknown };
    if (typeof j.error === 'string' && j.error.trim()) return j.error.trim();
  } catch {
    /* ignore */
  }
  return raw.trim() ? raw.trim().slice(0, 400) : `Request failed (HTTP ${status})`;
}

/**
 * POST same-origin `/api/foundation-question` (Vercel serverless or `vercel dev`).
 */
export async function fetchFoundationLiveMcq(params: {
  unitName: string;
  topic: string;
  usedQuestions: string[];
  usedScenarios: string[];
  usedQuestionHashes: string[];
}): Promise<FoundationLiveMcqResult> {
  let res: Response;
  try {
    res = await fetch('/api/foundation-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unitName: params.unitName,
        topic: params.topic,
        usedQuestions: params.usedQuestions,
        usedScenarios: params.usedScenarios,
        usedQuestionHashes: params.usedQuestionHashes.slice(0, 10),
      }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, status: 0, message: msg || 'Network error calling /api/foundation-question' };
  }

  const rawText = await res.text().catch(() => '');

  if (!res.ok) {
    return { ok: false, status: res.status, message: parseErrorBody(rawText, res.status) };
  }

  let data: unknown;
  try {
    data = JSON.parse(rawText) as unknown;
  } catch {
    return { ok: false, status: res.status, message: 'Invalid JSON from /api/foundation-question' };
  }
  if (!isRecord(data)) {
    return { ok: false, status: res.status, message: 'Unexpected response shape from /api/foundation-question' };
  }
  const text = data.text;
  if (typeof text !== 'string' || !text.trim()) {
    return { ok: false, status: res.status, message: 'Response missing `text` field (no question payload)' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, status: res.status, message: 'Could not parse `text` as JSON (malformed model output)' };
  }
  if (!isRecord(parsed)) {
    return { ok: false, status: res.status, message: 'Question JSON is not an object' };
  }

  const stem = parsed.question;
  if (typeof stem !== 'string' || !stem.trim()) {
    return { ok: false, status: res.status, message: 'Question JSON missing string `question` field' };
  }

  const options = readLetterOptions(parsed.options);
  if (!options) {
    return { ok: false, status: res.status, message: 'Question JSON missing four MCQ options (A–D or length-4 array)' };
  }

  const correct = resolveCorrectLetter(parsed.correct_answer ?? parsed.correct);
  if (!correct) {
    return { ok: false, status: res.status, message: 'Question JSON missing valid `correct_answer` (A–D or 1–4)' };
  }

  const formulasUsed = readStringArray(parsed.formulas_used);
  const formulasLegacy = readStringArray(parsed.formulas);
  const formulas = formulasUsed.length > 0 ? formulasUsed : formulasLegacy;

  const explanation =
    typeof parsed.explanation === 'string' && parsed.explanation.trim()
      ? parsed.explanation.trim()
      : '';

  const mistakes = readStringArray(parsed.common_mistakes);
  const tip =
    mistakes.length > 0
      ? `Common mistakes: ${mistakes.slice(0, 3).join(' · ')}`
      : undefined;

  const difficultyRaw = parsed.difficulty_level ?? parsed.difficulty;
  const difficulty = typeof difficultyRaw === 'string' && difficultyRaw.trim() ? difficultyRaw.trim() : 'Level 2';

  let scenarioType: string | undefined;
  const st = parsed.scenario_type;
  if (typeof st === 'string' && st.trim()) scenarioType = st.trim().slice(0, 80);

  const question: FoundationLiveGeneratedQuestion = {
    question: stem.trim(),
    options,
    correct,
    explanation,
    formulas: formulas.length > 0 ? formulas : undefined,
    difficulty,
    examStyle: 'IIT JEE Foundation',
    tip,
  };

  return { ok: true, payload: { question, scenarioType } };
}

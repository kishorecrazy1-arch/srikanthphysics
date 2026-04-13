import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

type HttpResponse = {
  status: (code: number) => HttpResponse;
  json: (body: unknown) => void;
  end: (chunk?: string) => void;
  setHeader: (name: string, value: string) => void;
};

type HttpRequest = {
  method?: string;
  body?: unknown;
};

type FoundationQuestionPayload = {
  unitName?: unknown;
  topic?: unknown;
  usedQuestionHashes?: unknown;
  /** Last few scenario labels already used this session (client may send from localStorage). */
  usedScenarios?: unknown;
  /** Legacy: full prompt from client */
  prompt?: unknown;
};

type CorrectDigit = '1' | '2' | '3' | '4';

type OptionsFourTuple = readonly [string, string, string, string];

function readString(v: unknown): string | undefined {
  return typeof v === 'string' ? v.trim() : undefined;
}

function readHashList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.length > 0).slice(0, 10);
}

function readUsedScenariosList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    .map((s) => s.trim())
    .slice(0, 5);
}

function parsePayload(body: unknown): FoundationQuestionPayload {
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    return body as FoundationQuestionPayload;
  }
  return {};
}

function isUnitsMeasurementsContext(unitName: string, topic: string): boolean {
  const u = unitName.toLowerCase();
  const t = topic.toLowerCase();
  return (
    (u.includes('units') && u.includes('measurement')) ||
    t.includes('si units') ||
    t.includes('dimensional') ||
    t.includes('significant figure') ||
    t.includes('measurement error')
  );
}

function escapeForPrompt(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/** Anthropic `system` message: difficulty, scenario diversity, MCQ discipline (user-facing contract). */
const FOUNDATION_SYSTEM_PROMPT = `You are an expert IIT JEE Foundation physics teacher.

STRICT RULES — MUST FOLLOW:
1. MEDIUM difficulty only — NOT basic definitions or one-line recall.
2. The main problem MUST require 2–3 steps of reasoning or calculation (not a single formula plug with trivial numbers).
3. Use a DIFFERENT physical scenario each time. Rotate among: bullet, rocket, satellite, spring, pendulum, water tank, inclined plane, pulley, electric circuit, train, swimmer, elevator, pipe flow, balloon, battery/bulb network — and similar varied setups.
4. NEVER use "racing car", "sports car", or "fast car" tropes. Avoid generic "car accelerates from rest" unless unavoidable; prefer non-automotive contexts.
5. Multiple choice: provide options as A, B, C, D. Put the correct answer at a RANDOM letter (not always B). Wrong options must be plausible and each include a numeric value WITH UNITS where the question is numeric.
6. All four MCQ options must include numbers with SI or stated units whenever the stem is quantitative.

MEDIUM means (style examples — do not copy numbers verbatim):
✓ "A bullet of 10 g hits a wall at 400 m/s and rebounds at 100 m/s in 0.01 s. Find the average force on the bullet."
✓ "Two resistors 3 Ω and 6 Ω in parallel across 12 V. Find the current through the 3 Ω resistor."
✗ "What is Newton's First Law?" (too basic)
✗ Reusing the same scenario family you used in a prior turn when the user lists banned fingerprints or scenarios.

The API response must be ONLY the JSON object described in the user message — no markdown, no code fences, no commentary before or after.`;

function buildFoundationUserPrompt(
  unitName: string,
  topic: string,
  usedHashes: string[],
  usedScenarios: string[]
): string {
  const avoidBlock =
    usedHashes.length > 0
      ? `

IMPORTANT — non-repetition:
The following fingerprints identify questions already shown this session for this topic. Do NOT repeat those setups (same numbers, same story beats, or same sub-part tasks). Invent a new context and different numerical values.
Fingerprints (opaque hashes; treat each as a distinct banned repeat):
${usedHashes.map((h, i) => `${i + 1}. ${h}`).join('\n')}`
      : '';

  const scenarioAvoidBlock =
    usedScenarios.length > 0
      ? `

SESSION SCENARIO MEMORY — do NOT reuse any of these physical setups or story frames in your new question (pick something clearly different):
${usedScenarios.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : '';

  const unitsMeasurementsBlock = isUnitsMeasurementsContext(unitName, topic)
    ? `

UNITS & MEASUREMENTS — REQUIRED FOCUS (this unit/topic):
- Prefer: dimensional analysis; unit conversion; significant figures; density/volume; measurement error; flow rate.
- NEVER use racing car, sports car, or generic "fast car" scenarios for this topic.`
    : '';

  return `Generate exactly ONE MEDIUM-difficulty foundation question.

Topic: "${escapeForPrompt(topic)}"
Unit: "${escapeForPrompt(unitName)}"

QUESTION SHAPE (follow strictly):
- Numerical or multi-step application (NOT definition-only).
- Three sub-parts labelled (a), (b), (c) in the "subQuestions" array.
- Include a "formulas" array (relevant formulas).
- In "answer", give step-by-step working for parts a, b, c with final numeric or symbolic results.
- Include one MCQ (options A–D) testing the key result or concept; exactly one correct letter; each option with plausible numbers+units when the stem is numeric.
- difficulty must be the string "Medium".
${unitsMeasurementsBlock}

Return ONLY valid JSON. No markdown, no code fences, no commentary.

RESPONSE FORMAT:
{
  "question": "A complete problem statement with concrete numbers/context (full stem for all parts).",
  "subQuestions": [
    "(a) First sub-task with numbers",
    "(b) Second sub-task",
    "(c) Third sub-task"
  ],
  "formulas": ["v = u + at", "s = ut + \u00bdat\u00b2"],
  "difficulty": "Medium",
  "topic": "${escapeForPrompt(topic)}",
  "unit": "${escapeForPrompt(unitName)}",
  "answer": {
    "a": "Step 1: ... Step 2: ... Answer: ...",
    "b": "Step 1: ... Answer: ...",
    "c": "Step 1: ... Answer: ..."
  },
  "options": {
    "A": "...",
    "B": "...",
    "C": "...",
    "D": "..."
  },
  "correct": "B",
  "explanation": "Why the chosen MCQ letter is correct (2–4 sentences).",
  "tip": "Key concept: ..."
}${avoidBlock}${scenarioAvoidBlock}`;
}

/** Strip optional ```json fences and isolate outermost `{ ... }`. */
function extractJsonObjectString(raw: string): string {
  let s = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start >= 0 && end > start) {
    s = s.slice(start, end + 1);
  }
  return s;
}

function secureRandomBelow(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]! % maxExclusive;
}

function readOptionsFourTuple(options: unknown): OptionsFourTuple | null {
  if (Array.isArray(options) && options.length === 4) {
    const texts: string[] = [];
    for (const x of options) {
      if (typeof x !== 'string' || !x.trim()) return null;
      texts.push(x.trim());
    }
    return [texts[0]!, texts[1]!, texts[2]!, texts[3]!];
  }
  if (options && typeof options === 'object' && !Array.isArray(options)) {
    const o = options as Record<string, unknown>;
    const pick = (a: string, b: string): string | undefined => {
      const u = o[a];
      const l = o[b];
      if (typeof u === 'string' && u.trim()) return u.trim();
      if (typeof l === 'string' && l.trim()) return l.trim();
      return undefined;
    };
    const A = pick('A', 'a');
    const B = pick('B', 'b');
    const C = pick('C', 'c');
    const D = pick('D', 'd');
    if (!A || !B || !C || !D) return null;
    return [A, B, C, D];
  }
  return null;
}

function resolveCorrectIndex0(correct: unknown): number | null {
  if (typeof correct !== 'string') return null;
  const c = correct.trim();
  if (c.length === 0) return null;
  if (/^[1-4]$/.test(c)) return parseInt(c, 10) - 1;
  const letter = c.charAt(0).toUpperCase();
  if (letter === 'A') return 0;
  if (letter === 'B') return 1;
  if (letter === 'C') return 2;
  if (letter === 'D') return 3;
  return null;
}

function shuffleMcqOptions(
  ordered: OptionsFourTuple,
  correctIndex0: number
): { options: string[]; correct: CorrectDigit } {
  if (correctIndex0 < 0 || correctIndex0 > 3) {
    throw new Error('Invalid correct index');
  }
  type Tagged = { text: string; wasCorrect: boolean };
  const entries: Tagged[] = ordered.map((text, i) => ({
    text,
    wasCorrect: i === correctIndex0,
  }));
  for (let i = entries.length - 1; i > 0; i--) {
    const j = secureRandomBelow(i + 1);
    const tmp = entries[i]!;
    entries[i] = entries[j]!;
    entries[j] = tmp;
  }
  const idx = entries.findIndex((e) => e.wasCorrect);
  if (idx < 0) {
    throw new Error('Correct option lost during shuffle');
  }
  const digit = String(idx + 1);
  if (digit !== '1' && digit !== '2' && digit !== '3' && digit !== '4') {
    throw new Error('Invalid shuffled index');
  }
  return {
    options: entries.map((e) => e.text),
    correct: digit as CorrectDigit,
  };
}

function tryShuffleMcqInObject(obj: Record<string, unknown>): Record<string, unknown> {
  const tuple = readOptionsFourTuple(obj.options);
  if (!tuple) return obj;
  const idx = resolveCorrectIndex0(obj.correct);
  if (idx === null) return obj;
  try {
    const { options, correct } = shuffleMcqOptions(tuple, idx);
    return { ...obj, options, correct };
  } catch {
    return obj;
  }
}

function postProcessModelJsonText(raw: string): string {
  const cleaned = extractJsonObjectString(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return raw;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return raw;
  }
  const out = tryShuffleMcqInObject(parsed as Record<string, unknown>);
  return JSON.stringify(out);
}

type FoundationBankRow = {
  unit: string;
  topic: string;
  exam_style?: string | null;
  difficulty?: string | null;
  level?: number | null;
  section?: string | null;
  question: string;
  options: unknown;
  correct: string;
  explanation?: string | null;
  formula?: string | null;
};

function hashQuestionStem(text: string): string {
  const n = text.replace(/\s+/g, ' ').trim().toLowerCase();
  let h = 5381;
  const cap = Math.min(n.length, 600);
  for (let i = 0; i < cap; i++) {
    h = (h * 33) ^ n.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

const NAME_ALIASES: Record<string, string> = {
  'Units & Measurements': 'Units and Measurements',
  'Units and Measurements': 'Units & Measurements',
  'Dual Nature, Atoms & Nuclei': 'Dual Nature, Atoms and Nuclei',
  'Dual Nature, Atoms and Nuclei': 'Dual Nature, Atoms & Nuclei',
};

function expandNameVariants(s: string): string[] {
  const t = s.trim();
  const out = new Set<string>([t]);
  const mapped = NAME_ALIASES[t];
  if (mapped) out.add(mapped);
  if (t.includes('&')) out.add(t.replace(/\s*&\s*/g, ' and '));
  return [...out];
}

function loadLocalFoundationBank(): FoundationBankRow[] {
  const paths = [
    join(process.cwd(), 'api', 'foundationQuestionsBank.json'),
    join(process.cwd(), 'foundationQuestionsBank.json'),
  ];
  for (const p of paths) {
    try {
      const raw = readFileSync(p, 'utf8');
      const parsed = JSON.parse(raw) as FoundationBankRow[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // try next path
    }
  }
  return [];
}

async function tryPickFoundationBankQuestion(
  unitName: string,
  topic: string,
  usedHashes: string[]
): Promise<Record<string, unknown> | null> {
  const unitSet = expandNameVariants(unitName);
  const topicSet = expandNameVariants(topic);

  let rows: FoundationBankRow[] = [];

  const supabaseUrl = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  const supabaseKey = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      ''
  ).trim();

  if (supabaseUrl && supabaseKey && /^https?:\/\//i.test(supabaseUrl)) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('foundation_questions')
        .select('*')
        .eq('level', 1)
        .eq('section', 'Ordinary Thinking')
        .in('unit', unitSet)
        .in('topic', topicSet);
      if (!error && Array.isArray(data) && data.length > 0) {
        rows = data as FoundationBankRow[];
      }
    } catch {
      rows = [];
    }
  }

  if (rows.length === 0) {
    rows = loadLocalFoundationBank().filter(
      (r) =>
        Number(r.level) === 1 &&
        String(r.section || '').trim() === 'Ordinary Thinking' &&
        unitSet.includes(r.unit) &&
        topicSet.includes(r.topic)
    );
  }

  if (rows.length === 0) return null;

  let candidates = rows.filter((r) => !usedHashes.includes(hashQuestionStem(r.question)));
  if (candidates.length === 0) candidates = rows;

  const row = candidates[secureRandomBelow(candidates.length)]!;
  if (!Array.isArray(row.options) || row.options.length !== 4) return null;
  const texts = row.options.map((x) => (typeof x === 'string' ? x.trim() : ''));
  if (texts.some((t) => !t)) return null;

  return {
    unit: row.unit,
    topic: row.topic,
    question: row.question,
    options: texts,
    correct: String(row.correct ?? '').trim(),
    explanation: row.explanation ?? '',
    formula: row.formula ?? undefined,
    difficulty: row.difficulty ?? 'Easy',
    examStyle: row.exam_style ?? undefined,
  };
}

export default async function handler(req: HttpRequest, res: HttpResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = String(process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || '').trim();

  try {
    const rawBody = req.body;
    const body =
      typeof rawBody === 'string'
        ? parsePayload(JSON.parse(rawBody) as unknown)
        : parsePayload(rawBody);

    const unitName = readString(body.unitName);
    const topic = readString(body.topic);
    const usedQuestionHashes = readHashList(body.usedQuestionHashes);
    const usedScenarios = readUsedScenariosList(body.usedScenarios);
    const legacyPrompt = readString(body.prompt);

    if (unitName && topic) {
      const fromBank = await tryPickFoundationBankQuestion(unitName, topic, usedQuestionHashes);
      if (fromBank) {
        const processed = postProcessModelJsonText(JSON.stringify(fromBank));
        return res.status(200).json({ text: processed, source: 'bank' });
      }
    }

    if (!apiKey || apiKey.length < 20) {
      return res.status(500).json({
        code: 'missing_config',
        error:
          'No foundation bank match for this topic, and Anthropic API key is not configured on the server. Add ANTHROPIC_API_KEY or apply the foundation_questions migration + Supabase env vars.',
      });
    }

    let userContent: string;
    let systemInstruction: string | undefined;
    if (unitName && topic) {
      systemInstruction = FOUNDATION_SYSTEM_PROMPT;
      userContent = buildFoundationUserPrompt(unitName, topic, usedQuestionHashes, usedScenarios);
    } else if (legacyPrompt) {
      userContent = legacyPrompt;
    } else {
      return res.status(400).json({ error: 'Missing unitName/topic or prompt' });
    }

    const messageBody: Record<string, unknown> = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: userContent }],
    };
    if (systemInstruction) {
      messageBody.system = systemInstruction;
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(messageBody),
    });

    const data = (await r.json().catch(() => ({}))) as {
      content?: Array<{ text?: string }>;
      error?: {
        message?: string;
      };
    };
    if (!r.ok) {
      return res.status(r.status).json({
        error: data?.error?.message || `Anthropic request failed with HTTP ${r.status}`,
      });
    }

    const text = data?.content?.[0]?.text ?? '{}';
    const processed = postProcessModelJsonText(text);
    return res.status(200).json({ text: processed, source: 'ai' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message || 'Unexpected server error' });
  }
}

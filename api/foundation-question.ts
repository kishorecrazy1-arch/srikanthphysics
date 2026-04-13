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

function buildFoundationPrompt(
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
- Prefer: dimensional analysis of physical quantities; unit conversion between systems; significant figures in measurements; density and volume calculations; flow rate and time calculations.
- NEVER use a racing car, sports car, or generic "fast car" scenario for this topic.`
    : '';

  const scenarioRotationBlock = `

ROTATE SCENARIOS — never repeat the same physical story within this session when prior questions exist.
Pick ONE fresh primary context (different from any listed "do not use" scenarios above), drawn from categories like:
- MECHANICS: bullet, rocket, train, bicycle, swimmer, pendulum, spring, elevator, pulley, inclined plane
- FLUIDS: water tank, pipe flow, submarine, balloon, oil drum, swimming pool, hydraulic press
- ASTRONOMY: satellite, planet orbit, moon, comet, rocket launch, ISS, telescope
- ELECTRICITY: wire, bulb, battery, motor, generator, fan, refrigerator, phone charging
- DAILY LIFE: cricket ball, football, lift, escalator, ceiling fan, pressure cooker, thermometer
Avoid leaning on "car" scenarios unless nothing else fits; never use racing/sports car clichés for measurement-heavy topics.`;

  const mcqRandomBlock = `

CRITICAL — multiple-choice fairness:
- Randomize which option letter is correct. Do NOT always place the correct choice in B or C.
- Generate the correct numeric or conceptual answer first, then assign it to a RANDOM letter A, B, C, or D.
- Fill the other three letters with plausible distractors.
- Across many questions, correct answers should appear at A, B, C, and D with balanced variety — never the same slot every time.
(The server will reshuffle options again for extra safety, but you must still randomize.)`;

  return `You are a physics teacher for Foundation Course students (Class 9–11, Indian curriculum, preparing for JEE/NEET foundation).

Generate ONE MEDIUM difficulty question on: "${escapeForPrompt(topic)}" from the unit "${escapeForPrompt(unitName)}".

QUESTION STYLE (follow strictly):
- Must be numerical or application-based (NOT definition-only).
- Must have 3 sub-parts labelled (a), (b), (c) in the subQuestions array (wording may include (a), (b), (c)).
- Must include a "formulas" array listing relevant formulas (Relevant Formulas).
- In the "answer" object, give step-by-step working for EACH part (a), (b), (c) with final numeric or symbolic results.
- Use a single clear real-world context from the rotation lists above (not a duplicate scenario).
- Medium level: requires formula application + calculation.
${scenarioRotationBlock}${unitsMeasurementsBlock}
${mcqRandomBlock}

Also include ONE multiple-choice checkpoint (options A–D) that tests the key numerical result or main concept from the problem. Exactly one option is correct. Set "correct" to "A", "B", "C", or "D".

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

    let prompt: string;
    if (unitName && topic) {
      prompt = buildFoundationPrompt(unitName, topic, usedQuestionHashes, usedScenarios);
    } else if (legacyPrompt) {
      prompt = legacyPrompt;
    } else {
      return res.status(400).json({ error: 'Missing unitName/topic or prompt' });
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
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

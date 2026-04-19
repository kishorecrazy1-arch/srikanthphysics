/**
 * Foundation Level-2 MCQ generator — LLM only (no question bank).
 * POST JSON: { unitName, topic, usedQuestions?, usedScenarios?, usedQuestionHashes? } or { prompt } legacy.
 */

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
  usedQuestions?: unknown;
  usedScenarios?: unknown;
  prompt?: unknown;
};

type McqLetter = 'A' | 'B' | 'C' | 'D';

type OptionsFourTuple = readonly [string, string, string, string];

const MCQ_LETTERS: readonly McqLetter[] = ['A', 'B', 'C', 'D'];

type FoundationLlmGenerateResult =
  | { ok: true; text: string }
  | { ok: false; status: number; error: string };

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

function readUsedQuestionsList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    .map((s) => s.trim().slice(0, 400))
    .slice(0, 15);
}

function parsePayload(body: unknown): FoundationQuestionPayload {
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    return body as FoundationQuestionPayload;
  }
  return {};
}

function escapeForPrompt(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function formatUsedQuestionsLine(usedQuestionStems: string[], usedHashes: string[]): string {
  if (usedQuestionStems.length > 0) {
    return usedQuestionStems.map((q) => escapeForPrompt(q)).join(', ');
  }
  if (usedHashes.length > 0) {
    return usedHashes.map((h) => escapeForPrompt(h)).join(', ');
  }
  return '(none yet)';
}

function formatUsedScenariosLine(usedScenarios: string[]): string {
  if (usedScenarios.length === 0) return '(none yet)';
  return usedScenarios.map((s) => escapeForPrompt(s)).join(', ');
}

/**
 * FRESH FOUNDATION QUESTION GENERATOR — Level 2 (AP Physics–style contract).
 */
function buildFreshFoundationLevel2SystemPrompt(
  unitName: string,
  topic: string,
  usedQuestionStems: string[],
  usedHashes: string[],
  usedScenarios: string[]
): string {
  const et = escapeForPrompt(topic);
  const eu = escapeForPrompt(unitName);
  const usedQuestionsLine = formatUsedQuestionsLine(usedQuestionStems, usedHashes);
  const usedScenariosLine = formatUsedScenariosLine(usedScenarios);

  return `You are an expert IIT JEE/NEET Foundation physics instructor creating Level 2 (Intermediate) MCQ questions for Class 9-11 students preparing for entrance exams.

═══════════════════════════════════════
TARGET DIFFICULTY: LEVEL 2 (INTERMEDIATE)
═══════════════════════════════════════

LEVEL 2 means:
✅ Requires 2-3 calculation steps
✅ Uses 1-2 formulas combined
✅ Real-world numerical scenario
✅ Application of concepts (not just definitions)

GOOD LEVEL 2 examples:
✅ "A bullet of mass 50g moving at 200 m/s hits a wooden block of mass 950g at rest. After collision they move together. Find common velocity."
✅ "A wire of length 2m has resistance 4Ω. If stretched to double its length, new resistance is?"
✅ "A satellite orbits Earth at height equal to Earth's radius. Find its orbital velocity."

BAD examples (DO NOT generate):
❌ "Define velocity" (Level 1 - too basic)
❌ "What is Newton's First Law" (definition)
❌ "A particle moves with derivative dx/dt..." (Level 3)

═══════════════════════════════════════
CRITICAL ANTI-REPETITION RULES
═══════════════════════════════════════

NEVER use these scenarios in same session:
- Racing car / Sports car
- "A particle moves along x-axis"

ROTATE through these scenarios randomly:

MECHANICS scenarios:
bullet, rocket, train, lift, swimmer, pendulum,
spring, ball thrown, cricket bat, hammer, pulley

FLUIDS/MATTER:
water tank, pipe, balloon, swimming pool, syringe,
hydraulic lift, oil drum, wire, rod, beam

ASTRONOMY:
satellite, planet, moon orbit, rocket launch, ISS,
space station, comet

ELECTRICITY:
bulb, battery cell, motor, fan, charger, resistor
network, capacitor, generator

THERMODYNAMICS:
gas in cylinder, balloon expanding, ice melting,
water heating, refrigerator, engine

OPTICS:
mirror, lens, prism, fiber cable, microscope

═══════════════════════════════════════
EXACT JSON RESPONSE FORMAT
═══════════════════════════════════════

Return ONLY valid JSON, no extra text.

The field "correct_answer" must be exactly one JSON string: "A", "B", "C", or "D" (pick one; never use multiple letters in one value).

{
  "question": "Full Level 2 problem with numbers and units",
  "options": {
    "A": "value with unit",
    "B": "value with unit",
    "C": "value with unit",
    "D": "value with unit"
  },
  "correct_answer": "A",
  "explanation": "Step 1: Identify given values\\nStep 2: Apply formula\\nStep 3: Calculate\\nFinal answer: X units",
  "formulas_used": ["F = ma", "v = u + at"],
  "common_mistakes": ["Forgot to convert km/h to m/s"],
  "difficulty_level": "Level 2",
  "scenario_type": "bullet/satellite/spring/etc",
  "topic": "${et}",
  "unit": "${eu}"
}

Rules:
- "common_mistakes" must be a non-empty array of short strings.
- "formulas_used" must be a non-empty array of formula strings used in the solution.
- "scenario_type" is a short label matching the story you used.

═══════════════════════════════════════
ANSWER POSITION RANDOMIZATION
═══════════════════════════════════════

Randomly distribute correct answer:
- 25% Q's correct = A
- 25% Q's correct = B
- 25% Q's correct = C
- 25% Q's correct = D

NEVER make B always correct.

For each question, FIRST decide correct position randomly, THEN place correct value there, fill others with plausible wrong values from common calculation mistakes.

═══════════════════════════════════════
PREVENT REPEATING IN SESSION
═══════════════════════════════════════

Previously asked questions in this session:
${usedQuestionsLine}

Previously used scenarios:
${usedScenariosLine}

DO NOT repeat any of above.
Pick NEW scenario from rotation list.

═══════════════════════════════════════
SUBJECT/EXAM CONTEXT
═══════════════════════════════════════

Generate question following:
- IIT JEE Foundation pattern
- Indian textbook style (Errorless, HC Verma)
- Numerical with proper SI units
- Single concept focus
- Clear, unambiguous wording
- Test understanding through calculation`;
}

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
    const o: Record<string, unknown> = options;
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

/** Server-side shuffle (spec: shuffleAnswerPosition) using unbiased RNG instead of Math.random. */
function shuffleAnswerPosition(question: {
  options: Record<McqLetter, string>;
  correct_answer: McqLetter;
}): { options: Record<McqLetter, string>; correct_answer: McqLetter } {
  const opts = MCQ_LETTERS.map((k) => question.options[k]);
  const correctIdx = MCQ_LETTERS.indexOf(question.correct_answer);
  if (correctIdx < 0) {
    throw new Error('Invalid correct_answer');
  }
  const correctVal = opts[correctIdx]!;
  const wrong = opts.filter((_, i) => i !== correctIdx);
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = secureRandomBelow(i + 1);
    const tmp = wrong[i]!;
    wrong[i] = wrong[j]!;
    wrong[j] = tmp;
  }
  const newPos = secureRandomBelow(4);
  const merged = [...wrong];
  merged.splice(newPos, 0, correctVal);
  const out: Record<McqLetter, string> = {
    A: merged[0]!,
    B: merged[1]!,
    C: merged[2]!,
    D: merged[3]!,
  };
  return { options: out, correct_answer: MCQ_LETTERS[newPos]! };
}

function optionsTupleToLetterMap(
  tuple: OptionsFourTuple,
  correctIndex0: number
): { options: Record<McqLetter, string>; correct_answer: McqLetter } {
  if (correctIndex0 < 0 || correctIndex0 > 3) {
    throw new Error('Invalid correct index');
  }
  return {
    options: { A: tuple[0]!, B: tuple[1]!, C: tuple[2]!, D: tuple[3]! },
    correct_answer: MCQ_LETTERS[correctIndex0]!,
  };
}

function normalizeFoundationAiFields(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...obj };
  const fu = out.formulas_used;
  if (!('formulas' in out) && Array.isArray(fu)) {
    const formulas = fu.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
    if (formulas.length > 0) {
      out.formulas = formulas;
    }
  }
  return out;
}

function tryShuffleMcqInObject(obj: Record<string, unknown>): Record<string, unknown> {
  const tuple = readOptionsFourTuple(obj.options);
  if (!tuple) return obj;
  const idx = resolveCorrectIndex0(obj.correct ?? obj.correct_answer);
  if (idx === null) return obj;
  try {
    const letterMap = optionsTupleToLetterMap(tuple, idx);
    const shuffled = shuffleAnswerPosition(letterMap);
    const { correct: _legacyCorrect, correct_answer: _ca, options: _opts, ...rest } = obj;
    void _legacyCorrect;
    void _ca;
    void _opts;
    return {
      ...rest,
      options: shuffled.options,
      correct_answer: shuffled.correct_answer,
    };
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
  const base = normalizeFoundationAiFields(parsed as Record<string, unknown>);
  const out = tryShuffleMcqInObject(base);
  return JSON.stringify(out);
}

function readServerApiKey(...envNames: string[]): string {
  for (const name of envNames) {
    const v = process.env[name];
    if (typeof v === 'string' && v.trim().length >= 20) return v.trim();
  }
  return '';
}

async function generateFoundationViaOpenAI(
  apiKey: string,
  userContent: string,
  systemInstruction: string | undefined
): Promise<FoundationLlmGenerateResult> {
  const messages: Array<{ role: string; content: string }> = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: userContent });

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      max_tokens: 4096,
      temperature: 0.35,
    }),
  });

  const data = (await r.json().catch(() => ({}))) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };
  if (!r.ok) {
    return {
      ok: false,
      status: r.status,
      error: data?.error?.message || `OpenAI request failed with HTTP ${r.status}`,
    };
  }
  const text = data?.choices?.[0]?.message?.content ?? '{}';
  return { ok: true, text };
}

async function generateFoundationViaAnthropic(
  apiKey: string,
  userContent: string,
  systemInstruction: string | undefined
): Promise<FoundationLlmGenerateResult> {
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
    error?: { message?: string };
  };
  if (!r.ok) {
    return {
      ok: false,
      status: r.status,
      error: data?.error?.message || `Anthropic request failed with HTTP ${r.status}`,
    };
  }
  const text = data?.content?.[0]?.text ?? '{}';
  return { ok: true, text };
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

  const openaiKey = readServerApiKey('OPENAI_API_KEY', 'VITE_OPENAI_API_KEY');
  const anthropicKey = readServerApiKey('ANTHROPIC_API_KEY', 'VITE_ANTHROPIC_API_KEY');

  try {
    const rawBody = req.body;
    const body =
      typeof rawBody === 'string'
        ? parsePayload(JSON.parse(rawBody) as unknown)
        : parsePayload(rawBody);

    const unitName = readString(body.unitName);
    const topic = readString(body.topic);
    const usedQuestionHashes = readHashList(body.usedQuestionHashes);
    const usedQuestionStems = readUsedQuestionsList(body.usedQuestions);
    const usedScenarios = readUsedScenariosList(body.usedScenarios);
    const legacyPrompt = readString(body.prompt);

    if (!openaiKey && !anthropicKey) {
      return res.status(500).json({
        code: 'missing_config',
        error:
          'No LLM API key configured on the server. Set OPENAI_API_KEY or VITE_OPENAI_API_KEY, or ANTHROPIC_API_KEY or VITE_ANTHROPIC_API_KEY.',
      });
    }

    let userContent: string;
    let systemInstruction: string | undefined;
    if (unitName && topic) {
      systemInstruction = buildFreshFoundationLevel2SystemPrompt(
        unitName,
        topic,
        usedQuestionStems,
        usedQuestionHashes,
        usedScenarios
      );
      userContent =
        'Generate exactly ONE new Level 2 (Intermediate) MCQ now. Return only the JSON object defined in your instructions — no markdown, no code fences, no extra text.';
    } else if (legacyPrompt) {
      userContent = legacyPrompt;
    } else {
      return res.status(400).json({ error: 'Missing unitName/topic or prompt' });
    }

    const preferOpenAI = Boolean(openaiKey);
    const gen: FoundationLlmGenerateResult = preferOpenAI
      ? await generateFoundationViaOpenAI(openaiKey, userContent, systemInstruction)
      : await generateFoundationViaAnthropic(anthropicKey, userContent, systemInstruction);

    if (gen.ok) {
      const processed = postProcessModelJsonText(gen.text);
      return res.status(200).json({ text: processed, source: 'ai', provider: preferOpenAI ? 'openai' : 'anthropic' });
    }

    return res.status(gen.status).json({ error: gen.error });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message || 'Unexpected server error' });
  }
}

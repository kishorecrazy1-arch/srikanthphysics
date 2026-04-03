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
  /** Legacy: full prompt from client */
  prompt?: unknown;
};

function readString(v: unknown): string | undefined {
  return typeof v === 'string' ? v.trim() : undefined;
}

function readHashList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.length > 0).slice(0, 10);
}

function parsePayload(body: unknown): FoundationQuestionPayload {
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    return body as FoundationQuestionPayload;
  }
  return {};
}

function buildFoundationPrompt(unitName: string, topic: string, usedHashes: string[]): string {
  const avoidBlock =
    usedHashes.length > 0
      ? `

IMPORTANT — non-repetition:
The following fingerprints identify questions already shown this session for this topic. Do NOT repeat those setups (same numbers, same story beats, or same sub-part tasks). Invent a new context and different numerical values.
Fingerprints (opaque hashes; treat each as a distinct banned repeat):
${usedHashes.map((h, i) => `${i + 1}. ${h}`).join('\n')}`
      : '';

  return `You are a physics teacher for Foundation Course students (Class 9–11, Indian curriculum, preparing for JEE/NEET foundation).

Generate ONE MEDIUM difficulty question on: "${topic}" from the unit "${unitName}".

QUESTION STYLE (follow strictly):
- Must be numerical or application-based (NOT definition-only).
- Must have 3 sub-parts labelled (a), (b), (c) in the subQuestions array (wording may include (a), (b), (c)).
- Must include a "formulas" array listing relevant formulas (Relevant Formulas).
- In the "answer" object, give step-by-step working for EACH part (a), (b), (c) with final numeric or symbolic results.
- Use real-world context where possible (e.g. car, ball, spring, incline, circuit element).
- Medium level: requires formula application + calculation.

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
  "topic": "${topic.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",
  "unit": "${unitName.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",
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
}${avoidBlock}`;
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
  if (!apiKey || apiKey.length < 20) {
    return res.status(500).json({
      code: 'missing_config',
      error: 'Anthropic API key is not configured on the server.',
    });
  }

  try {
    const rawBody = req.body;
    const body =
      typeof rawBody === 'string'
        ? parsePayload(JSON.parse(rawBody) as unknown)
        : parsePayload(rawBody);

    const unitName = readString(body.unitName);
    const topic = readString(body.topic);
    const usedQuestionHashes = readHashList(body.usedQuestionHashes);
    const legacyPrompt = readString(body.prompt);

    let prompt: string;
    if (unitName && topic) {
      const examStyle = pickExamStyle(unitName);
      const difficulty = inferDifficulty(examStyle);
      prompt = buildFoundationPrompt(unitName, topic, usedQuestionHashes, examStyle, difficulty);
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
    return res.status(200).json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message || 'Unexpected server error' });
  }
}

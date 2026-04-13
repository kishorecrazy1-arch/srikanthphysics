import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { FOUNDATION_SYLLABUS, UNIT_ACCENTS } from '../lib/foundationSyllabus';
import { getFoundationAnalytics, mergeFoundationAnalytics, bumpTopicProgress } from '../lib/foundationStorage';

function getUserInfoFromStorage() {
  return {
    email: localStorage.getItem('userEmail') || '',
    batch: localStorage.getItem('userBatch') || 'Foundation Course',
    course: localStorage.getItem('userCourse') || 'Foundation',
  };
}

function foundationUsedQuestionsStorageKey(topic: string): string {
  return `foundationUsedQuestions_${topic}`;
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

function readUsedQuestionHashes(topic: string): string[] {
  try {
    const raw = localStorage.getItem(foundationUsedQuestionsStorageKey(topic));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string').slice(-10);
  } catch {
    return [];
  }
}

function appendUsedQuestionHash(topic: string, hash: string): void {
  const prev = readUsedQuestionHashes(topic);
  const next = [...prev.filter((h) => h !== hash), hash].slice(-10);
  localStorage.setItem(foundationUsedQuestionsStorageKey(topic), JSON.stringify(next));
}

function clearUsedQuestionsForTopic(topic: string): void {
  localStorage.removeItem(foundationUsedQuestionsStorageKey(topic));
}

function displayNameFromSessionMeta(metadata: Record<string, unknown> | undefined, email: string | undefined): string {
  const pick = (k: string): string => {
    const v = metadata?.[k];
    return typeof v === 'string' && v.trim() ? v.trim() : '';
  };
  const fromMeta = pick('name') || pick('full_name');
  if (fromMeta) return fromMeta;
  const local = typeof email === 'string' && email.includes('@') ? email.split('@')[0] ?? '' : '';
  return local || 'Student';
}

interface GeneratedQuestion {
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
}

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;

function stripNumericMcqPrefix(s: string): string {
  return s.replace(/^\s*[1-4]\)\s*/i, '').trim();
}

/** API returns 1–4 options array + correct "1"|"2"|"3"|"4"; legacy uses A–D object. */
function normalizeMcqFromUnknown(parsed: unknown): GeneratedQuestion | null {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  const p = parsed as Record<string, unknown>;
  const question = typeof p.question === 'string' ? p.question.trim() : '';
  if (!question) return null;

  const explanation = typeof p.explanation === 'string' ? p.explanation : '';

  let options: Record<'A' | 'B' | 'C' | 'D', string>;
  let correct: string;

  if (Array.isArray(p.options) && p.options.length === 4) {
    const texts = p.options.map((x, i) => {
      const raw = typeof x === 'string' ? x.trim() : '';
      const stripped = stripNumericMcqPrefix(raw);
      return stripped.length > 0 ? stripped : (raw || `Option ${i + 1}`);
    });
    options = { A: texts[0]!, B: texts[1]!, C: texts[2]!, D: texts[3]! };
    const c = String(p.correct ?? '').trim();
    const digit = /^[1-4]$/.test(c) ? c : '';
    const map: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
    correct = digit ? (map[digit] ?? '') : String(c).toUpperCase().replace(/[^ABCD]/g, '').slice(0, 1);
    if (!OPTION_KEYS.includes(correct as (typeof OPTION_KEYS)[number])) return null;
  } else if (p.options && typeof p.options === 'object' && !Array.isArray(p.options)) {
    const o = p.options as Record<string, unknown>;
    const get = (k: string): string => {
      const v = o[k];
      return typeof v === 'string' ? v.trim() : '';
    };
    const A = get('A') || get('a');
    const B = get('B') || get('b');
    const C = get('C') || get('c');
    const D = get('D') || get('d');
    if (!A || !B || !C || !D) return null;
    options = { A, B, C, D };
    correct = String(p.correct ?? '')
      .trim()
      .toUpperCase()
      .slice(0, 1);
    if (!OPTION_KEYS.includes(correct as (typeof OPTION_KEYS)[number])) return null;
  } else {
    return null;
  }

  const subQ = p.subQuestions;
  const subQuestions = Array.isArray(subQ)
    ? subQ.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    : undefined;

  const formulasRaw = p.formulas;
  const formulas = Array.isArray(formulasRaw)
    ? formulasRaw.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    : undefined;

  let answer: Record<string, string> | undefined;
  if (p.answer && typeof p.answer === 'object' && !Array.isArray(p.answer)) {
    const a = p.answer as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const k of ['a', 'b', 'c'] as const) {
      const v = a[k];
      if (typeof v === 'string' && v.trim()) out[k] = v;
    }
    if (Object.keys(out).length > 0) answer = out;
  }

  return {
    question,
    subQuestions: subQuestions && subQuestions.length > 0 ? subQuestions : undefined,
    formulas: formulas && formulas.length > 0 ? formulas : undefined,
    options,
    correct,
    explanation,
    formula: typeof p.formula === 'string' ? p.formula.trim() : undefined,
    difficulty: typeof p.difficulty === 'string' ? p.difficulty.trim() : undefined,
    examStyle: typeof p.examStyle === 'string' ? p.examStyle.trim() : undefined,
    tip: typeof p.tip === 'string' ? p.tip.trim() : undefined,
    answer,
  };
}

function formatExamBadgeLabel(examStyle: string | undefined): string | null {
  if (!examStyle?.trim()) return null;
  const u = examStyle.toUpperCase();
  if (u.includes('JEE')) return 'JEE';
  if (u.includes('NEET')) return 'NEET';
  if (u.includes('AP')) return 'AP';
  if (u.includes('IGCSE') || u.includes('IB')) return 'IGCSE';
  const t = examStyle.trim();
  return t.length > 12 ? `${t.slice(0, 12)}…` : t;
}

function ExamStyleBadge({ examStyle }: { examStyle: string | undefined }) {
  const label = formatExamBadgeLabel(examStyle);
  if (!label) return null;
  return (
    <span
      className="bg-violet-500/25 text-violet-200 text-xs px-2.5 py-1 rounded-md border border-violet-400/40 font-bold tracking-wide"
      title="Exam-style pattern for this question"
    >
      [{label}]
    </span>
  );
}

/** `kind: config` = key not in bundle; `kind: api` = Anthropic rejected the request */
type QuestionGenError = { error: true; kind: 'config' | 'api'; apiMessage?: string };

const TOTAL_SESSION_QUESTIONS = 10;

export function FoundationDailyPractice() {
  const navigate = useNavigate();
  const location = useLocation();
  const signOut = useAuthStore((s) => s.signOut);
  const authUser = useAuthStore((s) => s.user);
  const isHomeworkMode = new URLSearchParams(location.search).get('mode') === 'homework';

  const [activeUnit, setActiveUnit] = useState(FOUNDATION_SYLLABUS[0]);
  const [activeTopic, setActiveTopic] = useState(FOUNDATION_SYLLABUS[0].topics[0]);
  const [question, setQuestion] = useState<GeneratedQuestion | QuestionGenError | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [correctToday, setCorrectToday] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionDisplayName, setSessionDisplayName] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const stored = getUserInfoFromStorage();
  const userInfo = {
    name: (authUser?.name && authUser.name.trim()) || sessionDisplayName || 'Student',
    email: (authUser?.email && authUser.email.trim()) || sessionEmail || stored.email || '',
    batch: stored.batch,
    course: stored.course,
  };
  const email = userInfo.email || 'student';

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      const u = data.user;
      if (!u) return;
      const meta = u.user_metadata as Record<string, unknown> | undefined;
      const name = displayNameFromSessionMeta(meta, u.email);
      setSessionDisplayName(name);
      if (u.email) {
        setSessionEmail(u.email);
        localStorage.setItem('userEmail', u.email);
      }
      const metaName = typeof meta?.name === 'string' ? meta.name.trim() : '';
      const metaFull = typeof meta?.full_name === 'string' ? meta.full_name.trim() : '';
      if (metaName) localStorage.setItem('userName', metaName);
      else if (metaFull) localStorage.setItem('userName', metaFull);
      else if (u.email?.includes('@')) localStorage.setItem('userName', u.email.split('@')[0] ?? '');
    })();
    return () => {
      cancelled = true;
    };
  }, [authUser?.id]);

  useEffect(() => {
    const todayKey = `foundation_today_${email}_${new Date().toDateString()}`;
    const correctKey = `foundation_correct_${email}_${new Date().toDateString()}`;
    const streakKey = `foundation_streak_${email}`;
    const lastActiveKey = `foundation_lastactive_${email}`;

    setTodayCount(parseInt(localStorage.getItem(todayKey) || '0', 10));
    setCorrectToday(parseInt(localStorage.getItem(correctKey) || '0', 10));
    setStreak(parseInt(localStorage.getItem(streakKey) || '0', 10));
    localStorage.setItem('foundationTodayCount', String(parseInt(localStorage.getItem(todayKey) || '0', 10)));
    localStorage.setItem('foundationStreak', String(parseInt(localStorage.getItem(streakKey) || '0', 10)));

    const lastActive = localStorage.getItem(lastActiveKey);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const todayStr = new Date().toDateString();
    if (lastActive && lastActive !== todayStr && lastActive !== yesterday.toDateString()) {
      localStorage.setItem(streakKey, '0');
      localStorage.setItem('foundationStreak', '0');
      setStreak(0);
    }
  }, [email]);

  function resetSessionState() {
    setSessionActive(false);
    setSessionComplete(false);
    setCurrentQuestionNumber(1);
    setAnsweredCount(0);
    setCorrectCount(0);
    setSelected(null);
    setRevealed(false);
    setQuestion(null);
  }

  async function generateQuestion(retryLeft = 2) {
    setLoading(true);
    setSelected(null);
    setRevealed(false);
    setQuestion(null);

    const usedBefore = readUsedQuestionHashes(activeTopic);

    try {
      const res = await fetch('/api/foundation-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unitName: activeUnit.name,
          topic: activeTopic,
          usedQuestionHashes: usedBefore,
        }),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { code?: string; error?: string; message?: string };
        if (err.code === 'missing_config') {
          setQuestion({ error: true, kind: 'config' });
          setLoading(false);
          return;
        }
        throw new Error(err.error || err.message || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { text?: string };
      const text = data?.text ?? '{}';
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      let rawParsed: unknown;
      try {
        rawParsed = JSON.parse(clean) as unknown;
      } catch {
        throw new Error('Model returned invalid JSON.');
      }

      const parsed = normalizeMcqFromUnknown(rawParsed);
      if (!parsed) {
        throw new Error('Invalid question payload from model (missing options or correct answer).');
      }

      const stemHash = hashQuestionStem(parsed.question);
      if (usedBefore.includes(stemHash) && retryLeft > 0) {
        await generateQuestion(retryLeft - 1);
        return;
      }

      appendUsedQuestionHash(activeTopic, stemHash);
      setQuestion(parsed);
    } catch (e) {
      console.error('Question generation error:', e);
      const msg = e instanceof Error ? e.message : String(e);
      setQuestion({ error: true, kind: 'api', apiMessage: msg });
    }
    setLoading(false);
  }

  function finalizeSession() {
    const todayKey = `foundation_today_${email}_${new Date().toDateString()}`;
    const correctKey = `foundation_correct_${email}_${new Date().toDateString()}`;
    const newTodayCount = todayCount + answeredCount;
    const newCorrectToday = correctToday + correctCount;
    localStorage.setItem(todayKey, String(newTodayCount));
    localStorage.setItem(correctKey, String(newCorrectToday));
    localStorage.setItem('foundationTodayCount', String(newTodayCount));
    setTodayCount(newTodayCount);
    setCorrectToday(newCorrectToday);

    const sessionAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    const lastActiveKey = `foundation_lastactive_${email}`;
    const streakKey = `foundation_streak_${email}`;
    const todayStr = new Date().toDateString();
    const lastActive = localStorage.getItem(lastActiveKey);
    if (sessionAccuracy >= 60 && lastActive !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = lastActive === yesterday.toDateString() ? streak + 1 : 1;
      localStorage.setItem(streakKey, String(newStreak));
      localStorage.setItem('foundationStreak', String(newStreak));
      localStorage.setItem(lastActiveKey, todayStr);
      setStreak(newStreak);
    }

    const analytics = getFoundationAnalytics();
    mergeFoundationAnalytics({
      questionsSolved: analytics.questionsSolved + answeredCount,
      correctAnswers: analytics.correctAnswers + correctCount,
    });
    bumpTopicProgress(activeUnit.name, correctCount, answeredCount);

    setSessionActive(false);
    setSessionComplete(true);
    setQuestion(null);
    setSelected(null);
    setRevealed(false);
  }

  function startPracticeSession() {
    clearUsedQuestionsForTopic(activeTopic);
    setSessionActive(true);
    setSessionComplete(false);
    setCurrentQuestionNumber(1);
    setAnsweredCount(0);
    setCorrectCount(0);
    void generateQuestion();
  }

  function handleNextQuestion() {
    if (!sessionActive) return;
    if (currentQuestionNumber >= TOTAL_SESSION_QUESTIONS) {
      finalizeSession();
      return;
    }
    setCurrentQuestionNumber((n) => n + 1);
    void generateQuestion();
  }

  function handleAnswer(opt: string) {
    if (revealed || !question || 'error' in question) return;
    setSelected(opt);
    setRevealed(true);
    setAnsweredCount((n) => n + 1);
    if (opt === question.correct) {
      setCorrectCount((n) => n + 1);
    }
  }

  async function logout() {
    await signOut();
    navigate('/login');
  }

  const accuracy = todayCount > 0 ? Math.round((correctToday / todayCount) * 100) : 0;
  const sessionAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const activeAccent = UNIT_ACCENTS[(activeUnit.id - 1) % UNIT_ACCENTS.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white flex flex-col">
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/foundation-dashboard')}
            className="text-slate-400 hover:text-white p-1 rounded flex items-center gap-1"
            aria-label="Back to Foundation dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white p-1 rounded"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-sm shadow-lg shadow-cyan-500/20">
            SA
          </div>
          <div>
            <p className="font-bold text-sm leading-tight text-white">Srikanth&apos;s Academy</p>
            <p className="text-xs text-cyan-300 leading-tight">
              {isHomeworkMode ? 'Daily Homework' : 'Daily Practice'} · {userInfo.batch}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center hidden sm:block">
            <p className="text-cyan-400 font-bold text-base leading-tight">🔥 {streak}</p>
            <p className="text-xs text-slate-400">Streak</p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-blue-400 font-bold text-base leading-tight">{todayCount}</p>
            <p className="text-xs text-slate-400">Today</p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-green-400 font-bold text-base leading-tight">{accuracy}%</p>
            <p className="text-xs text-slate-400">Accuracy</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-slate-300 hidden md:block">{userInfo.name}</span>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-slate-400 hover:text-white border border-slate-600 px-3 py-1 rounded-lg ml-2 hover:border-slate-500"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="w-64 bg-slate-900/60 backdrop-blur-sm border-r border-slate-700/50 overflow-y-auto flex-shrink-0">
            <div className="p-3">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 px-2 font-semibold">Foundation syllabus</p>
              {FOUNDATION_SYLLABUS.map((unit) => {
                const accent = UNIT_ACCENTS[(unit.id - 1) % UNIT_ACCENTS.length];
                const isActive = activeUnit.id === unit.id;
                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => {
                      setActiveUnit(unit);
                      setActiveTopic(unit.topics[0]);
                      resetSessionState();
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 text-sm transition-all flex items-start gap-2 border ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-200 border-cyan-500/40 font-semibold shadow-[0_0_20px_-10px_rgba(34,211,238,0.5)]'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white border-transparent'
                    }`}
                    style={
                      isActive
                        ? { boxShadow: `inset 0 0 0 1px ${accent}33` }
                        : undefined
                    }
                  >
                    <span
                      className="text-base leading-tight mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${accent}22` }}
                    >
                      {unit.icon}
                    </span>
                    <span className="leading-tight">
                      <span className="text-slate-500 text-xs mr-1">{unit.id}.</span>
                      {unit.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-y-auto p-5">
          <div className="mb-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your progress overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{todayCount}</div>
                  <div className="text-sm text-slate-300">Questions today</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">{correctToday}</div>
                  <div className="text-sm text-slate-300">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-300">{Math.max(0, todayCount - correctToday)}</div>
                  <div className="text-sm text-slate-400">To review</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
                  <div className="text-sm text-slate-300">Accuracy</div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                    style={{
                      backgroundColor: `${activeAccent}22`,
                      boxShadow: `0 0 24px -8px ${activeAccent}`,
                    }}
                  >
                    {activeUnit.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Unit {activeUnit.id}: {activeUnit.name}</h2>
                    <p className="text-xs text-slate-400">Select a topic to practice</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400 hidden sm:inline">
                  {activeUnit.topics.length} topics
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeUnit.topics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setActiveTopic(topic);
                      resetSessionState();
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeTopic === topic
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/80 hover:text-white border border-slate-600/50'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-2xl">
            {!question && !loading && !sessionComplete && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center shadow-lg">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-1 text-white">Ready for a 10-question session?</h3>
                <p className="text-slate-300 text-sm mb-1">
                  Mode: <span className="text-green-300">{isHomeworkMode ? 'Daily Homework' : 'Daily Practice'}</span>
                </p>
                <p className="text-slate-400 text-sm mb-1">
                  Unit: <span className="text-cyan-400">{activeUnit.name}</span>
                </p>
                <p className="text-slate-400 text-sm mb-6">
                  Topic: <span className="text-cyan-300 font-semibold">{activeTopic}</span>
                </p>
                <button
                  type="button"
                  onClick={startPracticeSession}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
                >
                  ✨ {isHomeworkMode ? 'Start 10-question homework' : 'Start 10-question practice'}
                </button>
              </div>
            )}

            {loading && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4 animate-pulse">⚙️</div>
                <p className="text-slate-400 text-sm">Generating your question...</p>
              </div>
            )}

            {question && 'error' in question && question.error && (
              <div className="bg-red-950/40 border border-red-800 rounded-2xl p-6 text-center space-y-3">
                {'kind' in question && question.kind === 'config' ? (
                  <>
                    <p className="text-red-300 font-medium">⚠️ API key not loaded in the app</p>
                    <p className="text-slate-400 text-sm text-left max-w-lg mx-auto">
                      The server needs <code className="text-cyan-400">OPENAI_API_KEY</code> or{' '}
                      <code className="text-cyan-400">VITE_OPENAI_API_KEY</code> (recommended), or{' '}
                      <code className="text-cyan-400">ANTHROPIC_API_KEY</code> /{' '}
                      <code className="text-cyan-400">VITE_ANTHROPIC_API_KEY</code>. Add one in your host environment
                      variables, then redeploy.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-red-300 font-medium">⚠️ AI request failed</p>
                    <p className="text-slate-400 text-sm break-words max-w-lg mx-auto">
                      {('apiMessage' in question && question.apiMessage) || 'Unknown error'}. If the key is valid, check
                      OpenAI billing and model access (or Anthropic if you only use a Claude key).
                    </p>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    void generateQuestion();
                  }}
                  className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-xl"
                >
                  Try Again
                </button>
              </div>
            )}

            {question && !('error' in question) && !loading && (
              <div className="space-y-4">
                <div
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
                  style={{ boxShadow: `0 0 0 1px ${activeAccent}22, 0 0 32px -12px ${activeAccent}44` }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <ExamStyleBadge examStyle={question.examStyle} />
                    <span className="text-slate-400 text-xs font-medium">
                      Q{currentQuestionNumber} of {TOTAL_SESSION_QUESTIONS}
                    </span>
                    <span className="bg-cyan-500/20 text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-500/30 font-medium">
                      Unit: {activeUnit.name}
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                      {activeTopic}
                    </span>
                    <span className="bg-slate-800/80 text-slate-400 text-xs px-3 py-1 rounded-full border border-slate-600/50">
                      {question.difficulty || 'Medium'}
                    </span>
                  </div>
                  <p className="text-base font-medium leading-relaxed text-white whitespace-pre-wrap">{question.question}</p>
                  {question.subQuestions && question.subQuestions.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-slate-200 text-sm list-disc list-inside">
                      {question.subQuestions.map((sq) => (
                        <li key={sq} className="leading-relaxed">
                          {sq}
                        </li>
                      ))}
                    </ul>
                  )}
                  {!revealed && ((question.formulas && question.formulas.length > 0) || question.formula) ? (
                    <div className="mt-4 bg-slate-900/80 rounded-lg px-4 py-3 border border-amber-700/30">
                      <p className="text-amber-200/90 text-xs font-semibold uppercase tracking-wider mb-2">Relevant formulas</p>
                      {question.formulas && question.formulas.length > 0 ? (
                        <ul className="space-y-1">
                          {question.formulas.map((f, i) => (
                            <li key={`${i}-${f.slice(0, 40)}`} className="text-amber-100 text-sm font-mono leading-relaxed">
                              {f}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-amber-100 text-sm font-mono">{question.formula}</p>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {OPTION_KEYS.map((key, idx) => {
                    const opt = question.options[key];
                    const num = idx + 1;
                    let style =
                      'bg-slate-800/40 border-slate-600/50 text-white hover:border-cyan-400/50 hover:bg-slate-800/80 cursor-pointer';
                    if (!revealed && selected === key)
                      style = 'bg-cyan-500/15 border-cyan-400 text-cyan-100 cursor-pointer';
                    if (revealed) {
                      if (key === question.correct)
                        style = 'bg-green-500/20 border-green-500 text-green-200 cursor-default';
                      else if (key === selected)
                        style = 'bg-red-500/20 border-red-500 text-red-300 cursor-default';
                      else style = 'bg-slate-900/50 border-slate-700 text-slate-500 cursor-default opacity-60';
                    }
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleAnswer(key)}
                        className={`text-left p-3 sm:p-4 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-3 min-h-[3.25rem] ${style}`}
                      >
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            revealed && key === question.correct
                              ? 'bg-green-500 text-white'
                              : revealed && key === selected
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {num})
                        </span>
                        <span className="flex-1 leading-snug">{opt}</span>
                        {revealed && key === question.correct && <span className="text-green-400 text-base shrink-0">✅</span>}
                        {revealed && key === selected && key !== question.correct && (
                          <span className="text-red-400 text-base shrink-0">❌</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {revealed && (
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      <p className="text-cyan-300 font-semibold text-sm">Explanation</p>
                      <span
                        className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                          selected === question.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {selected === question.correct ? '✓ Correct!' : '✗ Incorrect'}
                      </span>
                    </div>
                    {question.formula && (
                      <div className="rounded-lg border border-amber-700/40 bg-slate-900/60 px-4 py-3">
                        <p className="text-amber-200/90 text-xs font-semibold uppercase tracking-wider mb-1">Formula</p>
                        <p className="text-amber-100 text-sm font-mono leading-relaxed">{question.formula}</p>
                      </div>
                    )}
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{question.explanation}</p>
                    {question.answer &&
                      (['a', 'b', 'c'] as const).some((k) => typeof question.answer?.[k] === 'string') && (
                        <div className="rounded-lg border border-slate-600/60 bg-slate-900/50 px-4 py-3 space-y-2">
                          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Worked solutions</p>
                          {(['a', 'b', 'c'] as const).map((part) => {
                            const text = question.answer?.[part];
                            if (!text?.trim()) return null;
                            return (
                              <div key={part}>
                                <p className="text-cyan-400 text-xs font-bold mb-0.5">Part ({part})</p>
                                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    {question.tip && (
                      <div className="bg-amber-950/30 border border-amber-700/40 rounded-lg px-4 py-2">
                        <p className="text-amber-200 text-sm">
                          🧠 <span className="font-semibold">Tip:</span> {question.tip}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm shadow-md shadow-cyan-500/15"
                      >
                        {currentQuestionNumber >= TOTAL_SESSION_QUESTIONS ? 'Finish session →' : 'Next question →'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const idx = activeUnit.topics.indexOf(activeTopic);
                          const next = activeUnit.topics[(idx + 1) % activeUnit.topics.length];
                          setActiveTopic(next);
                          resetSessionState();
                        }}
                        className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-4 rounded-xl transition-all text-sm border border-slate-600/50"
                      >
                        Switch topic
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {sessionComplete && !loading && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center shadow-lg">
                <div className="text-5xl mb-3">🏁</div>
                <h3 className="text-2xl font-bold text-white mb-2">Session complete</h3>
                <p className="text-slate-300 mb-4">
                  You scored <span className="text-green-400 font-semibold">{correctCount}</span> / {TOTAL_SESSION_QUESTIONS}
                </p>
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-4">
                  <div className="bg-slate-900/60 rounded-lg py-2">
                    <div className="text-cyan-300 font-bold">{answeredCount}</div>
                    <div className="text-slate-400 text-xs">Attempted</div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg py-2">
                    <div className="text-green-300 font-bold">{correctCount}</div>
                    <div className="text-slate-400 text-xs">Correct</div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg py-2">
                    <div className="text-orange-300 font-bold">{sessionAccuracy}%</div>
                    <div className="text-slate-400 text-xs">Accuracy</div>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={startPracticeSession}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-2.5 px-6 rounded-xl"
                  >
                    Practice again
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const idx = activeUnit.topics.indexOf(activeTopic);
                      const next = activeUnit.topics[(idx + 1) % activeUnit.topics.length];
                      setActiveTopic(next);
                      resetSessionState();
                    }}
                    className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-6 rounded-xl border border-slate-600/50"
                  >
                    Change topic
                  </button>
                </div>
              </div>
            )}
          </div>

          {todayCount > 0 && (
            <div className="max-w-2xl mt-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5">
                <p className="text-sm text-slate-400 mb-3 font-semibold uppercase tracking-wider">Today&apos;s progress</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{todayCount}</p>
                    <p className="text-xs text-slate-400">Attempted</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">{correctToday}</p>
                    <p className="text-xs text-slate-400">Correct</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-cyan-400">{accuracy}%</p>
                    <p className="text-xs text-slate-400">Accuracy</p>
                  </div>
                </div>
                <div className="mt-3 bg-slate-900/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

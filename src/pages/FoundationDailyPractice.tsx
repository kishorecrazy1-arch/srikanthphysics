import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { FOUNDATION_SYLLABUS, UNIT_ACCENTS } from '../lib/foundationSyllabus';
import { getFoundationAnalytics, mergeFoundationAnalytics, bumpTopicProgress } from '../lib/foundationStorage';

function getUserInfoFromStorage() {
  return {
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    batch: localStorage.getItem('userBatch') || 'Foundation Course',
    course: localStorage.getItem('userCourse') || 'Foundation',
  };
}

interface GeneratedQuestion {
  question: string;
  options: Record<string, string>;
  correct: string;
  explanation: string;
  formula?: string;
  difficulty?: string;
  tip?: string;
}

/** `kind: config` = key not in bundle; `kind: api` = Anthropic rejected the request */
type QuestionGenError = { error: true; kind: 'config' | 'api'; apiMessage?: string };

export function FoundationDailyPractice() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const authUser = useAuthStore((s) => s.user);

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

  const stored = getUserInfoFromStorage();
  const userInfo = {
    name: stored.name || authUser?.name || 'Student',
    email: stored.email || authUser?.email || '',
    batch: stored.batch,
    course: stored.course,
  };
  const email = userInfo.email || 'student';

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

  async function generateQuestion() {
    setLoading(true);
    setSelected(null);
    setRevealed(false);
    setQuestion(null);

    const prompt = `You are a physics teacher for a Foundation Course (pre-university / Grade 11-12 level).
Generate ONE multiple choice question on the topic: "${activeTopic}" from the unit "${activeUnit.name}".

This is for students building core physics fundamentals. Keep it conceptual and clear.
Difficulty: Mix of Easy and Medium.

Return ONLY valid JSON, no markdown, no backticks:
{
  "question": "The question text here",
  "options": {
    "A": "Option A text",
    "B": "Option B text",
    "C": "Option C text",
    "D": "Option D text"
  },
  "correct": "A",
  "explanation": "Clear 2-3 sentence explanation of why the answer is correct and the key concept.",
  "formula": "Any relevant formula if applicable, else empty string",
  "difficulty": "Easy",
  "tip": "One short memory tip or trick for this concept"
}`;

    const apiKey = String(import.meta.env.VITE_ANTHROPIC_API_KEY ?? '').trim();
    if (!apiKey || apiKey.length < 20) {
      setQuestion({ error: true, kind: 'config' });
      setLoading(false);
      return;
    }
    // eslint-disable-next-line no-console -- dev-only hint; never log the key
    if (import.meta.env.DEV) {
      console.info(
        '[Foundation] VITE_ANTHROPIC_API_KEY is loaded (length %d). If questions still fail, the error is from Anthropic, not .env.',
        apiKey.length
      );
    }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data?.content?.[0]?.text ?? '{}';
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(clean) as GeneratedQuestion;
      setQuestion(parsed);

      const todayKey = `foundation_today_${email}_${new Date().toDateString()}`;
      const newCount = todayCount + 1;
      localStorage.setItem(todayKey, String(newCount));
      localStorage.setItem('foundationTodayCount', String(newCount));
      setTodayCount(newCount);

      const lastActiveKey = `foundation_lastactive_${email}`;
      const streakKey = `foundation_streak_${email}`;
      const lastActive = localStorage.getItem(lastActiveKey);
      const todayStr = new Date().toDateString();
      if (lastActive !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const newStreak = lastActive === yesterday.toDateString() ? streak + 1 : 1;
        localStorage.setItem(streakKey, String(newStreak));
        localStorage.setItem('foundationStreak', String(newStreak));
        setStreak(newStreak);
        localStorage.setItem(lastActiveKey, todayStr);
      }

      const a = getFoundationAnalytics();
      mergeFoundationAnalytics({ questionsSolved: a.questionsSolved + 1 });
    } catch (e) {
      console.error('Question generation error:', e);
      const msg = e instanceof Error ? e.message : String(e);
      setQuestion({ error: true, kind: 'api', apiMessage: msg });
    }
    setLoading(false);
  }

  function handleAnswer(opt: string) {
    if (revealed || !question || 'error' in question) return;
    setSelected(opt);
    setRevealed(true);
    if (opt === question.correct) {
      const correctKey = `foundation_correct_${email}_${new Date().toDateString()}`;
      const newCorrect = correctToday + 1;
      localStorage.setItem(correctKey, String(newCorrect));
      setCorrectToday(newCorrect);
      const a = getFoundationAnalytics();
      mergeFoundationAnalytics({ correctAnswers: a.correctAnswers + 1 });
      bumpTopicProgress(activeUnit.name, 1, 1);
    }
  }

  async function logout() {
    await signOut();
    navigate('/login');
  }

  const accuracy = todayCount > 0 ? Math.round((correctToday / todayCount) * 100) : 0;

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
            <p className="text-xs text-cyan-300 leading-tight">Daily Practice · {userInfo.batch}</p>
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
                      setQuestion(null);
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
                      setQuestion(null);
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
            {!question && !loading && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center shadow-lg">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-1 text-white">Ready to practice?</h3>
                <p className="text-slate-400 text-sm mb-1">
                  Unit: <span className="text-cyan-400">{activeUnit.name}</span>
                </p>
                <p className="text-slate-400 text-sm mb-6">
                  Topic: <span className="text-cyan-300 font-semibold">{activeTopic}</span>
                </p>
                <button
                  type="button"
                  onClick={generateQuestion}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
                >
                  ✨ Generate question
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
                      The browser build does not include <code className="text-cyan-400">VITE_ANTHROPIC_API_KEY</code>.
                      Put it in a <code className="text-cyan-400">.env</code> file in the same folder as{' '}
                      <code className="text-cyan-400">vite.config.ts</code>, restart <code className="text-cyan-400">npm run dev</code>,
                      and for production add the same variable in your host (Vercel/Netlify) and redeploy.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-red-300 font-medium">⚠️ Anthropic request failed</p>
                    <p className="text-slate-400 text-sm break-words max-w-lg mx-auto">
                      {('apiMessage' in question && question.apiMessage) || 'Unknown error'}. If the key is valid, check billing, model access, or CORS (API is called from the browser).
                    </p>
                  </>
                )}
                <button type="button" onClick={generateQuestion} className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-xl">
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
                    <span className="bg-cyan-500/20 text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-500/30 font-medium">
                      {activeUnit.name}
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                      {activeTopic}
                    </span>
                    <span className="bg-slate-800/80 text-slate-400 text-xs px-3 py-1 rounded-full border border-slate-600/50">
                      {question.difficulty || 'Medium'}
                    </span>
                    <span className="ml-auto text-slate-500 text-xs">Q#{todayCount}</span>
                  </div>
                  <p className="text-base font-medium leading-relaxed text-white">{question.question}</p>
                  {question.formula && (
                    <div className="mt-3 bg-slate-900/80 rounded-lg px-4 py-2 inline-block border border-slate-700/50">
                      <p className="text-amber-300 text-sm font-mono">{question.formula}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((key) => {
                    const opt = question.options?.[key];
                    if (!opt) return null;
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
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-3 ${style}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            revealed && key === question.correct
                              ? 'bg-green-500 text-white'
                              : revealed && key === selected
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {key}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {revealed && key === question.correct && <span className="text-green-400 text-base">✅</span>}
                        {revealed && key === selected && key !== question.correct && (
                          <span className="text-red-400 text-base">❌</span>
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
                    <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
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
                        onClick={generateQuestion}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm shadow-md shadow-cyan-500/15"
                      >
                        Next question →
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const idx = activeUnit.topics.indexOf(activeTopic);
                          const next = activeUnit.topics[(idx + 1) % activeUnit.topics.length];
                          setActiveTopic(next);
                          setQuestion(null);
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

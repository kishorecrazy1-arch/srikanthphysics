import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// ============================================================
// ACTUAL FOUNDATION SYLLABUS (from official syllabus document)
// ============================================================
const FOUNDATION_SYLLABUS = [
  { id: 1, name: 'Units & Measurements', icon: '📏', topics: ['Fundamental and Derived Quantities', 'SI Units and Their Symbols', 'Dimensional Analysis', 'Measurement Errors', 'Significant Figures'] },
  { id: 2, name: 'Kinematics', icon: '🏃', topics: ['Average Speed and Average Velocity', 'Acceleration', 'Kinematic Equations of Motion', 'Position-Time Graphs', 'Velocity-Time Graphs', 'Acceleration-Time Graphs'] },
  { id: 3, name: 'Laws of Motion', icon: '⚙️', topics: ["Newton's First Law of Motion", "Newton's Second Law (F = ma)", "Newton's Third Law of Motion", 'Force Diagrams (Free Body Diagrams)', 'Impulse-Momentum Principle'] },
  { id: 4, name: 'Work, Energy and Power', icon: '⚡', topics: ['Work Done by a Force', 'Area Under Force-Displacement Graph', 'Types of Energy (KE, PE)', 'Conservation of Energy', 'Power and Its Units'] },
  { id: 5, name: 'Rotational Motion', icon: '🌀', topics: ['Centre of Mass', 'Moment of Force (Torque)', 'Angular Momentum', 'Equilibrium of Bodies', 'Moment of Inertia'] },
  { id: 6, name: 'Gravitation', icon: '🌍', topics: ["Newton's Law of Gravitation", 'Acceleration Due to Gravity (g)', 'Variation of g with Altitude and Depth', "Kepler's Laws of Planetary Motion", 'Escape Velocity', 'Orbital Velocity'] },
  { id: 7, name: 'Properties of Solids & Liquids', icon: '🧱', topics: ["Hooke's Law", "Young's Modulus", 'Bulk Modulus and Rigidity Modulus', 'Pressure and Its Measurement', "Bernoulli's Principle"] },
  { id: 8, name: 'Thermodynamics & Kinetic Theory', icon: '🌡️', topics: ['Ideal Gas Equation', 'Types of Thermodynamic Processes', 'Work Done in Thermodynamic Processes', 'Specific Heats (Cp and Cv)', 'Kinetic Theory of Gases'] },
  { id: 9, name: 'Oscillations', icon: '〰️', topics: ['Simple Harmonic Motion (SHM)', 'Time Period and Frequency', 'Displacement, Velocity & Acceleration in SHM', 'Simple Pendulum', 'Potential and Kinetic Energy in SHM'] },
  { id: 10, name: 'Electrostatics', icon: '⚡', topics: ['Electric Charges and Conservation', "Coulomb's Law", 'Electric Field and Field Lines', 'Electric Flux', "Gauss's Law"] },
  { id: 11, name: 'Current Electricity', icon: '🔌', topics: ['Drift Velocity and Mobility', "Ohm's Law", 'Resistance and Resistivity', 'Resistors in Series and Parallel', "Kirchhoff's Laws"] },
  { id: 12, name: 'Dual Nature, Atoms & Nuclei', icon: '⚛️', topics: ['Dual Nature of Radiation and Matter', 'Photoelectric Effect', 'de Broglie Relation', "Bohr's Atomic Model", 'Nuclear Structure'] },
  { id: 13, name: 'Optics', icon: '🔭', topics: ['Reflection and Laws of Reflection', 'Spherical Mirrors and Mirror Formula', 'Refraction of Light', 'Refraction at Spherical Surfaces', 'Total Internal Reflection'] },
];

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

export default function FoundationDashboard() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const authUser = useAuthStore((s) => s.user);

  const [activeUnit, setActiveUnit] = useState(FOUNDATION_SYLLABUS[0]);
  const [activeTopic, setActiveTopic] = useState(FOUNDATION_SYLLABUS[0].topics[0]);
  const [question, setQuestion] = useState<GeneratedQuestion | { error: boolean } | null>(null);
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
    const todayKey = `fd_today_${email}_${new Date().toDateString()}`;
    const correctKey = `fd_correct_${email}_${new Date().toDateString()}`;
    const streakKey = `fd_streak_${email}`;
    const lastActiveKey = `fd_lastactive_${email}`;

    setTodayCount(parseInt(localStorage.getItem(todayKey) || '0', 10));
    setCorrectToday(parseInt(localStorage.getItem(correctKey) || '0', 10));
    setStreak(parseInt(localStorage.getItem(streakKey) || '0', 10));

    const lastActive = localStorage.getItem(lastActiveKey);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const todayStr = new Date().toDateString();
    if (lastActive && lastActive !== todayStr && lastActive !== yesterday.toDateString()) {
      localStorage.setItem(streakKey, '0');
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

    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.length < 20) {
      setQuestion({ error: true });
      setLoading(false);
      return;
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

      const todayKey = `fd_today_${email}_${new Date().toDateString()}`;
      const newCount = todayCount + 1;
      localStorage.setItem(todayKey, String(newCount));
      setTodayCount(newCount);

      const lastActiveKey = `fd_lastactive_${email}`;
      const streakKey = `fd_streak_${email}`;
      const lastActive = localStorage.getItem(lastActiveKey);
      const todayStr = new Date().toDateString();
      if (lastActive !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const newStreak = lastActive === yesterday.toDateString() ? streak + 1 : 1;
        localStorage.setItem(streakKey, String(newStreak));
        setStreak(newStreak);
        localStorage.setItem(lastActiveKey, todayStr);
      }
    } catch (e) {
      console.error('Question generation error:', e);
      setQuestion({ error: true });
    }
    setLoading(false);
  }

  function handleAnswer(opt: string) {
    if (revealed || !question || 'error' in question) return;
    setSelected(opt);
    setRevealed(true);
    if (opt === question.correct) {
      const correctKey = `fd_correct_${email}_${new Date().toDateString()}`;
      const newCorrect = correctToday + 1;
      localStorage.setItem(correctKey, String(newCorrect));
      setCorrectToday(newCorrect);
    }
  }

  async function logout() {
    await signOut();
    navigate('/login');
  }

  const accuracy = todayCount > 0 ? Math.round((correctToday / todayCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white p-1 rounded"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center font-bold text-sm">
            SA
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Srikanth&apos;s Academy</p>
            <p className="text-xs text-orange-400 leading-tight">Foundation Course · {userInfo.batch}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center hidden sm:block">
            <p className="text-orange-400 font-bold text-base leading-tight">🔥 {streak}</p>
            <p className="text-xs text-gray-500">Streak</p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-blue-400 font-bold text-base leading-tight">{todayCount}</p>
            <p className="text-xs text-gray-500">Today</p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-green-400 font-bold text-base leading-tight">{accuracy}%</p>
            <p className="text-xs text-gray-500">Accuracy</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-300 hidden md:block">{userInfo.name}</span>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-1 rounded-lg ml-2"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <aside className="w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto flex-shrink-0">
            <div className="p-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 px-2 font-semibold">📚 Foundation Syllabus</p>
              {FOUNDATION_SYLLABUS.map((unit) => (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => {
                    setActiveUnit(unit);
                    setActiveTopic(unit.topics[0]);
                    setQuestion(null);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 text-sm transition-all flex items-start gap-2 ${
                    activeUnit.id === unit.id
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-semibold'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-base leading-tight mt-0.5">{unit.icon}</span>
                  <span className="leading-tight">
                    <span className="text-gray-600 text-xs mr-1">{unit.id}.</span>
                    {unit.name}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-y-auto p-5">
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{activeUnit.icon}</span>
              <div>
                <h2 className="text-xl font-bold">Unit {activeUnit.id}: {activeUnit.name}</h2>
                <p className="text-xs text-gray-500">Select a topic to practice</p>
              </div>
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
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-2xl">
            {!question && !loading && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-1">Ready to Practice?</h3>
                <p className="text-gray-400 text-sm mb-1">
                  Unit: <span className="text-orange-400">{activeUnit.name}</span>
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Topic: <span className="text-orange-400 font-semibold">{activeTopic}</span>
                </p>
                <button
                  type="button"
                  onClick={generateQuestion}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20"
                >
                  ✨ Generate Question
                </button>
              </div>
            )}

            {loading && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4 animate-pulse">⚙️</div>
                <p className="text-gray-400 text-sm">Generating your question...</p>
              </div>
            )}

            {question && 'error' in question && question.error && (
              <div className="bg-red-950/40 border border-red-800 rounded-2xl p-6 text-center">
                <p className="text-red-400 mb-4">⚠️ Failed to generate question. Check VITE_ANTHROPIC_API_KEY in .env</p>
                <button type="button" onClick={generateQuestion} className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-xl">
                  Try Again
                </button>
              </div>
            )}

            {question && !('error' in question) && !loading && (
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full border border-orange-500/30 font-medium">
                      {activeUnit.name}
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30">
                      {activeTopic}
                    </span>
                    <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
                      {question.difficulty || 'Medium'}
                    </span>
                    <span className="ml-auto text-gray-600 text-xs">Q#{todayCount}</span>
                  </div>
                  <p className="text-base font-medium leading-relaxed text-white">{question.question}</p>
                  {question.formula && (
                    <div className="mt-3 bg-gray-800 rounded-lg px-4 py-2 inline-block">
                      <p className="text-yellow-400 text-sm font-mono">{question.formula}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((key) => {
                    const opt = question.options?.[key];
                    if (!opt) return null;
                    let style =
                      'bg-gray-900 border-gray-700 text-white hover:border-orange-400/60 hover:bg-gray-800/80 cursor-pointer';
                    if (!revealed && selected === key)
                      style = 'bg-orange-500/20 border-orange-400 text-orange-200 cursor-pointer';
                    if (revealed) {
                      if (key === question.correct)
                        style = 'bg-green-500/20 border-green-500 text-green-200 cursor-default';
                      else if (key === selected)
                        style = 'bg-red-500/20 border-red-500 text-red-300 cursor-default';
                      else style = 'bg-gray-900 border-gray-800 text-gray-500 cursor-default opacity-60';
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
                                : 'bg-gray-800 text-gray-400'
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
                  <div className="bg-blue-950/40 border border-blue-800/50 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      <p className="text-blue-300 font-semibold text-sm">Explanation</p>
                      <span
                        className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                          selected === question.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {selected === question.correct ? '✓ Correct!' : '✗ Incorrect'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{question.explanation}</p>
                    {question.tip && (
                      <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-lg px-4 py-2">
                        <p className="text-yellow-300 text-sm">
                          🧠 <span className="font-semibold">Tip:</span> {question.tip}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={generateQuestion}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-sm"
                      >
                        Next Question →
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const idx = activeUnit.topics.indexOf(activeTopic);
                          const next = activeUnit.topics[(idx + 1) % activeUnit.topics.length];
                          setActiveTopic(next);
                          setQuestion(null);
                        }}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 px-4 rounded-xl transition-all text-sm border border-gray-700"
                      >
                        Switch Topic
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {todayCount > 0 && (
            <div className="max-w-2xl mt-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-sm text-gray-500 mb-3 font-semibold uppercase tracking-wider">📊 Today&apos;s Progress</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{todayCount}</p>
                    <p className="text-xs text-gray-500">Attempted</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">{correctToday}</p>
                    <p className="text-xs text-gray-500">Correct</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-400">{accuracy}%</p>
                    <p className="text-xs text-gray-500">Accuracy</p>
                  </div>
                </div>
                <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all"
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

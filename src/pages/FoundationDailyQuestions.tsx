import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { FOUNDATION_SYLLABUS, UNIT_ACCENTS } from '../lib/foundationSyllabus';
import {
  fetchApSubtopicCatalog,
  resolveFoundationToApSubtopic,
  type ApSubtopicRef,
} from '../lib/foundationApDailyQuestions';
import {
  difficultyLabelForLevel,
  fetchApHomeworkQaPool,
  homeworkDifficultyVariantsForLevel,
  type BasicsLevel,
} from '../lib/foundationApHomeworkQuestions';
import { normalizeDbRowToQAFields, type QADisplayFields } from '../lib/qaQuestionFromSupabase';
import { QAQuestionCard } from '../components/topics/QAQuestionCard';

export function FoundationDailyQuestions() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const authUser = useAuthStore((s) => s.user);

  const [activeUnit, setActiveUnit] = useState(FOUNDATION_SYLLABUS[0]);
  const [activeTopic, setActiveTopic] = useState(FOUNDATION_SYLLABUS[0].topics[0]);
  const [level, setLevel] = useState<BasicsLevel>('level_1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QADisplayFields[]>([]);
  const [resolvedAp, setResolvedAp] = useState<ApSubtopicRef | null>(null);
  const [usedFallbackDate, setUsedFallbackDate] = useState(false);

  const catalogRef = useRef<ApSubtopicRef[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      setQuestions([]);
      setResolvedAp(null);
      setUsedFallbackDate(false);
      try {
        if (!catalogRef.current) {
          catalogRef.current = await fetchApSubtopicCatalog(supabase);
        }
        const resolved = resolveFoundationToApSubtopic(activeUnit.name, activeTopic, catalogRef.current);
        if (cancelled) return;
        if (!resolved) {
          setError(
            'Could not match this Foundation unit to an AP Physics 1 subtopic. Try another topic or open AP Physics to confirm subtopic names.'
          );
          setLoading(false);
          return;
        }
        setResolvedAp(resolved);

        const today = new Date().toISOString().split('T')[0];
        const variants = homeworkDifficultyVariantsForLevel(level);
        const { rows, usedRecentFallback } = await fetchApHomeworkQaPool(
          supabase,
          resolved.topicId,
          resolved.subtopicName,
          today,
          variants
        );
        if (cancelled) return;

        setUsedFallbackDate(usedRecentFallback);

        const label = difficultyLabelForLevel(level);
        const qa = rows.slice(0, 10).map((r) => normalizeDbRowToQAFields(r, label));
        setQuestions(qa);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeUnit.id, activeTopic, level]);

  const activeAccent = UNIT_ACCENTS[(activeUnit.id - 1) % UNIT_ACCENTS.length];

  async function logout() {
    await signOut();
    navigate('/login');
  }

  const userName = authUser?.name?.trim() || 'Student';

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
          <div>
            <p className="font-bold text-sm leading-tight text-white">Daily Questions (Q&amp;A)</p>
            <p className="text-xs text-cyan-300 leading-tight">Same pool as AP Physics topic → Daily Questions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 hidden sm:inline">{userName}</span>
          <button
            type="button"
            onClick={() => void logout()}
            className="text-xs text-slate-400 hover:text-white border border-slate-600 px-3 py-1 rounded-lg"
          >
            Logout
          </button>
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
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl mb-1 text-sm transition-all flex items-start gap-2 border ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-200 border-cyan-500/40 font-semibold'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-white border-transparent'
                    }`}
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
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${activeAccent}22` }}
              >
                {activeUnit.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Unit {activeUnit.id}: {activeUnit.name}</h1>
                <p className="text-xs text-slate-400">Pick a Foundation topic — we match it to AP Physics 1 and load that subtopic&apos;s daily Q&amp;A.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {activeUnit.topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setActiveTopic(topic)}
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

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Difficulty</span>
              {(['level_1', 'level_2', 'level_3'] as const).map((lv) => (
                <button
                  key={lv}
                  type="button"
                  onClick={() => setLevel(lv)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    level === lv
                      ? 'border-cyan-500/60 bg-cyan-500/15 text-cyan-200'
                      : 'border-slate-600 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {lv === 'level_1' ? 'Foundation' : lv === 'level_2' ? 'Intermediate' : 'Advanced'}
                </button>
              ))}
            </div>

            {resolvedAp && (
              <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300">
                <p>
                  <span className="text-slate-500">Matched AP:</span>{' '}
                  <span className="text-cyan-300 font-medium">{resolvedAp.topicName}</span>
                  <span className="text-slate-500"> · </span>
                  <span className="text-white font-medium">{resolvedAp.subtopicName}</span>
                </p>
                {usedFallbackDate && (
                  <p className="mt-2 text-amber-200/90 text-xs">
                    No questions dated today for this subtopic — showing the most recent saved set from AP Daily Questions.
                  </p>
                )}
              </div>
            )}

            {loading && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-10 text-center">
                <p className="text-slate-400 text-sm animate-pulse">Loading AP Physics daily Q&amp;A…</p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-950/40 border border-red-800 rounded-2xl p-6 text-red-200 text-sm">{error}</div>
            )}

            {!loading && !error && questions.length === 0 && resolvedAp && (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center space-y-4">
                <p className="text-slate-300 text-sm">
                  No daily Q&amp;A questions in Supabase for this AP subtopic at the selected difficulty yet.
                </p>
                <p className="text-slate-500 text-xs max-w-md mx-auto">
                  Open <span className="text-cyan-400">AP Physics</span> → the same unit → expand your subtopic →
                  &quot;Daily Questions&quot; so the app can generate today&apos;s set (same as on the AP dashboard).
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/ap-physics')}
                  className="bg-cyan-700 hover:bg-cyan-600 text-white px-6 py-2 rounded-xl text-sm font-semibold"
                >
                  Open AP Physics topics
                </button>
              </div>
            )}

            {!loading && questions.length > 0 && (
              <div className="space-y-2">
                <p className="text-slate-400 text-sm mb-4">
                  {questions.length} question{questions.length === 1 ? '' : 's'} — use <strong className="text-white">Show Answer</strong> on each card (same content as AP).
                </p>
                {questions.map((q, index) => (
                  <QAQuestionCard
                    key={q.id}
                    question={q}
                    questionNumber={index + 1}
                    totalQuestions={questions.length}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

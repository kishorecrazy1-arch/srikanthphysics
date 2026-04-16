/**
 * Generic MCQ daily practice: pick any row in `dqe_*` (syllabus → subtopic), load `dqe_question` from Supabase.
 * Separate from Foundation’s unit/topic matcher — here the student chooses the exact engine subtopic.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import {
  adminDqeFetchSubjects,
  adminDqeFetchSubtopics,
  adminDqeFetchSyllabi,
  adminDqeFetchTopics,
} from '../lib/dqeAdminCatalogFromSupabase';
import {
  dqeQuestionRowId,
  dqeQuestionRowToGeneratedMcq,
  fetchDqeQuestionPoolForSubtopic,
  readFoundationDqeSeenSet,
  rememberFoundationDqeSeenId,
  type DqeSubtopicRef,
} from '../lib/foundationDqeDailyQuestions';
import type { DqeSubject, DqeSubtopic, DqeSyllabus, DqeTopic } from '../dailyEngine/types';

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;
const TOTAL_SESSION_QUESTIONS = 10;

function multiSyllabusSeenStorageKey(email: string, subtopicId: string, todayIso: string): string {
  const safe = email.replace(/[^a-z0-9@._+-]/gi, '_').slice(0, 120);
  const st = subtopicId.replace(/[^a-z0-9-]/gi, '_').slice(0, 80);
  return `multi_dqe_mc_seen_${safe}_${st}_${todayIso}`;
}

interface GeneratedQuestion {
  question: string;
  options: Record<'A' | 'B' | 'C' | 'D', string>;
  correct: string;
  explanation: string;
  difficulty?: string;
  examStyle?: string;
  sourceQuestionId?: string;
}

type QuestionGenError = { error: true; kind: 'no_questions' | 'api'; apiMessage?: string };

function formatExamBadgeLabel(examStyle: string | undefined): string | null {
  if (!examStyle?.trim()) return null;
  const u = examStyle.toUpperCase();
  if (u.includes('JEE')) return 'JEE';
  if (u.includes('NEET')) return 'NEET';
  if (u.includes('FOUNDATION')) return 'Foundation';
  if (u.includes('CBSE')) return 'CBSE';
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
      title="Syllabus label for this question"
    >
      [{label}]
    </span>
  );
}

function buildSubtopicRef(
  syllabi: DqeSyllabus[],
  subjects: DqeSubject[],
  topics: DqeTopic[],
  subtopics: DqeSubtopic[],
  syllabusId: string,
  subjectId: string,
  topicId: string,
  subtopicId: string
): DqeSubtopicRef | null {
  const y = syllabi.find((s) => s.id === syllabusId);
  const sub = subjects.find((s) => s.id === subjectId);
  const t = topics.find((x) => x.id === topicId);
  const st = subtopics.find((x) => x.id === subtopicId);
  if (!y || !sub || !t || !st) return null;
  return {
    subtopicId: st.id,
    subtopicName: st.name,
    subtopicSlug: st.slug,
    topicId: t.id,
    topicName: t.name,
    subjectId: sub.id,
    subjectName: sub.name,
    syllabusId: y.id,
    syllabusName: y.name,
    syllabusSlug: y.slug,
  };
}

export function MultiSyllabusDailyPractice() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const authUser = useAuthStore((s) => s.user);

  const [syllabi, setSyllabi] = useState<DqeSyllabus[]>([]);
  const [subjects, setSubjects] = useState<DqeSubject[]>([]);
  const [topics, setTopics] = useState<DqeTopic[]>([]);
  const [subtopics, setSubtopics] = useState<DqeSubtopic[]>([]);
  const [syllabusId, setSyllabusId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [subtopicId, setSubtopicId] = useState('');
  const [treeLoading, setTreeLoading] = useState(true);

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<GeneratedQuestion | QuestionGenError | null>(null);

  const orderedPoolRef = useRef<GeneratedQuestion[]>([]);
  const poolCacheKeyRef = useRef('');
  const sessionUsedIdsRef = useRef<string[]>([]);

  const email = (authUser?.email || localStorage.getItem('userEmail') || 'student').trim();
  const displayName = authUser?.name?.trim() || localStorage.getItem('userName') || 'Student';

  const meta = useMemo(
    () => buildSubtopicRef(syllabi, subjects, topics, subtopics, syllabusId, subjectId, topicId, subtopicId),
    [syllabi, subjects, topics, subtopics, syllabusId, subjectId, topicId, subtopicId]
  );

  const breadcrumb = useMemo(() => {
    if (!meta) return '';
    return `${meta.syllabusName} · ${meta.subjectName} · ${meta.topicName} · ${meta.subtopicName}`;
  }, [meta]);

  const resetPoolAndSession = useCallback(() => {
    orderedPoolRef.current = [];
    poolCacheKeyRef.current = '';
    sessionUsedIdsRef.current = [];
    setSessionActive(false);
    setSessionComplete(false);
    setCurrentQuestionNumber(1);
    setAnsweredCount(0);
    setCorrectCount(0);
    setSelected(null);
    setRevealed(false);
    setQuestion(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setTreeLoading(true);
      try {
        const rows = await adminDqeFetchSyllabi(supabase);
        if (cancelled) return;
        setSyllabi(rows);
        setSyllabusId((prev) => prev || rows[0]?.id || '');
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setTreeLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!syllabusId) return;
    void (async () => {
      try {
        const rows = await adminDqeFetchSubjects(supabase, syllabusId);
        setSubjects(rows);
        setSubjectId(rows[0]?.id || '');
        setTopics([]);
        setSubtopics([]);
        setTopicId('');
        setSubtopicId('');
        resetPoolAndSession();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [syllabusId, resetPoolAndSession]);

  useEffect(() => {
    if (!subjectId) return;
    void (async () => {
      try {
        const rows = await adminDqeFetchTopics(supabase, subjectId);
        setTopics(rows);
        setTopicId(rows[0]?.id || '');
        setSubtopics([]);
        setSubtopicId('');
        resetPoolAndSession();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [subjectId, resetPoolAndSession]);

  useEffect(() => {
    if (!topicId) return;
    void (async () => {
      try {
        const rows = await adminDqeFetchSubtopics(supabase, topicId);
        setSubtopics(rows);
        setSubtopicId(rows[0]?.id || '');
        resetPoolAndSession();
      } catch (e) {
        console.error(e);
      }
    })();
  }, [topicId, resetPoolAndSession]);

  useEffect(() => {
    resetPoolAndSession();
  }, [subtopicId, resetPoolAndSession]);

  async function generateQuestion() {
    if (!meta || !subtopicId) return;
    setLoading(true);
    setSelected(null);
    setRevealed(false);
    setQuestion(null);

    try {
      const today = new Date().toISOString().split('T')[0];
      const poolKey = `multi|${subtopicId}|${today}`;
      if (poolCacheKeyRef.current !== poolKey || orderedPoolRef.current.length === 0) {
        const rows = await fetchDqeQuestionPoolForSubtopic(supabase, subtopicId, today);
        const seenRow = new Set<string>();
        const ordered: GeneratedQuestion[] = [];
        for (const r of rows) {
          const id = dqeQuestionRowId(r);
          const g = dqeQuestionRowToGeneratedMcq(r, meta);
          if (!g || !id || seenRow.has(id)) continue;
          seenRow.add(id);
          ordered.push(g as GeneratedQuestion);
        }
        orderedPoolRef.current = ordered;
        poolCacheKeyRef.current = poolKey;
      }

      const seenKey = multiSyllabusSeenStorageKey(email, subtopicId, today);
      const alreadyToday = readFoundationDqeSeenSet(seenKey);
      const used = new Set([...sessionUsedIdsRef.current, ...alreadyToday]);
      const next = orderedPoolRef.current.find((g) => g.sourceQuestionId && !used.has(g.sourceQuestionId));

      if (!next?.sourceQuestionId) {
        setQuestion({
          error: true,
          kind: 'no_questions',
          apiMessage:
            orderedPoolRef.current.length === 0
              ? 'No `dqe_question` rows for this subtopic yet. Generate them in /admin/daily-question-engine (or your FastAPI batch).'
              : 'You have used the available questions for this subtopic today. Pick another subtopic, another date, or generate more in the admin engine.',
        });
        setLoading(false);
        return;
      }

      sessionUsedIdsRef.current = [...sessionUsedIdsRef.current, next.sourceQuestionId];
      rememberFoundationDqeSeenId(seenKey, next.sourceQuestionId);
      setQuestion(next);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setQuestion({ error: true, kind: 'api', apiMessage: msg });
    }
    setLoading(false);
  }

  function startSession() {
    if (!subtopicId || !meta) return;
    sessionUsedIdsRef.current = [];
    setSessionActive(true);
    setSessionComplete(false);
    setCurrentQuestionNumber(1);
    setAnsweredCount(0);
    setCorrectCount(0);
    void generateQuestion();
  }

  function finalizeSession() {
    setSessionActive(false);
    setSessionComplete(true);
    setQuestion(null);
    setSelected(null);
    setRevealed(false);
  }

  function handleNext() {
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
    if (opt === question.correct) setCorrectCount((n) => n + 1);
  }

  const sessionAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-col">
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-white p-1 rounded flex items-center gap-1"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-xs shadow-lg">
            DQE
          </div>
          <div>
            <p className="font-bold text-sm text-white">Multi-syllabus daily practice</p>
            <p className="text-xs text-indigo-200/90">`dqe_*` catalog · same pool as admin engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden sm:inline">{displayName}</span>
          <button
            type="button"
            onClick={() => void signOut().then(() => navigate('/login'))}
            className="text-xs text-slate-400 hover:text-white border border-slate-600 px-3 py-1 rounded-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto p-5 max-w-3xl mx-auto w-full space-y-6">
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-white">1. Choose subtopic</h2>
          {treeLoading ? (
            <p className="text-slate-400 text-sm">Loading catalog…</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-slate-400 block mb-1">Syllabus</span>
                <select
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                  value={syllabusId}
                  onChange={(e) => setSyllabusId(e.target.value)}
                >
                  {syllabi.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.kind})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-slate-400 block mb-1">Subject</span>
                <select
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-slate-400 block mb-1">Topic</span>
                <select
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-slate-400 block mb-1">Subtopic</span>
                <select
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                  value={subtopicId}
                  onChange={(e) => setSubtopicId(e.target.value)}
                >
                  {subtopics.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          {breadcrumb && <p className="text-xs text-slate-500 break-words">{breadcrumb}</p>}
          {!sessionActive && !sessionComplete && (
            <button
              type="button"
              disabled={!subtopicId || treeLoading}
              onClick={startSession}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 px-8 rounded-xl disabled:opacity-40"
            >
              Start {TOTAL_SESSION_QUESTIONS}-question session
            </button>
          )}
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-10 text-center">
            <p className="text-slate-400 text-sm">Loading question…</p>
          </div>
        )}

        {question && 'error' in question && question.error && (
          <div className="rounded-xl border border-red-800 bg-red-950/40 p-6 text-center space-y-3">
            <p className="text-red-300 font-medium">⚠️ {question.kind === 'no_questions' ? 'No questions' : 'Error'}</p>
            <p className="text-slate-400 text-sm">{question.apiMessage}</p>
            <button
              type="button"
              onClick={() => void generateQuestion()}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/daily-question-engine')}
              className="block w-full text-cyan-400 text-sm hover:underline"
            >
              Open Daily Question Engine
            </button>
          </div>
        )}

        {question && !('error' in question) && !loading && sessionActive && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <ExamStyleBadge examStyle={question.examStyle} />
                <span className="text-slate-400 text-xs">
                  Q{currentQuestionNumber} of {TOTAL_SESSION_QUESTIONS}
                </span>
                {question.difficulty && (
                  <span className="text-xs px-2 py-0.5 rounded-full border border-slate-600 text-slate-300">
                    {question.difficulty}
                  </span>
                )}
              </div>
              <p className="text-base font-medium text-white whitespace-pre-wrap leading-relaxed">{question.question}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OPTION_KEYS.map((key, idx) => {
                const opt = question.options[key];
                const num = idx + 1;
                let style =
                  'bg-slate-800/40 border-slate-600/50 text-white hover:border-indigo-400/50 hover:bg-slate-800/80 cursor-pointer';
                if (!revealed && selected === key) style = 'bg-indigo-500/15 border-indigo-400 text-indigo-100 cursor-pointer';
                if (revealed) {
                  if (key === question.correct) style = 'bg-green-500/20 border-green-500 text-green-200 cursor-default';
                  else if (key === selected) style = 'bg-red-500/20 border-red-500 text-red-300 cursor-default';
                  else style = 'bg-slate-900/50 border-slate-700 text-slate-500 cursor-default opacity-60';
                }
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleAnswer(key)}
                    className={`text-left p-3 sm:p-4 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-3 min-h-[3.25rem] ${style}`}
                  >
                    <span className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center shrink-0">
                      {num})
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 space-y-3">
                <p className="text-indigo-300 font-semibold text-sm">Explanation</p>
                <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{question.explanation}</p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-2.5 rounded-xl text-sm"
                >
                  {currentQuestionNumber >= TOTAL_SESSION_QUESTIONS ? 'Finish session' : 'Next question'}
                </button>
              </div>
            )}
          </div>
        )}

        {sessionComplete && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8 text-center">
            <div className="text-4xl mb-2">🏁</div>
            <h3 className="text-xl font-bold text-white mb-2">Session complete</h3>
            <p className="text-slate-300 mb-4">
              <span className="text-green-400 font-semibold">{correctCount}</span> / {TOTAL_SESSION_QUESTIONS} correct
              {' · '}
              <span className="text-indigo-300">{sessionAccuracy}%</span> this session
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={startSession}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-2.5 px-6 rounded-xl"
              >
                Same subtopic again
              </button>
              <button
                type="button"
                onClick={() => {
                  resetPoolAndSession();
                }}
                className="border border-slate-600 text-slate-300 py-2.5 px-6 rounded-xl hover:bg-slate-800"
              >
                Change subtopic above
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

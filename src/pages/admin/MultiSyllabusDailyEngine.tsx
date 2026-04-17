/**
 * Admin UI: multi-syllabus daily MCQ engine.
 * - Catalog + stored questions: read from Supabase `dqe_*` (works on Vercel without Python).
 * - Generate: POST to FastAPI — dev: Vite proxy `/daily-engine-api`; prod: same-origin `/api/daily-engine/*`
 *   (Vercel serverless → Render, set `DAILY_ENGINE_URL` on Vercel) or direct `VITE_DAILY_ENGINE_API` if set.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  adminDqeFetchQuestions,
  adminDqeFetchSubjects,
  adminDqeFetchSubtopics,
  adminDqeFetchSyllabi,
  adminDqeFetchTopics,
} from '../../lib/dqeAdminCatalogFromSupabase';
import type {
  DailyBatchResponse,
  DqeQuestionRow,
  DqeSubject,
  DqeSubtopic,
  DqeSyllabus,
  DqeTopic,
  DailyDifficulty,
} from '../../dailyEngine/types';

/** Base URL for POST /v1/generate (and batch). Prod defaults to Vercel proxy to avoid browser CORS on Render. */
function engineBaseForGenerate(): string {
  if (import.meta.env.DEV) return '/daily-engine-api';
  const raw = (import.meta as ImportMeta & { env?: { VITE_DAILY_ENGINE_API?: string } }).env?.VITE_DAILY_ENGINE_API?.trim();
  if (raw) return raw.replace(/\/$/, '');
  return '/api/daily-engine';
}

async function engineAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function MultiSyllabusDailyEngine() {
  const [syllabi, setSyllabi] = useState<DqeSyllabus[]>([]);
  const [subjects, setSubjects] = useState<DqeSubject[]>([]);
  const [topics, setTopics] = useState<DqeTopic[]>([]);
  const [subtopics, setSubtopics] = useState<DqeSubtopic[]>([]);
  const [syllabusId, setSyllabusId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [subtopicId, setSubtopicId] = useState('');
  const [difficulty, setDifficulty] = useState<DailyDifficulty>('medium');
  const [count, setCount] = useState(7);
  const [forDate, setForDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loadingTree, setLoadingTree] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [questions, setQuestions] = useState<DqeQuestionRow[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [batchOnlyMissing, setBatchOnlyMissing] = useState(true);
  const [batchMaxSubtopics, setBatchMaxSubtopics] = useState(25);
  const [batchSyllabusSlug, setBatchSyllabusSlug] = useState('');
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<DailyBatchResponse | null>(null);

  const loadSyllabi = useCallback(async () => {
    setLoadingTree(true);
    setErr(null);
    try {
      const rows = await adminDqeFetchSyllabi(supabase);
      setSyllabi(rows);
      setSyllabusId((prev) => prev || rows[0]?.id || '');
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingTree(false);
    }
  }, []);

  useEffect(() => {
    void loadSyllabi();
  }, [loadSyllabi]);

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
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [syllabusId]);

  useEffect(() => {
    if (!subjectId) return;
    void (async () => {
      try {
        const rows = await adminDqeFetchTopics(supabase, subjectId);
        setTopics(rows);
        setTopicId(rows[0]?.id || '');
        setSubtopics([]);
        setSubtopicId('');
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [subjectId]);

  useEffect(() => {
    if (!topicId) return;
    void (async () => {
      try {
        const rows = await adminDqeFetchSubtopics(supabase, topicId);
        setSubtopics(rows);
        setSubtopicId(rows[0]?.id || '');
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [topicId]);

  const refreshQuestions = useCallback(async () => {
    if (!subtopicId) return;
    try {
      const rows = await adminDqeFetchQuestions(supabase, subtopicId, forDate);
      setQuestions(rows);
    } catch {
      setQuestions([]);
    }
  }, [subtopicId, forDate]);

  useEffect(() => {
    void refreshQuestions();
  }, [refreshQuestions]);

  const canGenerate = useMemo(() => Boolean(subtopicId && !genLoading), [subtopicId, genLoading]);

  async function handleGenerate() {
    if (!subtopicId) return;
    const base = engineBaseForGenerate();
    setGenLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${base}/v1/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await engineAuthHeaders()) },
        body: JSON.stringify({
          subtopic_id: subtopicId,
          difficulty,
          count,
          for_date: forDate,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || res.statusText);
      }
      await res.json().catch(() => ({}));
      await refreshQuestions();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setGenLoading(false);
    }
  }

  async function handleDailyBatch() {
    const base = engineBaseForGenerate();
    setBatchLoading(true);
    setErr(null);
    setBatchResult(null);
    try {
      const res = await fetch(`${base}/v1/generate/daily-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(await engineAuthHeaders()) },
        body: JSON.stringify({
          for_date: forDate,
          difficulty,
          count,
          syllabus_slug: batchSyllabusSlug.trim() || null,
          only_missing: batchOnlyMissing,
          max_subtopics: batchMaxSubtopics,
        }),
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || res.statusText);
      }
      const data = JSON.parse(text) as DailyBatchResponse;
      setBatchResult(data);
      await refreshQuestions();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBatchLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Daily Question Engine</h1>
            <p className="text-sm text-slate-400 mt-1">
              Syllabus tree and stored questions load from Supabase. Generating new MCQs calls the Python FastAPI
              service via the dev proxy, or on Vercel via <code className="text-slate-300">/api/daily-engine</code>{' '}
              (set <code className="text-slate-300">DAILY_ENGINE_URL</code> on Vercel), unless{' '}
              <code className="text-slate-300">VITE_DAILY_ENGINE_API</code> overrides with a direct URL.
            </p>
          </div>
          <Link to="/dashboard" className="text-cyan-400 text-sm hover:underline">
            Back to dashboard
          </Link>
        </div>

        {err && (
          <div className="rounded-lg border border-red-800 bg-red-950/50 text-red-200 text-sm p-4 whitespace-pre-wrap">
            {err}
            <p className="text-xs text-red-300 mt-2">
              If this is a catalog/Supabase error, check migrations and RLS. For generation: run{' '}
              <code className="text-red-100">cd python/daily_question_engine &amp;&amp; uvicorn app.main:app --port 8000</code>{' '}
              with <code className="text-red-100">npm run dev</code>, or on Vercel set <code className="text-red-100">DAILY_ENGINE_URL</code>{' '}
              (proxy) / <code className="text-red-100">VITE_DAILY_ENGINE_API</code> (direct).
            </p>
          </div>
        )}

        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="text-slate-400 block mb-1">Syllabus</span>
              <select
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                value={syllabusId}
                onChange={(e) => setSyllabusId(e.target.value)}
                disabled={loadingTree}
              >
                {syllabi.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
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

          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block text-sm">
              <span className="text-slate-400 block mb-1">Difficulty</span>
              <select
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DailyDifficulty)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-slate-400 block mb-1">Count (5–10)</span>
              <input
                type="number"
                min={5}
                max={10}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-400 block mb-1">For date</span>
              <input
                type="date"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                value={forDate}
                onChange={(e) => setForDate(e.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            disabled={!canGenerate}
            onClick={() => void handleGenerate()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 font-semibold disabled:opacity-40"
          >
            {genLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Generate daily questions
          </button>
        </div>

        <div className="rounded-xl border border-indigo-800/60 bg-slate-900/50 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Multi-syllabus daily batch</h2>
            <p className="text-sm text-slate-400 mt-1">
              Calls <code className="text-slate-300">POST /v1/generate/daily-batch</code> on the FastAPI engine. It walks
              subtopics (all syllabi or one syllabus) and generates the same <code className="text-slate-300">count</code>{' '}
              MCQs per subtopic for the <strong>for date</strong> above, using the same difficulty. With{' '}
              <strong>only subtopics below target</strong> on, a subtopic is skipped if it already has at least{' '}
              <code className="text-slate-300">count</code> rows for that date. Cap each HTTP run with{' '}
              <strong>max subtopics</strong> (run again or use cron to cover the full catalog).
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm">
              <span className="text-slate-400 block mb-1">Syllabus filter (slug)</span>
              <select
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                value={batchSyllabusSlug}
                onChange={(e) => setBatchSyllabusSlug(e.target.value)}
                disabled={batchLoading}
              >
                <option value="">All syllabi</option>
                {syllabi.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name} ({s.slug})
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-slate-400 block mb-1">Max subtopics this run</span>
              <input
                type="number"
                min={1}
                max={150}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2"
                value={batchMaxSubtopics}
                onChange={(e) => setBatchMaxSubtopics(Number(e.target.value))}
                disabled={batchLoading}
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={batchOnlyMissing}
              onChange={(e) => setBatchOnlyMissing(e.target.checked)}
              disabled={batchLoading}
              className="rounded border-slate-600"
            />
            Only subtopics below target count for this date (recommended)
          </label>
          <button
            type="button"
            disabled={batchLoading}
            onClick={() => void handleDailyBatch()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold disabled:opacity-40"
          >
            {batchLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Run daily batch (engine)
          </button>
          {batchResult && (
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3 text-xs text-slate-300 overflow-x-auto">
              <p className="text-slate-200 font-medium mb-2">
                Batch finished: {batchResult.succeeded} ok, {batchResult.failed} failed,{' '}
                {batchResult.selected_subtopics} subtopics selected for {batchResult.for_date}
              </p>
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(batchResult.results, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Stored questions ({questions.length})</h2>
          {questions.map((q) => {
            const opts = Array.isArray(q.options) ? q.options : [];
            const open = openId === q.id;
            return (
              <div key={q.id} className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-slate-100 font-medium flex-1">{q.question_text}</p>
                  <span className="text-xs text-cyan-300 border border-cyan-800 rounded px-2 py-0.5 shrink-0">
                    {q.difficulty}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-slate-300">
                  {opts.map((o) => (
                    <li key={o.id}>
                      <span className="font-mono text-cyan-400">{o.id}.</span> {o.text}
                      {o.isCorrect ? <span className="text-green-400 ml-2">✓</span> : null}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-3 w-full flex items-center justify-between text-sm text-cyan-300 border border-slate-600 rounded-lg px-3 py-2 hover:bg-slate-800/80"
                  onClick={() => setOpenId(open ? null : q.id)}
                >
                  <span>{open ? 'Hide explanation' : 'Show explanation'}</span>
                  {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {open && (
                  <pre className="mt-2 text-xs text-slate-400 overflow-x-auto bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    {JSON.stringify(q.explanation, null, 2)}
                  </pre>
                )}
              </div>
            );
          })}
          {questions.length === 0 && (
            <p className="text-slate-500 text-sm">No questions for this subtopic and date yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

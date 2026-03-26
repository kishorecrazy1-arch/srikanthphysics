import { useMemo, useState } from 'react';
import { Download, Target, Zap, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FOUNDATION_SYLLABUS } from '../lib/foundationSyllabus';
import { getFoundationTopicProgress, getFoundationExamHistory } from '../lib/foundationStorage';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const defaultTopicColors = ['#10b981', '#3b82f6', '#f59e0b', '#f97316', '#ef4444', '#8b5cf6', '#14b8a6'];

export function FoundationAnalytics() {
  const [timeFilter, setTimeFilter] = useState('7days');
  const topicProgress = getFoundationTopicProgress();
  const examHistory = getFoundationExamHistory();

  const filteredExams = useMemo(() => {
    const now = Date.now();
    const maxAgeMs =
      timeFilter === '7days'
        ? 7 * 24 * 60 * 60 * 1000
        : timeFilter === '30days'
          ? 30 * 24 * 60 * 60 * 1000
          : timeFilter === '90days'
            ? 90 * 24 * 60 * 60 * 1000
            : Number.POSITIVE_INFINITY;
    return examHistory.filter((exam) => now - new Date(exam.submittedAt).getTime() <= maxAgeMs);
  }, [examHistory, timeFilter]);

  const totals = useMemo(() => {
    const examsTaken = filteredExams.length;
    const answered = filteredExams.reduce((sum, exam) => sum + exam.answered, 0);
    const correct = filteredExams.reduce((sum, exam) => sum + exam.correct, 0);
    const totalTimeSeconds = filteredExams.reduce((sum, exam) => sum + (exam.timeSpentSeconds ?? 0), 0);
    const overallScore = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    const avgTimePerQuestionSeconds = answered > 0 ? Math.round(totalTimeSeconds / answered) : 0;
    return { examsTaken, answered, correct, overallScore, avgTimePerQuestionSeconds };
  }, [filteredExams]);

  const weeklyData = useMemo(() => {
    const grouped = new Map<string, { label: string; correct: number; answered: number }>();
    filteredExams.forEach((exam) => {
      const date = new Date(exam.submittedAt);
      const key = date.toISOString().slice(0, 10);
      const label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const cur = grouped.get(key) ?? { label, correct: 0, answered: 0 };
      cur.correct += exam.correct;
      cur.answered += exam.answered;
      grouped.set(key, cur);
    });

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([, value]) => ({
        day: value.label,
        score: value.answered > 0 ? Math.round((value.correct / value.answered) * 100) : 0,
      }));
  }, [filteredExams]);

  const topicData = useMemo(() => {
    return FOUNDATION_SYLLABUS
      .map((u, i) => ({
        topic: u.name.length > 14 ? `${u.name.slice(0, 12)}…` : u.name,
        score: topicProgress[u.name] ?? 0,
        color: defaultTopicColors[i % defaultTopicColors.length],
      }))
      .filter((item) => item.score > 0);
  }, [topicProgress]);

  const latestExam = filteredExams.length > 0 ? filteredExams[0] : null;
  const avgTimeText =
    totals.avgTimePerQuestionSeconds > 0
      ? `${Math.floor(totals.avgTimePerQuestionSeconds / 60)}:${String(totals.avgTimePerQuestionSeconds % 60).padStart(2, '0')}`
      : '--:--';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/foundation-dashboard"
          className="inline-block text-cyan-300 hover:text-white text-sm font-medium mb-4"
        >
          ← Back to Foundation Dashboard
        </Link>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Performance Analytics</h1>
            <p className="text-slate-300">Detailed insights into your Foundation journey</p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totals.overallScore}%</div>
            <div className="text-sm text-slate-300">Overall Score</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Target className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totals.answered}</div>
            <div className="text-sm text-slate-300">Questions Attempted</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totals.examsTaken}</div>
            <div className="text-sm text-slate-300">Exams Submitted</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{avgTimeText}</div>
            <div className="text-sm text-slate-300">Avg Time/Question</div>
          </div>
        </div>

        {filteredExams.length === 0 && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 mb-6 text-center">
            <p className="text-white font-semibold mb-2">No exam performance data found for this period.</p>
            <p className="text-slate-300 text-sm">
              Submit a mock test to populate analytics with real scores.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Weekly Performance</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px',
                      color: '#ffffff'
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Topic Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topicData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="topic" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px',
                      color: '#ffffff'
                    }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-white mb-4">Latest Exam</h2>
              {latestExam ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Date</span>
                    <span className="text-white font-semibold">
                      {new Date(latestExam.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Type</span>
                    <span className="text-white font-semibold">{latestExam.examType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Score</span>
                    <span className="text-green-400 font-bold">{latestExam.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Correct / Attempted</span>
                    <span className="text-white font-semibold">
                      {latestExam.correct} / {latestExam.answered}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 text-sm">No exam submissions available.</p>
              )}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Exam Scores</h2>
              <div className="space-y-2">
                {filteredExams.slice(0, 5).map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between bg-slate-900/40 rounded-lg px-3 py-2">
                    <span className="text-sm text-slate-300">
                      {new Date(exam.submittedAt).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {exam.correct}/{exam.answered} ({exam.accuracy}%)
                    </span>
                  </div>
                ))}
                {filteredExams.length === 0 && (
                  <p className="text-sm text-slate-300">No exam records for this time range.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

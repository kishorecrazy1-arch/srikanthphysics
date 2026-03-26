import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Move,
  LineChart,
  ClipboardList,
  BarChart3,
  LogOut,
  CheckCircle,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { FOUNDATION_SYLLABUS } from '../lib/foundationSyllabus';

function getUserInfoFromStorage() {
  return {
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    batch: localStorage.getItem('userBatch') || 'Foundation Batch',
    course: localStorage.getItem('userCourse') || 'Foundation',
  };
}

const SECTIONS = [
  {
    to: '/foundation-dashboard/practice',
    title: 'Daily Practice',
    desc: 'AI-generated MCQs for every unit and topic',
    icon: Sparkles,
    gradient: 'from-cyan-600 to-blue-600',
  },
  {
    to: '/foundation-dashboard/simulator',
    title: 'Motion Simulator',
    desc: 'Projectile motion — same engine as AP Physics',
    icon: Move,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    to: '/foundation-dashboard/graph-mastery',
    title: 'Graph Mastery',
    desc: 'Velocity, position & acceleration graph questions',
    icon: LineChart,
    gradient: 'from-teal-600 to-cyan-500',
  },
  {
    to: '/foundation-dashboard/mock-test',
    title: 'Mock Test',
    desc: '50 questions · 90 minutes · Foundation syllabus',
    icon: ClipboardList,
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    to: '/foundation-dashboard/analytics',
    title: 'Performance Analytics',
    desc: 'Progress, skills radar, and topic breakdown',
    icon: BarChart3,
    gradient: 'from-blue-600 to-violet-600',
  },
];

export default function FoundationDashboard() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const authUser = useAuthStore((s) => s.user);

  const stored = getUserInfoFromStorage();
  const userInfo = {
    name: stored.name || authUser?.name || 'Student',
    email: stored.email || authUser?.email || '',
    batch: stored.batch,
    course: stored.course,
  };

  const stats = useMemo(() => {
    const email = userInfo.email || 'student';
    const today = new Date().toDateString();
    const todayCount = parseInt(
      localStorage.getItem(`foundation_today_${email}_${today}`) || '0',
      10
    );
    const correct = parseInt(
      localStorage.getItem(`foundation_correct_${email}_${today}`) || '0',
      10
    );
    const streak = parseInt(localStorage.getItem(`foundation_streak_${email}`) || localStorage.getItem('foundationStreak') || '0', 10);
    const acc = todayCount > 0 ? Math.round((correct / todayCount) * 100) : 0;
    const mastered = FOUNDATION_SYLLABUS.filter((u) => {
      const raw = localStorage.getItem('foundationTopicProgress');
      if (!raw) return false;
      try {
        const p = JSON.parse(raw) as Record<string, number>;
        return (p[u.name] ?? 0) >= 80;
      } catch {
        return false;
      }
    }).length;
    return { todayCount, correct, streak, acc, mastered: mastered || 0 };
  }, [userInfo.email]);

  async function logout() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-4 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-lg">Srikanth&apos;s Academy</p>
            <p className="text-xs text-cyan-300">
              {userInfo.name} · {userInfo.batch}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <p className="text-cyan-400 font-bold text-lg">{stats.streak}</p>
            <p className="text-xs text-slate-400">Streak</p>
          </div>
          <div className="text-center">
            <p className="text-blue-400 font-bold text-lg">{stats.todayCount}</p>
            <p className="text-xs text-slate-400">Today</p>
          </div>
          <div className="text-center">
            <p className="text-green-400 font-bold text-lg">{stats.acc}%</p>
            <p className="text-xs text-slate-400">Accuracy</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 text-sm border border-slate-600 px-3 py-2 rounded-lg hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Foundation Course Dashboard</h1>
          <p className="text-slate-400 text-lg">
            Same tools as AP Physics — tailored to your Foundation syllabus ({FOUNDATION_SYLLABUS.length} units).
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">Your progress overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">{stats.mastered}</div>
              <div className="text-sm text-slate-300">Units strong (80%+)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">
                {Math.max(0, FOUNDATION_SYLLABUS.length - stats.mastered)}
              </div>
              <div className="text-sm text-slate-300">Units to build</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-300">
                {FOUNDATION_SYLLABUS.length}
              </div>
              <div className="text-sm text-slate-400">Total units</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{stats.acc}%</div>
              <div className="text-sm text-slate-300">Today accuracy</div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Topics &amp; tools</h2>
        <p className="text-slate-400 mb-6">Jump into any section — same dark theme as AP Physics.</p>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Today&apos;s Tasks</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/30 rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/60 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Morning Pulse</h3>
              </div>
              <p className="text-slate-300 mb-4 text-sm">Quick warmup to start your Foundation practice.</p>
              <Link
                to="/foundation-dashboard/practice"
                className="inline-flex w-full justify-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Start
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/30 rounded-xl p-6 border border-green-500/30 hover:border-green-400/60 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Daily Homework</h3>
              </div>
              <p className="text-slate-300 mb-2 text-sm">Complete a 10-question Foundation homework session.</p>
              <p className="text-xs text-green-300 mb-4">
                Today: {stats.todayCount} attempted, {stats.correct} correct
              </p>
              <Link
                to="/foundation-dashboard/homework"
                className="inline-flex w-full justify-center bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Start Homework
              </Link>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/30 rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/60 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Challenge Test</h3>
              </div>
              <p className="text-slate-300 mb-4 text-sm">Take the timed mock test and measure exam readiness.</p>
              <Link
                to="/foundation-dashboard/mock-test"
                className="inline-flex w-full justify-center bg-gradient-to-r from-yellow-600 to-orange-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Start Challenge
              </Link>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.to}
                to={s.to}
                className={`group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/40 transition-all hover:shadow-lg hover:shadow-cyan-500/10`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                  {s.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

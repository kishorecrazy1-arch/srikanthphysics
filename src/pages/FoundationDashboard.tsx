import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function getUserInfoFromStorage() {
  return {
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    batch: localStorage.getItem('userBatch') || 'Foundation Batch',
    course: localStorage.getItem('userCourse') || 'Foundation',
  };
}

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
    const streak = parseInt(
      localStorage.getItem(`foundation_streak_${email}`) || localStorage.getItem('foundationStreak') || '0',
      10
    );
    const acc = todayCount > 0 ? Math.round((correct / todayCount) * 100) : 0;
    return { todayCount, correct, streak, acc };
  }, [userInfo.email]);

  async function logout() {
    await signOut();
    navigate('/login');
  }

  const practiceHref = '/foundation-dashboard/practice?foundationLlm=1';

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

      <div className="max-w-2xl mx-auto px-4 py-14">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">Foundation</h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          Level 2 (Intermediate) MCQs for Class 9–11 — IIT JEE / NEET style. Questions are generated live from your
          syllabus unit and topic.
        </p>

        <Link
          to={practiceHref}
          className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/50 to-slate-900/80 p-8 shadow-[0_0_40px_-12px_rgba(34,211,238,0.35)] hover:border-cyan-400/70 transition-all"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shrink-0">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-100 transition-colors">
              Level 2 daily practice
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pick a unit and topic, then practice ten questions. Uses the on-server generator (
              <code className="text-cyan-200/90 text-xs">/api/foundation-question</code>
              ).
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center justify-center rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white sm:self-center group-hover:bg-cyan-500 transition-colors">
            Start →
          </span>
        </Link>

        <p className="mt-8 text-center text-xs text-slate-500">
          Today: {stats.todayCount} attempted · {stats.correct} correct
        </p>
      </div>
    </div>
  );
}

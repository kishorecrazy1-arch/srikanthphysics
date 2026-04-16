import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, ArrowRight, LogOut, Layers } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

/**
 * After OAuth or email sign-in: pick AP Physics or Foundation (no auto-routing by profile).
 */
export function PostSignIn() {
  const navigate = useNavigate();
  const { user, loading, emailVerified, signOut } = useAuthStore();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    if (emailVerified === false) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, emailVerified, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-gray-600">Signing you in…</p>
        </div>
      </div>
    );
  }

  if (emailVerified === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-gray-600">Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <p className="text-center text-blue-200/90 text-sm font-medium tracking-wide uppercase mb-2">
          Welcome{user.name ? `, ${user.name.split(' ')[0]}` : ''}
        </p>
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-white mb-2">
          Where would you like to go?
        </h1>
        <p className="text-center text-slate-400 mb-10 text-sm sm:text-base">
          Choose your program. You can switch anytime from the site navigation.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => navigate('/ap-physics', { replace: true })}
            className="group text-left rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600 to-cyan-600 p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-7 h-7" />
              </div>
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">AP Physics</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Topics, practice, simulators, and the AP Physics 1 learning hub.
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/daily-practice', { replace: true })}
            className="group text-left rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <Layers className="w-7 h-7" />
              </div>
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">Multi-syllabus daily</h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Pick syllabus → subtopic and run 10 MCQs from the shared `dqe_*` question bank.
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/foundation-dashboard', { replace: true })}
            className="group text-left rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-600 to-orange-600 p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-7 h-7" />
              </div>
              <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">Foundation</h2>
            <p className="text-amber-100 text-sm leading-relaxed">
              Foundation course dashboard, daily practice, and batch tools.
            </p>
          </button>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

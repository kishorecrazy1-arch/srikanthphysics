import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, User, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function ApprovalPending() {
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);

  const userName = useMemo(() => localStorage.getItem('userName') || 'Student', []);
  const userCourse = useMemo(() => localStorage.getItem('userCourse') || 'Not assigned yet', []);

  async function handleLogout() {
    try {
      await signOut();
    } catch (_) {
      // Continue cleanup even if Supabase signout fails
    }
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userCourse');
    localStorage.removeItem('userBatch');
    localStorage.removeItem('courseType');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Account Is Pending Approval</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Our team will review and approve your account shortly.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
          <p className="text-blue-900 font-medium mb-2">
            You&apos;ll be able to access your dashboard once approved.
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>
                <span className="font-semibold">Name:</span> {userName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>
                <span className="font-semibold">Course:</span> {userCourse}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Back to Login
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

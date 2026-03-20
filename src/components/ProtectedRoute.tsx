import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ApprovalRequired } from '../pages/ApprovalRequired';
import { EmailConfirmationRequired } from '../pages/EmailConfirmationRequired';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, loading, emailVerified, approved, approvalRedirectTo, approvalCourseType, approvalUser } = useAuthStore();

  // Check for test mode - bypasses all subscription checks
  const testMode = typeof window !== 'undefined' && localStorage.getItem('testMode') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Test mode: Skip all checks and grant full access
  if (testMode) {
    return <>{children}</>;
  }

  // Check email confirmation first - if not verified, show email confirmation page
  if (emailVerified === false) {
    return <EmailConfirmationRequired />;
  }

  // Check approval status from Google Sheet (via n8n)
  // approved can be: null (checking), true (approved), false (not approved)
  if (approved === false) {
    return <ApprovalRequired />;
  }

  // If approval status is still being checked (null), show loading
  if (approved === null && emailVerified === true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Checking approval status...</p>
        </div>
      </div>
    );
  }

  // User is approved (approved === true) and email is confirmed
  // If n8n said redirect to foundation-dashboard but user landed on /dashboard (e.g. OAuth), redirect and set localStorage
  if (approvalRedirectTo && approvalRedirectTo !== location.pathname) {
    try {
      localStorage.setItem('courseType', approvalCourseType || 'ap_physics');
      if (approvalUser?.course) localStorage.setItem('userCourse', approvalUser.course);
      if (approvalUser?.batch) localStorage.setItem('userBatch', approvalUser.batch);
      if (approvalUser?.name) localStorage.setItem('userName', approvalUser.name);
      if (approvalUser?.email) localStorage.setItem('userEmail', approvalUser.email);
    } catch (_) {}
    return <Navigate to={approvalRedirectTo} replace />;
  }

  return <>{children}</>;
}

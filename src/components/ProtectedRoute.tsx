import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { EmailConfirmationRequired } from '../pages/EmailConfirmationRequired';
import { isFoundationCourseType, sheetRedirectIsFoundation } from '../lib/postAuthRedirect';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, loading, emailVerified, approved, approvalRedirectTo, approvalCourseType, approvalUser } = useAuthStore();
  const storedApprovalStatus =
    typeof window !== 'undefined' ? localStorage.getItem('approvalStatus') : null;

  // Dev only: bypass auth for UI preview (main.tsx sets this from ?testMode=1)
  const testMode =
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    localStorage.getItem('testMode') === 'true';
  if (testMode) {
    return <>{children}</>;
  }

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check email confirmation first - if not verified, show email confirmation page
  if (emailVerified === false) {
    return <EmailConfirmationRequired />;
  }

  // Foundation dashboard & AP Physics learning hub: any signed-in user with a confirmed email (or OAuth)
  // gets immediate access without Google Sheet / n8n approval. Other protected routes keep the approval gate below.
  const isFoundationDashboardRoute =
    location.pathname === '/foundation-dashboard' ||
    location.pathname.startsWith('/foundation-dashboard/');
  const isAPPhysicsOpenAccessRoute =
    location.pathname === '/ap-physics' ||
    location.pathname.startsWith('/ap-physics/') ||
    location.pathname === '/ap-physics-courses' ||
    location.pathname.startsWith('/ap-physics-courses/');
  if (isFoundationDashboardRoute || isAPPhysicsOpenAccessRoute) {
    return <>{children}</>;
  }

  // Hard block pending users even before state hydration completes.
  if (storedApprovalStatus === 'pending' && approved !== true) {
    return <Navigate to="/approval-pending" replace />;
  }

  // Check approval status from Google Sheet (via n8n)
  // approved can be: null (checking), true (approved), false (not approved)
  if (approved === false) {
    return <Navigate to="/approval-pending" replace />;
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
  // Allow sub-routes (e.g. /foundation-dashboard/practice) — only redirect when path is outside that destination tree
  const onApprovalDestination =
    !approvalRedirectTo ||
    location.pathname === approvalRedirectTo ||
    (approvalRedirectTo !== '/' && location.pathname.startsWith(`${approvalRedirectTo.replace(/\/$/, '')}/`));
  const profileMismatchFoundationRedirect =
    sheetRedirectIsFoundation(approvalRedirectTo) &&
    !!user?.courseType &&
    !isFoundationCourseType(user.courseType);
  if (approvalRedirectTo && !onApprovalDestination && !profileMismatchFoundationRedirect) {
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

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { EmailConfirmationRequired } from '../pages/EmailConfirmationRequired';
import { isFoundationCourseType, sheetRedirectIsFoundation } from '../lib/postAuthRedirect';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, loading, emailVerified, approvalRedirectTo, approvalCourseType, approvalUser } = useAuthStore();

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

  // Foundation dashboard & AP Physics hub: open to any signed-in user with confirmed email (or OAuth).
  // All other protected routes below require the same login + email verification only (no sheet approval gate).
  const isFoundationDashboardRoute =
    location.pathname === '/foundation-dashboard' ||
    location.pathname.startsWith('/foundation-dashboard/');
  // Same open access as AP topic hub: tools linked from Practice Bank (FRQ, graphs, mock test, simulators).
  const isAPPhysicsOpenAccessRoute =
    location.pathname === '/ap-physics' ||
    location.pathname.startsWith('/ap-physics/') ||
    location.pathname === '/ap-physics-courses' ||
    location.pathname.startsWith('/ap-physics-courses/') ||
    location.pathname === '/frq-practice' ||
    location.pathname.startsWith('/frq-practice/') ||
    location.pathname === '/graph-generator' ||
    location.pathname === '/mock-test' ||
    location.pathname === '/motion-simulator' ||
    location.pathname === '/simulators';
  if (isFoundationDashboardRoute || isAPPhysicsOpenAccessRoute) {
    return <>{children}</>;
  }

  // Optional post-login redirect from n8n (e.g. /dashboard vs /foundation-dashboard). Never force users onto
  // /approval-pending now that manual approval is disabled.
  const onApprovalDestination =
    !approvalRedirectTo ||
    location.pathname === approvalRedirectTo ||
    (approvalRedirectTo !== '/' && location.pathname.startsWith(`${approvalRedirectTo.replace(/\/$/, '')}/`));
  const profileMismatchFoundationRedirect =
    sheetRedirectIsFoundation(approvalRedirectTo) &&
    !!user?.courseType &&
    !isFoundationCourseType(user.courseType);
  const isApprovalGateRedirect =
    approvalRedirectTo === '/approval-pending' || approvalRedirectTo === '/approval-required';
  if (
    approvalRedirectTo &&
    !isApprovalGateRedirect &&
    !onApprovalDestination &&
    !profileMismatchFoundationRedirect
  ) {
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

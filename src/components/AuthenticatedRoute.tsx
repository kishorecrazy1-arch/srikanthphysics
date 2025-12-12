import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * AuthenticatedRoute - Only checks if user is authenticated
 * Does NOT check subscription status (unlike ProtectedRoute)
 * Use this for pages like /payment where free users should have access
 */
export function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, testMode } = useAuthStore();

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

  // Allow access in test mode
  if (testMode) {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated - allow access regardless of subscription status
  return <>{children}</>;
}


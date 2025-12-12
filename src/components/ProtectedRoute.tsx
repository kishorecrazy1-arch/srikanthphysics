import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { PaymentRequired } from '../pages/PaymentRequired';
import { EmailConfirmationRequired } from '../pages/EmailConfirmationRequired';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, testMode, emailVerified } = useAuthStore();

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

  // Check email confirmation first - if not verified, show email confirmation page
  if (emailVerified === false) {
    return <EmailConfirmationRequired />;
  }

  // Only check payment if email is confirmed
  // Check if user has paid subscription
  const hasActiveSubscription = user.subscriptionStatus === 'paid' || 
    (user.subscriptionStatus === 'trial' && 
     user.subscriptionExpiresAt && 
     new Date(user.subscriptionExpiresAt) > new Date());

  // If user doesn't have active subscription, show payment required page
  if (!hasActiveSubscription) {
    return <PaymentRequired />;
  }

  return <>{children}</>;
}

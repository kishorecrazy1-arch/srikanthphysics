import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';
import { supabase } from '../lib/supabase';

export function ApproveSubscription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const approveSubscription = async () => {
      const userId = searchParams.get('userId');
      
      if (!userId) {
        setStatus('error');
        setMessage('Invalid approval link. Missing user ID.');
        return;
      }

      try {
        // Use Supabase function to approve subscription (bypasses RLS)
        const { error } = await supabase.rpc('approve_user_subscription', {
          user_id_to_approve: userId
        });

        if (error) {
          console.error('Error approving subscription:', error);
          
          // If function doesn't exist, try direct update as fallback
          if (error.message?.includes('function') || error.message?.includes('does not exist')) {
            console.warn('Function not found, trying direct update...');
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            
            const { error: updateError } = await supabase
              .from('user_profiles')
              .update({
                subscription_status: 'paid',
                subscription_expires_at: expiryDate.toISOString(),
                payment_date: new Date().toISOString(),
                payment_method: 'manual_approval',
              })
              .eq('id', userId);
            
            if (updateError) {
              setStatus('error');
              setMessage(`Failed to approve subscription: ${updateError.message}. Please run FIX_APPROVAL_RLS.sql in Supabase.`);
              return;
            }
          } else {
            setStatus('error');
            setMessage(`Failed to approve subscription: ${error.message}. Please check the user ID or contact support.`);
            return;
          }
        }

        setStatus('success');
        setMessage('Subscription approved successfully! The user now has immediate full dashboard access.');
      } catch (error) {
        console.error('Error approving subscription:', error);
        setStatus('error');
        setMessage('An error occurred while approving the subscription. Please try again.');
      }
    };

    approveSubscription();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <CourseNavigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Processing Approval...
              </h1>
              <p className="text-xl text-gray-600">
                Please wait while we approve the subscription.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                ✅ Subscription Approved!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {message}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <p className="text-green-800 font-semibold mb-2">
                  ✅ User has been granted immediate full dashboard access!
                </p>
                <p className="text-green-700 text-sm">
                  The user can now sign in and access all features including dashboard, courses, quizzes, and all premium content.
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Back to Home
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Approval Failed
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {message}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                <p className="text-red-800 font-semibold mb-2">
                  Troubleshooting Steps:
                </p>
                <ol className="text-red-700 text-sm space-y-1 list-decimal list-inside">
                  <li>Run <code className="bg-red-100 px-1 rounded">FIX_APPROVAL_RLS.sql</code> in Supabase SQL Editor</li>
                  <li>Verify the user ID in the URL is correct</li>
                  <li>Check Supabase logs for detailed error messages</li>
                  <li>Try the alternative RLS policy in <code className="bg-red-100 px-1 rounded">FIX_APPROVAL_RLS_ALTERNATIVE.sql</code></li>
                </ol>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


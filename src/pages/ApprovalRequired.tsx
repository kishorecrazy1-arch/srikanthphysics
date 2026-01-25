import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, ArrowLeft, Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';
import { useAuthStore } from '../store/authStore';

export function ApprovalRequired() {
  const navigate = useNavigate();
  const { user, checkApproval } = useAuthStore();

  // Re-check approval status when user clicks refresh
  const handleRefresh = async () => {
    if (user) {
      await checkApproval();
    }
  };

  // Auto-refresh approval status every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkApproval();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user, checkApproval]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <CourseNavigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-orange-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Approval Required
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your account is pending approval from Srikanth's Academy. You'll receive access to the dashboard once your account has been approved.
          </p>

          <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-900">
                How Approval Works
              </h3>
            </div>
            <div className="text-left space-y-2 text-blue-800">
              <p>1. Your sign-in has been logged and sent to the admin team</p>
              <p>2. The admin will review your account in the Google Sheet</p>
              <p>3. Once admin types "Approved" in your status, you'll get dashboard access</p>
              <p>4. You can refresh this page to check your approval status</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-yellow-800 font-semibold mb-2">
                  Approval Status Checked Automatically
                </p>
                <p className="text-yellow-700 text-sm mb-3">
                  Your approval status is checked every time you sign in. If you've been approved, try signing in again or click the refresh button below.
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 text-sm font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  Check Approval Status
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Get After Approval:</h2>
            <ul className="space-y-3">
              {[
                'Full access to dashboard and all courses',
                'AI-powered daily practice questions',
                'Personalized learning paths',
                'Progress tracking and analytics',
                'Expert guidance from Srikanth Sir',
                'Mock tests and exam preparation',
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-yellow-800 font-semibold mb-1">
                  Contact Srikanth's Academy
                </p>
                <p className="text-yellow-700 text-sm">
                  For questions about your approval status, contact: <strong>srikanthsacademyforphysics@gmail.com</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              Try Free Demo While Waiting
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Already approved? <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">Refresh page</button> to check your status.
          </p>
        </div>
      </div>
    </div>
  );
}


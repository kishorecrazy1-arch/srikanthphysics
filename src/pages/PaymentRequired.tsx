import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, ArrowRight, ArrowLeft, Mail, Loader2, Copy, ExternalLink, Zap } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';
import { useAuthStore } from '../store/authStore';
import { requestSubscriptionApproval, getApprovalUrl } from '../services/subscriptionService';

export function PaymentRequired() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [approvalSent, setApprovalSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState<string>('');
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    // Check if test mode is already enabled
    const isTestMode = localStorage.getItem('testMode') === 'true';
    setTestMode(isTestMode);
  }, []);

  const enableTestMode = () => {
    localStorage.setItem('testMode', 'true');
    setTestMode(true);
    // Navigate to dashboard immediately
    navigate('/dashboard');
  };

  const sendApprovalRequest = useCallback(async () => {
    if (!user || approvalSent || sending) return;

    setSending(true);
    try {
      const result = await requestSubscriptionApproval(user);
      if (result.approvalUrl) {
        setApprovalUrl(result.approvalUrl);
      } else if (user.id) {
        // Generate approval URL if not returned
        setApprovalUrl(getApprovalUrl(user.id));
      }
      setApprovalSent(true);
    } catch (error) {
      console.error('Failed to send approval request:', error);
      // Still show as sent to avoid repeated attempts
      if (user?.id) {
        setApprovalUrl(getApprovalUrl(user.id));
      }
      setApprovalSent(true);
    } finally {
      setSending(false);
    }
  }, [user, approvalSent, sending]);

  const copyApprovalUrl = () => {
    if (approvalUrl) {
      navigator.clipboard.writeText(approvalUrl);
      alert('Approval URL copied to clipboard!');
    }
  };

  useEffect(() => {
    // Automatically send approval request when page loads
    if (user && !approvalSent && !sending) {
      sendApprovalRequest();
    }
  }, [user, approvalSent, sending, sendApprovalRequest]);

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
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-yellow-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Required
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            You need an active subscription to access Srikanth's Academy platform.
          </p>

          {!testMode && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-bold text-yellow-900">
                  🚀 Quick Test Access
                </h3>
              </div>
              <p className="text-yellow-800 mb-4">
                Enable test mode to get immediate full dashboard access without subscription. Perfect for testing!
              </p>
              <button
                onClick={enableTestMode}
                className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Enable Test Mode & Access Dashboard
              </button>
              <p className="text-xs text-yellow-700 mt-2 text-center">
                This grants full access to all features. Disable anytime from browser console.
              </p>
            </div>
          )}

          {testMode && (
            <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-green-900">
                  ✅ Test Mode Active
                </h3>
              </div>
              <p className="text-green-800 mb-4">
                Test mode is enabled! You have full dashboard access. Click below to go to dashboard.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Go to Dashboard
              </button>
            </div>
          )}

          {approvalSent && approvalUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  📧 Approval Request Generated
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  Your approval request has been logged. Admin can approve your access using the link below.
                </p>
                <div className="bg-white border border-blue-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-600">Approval Link:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-blue-800 break-all flex-1">{approvalUrl}</code>
                    <button
                      onClick={copyApprovalUrl}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 flex items-center gap-1"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>
                <a
                  href={approvalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Open Approval Link
                </a>
              </div>
            </div>
          )}

          {sending && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 justify-center">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="text-blue-700">
                  Sending approval request...
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Get:</h2>
            <ul className="space-y-3">
              {[
                'Unlimited access to all physics courses',
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              Try Free Demo First
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
            Already subscribed? <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Sign in</button> to access your account.
          </p>
        </div>
      </div>
    </div>
  );
}


import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, ArrowLeft } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';
import { useAuthStore } from '../store/authStore';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const paymentData = location.state as {
    paymentId?: string;
    orderId?: string;
    plan?: string;
    amount?: number;
  };

  useEffect(() => {
    // Redirect if no payment data
    if (!paymentData) {
      navigate('/dashboard');
    }
  }, [paymentData, navigate]);

  if (!paymentData) {
    return null;
  }

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
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Welcome to Srikanth's Academy! Your subscription is now active.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details:</h2>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Plan:</span>
                <span className="font-semibold">{paymentData.plan || 'Subscription Plan'}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">₹{paymentData.amount || '0'}</span>
              </div>
              {paymentData.paymentId && (
                <div className="flex justify-between">
                  <span>Payment ID:</span>
                  <span className="font-mono text-sm">{paymentData.paymentId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Full access to all courses and features</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>AI-powered daily practice questions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Progress tracking and analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span>Expert guidance from Srikanth Sir</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.print()}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            A confirmation email has been sent to {user?.email || 'your email'}
          </p>
        </div>
      </div>
    </div>
  );
}


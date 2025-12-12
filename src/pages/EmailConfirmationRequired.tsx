import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';
import { useAuthStore } from '../store/authStore';

export function EmailConfirmationRequired() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleResendEmail = async () => {
    // TODO: Implement resend confirmation email
    alert('Confirmation email will be resent. Please check your inbox.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <CourseNavigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-yellow-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Email Confirmation Required
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Please confirm your email address (srikanthsacademyforphysics@gmail.com) to access Srikanth's Academy platform.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What to do:</h2>
            <ol className="space-y-3 text-gray-700 list-decimal list-inside">
              <li>Check your email inbox ({user?.email || 'your email'})</li>
              <li>Look for an email from Srikanth's Academy</li>
              <li>Click the confirmation link in the email</li>
              <li>Return here and sign in again</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-yellow-800 font-semibold mb-1">Didn't receive the email?</p>
              <p className="text-yellow-700 text-sm">
                Check your spam folder or click the button below to resend the confirmation email.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleResendEmail}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              <Mail className="w-5 h-5" />
              Resend Confirmation Email
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Back to Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-green-800 font-semibold mb-1">Already confirmed?</p>
              <p className="text-green-700 text-sm">
                If you've already confirmed your email, try signing out and signing in again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


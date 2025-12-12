import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function PaymentRequired() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <CourseNavigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
              onClick={() => navigate('/payment')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
            >
              <CreditCard className="w-5 h-5" />
              Subscribe Now
            </button>
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Try Free Demo First
              <ArrowRight className="w-5 h-5" />
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


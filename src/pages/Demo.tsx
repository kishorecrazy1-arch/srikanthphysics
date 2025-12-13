import { DemoForm } from '../components/DemoForm';
import { CalendlyEmbed } from '../components/CalendlyEmbed';
import { CourseNavigation } from '../components/CourseNavigation';
import { BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function Demo() {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;
  const showCalendly = !!calendlyUrl;
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <CourseNavigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Dashboard Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Book Your Free Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our AI-powered learning platform and see how we can help you score a perfect 5
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
                <p className="text-gray-600">Fill in your details and we'll contact you</p>
              </div>
            </div>

            <DemoForm showCalendly={showCalendly} />

            {/* Benefits List */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll get:</h3>
              <ul className="space-y-3">
                {[
                  'Free 30-minute demo session',
                  'Personalized learning plan',
                  'Access to sample questions',
                  'Expert guidance from Srikanth Sir',
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Calendly Section */}
          {showCalendly && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Or Book a Slot Instantly
                </h2>
                <p className="text-gray-600">
                  Choose a time that works for you and book your demo directly
                </p>
              </div>
              <CalendlyEmbed url={calendlyUrl} />
            </div>
          )}

          {/* Info Section (if no Calendly) */}
          {!showCalendly && (
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Why Choose Srikanth's Academy?</h2>
              <ul className="space-y-4">
                {[
                  {
                    title: '13+ Years Experience',
                    desc: 'Expert guidance from Srikanth Sir',
                  },
                  {
                    title: 'AI-Powered Learning',
                    desc: 'Personalized daily practice questions',
                  },
                  {
                    title: 'Proven Results',
                    desc: '98% success rate',
                  },
                  {
                    title: 'College Credit',
                    desc: 'Save $2,000+ in tuition costs',
                  },
                ].map((item, index) => (
                  <li key={index}>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-blue-100">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


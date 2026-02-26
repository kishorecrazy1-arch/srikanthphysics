import { DemoForm } from '../components/DemoForm';
import { CourseNavigation } from '../components/CourseNavigation';
import { BookOpen, CheckCircle, ArrowLeft, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function Demo() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <CourseNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Two Column Layout: Video on Left, Form on Right */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side: Watch 2-Min Success Video */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Watch 2-Min Success Video</h3>
              </div>
              <p className="text-gray-600 text-lg mb-6">
                See how our students achieved perfect scores and transformed their physics journey
              </p>
              
              {/* Video Player */}
              <div className="mb-6 rounded-xl overflow-hidden bg-gray-900">
                <video
                  className="w-full h-auto"
                  controls
                  poster="/media/images/srikanth sir photo.PNG"
                >
                  <source src="/media/videos/success-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="mt-auto">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm text-purple-800 font-semibold mb-2">✨ What you'll learn:</p>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>Real student success stories</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>How our platform works</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span>Tips for exam success</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Book Your Demo Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Book Your Demo</h2>
                  <p className="text-gray-600">Fill in your details and we'll contact you</p>
                </div>
              </div>

              <DemoForm showCalendly={false} />

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
          </div>
        </div>
      </div>
    </div>
  );
}


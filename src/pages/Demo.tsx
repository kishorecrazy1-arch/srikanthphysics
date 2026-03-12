import { DemoForm } from '../components/DemoForm';
import { CourseNavigation } from '../components/CourseNavigation';
import { CheckCircle, ArrowLeft, Play, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function Demo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const selectedBatch = (location.state as any)?.selectedBatch || localStorage.getItem('selectedBatch');
  
  const getBatchInfo = (batchId: string | null) => {
    if (!batchId) return null;
    const batchMap: Record<string, { name: string; timing: string; days: string; duration: string }> = {
      'foundation-batch-1': { name: 'Foundation Batch 1', timing: '7:00 PM IST', days: 'Commencing from 16th March, 2026', duration: '1 month' },
      'foundation-batch-2': { name: 'Foundation Batch 2', timing: '6:00 PM IST', days: 'Commencing from 6th April, 2026', duration: '1 month' },
      'foundation-batch-3': { name: 'Foundation Batch 3', timing: '7:00 PM IST', days: 'Commencing from 20th April, 2026', duration: '1 month' }
    };
    return batchMap[batchId] || null;
  };

  const batchInfo = getBatchInfo(selectedBatch);

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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our AI-powered learning platform and see how we can help to get full score
          </p>
        </div>

        {/* Register section first, then 2 min watch video below */}
        <div className="space-y-8">
          {/* 1. Register – form and foundation timings */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Register</h2>
            <p className="text-gray-600 mb-6">Fill in your details and we'll contact you</p>

            {/* First block: Foundation timings (Batch 1 timings summary) */}
            {batchInfo && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">{batchInfo.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{batchInfo.timing}</span>
                  <span className="text-gray-500">•</span>
                  <span>Duration: {batchInfo.duration}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{batchInfo.days}</p>
              </div>
            )}

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

          {/* 2. 2 min watch video – below Register */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">2 min watch video</h3>
            </div>
            <p className="text-gray-600 text-lg mb-6">
              See how our students achieved perfect scores and transformed their physics journey
            </p>
            <div className="rounded-xl overflow-hidden bg-gray-900">
              <video
                className="w-full h-auto"
                controls
                poster="/media/srikanth sir photo.PNG"
              >
                <source src="/media/videos/success-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
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
    </div>
  );
}


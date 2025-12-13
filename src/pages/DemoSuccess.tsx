import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft, Play } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function DemoSuccess() {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Get lead data from sessionStorage
    const stored = sessionStorage.getItem('demoLead');
    if (stored) {
      try {
        setLeadData(JSON.parse(stored));
      } catch {
        // Invalid data, redirect to demo page
        navigate('/demo');
      }
    } else {
      // No data, redirect to demo page
      navigate('/demo');
    }
  }, [navigate]);

  if (!leadData) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <CourseNavigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            You're In! Free Demo Booked 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thanks, <span className="font-semibold text-blue-600">{leadData.name}</span>!
          </p>
          <p className="text-lg text-gray-600">
            We'll reach out to <span className="font-semibold">{leadData.email}</span> within 24 hours.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Download Syllabus */}
          <button
            onClick={() => {
              // TODO: Add actual PDF download link
              window.open('#', '_blank');
            }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-left group border-2 border-gray-200 hover:border-blue-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Download Syllabus</h3>
            </div>
            <p className="text-gray-600">
              Get the complete AP Physics 1 & 2 syllabus and exam pattern
            </p>
          </button>

          {/* Watch Video */}
          <button
            onClick={() => {
              // TODO: Add actual video link
              window.open('#', '_blank');
            }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-left group border-2 border-gray-200 hover:border-blue-500"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Watch 2-Min Success Video</h3>
            </div>
            <p className="text-gray-600">
              See how our students achieved perfect scores
            </p>
          </button>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
          <ol className="space-y-4">
            {[
              'We\'ll send you a confirmation email within a few minutes',
              'Our team will contact you via WhatsApp/Email within 24 hours',
              'We\'ll schedule your free demo at a convenient time',
              'During the demo, you\'ll see our platform and get personalized guidance',
            ].map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/course/ap-physics')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Course Page
          </button>
        </div>
      </div>
    </div>
  );
}


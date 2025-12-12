import { useNavigate } from 'react-router-dom';
import { TestTube, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function EnableTestMode() {
  const navigate = useNavigate();
  const enableTestMode = useAuthStore(state => state.enableTestMode);
  const testMode = useAuthStore(state => state.testMode);

  const handleEnableTestMode = () => {
    enableTestMode();
    navigate('/dashboard');
  };

  if (testMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TestTube className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Test Mode Active</h1>
            <p className="text-gray-600 mb-6">You have test access enabled. You can use all features without logging in.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                useAuthStore.getState().disableTestMode();
                window.location.reload();
              }}
              className="w-full mt-3 px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Disable Test Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TestTube className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Enable Test Access</h1>
            <p className="text-gray-600">
              Get instant access to all features without creating an account or logging in.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What is Test Mode?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Access all dashboard features</li>
                <li>✓ Try quizzes and practice questions</li>
                <li>✓ View progress and analytics</li>
                <li>✓ No account required</li>
                <li>✓ No data saved to database</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Test mode uses sample data. Your progress won't be saved permanently.
              </p>
            </div>
          </div>

          <button
            onClick={handleEnableTestMode}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <TestTube className="w-5 h-5" />
            Enable Test Mode & Go to Dashboard
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Or sign in with an account →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

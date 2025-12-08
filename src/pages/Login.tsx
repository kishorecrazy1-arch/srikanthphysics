import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, TestTube } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showTestMode, setShowTestMode] = useState(false);
  const navigate = useNavigate();
  const signIn = useAuthStore(state => state.signIn);
  const enableTestMode = useAuthStore(state => state.enableTestMode);
  const testMode = useAuthStore(state => state.testMode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      const selectedCourse = localStorage.getItem('selectedCourse') || 'ap-physics';
      
      // Navigate to course-specific page based on selected course
      if (selectedCourse.startsWith('ap-physics')) {
        navigate('/ap-physics');
      } else if (selectedCourse === 'igcse') {
        navigate('/course/igcse');
      } else if (selectedCourse === 'sat') {
        navigate('/course/sat');
      } else if (selectedCourse === 'iit-jee') {
        navigate('/course/iit-jee');
      } else if (selectedCourse === 'neet') {
        navigate('/course/neet');
      } else {
        navigate('/ap-physics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/ap-physics`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      if (err.message?.includes('provider is not enabled') || err.error_code === 'validation_failed') {
        setError('Google sign-in is not enabled. Please use email sign-in or contact support.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/ap-physics`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      if (err.message?.includes('provider is not enabled') || err.error_code === 'validation_failed') {
        setError('Apple sign-in is not enabled. Please use email sign-in or contact support.');
      } else {
        setError(err.message || 'Failed to sign in with Apple');
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetMessage('Password reset link sent! Check your email.');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetMessage('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjctNS4zNzMtMTItMTItMTJzLTEyIDUuMzczLTEyIDEyIDUuMzczIDEyIDEyIDEyIDEyLTUuMzczIDEyLTEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

        <div className="max-w-md w-full relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-gray-600">Enter your email to receive a reset link</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {resetMessage && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg text-green-700 text-sm">
                {resetMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <button
              onClick={() => setShowForgotPassword(false)}
              className="mt-6 w-full text-center text-sm text-gray-600 hover:text-gray-800"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjctNS4zNzMtMTItMTItMTJzLTEyIDUuMzczLTEyIDEyIDUuMzczIDEyIDEyIDEyIDEyLTUuMzczIDEyLTEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="max-w-6xl w-full relative z-10 grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block text-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Srikanth's Academy</h1>
              <p className="text-blue-200">Excellence in Physics</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold leading-tight">
            Welcome Back to Your Physics Journey
          </h2>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-lg">Track Your Progress</p>
                <p className="text-blue-200">Pick up right where you left off</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-lg">Daily Practice Awaits</p>
                <p className="text-blue-200">New questions generated just for you</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-lg">Build Your Streak</p>
                <p className="text-blue-200">Stay consistent and watch your scores soar</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="lg:hidden inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue your learning</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleAppleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Lock className="inline w-4 h-4 mr-1" />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
              Create Account
            </Link>
          </p>

          {/* Test Mode Helper */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            {testMode && (
              <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TestTube className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-800">Test Mode Active</span>
                  </div>
                  <button
                    onClick={() => {
                      useAuthStore.getState().disableTestMode();
                      window.location.reload();
                    }}
                    className="text-xs text-green-700 hover:text-green-900 underline"
                  >
                    Disable
                  </button>
                </div>
                <p className="text-xs text-green-700 mt-1">You can access all features without logging in.</p>
              </div>
            )}
            <button
              onClick={() => setShowTestMode(!showTestMode)}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              {showTestMode ? '▼ Hide' : '▶ Show'} Test Mode / Forgot Password Helper
            </button>
            {showTestMode && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                <div className="pb-3 border-b border-yellow-200">
                  <div className="text-xs font-semibold text-yellow-800 mb-2 flex items-center gap-1">
                    <TestTube className="w-3 h-3" />
                    Test Access (No Login Required):
                  </div>
                  <button
                    onClick={() => {
                      enableTestMode();
                      const selectedCourse = localStorage.getItem('selectedCourse') || 'ap-physics';
                      if (selectedCourse.startsWith('ap-physics')) {
                        navigate('/ap-physics');
                      } else if (selectedCourse === 'igcse') {
                        navigate('/course/igcse');
                      } else if (selectedCourse === 'sat') {
                        navigate('/course/sat');
                      } else if (selectedCourse === 'iit-jee') {
                        navigate('/course/iit-jee');
                      } else if (selectedCourse === 'neet') {
                        navigate('/course/neet');
                      } else {
                        navigate('/ap-physics');
                      }
                    }}
                    className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors shadow-md"
                  >
                    🚀 Enter Test Mode (Bypass Login)
                  </button>
                  <p className="text-xs text-gray-600 mt-2">
                    Access all features with a test account. No authentication required!
                  </p>
                </div>
                
                <div className="text-xs font-semibold text-yellow-800 mb-2">🧪 Test Credentials:</div>
                <div className="text-xs text-gray-700 space-y-1">
                  <div><strong>Email:</strong> test@example.com</div>
                  <div><strong>Password:</strong> test123</div>
                </div>
                <button
                  onClick={() => {
                    setEmail('test@example.com');
                    setPassword('test123');
                  }}
                  className="w-full mt-2 px-3 py-2 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  Fill Test Credentials
                </button>
                <div className="pt-3 border-t border-yellow-200">
                  <div className="text-xs font-semibold text-yellow-800 mb-2">🔑 Test Forgot Password:</div>
                  <div className="text-xs text-gray-700 mb-2">
                    1. Click "Forgot password?" above
                  </div>
                  <div className="text-xs text-gray-700 mb-2">
                    2. Enter any email (e.g., test@example.com)
                  </div>
                  <div className="text-xs text-gray-700 mb-2">
                    3. Check your email for reset link
                  </div>
                  <div className="text-xs text-gray-700 mb-2">
                    4. Or use this direct link: <Link to="/reset-password" className="text-blue-600 underline">/reset-password</Link>
                  </div>
                  <button
                    onClick={() => {
                      setShowForgotPassword(true);
                      setResetEmail('test@example.com');
                    }}
                    className="w-full mt-2 px-3 py-2 bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Open Forgot Password with Test Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

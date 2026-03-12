import { useNavigate } from 'react-router-dom';
import { Award, TrendingUp, GraduationCap, Zap, CheckCircle, Star, BookOpen, Target, Flame } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">AP Physics AI</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Star className="w-16 h-16 fill-yellow-300 text-yellow-300" />
                  <h1 className="text-6xl font-bold">Score 5/5</h1>
                </div>
                <p className="text-3xl font-semibold text-blue-50 mb-6">in AP Physics</p>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  AI-powered daily practice to help you master physics and ace your exam
                </p>
              </div>
            </div>

            <div className="p-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Unlock Your Future
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">College Credit</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Earn college credit and skip introductory physics courses, saving time and tuition costs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500 p-3 rounded-lg flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Competitive Edge</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Stand out in college admissions with top AP scores that demonstrate academic excellence.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-500 p-3 rounded-lg flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Career Opportunities</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Open doors to STEM careers in engineering, research, and cutting-edge technology fields.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border-2 border-pink-200 hover:border-pink-400 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500 p-3 rounded-lg flex-shrink-0">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Strong Foundation</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Build critical thinking and problem-solving skills essential for success in any field.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 rounded-2xl text-white">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-10 h-10 flex-shrink-0" />
                    <div>
                      <p className="text-2xl font-semibold mb-1">Ready to achieve excellence?</p>
                      <p className="text-blue-100">Master AP Physics and transform your future</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                  >
                    Start Learning Free
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Your Personal AI Physics Coach
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Everything you need to excel in AP Physics
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Daily Practice</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized quizzes every day with Morning Pulse, Daily Homework, and Challenge Problems tailored to your skill level.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Track Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your mastery across all physics topics with detailed analytics and identify areas for improvement.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <Flame className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Stay Motivated</h3>
              <p className="text-gray-600 leading-relaxed">
                Build streaks, earn badges, and compete on the leaderboard to stay motivated and consistent in your studies.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl shadow-2xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Start Your Journey Today</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students using AP Physics AI to achieve their dream score
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl text-lg inline-flex items-center gap-2"
            >
              Get Started Free
              <Star className="w-6 h-6" />
            </button>
            <p className="text-blue-100 mt-4 text-sm">No credit card required</p>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2025 AP Physics AI. All rights reserved.</p>
            <p className="text-sm">Empowering students to achieve excellence in physics.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Target, Clock, CheckCircle, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useQuizStore } from '../store/quizStore';

export function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const startQuiz = useQuizStore(state => state.startQuiz);

  // Redirect to AP Physics 1 page since Dashboard is not being used
  useEffect(() => {
    navigate('/ap-physics', { replace: true });
  }, [navigate]);

  if (!user) return null;

  const accuracy = user.totalQuestions > 0
    ? Math.round((user.correctAnswers / user.totalQuestions) * 100)
    : 0;

  const daysUntilExam = Math.ceil(
    (new Date(user.targetExamDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleStartQuiz = async (type: 'morning_pulse' | 'homework' | 'challenge', count: number) => {
    try {
      await startQuiz(type, count);
      navigate('/quiz');
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">Ready to ace your AP Physics exam?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{user.currentStreak}</p>
              <p className="text-sm text-gray-600">Day Streak 🔥</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{accuracy}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{daysUntilExam}</p>
              <p className="text-sm text-gray-600">Days Until Exam</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Overall Progress</h2>
          <span className="text-lg font-semibold text-blue-600">{user.skillLevel}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 ease-out"
            style={{ width: `${user.skillLevel}%` }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Tasks 📚</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Morning Pulse</h3>
            </div>
            <p className="text-gray-600 mb-4">Quick 3-question warmup</p>
            <button
              onClick={() => handleStartQuiz('morning_pulse', 3)}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Quiz
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Daily Homework</h3>
            </div>
            <p className="text-gray-600 mb-4">10 practice questions</p>
            <button
              onClick={() => handleStartQuiz('homework', 10)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Quiz
            </button>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Challenge Problem</h3>
            </div>
            <p className="text-gray-600 mb-4">1 difficult question</p>
            <button
              onClick={() => handleStartQuiz('challenge', 1)}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Courses 🎓</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div
            onClick={() => navigate('/ap-physics')}
            className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-8 text-white cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-1">AP Physics 1</h3>
                  <p className="text-blue-100 text-lg">Master 7 core topics with AI-powered practice</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 flex-shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-blue-100 mb-1">Topics Mastered</div>
              <div className="text-3xl font-bold">0/7</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-blue-100 mb-1">Overall Progress</div>
              <div className="text-3xl font-bold">0%</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-blue-100 mb-1">Questions Done</div>
              <div className="text-3xl font-bold">0</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Learning Progress</span>
              <span className="text-sm font-bold">0%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: '0%' }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-blue-50">
            <span>🎯 Daily Basics</span>
            <span>•</span>
            <span>📚 Homework</span>
            <span>•</span>
            <span>⚡ Practice Bank</span>
          </div>
          </div>

          <div
            onClick={() => navigate('/course/igcse')}
            className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl shadow-xl p-8 text-white cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-1">IGCSE Physics</h3>
                  <p className="text-purple-100 text-lg">Cambridge International Examination</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 flex-shrink-0" />
            </div>
            <p className="text-purple-100">Global-standard Physics mastered with clarity & intuition</p>
          </div>

          <div
            onClick={() => navigate('/course/sat')}
            className="bg-gradient-to-br from-teal-600 to-cyan-500 rounded-2xl shadow-xl p-8 text-white cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-1">SAT Physics</h3>
                  <p className="text-teal-100 text-lg">College Board Subject Test</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 flex-shrink-0" />
            </div>
            <p className="text-teal-100">Master conceptual physics reasoning for college admissions</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Questions Answered</p>
          <p className="text-3xl font-bold text-gray-800">{user.totalQuestions}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
          <p className="text-3xl font-bold text-green-600">{user.correctAnswers}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Longest Streak</p>
          <p className="text-3xl font-bold text-orange-600">{user.longestStreak} days</p>
        </div>
      </div>
    </div>
  );
}

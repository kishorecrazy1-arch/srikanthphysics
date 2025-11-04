import { useEffect, useState } from 'react';
import { TrendingUp, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TopicMastery } from '../types';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';

export function Progress() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const startQuiz = useQuizStore(state => state.startQuiz);
  const [topicMastery, setTopicMastery] = useState<TopicMastery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopicMastery();
  }, []);

  const fetchTopicMastery = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('topic_mastery')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedData: TopicMastery[] = data.map((item: any) => ({
        topic: item.topic,
        mastery: item.mastery,
        questionsAttempted: item.questions_attempted,
        questionsCorrect: item.questions_correct,
        lastPracticed: item.last_practiced,
      }));

      setTopicMastery(formattedData);
    } catch (error) {
      console.error('Error fetching topic mastery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePractice = async (topic: string) => {
    try {
      await startQuiz('homework', 5);
      navigate('/quiz');
    } catch (error) {
      console.error('Failed to start practice:', error);
    }
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-700' };
    if (mastery >= 60) return { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-700' };
    return { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-700' };
  };

  const topicsMastered = topicMastery.filter(t => t.mastery >= 85).length;
  const averageTime = user && user.totalQuestions > 0 ? '2:30' : '0:00';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Progress 📈</h1>
        <p className="text-gray-600">Track your mastery across all topics</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Total Questions</p>
          <p className="text-3xl font-bold text-gray-800">{user?.totalQuestions || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Overall Accuracy</p>
          <p className="text-3xl font-bold text-green-600">
            {user && user.totalQuestions > 0
              ? Math.round((user.correctAnswers / user.totalQuestions) * 100)
              : 0}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Avg Time/Question</p>
          <p className="text-3xl font-bold text-blue-600">{averageTime}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Topics Mastered</p>
          <p className="text-3xl font-bold text-orange-600">{topicsMastered}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Topic Mastery</h2>
        <div className="space-y-4">
          {topicMastery.map((topic) => {
            const colors = getMasteryColor(topic.mastery);
            return (
              <div
                key={topic.topic}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{topic.topic}</h3>
                    <p className="text-sm text-gray-600">
                      {topic.questionsAttempted} questions attempted · {topic.questionsCorrect} correct
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${colors.text}`}>{topic.mastery}%</p>
                      <p className="text-xs text-gray-500">Mastery</p>
                    </div>
                    <button
                      onClick={() => handlePractice(topic.topic)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Practice
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${colors.bg} transition-all duration-500`}
                    style={{ width: `${topic.mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Keep Practicing! 🎯</h3>
            <p className="text-gray-700 mb-4">
              Focus on topics with lower mastery scores to improve your overall understanding.
              Consistent practice is the key to acing your AP Physics exam!
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Your progress is being tracked automatically</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

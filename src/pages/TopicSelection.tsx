import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Topic, TopicProgress, TopicWithProgress } from '../types/topics';

export function TopicSelection() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [topics, setTopics] = useState<TopicWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, [user]);

  const loadTopics = async () => {
    try {
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .order('display_order');

      if (topicsError) throw topicsError;

      if (user) {
        const { data: progressData } = await supabase
          .from('topic_progress')
          .select('*')
          .eq('user_id', user.id);

        const topicsWithProgress: TopicWithProgress[] = (topicsData || []).map((topic: Topic) => {
          const progress = progressData?.find((p: TopicProgress) => p.topic_id === topic.id);

          let status: 'mastered' | 'in-progress' | 'not-started' = 'not-started';
          if (progress) {
            if (progress.mastery >= 90) status = 'mastered';
            else if (progress.mastery > 0) status = 'in-progress';
          }

          return {
            ...topic,
            progress,
            status
          };
        });

        setTopics(topicsWithProgress);
      } else {
        setTopics((topicsData || []).map(t => ({ ...t, status: 'not-started' as const })));
      }
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered': return '#10b981';
      case 'in-progress': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'mastered': return 'Mastered';
      case 'in-progress': return 'In Progress';
      default: return 'Not Started';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading topics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">AP Physics 1</h1>
              <p className="text-gray-600">Choose your topic to begin learning</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {topics.filter(t => t.status === 'mastered').length}
                </div>
                <div className="text-sm text-gray-600">Mastered Topics</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {topics.filter(t => t.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">
                  {topics.filter(t => t.status === 'not-started').length}
                </div>
                <div className="text-sm text-gray-600">Not Started</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((topics.reduce((sum, t) => sum + (t.progress?.mastery || 0), 0) / topics.length) || 0)}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
              onClick={() => navigate(`/ap-physics/topic/${topic.id}`)}
              style={{ borderLeft: `6px solid ${topic.color}` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{topic.icon}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {topic.name}
                      </h3>
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mt-1"
                        style={{ backgroundColor: getStatusColor(topic.status) }}
                      >
                        {getStatusText(topic.status)}
                      </span>
                    </div>
                  </div>
                  {topic.progress && topic.progress.mastery >= 90 && (
                    <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                  )}
                </div>

                <p className="text-gray-600 mb-4">{topic.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📝</span>
                    <span>
                      {topic.progress?.questions_completed || 0}/{topic.total_questions} questions
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📚</span>
                    <span>{topic.subtopics.length} subtopics</span>
                  </div>
                  {topic.progress && topic.progress.streak_days > 0 && (
                    <div className="flex items-center gap-2 text-orange-600 font-semibold">
                      <span>🔥</span>
                      <span>{topic.progress.streak_days} day streak</span>
                    </div>
                  )}
                  {topic.progress && topic.progress.questions_correct > 0 && (
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <span>✅</span>
                      <span>
                        {Math.round((topic.progress.questions_correct / topic.progress.questions_completed) * 100)}% accuracy
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Mastery Level</span>
                    <span className="font-bold text-gray-900">{topic.progress?.mastery || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${topic.progress?.mastery || 0}%`,
                        backgroundColor: topic.color
                      }}
                    />
                  </div>
                </div>

                <button
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all"
                  style={{ backgroundColor: topic.color }}
                >
                  {topic.status === 'not-started' ? 'Start Learning' : 'Continue'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

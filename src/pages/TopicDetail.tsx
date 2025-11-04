import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, BookOpen, Zap, Flame, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { BasicsSection } from '../components/topics/BasicsSection';
import { HomeworkSection } from '../components/topics/HomeworkSection';
import { PracticeSection } from '../components/topics/PracticeSection';
import type { Topic, TopicProgress } from '../types/topics';

type Tab = 'subtopic' | 'daily-practice' | 'homework' | 'practice-bank';

interface Subtopic {
  id: string;
  topic_id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export function TopicDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [progress, setProgress] = useState<TopicProgress | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('subtopic');
  const [loading, setLoading] = useState(true);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadTopicData();
  }, [topicId, user]);

  const loadTopicData = async () => {
    try {
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .maybeSingle();

      if (topicError) throw topicError;
      if (!topicData) {
        navigate('/ap-physics');
        return;
      }

      setTopic(topicData);

      const { data: subtopicsData, error: subtopicsError } = await supabase
        .from('subtopics')
        .select('*')
        .eq('topic_id', topicId)
        .order('display_order');

      if (subtopicsError) throw subtopicsError;
      if (subtopicsData && subtopicsData.length > 0) {
        setSubtopics(subtopicsData);
        setSelectedSubtopic(subtopicsData[0]);
      }

      if (user) {
        const { data: progressData } = await supabase
          .from('topic_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('topic_id', topicId)
          .maybeSingle();

        if (progressData) {
          setProgress(progressData);
        } else {
          const { data: newProgress } = await supabase
            .from('topic_progress')
            .insert({
              user_id: user.id,
              topic_id: topicId,
              mastery: 0,
              questions_completed: 0,
              questions_correct: 0,
              streak_days: 0
            })
            .select()
            .single();

          if (newProgress) setProgress(newProgress);
        }
      }
    } catch (error) {
      console.error('Error loading topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProgress = async () => {
    if (!user || !topicId) return;

    const { data } = await supabase
      .from('topic_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .maybeSingle();

    if (data) setProgress(data);
  };

  if (loading || !topic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading topic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
      <div className="bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-sm border-b border-blue-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <button
                onClick={() => navigate('/ap-physics')}
                className="flex items-center gap-2 text-blue-300 hover:text-white mb-3 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Topics</span>
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{topic.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold text-white">{topic.name}</h1>
                  <p className="text-slate-300">{topic.description}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-3 min-w-[80px]">
                <div className="text-2xl font-bold text-blue-400">
                  {progress?.mastery || 0}%
                </div>
                <div className="text-xs text-slate-400">Mastery</div>
              </div>
              <div className="text-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-3 min-w-[80px]">
                <div className="text-2xl font-bold text-white">
                  {progress?.questions_completed || 0}
                </div>
                <div className="text-xs text-slate-400">Completed</div>
              </div>
              {progress && progress.streak_days > 0 && (
                <div className="text-center bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-xl px-4 py-3 min-w-[80px]">
                  <div className="text-2xl font-bold text-orange-400 flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5" />
                    {progress.streak_days}
                  </div>
                  <div className="text-xs text-slate-400">Day Streak</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-blue-500/20 pt-4">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('subtopic')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'subtopic'
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                }`}
              >
                <ChevronDown className="w-5 h-5" />
                <span>Subtopics</span>
              </button>
              <button
                onClick={() => setActiveTab('daily-practice')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'daily-practice'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                }`}
              >
                <Target className="w-5 h-5" />
                <span>Daily Practice</span>
              </button>
              <button
                onClick={() => setActiveTab('homework')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'homework'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Homework</span>
              </button>
              <button
                onClick={() => setActiveTab('practice-bank')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'practice-bank'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>Practice Bank</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'subtopic' && (
          <div>
            {subtopics.length > 0 ? (
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Select a Subtopic</h2>
                <p className="text-slate-300 mb-6">
                  Choose a subtopic to focus your practice on specific concepts within {topic.name}.
                </p>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full md:w-96 flex items-center justify-between bg-slate-900/50 border-2 border-slate-700/50 hover:border-purple-500/50 rounded-xl px-6 py-4 text-left transition-all"
                  >
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Current Subtopic</div>
                      <div className="font-bold text-white">
                        {selectedSubtopic ? selectedSubtopic.name : 'Select a subtopic'}
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 md:w-96 mt-2 bg-slate-900 border-2 border-slate-700 rounded-xl shadow-xl z-20 max-h-96 overflow-y-auto">
                      {subtopics.map((subtopic) => (
                        <button
                          key={subtopic.id}
                          onClick={() => {
                            setSelectedSubtopic(subtopic);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left px-6 py-4 hover:bg-purple-500/20 transition-colors border-b border-slate-700 last:border-b-0 ${
                            selectedSubtopic?.id === subtopic.id ? 'bg-purple-500/20' : ''
                          }`}
                        >
                          <div className="font-semibold text-white">{subtopic.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/20 rounded-2xl p-8 text-center backdrop-blur-sm">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-white mb-2">Subtopics Coming Soon!</h3>
                <p className="text-slate-300">
                  Subtopics for {topic.name} are being added. For now, you can practice using the other tabs.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <button
                    onClick={() => setActiveTab('daily-practice')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Start Daily Practice
                  </button>
                  <button
                    onClick={() => setActiveTab('homework')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    View Homework
                  </button>
                  <button
                    onClick={() => setActiveTab('practice-bank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Open Practice Bank
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'daily-practice' && (
          <div>
            {selectedSubtopic && (
              <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
                <p className="text-blue-300 font-semibold">
                  Focusing on: <span className="font-bold text-white">{selectedSubtopic.name}</span>
                </p>
              </div>
            )}
            <BasicsSection topic={topic} progress={progress} onProgressUpdate={refreshProgress} />
          </div>
        )}

        {activeTab === 'homework' && (
          <div>
            {selectedSubtopic && (
              <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
                <p className="text-orange-300 font-semibold">
                  Focusing on: <span className="font-bold text-white">{selectedSubtopic.name}</span>
                </p>
              </div>
            )}
            <HomeworkSection topic={topic} onProgressUpdate={refreshProgress} />
          </div>
        )}

        {activeTab === 'practice-bank' && (
          <div>
            {selectedSubtopic && (
              <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
                <p className="text-purple-300 font-semibold">
                  Focusing on: <span className="font-bold text-white">{selectedSubtopic.name}</span>
                </p>
              </div>
            )}
            <PracticeSection topic={topic} progress={progress} onProgressUpdate={refreshProgress} />
          </div>
        )}
      </div>
    </div>
  );
}

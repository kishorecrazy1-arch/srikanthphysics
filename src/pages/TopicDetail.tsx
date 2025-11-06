import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Target, BookOpen, Zap, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { BasicsSection } from '../components/topics/BasicsSection';
import { HomeworkSection } from '../components/topics/HomeworkSection';
import { PracticeSection } from '../components/topics/PracticeSection';
import { DifficultySelector } from '../components/DifficultySelector';
import type { Topic, TopicProgress } from '../types/topics';

type Tab = 'daily-practice' | 'homework' | 'practice-bank';

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
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [progress, setProgress] = useState<TopicProgress | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('daily-practice');
  const [loading, setLoading] = useState(true);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('level_1');

  // Read tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['daily-practice', 'homework', 'practice-bank'].includes(tabParam)) {
      setActiveTab(tabParam as Tab);
    } else {
      // Default to daily-practice if no valid tab is specified
      setActiveTab('daily-practice');
    }
  }, [searchParams]);

  useEffect(() => {
    loadTopicData();
  }, [topicId, user, searchParams]);

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
        
        // Check for subtopicId in URL params
        const subtopicIdFromUrl = searchParams.get('subtopicId');
        if (subtopicIdFromUrl) {
          const foundSubtopic = subtopicsData.find(st => st.id === subtopicIdFromUrl);
          if (foundSubtopic) {
            setSelectedSubtopic(foundSubtopic);
          } else {
            setSelectedSubtopic(subtopicsData[0]);
          }
        } else {
          setSelectedSubtopic(subtopicsData[0]);
        }
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
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-white">{topic.name}</h1>
                    {selectedSubtopic && (
                      <span className="text-xl text-blue-300 font-medium">- {selectedSubtopic.name}</span>
                    )}
                  </div>
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

          {/* Difficulty Level Selector - Only show for Homework and Practice Bank */}
          {activeTab !== 'daily-practice' && (
            <div className="mt-6">
              <DifficultySelector
                selectedLevel={selectedLevel}
                onLevelChange={setSelectedLevel}
                showStats={!!progress}
                stats={progress ? {
                  level_1_completed: (progress as any).level_1_completed || 0,
                  level_1_correct: (progress as any).level_1_correct || 0,
                  level_2_completed: (progress as any).level_2_completed || 0,
                  level_2_correct: (progress as any).level_2_correct || 0,
                  level_3_completed: (progress as any).level_3_completed || 0,
                  level_3_correct: (progress as any).level_3_correct || 0
                } : undefined}
              />
            </div>
          )}

          <div className="mt-6 border-t border-blue-500/20 pt-4">
            <div className="flex gap-2 overflow-x-auto">
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
        {activeTab === 'daily-practice' && (
          <div>
            <BasicsSection 
              topic={topic} 
              progress={progress} 
              onProgressUpdate={refreshProgress} 
              selectedLevel={selectedLevel} 
              selectedSubtopic={selectedSubtopic}
              onLevelChange={setSelectedLevel}
            />
          </div>
        )}

        {activeTab === 'homework' && (
          <div>
            <HomeworkSection topic={topic} onProgressUpdate={refreshProgress} />
          </div>
        )}

        {activeTab === 'practice-bank' && (
          <div>
            <PracticeSection topic={topic} progress={progress} onProgressUpdate={refreshProgress} selectedLevel={selectedLevel} />
          </div>
        )}
      </div>
    </div>
  );
}

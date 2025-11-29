import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle, ChevronDown, ChevronUp, ChevronRight, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Topic, TopicProgress, TopicWithProgress } from '../types/topics';

interface Subtopic {
  id: string;
  topic_id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export function TopicSelection() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [topics, setTopics] = useState<(TopicWithProgress & { subtopics: Subtopic[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTopics();
  }, [user]);

  const loadTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading topics...');
      console.log('User:', user ? 'Authenticated' : 'Not authenticated');
      console.log('Test mode:', useAuthStore.getState().testMode);
      
      // Check Supabase configuration
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        const configError = 'Supabase configuration is missing. Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
        console.error(configError);
        setError(configError);
        setTopics([]);
        return;
      }
      
      console.log('Supabase URL configured:', supabaseUrl ? 'Yes' : 'No');
      
      // Load topics (public read access)
      let topicsData = null;
      let topicsError = null;
      
      try {
        const result = await supabase
          .from('topics')
          .select('*')
          .order('display_order');
        topicsData = result.data;
        topicsError = result.error;
      } catch (fetchError: any) {
        console.error('Network error fetching topics:', fetchError);
        // Check if it's a network/CORS error
        if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
          setError(
            `Network connection error: Unable to reach Supabase. Please check:\n` +
            `1. Your internet connection\n` +
            `2. Supabase URL: ${supabaseUrl}\n` +
            `3. CORS settings in Supabase dashboard\n` +
            `4. Browser console for detailed errors`
          );
          setTopics([]);
          return;
        }
        throw fetchError;
      }

      if (topicsError) {
        console.error('Topics loading error:', topicsError);
        console.error('Error details:', JSON.stringify(topicsError, null, 2));
        
        // Provide more helpful error messages based on error type
        let errorMessage = `Failed to load topics: ${topicsError.message}`;
        
        if (topicsError.code === 'PGRST116') {
          errorMessage = 'Topics table not found. Please ensure the database tables are set up correctly.';
        } else if (topicsError.code === 'PGRST301' || topicsError.message?.includes('JWT')) {
          errorMessage = 'Authentication error. Please check your Supabase API key configuration.';
        } else if (topicsError.message?.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and Supabase URL.';
        }
        
        setError(errorMessage);
        throw topicsError;
      }

      console.log('Topics loaded:', topicsData?.length || 0, 'topics');
      console.log('Topics data:', topicsData);

      // Load all subtopics
      let allSubtopics = null;
      try {
        const { data: subtopicsData, error: subtopicsError } = await supabase
          .from('subtopics')
          .select('*')
          .order('display_order');
        allSubtopics = subtopicsData;
        if (subtopicsError) {
          console.error('Subtopics loading error:', subtopicsError);
        }
      } catch (subtopicError) {
        console.error('Error loading subtopics:', subtopicError);
        // Continue even if subtopics fail to load
        allSubtopics = [];
      }

      console.log('Subtopics loaded:', allSubtopics?.length || 0, 'subtopics');

      // Load user progress if authenticated
      let progressData: TopicProgress[] = [];
      if (user) {
        try {
          const { data } = await supabase
            .from('topic_progress')
            .select('*')
            .eq('user_id', user.id);
          progressData = data || [];
        } catch (progressError) {
          console.error('Error loading progress:', progressError);
          // Continue without progress data
        }
      }

      const topicsWithSubtopics = (topicsData || []).map((topic: any) => {
        const progress = progressData.find((p: TopicProgress) => p.topic_id === topic.id);

        let status: 'mastered' | 'in-progress' | 'not-started' = 'not-started';
        if (progress) {
          if (progress.mastery >= 90) status = 'mastered';
          else if (progress.mastery > 0) status = 'in-progress';
        }

        // Find subtopics for this topic
        const topicSubtopics = (allSubtopics || [])
          .filter((st: Subtopic) => st.topic_id === topic.id)
          .sort((a: Subtopic, b: Subtopic) => a.display_order - b.display_order);

        console.log(`Topic: ${topic.name}, Subtopics found:`, topicSubtopics.length);

        return {
          ...topic,
          progress,
          status,
          subtopics: topicSubtopics
        };
      });

      console.log('All topics with subtopics:', topicsWithSubtopics);
      setTopics(topicsWithSubtopics);
      setError(null);
    } catch (error: any) {
      console.error('Error loading topics:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load topics.';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Failed to load topics. Please check your database connection and browser console for details.';
      }
      
      setError(errorMessage);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading topics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/ap-physics')}
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">AP Physics 1</h1>
              <p className="text-slate-300">Choose your topic to begin learning</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Your Progress Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {topics.filter(t => t.status === 'mastered').length}
                </div>
                <div className="text-sm text-slate-300">Mastered Topics</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">
                  {topics.filter(t => t.status === 'in-progress').length}
                </div>
                <div className="text-sm text-slate-300">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-300">
                  {topics.filter(t => t.status === 'not-started').length}
                </div>
                <div className="text-sm text-slate-400">Not Started</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {Math.round((topics.reduce((sum, t) => sum + (t.progress?.mastery || 0), 0) / topics.length) || 0)}%
                </div>
                <div className="text-sm text-slate-300">Overall Progress</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Topics & Chapters</h3>
              <p className="text-slate-300">Select a topic to begin your learning journey</p>
            </div>
            <div className="text-sm text-slate-400">
              {topics.length} {topics.length === 1 ? 'Topic' : 'Topics'} Available
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-900/30 border-2 border-red-500/50 rounded-2xl shadow-lg p-12">
            <div className="text-center mb-6">
              <div className="text-red-400 font-semibold text-xl mb-2">Error Loading Topics</div>
              <div className="text-red-300 text-sm whitespace-pre-line text-left bg-red-950/50 p-4 rounded-lg border border-red-700/50">
                {error}
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={loadTopics}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <p className="text-red-400 text-xs text-center max-w-md">
                If the error persists, please check the browser console (F12) for detailed error messages and ensure your Supabase configuration is correct.
              </p>
            </div>
          </div>
        ) : topics.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Topics Available</h3>
            <p className="text-slate-300 mb-4">Topics will appear here once they are added to the course.</p>
            <p className="text-sm text-slate-400">
              Make sure you have topics in your Supabase database. Check the browser console for more details.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => {
              const isExpanded = expandedTopics.has(topic.id);
              return (
                <div
                  key={topic.id}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden"
                  style={{ borderLeft: `6px solid ${topic.color}` }}
                >
                  {/* Topic Header - Clickable to expand/collapse */}
                  <div
                    className="p-6 cursor-pointer hover:bg-slate-700/30 transition-colors"
                    onClick={() => toggleTopic(topic.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${topic.color}20` }}>
                          {topic.icon || '📚'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-bold text-white">{topic.name}</h3>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                              style={{ backgroundColor: getStatusColor(topic.status) }}
                            >
                              {getStatusText(topic.status)}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm">{topic.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {topic.subtopics && topic.subtopics.length > 0 ? (
                          <>
                            <span className="text-sm text-slate-400">
                              {topic.subtopics.length} {topic.subtopics.length === 1 ? 'subtopic' : 'subtopics'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-slate-400">No subtopics</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subtopics List - Shown when expanded */}
                  {isExpanded && topic.subtopics && topic.subtopics.length > 0 && (
                    <div className="bg-slate-900/50 px-6 pb-6">
                      <div className="space-y-2">
                        {topic.subtopics.map((subtopic, index) => (
                          <div
                            key={subtopic.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/ap-physics/topic/${topic.id}?subtopicId=${subtopic.id}&tab=daily-practice`);
                            }}
                            className="flex items-center justify-between bg-slate-800/50 rounded-lg p-4 hover:bg-blue-500/20 transition-colors cursor-pointer border border-slate-700/50 hover:border-blue-400/50"
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: topic.color }}
                              >
                                {index + 1}
                              </div>
                              <span className="text-white font-medium">{subtopic.name}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

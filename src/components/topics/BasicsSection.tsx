import { useEffect, useState } from 'react';
import { Calendar, Target, TrendingUp, Clock, RefreshCw, Zap, Play, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { QuestionCard } from './QuestionCard';
import { QuizMode } from './QuizMode';
import { StudentQuestionInput } from './StudentQuestionInput';
import type { Topic, TopicProgress, Question, UserAnswer } from '../../types/topics';

interface Subtopic {
  id: string;
  name: string;
  description: string | null;
}

interface BasicsSectionProps {
  topic: Topic;
  progress: TopicProgress | null;
  onProgressUpdate: () => void;
  selectedLevel?: string;
  selectedSubtopic?: Subtopic | null;
}

export function BasicsSection({ topic, progress, onProgressUpdate, selectedLevel = 'level_1', selectedSubtopic }: BasicsSectionProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Map<string, UserAnswer>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showQuizMode, setShowQuizMode] = useState(false);
  const [stats, setStats] = useState({ completed: 0, accuracy: 0, avgTime: 0 });

  useEffect(() => {
    loadDailyQuestions();
  }, [topic.id, user, selectedLevel, selectedSubtopic?.id]);

  const loadDailyQuestions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      let query = supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topic.id)
        .eq('segment_type', 'basics')
        .eq('difficulty_level', selectedLevel)
        .eq('generated_date', today);

      // Filter by subtopic if available
      if (selectedSubtopic) {
        query = query.eq('subtopic', selectedSubtopic.name);
      }

      const { data: questionsData, error: questionsError } = await query.order('created_at');

      if (questionsError) throw questionsError;

      if (!questionsData || questionsData.length === 0) {
        questionsData = await generateDailyQuestions(topic, selectedSubtopic, selectedLevel);
      }

      setQuestions(questionsData || []);

      if (user) {
        const questionIds = (questionsData || []).map(q => q.id);
        const { data: answersData } = await supabase
          .from('user_answers')
          .select('*')
          .eq('user_id', user.id)
          .in('question_id', questionIds);

        const answersMap = new Map<string, UserAnswer>();
        let totalTime = 0;
        let correctCount = 0;

        (answersData || []).forEach(answer => {
          answersMap.set(answer.question_id, answer);
          totalTime += answer.time_spent;
          if (answer.is_correct) correctCount++;
        });

        setUserAnswers(answersMap);
        setStats({
          completed: answersData?.length || 0,
          accuracy: answersData && answersData.length > 0
            ? Math.round((correctCount / answersData.length) * 100)
            : 0,
          avgTime: answersData && answersData.length > 0
            ? Math.floor(totalTime / answersData.length)
            : 0
        });
      }
    } catch (error) {
      console.error('Error loading daily questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyQuestions = async (topic: Topic, subtopic: Subtopic | null | undefined, level: string): Promise<Question[]> => {
    const today = new Date().toISOString().split('T')[0];
    const questionCount = 10;
    const subtopicName = subtopic?.name || 'General';
    
    try {
      // Use AI question generation service
      const { generatePhysicsQuestions } = await import('../../lib/aiQuestionGenerator');
      
      const generatedQuestions = await generatePhysicsQuestions(
        topic.id,
        topic.name,
        subtopicName,
        level as 'level_1' | 'level_2' | 'level_3',
        'mcq',
        questionCount
      );

      // Insert questions into database
      const questionsToInsert = generatedQuestions.map(q => ({
        topic_id: q.topic_id,
        segment_type: q.segment_type,
        question_text: q.question_text,
        options: q.options,
        difficulty: q.difficulty,
        difficulty_level: level,
        question_type: q.question_type,
        subtopic: q.subtopic,
        explanation: q.explanation,
        image_url: q.image_url,
        time_limit: q.time_limit,
        ai_generated: q.ai_generated,
        generated_date: today
      }));

      const { data: insertedQuestions } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select();

      return insertedQuestions || [];
    } catch (error) {
      console.error('Error generating questions with AI, falling back to sample questions:', error);
      
      // Fallback to original sample questions if AI generation fails
      const difficultyMap: Record<string, { difficulty: 'easy' | 'medium' | 'hard', complexity: string }> = {
        'level_1': { difficulty: 'easy', complexity: 'basic concepts and simple problems' },
        'level_2': { difficulty: 'medium', complexity: 'multi-step application problems' },
        'level_3': { difficulty: 'hard', complexity: 'complex problem-solving and synthesis' }
      };
      
      const levelInfo = difficultyMap[level] || difficultyMap['level_1'];
      
      const sampleQuestions = Array.from({ length: questionCount }, (_, index) => {
        return {
          topic_id: topic.id,
          segment_type: 'basics' as const,
          question_text: `[${topic.name} - ${subtopicName} - ${levelInfo.complexity}] Question ${index + 1}: A problem related to ${subtopicName} at ${levelInfo.difficulty} level. This question tests understanding of ${subtopicName} concepts within ${topic.name}.`,
          options: [
            { id: 'A', text: 'Option A', isCorrect: index % 4 === 0 },
            { id: 'B', text: 'Option B', isCorrect: index % 4 === 1 },
            { id: 'C', text: 'Option C', isCorrect: index % 4 === 2 },
            { id: 'D', text: 'Option D', isCorrect: index % 4 === 3 }
          ],
          difficulty: levelInfo.difficulty,
          difficulty_level: level,
          question_type: 'calculation' as const,
          subtopic: subtopicName,
          explanation: {
            steps: [
              {
                title: 'Understanding the Problem',
                content: `This question focuses on ${subtopicName} within ${topic.name} at ${levelInfo.complexity} level.`
              },
              {
                title: 'Key Concepts',
                content: `Apply your knowledge of ${subtopicName} to solve this problem.`
              },
              {
                title: 'Solution Approach',
                content: `Use appropriate formulas and methods for ${levelInfo.difficulty} level problems in ${subtopicName}.`
              }
            ],
            keyConcept: `${subtopicName} in ${topic.name} - ${levelInfo.complexity}`,
            relatedFormulas: [`Formula related to ${subtopicName}`]
          },
          time_limit: levelInfo.difficulty === 'easy' ? 120 : levelInfo.difficulty === 'medium' ? 180 : 240,
          ai_generated: true,
          generated_date: today
        };
      });

      const { data: insertedQuestions } = await supabase
        .from('questions')
        .insert(sampleQuestions)
        .select();

      return insertedQuestions || [];
    }
  };

  const handleAnswer = async (questionId: string, selectedAnswer: string, timeSpent: number) => {
    if (!user) return;

    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const correctOption = question.options.find(opt => opt.isCorrect);
    const isCorrect = selectedAnswer === correctOption?.id;

    const { data: newAnswer } = await supabase
      .from('user_answers')
      .insert({
        user_id: user.id,
        question_id: questionId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        time_spent: timeSpent
      })
      .select()
      .single();

    if (newAnswer) {
      const newAnswersMap = new Map(userAnswers);
      newAnswersMap.set(questionId, newAnswer);
      setUserAnswers(newAnswersMap);

      const completed = newAnswersMap.size;
      const correct = Array.from(newAnswersMap.values()).filter(a => a.is_correct).length;
      const totalTime = Array.from(newAnswersMap.values()).reduce((sum, a) => sum + a.time_spent, 0);

      setStats({
        completed,
        accuracy: Math.round((correct / completed) * 100),
        avgTime: Math.floor(totalTime / completed)
      });

      if (progress) {
        const newMastery = Math.min(100, Math.round((progress.mastery + (isCorrect ? 2 : 0.5))));
        await supabase
          .from('topic_progress')
          .update({
            mastery: newMastery,
            questions_completed: progress.questions_completed + 1,
            questions_correct: progress.questions_correct + (isCorrect ? 1 : 0),
            last_practiced: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', progress.id);

        onProgressUpdate();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getTimeUntilRenewal = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading daily questions...</p>
      </div>
    );
  }

  if (showQuizMode) {
    return (
      <QuizMode
        topic={topic}
        difficultyLevel={selectedLevel}
        progress={progress}
        onBack={() => {
          setShowQuizMode(false);
          setShowLevelSelector(true);
        }}
        onProgressUpdate={onProgressUpdate}
      />
    );
  }

  return (
    <div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-gradient-to-br from-teal-700/40 to-teal-900/40 backdrop-blur-sm rounded-lg p-4 border border-teal-600/30 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{stats.completed}/10</div>
          <div className="text-xs text-slate-300">Completed Today</div>
        </div>
        <div className="flex-1 bg-gradient-to-br from-blue-700/40 to-blue-900/40 backdrop-blur-sm rounded-lg p-4 border border-blue-600/30 text-center">
          <div className="text-2xl font-bold text-blue-300 mb-1">{stats.accuracy}%</div>
          <div className="text-xs text-slate-300">Accuracy</div>
        </div>
        <div className="flex-1 bg-gradient-to-br from-orange-700/40 to-orange-900/40 backdrop-blur-sm rounded-lg p-4 border border-orange-600/30 text-center">
          <div className="text-2xl font-bold text-orange-400 mb-1">{formatTime(stats.avgTime)}</div>
          <div className="text-xs text-slate-300">Avg Time</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-6">Practice Sections</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Strengthen Your Basics Card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 hover:border-green-500/50 transition-all p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Strengthen Your Basics</h4>
                <p className="text-sm text-slate-400">Daily practice</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4 text-sm">
              10 AI-generated questions refreshed daily to build strong foundations
            </p>
            {questions.length === 0 ? (
              <button
                onClick={() => {
                  setLoading(true);
                  loadDailyQuestions();
                }}
                disabled={loading}
                className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Get 10 Questions
                  </>
                )}
              </button>
            ) : (
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-sm text-slate-400 mb-1">Today's Practice</div>
                <div className="text-xs text-slate-300">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  New in: {getTimeUntilRenewal()}
                </div>
              </div>
            )}
          </div>

          {/* AI Motion Simulator Card */}
          <button
            onClick={() => navigate('/motion-simulator')}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 hover:border-cyan-500/50 transition-all p-6 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">AI Motion Simulator</h4>
                <p className="text-sm text-slate-400">Interactive visualization</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm">
              Visualize projectile motion, collisions, and other physics concepts with real-time interactive simulations.
            </p>
          </button>

          {/* Daily Questions Card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 hover:border-blue-500/50 transition-all p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Daily Questions</h4>
                <p className="text-sm text-slate-400">Practice & learn</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Complete all {questions.length} questions to maximize your learning today
            </p>
            {questions.length > 0 && (
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{questions.length}</div>
                <div className="text-xs text-slate-400">Questions Available</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">

        {/* Compact Chat Box for Student Questions */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h4 className="text-lg font-semibold text-white">Ask Your Question</h4>
            <span className="text-xs text-slate-400">Powered by OpenAI GPT-4</span>
          </div>
          <StudentQuestionInput topicName={topic.name} subtopicName={selectedSubtopic?.name} />
        </div>
      </div>

      {questions.length > 0 && (
        questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={index + 1}
            totalQuestions={questions.length}
            userAnswer={userAnswers.get(question.id)}
            onAnswer={handleAnswer}
          />
        ))
      )}

      {stats.completed === 10 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold mb-2">Great Job!</h3>
          <p className="text-xl text-green-50 mb-4">
            You've completed all daily basics questions for today!
          </p>
          <p className="text-green-100">
            Come back tomorrow for new questions or explore other segments
          </p>
        </div>
      )}

    </div>
  );
}

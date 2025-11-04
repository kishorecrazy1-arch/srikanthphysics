import { useEffect, useState } from 'react';
import { Calendar, Target, TrendingUp, Clock, RefreshCw, Zap, Play, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { QuestionCard } from './QuestionCard';
import { DifficultySelector } from '../DifficultySelector';
import { QuizMode } from './QuizMode';
import { StudentQuestionInput } from './StudentQuestionInput';
import type { Topic, TopicProgress, Question, UserAnswer } from '../../types/topics';

interface BasicsSectionProps {
  topic: Topic;
  progress: TopicProgress | null;
  onProgressUpdate: () => void;
}

export function BasicsSection({ topic, progress, onProgressUpdate }: BasicsSectionProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Map<string, UserAnswer>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('level_1');
  const [showLevelSelector, setShowLevelSelector] = useState(true);
  const [showQuizMode, setShowQuizMode] = useState(false);
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [stats, setStats] = useState({ completed: 0, accuracy: 0, avgTime: 0 });

  useEffect(() => {
    loadDailyQuestions();
  }, [topic.id, user, selectedLevel]);

  const loadDailyQuestions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      let { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topic.id)
        .eq('segment_type', 'basics')
        .eq('difficulty_level', selectedLevel)
        .eq('generated_date', today)
        .order('created_at');

      if (questionsError) throw questionsError;

      if (!questionsData || questionsData.length === 0) {
        questionsData = await generateDailyQuestions(topic);
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

  const generateDailyQuestions = async (topic: Topic): Promise<Question[]> => {
    const today = new Date().toISOString().split('T')[0];

    const sampleQuestions = [
      {
        topic_id: topic.id,
        segment_type: 'basics' as const,
        question_text: `A car starts from rest and accelerates uniformly at 3 m/s² for 5 seconds. What is its final velocity?`,
        options: [
          { id: 'A', text: '10 m/s', isCorrect: false },
          { id: 'B', text: '15 m/s', isCorrect: true },
          { id: 'C', text: '20 m/s', isCorrect: false },
          { id: 'D', text: '25 m/s', isCorrect: false }
        ],
        difficulty: 'easy' as const,
        difficulty_level: selectedLevel,
        question_type: 'calculation' as const,
        subtopic: topic.subtopics[0],
        explanation: {
          steps: [
            {
              title: 'Identify given values',
              content: 'Initial velocity (u) = 0 m/s (starts from rest)\nAcceleration (a) = 3 m/s²\nTime (t) = 5 s'
            },
            {
              title: 'Apply the formula',
              content: 'Use the first equation of motion: v = u + at'
            },
            {
              title: 'Substitute and calculate',
              content: 'v = 0 + (3)(5)\nv = 15 m/s'
            }
          ],
          keyConcept: 'When an object starts from rest (u=0), its final velocity equals acceleration multiplied by time.',
          relatedFormulas: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as']
        },
        time_limit: 120,
        ai_generated: true,
        generated_date: today
      }
    ];

    const { data: insertedQuestions } = await supabase
      .from('questions')
      .insert(sampleQuestions)
      .select();

    return insertedQuestions || [];
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

  if (showLevelSelector) {
    return (
      <div>
        <DifficultySelector
          selectedLevel={selectedLevel}
          onLevelChange={(level) => {
            setSelectedLevel(level);
            setShowLevelSelector(false);
          }}
          showStats={true}
          stats={progress ? {
            level_1_completed: progress.level_1_completed || 0,
            level_1_correct: progress.level_1_correct || 0,
            level_2_completed: progress.level_2_completed || 0,
            level_2_correct: progress.level_2_correct || 0,
            level_3_completed: progress.level_3_completed || 0,
            level_3_correct: progress.level_3_correct || 0
          } : undefined}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowLevelSelector(true)}
        className="mb-6 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
      >
        Back to Level Selection
      </button>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-teal-700/40 to-teal-900/40 backdrop-blur-sm rounded-2xl p-8 border border-teal-600/30 shadow-lg">
          <div className="text-5xl font-bold text-green-400 mb-3">{stats.completed}/10</div>
          <div className="text-base text-slate-200 font-medium">Completed Today</div>
        </div>
        <div className="bg-gradient-to-br from-blue-700/40 to-blue-900/40 backdrop-blur-sm rounded-2xl p-8 border border-blue-600/30 shadow-lg">
          <div className="text-5xl font-bold text-blue-300 mb-3">{stats.accuracy}%</div>
          <div className="text-base text-slate-200 font-medium">Accuracy</div>
        </div>
        <div className="bg-gradient-to-br from-orange-700/40 to-orange-900/40 backdrop-blur-sm rounded-2xl p-8 border border-orange-600/30 shadow-lg">
          <div className="text-5xl font-bold text-orange-400 mb-3">{formatTime(stats.avgTime)}</div>
          <div className="text-base text-slate-200 font-medium">Avg Time</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white mb-8 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Target className="w-8 h-8" />
              Strengthen Your Basics
            </h2>
            <p className="text-slate-300 text-lg">
              10 AI-generated questions refreshed daily to build strong foundations
            </p>
          </div>

          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[180px]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Today's Practice</span>
            </div>
            <div className="text-sm opacity-90">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="mt-2 text-xs opacity-75 flex items-center justify-center gap-1">
              <RefreshCw className="w-3 h-3" />
              New questions in: {getTimeUntilRenewal()}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl p-8 mb-8 border-2 border-cyan-400/30 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Play className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">AI Motion Simulator</h3>
                <p className="text-cyan-100">Interactive Physics Visualization</p>
              </div>
            </div>
            <p className="text-white/90 text-lg">
              Visualize projectile motion, collisions, and other physics concepts with real-time interactive simulations.
            </p>
          </div>
          <button
            onClick={() => navigate('/motion-simulator')}
            className="px-8 py-4 bg-white text-cyan-600 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 whitespace-nowrap"
          >
            Launch Simulator →
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Daily Questions</h3>
          <p className="text-slate-300">
            Complete all {questions.length} questions to maximize your learning today
          </p>
        </div>
        <button
          onClick={() => setShowAskQuestion(true)}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
          Ask Your Question
        </button>
      </div>

      {questions.length > 0 ? (
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
      ) : (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-white mb-2">No questions available yet</h3>
          <p className="text-slate-300">
            Daily questions will be generated automatically. Check back soon!
          </p>
        </div>
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

      <div className="mt-12 mb-8">
        <h3 className="text-2xl font-bold text-white mb-6">Additional Practice</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate(`/quiz/${topic.id}`)}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 hover:border-blue-500/50 transition-all p-6 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Practice Mode</h4>
                <p className="text-sm text-slate-400">Untimed practice</p>
              </div>
            </div>
            <p className="text-slate-300">
              Practice questions with instant feedback.
            </p>
          </button>

          <button
            onClick={() => navigate('/graph-generator')}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 hover:border-green-500/50 transition-all p-6 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Graph Generator</h4>
                <p className="text-sm text-slate-400">Visual tools</p>
              </div>
            </div>
            <p className="text-slate-300">
              Generate and analyze physics graphs.
            </p>
          </button>

          <button
            onClick={() => navigate('/frq-practice')}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 hover:border-orange-500/50 transition-all p-6 text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">FRQ Practice</h4>
                <p className="text-sm text-slate-400">Free response</p>
              </div>
            </div>
            <p className="text-slate-300">
              Practice free response questions.
            </p>
          </button>
        </div>
      </div>

      {showAskQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Ask Your Question</h2>
              <button
                onClick={() => setShowAskQuestion(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <StudentQuestionInput topicName={topic.name} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

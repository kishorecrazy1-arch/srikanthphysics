import { useState, useEffect } from 'react';
import { Filter, Target, Clock, Zap, TrendingUp, CheckCircle, XCircle, BookCheck, Users, Shuffle, BarChart3, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { QuestionCard } from './QuestionCard';
import type { Topic, TopicProgress, Question, UserAnswer } from '../../types/topics';

interface PracticeSectionProps {
  topic: Topic;
  progress: TopicProgress | null;
  onProgressUpdate: () => void;
  selectedLevel?: string;
}

export function PracticeSection({ topic, progress, onProgressUpdate, selectedLevel = 'level_1' }: PracticeSectionProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Map<string, UserAnswer>>(new Map());
  const [loading, setLoading] = useState(true);
  const [practiceMode, setPracticeMode] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<'normal' | 'club' | 'random' | 'exam-simulator'>('normal');

  const [filters, setFilters] = useState({
    difficulty: 'all',
    subtopic: 'all',
    status: 'all'
  });

  useEffect(() => {
    loadQuestions();
  }, [topic.id, user, subTab, selectedLevel]);

  useEffect(() => {
    applyFilters();
  }, [questions, filters, userAnswers]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      
      // Map level to difficulty format
      const difficultyMap: Record<string, string> = {
        'level_1': 'Foundation',
        'level_2': 'Intermediate',
        'level_3': 'Advanced'
      };
      const difficultyLevel = difficultyMap[selectedLevel] || 'Foundation';

      console.log('📚 Loading practice bank questions:', {
        topic: topic.name,
        difficulty: difficultyLevel,
        level: selectedLevel
      });

      // Load practice bank questions (segment_type = 'practice_bank')
      let query = supabase
        .from('questions')
        .select('*')
        .eq('segment_type', 'practice_bank')
        .eq('topic_id', topic.id)
        .eq('difficulty_level', difficultyLevel);

      if (subTab === 'normal') {
        // Already filtered by topic_id
      } else if (subTab === 'club') {
        // Load questions from all topics for club mode
        query = supabase
          .from('questions')
          .select('*')
          .eq('segment_type', 'practice_bank')
          .eq('difficulty_level', difficultyLevel);
      } else if (subTab === 'random') {
        // Same as normal, but will shuffle later
        query = query.eq('topic_id', topic.id);
      }

      const { data: questionsData, error: questionsError } = await query.order('created_at');

      if (questionsError) {
        console.warn('Error loading practice questions:', questionsError);
      }

      let questionsToUse = questionsData || [];

      // If no questions found, generate them on-demand
      if (!questionsData || questionsData.length === 0) {
        console.log('📝 No practice bank questions found. Generating for all subtopics...');
        try {
          const { PracticeBankGenerator } = await import('../../services/practiceBankGenerator');
          const generator = new PracticeBankGenerator();
          
          // Get all subtopics for this topic
          const { data: subtopics } = await supabase
            .from('subtopics')
            .select('id, name')
            .eq('topic_id', topic.id);

          if (subtopics && subtopics.length > 0) {
            // Generate questions for ALL subtopics (5 questions each)
            const allGenerated: any[] = [];
            for (const subtopic of subtopics) {
              try {
                const generated = await generator.generatePracticeQuestions({
                  topicId: topic.id,
                  topicName: topic.name,
                  subtopicId: subtopic.id,
                  subtopicName: subtopic.name,
                  difficulty: difficultyLevel as 'Foundation' | 'Intermediate' | 'Advanced',
                  count: 5
                });
                allGenerated.push(...generated);
                console.log(`✅ Generated ${generated.length} questions for ${subtopic.name}`);
              } catch (subtopicError) {
                console.error(`Error generating for subtopic ${subtopic.name}:`, subtopicError);
              }
            }
            questionsToUse = allGenerated;
            console.log(`✅ Total generated: ${allGenerated.length} questions`);
          } else {
            console.warn('No subtopics found, using fallback');
            // Fallback to old method
            questionsToUse = await generatePracticeQuestions(topic);
          }
        } catch (genError) {
          console.error('Error generating practice questions:', genError);
          questionsToUse = await generatePracticeQuestions(topic);
        }
      }

      // Transform questions to match expected format
      const transformedQuestions = questionsToUse.map((q: any) => {
        let optionsArray: any[] = [];
        if (q.options) {
          if (Array.isArray(q.options)) {
            optionsArray = q.options;
          } else if (typeof q.options === 'object') {
            optionsArray = Object.entries(q.options).map(([key, value]) => ({
              id: key,
              text: value as string,
              isCorrect: key === q.correct_answer
            }));
          }
        }

        // Map difficulty_level to difficulty
        const qDifficultyLevel = q.difficulty_level || q.difficulty || 'intermediate';
        const difficultyMapLocal: Record<string, string> = {
          'Foundation': 'easy',
          'Intermediate': 'medium',
          'Advanced': 'hard'
        };
        const mappedDifficulty = difficultyMapLocal[qDifficultyLevel] || qDifficultyLevel.toLowerCase() || 'medium';

        // Get subtopic name if available
        let subtopicName = q.subtopic;
        if (!subtopicName && q.subtopic_id) {
          // Try to get subtopic name from the questions data or leave as is
          subtopicName = q.subtopic_id;
        }

        return {
          ...q,
          options: optionsArray,
          difficulty: mappedDifficulty,
          subtopic: subtopicName, // Ensure subtopic is set for filtering
          correctAnswer: q.correct_answer || q.correctAnswer,
          question_text: q.question_text || q.text || 'Question text not available',
          explanation: q.explanation || (q.solution_steps ? {
            steps: q.solution_steps.map((step: string, idx: number) => ({
              title: `Step ${idx + 1}`,
              content: step
            })),
            keyConcept: q.bloom_taxonomy || 'Physics concept',
            relatedFormulas: q.formulas_used || []
          } : null)
        };
      });

      if (subTab === 'random' && transformedQuestions.length > 0) {
        transformedQuestions.sort(() => Math.random() - 0.5);
      }

      setQuestions(transformedQuestions);
      console.log('✅ Loaded practice questions:', transformedQuestions.length);

      if (user && questionsToUse.length > 0) {
        const questionIds = questionsToUse.map(q => q.id);
        const { data: answersData } = await supabase
          .from('user_answers')
          .select('*')
          .eq('user_id', user.id)
          .in('question_id', questionIds);

        const answersMap = new Map<string, UserAnswer>();
        (answersData || []).forEach(answer => {
          answersMap.set(answer.question_id, answer);
        });

        setUserAnswers(answersMap);
      }
    } catch (error) {
      console.error('Error loading practice questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePracticeQuestions = async (topic: Topic): Promise<Question[]> => {
    const sampleQuestions = [
      {
        topic_id: topic.id,
        segment_type: 'practice' as const,
        question_text: `An object is thrown vertically upward with an initial velocity of 20 m/s. How high does it rise? (g = 10 m/s²)`,
        options: [
          { id: 'A', text: '10 m', isCorrect: false },
          { id: 'B', text: '20 m', isCorrect: true },
          { id: 'C', text: '30 m', isCorrect: false },
          { id: 'D', text: '40 m', isCorrect: false }
        ],
        difficulty: 'medium' as const,
        question_type: 'calculation' as const,
        subtopic: topic.subtopics[1] || 'General',
        explanation: {
          steps: [
            {
              title: 'Identify given values',
              content: 'Initial velocity (u) = 20 m/s\nFinal velocity at max height (v) = 0 m/s\nAcceleration (a) = -10 m/s² (gravity)'
            },
            {
              title: 'Apply the formula',
              content: 'Use v² = u² + 2as\nRearrange: s = (v² - u²) / 2a'
            },
            {
              title: 'Calculate',
              content: 's = (0² - 20²) / (2 × -10)\ns = -400 / -20 = 20 m'
            }
          ],
          keyConcept: 'At maximum height, the final velocity is zero. Use the third equation of motion to find displacement.',
          relatedFormulas: ['v² = u² + 2as', 'v = u + at', 's = ut + ½at²']
        },
        time_limit: 180,
        ai_generated: false
      }
    ];

    const { data: insertedQuestions } = await supabase
      .from('questions')
      .insert(sampleQuestions)
      .select();

    return insertedQuestions || [];
  };

  const applyFilters = () => {
    let filtered = [...questions];

    console.log('🔍 Applying filters:', {
      totalQuestions: questions.length,
      filters,
      firstQuestion: questions[0] ? {
        difficulty: questions[0].difficulty,
        subtopic: questions[0].subtopic
      } : null
    });

    if (filters.difficulty !== 'all') {
      // Map filter difficulty to match question difficulty format
      const difficultyMap: Record<string, string[]> = {
        'easy': ['easy', 'foundation'],
        'medium': ['medium', 'intermediate'],
        'hard': ['hard', 'advanced']
      };
      const allowedDifficulties = difficultyMap[filters.difficulty] || [filters.difficulty];
      filtered = filtered.filter(q => {
        const qDifficulty = (q.difficulty || '').toLowerCase();
        return allowedDifficulties.some(d => qDifficulty.includes(d.toLowerCase()));
      });
    }

    if (filters.subtopic !== 'all') {
      filtered = filtered.filter(q => {
        // Check both subtopic field and subtopic_id
        const qSubtopic = q.subtopic || q.subtopic_id || '';
        return qSubtopic === filters.subtopic || qSubtopic.toString() === filters.subtopic;
      });
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(q => {
        const answer = userAnswers.get(q.id);
        if (filters.status === 'not-attempted') return !answer;
        if (filters.status === 'correct') return answer?.is_correct;
        if (filters.status === 'incorrect') return answer && !answer.is_correct;
        return true;
      });
    }

    console.log('✅ Filtered questions:', filtered.length);
    setFilteredQuestions(filtered);
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

      if (progress) {
        const newMastery = Math.min(100, Math.round(progress.mastery + (isCorrect ? 1 : 0.3)));
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

  const getStats = () => {
    const attempted = questions.filter(q => userAnswers.has(q.id)).length;
    const correct = Array.from(userAnswers.values()).filter(a => a.is_correct).length;
    const incorrect = Array.from(userAnswers.values()).filter(a => !a.is_correct).length;

    return {
      attempted,
      correct,
      incorrect,
      notAttempted: questions.length - attempted
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading practice questions...</p>
      </div>
    );
  }

  if (!practiceMode) {
    return (
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6 overflow-x-auto">
            <button
              onClick={() => setSubTab('normal')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                subTab === 'normal'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              <Target className="w-4 h-4" />
              Normal Mix
            </button>
            <button
              onClick={() => setSubTab('club')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                subTab === 'club'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              Club Matrix
            </button>
            <button
              onClick={() => setSubTab('random')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                subTab === 'random'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              Random Mix
            </button>
            <button
              onClick={() => setSubTab('exam-simulator')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                subTab === 'exam-simulator'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              <BookCheck className="w-4 h-4" />
              AP Exam Simulator
            </button>
          </div>

          {subTab === 'exam-simulator' && (
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 mb-8 border-2 border-emerald-400/30 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <BookCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">AP Exam Simulator</h3>
                      <p className="text-emerald-100">Full-length practice test with AP-style questions</p>
                    </div>
                  </div>
                  <p className="text-white/90 text-lg">
                    Experience a real AP Physics exam with 50 MCQs, strict timing, and detailed performance analytics.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/mock-test')}
                  className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 whitespace-nowrap"
                >
                  Start Mock Test →
                </button>
              </div>
            </div>
          )}

          {subTab !== 'exam-simulator' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {subTab === 'club' ? 'Club Matrix' : subTab === 'random' ? 'Random Mix' : 'Normal Mix Practice'}
              </h3>
              {subTab === 'club' && (
                <p className="text-slate-300 mb-6">Practice questions from multiple topics across all difficulty levels for comprehensive review.</p>
              )}
              {subTab === 'random' && (
                <p className="text-slate-300 mb-6">Get a random mix of questions from this topic to challenge yourself.</p>
              )}

              <div className="grid md:grid-cols-3 gap-4">
              {subTab === 'normal' && (
              <>
                <button
                  onClick={() => setPracticeMode('practice')}
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
                      <BarChart3 className="w-6 h-6 text-green-400" />
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
                      <Edit3 className="w-6 h-6 text-orange-400" />
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
              </>
            )}

            {subTab === 'club' && (
              <div className="col-span-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border-2 border-slate-700/50 p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-2">Club Matrix Coming Soon!</h3>
                <p className="text-slate-300">
                  Multi-topic practice questions will be available soon.
                </p>
              </div>
            )}

            {subTab === 'random' && (
              <>
                <button
                  onClick={() => setPracticeMode('random')}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 hover:border-cyan-500/50 transition-all p-6 text-left"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                      <Shuffle className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Random Mix</h4>
                      <p className="text-sm text-slate-400">Mixed difficulty</p>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    Random selection of all levels.
                  </p>
                </button>

                <button
                  onClick={() => setPracticeMode('timed')}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 hover:border-orange-500/50 transition-all p-6 text-left"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Timed Quiz</h4>
                      <p className="text-sm text-slate-400">Exam simulation</p>
                    </div>
                  </div>
                  <p className="text-slate-300">
                    Test under time pressure.
                  </p>
                </button>
              </>
            )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {practiceMode === 'timed' ? 'Timed Quiz Mode' : 'Practice Mode'}
        </h2>
        <button
          onClick={() => setPracticeMode(null)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Practice Bank
        </button>
      </div>

      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={index + 1}
            totalQuestions={filteredQuestions.length}
            userAnswer={userAnswers.get(question.id)}
            onAnswer={handleAnswer}
          />
        ))
      ) : questions.length > 0 ? (
        // If filters are too restrictive but questions exist, show message
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No questions match your filters</h3>
          <p className="text-gray-600 mb-4">
            You have {questions.length} questions available, but none match your current filters.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Try adjusting your filters or reset them to see all questions
          </p>
          <button
            onClick={() => setFilters({ difficulty: 'all', subtopic: 'all', status: 'all' })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        // No questions at all - show generation message
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Practice Questions Available</h3>
          <p className="text-gray-600 mb-4">
            Practice bank questions are being generated. This may take a moment.
          </p>
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <span>Generating questions...</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setLoading(true);
                loadQuestions();
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Generate Questions
            </button>
          )}
        </div>
      )}
    </div>
  );
}

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
  const [error, setError] = useState<string | null>(null);
  const [showQuizMode, setShowQuizMode] = useState(false);
  const [stats, setStats] = useState({ completed: 0, accuracy: 0, avgTime: 0 });

  useEffect(() => {
    loadDailyQuestions();
  }, [topic.id, user, selectedLevel, selectedSubtopic?.id]);

  const loadDailyQuestions = async () => {
    try {
      setError(null);
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      console.log('🔍 Loading daily questions...', {
        topic: topic.name,
        subtopic: selectedSubtopic?.name,
        level: selectedLevel,
        date: today
      });

      // Map level to difficulty format for query
      const difficultyMap: Record<string, string> = {
        'level_1': 'Foundation',
        'level_2': 'Intermediate',
        'level_3': 'Advanced'
      };
      const difficultyLevel = difficultyMap[selectedLevel] || 'Intermediate';

      console.log('🔍 Filtering questions by difficulty:', {
        selectedLevel,
        difficultyLevel,
        today,
        topicId: topic.id
      });

      // CRITICAL: Filter by difficulty_level to ensure different questions per level
      let query = supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topic.id)
        .eq('segment_type', 'basics')
        .eq('difficulty_level', difficultyLevel) // CRITICAL: Must match exactly
        .eq('generated_date', today);
      
      console.log('📊 Query filter:', {
        topic_id: topic.id,
        segment_type: 'basics',
        difficulty_level: difficultyLevel,
        generated_date: today
      });

      // Filter by subtopic if available
      if (selectedSubtopic) {
        query = query.eq('subtopic_id', selectedSubtopic.id);
      }

      const { data: questionsData, error: questionsError } = await query.order('created_at');

      if (questionsError) throw questionsError;

      if (!questionsData || questionsData.length === 0) {
        console.log('📝 No questions found for today with difficulty:', difficultyLevel, '- Generating new ones...');
        questionsData = await generateDailyQuestions(topic, selectedSubtopic, selectedLevel);
        console.log('✅ Generated questions:', {
          count: questionsData?.length || 0,
          difficulty: difficultyLevel,
          level: selectedLevel
        });
      } else {
        console.log('✅ Found existing questions:', {
          count: questionsData.length,
          difficulty: difficultyLevel,
          level: selectedLevel,
          firstQuestionDifficulty: questionsData[0]?.difficulty_level
        });
        
        // CRITICAL: Verify questions match the selected difficulty
        const matchingDifficulty = questionsData.filter(q => q.difficulty_level === difficultyLevel);
        if (matchingDifficulty.length === 0 && questionsData.length > 0) {
          console.warn('⚠️ Found questions but none match difficulty level. Regenerating...', {
            found: questionsData[0]?.difficulty_level,
            expected: difficultyLevel
          });
          questionsData = await generateDailyQuestions(topic, selectedSubtopic, selectedLevel);
        }
      }

      // Transform questions to match expected format
      const transformedQuestions = (questionsData || []).map((q: any) => {
        // Convert options from JSONB to array format if needed
        let optionsArray: any[] = [];
        if (q.options) {
          if (Array.isArray(q.options)) {
            optionsArray = q.options;
          } else if (typeof q.options === 'object') {
            // Convert from {A: "text", B: "text"} to [{id: "A", text: "text", isCorrect: false}]
            optionsArray = Object.entries(q.options).map(([key, value]) => ({
              id: key,
              text: value as string,
              isCorrect: key === q.correct_answer
            }));
          }
        }

        // Map difficulty_level to difficulty for backward compatibility
        // Use different variable name to avoid conflict with outer scope
        const qDifficultyLevel = q.difficulty_level || q.difficulty || 'intermediate';
        const difficultyMapLocal: Record<string, string> = {
          'Foundation': 'easy',
          'Intermediate': 'medium',
          'Advanced': 'hard',
          'foundation': 'easy',
          'intermediate': 'medium',
          'advanced': 'hard'
        };
        const mappedDifficulty = difficultyMapLocal[qDifficultyLevel] || qDifficultyLevel.toLowerCase() || 'medium';

        return {
          ...q,
          options: optionsArray,
          difficulty: mappedDifficulty, // Add difficulty field for QuestionCard
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

      setQuestions(transformedQuestions);
      console.log('✅ Questions loaded and transformed:', {
        count: transformedQuestions.length,
        difficulty: difficultyLevel,
        level: selectedLevel,
        sampleFirstQuestion: transformedQuestions[0] ? {
          difficulty: transformedQuestions[0].difficulty,
          difficulty_level: transformedQuestions[0].difficulty_level
        } : null
      });

      // Scroll to questions section after loading
      if (transformedQuestions.length > 0) {
        setTimeout(() => {
          const questionsSection = document.getElementById('questions-section');
          if (questionsSection) {
            questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }

      if (user) {
        const questionIds = (questionsData || []).map(q => q.id);
        // Try to fetch user answers, but don't fail if table doesn't exist
        let answersData = null;
        try {
          const { data, error } = await supabase
            .from('user_answers')
            .select('*')
            .eq('user_id', user.id)
            .in('question_id', questionIds);
          
          if (error && error.code !== 'PGRST116') { // PGRST116 = table not found
            console.warn('Error fetching user answers:', error);
          } else {
            answersData = data;
          }
        } catch (err) {
          console.warn('user_answers table may not exist yet:', err);
          // Continue without user answers - table will be created later
        }

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
    } catch (error: any) {
      console.error('❌ Error loading daily questions:', error);
      setError(error.message || 'Failed to load questions. Please check browser console for details.');
    } finally {
      setLoading(false);
    }
  };

  const generateDailyQuestions = async (topic: Topic, subtopic: Subtopic | null | undefined, level: string): Promise<Question[]> => {
    const today = new Date().toISOString().split('T')[0];
    const questionCount = 10;
    const subtopicName = subtopic?.name || 'General';
    const subtopicId = subtopic?.id || '';
    
    // Check if OpenAI API key is configured (production mode)
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const hasOpenAIKey = !!apiKey && apiKey !== 'your-openai-api-key-here' && apiKey.length > 20;
    
    if (!hasOpenAIKey) {
      console.warn('⚠️ OpenAI API key not configured. Using sample questions.');
      console.warn('To enable AI generation, add VITE_OPENAI_API_KEY to .env file');
    } else {
      console.log('✅ OpenAI API key detected - Using AI generation (Production Mode)');
    }
    
    try {
      // PRODUCTION MODE: Use AI generation if API key is available
      if (hasOpenAIKey) {
        try {
          // Use enhanced QuestionService for better generation
          const { QuestionService } = await import('../../services/questionService');
          const questionService = new QuestionService();
          
          // Map level to difficulty format
          const difficultyMap: Record<string, 'Foundation' | 'Intermediate' | 'Advanced'> = {
            'level_1': 'Foundation',
            'level_2': 'Intermediate',
            'level_3': 'Advanced'
          };
          const difficulty = difficultyMap[level] || 'Intermediate';

          console.log('🚀 Generating questions with AI (Production Mode)...');
          console.log(`   Subtopic: ${subtopicName}`);
          console.log(`   Difficulty: ${difficulty}`);
          console.log(`   Count: ${questionCount}`);
          
          // Generate questions using enhanced service (PRODUCTION)
          const generatedQuestions = await questionService.batchGenerateQuestions(
            subtopicId || topic.id,
            subtopicName,
            difficulty,
            questionCount,
            'MCQ'
          );
          
          console.log('✅ AI-generated questions received:', generatedQuestions.length);

          // Transform to database format (reuse difficulty already calculated above)
          const mappedDifficulty = difficulty;
          
          const questionsToInsert = generatedQuestions.map((q: any) => {
            // Convert options to JSONB format if needed
            let optionsObj: Record<string, string> = {};
            if (q.content?.options) {
              // Create a copy to avoid modifying the original const object
              optionsObj = { ...q.content.options };
            } else if (q.options) {
              // Create a copy to avoid modifying the original const object
              optionsObj = typeof q.options === 'object' && !Array.isArray(q.options) 
                ? { ...q.options } 
                : q.options;
            } else if (Array.isArray(q.options)) {
              // Convert array to object format
              q.options.forEach((opt: any, idx: number) => {
                const key = ['A', 'B', 'C', 'D'][idx];
                optionsObj[key] = typeof opt === 'string' ? opt : opt.text || opt;
              });
            }
            
            return {
              id: q.id || crypto.randomUUID(),
              topic_id: topic.id,
              subtopic_id: subtopicId || null,
              segment_type: 'basics',
              question_text: q.content?.text || q.question_text || '',
              options: optionsObj,
              correct_answer: q.content?.correct_answer || q.correct_answer || 'A',
              difficulty_level: mappedDifficulty,
              question_type: q.question_type || 'MCQ',
              solution_steps: q.solution?.steps || [],
              misconceptions: q.solution?.misconceptions || {},
              formulas_used: q.content?.formulas || q.formulas_used || [],
              bloom_taxonomy: q.metadata?.bloom_taxonomy || 'Apply',
              source_api: q.source_api || 'GPT-4o',
              ai_generated: true,
              generated_date: today,
              created_at: new Date().toISOString(),
              last_updated: new Date().toISOString()
            };
          });

          const { data: insertedQuestions, error: insertError } = await supabase
            .from('questions')
            .upsert(questionsToInsert, { onConflict: 'id' })
            .select();

          if (insertError) throw insertError;
          if (insertedQuestions && insertedQuestions.length > 0) {
            return insertedQuestions;
          }
        } catch (aiError: any) {
          console.error('AI generation failed:', aiError);
          console.log('Falling back to sample questions...');
          // Continue to fallback below
        }
      }
      
      // Fallback to sample questions
      console.log('Generating sample questions...');
      
      // Fallback to original sample questions if AI generation fails
      const difficultyMap: Record<string, { difficulty: 'easy' | 'medium' | 'hard', complexity: string }> = {
        'level_1': { difficulty: 'easy', complexity: 'basic concepts and simple problems' },
        'level_2': { difficulty: 'medium', complexity: 'multi-step application problems' },
        'level_3': { difficulty: 'hard', complexity: 'complex problem-solving and synthesis' }
      };
      
      const levelInfo = difficultyMap[level] || difficultyMap['level_1'];
      
      // Generate level-specific sample questions
      // Level 1: Simple, single-step questions
      // Level 2: Two-step questions  
      // Level 3: Multi-step, complex questions
      const level1Questions = [
        `A ball is thrown vertically upward with an initial velocity of 20 m/s. What is its velocity after 2 seconds? (g = 10 m/s²)`,
        `An object moves with constant acceleration of 5 m/s². If it starts from rest, what distance does it cover in 4 seconds?`,
        `A car accelerates from 10 m/s to 30 m/s in 5 seconds. What is its acceleration?`,
        `An object moves from position x₁ = 5 m to x₂ = 15 m. What is its displacement?`,
        `A car travels 60 km in 1 hour. What is its average speed in m/s?`,
        `A ball is thrown upward with velocity 15 m/s. What is the maximum height it reaches? (g = 10 m/s²)`,
        `An object accelerates uniformly from rest. If it covers 50 m in 5 seconds, what is its acceleration?`,
        `A stone is dropped from a height of 45 m. How long does it take to reach the ground? (g = 10 m/s²)`,
        `What is the velocity of an object moving at 5 m/s after 3 seconds if acceleration is 2 m/s²?`,
        `An object moves 100 m in 10 seconds. What is its average velocity?`
      ];

      const level2Questions = [
        `A particle moves along a straight line. Its position is given by x = 2t² + 3t, where x is in meters and t is in seconds. What is its velocity at t = 2s?`,
        `Two objects are moving towards each other. Object A has velocity 10 m/s and Object B has velocity -5 m/s. What is their relative velocity?`,
        `A ball is thrown upward with initial velocity 20 m/s. At what time does it reach its maximum height? (g = 10 m/s²)`,
        `An object starts from rest and accelerates at 4 m/s² for 5 seconds, then moves at constant velocity for 3 seconds. What is the total distance traveled?`,
        `A car accelerates from 0 to 60 km/h in 10 seconds, then decelerates to 30 km/h in 5 seconds. What is the average acceleration during the entire motion?`,
        `An object is thrown vertically upward with velocity 25 m/s. What is its velocity when it returns to the starting point? (g = 10 m/s²)`,
        `A particle moves with velocity v = 3t + 2 m/s. What is its displacement from t = 0 to t = 4 seconds?`,
        `Two cars start from the same point. Car A moves east at 15 m/s, Car B moves north at 20 m/s. What is their relative velocity?`,
        `An object moves with acceleration a = 2t m/s². If it starts from rest, what is its velocity at t = 3 seconds?`,
        `A ball is thrown upward with 30 m/s. How high above the starting point is it after 2 seconds? (g = 10 m/s²)`
      ];

      const level3Questions = [
        `A projectile is launched from ground level at 40 m/s at an angle of 30° to the horizontal. After rebounding elastically from a wall at the same height, what is its velocity when it hits the ground? (g = 10 m/s²)`,
        `A particle moves in one dimension with acceleration a(t) = 2t - 4 m/s². If it starts at x = 0 with velocity v₀ = 5 m/s, at what time does it return to its starting position?`,
        `Two objects are moving along the same line. Object A starts at x = 0 with velocity 10 m/s and acceleration -2 m/s². Object B starts at x = 100 m with velocity -5 m/s and constant acceleration 1 m/s². When do they meet?`,
        `A ball is thrown vertically upward from a moving platform traveling at 15 m/s horizontally. The ball's initial vertical velocity is 20 m/s relative to the platform. What is the ball's velocity relative to the ground when it reaches maximum height? (g = 10 m/s²)`,
        `An object undergoes multi-phase motion: it accelerates from rest at 3 m/s² for 4 seconds, then moves at constant velocity for 6 seconds, then decelerates at -2 m/s² until it stops. What is the total displacement?`,
        `A particle's position is given by x(t) = t³ - 6t² + 9t meters. At what times does the particle change direction?`,
        `Two projectiles are launched simultaneously from the same point. Projectile A has initial velocity 30 m/s at 45°, Projectile B has 40 m/s at 30°. Considering air resistance effects on their trajectories, which one reaches a higher maximum height? (g = 10 m/s²)`,
        `An object moves with velocity v(t) = 4t² - 8t + 3 m/s. Find the time intervals during which the object is moving in the positive direction and calculate the total distance traveled from t = 0 to t = 3 seconds.`,
        `A ball is dropped from a height of 20 m. Simultaneously, another ball is thrown upward from the ground with velocity 15 m/s. When and where do they meet? (g = 10 m/s²)`,
        `A particle moves along x-axis with acceleration a = -kx, where k = 2 s⁻². If it starts at x = 5 m with velocity v = 0, what is its position when velocity becomes -10 m/s?`
      ];

      // Select questions based on level
      const questionTexts = level === 'level_1' ? level1Questions : 
                           level === 'level_2' ? level2Questions : 
                           level3Questions;

      const sampleQuestions = Array.from({ length: questionCount }, (_, index) => {
        const correctAnswerIndex = index % 4;
        const correctAnswerLetter = ['A', 'B', 'C', 'D'][correctAnswerIndex];
        
        const answers = [
          ['0 m/s', '10 m/s', '20 m/s', '40 m/s'],
          ['10 m', '20 m', '40 m', '80 m'],
          ['2 m/s²', '4 m/s²', '5 m/s²', '6 m/s²'],
          ['7 m/s', '11 m/s', '15 m/s', '19 m/s'],
          ['5 m/s', '10 m/s', '15 m/s', '20 m/s'],
          ['2 s', '3 s', '4 s', '5 s'],
          ['5 m', '10 m', '15 m', '20 m'],
          ['10 m/s', '16.67 m/s', '20 m/s', '25 m/s'],
          ['11.25 m', '15 m', '22.5 m', '30 m'],
          ['2 m/s²', '4 m/s²', '5 m/s²', '10 m/s²']
        ];
        
        const correctAnswers = ['A', 'C', 'B', 'B', 'C', 'B', 'B', 'B', 'A', 'B'];
        
        const questionText = questionTexts[index % questionTexts.length] || 
          `Sample physics question ${index + 1} about ${subtopicName}`;
        const answerSet = answers[index % answers.length];
        const correctAnswer = correctAnswers[index % correctAnswers.length];
        
        const optionsObj: Record<string, string> = {};
        answerSet.forEach((ans, i) => {
          optionsObj[['A', 'B', 'C', 'D'][i]] = ans;
        });
        
        return {
          id: crypto.randomUUID(),
          topic_id: topic.id,
          subtopic_id: subtopicId || null,
          question_type: 'MCQ',
          difficulty_level: level === 'level_1' ? 'Foundation' : level === 'level_2' ? 'Intermediate' : 'Advanced',
          question_text: questionText,
          options: optionsObj,
          correct_answer: correctAnswer,
          solution_steps: [
            `Step 1: Identify the given information and what needs to be found.`,
            `Step 2: Select the appropriate physics formula for ${subtopicName}.`,
            `Step 3: Substitute the given values into the formula.`,
            `Step 4: Solve for the unknown quantity.`,
            `Step 5: Verify the answer has correct units and is reasonable.`
          ],
          misconceptions: {
            'A': 'Common mistake: Forgot to account for gravity/direction',
            'B': 'Common mistake: Used wrong formula',
            'C': 'Common mistake: Calculation error',
            'D': 'Common mistake: Unit conversion error'
          },
          formulas_used: [`Formula for ${subtopicName}`],
          bloom_taxonomy: 'Apply',
          source_api: 'Sample',
          segment_type: 'basics',
          ai_generated: false,
          generated_date: today,
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        };
      });

      console.log('Inserting sample questions:', sampleQuestions.length);
      
      const { data: insertedQuestions, error: insertError } = await supabase
        .from('questions')
        .insert(sampleQuestions)
        .select();

      if (insertError) {
        console.error('Error inserting sample questions:', insertError);
        throw insertError;
      }

      console.log('Sample questions inserted:', insertedQuestions?.length || 0);
      return insertedQuestions || [];
    } catch (error: any) {
      console.error('Error in generateDailyQuestions:', error);
      throw error;
    }
  };

  const handleAnswer = async (questionId: string, selectedAnswer: string, timeSpent: number) => {
    if (!user) return;

    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    // Check if answer is correct
    const correctOption = question.options.find(opt => opt.isCorrect);
    const correctAnswerId = question.correctAnswer || question.correct_answer || correctOption?.id;
    const isCorrect = selectedAnswer === correctAnswerId || selectedAnswer === correctOption?.id;

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
        <p className="text-sm text-gray-500 mt-2">This may take a moment if generating new questions</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-800 font-semibold mb-2">Error Loading Questions</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadDailyQuestions();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <p className="text-xs text-gray-500 mt-4">Check browser console (F12) for more details</p>
        </div>
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
    <div id="questions-section">

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

import { useState, useEffect } from 'react';
import { Target, RefreshCw, Play, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { QuestionCard } from './QuestionCard';
import { QAQuestionCard } from './QAQuestionCard';
import { QuizMode } from './QuizMode';
import { LevelDropdown } from '../LevelDropdown';
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
  onLevelChange?: (level: string) => void;
}

export function BasicsSection({ topic, progress, onProgressUpdate, selectedLevel = 'level_1', selectedSubtopic, onLevelChange }: BasicsSectionProps) {
  // Internal level state if onLevelChange is not provided
  const [internalLevel, setInternalLevel] = useState(selectedLevel);
  const currentLevel = onLevelChange ? selectedLevel : internalLevel;
  const handleLevelChange = onLevelChange || setInternalLevel;
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  // MCQ questions for "Strengthen Your Basics"
  const [mcqQuestions, setMcqQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Map<string, UserAnswer>>(new Map());
  
  // Q&A questions for "Daily Questions" (FRQ format)
  const [qaQuestions, setQaQuestions] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [qaLoading, setQaLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qaError, setQaError] = useState<string | null>(null);
  const [showQuizMode, setShowQuizMode] = useState(false);
  const [showMcqQuestions, setShowMcqQuestions] = useState(false); // Track if MCQ questions should be displayed
  const [showQaQuestions, setShowQaQuestions] = useState(false); // Track if Q&A questions should be displayed
  const [stats, setStats] = useState({ completed: 0, accuracy: 0, avgTime: 0 });

  // Clear questions when level or subtopic changes
  useEffect(() => {
    setMcqQuestions([]);
    setQaQuestions([]);
    setShowMcqQuestions(false);
    setShowQaQuestions(false);
    setUserAnswers(new Map());
  }, [currentLevel, selectedSubtopic?.id]);

  // Reload questions when level changes and questions are already shown
  useEffect(() => {
    if (showMcqQuestions && currentLevel) {
      setLoading(true);
      // Use setTimeout to avoid calling during render
      setTimeout(() => {
        loadMCQQuestions();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, showMcqQuestions]);

  useEffect(() => {
    if (showQaQuestions && currentLevel) {
      setQaLoading(true);
      // Use setTimeout to avoid calling during render
      setTimeout(() => {
        loadQAQuestions();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevel, showQaQuestions]);

  // Don't auto-load questions - wait for user to click "Strengthen Your Basics"
  // useEffect(() => {
  //   loadDailyQuestions();
  // }, [topic.id, user, selectedLevel, selectedSubtopic?.id]);

  // Load MCQ questions for "Strengthen Your Basics"
  const loadMCQQuestions = async () => {
    try {
      setError(null);
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      console.log('🔍 Loading daily questions...', {
        topic: topic.name,
        subtopic: selectedSubtopic?.name,
        level: currentLevel,
        date: today
      });

      // Map level to difficulty format for query
      const difficultyMap: Record<string, string> = {
        'level_1': 'Foundation',
        'level_2': 'Intermediate',
        'level_3': 'Advanced'
      };
      const difficultyLevel = difficultyMap[currentLevel] || 'Intermediate';

        console.log('🔍 Filtering questions by difficulty:', {
        currentLevel,
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

      const { data: questionsDataQuery, error: questionsError } = await query.order('created_at');

      if (questionsError) throw questionsError;

      let questionsData = questionsDataQuery;

      if (!questionsData || questionsData.length === 0) {
        console.log('📝 No questions found for today with difficulty:', difficultyLevel, '- Generating new ones...');
        questionsData = await generateDailyQuestions(topic, selectedSubtopic, currentLevel);
        console.log('✅ Generated questions:', {
          count: questionsData?.length || 0,
          difficulty: difficultyLevel,
          level: currentLevel
        });
      } else {
        console.log('✅ Found existing questions:', {
          count: questionsData.length,
          difficulty: difficultyLevel,
          level: currentLevel,
          firstQuestionDifficulty: questionsData[0]?.difficulty_level
        });
        
        // CRITICAL: Verify questions match the selected difficulty
        const matchingDifficulty = questionsData.filter(q => q.difficulty_level === difficultyLevel);
        if (matchingDifficulty.length === 0 && questionsData.length > 0) {
          console.warn('⚠️ Found questions but none match difficulty level. Regenerating...', {
            found: questionsData[0]?.difficulty_level,
            expected: difficultyLevel
          });
          questionsData = await generateDailyQuestions(topic, selectedSubtopic, currentLevel);
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

      setMcqQuestions(transformedQuestions);
      console.log('✅ Questions loaded and transformed:', {
        count: transformedQuestions.length,
        difficulty: difficultyLevel,
        level: currentLevel,
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
      console.error('❌ Error loading MCQ questions:', error);
      setError(error.message || 'Failed to load questions. Please check browser console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Load Q&A questions (FRQ) for "Daily Questions"
  const loadQAQuestions = async () => {
    try {
      setQaError(null);
      setQaLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      console.log('🔍 Loading Q&A questions...', {
        topic: topic.name,
        subtopic: selectedSubtopic?.name,
        level: currentLevel,
        date: today
      });

      // Map level to difficulty format
      const difficultyMap: Record<string, string> = {
        'level_1': 'Foundation',
        'level_2': 'Intermediate',
        'level_3': 'Advanced'
      };
      const difficultyLevel = difficultyMap[selectedLevel] || 'Intermediate';
      const subtopicName = selectedSubtopic?.name || topic.name;

      // Check for existing Q&A questions
      let query = supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topic.id)
        .eq('segment_type', 'daily_qa')
        .eq('question_type', 'FRQ')
        .eq('difficulty_level', difficultyLevel)
        .eq('generated_date', today);

      if (selectedSubtopic) {
        query = query.eq('subtopic_id', selectedSubtopic.id);
      }

      const { data: existingQuestions, error: queryError } = await query.order('created_at');

      if (queryError && queryError.code !== 'PGRST116') throw queryError;

      let qaQuestionsData = existingQuestions || [];

      // Generate Q&A questions if none exist
      if (!qaQuestionsData || qaQuestionsData.length < 10) {
        console.log('📝 Generating Q&A questions...');
        
        // Check if Anthropic API key is configured
        const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
        const hasAnthropicKey = !!anthropicKey && anthropicKey !== 'your-anthropic-api-key-here' && anthropicKey.length > 20;
        
        const questionsToGenerate = 10 - (qaQuestionsData?.length || 0);
        const generatedQuestions: any[] = [];

        // Always generate sample questions immediately for fast display
        console.log('📝 Generating sample Q&A questions immediately...');
        const sampleQAQuestions = generateSampleQAQuestions(subtopicName, difficultyLevel, questionsToGenerate);
        
        // Set questions immediately without waiting for API or database
        const immediateQA = sampleQAQuestions.map((q: any) => ({
          id: crypto.randomUUID(),
          question_text: q.text || q.question_text || '',
          solution_steps: Array.isArray(q.solution_steps) ? q.solution_steps : [],
          final_answer: q.final_answer || '',
          explanation: q.explanation || (Array.isArray(q.solution_steps) ? q.solution_steps.join('\n\n') : ''),
          formulas_used: Array.isArray(q.formulas_used) ? q.formulas_used : [],
          difficulty_level: difficultyLevel
        }));
        setQaQuestions(immediateQA);
        setQaLoading(false); // Stop loading immediately
        console.log('✅ Sample Q&A questions set immediately:', immediateQA.length);

        // Try API generation in background (non-blocking)
        if (hasAnthropicKey) {
          (async () => {
            try {
              const { generateFRQQuestions } = await import('../../services/questionGenerator');
              
              // Generate only 1-2 questions via API to avoid long wait
              const apiQuestionCount = Math.min(2, questionsToGenerate);
              for (let i = 0; i < apiQuestionCount; i++) {
                try {
                  const frqQuestions = await generateFRQQuestions(subtopicName, difficultyLevel);
                  if (frqQuestions && frqQuestions.length > 0) {
                    // Update with API-generated question
                    const apiQA = frqQuestions.map((q: any) => ({
                      id: crypto.randomUUID(),
                      question_text: q.content?.text || q.question_text || '',
                      solution_steps: Array.isArray(q.solution?.steps) ? q.solution.steps : [],
                      final_answer: q.solution?.final_answer || '',
                      explanation: q.solution?.steps ? q.solution.steps.join('\n\n') : '',
                      formulas_used: Array.isArray(q.content?.formulas) ? q.content.formulas : [],
                      difficulty_level: difficultyLevel
                    }));
                    // Replace first sample question with API question
                    setQaQuestions(prev => {
                      const updated = [...prev];
                      updated[i] = apiQA[0];
                      return updated;
                    });
                  }
                } catch (err) {
                  console.error(`Error generating Q&A question ${i + 1}:`, err);
                }
              }
            } catch (err) {
              console.warn('⚠️ Anthropic API generation failed:', err);
            }
          })();
        } else {
          console.warn('⚠️ Anthropic API key not configured. Using sample Q&A questions.');
        }

        // Add sample questions to generatedQuestions for database storage
        generatedQuestions.push(...sampleQAQuestions);

        // Store generated questions
        if (generatedQuestions.length > 0) {
          const questionsToInsert = generatedQuestions.map(q => ({
            topic_id: topic.id,
            subtopic_id: selectedSubtopic?.id || null,
            question_type: 'FRQ',
            difficulty_level: difficultyLevel,
            question_text: q.content?.text || q.question_text || q.text || '',
            solution_steps: q.solution?.steps || q.solution_steps || [],
            final_answer: q.solution?.final_answer || q.final_answer || '',
            formulas_used: q.content?.formulas || q.formulas_used || [],
            misconceptions: q.solution?.misconceptions || {},
            bloom_taxonomy: q.metadata?.bloom_taxonomy || 'Analyze',
            source_api: q.source_api || 'Sample',
            segment_type: 'daily_qa',
            generated_date: today
          }));

          const { data: insertedData, error: insertError } = await supabase
            .from('questions')
            .insert(questionsToInsert)
            .select();

          if (insertError) {
            console.error('Error inserting Q&A questions:', insertError);
            // Continue with generated questions even if insert fails
          } else {
            qaQuestionsData = [...(qaQuestionsData || []), ...(insertedData || [])];
          }
        }
      }

      // Transform for display
      const transformedQA = (qaQuestionsData || []).map((q: any) => ({
        id: q.id || crypto.randomUUID(),
        question_text: q.question_text || q.text || '',
        solution_steps: Array.isArray(q.solution_steps) ? q.solution_steps : (q.solution_steps ? [q.solution_steps] : []),
        final_answer: q.final_answer || '',
        explanation: q.explanation || (Array.isArray(q.solution_steps) ? q.solution_steps.join('\n\n') : (q.solution_steps || '')),
        formulas_used: Array.isArray(q.formulas_used) ? q.formulas_used : [],
        difficulty_level: q.difficulty_level || difficultyLevel
      }));

      // If still no questions, create sample ones directly
      if (transformedQA.length === 0) {
        console.log('📝 Creating sample Q&A questions directly...');
        const sampleQA = generateSampleQAQuestions(subtopicName, difficultyLevel, 10);
        const sampleTransformed = sampleQA.map((q: any) => ({
          id: crypto.randomUUID(),
          question_text: q.text || q.question_text || '',
          solution_steps: Array.isArray(q.solution_steps) ? q.solution_steps : [],
          final_answer: q.final_answer || '',
          explanation: q.explanation || (Array.isArray(q.solution_steps) ? q.solution_steps.join('\n\n') : ''),
          formulas_used: Array.isArray(q.formulas_used) ? q.formulas_used : [],
          difficulty_level: difficultyLevel
        }));
        setQaQuestions(sampleTransformed);
        console.log('✅ Sample Q&A questions created:', sampleTransformed.length);
        return; // Exit early with sample questions
      } else {
        setQaQuestions(transformedQA.slice(0, 10)); // Limit to 10 questions
        console.log('✅ Q&A questions loaded:', transformedQA.length);
      }

    } catch (error: any) {
      console.error('❌ Error loading Q&A questions:', error);
      setQaError(error.message || 'Failed to load Q&A questions.');
    } finally {
      setQaLoading(false);
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

  // Generate sample Q&A questions (fallback) - Level-specific
  const generateSampleQAQuestions = (_subtopicName: string, difficultyLevel: string, count: number) => {
    // Foundation Level (Level 1) - Simple, single-step problems
    const foundationQuestions = [
      {
        text: `A particle moves along a straight line. Its position is given by x = 2t² + 3t, where x is in meters and t is in seconds. 
        
(a) What is the velocity of the particle at t = 2 seconds?
(b) What is the acceleration of the particle?
(c) At what time does the particle change direction?`,
        solution_steps: [
          'Step 1: To find velocity, take the derivative of position with respect to time: v = dx/dt = d(2t² + 3t)/dt = 4t + 3',
          'Step 2: At t = 2s, v = 4(2) + 3 = 8 + 3 = 11 m/s',
          'Step 3: To find acceleration, take the derivative of velocity: a = dv/dt = d(4t + 3)/dt = 4 m/s²',
          'Step 4: The particle changes direction when velocity is zero: 4t + 3 = 0, so t = -3/4 s (not physically meaningful for t > 0)',
          'Step 5: Since acceleration is constant and positive, the particle never changes direction for t > 0'
        ],
        final_answer: '(a) 11 m/s, (b) 4 m/s², (c) The particle does not change direction for t > 0',
        formulas_used: ['v = dx/dt', 'a = dv/dt', 'x = 2t² + 3t'],
        explanation: 'This problem involves kinematic equations and calculus. The position function is given, and we use derivatives to find velocity and acceleration.'
      },
      {
        text: `An object is thrown vertically upward with an initial velocity of 30 m/s from a height of 20 m above the ground. 
        
(a) How long does it take to reach the maximum height?
(b) What is the maximum height reached?
(c) How long does it take to hit the ground?`,
        solution_steps: [
          'Step 1: At maximum height, velocity is zero. Using v = u + at: 0 = 30 - 10t, so t = 3 seconds',
          'Step 2: Maximum height: h = ut + ½at² = 30(3) + ½(-10)(3)² = 90 - 45 = 45 m above starting point',
          'Step 3: Total height from ground: 20 + 45 = 65 m',
          'Step 4: Time to hit ground: Using h = ut + ½at² with h = -20 (below starting point): -20 = 30t - 5t²',
          'Step 5: Solving quadratic: 5t² - 30t - 20 = 0, t ≈ 6.6 seconds'
        ],
        final_answer: '(a) 3 seconds, (b) 65 m above ground, (c) 6.6 seconds',
        formulas_used: ['v = u + at', 'h = ut + ½at²', 'v² = u² + 2ah'],
        explanation: 'This is a projectile motion problem with vertical motion only. We use kinematic equations with g = 10 m/s² downward.'
      },
      {
        text: `A car accelerates uniformly from rest to 60 m/s in 12 seconds. 
        
(a) What is the acceleration?
(b) How far does the car travel during this time?
(c) What is the average velocity?`,
        solution_steps: [
          'Step 1: Acceleration: a = (v - u)/t = (60 - 0)/12 = 5 m/s²',
          'Step 2: Distance: s = ut + ½at² = 0 + ½(5)(12)² = ½(5)(144) = 360 m',
          'Step 3: Average velocity: v_avg = (u + v)/2 = (0 + 60)/2 = 30 m/s'
        ],
        final_answer: '(a) 5 m/s², (b) 360 m, (c) 30 m/s',
        formulas_used: ['a = (v - u)/t', 's = ut + ½at²', 'v_avg = (u + v)/2'],
        explanation: 'Uniform acceleration problem using basic kinematic equations.'
      },
      {
        text: `A ball is dropped from a height of 80 m. 
        
(a) How long does it take to reach the ground?
(b) What is its velocity just before hitting the ground?
(c) How far has it fallen after 2 seconds?`,
        solution_steps: [
          'Step 1: Time to ground: Using h = ½gt²: 80 = ½(10)t², so t² = 16, t = 4 seconds',
          'Step 2: Velocity: v = gt = 10(4) = 40 m/s downward',
          'Step 3: Distance after 2s: h = ½gt² = ½(10)(2)² = 20 m'
        ],
        final_answer: '(a) 4 seconds, (b) 40 m/s downward, (c) 20 m',
        formulas_used: ['h = ½gt²', 'v = gt'],
        explanation: 'Free fall problem with constant acceleration due to gravity.'
      },
      {
        text: `A train accelerates from 15 m/s to 35 m/s over a distance of 200 m. 
        
(a) What is the acceleration?
(b) How long does this acceleration take?
(c) If the train continues at 35 m/s, how far does it travel in the next 10 seconds?`,
        solution_steps: [
          'Step 1: Using v² = u² + 2as: 35² = 15² + 2a(200), so 1225 = 225 + 400a, a = 2.5 m/s²',
          'Step 2: Time: t = (v - u)/a = (35 - 15)/2.5 = 8 seconds',
          'Step 3: Distance at constant speed: s = vt = 35(10) = 350 m'
        ],
        final_answer: '(a) 2.5 m/s², (b) 8 seconds, (c) 350 m',
        formulas_used: ['v² = u² + 2as', 't = (v - u)/a', 's = vt'],
        explanation: 'Multi-part problem involving acceleration and constant velocity motion.'
      },
      {
        text: `An object moves with position x(t) = t³ - 6t² + 9t meters. 
        
(a) Find the velocity as a function of time.
(b) Find when the object is at rest.
(c) Find the acceleration at t = 2 seconds.`,
        solution_steps: [
          'Step 1: Velocity: v = dx/dt = d(t³ - 6t² + 9t)/dt = 3t² - 12t + 9',
          'Step 2: Object at rest when v = 0: 3t² - 12t + 9 = 0, dividing by 3: t² - 4t + 3 = 0',
          'Step 3: Factoring: (t - 1)(t - 3) = 0, so t = 1s or t = 3s',
          'Step 4: Acceleration: a = dv/dt = d(3t² - 12t + 9)/dt = 6t - 12',
          'Step 5: At t = 2s: a = 6(2) - 12 = 0 m/s²'
        ],
        final_answer: '(a) v = 3t² - 12t + 9 m/s, (b) t = 1s and t = 3s, (c) 0 m/s²',
        formulas_used: ['v = dx/dt', 'a = dv/dt'],
        explanation: 'Calculus-based kinematics problem involving derivatives.'
      },
      {
        text: `A car traveling at 25 m/s applies brakes and comes to rest in 5 seconds. 
        
(a) What is the deceleration?
(b) How far does the car travel while braking?
(c) If the initial speed was doubled, how would the stopping distance change?`,
        solution_steps: [
          'Step 1: Deceleration: a = (v - u)/t = (0 - 25)/5 = -5 m/s²',
          'Step 2: Distance: s = ut + ½at² = 25(5) + ½(-5)(5)² = 125 - 62.5 = 62.5 m',
          'Step 3: Using v² = u² + 2as: If u doubles, and a is constant, s quadruples (s ∝ u²)'
        ],
        final_answer: '(a) -5 m/s², (b) 62.5 m, (c) Stopping distance would quadruple',
        formulas_used: ['a = (v - u)/t', 's = ut + ½at²', 'v² = u² + 2as'],
        explanation: 'Deceleration problem with conceptual reasoning about proportional relationships.'
      },
      {
        text: `A particle moves according to x = 4t - t², where x is in meters and t in seconds. 
        
(a) What is the initial position and velocity?
(b) When does the particle reach its maximum displacement?
(c) What is the maximum displacement?`,
        solution_steps: [
          'Step 1: Initial position at t = 0: x = 4(0) - (0)² = 0 m',
          'Step 2: Velocity: v = dx/dt = 4 - 2t, so initial velocity v(0) = 4 m/s',
          'Step 3: Maximum when v = 0: 4 - 2t = 0, so t = 2 seconds',
          'Step 4: Maximum displacement: x(2) = 4(2) - (2)² = 8 - 4 = 4 m'
        ],
        final_answer: '(a) x₀ = 0 m, v₀ = 4 m/s, (b) t = 2 seconds, (c) 4 m',
        formulas_used: ['v = dx/dt', 'x = 4t - t²'],
        explanation: 'Position function analysis using calculus to find extrema.'
      },
      {
        text: `Two cars start from the same point. Car A accelerates at 3 m/s² from rest. Car B starts 2 seconds later and accelerates at 4 m/s² from rest. 
        
(a) When will Car B catch up to Car A?
(b) How far from the starting point do they meet?
(c) What are their velocities when they meet?`,
        solution_steps: [
          'Step 1: Position of Car A: x_A = ½(3)t² = 1.5t²',
          'Step 2: Position of Car B: x_B = ½(4)(t - 2)² = 2(t - 2)², for t ≥ 2',
          'Step 3: When they meet: 1.5t² = 2(t - 2)²',
          'Step 4: Solving: 1.5t² = 2(t² - 4t + 4) = 2t² - 8t + 8',
          'Step 5: 0.5t² - 8t + 8 = 0, multiplying by 2: t² - 16t + 16 = 0',
          'Step 6: Using quadratic formula: t ≈ 15.06 seconds (taking the larger root)',
          'Step 7: Distance: x = 1.5(15.06)² ≈ 340 m',
          'Step 8: Velocities: v_A = 3(15.06) ≈ 45.2 m/s, v_B = 4(15.06 - 2) ≈ 52.2 m/s'
        ],
        final_answer: '(a) t ≈ 15.06 seconds, (b) ≈ 340 m, (c) v_A ≈ 45.2 m/s, v_B ≈ 52.2 m/s',
        formulas_used: ['x = ut + ½at²', 'v = u + at'],
        explanation: 'Relative motion problem with two objects starting at different times.'
      },
      {
        text: `A stone is thrown upward from a bridge 50 m high with velocity 20 m/s. 
        
(a) How high above the bridge does it go?
(b) How long until it hits the water below?
(c) What is its velocity when it hits the water?`,
        solution_steps: [
          'Step 1: Maximum height above bridge: Using v² = u² + 2ah with v = 0: 0 = 20² + 2(-10)h, h = 20 m',
          'Step 2: Total height: 50 + 20 = 70 m above water',
          'Step 3: Time to hit water: Using h = ut + ½at² with h = -50 (below starting point): -50 = 20t - 5t²',
          'Step 4: Rearranging: 5t² - 20t - 50 = 0, dividing by 5: t² - 4t - 10 = 0',
          'Step 5: Using quadratic formula: t ≈ 5.74 seconds',
          'Step 6: Velocity: v = u + at = 20 - 10(5.74) ≈ -37.4 m/s (downward)'
        ],
        final_answer: '(a) 20 m above bridge, (b) ≈ 5.74 seconds, (c) ≈ 37.4 m/s downward',
        formulas_used: ['v² = u² + 2ah', 'h = ut + ½at²', 'v = u + at'],
        explanation: 'Projectile motion with initial height, involving upward and downward motion.'
      }
    ];

    // Intermediate Level (Level 2) - Two-step problems
    const intermediateQuestions = [
      {
        text: `A car accelerates from 15 m/s to 35 m/s over a distance of 200 m. 
        
(a) What is the acceleration?
(b) How long does this acceleration take?
(c) If the car continues at 35 m/s, how far does it travel in the next 10 seconds?`,
        solution_steps: [
          'Step 1: Using v² = u² + 2as: 35² = 15² + 2a(200), so 1225 = 225 + 400a, a = 2.5 m/s²',
          'Step 2: Time: t = (v - u)/a = (35 - 15)/2.5 = 8 seconds',
          'Step 3: Distance at constant speed: s = vt = 35(10) = 350 m'
        ],
        final_answer: '(a) 2.5 m/s², (b) 8 seconds, (c) 350 m',
        formulas_used: ['v² = u² + 2as', 't = (v - u)/a', 's = vt'],
        explanation: 'Multi-part problem involving acceleration and constant velocity motion.'
      },
      {
        text: `An object is thrown vertically upward with an initial velocity of 30 m/s from a height of 20 m above the ground. 
        
(a) How long does it take to reach the maximum height?
(b) What is the maximum height reached?
(c) How long does it take to hit the ground?`,
        solution_steps: [
          'Step 1: At maximum height, velocity is zero. Using v = u + at: 0 = 30 - 10t, so t = 3 seconds',
          'Step 2: Maximum height: h = ut + ½at² = 30(3) + ½(-10)(3)² = 90 - 45 = 45 m above starting point',
          'Step 3: Total height from ground: 20 + 45 = 65 m',
          'Step 4: Time to hit ground: Using h = ut + ½at² with h = -20 (below starting point): -20 = 30t - 5t²',
          'Step 5: Solving quadratic: 5t² - 30t - 20 = 0, t ≈ 6.6 seconds'
        ],
        final_answer: '(a) 3 seconds, (b) 65 m above ground, (c) 6.6 seconds',
        formulas_used: ['v = u + at', 'h = ut + ½at²', 'v² = u² + 2ah'],
        explanation: 'This is a projectile motion problem with vertical motion only. We use kinematic equations with g = 10 m/s² downward.'
      },
      {
        text: `A car traveling at 25 m/s applies brakes and comes to rest in 5 seconds. 
        
(a) What is the deceleration?
(b) How far does the car travel while braking?
(c) If the initial speed was doubled, how would the stopping distance change?`,
        solution_steps: [
          'Step 1: Deceleration: a = (v - u)/t = (0 - 25)/5 = -5 m/s²',
          'Step 2: Distance: s = ut + ½at² = 25(5) + ½(-5)(5)² = 125 - 62.5 = 62.5 m',
          'Step 3: Using v² = u² + 2as: If u doubles, and a is constant, s quadruples (s ∝ u²)'
        ],
        final_answer: '(a) -5 m/s², (b) 62.5 m, (c) Stopping distance would quadruple',
        formulas_used: ['a = (v - u)/t', 's = ut + ½at²', 'v² = u² + 2as'],
        explanation: 'Deceleration problem with conceptual reasoning about proportional relationships.'
      },
      {
        text: `A particle moves according to x = 4t - t², where x is in meters and t in seconds. 
        
(a) What is the initial position and velocity?
(b) When does the particle reach its maximum displacement?
(c) What is the maximum displacement?`,
        solution_steps: [
          'Step 1: Initial position at t = 0: x = 4(0) - (0)² = 0 m',
          'Step 2: Velocity: v = dx/dt = 4 - 2t, so initial velocity v(0) = 4 m/s',
          'Step 3: Maximum when v = 0: 4 - 2t = 0, so t = 2 seconds',
          'Step 4: Maximum displacement: x(2) = 4(2) - (2)² = 8 - 4 = 4 m'
        ],
        final_answer: '(a) x₀ = 0 m, v₀ = 4 m/s, (b) t = 2 seconds, (c) 4 m',
        formulas_used: ['v = dx/dt', 'x = 4t - t²'],
        explanation: 'Position function analysis using calculus to find extrema.'
      },
      {
        text: `A train accelerates uniformly from rest to 60 m/s in 12 seconds. 
        
(a) What is the acceleration?
(b) How far does the train travel during this time?
(c) What is the average velocity?
(d) If the train then decelerates at 2 m/s², how long until it stops?`,
        solution_steps: [
          'Step 1: Acceleration: a = (v - u)/t = (60 - 0)/12 = 5 m/s²',
          'Step 2: Distance: s = ut + ½at² = 0 + ½(5)(12)² = ½(5)(144) = 360 m',
          'Step 3: Average velocity: v_avg = (u + v)/2 = (0 + 60)/2 = 30 m/s',
          'Step 4: Deceleration time: Using v = u + at with v = 0: 0 = 60 - 2t, so t = 30 seconds'
        ],
        final_answer: '(a) 5 m/s², (b) 360 m, (c) 30 m/s, (d) 30 seconds',
        formulas_used: ['a = (v - u)/t', 's = ut + ½at²', 'v_avg = (u + v)/2', 'v = u + at'],
        explanation: 'Multi-phase motion problem with acceleration and deceleration.'
      }
    ];

    // Advanced Level (Level 3) - Complex, multi-step problems
    const advancedQuestions = [
      {
        text: `An object moves with position x(t) = t³ - 6t² + 9t meters. 
        
(a) Find the velocity as a function of time.
(b) Find when the object is at rest.
(c) Find the acceleration at t = 2 seconds.
(d) Determine the intervals where the object is speeding up or slowing down.`,
        solution_steps: [
          'Step 1: Velocity: v = dx/dt = d(t³ - 6t² + 9t)/dt = 3t² - 12t + 9',
          'Step 2: Object at rest when v = 0: 3t² - 12t + 9 = 0, dividing by 3: t² - 4t + 3 = 0',
          'Step 3: Factoring: (t - 1)(t - 3) = 0, so t = 1s or t = 3s',
          'Step 4: Acceleration: a = dv/dt = d(3t² - 12t + 9)/dt = 6t - 12',
          'Step 5: At t = 2s: a = 6(2) - 12 = 0 m/s²',
          'Step 6: Speeding up when v and a have same sign. Analyze intervals: t < 1 (v>0, a<0: slowing), 1<t<2 (v<0, a<0: speeding up), 2<t<3 (v<0, a>0: slowing), t>3 (v>0, a>0: speeding up)'
        ],
        final_answer: '(a) v = 3t² - 12t + 9 m/s, (b) t = 1s and t = 3s, (c) 0 m/s², (d) Speeding up: 1<t<2 and t>3; Slowing: t<1 and 2<t<3',
        formulas_used: ['v = dx/dt', 'a = dv/dt', 'Sign analysis of v and a'],
        explanation: 'Calculus-based kinematics problem involving derivatives and sign analysis.'
      },
      {
        text: `Two cars start from the same point. Car A accelerates at 3 m/s² from rest. Car B starts 2 seconds later and accelerates at 4 m/s² from rest. 
        
(a) When will Car B catch up to Car A?
(b) How far from the starting point do they meet?
(c) What are their velocities when they meet?
(d) If Car A had a head start of 50 m, when would Car B catch up?`,
        solution_steps: [
          'Step 1: Position of Car A: x_A = ½(3)t² = 1.5t²',
          'Step 2: Position of Car B: x_B = ½(4)(t - 2)² = 2(t - 2)², for t ≥ 2',
          'Step 3: When they meet: 1.5t² = 2(t - 2)²',
          'Step 4: Solving: 1.5t² = 2(t² - 4t + 4) = 2t² - 8t + 8',
          'Step 5: 0.5t² - 8t + 8 = 0, multiplying by 2: t² - 16t + 16 = 0',
          'Step 6: Using quadratic formula: t ≈ 15.06 seconds (taking the larger root)',
          'Step 7: Distance: x = 1.5(15.06)² ≈ 340 m',
          'Step 8: Velocities: v_A = 3(15.06) ≈ 45.2 m/s, v_B = 4(15.06 - 2) ≈ 52.2 m/s',
          'Step 9: With head start: 1.5t² + 50 = 2(t - 2)², solving gives t ≈ 12.3 seconds'
        ],
        final_answer: '(a) t ≈ 15.06 seconds, (b) ≈ 340 m, (c) v_A ≈ 45.2 m/s, v_B ≈ 52.2 m/s, (d) t ≈ 12.3 seconds',
        formulas_used: ['x = ut + ½at²', 'v = u + at', 'Quadratic equations'],
        explanation: 'Relative motion problem with two objects starting at different times, including head start scenario.'
      },
      {
        text: `A stone is thrown upward from a bridge 50 m high with velocity 20 m/s. 
        
(a) How high above the bridge does it go?
(b) How long until it hits the water below?
(c) What is its velocity when it hits the water?
(d) At what time is the stone at the same height as the bridge again?`,
        solution_steps: [
          'Step 1: Maximum height above bridge: Using v² = u² + 2ah with v = 0: 0 = 20² + 2(-10)h, h = 20 m',
          'Step 2: Total height: 50 + 20 = 70 m above water',
          'Step 3: Time to hit water: Using h = ut + ½at² with h = -50 (below starting point): -50 = 20t - 5t²',
          'Step 4: Rearranging: 5t² - 20t - 50 = 0, dividing by 5: t² - 4t - 10 = 0',
          'Step 5: Using quadratic formula: t ≈ 5.74 seconds',
          'Step 6: Velocity: v = u + at = 20 - 10(5.74) ≈ -37.4 m/s (downward)',
          'Step 7: At bridge height again: h = 0, so 0 = 20t - 5t², t(20 - 5t) = 0, t = 0 or t = 4 seconds'
        ],
        final_answer: '(a) 20 m above bridge, (b) ≈ 5.74 seconds, (c) ≈ 37.4 m/s downward, (d) t = 4 seconds',
        formulas_used: ['v² = u² + 2ah', 'h = ut + ½at²', 'v = u + at', 'Quadratic formula'],
        explanation: 'Projectile motion with initial height, involving upward and downward motion with multiple time points.'
      },
      {
        text: `A particle moves along a straight line with acceleration a(t) = 6t - 12 m/s², where t is in seconds. At t = 0, the particle is at x = 0 with velocity v = 10 m/s.
        
(a) Find the velocity as a function of time.
(b) Find the position as a function of time.
(c) When is the particle at rest?
(d) What is the maximum displacement from the origin?
(e) At what times does the particle return to the origin?`,
        solution_steps: [
          'Step 1: Velocity: v = ∫a dt = ∫(6t - 12)dt = 3t² - 12t + C. At t=0, v=10, so C=10. Therefore v = 3t² - 12t + 10',
          'Step 2: Position: x = ∫v dt = ∫(3t² - 12t + 10)dt = t³ - 6t² + 10t + C. At t=0, x=0, so C=0. Therefore x = t³ - 6t² + 10t',
          'Step 3: At rest when v = 0: 3t² - 12t + 10 = 0. Using quadratic formula: t = (12 ± √(144-120))/6 = (12 ± √24)/6 ≈ 0.92s or 3.08s',
          'Step 4: Maximum displacement when v = 0. Check x(0.92) and x(3.08) to find maximum',
          'Step 5: At origin when x = 0: t³ - 6t² + 10t = t(t² - 6t + 10) = 0. t = 0 or solve t² - 6t + 10 = 0 (no real roots), so only at t = 0'
        ],
        final_answer: '(a) v = 3t² - 12t + 10 m/s, (b) x = t³ - 6t² + 10t m, (c) t ≈ 0.92s and 3.08s, (d) Check x values at rest points, (e) Only at t = 0',
        formulas_used: ['v = ∫a dt', 'x = ∫v dt', 'Quadratic formula', 'Critical points'],
        explanation: 'Advanced calculus-based problem involving integration, finding extrema, and solving polynomial equations.'
      },
      {
        text: `A rocket is launched vertically with constant acceleration. During the first phase, it accelerates at 20 m/s² for 8 seconds. Then the engines shut off and it continues upward under gravity only.
        
(a) What is the velocity at the end of the first phase?
(b) How high is the rocket at the end of the first phase?
(c) How much higher does it go after engines shut off?
(d) What is the total time from launch until it hits the ground (assuming it starts from ground level)?
(e) What is the velocity when it hits the ground?`,
        solution_steps: [
          'Step 1: Velocity at end of phase 1: v₁ = u + at = 0 + 20(8) = 160 m/s',
          'Step 2: Height at end of phase 1: h₁ = ut + ½at² = 0 + ½(20)(8)² = 640 m',
          'Step 3: Additional height: Using v² = u² + 2ah with v=0 at max: 0 = 160² + 2(-10)h₂, h₂ = 1280 m',
          'Step 4: Total height: 640 + 1280 = 1920 m',
          'Step 5: Time to fall: Using h = ½gt²: 1920 = ½(10)t², t = √384 ≈ 19.6 seconds',
          'Step 6: Total time: 8 + (time to max) + 19.6. Time to max after engines off: v = u + at, 0 = 160 - 10t, t = 16s. Total = 8 + 16 + 19.6 = 43.6s',
          'Step 7: Velocity at ground: v = gt = 10(19.6) = 196 m/s downward'
        ],
        final_answer: '(a) 160 m/s, (b) 640 m, (c) 1280 m, (d) ≈ 43.6 seconds, (e) 196 m/s downward',
        formulas_used: ['v = u + at', 'h = ut + ½at²', 'v² = u² + 2ah', 'Multi-phase motion'],
        explanation: 'Complex multi-phase motion problem combining powered flight and free fall with multiple calculations.'
      }
    ];

    // Select questions based on difficulty level
    let selectedQuestions: any[] = [];
    if (difficultyLevel === 'Foundation') {
      selectedQuestions = foundationQuestions;
    } else if (difficultyLevel === 'Intermediate') {
      selectedQuestions = intermediateQuestions;
    } else {
      selectedQuestions = advancedQuestions;
    }

    // Return requested number of questions, cycling through samples if needed
    return Array.from({ length: count }, (_, index) => {
      const baseQuestion = selectedQuestions[index % selectedQuestions.length];
      return {
        ...baseQuestion,
        text: baseQuestion.text
      };
    });
  };

  const handleAnswer = async (questionId: string, selectedAnswer: string, timeSpent: number) => {
    if (!user) return;

    const question = mcqQuestions.find(q => q.id === questionId);
    if (!question) return;

    // Check if answer is correct
    const correctOption = question.options?.find((opt: any) => opt.isCorrect);
    // Get correct answer from question data (could be in different formats)
    const correctAnswerId = (question as any).correct_answer || (question as any).correctAnswer || correctOption?.id;
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

  if (showQuizMode) {
    return (
      <QuizMode
        topic={topic}
        difficultyLevel={selectedLevel}
        progress={progress}
        onBack={() => {
          setShowQuizMode(false);
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
          {/* Strengthen Your Basics Card - MCQ Questions */}
          <button
            onClick={() => {
              setShowMcqQuestions(true);
              if (mcqQuestions.length > 0) {
                setTimeout(() => {
                  const questionsSection = document.getElementById('questions-section');
                  if (questionsSection) {
                    questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              } else {
                setLoading(true);
                loadMCQQuestions().then(() => {
                  setTimeout(() => {
                    const questionsSection = document.getElementById('questions-section');
                    if (questionsSection) {
                      questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 500);
                });
              }
            }}
            className="w-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 hover:border-green-500/50 transition-all p-6 text-left cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Strengthen Your Basics</h4>
                <p className="text-sm text-slate-400">MCQ Practice</p>
              </div>
            </div>
            <p className="text-slate-300 mb-4 text-sm">
              10 AI-generated MCQ questions refreshed daily to build strong foundations
            </p>
            {mcqQuestions.length > 0 ? (
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-sm text-slate-400 mb-1">Today's Practice</div>
                <div className="text-xs text-slate-300">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  New in: {getTimeUntilRenewal()}
                </div>
                <div className="text-xs text-green-300 mt-2 font-semibold">Click to view MCQ questions</div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-sm text-green-400 font-semibold mb-1">Click to Start</div>
                <div className="text-xs text-slate-300">Get 10 MCQ Questions</div>
              </div>
            )}
          </button>

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

          {/* Daily Questions Card - Q&A Format (Not MCQ) */}
          <button
            onClick={() => {
              setShowQaQuestions(true);
              if (qaQuestions.length > 0) {
                setTimeout(() => {
                  const questionsSection = document.getElementById('questions-section');
                  if (questionsSection) {
                    questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              } else {
                setQaLoading(true);
                loadQAQuestions().then(() => {
                  setTimeout(() => {
                    const questionsSection = document.getElementById('questions-section');
                    if (questionsSection) {
                      questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 500);
                });
              }
            }}
            className="w-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border-2 border-slate-700/50 hover:border-blue-500/50 transition-all p-6 text-left cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Daily Questions</h4>
                <p className="text-sm text-slate-400">Q&A Format</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              {selectedSubtopic 
                ? `10 Q&A questions with detailed answers for "${selectedSubtopic.name}"`
                : `10 Q&A questions with detailed answers based on topic and subtopic`
              }
            </p>
            {qaQuestions.length > 0 ? (
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{qaQuestions.length}</div>
                <div className="text-xs text-slate-400">Q&A Available</div>
                <div className="text-xs text-blue-300 mt-2 font-semibold">Click to view Q&A</div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">10</div>
                <div className="text-xs text-slate-400">Q&A Available</div>
                <div className="text-xs text-blue-300 mt-2 font-semibold">Click to generate Q&A</div>
              </div>
            )}
          </button>
        </div>
      </div>


      {/* Show MCQ questions after user clicks "Strengthen Your Basics" */}
      {showMcqQuestions && mcqQuestions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Strengthen Your Basics - MCQ Questions
                {selectedSubtopic && (
                  <span className="text-lg text-green-400 font-normal ml-2">
                    - {selectedSubtopic.name}
                  </span>
                )}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                10 Multiple Choice Questions to build strong foundations
              </p>
            </div>
            {/* Level Dropdown - Right Corner */}
            <LevelDropdown 
              selectedLevel={currentLevel} 
              onLevelChange={(level) => {
                handleLevelChange(level);
                // Questions will reload automatically via useEffect
              }} 
            />
          </div>
          {mcqQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              totalQuestions={mcqQuestions.length}
              userAnswer={userAnswers.get(question.id)}
              onAnswer={handleAnswer}
            />
          ))}
        </div>
      )}

      {/* Show loading state when generating MCQ questions */}
      {showMcqQuestions && loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Generating 10 MCQ questions...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      )}

      {/* Show error state if MCQ questions fail to load */}
      {showMcqQuestions && error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-800 font-semibold mb-2">Error Loading MCQ Questions</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                loadMCQQuestions();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Show Q&A questions after user clicks "Daily Questions" */}
      {showQaQuestions && qaQuestions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Daily Questions - Q&A Format
                {selectedSubtopic && (
                  <span className="text-lg text-blue-400 font-normal ml-2">
                    - {selectedSubtopic.name}
                  </span>
                )}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {selectedSubtopic 
                  ? `10 Q&A questions with detailed answers for "${selectedSubtopic.name}"`
                  : `10 Q&A questions with detailed answers based on topic and subtopic`
                }
              </p>
            </div>
            {/* Level Dropdown - Right Corner */}
            <LevelDropdown 
              selectedLevel={currentLevel} 
              onLevelChange={(level) => {
                handleLevelChange(level);
                // Questions will reload automatically via useEffect
              }} 
            />
          </div>
          {qaQuestions.map((question, index) => (
            <QAQuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              totalQuestions={qaQuestions.length}
            />
          ))}
        </div>
      )}

      {/* Show loading state when generating Q&A questions */}
      {showQaQuestions && qaLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Generating 10 Q&A questions with answers...</p>
          <p className="text-sm text-gray-500 mt-2">
            {selectedSubtopic 
              ? `Creating Q&A for "${selectedSubtopic.name}"...`
              : 'This may take a moment'
            }
          </p>
        </div>
      )}

      {/* Show error state if Q&A questions fail to load */}
      {showQaQuestions && qaError && (
        <div className="text-center py-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-800 font-semibold mb-2">Error Loading Q&A Questions</p>
            <p className="text-red-600 text-sm mb-4">{qaError}</p>
            <button
              onClick={() => {
                setQaError(null);
                loadQAQuestions();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
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

    </div>
  );
}
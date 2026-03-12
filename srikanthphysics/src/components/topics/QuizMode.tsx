import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, SkipForward, Award, RotateCcw, Home } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import type { Topic, Question, UserAnswer, TopicProgress } from '../../types/topics';

interface QuizModeProps {
  topic: Topic;
  difficultyLevel: string;
  progress: TopicProgress | null;
  onBack: () => void;
  onProgressUpdate: () => void;
}

export function QuizMode({ topic, difficultyLevel, progress, onBack, onProgressUpdate }: QuizModeProps) {
  const user = useAuthStore((state) => state.user);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [userAnswersData, setUserAnswersData] = useState<UserAnswer[]>([]);

  useEffect(() => {
    loadQuizQuestions();
  }, [topic.id, difficultyLevel]);

  const loadQuizQuestions = async () => {
    try {
      setLoading(true);

      const { data: questionsData, error } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topic.id)
        .eq('segment_type', 'basics')
        .limit(10);

      if (error) throw error;

      const questionsToUse = questionsData?.slice(0, 10) || [];
      setQuestions(questionsToUse);
      setSelectedAnswers(new Array(10).fill(null));
      setUserAnswersData([]);
    } catch (error) {
      console.error('Error loading quiz questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress_percent = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  const handleSelectAnswer = (optionId: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionId;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await completeQuiz();
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const completeQuiz = async () => {
    if (!user) return;

    try {
      let correctCount = 0;
      const answers: UserAnswer[] = [];

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const selectedOptionId = selectedAnswers[i];
        const correctOption = question.options.find((opt: any) => opt.isCorrect);
        const isCorrect = selectedOptionId === correctOption?.id;

        if (isCorrect) correctCount++;

        const timeSpent = Math.floor((Date.now() - startTime) / 1000 / totalQuestions);

        const { data: answer } = await supabase
          .from('user_answers')
          .insert({
            user_id: user.id,
            question_id: question.id,
            selected_answer: selectedOptionId || '',
            is_correct: isCorrect,
            time_spent: timeSpent,
            difficulty_level: difficultyLevel
          })
          .select()
          .maybeSingle();

        if (answer) answers.push(answer);
      }

      setUserAnswersData(answers);

      if (progress) {
        const levelKey = `${difficultyLevel}_completed`;
        const levelCorrectKey = `${difficultyLevel}_correct`;

        await supabase
          .from('topic_progress')
          .update({
            mastery: Math.min(100, Math.round((progress.mastery + (correctCount / totalQuestions) * 5))),
            questions_completed: progress.questions_completed + totalQuestions,
            questions_correct: progress.questions_correct + correctCount,
            last_practiced: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            [levelKey]: (progress[levelKey as keyof TopicProgress] as number || 0) + totalQuestions,
            [levelCorrectKey]: (progress[levelCorrectKey as keyof TopicProgress] as number || 0) + correctCount
          })
          .eq('id', progress.id);

        onProgressUpdate();
      }

      setQuizComplete(true);
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Level {difficultyLevel.replace('level_', '')} Quiz...</p>
      </div>
    );
  }

  if (quizComplete) {
    const correctCount = userAnswersData.filter(a => a.is_correct).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white text-center mb-8">
          <Award className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-lg text-green-100">You've finished Level {difficultyLevel.replace('level_', '')} Quiz</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border-2 border-green-200">
            <div className="text-sm text-gray-600 mb-2">Score</div>
            <div className="text-4xl font-bold text-green-600">
              {correctCount}/{totalQuestions}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
            <div className="text-sm text-gray-600 mb-2">Accuracy</div>
            <div className="text-4xl font-bold text-blue-600">{accuracy}%</div>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
            <div className="text-sm text-gray-600 mb-2">Time</div>
            <div className="text-4xl font-bold text-purple-600">
              {Math.floor((Date.now() - startTime) / 1000)}s
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentQuestionIndex(0);
              setSelectedAnswers(new Array(10).fill(null));
              setQuizComplete(false);
              setUserAnswersData([]);
              loadQuizQuestions();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Quiz
          </button>
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-300 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion || totalQuestions === 0) {
    return <div className="text-center py-12">No questions available</div>;
  }

  const correctOption = currentQuestion.options.find((opt: any) => opt.isCorrect);
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Level {difficultyLevel.replace('level_', '')} Quiz</h2>
            <p className="text-gray-600">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">{currentQuestionIndex + 1}</div>
            <div className="text-sm text-gray-600">/ {totalQuestions}</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-600 to-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress_percent}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{currentQuestion.question_text}</h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option: any) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrectOption = option.isCorrect;
            const isAnswered = selectedAnswer !== null;

            let buttonClass = 'border-2 border-gray-200 hover:border-gray-300 bg-white';

            if (isAnswered && isSelected && isCorrectOption) {
              buttonClass = 'border-2 border-green-500 bg-green-50';
            } else if (isAnswered && isSelected && !isCorrectOption) {
              buttonClass = 'border-2 border-red-500 bg-red-50';
            } else if (isAnswered && isCorrectOption) {
              buttonClass = 'border-2 border-green-500 bg-green-50';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-lg text-left font-medium transition-all ${buttonClass} ${
                  isAnswered ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-current' : 'border-gray-300'
                  }`}>
                    {isAnswered && isSelected && isCorrectOption && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    {isAnswered && !isSelected && isCorrectOption && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <span>{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSkip}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-300 transition-all"
        >
          <SkipForward className="w-5 h-5" />
          Skip
        </button>
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}

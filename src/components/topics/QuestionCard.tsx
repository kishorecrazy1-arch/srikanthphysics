import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Bookmark, Flag, Lightbulb } from 'lucide-react';
import type { Question, UserAnswer } from '../../types/topics';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer?: UserAnswer;
  onAnswer: (questionId: string, selectedAnswer: string, timeSpent: number) => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onAnswer
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    userAnswer?.selected_answer || null
  );
  const [showExplanation, setShowExplanation] = useState(!!userAnswer);
  const [startTime] = useState(Date.now());
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getDifficultyStars = (difficulty: string) => {
    const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    return '⭐'.repeat(count);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-orange-600 bg-orange-50';
      case 'hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (showExplanation) return;

    setSelectedOption(optionId);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onAnswer(question.id, optionId, timeSpent);
    setShowExplanation(true);
  };

  const correctOption = question.options.find(opt => opt.isCorrect);
  const isCorrect = selectedOption === correctOption?.id;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 border-2 border-gray-100">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(question.difficulty)}`}>
            {getDifficultyStars(question.difficulty)} {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-600">
            {question.question_type}
          </span>
        </div>

        {showExplanation && (
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                <CheckCircle className="w-5 h-5" />
                Correct!
              </span>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold">
                <XCircle className="w-5 h-5" />
                Incorrect
              </span>
            )}
          </div>
        )}
      </div>

      {question.subtopic && (
        <div className="mb-4">
          <span className="text-sm text-gray-600 font-medium">
            📚 Subtopic: {question.subtopic}
          </span>
        </div>
      )}

      <div className="mb-6">
        <p className="text-lg md:text-xl text-gray-900 leading-relaxed font-medium">
          {question.question_text}
        </p>
      </div>

      {question.image_url && (
        <div className="mb-6">
          <img
            src={question.image_url}
            alt="Question diagram"
            className="max-w-full h-auto rounded-lg border border-gray-200"
          />
        </div>
      )}

      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrectAnswer = option.isCorrect;
          const showAsCorrect = showExplanation && isCorrectAnswer;
          const showAsIncorrect = showExplanation && isSelected && !isCorrectAnswer;

          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                showAsCorrect
                  ? 'border-green-500 bg-green-50'
                  : showAsIncorrect
                  ? 'border-red-500 bg-red-50'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  showAsCorrect
                    ? 'bg-green-500 text-white'
                    : showAsIncorrect
                    ? 'bg-red-500 text-white'
                    : isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {option.id}
                </span>
                <span className="text-gray-900 text-base md:text-lg">{option.text}</span>
                {showAsCorrect && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                {showAsIncorrect && <XCircle className="w-5 h-5 text-red-600 ml-auto" />}
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && question.explanation && (
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Step-by-Step Solution</h3>
          </div>

          {question.explanation.steps && question.explanation.steps.length > 0 && (
            <div className="space-y-4 mb-6">
              {question.explanation.steps.map((step, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-blue-100">
                  <h4 className="font-bold text-gray-900 mb-2">
                    Step {idx + 1}: {step.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {step.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {question.explanation.keyConcept && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>🔑</span> Key Concept
              </h4>
              <p className="text-gray-800 leading-relaxed">
                {question.explanation.keyConcept}
              </p>
            </div>
          )}

          {question.explanation.relatedFormulas && question.explanation.relatedFormulas.length > 0 && (
            <div className="mt-4 bg-white border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">📐 Related Formulas:</h4>
              <div className="flex flex-wrap gap-2">
                {question.explanation.relatedFormulas.map((formula, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono">
                    {formula}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Time limit: {question.time_limit}s</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-yellow-700' : ''}`} />
            <span className="text-sm font-medium">Save</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <Flag className="w-4 h-4" />
            <span className="text-sm font-medium">Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

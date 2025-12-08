/**
 * Q&A Question Card Component
 * Displays questions and answers in a Q&A format (not MCQ)
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';

interface QAQuestion {
  id: string;
  question_text: string;
  solution_steps?: string[];
  final_answer?: string;
  explanation?: string;
  formulas_used?: string[];
  difficulty_level?: string;
}

interface QAQuestionCardProps {
  question: QAQuestion;
  questionNumber: number;
  totalQuestions: number;
}

export function QAQuestionCard({ question, questionNumber, totalQuestions }: QAQuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const difficulty = question.difficulty_level || 'Intermediate';
  const difficultyColors = {
    Foundation: 'text-green-400',
    Intermediate: 'text-yellow-400',
    Advanced: 'text-red-400'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 mb-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-700">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`text-sm font-semibold ${difficultyColors[difficulty as keyof typeof difficultyColors] || 'text-yellow-400'}`}>
            ⭐⭐ {difficulty}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
            Q&A
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Question:</h3>
        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
          {question.question_text || 'Question text not available'}
        </p>
      </div>

      {/* Formulas Used (if available) */}
      {question.formulas_used && question.formulas_used.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-700 mb-2">Relevant Formulas:</p>
          <div className="flex flex-wrap gap-2">
            {question.formulas_used.map((formula, index) => (
              <span
                key={index}
                className="text-xs bg-white text-blue-800 px-2 py-1 rounded border border-blue-300 font-mono"
              >
                {formula}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Answer Toggle Button */}
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-semibold"
      >
        <span>{showAnswer ? 'Hide Answer' : 'Show Answer'}</span>
        {showAnswer ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Answer Section */}
      {showAnswer && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="text-lg font-bold text-green-800">Answer & Explanation</h4>
          </div>

          {/* Final Answer */}
          {question.final_answer && (
            <div className="mb-4 p-3 bg-white rounded-lg border border-green-300">
              <p className="text-sm font-semibold text-green-700 mb-1">Final Answer:</p>
              <p className="text-base font-bold text-green-800">{question.final_answer}</p>
            </div>
          )}

          {/* Step-by-Step Solution */}
          {question.solution_steps && question.solution_steps.length > 0 ? (
            <div className="mb-4">
              <p className="text-sm font-semibold text-green-700 mb-2">Step-by-Step Solution:</p>
              <ol className="space-y-2">
                {question.solution_steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          ) : question.explanation ? (
            <div className="mb-4">
              <p className="text-sm font-semibold text-green-700 mb-2">Explanation:</p>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {question.explanation}
              </p>
            </div>
          ) : null}

          {/* Additional Notes */}
          <div className="pt-3 border-t border-green-300">
            <p className="text-xs text-green-600 italic">
              💡 Tip: Review each step carefully to understand the problem-solving approach.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}












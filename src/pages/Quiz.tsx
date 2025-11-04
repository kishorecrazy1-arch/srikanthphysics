import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, ArrowRight, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';

export function Quiz() {
  const navigate = useNavigate();
  const {
    questions,
    currentQuestionIndex,
    answers,
    showExplanation,
    submitAnswer,
    nextQuestion,
    completeQuiz,
    resetQuiz,
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [confidence, setConfidence] = useState(3);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (questions.length === 0) {
      navigate('/ap-physics');
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, navigate]);

  useEffect(() => {
    setSelectedAnswer('');
    setConfidence(3);
  }, [currentQuestionIndex]);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentAnswer = answers[currentQuestionIndex];

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    submitAnswer(currentQuestion.id, selectedAnswer, confidence);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleComplete();
    } else {
      nextQuestion();
    }
  };

  const handleComplete = async () => {
    await completeQuiz();
    resetQuiz();
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: currentQuestion.difficulty }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            {currentQuestion.topic}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          {currentQuestion.questionText}
        </h2>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.id === currentQuestion.correctAnswer;
            const showResult = showExplanation && currentAnswer;

            let buttonClass = 'w-full text-left p-4 rounded-xl border-2 transition-all ';

            if (showResult) {
              if (option.id === currentAnswer.selectedAnswer) {
                buttonClass += currentAnswer.isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50';
              } else if (isCorrect) {
                buttonClass += 'border-green-500 bg-green-50';
              } else {
                buttonClass += 'border-gray-200 bg-gray-50';
              }
            } else {
              buttonClass += isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
            }

            return (
              <button
                key={option.id}
                onClick={() => !showExplanation && setSelectedAnswer(option.id)}
                disabled={showExplanation}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-gray-700">{option.id}.</span>
                    <span className="text-gray-800">{option.text}</span>
                  </div>
                  {showResult && option.id === currentAnswer.selectedAnswer && (
                    currentAnswer.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )
                  )}
                  {showResult && isCorrect && option.id !== currentAnswer.selectedAnswer && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {!showExplanation && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Level
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setConfidence(level)}
                  className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                    confidence === level
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <Star
                    className={`w-5 h-5 mx-auto ${
                      confidence === level ? 'fill-blue-500 text-blue-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {showExplanation && currentAnswer && (
          <div className="mb-8 space-y-4">
            <div
              className={`p-6 rounded-xl ${
                currentAnswer.isCorrect
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-red-50 border-2 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {currentAnswer.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <h3 className="text-lg font-bold text-gray-800">
                  {currentAnswer.isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
              </div>
              <p className="text-gray-700 mb-4">{currentQuestion.explanation}</p>
              <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Key Concept</p>
                    <p className="text-gray-700">{currentQuestion.keyConcept}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {!showExplanation ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Submit Answer
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="flex gap-2">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentQuestionIndex
                  ? 'bg-blue-500 w-6'
                  : idx < currentQuestionIndex
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

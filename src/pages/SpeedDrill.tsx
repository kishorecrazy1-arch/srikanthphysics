import { useState, useEffect } from 'react';
import { Zap, Clock, TrendingUp, Award, RotateCcw, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the SI unit of force?",
    options: ["Newton", "Joule", "Watt", "Pascal"],
    correctIndex: 0
  },
  {
    id: 2,
    question: "Convert 5 km/h to m/s (approximately)",
    options: ["1.39 m/s", "5 m/s", "18 m/s", "0.72 m/s"],
    correctIndex: 0
  },
  {
    id: 3,
    question: "F = ma represents which law?",
    options: ["Newton's 2nd", "Newton's 1st", "Newton's 3rd", "Hooke's Law"],
    correctIndex: 0
  },
  {
    id: 4,
    question: "Direction of force on object moving right and accelerating right?",
    options: ["Right", "Left", "Up", "Down"],
    correctIndex: 0
  },
  {
    id: 5,
    question: "Sign of acceleration when slowing down?",
    options: ["Negative", "Positive", "Zero", "Undefined"],
    correctIndex: 0
  },
  {
    id: 6,
    question: "Energy is measured in?",
    options: ["Joules", "Newtons", "Watts", "Meters"],
    correctIndex: 0
  },
  {
    id: 7,
    question: "What is the formula for kinetic energy?",
    options: ["½mv²", "mgh", "Fd", "Pt"],
    correctIndex: 0
  },
  {
    id: 8,
    question: "Acceleration due to gravity (g) ≈",
    options: ["9.8 m/s²", "10 m/s", "9.8 m", "10 m/s²"],
    correctIndex: 0
  },
  {
    id: 9,
    question: "Momentum = ?",
    options: ["mv", "ma", "Ft", "½mv²"],
    correctIndex: 0
  },
  {
    id: 10,
    question: "Power is measured in?",
    options: ["Watts", "Joules", "Newtons", "Volts"],
    correctIndex: 0
  }
];

export function SpeedDrill() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (isComplete || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, timeLeft]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const correct = index === questions[currentQuestion].correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 10);
      setStreak(streak + 1);
      setAnswers([...answers, true]);
    } else {
      setStreak(0);
      setAnswers([...answers, false]);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setIsComplete(true);
      }
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalTime = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    return formatTime(elapsed);
  };

  const getAvgTime = () => {
    if (answers.length === 0) return '0s';
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    return `${Math.floor(elapsed / answers.length)}s`;
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setTimeLeft(300);
    setIsComplete(false);
    setAnswers([]);
  };

  if (isComplete) {
    const accuracy = answers.length > 0 ? Math.round((answers.filter(a => a).length / answers.length) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-12 border border-orange-500/30 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full mb-6">
              <Award className="w-12 h-12" />
            </div>

            <h1 className="text-4xl font-bold mb-2">Speed Drill Complete!</h1>
            <p className="text-gray-400 mb-8">Great job on your practice session</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-orange-500/20">
                <div className="text-5xl font-bold text-orange-400 mb-2">{answers.filter(a => a).length}/{answers.length}</div>
                <div className="text-gray-400">Correct Answers</div>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-orange-500/20">
                <div className="text-5xl font-bold text-orange-400 mb-2">{accuracy}%</div>
                <div className="text-gray-400">Accuracy</div>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-orange-500/20">
                <div className="text-3xl font-bold text-gray-300 mb-2">{getTotalTime()}</div>
                <div className="text-gray-400">Total Time</div>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-orange-500/20">
                <div className="text-3xl font-bold text-gray-300 mb-2">{getAvgTime()}</div>
                <div className="text-gray-400">Avg per Question</div>
              </div>
            </div>

            {accuracy >= 80 && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30 mb-8">
                <p className="text-2xl font-bold text-green-400 mb-2">Excellent Performance!</p>
                <p className="text-gray-300">You're mastering these concepts. Keep it up!</p>
              </div>
            )}

            <div className="bg-slate-900/50 rounded-2xl p-6 border border-orange-500/20 mb-8">
              <h3 className="text-lg font-bold mb-4">Performance Breakdown</h3>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {answers.map((correct, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                      correct
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={() => navigate('/ap-physics')}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 py-4 rounded-xl font-bold text-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                Back to Topics
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/ap-physics')}
          className="flex items-center gap-2 text-orange-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Zap className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Speed Drill</h1>
              <p className="text-orange-200">10 Questions • 5 Minutes • Test Your Speed!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-yellow-500/20 px-6 py-3 rounded-xl border border-yellow-500/30">
            <Clock className="w-6 h-6 text-yellow-400" />
            <span className="text-3xl font-bold text-yellow-400">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Question {currentQuestion + 1}/{questions.length}</h2>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-2xl font-semibold mb-8 leading-relaxed">{questions[currentQuestion].question}</p>

          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`p-6 rounded-xl font-semibold text-lg transition-all border-2 ${
                  selectedAnswer === null
                    ? 'bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-orange-500'
                    : selectedAnswer === index
                    ? isCorrect
                      ? 'bg-green-500/20 border-green-500 animate-pulse'
                      : 'bg-red-500/20 border-red-500 animate-shake'
                    : index === questions[currentQuestion].correctIndex && selectedAnswer !== null
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-slate-700/50 border-slate-700 opacity-50'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    selectedAnswer === index && isCorrect
                      ? 'bg-green-500'
                      : selectedAnswer === index && !isCorrect
                      ? 'bg-red-500'
                      : index === questions[currentQuestion].correctIndex && selectedAnswer !== null
                      ? 'bg-green-500'
                      : 'bg-slate-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div className={`mt-6 p-4 rounded-xl text-center font-bold text-lg ${
              isCorrect
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isCorrect ? '✓ Correct! +10 points' : '✗ Incorrect'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-gray-400">Current Streak</span>
            </div>
            <div className="text-3xl font-bold text-orange-400">{streak} 🔥</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Accuracy</span>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {answers.length > 0 ? Math.round((answers.filter(a => a).length / answers.length) * 100) : 0}%
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Points</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{score}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

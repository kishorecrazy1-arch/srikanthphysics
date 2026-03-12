import { useState, useEffect } from 'react';
import { Clock, Calculator, BookOpen, Flag, ChevronLeft, ChevronRight, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface Question {
  id: number;
  topic: string;
  subtopic: string;
  question: string;
  hasGraph: boolean;
  graphData?: any[];
  options: string[];
  selectedAnswer?: number;
  flagged: boolean;
}

export function MockTest() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5025);
  const [showCalculator, setShowCalculator] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      topic: 'Kinematics',
      subtopic: 'Graph Analysis',
      question: 'A ball is thrown vertically upward with an initial velocity of 20 m/s. The graph below shows the velocity of the ball as a function of time.\n\nWhat is the displacement of the ball during the first 4 seconds?',
      hasGraph: true,
      graphData: [
        { time: 0, velocity: 15 },
        { time: 0.5, velocity: 10 },
        { time: 1, velocity: 5 },
        { time: 1.5, velocity: 0 },
        { time: 2, velocity: -5 },
        { time: 2.5, velocity: -10 },
        { time: 3, velocity: -15 },
        { time: 3.5, velocity: -20 },
        { time: 4, velocity: -25 }
      ],
      options: ['0 m', '20 m', '40 m', '80 m'],
      flagged: false
    },
    ...Array.from({ length: 49 }, (_, i) => ({
      id: i + 2,
      topic: i % 3 === 0 ? 'Kinematics' : i % 3 === 1 ? 'Dynamics' : 'Energy',
      subtopic: 'Problem Solving',
      question: `Sample question ${i + 2} about physics concepts and problem-solving.`,
      hasGraph: false,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      flagged: false
    }))
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const updated = [...questions];
    updated[currentQuestion].selectedAnswer = optionIndex;
    setQuestions(updated);
  };

  const handleFlagToggle = () => {
    const updated = [...questions];
    updated[currentQuestion].flagged = !updated[currentQuestion].flagged;
    setQuestions(updated);
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestion(index);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const answeredCount = questions.filter(q => q.selectedAnswer !== undefined).length;
  const flaggedCount = questions.filter(q => q.flagged).length;
  const remainingCount = questions.length - answeredCount;

  const getQuestionStatus = (index: number) => {
    const q = questions[index];
    if (q.flagged) return 'flagged';
    if (q.selectedAnswer !== undefined) return 'answered';
    return 'not-visited';
  };

  const current = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-indigo-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/ap-physics')}
            className="flex items-center gap-2 text-indigo-200 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AP Physics 1 Mock Test</h1>
                <p className="text-sm text-indigo-200">Section I: Multiple Choice</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-slate-800 px-6 py-3 rounded-xl border border-indigo-500/30">
                <Clock className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-2xl font-bold font-mono">{formatTime(timeRemaining)}</div>
                  <div className="text-xs text-gray-400">Time Remaining</div>
                </div>
              </div>

              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Calculator
              </button>

              <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-green-500/30">
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-slate-800/30 rounded-xl p-4 mb-6 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm font-semibold text-indigo-300">
              {currentQuestion + 1} of {questions.length} questions
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/20 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {current.id}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Question {current.id}</h2>
                    <p className="text-indigo-300">
                      {current.topic} • {current.subtopic}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleFlagToggle}
                  className={`p-3 rounded-lg transition-colors ${
                    current.flagged
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <Flag className="w-5 h-5" fill={current.flagged ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-lg leading-relaxed whitespace-pre-line">{current.question}</p>
              </div>

              {current.hasGraph && current.graphData && (
                <div className="bg-slate-900/50 rounded-xl p-6 mb-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={current.graphData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                      <XAxis
                        dataKey="time"
                        stroke="#94a3b8"
                        label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                      />
                      <YAxis
                        dataKey="velocity"
                        stroke="#94a3b8"
                        label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                      />
                      <Line
                        type="linear"
                        dataKey="velocity"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="space-y-3">
                {current.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                      current.selectedAnswer === index
                        ? 'bg-indigo-600/20 border-indigo-500'
                        : 'bg-slate-900/30 border-slate-700 hover:border-indigo-600/50 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                          current.selectedAnswer === index
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-700 text-gray-300'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-semibold transition-colors">
                <Save className="w-5 h-5" />
                Save & Continue
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/20">
              <h3 className="text-xl font-bold mb-4">Test Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Answered</span>
                  <span className="text-2xl font-bold text-green-400">{answeredCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Flagged</span>
                  <span className="text-2xl font-bold text-yellow-400">{flaggedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Remaining</span>
                  <span className="text-2xl font-bold text-gray-500">{remainingCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/20">
              <h3 className="text-xl font-bold mb-4">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleQuestionJump(index)}
                      className={`aspect-square rounded-lg font-bold text-lg transition-all relative ${
                        index === currentQuestion
                          ? 'ring-4 ring-indigo-500 scale-110'
                          : ''
                      } ${
                        status === 'answered'
                          ? 'bg-green-600 hover:bg-green-700'
                          : status === 'flagged'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-600"></div>
                  <span className="text-gray-300">Answered</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-yellow-600"></div>
                  <span className="text-gray-300">Flagged</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-slate-700"></div>
                  <span className="text-gray-300">Not Visited</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-2xl p-6 border border-yellow-600/30">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-600 rounded-lg flex-shrink-0">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-300 mb-2">Test Tip</h4>
                  <p className="text-sm text-gray-200">
                    Read the question carefully. Identify what's being asked before looking at answer choices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

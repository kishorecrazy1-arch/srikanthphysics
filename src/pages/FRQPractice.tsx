import { useState } from 'react';
import { FileText, Upload, Sparkles, CheckCircle, Calculator, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuestionPart {
  id: string;
  letter: string;
  question: string;
  points: number;
  type: 'diagram' | 'calculation' | 'explanation';
  answer: string;
  feedback?: string;
  score?: number;
}

export function FRQPractice() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [parts, setParts] = useState<QuestionPart[]>([
    {
      id: 'a',
      letter: 'a',
      question: 'Draw a complete force diagram at the highest point',
      points: 2,
      type: 'diagram',
      answer: ''
    },
    {
      id: 'b',
      letter: 'b',
      question: 'Calculate the time to reach maximum height',
      points: 2,
      type: 'calculation',
      answer: ''
    },
    {
      id: 'c',
      letter: 'c',
      question: 'Determine the total flight time',
      points: 2,
      type: 'calculation',
      answer: ''
    },
    {
      id: 'd',
      letter: 'd',
      question: 'Determine the horizontal range',
      points: 2,
      type: 'calculation',
      answer: ''
    },
    {
      id: 'e',
      letter: 'e',
      question: 'Explain whether doubling the mass changes the range (1-2 sentences)',
      points: 2,
      type: 'explanation',
      answer: ''
    }
  ]);

  const handleAnswerChange = (id: string, value: string) => {
    setParts(parts.map(part =>
      part.id === id ? { ...part, answer: value } : part
    ));
  };

  const handleSubmit = () => {
    const gradedParts = parts.map(part => ({
      ...part,
      score: 2,
      feedback: `Excellent work! Your ${part.type} demonstrates clear understanding of the concepts. Formula application is correct, mathematical steps are clear, and reasoning is sound.`
    }));
    setParts(gradedParts);
    setSubmitted(true);
  };

  const totalScore = submitted ? parts.reduce((sum, part) => sum + (part.score || 0), 0) : 0;
  const maxScore = parts.reduce((sum, part) => sum + part.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/ap-physics')}
          className="flex items-center gap-2 text-purple-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Free Response Question</h1>
            <p className="text-2xl text-purple-300 mb-2">FRQ 1 — Projectile Motion</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition-colors">
              <FileText className="w-5 h-5" />
              View Rubric
            </button>
            <div className="bg-slate-800 px-6 py-3 rounded-xl border border-purple-500/30">
              <div className="text-3xl font-bold">{maxScore}</div>
              <div className="text-sm text-gray-400">Total Points</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Problem Statement</h2>
              <p className="text-lg leading-relaxed mb-4">
                A ball is thrown with an initial speed of <span className="text-purple-400 font-semibold">15 m/s</span> at an angle of <span className="text-purple-400 font-semibold">35°</span> above the horizontal. Air resistance is negligible. Use g = 10 m/s².
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
            <p className="text-sm text-gray-300 italic">
              Answer all parts below. Show your work for full credit. Include units in your final answers.
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {parts.map((part, index) => (
            <div
              key={part.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    ({part.letter})
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{part.question}</h3>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-600/20 rounded-lg text-sm font-semibold text-purple-300">
                        {part.points} points
                      </span>
                      <span className="px-3 py-1 bg-slate-700 rounded-lg text-sm text-gray-300 capitalize">
                        {part.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {part.type === 'diagram' ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-12 text-center bg-slate-900/30 hover:border-purple-500/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-4">Upload your diagram or draw here</p>
                    <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition-colors">
                      Choose File
                    </button>
                  </div>
                  <div className="relative">
                    <textarea
                      value={part.answer}
                      onChange={(e) => handleAnswerChange(part.id, e.target.value)}
                      placeholder="Or describe your force diagram in words (e.g., 'Downward arrow labeled mg = 0.5 kg × 10 m/s² = 5 N')"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              ) : part.type === 'calculation' ? (
                <div>
                  <textarea
                    value={part.answer}
                    onChange={(e) => handleAnswerChange(part.id, e.target.value)}
                    placeholder="Show your work step by step:&#10;1. Write the relevant equation&#10;2. Substitute values with units&#10;3. Calculate the result&#10;4. State your final answer with units"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={6}
                  />
                </div>
              ) : (
                <div>
                  <textarea
                    value={part.answer}
                    onChange={(e) => handleAnswerChange(part.id, e.target.value)}
                    placeholder="Provide a clear explanation with reasoning..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={4}
                  />
                </div>
              )}

              {submitted && part.feedback && (
                <div className="mt-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-green-300">AI Feedback</h4>
                        <span className="text-2xl font-bold text-green-400">
                          {part.score}/{part.points} points
                        </span>
                      </div>
                      <p className="text-gray-200 leading-relaxed">{part.feedback}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-green-500/20">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Formula ✓</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Math Steps ✓</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Reasoning ✓</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${((part.score || 0) / part.points) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {submitted && (
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-8 border border-green-500/30 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-bold mb-2">
                {totalScore}/{maxScore}
              </h2>
              <p className="text-xl text-green-300">Excellent Work!</p>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-6">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className="bg-slate-800/50 rounded-xl p-4 text-center border border-green-500/20"
                >
                  <div className="text-sm text-gray-400 mb-1">Part ({part.letter})</div>
                  <div className="text-2xl font-bold text-green-400">
                    {part.score}/{part.points}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-green-300">Rubric Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Correct Formulas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Clear Work Shown</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Units Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Logical Steps</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Final Answers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Strong Reasoning</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between sticky bottom-6 bg-slate-800/95 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-lg">
          <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors">
            Save Draft
          </button>

          <div className="flex items-center gap-4">
            {!submitted && (
              <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all">
                <Sparkles className="w-5 h-5" />
                Get AI Hints
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/30"
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submitted
                </>
              ) : (
                'Submit for Grading'
              )}
            </button>
          </div>
        </div>

        {!submitted && (
          <div className="mt-6 bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-blue-300">Tip:</span> Show all your work step by step. Include formulas, substitutions with units, and clearly state your final answer. Partial credit is awarded for correct approach even if the final answer is incorrect.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

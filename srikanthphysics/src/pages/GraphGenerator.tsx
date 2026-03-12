import { useState } from 'react';
import { Sparkles, TrendingUp, RefreshCw, Download, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

type GraphType = 'velocity-time' | 'position-time' | 'acceleration-time';
type Difficulty = 'easy' | 'medium' | 'hard';
type QuestionFocus = 'area' | 'slope' | 'intercept' | 'comparison' | 'interpretation';

interface Question {
  id: string;
  graphType: GraphType;
  question: string;
  options: string[];
  correctIndex: number;
  solution: string;
  graphData: any[];
  stats: {
    maxValue: number;
    totalTime: number;
    areaUnderCurve: number;
  };
  features: string[];
}

export function GraphGenerator() {
  const navigate = useNavigate();
  const [graphType, setGraphType] = useState<GraphType>('velocity-time');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [difficultyLevel, setDifficultyLevel] = useState<'level_1' | 'level_2' | 'level_3'>('level_1');
  const [questionFocus, setQuestionFocus] = useState<QuestionFocus>('area');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);

  const generateGraphData = (type: GraphType) => {
    const timePoints = 50;
    const data = [];

    if (type === 'velocity-time') {
      const acceleration = Math.random() * 4 + 1;
      const initialVelocity = Math.random() * 5;
      const peakTime = Math.random() * 2 + 1.5;
      const totalTime = Math.random() * 2 + 3;

      for (let i = 0; i < timePoints; i++) {
        const t = (totalTime * i) / (timePoints - 1);
        let v;
        if (t < peakTime * 0.4) {
          v = initialVelocity + acceleration * t;
        } else if (t < peakTime * 0.6) {
          v = initialVelocity + acceleration * peakTime * 0.4;
        } else {
          v = Math.max(0, initialVelocity + acceleration * peakTime * 0.4 - acceleration * (t - peakTime * 0.6));
        }
        data.push({ time: parseFloat(t.toFixed(2)), value: parseFloat(v.toFixed(2)) });
      }
    } else if (type === 'position-time') {
      const amplitude = Math.random() * 10 + 5;
      const frequency = Math.random() * 0.5 + 0.3;
      const totalTime = Math.random() * 5 + 5;

      for (let i = 0; i < timePoints; i++) {
        const t = (totalTime * i) / (timePoints - 1);
        const x = amplitude * Math.sin(frequency * t) + amplitude;
        data.push({ time: parseFloat(t.toFixed(2)), value: parseFloat(x.toFixed(2)) });
      }
    } else {
      const maxAccel = Math.random() * 4 + 2;
      const totalTime = Math.random() * 3 + 4;

      for (let i = 0; i < timePoints; i++) {
        const t = (totalTime * i) / (timePoints - 1);
        const a = t < totalTime / 2 ? maxAccel : -maxAccel;
        data.push({ time: parseFloat(t.toFixed(2)), value: parseFloat(a.toFixed(2)) });
      }
    }

    return data;
  };

  const calculateStats = (data: any[]) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const totalTime = data[data.length - 1].time;

    let areaUnderCurve = 0;
    for (let i = 0; i < data.length - 1; i++) {
      const dt = data[i + 1].time - data[i].time;
      const avgValue = (data[i].value + data[i + 1].value) / 2;
      areaUnderCurve += avgValue * dt;
    }

    return {
      maxValue: parseFloat(maxValue.toFixed(2)),
      totalTime: parseFloat(totalTime.toFixed(2)),
      areaUnderCurve: parseFloat(areaUnderCurve.toFixed(2))
    };
  };

  const identifyFeatures = (data: any[], type: GraphType) => {
    const features = [];
    const values = data.map(d => d.value);

    const hasConstantSection = values.some((v, i) =>
      i > 0 && i < values.length - 1 &&
      Math.abs(v - values[i-1]) < 0.1 &&
      Math.abs(v - values[i+1]) < 0.1
    );

    if (hasConstantSection) {
      features.push(`Constant ${type === 'velocity-time' ? 'velocity' : type === 'position-time' ? 'position' : 'acceleration'} period`);
    }

    const increasing = values[values.length - 1] > values[0];
    const decreasing = values[values.length - 1] < values[0];

    if (increasing) features.push('Overall increase');
    if (decreasing) features.push('Overall decrease');

    const hasZero = values.some(v => Math.abs(v) < 0.5);
    if (hasZero) features.push('Zero value points');

    return features;
  };

  const generateQuestion = () => {
    const data = generateGraphData(graphType);
    const stats = calculateStats(data);
    const features = identifyFeatures(data, graphType);

    let question = '';
    let correctAnswer = '';
    let wrongAnswers: string[] = [];
    let solution = '';

    if (questionFocus === 'area' && graphType === 'velocity-time') {
      question = `The velocity-time graph above shows the motion of an object over ${stats.totalTime} seconds. What is the displacement of the object during this time interval?`;
      correctAnswer = `${stats.areaUnderCurve.toFixed(1)} m`;
      wrongAnswers = [
        `${(stats.areaUnderCurve * 0.5).toFixed(1)} m`,
        `${(stats.areaUnderCurve * 1.5).toFixed(1)} m`,
        `${(stats.areaUnderCurve * 2).toFixed(1)} m`
      ];
      solution = `The displacement equals the area under the velocity-time curve. The graph forms a trapezoid. Using the formula: Area = ½(b₁ + b₂)h = ½(${data[0].value.toFixed(1)} + ${data[data.length-1].value.toFixed(1)}) × ${stats.totalTime.toFixed(1)} = ${stats.areaUnderCurve.toFixed(1)} m`;
    } else if (questionFocus === 'slope' && graphType === 'velocity-time') {
      const acceleration = (data[10].value - data[0].value) / (data[10].time - data[0].time);
      question = `What is the acceleration of the object during the first 2 seconds?`;
      correctAnswer = `${acceleration.toFixed(2)} m/s²`;
      wrongAnswers = [
        `${(acceleration * 0.5).toFixed(2)} m/s²`,
        `${(acceleration * 1.5).toFixed(2)} m/s²`,
        `${(acceleration * 2).toFixed(2)} m/s²`
      ];
      solution = `The acceleration equals the slope of the velocity-time graph. Slope = Δv/Δt = (${data[10].value.toFixed(2)} - ${data[0].value.toFixed(2)}) / (${data[10].time.toFixed(2)} - ${data[0].time.toFixed(2)}) = ${acceleration.toFixed(2)} m/s²`;
    } else if (questionFocus === 'interpretation') {
      question = `Based on the ${graphType.replace('-', '-')} graph shown, which statement best describes the motion?`;
      if (graphType === 'velocity-time') {
        if (features.includes('Overall increase')) {
          correctAnswer = 'The object is accelerating in the positive direction';
          wrongAnswers = [
            'The object is moving at constant velocity',
            'The object is decelerating',
            'The object is at rest'
          ];
        } else {
          correctAnswer = 'The object is decelerating';
          wrongAnswers = [
            'The object is accelerating',
            'The object maintains constant velocity',
            'The object reverses direction'
          ];
        }
      }
      solution = `By analyzing the shape and trend of the graph, we can determine the motion characteristics. ${features.join('. ')}.`;
    } else {
      question = `The graph shows motion over ${stats.totalTime} seconds. What is the maximum ${graphType === 'velocity-time' ? 'velocity' : graphType === 'position-time' ? 'position' : 'acceleration'} reached?`;
      correctAnswer = `${stats.maxValue.toFixed(1)} ${graphType === 'velocity-time' ? 'm/s' : graphType === 'position-time' ? 'm' : 'm/s²'}`;
      wrongAnswers = [
        `${(stats.maxValue * 0.7).toFixed(1)} ${graphType === 'velocity-time' ? 'm/s' : 'm'}`,
        `${(stats.maxValue * 1.3).toFixed(1)} ${graphType === 'velocity-time' ? 'm/s' : 'm'}`,
        `${(stats.maxValue * 1.8).toFixed(1)} ${graphType === 'velocity-time' ? 'm/s' : 'm'}`
      ];
      solution = `The maximum value is the highest point on the graph, which occurs at ${stats.maxValue.toFixed(1)} ${graphType === 'velocity-time' ? 'm/s' : 'm'}.`;
    }

    const allOptions = [correctAnswer, ...wrongAnswers];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    const correctIndex = shuffled.indexOf(correctAnswer);

    const newQuestion: Question = {
      id: Date.now().toString(),
      graphType,
      question,
      options: shuffled,
      correctIndex,
      solution,
      graphData: data,
      stats,
      features
    };

    setCurrentQuestion(newQuestion);
    setRecentQuestions(prev => [newQuestion, ...prev.slice(0, 2)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/ap-physics')}
          className="flex items-center gap-2 text-teal-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Graph Question Generator</h1>
            <p className="text-teal-200">AI-powered dynamic graph problems for AP Physics</p>
          </div>
          <button
            onClick={generateQuestion}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-teal-500/30"
          >
            <Sparkles className="w-6 h-6" />
            Generate New Question
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-teal-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Generated Graph</h2>
                <div className="flex gap-3">
                  <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {currentQuestion ? (
                <>
                  <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={currentQuestion.graphData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                        <XAxis
                          dataKey="time"
                          stroke="#94a3b8"
                          label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                        />
                        <YAxis
                          stroke="#94a3b8"
                          label={{
                            value: currentQuestion.graphType === 'velocity-time' ? 'Velocity (m/s)' :
                                   currentQuestion.graphType === 'position-time' ? 'Position (m)' : 'Acceleration (m/s²)',
                            angle: -90,
                            position: 'insideLeft',
                            fill: '#94a3b8'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#14b8a6"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-cyan-500/30">
                      <p className="text-sm text-gray-400 mb-1">Max {currentQuestion.graphType === 'velocity-time' ? 'Velocity' : currentQuestion.graphType === 'position-time' ? 'Position' : 'Acceleration'}</p>
                      <p className="text-2xl font-bold text-cyan-400">{currentQuestion.stats.maxValue} {currentQuestion.graphType === 'velocity-time' ? 'm/s' : currentQuestion.graphType === 'position-time' ? 'm' : 'm/s²'}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-teal-500/30">
                      <p className="text-sm text-gray-400 mb-1">Total Time</p>
                      <p className="text-2xl font-bold text-teal-400">{currentQuestion.stats.totalTime} s</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-4 border border-green-500/30">
                      <p className="text-sm text-gray-400 mb-1">Area Under Curve</p>
                      <p className="text-2xl font-bold text-green-400">{currentQuestion.stats.areaUnderCurve} m</p>
                    </div>
                  </div>

                  {currentQuestion.features.length > 0 && (
                    <div className="bg-slate-900/30 rounded-xl p-4 border border-teal-500/20 mb-6">
                      <h3 className="text-sm font-semibold text-teal-300 mb-3">Key Features to Analyze:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {currentQuestion.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-slate-900/50 rounded-xl p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-teal-500 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-400">Click "Generate New Question" to create a graph-based problem</p>
                </div>
              )}
            </div>

            {currentQuestion && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-teal-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-teal-500 rounded-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Generated Question</h2>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2">QUESTION</p>
                  <p className="text-lg leading-relaxed">
                    {currentQuestion.question.split('What').map((part, idx) =>
                      idx === 0 ? part : <><span className="text-teal-400 font-semibold">What{part}</span></>
                    )}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-sm text-gray-400 mb-3">ANSWER CHOICES</p>
                  {currentQuestion.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl p-4 border-2 transition-all ${
                        idx === currentQuestion.correctIndex
                          ? 'bg-green-500/10 border-green-500/50'
                          : 'bg-slate-900/30 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            idx === currentQuestion.correctIndex
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-700 text-gray-300'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="text-lg">{option}</span>
                        </div>
                        {idx === currentQuestion.correctIndex && (
                          <span className="text-sm text-green-400 font-semibold">✓ Correct Answer</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                  <p className="text-sm font-semibold text-blue-300 mb-2">SOLUTION</p>
                  <p className="text-gray-200 leading-relaxed">{currentQuestion.solution}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-teal-500/20">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-teal-400" />
                <h3 className="text-xl font-bold">Graph Settings</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Graph Type</label>
                  <select
                    value={graphType}
                    onChange={(e) => setGraphType(e.target.value as GraphType)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="velocity-time">Velocity vs Time</option>
                    <option value="position-time">Position vs Time</option>
                    <option value="acceleration-time">Acceleration vs Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['level_1', 'level_2', 'level_3'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficultyLevel(level)}
                        className={`py-3 rounded-xl font-semibold transition-all ${
                          difficultyLevel === level
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        Level {level.replace('level_', '')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Question Focus</label>
                  <div className="space-y-2">
                    {(['area', 'slope', 'intercept', 'comparison', 'interpretation'] as QuestionFocus[]).map((focus) => (
                      <button
                        key={focus}
                        onClick={() => setQuestionFocus(focus)}
                        className={`w-full py-3 rounded-xl font-medium capitalize transition-all text-left px-4 ${
                          questionFocus === focus
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        {focus === 'area' && 'Area Under Curve'}
                        {focus === 'slope' && 'Slope Analysis'}
                        {focus === 'intercept' && 'Intercept Values'}
                        {focus === 'comparison' && 'Graph Comparison'}
                        {focus === 'interpretation' && 'Motion Interpretation'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-teal-500/20">
              <h3 className="text-xl font-bold mb-4">Generation Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-700">
                  <span className="text-gray-400">Questions Generated</span>
                  <span className="text-2xl font-bold text-teal-400">{recentQuestions.length}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-700">
                  <span className="text-gray-400">Graph Types Used</span>
                  <span className="text-2xl font-bold text-teal-400">
                    {new Set(recentQuestions.map(q => q.graphType)).size}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400">Avg. Difficulty</span>
                  <span className="text-lg font-bold text-purple-400 capitalize">{difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

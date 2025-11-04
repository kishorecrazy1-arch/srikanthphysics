import { useState } from 'react';
import { TrendingUp, TrendingDown, Download, Target, Zap, Clock, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const weeklyData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 68 },
  { day: 'Thu', score: 78 },
  { day: 'Fri', score: 85 },
  { day: 'Sat', score: 82 },
  { day: 'Sun', score: 88 }
];

const topicData = [
  { topic: 'Kinematics', score: 85, color: '#10b981' },
  { topic: 'Forces', score: 78, color: '#3b82f6' },
  { topic: 'Energy', score: 72, color: '#f59e0b' },
  { topic: 'Momentum', score: 68, color: '#f97316' },
  { topic: 'Rotation', score: 55, color: '#ef4444' }
];

const skillsData = [
  { skill: 'Speed', value: 85 },
  { skill: 'Accuracy', value: 73 },
  { skill: 'Conceptual', value: 68 },
  { skill: 'Problem Solving', value: 75 },
  { skill: 'FRQs', value: 70 }
];

const questionDistribution = [
  { name: 'MCQ', value: 65, color: '#3b82f6' },
  { name: 'FRQ', value: 25, color: '#8b5cf6' },
  { name: 'Graph', value: 10, color: '#14b8a6' }
];

export function Analytics() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('7days');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/ap-physics')}
          className="flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Performance Analytics</h1>
            <p className="text-blue-200">Detailed insights into your AP Physics journey</p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-colors">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                +12%
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">73%</div>
            <div className="text-sm text-gray-400">Overall Score</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-green-400 text-sm font-semibold">+23</div>
            </div>
            <div className="text-3xl font-bold mb-1">847</div>
            <div className="text-sm text-gray-400">Questions Solved</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-green-400 text-sm font-semibold">+3.2h</div>
            </div>
            <div className="text-3xl font-bold mb-1">42.5h</div>
            <div className="text-sm text-gray-400">Study Time</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                <TrendingDown className="w-4 h-4" />
                -5s
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">2:15</div>
            <div className="text-sm text-gray-400">Avg Time/Question</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Weekly Performance</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Weekly Avg:</span>
                    <span className="text-blue-400 font-bold">76.9%</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    +12% improvement
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px'
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
              <h2 className="text-2xl font-bold mb-6">Topic Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topicData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="topic" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
              <h2 className="text-2xl font-bold mb-6">Detailed Topic Analysis</h2>
              <div className="space-y-4">
                {topicData.map((topic) => (
                  <div key={topic.topic} className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{topic.topic}</h3>
                        <p className="text-sm text-gray-400">124 questions attempted</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold" style={{ color: topic.color }}>
                          {topic.score}%
                        </div>
                        <div className="flex items-center gap-1 text-sm mt-1">
                          {topic.score >= 80 ? (
                            <><TrendingUp className="w-4 h-4 text-green-400" /><span className="text-green-400">Strong</span></>
                          ) : topic.score >= 70 ? (
                            <span className="text-yellow-400">Good</span>
                          ) : (
                            <><TrendingDown className="w-4 h-4 text-red-400" /><span className="text-red-400">Needs Work</span></>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">Weak</span>
                        <span className="text-sm text-gray-400">Inclined planes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">Strong</span>
                        <span className="text-sm text-gray-400">Free body diagrams</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${topic.score}%`, backgroundColor: topic.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
              <h2 className="text-2xl font-bold mb-6">Skills Radar</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                  <PolarAngleAxis dataKey="skill" stroke="#94a3b8" />
                  <PolarRadiusAxis stroke="#94a3b8" />
                  <Radar name="Skills" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <div className="text-3xl font-bold text-purple-400">74.2%</div>
                <div className="text-sm text-gray-400">Overall Skills Rating</div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
              <h2 className="text-2xl font-bold mb-6">Question Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={questionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {questionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {questionDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
              <h3 className="text-lg font-bold mb-4 text-green-300">Strengths</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span className="text-gray-200">Strong performance in MCQ questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span className="text-gray-200">Fast problem-solving speed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">•</span>
                  <span className="text-gray-200">Consistent daily practice</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
              <h3 className="text-lg font-bold mb-4 text-red-300">Areas to Improve</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span className="text-gray-200">Rotational motion concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span className="text-gray-200">Complex FRQ problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span className="text-gray-200">Graph interpretation speed</span>
                </li>
              </ul>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/30">
              Generate Practice Plan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
            <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">1:45</div>
            <div className="text-sm text-gray-400 mb-2">Fastest Topic</div>
            <div className="text-xs text-blue-400">Kinematics</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20 text-center">
            <Clock className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">3:20</div>
            <div className="text-sm text-gray-400 mb-2">Slowest Topic</div>
            <div className="text-xs text-orange-400">Rotation</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 text-center">
            <TrendingDown className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">8.5 min</div>
            <div className="text-sm text-gray-400 mb-2">Time Wasted</div>
            <div className="text-xs text-red-400">On wrong answers</div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">76%</div>
            <div className="text-sm text-gray-400 mb-2">Efficiency</div>
            <div className="text-xs text-green-400">Overall rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}

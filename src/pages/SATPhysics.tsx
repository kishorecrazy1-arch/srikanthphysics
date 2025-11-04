import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Users, Globe, CheckCircle, Download, Play, BarChart3, Brain, Zap, Flame, Star, ExternalLink, Lightbulb, Target, Clock, Calculator, Rocket, Beaker, Cpu } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export default function SATPhysics() {
  const navigate = useNavigate();
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);

  const stats = [
    { label: 'Average Score', value: '650/800', icon: <TrendingUp />, color: 'text-blue-500' },
    { label: '700+ Achievers', value: '35%', icon: <Star />, color: 'text-yellow-500' },
    { label: 'Test Duration', value: '60 min', icon: <Clock />, color: 'text-purple-500' },
    { label: 'Total Questions', value: '75 MCQs', icon: <Calculator />, color: 'text-green-500' }
  ];

  const examPattern = [
    {
      section: 'Mechanics',
      questions: '36-42',
      percentage: '48-56%',
      color: 'bg-blue-500',
      topics: ['Kinematics', 'Dynamics', 'Energy & Momentum', 'Circular Motion', 'Simple Harmonic Motion']
    },
    {
      section: 'E&M',
      questions: '18-24',
      percentage: '24-32%',
      color: 'bg-purple-500',
      topics: ['Electric Fields', 'Circuits', 'Magnetism', 'Electromagnetic Induction']
    },
    {
      section: 'Waves & Modern',
      questions: '15-21',
      percentage: '20-28%',
      color: 'bg-teal-500',
      topics: ['Waves', 'Optics', 'Thermal Physics', 'Modern Physics', 'Atomic & Nuclear']
    }
  ];

  const syllabusData: Record<string, {
    color: string;
    icon: JSX.Element;
    iconBg: string;
    mainTopics: Array<{ name: string; icon: string }>;
    subtopics: Record<string, string[]>;
  }> = {
    'Mechanics': {
      color: 'from-blue-500 to-cyan-400',
      icon: <Rocket className="w-8 h-8" />,
      iconBg: 'bg-blue-500',
      mainTopics: [
        { name: 'Kinematics', icon: '📐' },
        { name: 'Dynamics', icon: '💪' },
        { name: 'Energy & Work', icon: '⚡' },
        { name: 'Momentum', icon: '🎯' },
        { name: 'Circular Motion', icon: '🔄' },
        { name: 'Gravitation', icon: '🌍' },
        { name: 'SHM', icon: '〰️' }
      ],
      subtopics: {
        'Kinematics': ['Vectors', 'Displacement & velocity', 'Acceleration', 'Free fall', 'Projectile motion'],
        'Dynamics': ['Newton\'s laws', 'Force diagrams', 'Friction', 'Tension', 'Normal force'],
        'Energy & Work': ['Kinetic energy', 'Potential energy', 'Work-energy theorem', 'Power', 'Conservation'],
        'Momentum': ['Linear momentum', 'Impulse', 'Collisions', 'Conservation of momentum'],
        'Circular Motion': ['Centripetal force', 'Centripetal acceleration', 'Banking', 'Satellites'],
        'Gravitation': ['Universal gravitation', 'Gravitational field', 'Orbital motion', 'Kepler\'s laws'],
        'SHM': ['Simple pendulum', 'Mass-spring system', 'Period & frequency', 'Energy in SHM']
      }
    },
    'Electricity & Magnetism': {
      color: 'from-purple-500 to-pink-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-purple-500',
      mainTopics: [
        { name: 'Electrostatics', icon: '⚡' },
        { name: 'Circuits', icon: '🔌' },
        { name: 'Magnetism', icon: '🧲' },
        { name: 'Induction', icon: '🔄' }
      ],
      subtopics: {
        'Electrostatics': ['Coulomb\'s law', 'Electric field', 'Electric potential', 'Capacitors'],
        'Circuits': ['Ohm\'s law', 'Series & parallel', 'Kirchhoff\'s laws', 'Power in circuits'],
        'Magnetism': ['Magnetic fields', 'Force on moving charges', 'Force on currents', 'Torque on loops'],
        'Induction': ['Faraday\'s law', 'Lenz\'s law', 'Induced EMF', 'Transformers']
      }
    },
    'Waves & Optics': {
      color: 'from-teal-500 to-cyan-500',
      icon: <Target className="w-8 h-8" />,
      iconBg: 'bg-teal-500',
      mainTopics: [
        { name: 'Wave Properties', icon: '〰️' },
        { name: 'Sound', icon: '🔊' },
        { name: 'Light & Optics', icon: '💡' },
        { name: 'Modern Physics', icon: '⚛️' }
      ],
      subtopics: {
        'Wave Properties': ['Wave equation', 'Interference', 'Diffraction', 'Standing waves'],
        'Sound': ['Speed of sound', 'Doppler effect', 'Resonance', 'Beats'],
        'Light & Optics': ['Reflection', 'Refraction', 'Lenses', 'Mirrors', 'Ray diagrams'],
        'Modern Physics': ['Photoelectric effect', 'Matter waves', 'Atomic models', 'Nuclear physics']
      }
    }
  };

  const tools = [
    { name: 'SAT Formula Quick Sheet', icon: <Calculator className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600', desc: 'Essential formulas for all topics' },
    { name: 'Concept Reasoning Trainer', icon: <Brain className="w-6 h-6" />, color: 'from-purple-500 to-pink-600', desc: 'Practice conceptual MCQs' },
    { name: '60-Minute Mock Tests', icon: <Clock className="w-6 h-6" />, color: 'from-orange-500 to-red-600', desc: 'Full-length timed practice' },
    { name: 'Trick Question Analyzer', icon: <Target className="w-6 h-6" />, color: 'from-teal-500 to-cyan-600', desc: 'Identify and avoid traps' },
    { name: 'Calculator Strategy Guide', icon: <Cpu className="w-6 h-6" />, color: 'from-green-500 to-emerald-600', desc: 'Optimize calculator usage' },
    { name: 'Score Predictor', icon: <TrendingUp className="w-6 h-6" />, color: 'from-yellow-500 to-orange-600', desc: 'Estimate your SAT score' }
  ];

  const toggleSubtopic = (topic: string) => {
    setExpandedSubtopic(expandedSubtopic === topic ? null : topic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-emerald-900 to-slate-900 text-white">
      <CourseNavigation />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-green-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
              <Award className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300">College Board SAT Subject Test</span>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              SAT Physics
            </h1>
            <p className="text-xl text-slate-300">Subject Test (Legacy - Still Valuable for Practice)</p>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Master conceptual physics reasoning for college admissions
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300">Calculator Allowed</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300">60 Minutes</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl border border-teal-500/30">
                <Target className="w-5 h-5 text-teal-400" />
                <span className="text-teal-300">75 MCQ Questions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-6">
                <div className={`${stat.color}`}>
                  {stat.icon && <div className="w-12 h-12">{stat.icon}</div>}
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-slate-400 text-lg">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-400" />
            About SAT Physics
          </h2>
          <div className="space-y-4 text-lg text-slate-300">
            <p>
              The SAT Physics Subject Test measures your understanding of fundamental physics concepts and your ability to
              <span className="text-blue-400 font-semibold"> apply scientific reasoning</span> to solve problems.
            </p>
            <p>
              Though discontinued in 2021, SAT Physics-style questions remain excellent preparation for
              <span className="text-purple-400 font-semibold"> AP Physics</span>,
              <span className="text-teal-400 font-semibold"> college placement</span>, and competitive exams.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {[
                'Emphasizes conceptual understanding over memorization',
                'Tests real-world application of physics principles',
                'Excellent preparation for AP Physics 1 & 2',
                'Builds strong analytical and problem-solving skills'
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
          Test Structure & Content Distribution
        </h2>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 border-2 border-slate-700/50 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examPattern.map((section, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 ${section.color} rounded-2xl flex items-center justify-center shadow-xl mb-6`}>
                  <Calculator className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold mb-2">{section.section}</h3>

                <div className="w-full space-y-3 mt-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="text-sm text-slate-400 mb-1">Questions</div>
                    <div className="text-3xl font-bold text-white">{section.questions}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="text-sm text-slate-400 mb-1">Percentage</div>
                    <div className="text-2xl font-bold text-green-400">{section.percentage}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-left">
                    <div className="text-sm text-slate-400 mb-2">Topics</div>
                    <div className="space-y-1">
                      {section.topics.map((topic, idx) => (
                        <div key={idx} className="text-xs text-slate-300">• {topic}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
            Complete SAT Physics Syllabus
          </h2>
          <p className="text-slate-400 text-lg">Click topics to explore detailed concepts</p>
        </div>

        <div className="space-y-8">
          {Object.entries(syllabusData).map(([topicName, data], topicIndex) => (
            <div key={topicIndex} className="relative">
              <div className={`relative rounded-3xl border-4 border-transparent bg-gradient-to-r ${data.color} p-1`}>
                <div className="bg-slate-900 rounded-2xl p-8">
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`w-16 h-16 ${data.iconBg} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
                      {data.icon}
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 font-semibold">SECTION {topicIndex + 1}</div>
                      <h3 className="text-3xl font-bold">{topicName}</h3>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="overflow-x-auto pb-4">
                      <div className="flex gap-4 min-w-max pb-4">
                        {data.mainTopics.map((topic, index) => (
                          <div key={index} className="flex-shrink-0">
                            <button
                              onClick={() => toggleSubtopic(`${topicIndex}-${index}`)}
                              className="group relative"
                            >
                              <div className={`px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all ${
                                expandedSubtopic === `${topicIndex}-${index}`
                                  ? `bg-gradient-to-r ${data.color} shadow-xl scale-105`
                                  : 'bg-slate-800 hover:bg-slate-700'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{topic.icon}</span>
                                  <span>{topic.name}</span>
                                </div>
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`h-1 rounded-full bg-gradient-to-r ${data.color} mx-8`} />
                  </div>

                  {data.mainTopics.map((topic, index) => (
                    expandedSubtopic === `${topicIndex}-${index}` && (
                      <div key={`detail-${index}`} className="mt-8 animate-in fade-in duration-300">
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                          <h4 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <span className="text-3xl">{topic.icon}</span>
                            {topic.name}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.subtopics[topic.name].map((concept, conceptIndex) => (
                              <div
                                key={conceptIndex}
                                className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all"
                              >
                                <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                <span className="text-slate-300">{concept}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-4">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Exclusive to Srikanth's Academy</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
            SAT Physics Prep Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div key={index} className={`bg-gradient-to-br ${tool.color} rounded-2xl p-6 hover:scale-105 transition-transform cursor-pointer`}>
              <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                {tool.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{tool.name}</h3>
              <p className="text-white/80">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Master SAT Physics?</h2>
          <p className="text-xl text-blue-100 mb-8">Build strong conceptual foundations for college success</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/ap-physics')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Learning Now
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Study Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

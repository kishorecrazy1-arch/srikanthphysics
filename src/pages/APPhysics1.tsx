import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Star, Users, BookOpen, TrendingUp, CheckCircle, Target, Award, Download, Play, Clock, Activity, GraduationCap, Brain, Calendar, Lightbulb, Waves } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function APPhysics1() {
  const navigate = useNavigate();
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);

  const stats = [
    { label: 'Score Perfect 5', value: '5/5', icon: <Star />, color: 'text-yellow-500' },
    { label: 'College Credit', value: '$2,000+', icon: <Award />, color: 'text-green-500' },
    { label: 'Students Enrolled', value: '8K+', icon: <Users />, color: 'text-blue-500' },
    { label: 'Success Rate', value: '93%', icon: <TrendingUp />, color: 'text-purple-500' }
  ];

  const syllabusData: Record<string, {
    color: string;
    icon: JSX.Element;
    iconBg: string;
    mainTopics: Array<{ name: string; icon: string }>;
    subtopics: Record<string, string[]>;
  }> = {
    'Kinematics': {
      color: 'from-blue-500 to-cyan-400',
      icon: <Activity className="w-8 h-8" />,
      iconBg: 'bg-blue-500',
      mainTopics: [
        { name: '1D Motion', icon: '📏' },
        { name: '2D Motion', icon: '🎯' },
        { name: 'Projectile Motion', icon: '🏀' },
        { name: 'Graphs', icon: '📊' }
      ],
      subtopics: {
        '1D Motion': ['Position & displacement', 'Velocity & speed', 'Acceleration', 'Kinematic equations'],
        '2D Motion': ['Vector components', 'Relative motion', 'Vector addition', 'Projectile setup'],
        'Projectile Motion': ['Horizontal motion', 'Vertical motion', 'Range calculations', 'Maximum height'],
        'Graphs': ['Position-time graphs', 'Velocity-time graphs', 'Acceleration-time graphs', 'Area under curves']
      }
    },
    'Dynamics': {
      color: 'from-purple-500 to-pink-500',
      icon: <Target className="w-8 h-8" />,
      iconBg: 'bg-purple-500',
      mainTopics: [
        { name: 'Newton\'s Laws', icon: '⚖️' },
        { name: 'Forces', icon: '💪' },
        { name: 'Friction', icon: '🔥' },
        { name: 'Applications', icon: '🚀' }
      ],
      subtopics: {
        'Newton\'s Laws': ['First law (inertia)', 'Second law (F=ma)', 'Third law (action-reaction)', 'Free body diagrams'],
        'Forces': ['Normal force', 'Tension', 'Spring force', 'Weight'],
        'Friction': ['Static friction', 'Kinetic friction', 'Coefficient of friction', 'Inclined planes'],
        'Applications': ['Atwood machines', 'Connected objects', 'Pulley systems', 'Net force problems']
      }
    },
    'Circular Motion & Gravitation': {
      color: 'from-cyan-500 to-teal-500',
      icon: <Activity className="w-8 h-8" />,
      iconBg: 'bg-cyan-500',
      mainTopics: [
        { name: 'Circular Motion', icon: '🔄' },
        { name: 'Centripetal Force', icon: '⭕' },
        { name: 'Gravitation', icon: '🌍' },
        { name: 'Orbits', icon: '🛸' }
      ],
      subtopics: {
        'Circular Motion': ['Angular velocity', 'Period & frequency', 'Tangential velocity', 'Uniform circular motion'],
        'Centripetal Force': ['Centripetal acceleration', 'Force equations', 'Banking', 'Vertical circles'],
        'Gravitation': ['Newton\'s law of gravitation', 'Gravitational field', 'g vs G', 'Weight variations'],
        'Orbits': ['Orbital velocity', 'Escape velocity', 'Kepler\'s laws', 'Satellite motion']
      }
    },
    'Energy': {
      color: 'from-green-500 to-emerald-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-green-500',
      mainTopics: [
        { name: 'Work', icon: '⚡' },
        { name: 'Energy Forms', icon: '🔋' },
        { name: 'Power', icon: '💡' },
        { name: 'Conservation', icon: '♻️' }
      ],
      subtopics: {
        'Work': ['Work definition', 'Work-energy theorem', 'Dot product', 'Variable forces'],
        'Energy Forms': ['Kinetic energy', 'Gravitational PE', 'Elastic PE', 'Internal energy'],
        'Power': ['Power definition', 'Average vs instantaneous', 'Efficiency', 'Power in circuits'],
        'Conservation': ['Conservation of energy', 'Energy transformations', 'Non-conservative forces', 'Problem solving']
      }
    },
    'Momentum': {
      color: 'from-orange-500 to-red-500',
      icon: <Target className="w-8 h-8" />,
      iconBg: 'bg-orange-500',
      mainTopics: [
        { name: 'Linear Momentum', icon: '➡️' },
        { name: 'Collisions', icon: '💥' },
        { name: 'Impulse', icon: '⚡' },
        { name: 'Center of Mass', icon: '🎯' }
      ],
      subtopics: {
        'Linear Momentum': ['Momentum definition', 'Conservation of momentum', 'Momentum problems', 'System momentum'],
        'Collisions': ['Elastic collisions', 'Inelastic collisions', '2D collisions', 'Coefficient of restitution'],
        'Impulse': ['Impulse-momentum theorem', 'Force-time graphs', 'Average force', 'Impact problems'],
        'Center of Mass': ['CM definition', 'CM calculations', 'CM motion', 'System problems']
      }
    },
    'Rotation': {
      color: 'from-yellow-500 to-orange-500',
      icon: <Activity className="w-8 h-8" />,
      iconBg: 'bg-yellow-500',
      mainTopics: [
        { name: 'Rotational Kinematics', icon: '🔄' },
        { name: 'Rotational Dynamics', icon: '⚙️' },
        { name: 'Angular Momentum', icon: '🌀' },
        { name: 'Rolling Motion', icon: '⚽' }
      ],
      subtopics: {
        'Rotational Kinematics': ['Angular displacement', 'Angular velocity', 'Angular acceleration', 'Rotational equations'],
        'Rotational Dynamics': ['Torque', 'Moment of inertia', 'Rotational Newton\'s 2nd', 'Equilibrium'],
        'Angular Momentum': ['Angular momentum', 'Conservation', 'L = Iω', 'Torque & angular momentum'],
        'Rolling Motion': ['Rolling without slipping', 'Rolling down inclines', 'Energy in rolling', 'Mixed problems']
      }
    },
    'Simple Harmonic Motion': {
      color: 'from-pink-500 to-purple-500',
      icon: <Waves className="w-8 h-8" />,
      iconBg: 'bg-pink-500',
      mainTopics: [
        { name: 'Oscillations', icon: '〰️' },
        { name: 'Springs', icon: '🔗' },
        { name: 'Pendulums', icon: '⏱️' },
        { name: 'Energy', icon: '⚡' }
      ],
      subtopics: {
        'Oscillations': ['SHM definition', 'Amplitude & period', 'Frequency', 'Phase'],
        'Springs': ['Hooke\'s law', 'Spring constant', 'Period formula', 'Vertical springs'],
        'Pendulums': ['Simple pendulum', 'Period formula', 'Physical pendulum', 'Small angle approximation'],
        'Energy': ['KE & PE in SHM', 'Energy conservation', 'Maximum values', 'Graphs']
      }
    },
    'Electricity & Circuits': {
      color: 'from-indigo-500 to-blue-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-indigo-500',
      mainTopics: [
        { name: 'Electric Charge', icon: '⚡' },
        { name: 'Electric Circuits', icon: '🔌' },
        { name: 'Resistance', icon: '🔋' },
        { name: 'Power', icon: '💡' }
      ],
      subtopics: {
        'Electric Charge': ['Charge properties', 'Conservation of charge', 'Charging methods', 'Conductors & insulators'],
        'Electric Circuits': ['Current', 'Voltage', 'Series circuits', 'Parallel circuits'],
        'Resistance': ['Ohm\'s law', 'Resistivity', 'Equivalent resistance', 'Internal resistance'],
        'Power': ['Electric power', 'Energy dissipation', 'Power formulas', 'Efficiency']
      }
    }
  };

  const toggleSubtopic = (topic: string) => {
    setExpandedSubtopic(expandedSubtopic === topic ? null : topic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
      <CourseNavigation />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-orange-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">College Board Advanced Placement</span>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              AP Physics 1
            </h1>
            <p className="text-xl text-slate-300">Algebra-Based Mechanics & Waves</p>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Build a strong foundation in mechanics, energy, and waves
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                <Award className="w-5 h-5 text-green-400" />
                <span className="text-green-300">Earn College Credit</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300">Perfect 5/5 Score</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300">Grades 9-12</span>
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

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Complete AP Physics 1 Syllabus
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
                      <div className="text-sm text-slate-400 font-semibold">UNIT {topicIndex + 1}</div>
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
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Master AP Physics 1?</h2>
          <p className="text-xl text-blue-100 mb-8">Start your journey to a perfect 5 and earn college credit</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                localStorage.setItem('selectedCourse', 'ap-physics');
                navigate('/signup');
              }}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Learning Now
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Syllabus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

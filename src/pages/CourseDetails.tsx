import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Zap, Star, Users, BookOpen, TrendingUp, CheckCircle, Target, Award, Download, Play, Clock, Activity, GraduationCap, Brain, Atom, Calendar, Lightbulb, Gauge, Magnet, Waves } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function CourseDetails() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);

  if (courseId === 'igcse') {
    navigate('/course/igcse');
    return null;
  }

  if (courseId !== 'ap-physics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
        <CourseNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Course Coming Soon</h1>
          <p className="text-xl text-slate-300 mb-8">
            This course is currently under development. Check back soon!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Score Perfect 5', value: '5/5', icon: <Star />, color: 'text-yellow-500' },
    { label: 'College Credit', value: '$2,000+', icon: <Award />, color: 'text-green-500' },
    { label: 'Students Enrolled', value: '10K+', icon: <Users />, color: 'text-blue-500' },
    { label: 'Success Rate', value: '95%', icon: <TrendingUp />, color: 'text-purple-500' }
  ];

  const examPattern = [
    {
      section: 'Section 1',
      subtitle: 'Multiple Choice',
      marks: '40 Questions',
      duration: '80 min',
      weight: '50%',
      iconBg: 'bg-blue-500'
    },
    {
      section: 'Section 2',
      subtitle: 'Free Response',
      marks: '4 Questions',
      duration: '1 hr 40 min',
      weight: '50%',
      iconBg: 'bg-purple-500'
    }
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

  const tools = [
    { name: 'FRQ Practice Engine', icon: <BookOpen className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600', desc: 'Master free response with step-by-step solutions' },
    { name: 'MCQ Drill Master', icon: <Target className="w-6 h-6" />, color: 'from-purple-500 to-pink-600', desc: 'Practice 1000+ AP-style multiple choice questions' },
    { name: 'Formula Sheet Pro', icon: <Brain className="w-6 h-6" />, color: 'from-orange-500 to-red-600', desc: 'All equations organized by topic' },
    { name: 'Graph Generator', icon: <TrendingUp className="w-6 h-6" />, color: 'from-teal-500 to-cyan-600', desc: 'Create & analyze physics graphs instantly' },
    { name: 'Mock Test Simulator', icon: <Clock className="w-6 h-6" />, color: 'from-green-500 to-emerald-600', desc: 'Full 3-hour AP exam simulations' },
    { name: 'Progress Tracker', icon: <Award className="w-6 h-6" />, color: 'from-yellow-500 to-orange-600', desc: 'Track your journey to a 5' }
  ];

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

            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              AP Physics
            </h1>
            <p className="text-xl text-slate-300">(AP Physics 1 & 2)</p>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Master physics conceptually & earn college credit with a perfect 5
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                <Award className="w-5 h-5 text-green-400" />
                <span className="text-green-300">College Credit Worth $2,000+</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300">Top Score: 5/5</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300">Grades 9-12</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300">98% Success Rate</span>
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
            About AP Physics
          </h2>
          <div className="space-y-4 text-lg text-slate-300">
            <p>
              AP Physics 1 & 2 are
              <span className="text-blue-400 font-semibold"> algebra-based college-level physics courses</span> designed to develop strong conceptual understanding, analytical skills, and problem-solving abilities required for STEM majors such as Engineering, Medicine, Computer Science, and Research.
            </p>
            <p>
              Scoring a 5 on the AP Physics exam can
              <span className="text-purple-400 font-semibold"> earn you college credit worth thousands of dollars</span> and demonstrate your readiness for advanced studies to top universities worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {[
                'Earn college credit & save tuition costs',
                'Boost your college application profile',
                'Master physics with conceptual clarity',
                'Perfect preparation for SAT Physics & college'
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            Who Should Take AP Physics?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            {[
              'Grade 9, 10, 11, 12 students',
              'Students aiming for US, Canada & International university admissions',
              'Students with strong interest in Physics and STEM',
              'CBSE/ICSE/IGCSE and other students preparing for SAT/ACT + AP exams',
              'Future engineers, doctors, and scientists',
              'Students looking to earn college credit in high school'
            ].map((point, index) => (
              <div key={index} className="flex items-start gap-3 bg-slate-800/30 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
          Exam Pattern & Structure
        </h2>
        <p className="text-center text-slate-400 text-lg mb-12">Each AP Physics exam follows this format</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {examPattern.map((paper, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 ${paper.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                  <BookOpen className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-4xl font-bold text-gray-900 mb-2">{paper.section}</h3>
                <p className="text-xl text-blue-600 mb-8">{paper.subtitle}</p>

                <div className="w-full space-y-6">
                  <div>
                    <div className="text-gray-600 mb-2">Questions</div>
                    <div className="text-5xl font-bold text-gray-900">{paper.marks}</div>
                  </div>

                  <div>
                    <div className="text-gray-600 mb-2">Duration</div>
                    <div className="text-3xl font-bold text-blue-600">{paper.duration}</div>
                  </div>

                  <div>
                    <div className="text-gray-600 mb-2">Weightage</div>
                    <div className="text-3xl font-bold text-green-600">{paper.weight}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm text-center">
          <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
            <Calendar className="w-7 h-7 text-orange-400" />
            Total Duration: 3 Hours
          </h3>
          <p className="text-slate-300 text-lg">
            The exam tests both your problem-solving skills (MCQs) and your ability to explain physics concepts (FRQs)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
            Complete AP Physics Syllabus
          </h2>
          <p className="text-slate-400 text-lg">Click topics to explore detailed concepts for AP Physics 1</p>
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-4">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Exclusive to Srikanth's Academy</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
            AP Physics Prep Tools
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
          <h2 className="text-4xl font-bold mb-4">Ready to Score a Perfect 5?</h2>
          <p className="text-xl text-blue-100 mb-8">Start your journey to AP Physics mastery and earn college credit</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5" />
              Start Free Demo
            </button>
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2"
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Star, Users, BookOpen, TrendingUp, CheckCircle, Target, Award, Download, Play, Clock, Activity, GraduationCap, Brain, Atom, Calendar, Lightbulb, Gauge, Magnet, Waves, ArrowLeft } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function APPhysicsMechanics() {
  const navigate = useNavigate();
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);

  const examPattern = [
    {
      section: 'Section 1',
      subtitle: 'Multiple Choice',
      marks: '35 Questions',
      duration: '45 min',
      weight: '50%',
      iconBg: 'bg-blue-500'
    },
    {
      section: 'Section 2',
      subtitle: 'Free Response',
      marks: '3 Questions',
      duration: '45 min',
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
        { name: 'Graphs', icon: '📈' },
        { name: 'Velocity & Acceleration', icon: '⏱️' },
        { name: 'Projectile Motion', icon: '🏹' },
        { name: 'Calculus of Motion', icon: '🧮' }
      ],
      subtopics: {
        '1D Motion': ['Position, velocity, acceleration', 'Derivatives and integrals', 'Constant acceleration', 'Variable acceleration'],
        '2D Motion': ['Vector calculus', 'Parametric equations', 'Relative motion', 'Vector derivatives'],
        'Graphs': ['Position-time graphs', 'Velocity-time graphs', 'Acceleration-time graphs', 'Area under curves'],
        'Velocity & Acceleration': ['Instantaneous velocity', 'Average velocity', 'Instantaneous acceleration', 'Average acceleration'],
        'Projectile Motion': ['Calculus-based analysis', 'Trajectory equations', 'Range and height', 'Time of flight'],
        'Calculus of Motion': ['Derivatives in motion', 'Integrals for displacement', 'Fundamental theorem', 'Differential equations']
      }
    },
    'Forces & Newton\'s Laws of Motion': {
      color: 'from-purple-500 to-pink-500',
      icon: <Target className="w-8 h-8" />,
      iconBg: 'bg-purple-500',
      mainTopics: [
        { name: 'Newton\'s First, Second & Third Laws', icon: '⚖️' },
        { name: 'Free-Body Diagrams', icon: '📘' },
        { name: 'Dynamics Applications', icon: '💡' },
        { name: 'Gravitation', icon: '🌍' },
        { name: 'Circular Motion', icon: '🔄' },
        { name: 'Force Analysis', icon: '💪' }
      ],
      subtopics: {
        'Newton\'s First, Second & Third Laws': ['First law (inertia)', 'Second law (F = ma)', 'Third law (action-reaction)', 'Applications'],
        'Free-Body Diagrams': ['Drawing FBDs', 'Force identification', 'Coordinate systems', 'Force resolution'],
        'Dynamics Applications': ['Atwood machines', 'Pulleys and ropes', 'Inclined planes', 'Connected systems'],
        'Gravitation': ['Newton\'s law of gravitation', 'Gravitational field', 'Gravitational potential', 'Orbital motion'],
        'Circular Motion': ['Centripetal force', 'Uniform circular motion', 'Banking', 'Vertical circles'],
        'Force Analysis': ['Net force calculations', 'Force components', 'Equilibrium', 'System analysis']
      }
    },
    'Work, Energy & Power': {
      color: 'from-green-500 to-emerald-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-green-500',
      mainTopics: [
        { name: 'Work', icon: '⚡' },
        { name: 'Kinetic Energy', icon: '🔋' },
        { name: 'Potential Energy', icon: '🌄' },
        { name: 'Conservation of Energy', icon: '♻️' },
        { name: 'Work-Energy Theorem', icon: '🧭' },
        { name: 'Power', icon: '⚙️' }
      ],
      subtopics: {
        'Work': ['Work integral W = ∫F·ds', 'Variable forces', 'Path dependence', 'Conservative forces'],
        'Kinetic Energy': ['KE = ½mv²', 'Kinetic energy calculations', 'Work-energy theorem', 'KE in systems'],
        'Potential Energy': ['Gravitational PE', 'Elastic PE', 'Potential energy functions', 'PE calculations'],
        'Conservation of Energy': ['Energy conservation', 'Energy transformations', 'Non-conservative forces', 'Energy graphs'],
        'Work-Energy Theorem': ['W = ΔKE', 'Applications', 'Variable forces', 'Problem solving'],
        'Power': ['P = dW/dt', 'Instantaneous power', 'Average power', 'Power in systems']
      }
    },
    'Linear Momentum & Systems of Particles': {
      color: 'from-orange-500 to-red-500',
      icon: <Target className="w-8 h-8" />,
      iconBg: 'bg-orange-500',
      mainTopics: [
        { name: 'Linear Momentum', icon: '🚀' },
        { name: 'Impulse', icon: '💥' },
        { name: 'Elastic & Inelastic Collisions', icon: '🎯' },
        { name: 'Momentum Conservation', icon: '♻️' },
        { name: 'Center of Mass', icon: '⚖️' },
        { name: 'System Motion', icon: '📉' }
      ],
      subtopics: {
        'Linear Momentum': ['p = mv', 'Momentum calculations', 'Momentum vectors', 'System momentum'],
        'Impulse': ['Impulse-momentum theorem', 'J = ∫F dt', 'Force-time graphs', 'Average force'],
        'Elastic & Inelastic Collisions': ['Elastic collisions', 'Inelastic collisions', '2D collisions', 'Coefficient of restitution'],
        'Momentum Conservation': ['Conservation law', 'Isolated systems', 'Momentum problems', 'Applications'],
        'Center of Mass': ['CM definition', 'CM calculations', 'CM motion', 'CM acceleration'],
        'System Motion': ['System analysis', 'CM frame', 'Relative motion', 'Multi-particle systems']
      }
    },
    'Torque & Rotational Dynamics': {
      color: 'from-red-500 to-pink-500',
      icon: <Activity className="w-8 h-8" />,
      iconBg: 'bg-red-500',
      mainTopics: [
        { name: 'Torque', icon: '🔄' },
        { name: 'Rotational Kinematics', icon: '🧭' },
        { name: 'Rotational Dynamics', icon: '⚙️' },
        { name: 'Moment of Inertia', icon: '📐' },
        { name: 'Angular Acceleration', icon: '♻️' },
        { name: 'Rotational Equilibrium', icon: '⚖️' }
      ],
      subtopics: {
        'Torque': ['τ = r × F', 'Torque calculations', 'Lever arm', 'Torque vectors'],
        'Rotational Kinematics': ['Angular position θ', 'Angular velocity ω = dθ/dt', 'Angular acceleration α = dω/dt', 'Rotational equations'],
        'Rotational Dynamics': ['τ = Iα', 'Rotational Newton\'s 2nd', 'Torque and angular acceleration', 'Applications'],
        'Moment of Inertia': ['I = ∫r²dm', 'Parallel axis theorem', 'Perpendicular axis theorem', 'Common shapes'],
        'Angular Acceleration': ['α = dω/dt', 'Constant angular acceleration', 'Angular motion equations', 'Applications'],
        'Rotational Equilibrium': ['Στ = 0', 'Static equilibrium', 'Balance problems', 'Ladder problems']
      }
    },
    'Energy & Momentum of Rotating Systems': {
      color: 'from-yellow-500 to-orange-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-yellow-500',
      mainTopics: [
        { name: 'Rotational Kinetic Energy', icon: '⚡' },
        { name: 'Angular Momentum', icon: '🔁' },
        { name: 'Rolling Motion', icon: '🛞' },
        { name: 'Orbital Motion', icon: '🌌' },
        { name: 'Conservation Principles', icon: '🌀' }
      ],
      subtopics: {
        'Rotational Kinetic Energy': ['KE_rot = ½Iω²', 'Total kinetic energy', 'Energy in rotation', 'Energy calculations'],
        'Angular Momentum': ['L = Iω', 'L = r × p', 'Angular momentum conservation', 'Torque and angular momentum'],
        'Rolling Motion': ['Rolling without slipping', 'Kinetic energy of rolling', 'Rolling down inclines', 'Mixed motion'],
        'Orbital Motion': ['Circular orbits', 'Orbital velocity', 'Orbital period', 'Energy in orbits'],
        'Conservation Principles': ['Angular momentum conservation', 'Energy conservation', 'Combined conservation', 'Applications']
      }
    },
    'Oscillations': {
      color: 'from-amber-500 to-orange-500',
      icon: <Waves className="w-8 h-8" />,
      iconBg: 'bg-amber-500',
      mainTopics: [
        { name: 'Simple Harmonic Motion', icon: '🔁' },
        { name: 'Spring Oscillations', icon: '🪀' },
        { name: 'Pendulum Motion', icon: '🏗️' },
        { name: 'Frequency & Period', icon: '⏱️' },
        { name: 'Energy in SHM', icon: '📉' },
        { name: 'Resonance', icon: '⚡' }
      ],
      subtopics: {
        'Simple Harmonic Motion': ['SHM equations', 'x(t) = A cos(ωt + φ)', 'Velocity and acceleration', 'Phase and amplitude'],
        'Spring Oscillations': ['Hooke\'s law F = -kx', 'Spring constant', 'Period T = 2π√(m/k)', 'Energy in springs'],
        'Pendulum Motion': ['Simple pendulum', 'Period T = 2π√(L/g)', 'Physical pendulum', 'Small angle approximation'],
        'Frequency & Period': ['Frequency f = 1/T', 'Angular frequency ω = 2πf', 'Period calculations', 'Frequency relationships'],
        'Energy in SHM': ['Total energy E = ½kA²', 'Kinetic and potential energy', 'Energy conservation', 'Energy graphs'],
        'Resonance': ['Resonance frequency', 'Driven oscillations', 'Damping', 'Resonance applications']
      }
    }
  };

  const tools = [
    { name: 'FRQ Practice Engine', icon: <BookOpen className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600', desc: 'Master free response with calculus-based solutions' },
    { name: 'MCQ Drill Master', icon: <Target className="w-6 h-6" />, color: 'from-purple-500 to-pink-600', desc: 'Practice 1000+ AP Physics C-style questions' },
    { name: 'Formula Sheet Pro', icon: <Brain className="w-6 h-6" />, color: 'from-orange-500 to-red-600', desc: 'All calculus-based equations organized by topic' },
    { name: 'Graph Generator', icon: <TrendingUp className="w-6 h-6" />, color: 'from-teal-500 to-cyan-600', desc: 'Create & analyze physics graphs with calculus' },
    { name: 'Mock Test Simulator', icon: <Clock className="w-6 h-6" />, color: 'from-green-500 to-emerald-600', desc: 'Full 90-minute AP Physics C exam simulations' },
    { name: 'Progress Tracker', icon: <Award className="w-6 h-6" />, color: 'from-yellow-500 to-orange-600', desc: 'Track your journey to a perfect 5' }
  ];

  const toggleSubtopic = (topic: string) => {
    setExpandedSubtopic(expandedSubtopic === topic ? null : topic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
      <CourseNavigation />

      <div className="max-w-7xl mx-auto px-6 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-emerald-300 hover:text-white mb-4 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">College Board Advanced Placement</span>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              AP Physics C: Mechanics
            </h1>
            <p className="text-xl text-slate-300">Calculus-Based Classical Mechanics</p>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Master advanced mechanics with calculus & earn college credit with a perfect 5
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
                <span className="text-purple-300">Grades 11-12</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl border border-emerald-500/30">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300">98% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl p-8 border border-emerald-500/20">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-400" />
            About AP Physics C: Mechanics
          </h2>
          <div className="space-y-4 text-lg text-slate-300">
            <p>
              AP Physics C: Mechanics is a
              <span className="text-emerald-400 font-semibold"> calculus-based college-level physics course</span> that covers classical mechanics using differential and integral calculus. This course is equivalent to a first-semester college physics course for engineering and physics majors.
            </p>
            <p>
              Scoring a 5 on the AP Physics C: Mechanics exam demonstrates mastery of advanced physics concepts and can
              <span className="text-teal-400 font-semibold"> earn you college credit worth thousands of dollars</span> while preparing you for advanced STEM studies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {[
                'Earn college credit & save tuition costs',
                'Boost your college application profile',
                'Master calculus-based physics',
                'Perfect preparation for engineering programs'
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
            Who Should Take AP Physics C: Mechanics?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            {[
              'Grade 11-12 students with strong math background',
              'Students who have completed or are taking Calculus',
              'Future engineering, physics, or STEM majors',
              'Students aiming for top engineering universities',
              'Those who want to skip introductory physics in college',
              'Students looking for challenging, calculus-based physics'
            ].map((point, index) => (
              <div key={index} className="flex items-start gap-3 bg-slate-800/30 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            Exam Pattern & Structure (AP Physics C: Mechanics)
          </h2>
          <p className="text-slate-300 text-lg mb-8">The AP Physics C: Mechanics exam follows this format</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examPattern.map((paper, index) => (
              <div key={index} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 ${paper.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{paper.section}</h3>
                  <p className="text-lg text-emerald-400 mb-6">{paper.subtitle}</p>

                  <div className="w-full space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Questions</div>
                        <div className="text-xl font-bold text-white">{paper.marks}</div>
                      </div>

                      <div>
                        <div className="text-sm text-slate-400 mb-1">Duration</div>
                        <div className="text-lg font-bold text-emerald-400">{paper.duration}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-400 mb-1">Weightage</div>
                      <div className="text-lg font-bold text-green-400">{paper.weight}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm text-center">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3 text-white">
              <Calendar className="w-7 h-7 text-orange-400" />
              Total Duration: 90 Minutes
            </h3>
            <p className="text-slate-300 text-lg">
              The exam tests both your calculus-based problem-solving skills (MCQs) and your ability to solve complex mechanics problems (FRQs)
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Complete AP Physics C: Mechanics Syllabus
          </h2>
          <p className="text-slate-400 text-lg">Click topics to explore detailed concepts</p>
        </div>

        <div className="space-y-8">
          {Object.entries(syllabusData).map(([topicName, data], topicIndex) => (
            <div key={topicIndex} className="relative">
              <div className={`relative rounded-3xl border border-transparent bg-gradient-to-r ${data.color} p-1`}>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-500/30 mb-4">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">Exclusive to Srikanth's Academy</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            AP Physics C: Mechanics Prep Tools
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
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Score a Perfect 5?</h2>
          <p className="text-xl text-emerald-100 mb-8">Start your journey to AP Physics C: Mechanics mastery and earn college credit</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
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


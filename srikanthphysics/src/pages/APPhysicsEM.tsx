import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Star, Users, BookOpen, TrendingUp, CheckCircle, Target, Award, Download, Play, Clock, Activity, GraduationCap, Brain, Atom, Calendar, Lightbulb, Gauge, Magnet, Waves, ArrowLeft } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function APPhysicsEM() {
  const navigate = useNavigate();
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);

  const examPattern = [
    {
      section: 'Section 1',
      subtitle: 'Multiple Choice',
      marks: '35 Questions',
      duration: '45 min',
      weight: '50%',
      iconBg: 'bg-amber-500'
    },
    {
      section: 'Section 2',
      subtitle: 'Free Response',
      marks: '3 Questions',
      duration: '45 min',
      weight: '50%',
      iconBg: 'bg-orange-500'
    }
  ];

  const syllabusData: Record<string, {
    color: string;
    icon: JSX.Element;
    iconBg: string;
    mainTopics: Array<{ name: string; icon: string }>;
    subtopics: Record<string, string[]>;
  }> = {
    'Electrostatics': {
      color: 'from-amber-500 to-orange-400',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-amber-500',
      mainTopics: [
        { name: 'Electric Charge', icon: '⚡' },
        { name: 'Electric Fields', icon: '🌀' },
        { name: 'Gauss\'s Law', icon: '📐' },
        { name: 'Electric Potential', icon: '🔋' }
      ],
      subtopics: {
        'Electric Charge': ['Charge properties', 'Conservation of charge', 'Coulomb\'s law F = kq₁q₂/r²', 'Charge distribution'],
        'Electric Fields': ['E = F/q', 'Field due to point charges', 'Field lines', 'Field calculations'],
        'Gauss\'s Law': ['Φ = ∮E·dA = Q_enc/ε₀', 'Gaussian surfaces', 'Applications', 'Symmetry arguments'],
        'Electric Potential': ['V = U/q', 'Potential difference', 'Equipotential surfaces', 'Potential energy']
      }
    },
    'Conductors, Capacitors, Dielectrics': {
      color: 'from-orange-500 to-red-500',
      icon: <Atom className="w-8 h-8" />,
      iconBg: 'bg-orange-500',
      mainTopics: [
        { name: 'Conductors', icon: '🔌' },
        { name: 'Capacitors', icon: '⚡' },
        { name: 'Dielectrics', icon: '🔬' },
        { name: 'Energy Storage', icon: '💾' }
      ],
      subtopics: {
        'Conductors': ['Electrostatic equilibrium', 'Field inside conductors', 'Charge distribution', 'Shielding'],
        'Capacitors': ['C = Q/V', 'Parallel plate capacitor', 'Capacitor combinations', 'Energy in capacitors'],
        'Dielectrics': ['Dielectric constant κ', 'Effect on capacitance', 'Polarization', 'Dielectric breakdown'],
        'Energy Storage': ['U = ½CV²', 'Energy density', 'Charging/discharging', 'RC circuits']
      }
    },
    'Electric Circuits': {
      color: 'from-red-500 to-pink-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-red-500',
      mainTopics: [
        { name: 'Current & Resistance', icon: '⚡' },
        { name: 'DC Circuits', icon: '🔌' },
        { name: 'RC Circuits', icon: '⏱️' },
        { name: 'Power', icon: '💡' }
      ],
      subtopics: {
        'Current & Resistance': ['I = dQ/dt', 'Ohm\'s law V = IR', 'Resistivity ρ', 'Resistance R = ρL/A'],
        'DC Circuits': ['Kirchhoff\'s laws', 'Series and parallel', 'Equivalent resistance', 'Circuit analysis'],
        'RC Circuits': ['Charging: Q(t) = Q₀(1 - e^(-t/RC))', 'Discharging: Q(t) = Q₀e^(-t/RC)', 'Time constant τ = RC', 'Current in RC circuits'],
        'Power': ['P = IV = I²R = V²/R', 'Energy dissipation', 'Power in circuits', 'Efficiency']
      }
    },
    'Magnetic Fields': {
      color: 'from-pink-500 to-purple-500',
      icon: <Magnet className="w-8 h-8" />,
      iconBg: 'bg-pink-500',
      mainTopics: [
        { name: 'Magnetic Force', icon: '🧲' },
        { name: 'Magnetic Fields', icon: '🌀' },
        { name: 'Biot-Savart Law', icon: '📐' },
        { name: 'Ampere\'s Law', icon: '⚡' }
      ],
      subtopics: {
        'Magnetic Force': ['F = q(v × B)', 'Force on current', 'Right-hand rule', 'Motion in magnetic fields'],
        'Magnetic Fields': ['B-field definition', 'Field due to currents', 'Field lines', 'Magnetic flux'],
        'Biot-Savart Law': ['dB = (μ₀/4π)(Idl × r̂)/r²', 'Field calculations', 'Applications', 'Integration techniques'],
        'Ampere\'s Law': ['∮B·dl = μ₀I_enc', 'Amperian loops', 'Applications', 'Symmetry arguments']
      }
    },
    'Electromagnetism': {
      color: 'from-purple-500 to-indigo-500',
      icon: <Magnet className="w-8 h-8" />,
      iconBg: 'bg-purple-500',
      mainTopics: [
        { name: 'Faraday\'s Law', icon: '⚡' },
        { name: 'Inductance', icon: '🔗' },
        { name: 'Maxwell\'s Equations', icon: '📐' },
        { name: 'Electromagnetic Waves', icon: '📡' }
      ],
      subtopics: {
        'Faraday\'s Law': ['ε = -dΦ_B/dt', 'Lenz\'s law', 'Motional EMF', 'Induced currents'],
        'Inductance': ['Self-inductance L', 'Inductors', 'RL circuits', 'Energy in inductors'],
        'Maxwell\'s Equations': ['Gauss\'s law (E)', 'Gauss\'s law (B)', 'Faraday\'s law', 'Ampere-Maxwell law'],
        'Electromagnetic Waves': ['Wave equation', 'EM wave properties', 'Speed of light c', 'Energy and momentum']
      }
    }
  };

  const tools = [
    { name: 'FRQ Practice Engine', icon: <BookOpen className="w-6 h-6" />, color: 'from-amber-500 to-orange-600', desc: 'Master free response with calculus-based solutions' },
    { name: 'MCQ Drill Master', icon: <Target className="w-6 h-6" />, color: 'from-orange-500 to-red-600', desc: 'Practice 1000+ AP Physics C E&M-style questions' },
    { name: 'Formula Sheet Pro', icon: <Brain className="w-6 h-6" />, color: 'from-red-500 to-pink-600', desc: 'All calculus-based E&M equations organized by topic' },
    { name: 'Circuit Simulator', icon: <Gauge className="w-6 h-6" />, color: 'from-purple-500 to-indigo-600', desc: 'Simulate and analyze electric circuits' },
    { name: 'Mock Test Simulator', icon: <Clock className="w-6 h-6" />, color: 'from-amber-500 to-orange-600', desc: 'Full 90-minute AP Physics C E&M exam simulations' },
    { name: 'Progress Tracker', icon: <Award className="w-6 h-6" />, color: 'from-orange-500 to-red-600', desc: 'Track your journey to a perfect 5' }
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
          className="flex items-center gap-2 text-amber-300 hover:text-white mb-4 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-red-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full border border-amber-500/30">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300">College Board Advanced Placement</span>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              AP Physics C: E&M
            </h1>
            <p className="text-xl text-slate-300">Calculus-Based Electricity & Magnetism</p>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Master advanced electromagnetism with calculus & earn college credit with a perfect 5
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
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300">98% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl p-8 border border-amber-500/20">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-400" />
            About AP Physics C: E&M
          </h2>
          <div className="space-y-4 text-lg text-slate-300">
            <p>
              AP Physics C: Electricity and Magnetism is a
              <span className="text-amber-400 font-semibold"> calculus-based college-level physics course</span> that covers electrostatics, circuits, magnetic fields, and electromagnetism using differential and integral calculus. This course is equivalent to a second-semester college physics course for engineering and physics majors.
            </p>
            <p>
              Scoring a 5 on the AP Physics C: E&M exam demonstrates mastery of advanced electromagnetism concepts and can
              <span className="text-orange-400 font-semibold"> earn you college credit worth thousands of dollars</span> while preparing you for advanced STEM studies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {[
                'Earn college credit & save tuition costs',
                'Boost your college application profile',
                'Master calculus-based electromagnetism',
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
            Who Should Take AP Physics C: E&M?
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
            Exam Pattern & Structure (AP Physics C: E&M)
          </h2>
          <p className="text-slate-300 text-lg mb-8">The AP Physics C: E&M exam follows this format</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examPattern.map((paper, index) => (
              <div key={index} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 ${paper.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{paper.section}</h3>
                  <p className="text-lg text-amber-400 mb-6">{paper.subtitle}</p>

                  <div className="w-full space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Questions</div>
                        <div className="text-xl font-bold text-white">{paper.marks}</div>
                      </div>

                      <div>
                        <div className="text-sm text-slate-400 mb-1">Duration</div>
                        <div className="text-lg font-bold text-amber-400">{paper.duration}</div>
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
              The exam tests both your calculus-based problem-solving skills (MCQs) and your ability to solve complex E&M problems (FRQs)
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Complete AP Physics C: E&M Syllabus
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30 mb-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300">Exclusive to Srikanth's Academy</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            AP Physics C: E&M Prep Tools
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
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Score a Perfect 5?</h2>
          <p className="text-xl text-amber-100 mb-8">Start your journey to AP Physics C: E&M mastery and earn college credit</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-white text-amber-600 rounded-xl font-bold hover:bg-amber-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
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


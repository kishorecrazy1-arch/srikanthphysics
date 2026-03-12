import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, BookOpen, Award, TrendingUp, Users, CheckCircle, Target, Zap, Lightbulb, Activity, Atom, Waves, Thermometer, Battery, Eye, Cpu, Rocket, Globe } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export default function IITJEEPhysics() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const stats = [
    { label: 'Conceptual Clarity Score', value: '98%', icon: <Brain />, color: 'text-purple-500' },
    { label: 'JEE Main Qualifiers', value: '85%', icon: <Award />, color: 'text-yellow-500' },
    { label: 'AIR Top 500 Every Year', value: '100+', icon: <TrendingUp />, color: 'text-green-500' },
    { label: 'Trusted Aspirants', value: '3000+', icon: <Users />, color: 'text-blue-500' }
  ];

  const examPattern = [
    {
      paper: 'JEE Main',
      type: 'Objective (MCQs + NAT)',
      marks: '100 (25 Q × 4 marks)',
      duration: '1 hr 30 min',
      weight: '50%',
      color: 'bg-purple-500'
    },
    {
      paper: 'JEE Advanced',
      type: 'Mixed (MCQ + MSQ + Numerical)',
      marks: '120 (Varies)',
      duration: '1 hr 45 min',
      weight: '50%',
      color: 'bg-pink-500'
    }
  ];

  const syllabusData = [
    {
      section: 'SECTION 1 — Mechanics & Kinematics',
      icon: <Rocket className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-400',
      iconBg: 'bg-blue-500',
      topics: [
        { name: 'Units & Dimensions', icon: '📏' },
        { name: 'Motion in 1D & 2D', icon: '🏃' },
        { name: "Newton's Laws", icon: '⚖️' },
        { name: 'Work, Energy & Power', icon: '💪' },
        { name: 'Circular Motion', icon: '🌀' },
        { name: 'Centre of Mass & Rotation', icon: '🧊' },
        { name: 'Gravitation', icon: '🌊' }
      ]
    },
    {
      section: 'SECTION 2 — Thermal Physics',
      icon: <Thermometer className="w-8 h-8" />,
      color: 'from-red-500 to-orange-400',
      iconBg: 'bg-red-500',
      topics: [
        { name: 'Heat & Temperature', icon: '🌡️' },
        { name: 'Kinetic Theory of Gases', icon: '🔬' },
        { name: 'Laws of Thermodynamics', icon: '⚙️' },
        { name: 'Heat Engines & Refrigerators', icon: '🔄' }
      ]
    },
    {
      section: 'SECTION 3 — Waves & Optics',
      icon: <Waves className="w-8 h-8" />,
      color: 'from-teal-500 to-green-400',
      iconBg: 'bg-teal-500',
      topics: [
        { name: 'Oscillations', icon: '〰️' },
        { name: 'Sound Waves', icon: '🔊' },
        { name: 'Interference & Diffraction', icon: '🌈' },
        { name: 'Ray Optics', icon: '🔦' }
      ]
    },
    {
      section: 'SECTION 4 — Electricity & Magnetism',
      icon: <Battery className="w-8 h-8" />,
      color: 'from-yellow-500 to-amber-400',
      iconBg: 'bg-yellow-500',
      topics: [
        { name: 'Electrostatics', icon: '🔋' },
        { name: 'Current Electricity', icon: '🔌' },
        { name: 'Magnetic Effects of Current', icon: '🧭' },
        { name: 'Electromagnetic Induction', icon: '🔄' },
        { name: 'Alternating Currents', icon: '📡' }
      ]
    },
    {
      section: 'SECTION 5 — Modern Physics',
      icon: <Atom className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-400',
      iconBg: 'bg-purple-500',
      topics: [
        { name: 'Photoelectric Effect', icon: '⚛️' },
        { name: 'Bohr Model & Atoms', icon: '💫' },
        { name: 'Nuclear Physics', icon: '🧬' },
        { name: 'Semiconductors', icon: '💡' }
      ]
    }
  ];

  const aiTools = [
    {
      title: 'Concept Simulator',
      description: 'Convert formulas into 3D understanding through AI visualization',
      icon: <Cpu className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-400'
    },
    {
      title: 'Graph Analysis Tool',
      description: 'Interpret motion and electrical graphs like a topper',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-400'
    },
    {
      title: 'MCQ Eliminator AI',
      description: 'Learn exam logic & avoid traps in seconds',
      icon: <Target className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-400'
    },
    {
      title: 'Formula Sheet Generator',
      description: 'Personalized formula sheet based on your weak areas',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-400'
    },
    {
      title: 'Virtual Lab Experiments',
      description: 'Simulate JEE-level experiments for real concept depth',
      icon: <Eye className="w-6 h-6" />,
      color: 'from-red-500 to-pink-400'
    },
    {
      title: 'Progress Tracker',
      description: 'Topic-wise AI analytics & accuracy improvement plans',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-teal-500 to-blue-400'
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
      <CourseNavigation />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-blue-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Master Physics the Srikanth Way</span>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              IIT JEE Physics
            </h1>
            <p className="text-xl text-slate-300">From Intuition → Application → Excellence</p>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Recognized Across India & Abroad
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-4 text-sm">
              <div className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                <span className="text-purple-300">Trusted by 3,000+ Aspirants</span>
              </div>
              <div className="px-4 py-2 bg-pink-500/20 rounded-full border border-pink-500/30">
                <span className="text-pink-300">Grades 11–12</span>
              </div>
              <div className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                <span className="text-blue-300">Top 1% Selections</span>
              </div>
              <div className="px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
                <span className="text-green-300">AIR Top 100 Every Year</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className={`${stat.color} mb-3`}>{stat.icon}</div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-12 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold">
              About IIT JEE Physics
            </h2>
          </div>
          <div className="space-y-4 text-lg text-slate-300">
            <p>
              IIT JEE Physics builds the bridge between
              <span className="text-purple-400 font-semibold"> conceptual clarity</span> and
              <span className="text-pink-400 font-semibold"> competitive mastery</span>.
            </p>
            <p>
              Srikanth Sir's approach integrates Cambridge-style logical understanding with Indian exam strategy —
              teaching <span className="text-purple-400 font-semibold">why formulas work</span> before how to use them.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {[
                'Develops analytical & mathematical reasoning',
                'Bridges IGCSE/A-Level foundation to JEE Main & Advanced',
                'Focus on precision, application, and time-efficiency',
                'AI practice for speed & accuracy improvement'
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Exam Pattern & Structure
          </h2>
          <p className="text-slate-400 text-lg">Comprehensive coverage for both JEE Main & Advanced</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <thead>
              <tr className="bg-purple-500/20 border-b border-slate-700">
                <th className="px-6 py-4 text-left font-semibold">Paper</th>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">Marks</th>
                <th className="px-6 py-4 text-left font-semibold">Duration</th>
                <th className="px-6 py-4 text-left font-semibold">Weight</th>
              </tr>
            </thead>
            <tbody>
              {examPattern.map((exam, index) => (
                <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${exam.color}`}></div>
                      <span className="font-semibold">{exam.paper}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{exam.type}</td>
                  <td className="px-6 py-4 text-slate-300">{exam.marks}</td>
                  <td className="px-6 py-4 text-slate-300">{exam.duration}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                      {exam.weight}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Complete IIT JEE Physics Syllabus
          </h2>
          <p className="text-slate-400 text-lg">Comprehensive coverage of all topics for JEE Main & Advanced</p>
        </div>

        <div className="space-y-6">
          {syllabusData.map((section, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
              <button
                onClick={() => toggleSection(section.section)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`${section.iconBg} p-3 rounded-lg text-white`}>
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">{section.section}</h3>
                    <p className="text-sm text-slate-400 mt-1">{section.topics.length} key topics</p>
                  </div>
                </div>
                <div className={`transform transition-transform ${expandedSection === section.section ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedSection === section.section && (
                <div className="px-6 pb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {section.topics.map((topic, topicIndex) => (
                    <div
                      key={topicIndex}
                      className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
                    >
                      <div className="text-2xl mb-2">{topic.icon}</div>
                      <div className="text-sm font-medium">{topic.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Exclusive to Srikanth's Academy</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            AI-Powered Prep Tools
          </h2>
          <p className="text-slate-400 text-lg">Advanced technology meets traditional teaching excellence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className={`bg-gradient-to-r ${tool.color} p-3 rounded-lg inline-block mb-4`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
              <p className="text-slate-400">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm p-12 rounded-2xl border border-purple-500/30 text-center">
          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Results & Global Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '⭐', label: '98% Conceptual Clarity Score' },
              { icon: '⭐', label: '85% JEE Main Qualifiers per Batch' },
              { icon: '⭐', label: 'AIR Top 500 Selections Every Year' },
              { icon: '⭐', label: 'Students from India, Singapore, Qatar, UK, UAE' }
            ].map((result, index) => (
              <div key={index} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <div className="text-4xl mb-3">{result.icon}</div>
                <p className="text-slate-300">{result.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              Start Your JEE Journey
            </button>
            <button
              onClick={() => navigate('/ap-physics')}
              className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300"
            >
              View Sample Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

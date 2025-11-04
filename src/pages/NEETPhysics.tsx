import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Atom, BookOpen, Award, TrendingUp, Users, CheckCircle, Target, Zap, Lightbulb, Activity, Battery, Eye, Cpu, Beaker, Brain, Clock, Calculator, Flame } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export default function NEETPhysics() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const stats = [
    { label: 'Trusted NEET Aspirants', value: '3000+', icon: <Users />, color: 'text-blue-500' },
    { label: 'Physics Weightage', value: '180 Marks', icon: <Target />, color: 'text-green-500' },
    { label: 'Top 1% Achievers', value: '170+', icon: <Award />, color: 'text-yellow-500' },
    { label: 'Selection Rate', value: '1000+', icon: <TrendingUp />, color: 'text-pink-500' }
  ];

  const examPattern = [
    {
      section: 'Section A',
      type: 'MCQ (35 Qs)',
      marks: '140',
      duration: '3 hrs',
      weight: '77%',
      color: 'bg-green-500'
    },
    {
      section: 'Section B',
      type: 'Optional (10 Qs)',
      marks: '40',
      duration: '3 hrs',
      weight: '23%',
      color: 'bg-teal-500'
    }
  ];

  const class11Syllabus = [
    {
      title: 'Physical World & Units',
      description: 'Measurement, Significant Figures, Dimensions',
      icon: '📏',
      number: '1'
    },
    {
      title: 'Motion in One & Two Dimensions',
      description: 'Kinematics, Graphs, Relative Motion',
      icon: '🏃',
      number: '2'
    },
    {
      title: 'Laws of Motion',
      description: "Newton's Laws, Friction, Circular Motion",
      icon: '⚖️',
      number: '3'
    },
    {
      title: 'Work, Power & Energy',
      description: 'Energy Conservation, Collisions',
      icon: '💪',
      number: '4'
    },
    {
      title: 'Rotational Motion',
      description: 'Torque, Moment of Inertia, Angular Momentum',
      icon: '🌀',
      number: '5'
    },
    {
      title: 'Gravitation',
      description: "Kepler's Laws, Satellites",
      icon: '🌍',
      number: '6'
    },
    {
      title: 'Properties of Matter',
      description: 'Elasticity, Surface Tension, Viscosity',
      icon: '💧',
      number: '7'
    },
    {
      title: 'Heat & Thermodynamics',
      description: 'Kinetic Theory, First Law, Calorimetry',
      icon: '🌡️',
      number: '8'
    },
    {
      title: 'Oscillations & Waves',
      description: 'SHM, Resonance, Sound Waves',
      icon: '〰️',
      number: '9'
    }
  ];

  const class12Syllabus = [
    {
      title: 'Electrostatics',
      description: "Coulomb's Law, Electric Field, Potential",
      icon: '⚡',
      number: '1'
    },
    {
      title: 'Current Electricity',
      description: "Ohm's Law, Circuits, Kirchhoff's Rules",
      icon: '🔌',
      number: '2'
    },
    {
      title: 'Magnetism & EM Induction',
      description: 'Moving Charges, Solenoids, Induced EMF',
      icon: '🧲',
      number: '3'
    },
    {
      title: 'Alternating Current & EM Waves',
      description: 'Reactance, Power Factor, Communication',
      icon: '📡',
      number: '4'
    },
    {
      title: 'Ray & Wave Optics',
      description: 'Refraction, Interference, Diffraction',
      icon: '🔦',
      number: '5'
    },
    {
      title: 'Modern Physics',
      description: 'Photoelectric Effect, Bohr Model, X-rays',
      icon: '⚛️',
      number: '6'
    },
    {
      title: 'Nuclear Physics',
      description: 'Radioactivity, Half-life, Nuclear Reactions',
      icon: '☢️',
      number: '7'
    },
    {
      title: 'Semiconductor Devices',
      description: 'Diodes, Transistors, Logic Gates',
      icon: '💡',
      number: '8'
    }
  ];

  const prepTools = [
    {
      title: 'AI Problem Solver',
      description: 'Scan & solve NEET Physics questions with instant reasoning',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-400'
    },
    {
      title: 'Virtual Lab Simulator',
      description: 'Perform NCERT experiments interactively',
      icon: <Beaker className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-400'
    },
    {
      title: 'Formula Intelligence Board',
      description: 'Smart formula recall + AI-based similarity grouping',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-400'
    },
    {
      title: 'Error Pattern Analyzer',
      description: 'Detect weak chapters and question traps',
      icon: <Target className="w-6 h-6" />,
      color: 'from-red-500 to-pink-400'
    },
    {
      title: 'Timed Mock Engine',
      description: 'Replicates NEET test interface with topic filters',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-400'
    },
    {
      title: 'Performance Tracker',
      description: 'Track speed, accuracy, and concept depth in real time',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-teal-500 to-blue-400'
    }
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-green-900 to-slate-900 text-white">
      <CourseNavigation />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-green-500/10 to-teal-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30">
              <Atom className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-teal-300">NEET Physics (Class 11–12)</span>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-teal-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
              NEET Physics
            </h1>
            <p className="text-xl text-slate-300">Concept Mastery for India's Toughest Medical Entrance Exam</p>

            <div className="flex flex-wrap justify-center gap-3 pt-4 text-sm">
              <div className="px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30">
                <span className="text-teal-300">Trusted by 3,000+ NEET Aspirants</span>
              </div>
              <div className="px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
                <span className="text-green-300">NCERT Class 11–12 Physics</span>
              </div>
              <div className="px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
                <span className="text-blue-300">Target: NEET-UG 2026 / 2027</span>
              </div>
              <div className="px-4 py-2 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                <span className="text-yellow-300">180 Marks (45 Qs)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20">
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
            <Atom className="w-8 h-8 text-teal-400" />
            <h2 className="text-3xl font-bold">
              About NEET Physics
            </h2>
          </div>
          <div className="space-y-4 text-lg text-slate-300">
            <p>
              NEET Physics builds a student's
              <span className="text-teal-400 font-semibold"> scientific intuition</span> and
              <span className="text-green-400 font-semibold"> application power</span> — helping them bridge concept to calculation.
            </p>
            <p>
              Srikanth Sir's NEET course focuses on <span className="text-teal-400 font-semibold">concept clarity</span>,
              <span className="text-green-400 font-semibold"> fast problem-solving</span>, and
              <span className="text-blue-400 font-semibold"> NCERT-to-NEET mapping</span> for every topic.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {[
                'Builds real-time problem-solving reflex',
                'NCERT-aligned explanations with AI-powered visualizations',
                'High-yield question pattern mastery',
                'Step-by-step logic building before formulas',
                'Designed for 650+ score strategies'
              ].slice(0, 5).map((point, index) => (
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
            NEET Physics Exam Pattern
          </h2>
          <p className="text-slate-400 text-lg">Understanding the structure for strategic preparation</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            <thead>
              <tr className="bg-teal-500/20 border-b border-slate-700">
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
                      <span className="font-semibold">{exam.section}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{exam.type}</td>
                  <td className="px-6 py-4 text-slate-300">{exam.marks}</td>
                  <td className="px-6 py-4 text-slate-300">{exam.duration}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm font-semibold">
                      {exam.weight}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
            <Calculator className="w-8 h-8 text-teal-400 mb-3" />
            <h3 className="font-semibold mb-2">Marking Scheme</h3>
            <p className="text-slate-400">+4 for correct, -1 for incorrect</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
            <Target className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="font-semibold mb-2">Total Physics Marks</h3>
            <p className="text-slate-400">180 out of 720</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
            <Flame className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="font-semibold mb-2">Top 1% Score</h3>
            <p className="text-slate-400">170+ in Physics</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Complete NEET Physics Syllabus
          </h2>
          <p className="text-slate-400 text-lg">Click topics to explore detailed concepts</p>
        </div>

        <div className="space-y-8">
          <div>
            <button
              onClick={() => toggleSection('class11')}
              className="w-full mb-6 p-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold">Class 11 Units</h3>
                    <p className="text-slate-400 mt-1">9 fundamental physics units</p>
                  </div>
                </div>
                <div className={`transform transition-transform ${expandedSection === 'class11' ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            {expandedSection === 'class11' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {class11Syllabus.map((topic, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{topic.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                            {topic.number}
                          </span>
                          <h4 className="font-semibold">{topic.title}</h4>
                        </div>
                        <p className="text-sm text-slate-400">{topic.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection('class12')}
              className="w-full mb-6 p-6 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold">Class 12 Units</h3>
                    <p className="text-slate-400 mt-1">8 advanced physics units</p>
                  </div>
                </div>
                <div className={`transform transition-transform ${expandedSection === 'class12' ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            {expandedSection === 'class12' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {class12Syllabus.map((topic, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{topic.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded">
                            {topic.number}
                          </span>
                          <h4 className="font-semibold">{topic.title}</h4>
                        </div>
                        <p className="text-sm text-slate-400">{topic.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full border border-teal-500/30 mb-6">
            <Zap className="w-4 h-4 text-teal-400" />
            <span className="text-sm text-teal-300">Exclusive to Srikanth's Academy</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            NEET Physics Prep Tools
          </h2>
          <p className="text-slate-400 text-lg">AI-powered technology for competitive edge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prepTools.map((tool, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20"
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
        <div className="bg-gradient-to-r from-teal-500/20 to-green-500/20 backdrop-blur-sm p-12 rounded-2xl border border-teal-500/30 text-center">
          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">
            Why Learn NEET Physics with Srikanth Sir?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            {[
              { icon: '✅', text: 'IIT & Medical Physics Expert — 12+ years of results' },
              { icon: '✅', text: 'AI-Augmented Learning System — personalized feedback' },
              { icon: '✅', text: '1000+ AIMS/JIPMER/NEET-UG Selections' },
              { icon: '✅', text: 'Precision Teaching: Concept → Application → Mastery' }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-green-500 rounded-xl font-semibold hover:from-teal-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-teal-500/50"
            >
              Start Your NEET Journey
            </button>
            <button
              onClick={() => navigate('/dashboard')}
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

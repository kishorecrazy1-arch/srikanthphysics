import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Star, Users, BookOpen, TrendingUp, CheckCircle, Target, Award, Download, Play, Clock, Zap, Lightbulb, Beaker, Activity, Waves, Atom, Thermometer } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export default function IGCSECourse() {
  const navigate = useNavigate();
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);

  const stats = [
    { label: 'Global Pass Rate', value: '68%', icon: <TrendingUp />, color: 'text-green-500' },
    { label: 'A* Achievement', value: '18-25%', icon: <Star />, color: 'text-yellow-500' },
    { label: 'Students Worldwide', value: '500K+', icon: <Users />, color: 'text-blue-500' },
    { label: 'Countries', value: '150+', icon: <Globe />, color: 'text-purple-500' }
  ];

  const examPattern = [
    {
      section: 'Paper 2',
      subtitle: 'Multiple Choice',
      marks: '40',
      duration: '45 min',
      weight: '30%',
      iconBg: 'bg-blue-500'
    },
    {
      section: 'Paper 4',
      subtitle: 'Theory (Structured)',
      marks: '80',
      duration: '75 min',
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
    'Mechanics': {
      color: 'from-blue-500 to-cyan-400',
      icon: <Activity className="w-8 h-8" />,
      iconBg: 'bg-blue-500',
      mainTopics: [
        { name: 'Length & Time', icon: '📏' },
        { name: 'Motion', icon: '🏃' },
        { name: 'Mass & Weight', icon: '⚖️' },
        { name: 'Density', icon: '🧊' },
        { name: 'Forces', icon: '💪' },
        { name: 'Momentum', icon: '⚡' },
        { name: 'Energy, Work & Power', icon: '🔋' },
        { name: 'Pressure', icon: '🌊' }
      ],
      subtopics: {
        'Length & Time': ['SI units', 'Measuring instruments', 'Precision & accuracy', 'Time measurement'],
        'Motion': ['Speed & velocity', 'Acceleration', 'Distance-time graphs', 'Speed-time graphs'],
        'Mass & Weight': ['Gravitational field', 'Weight formula', 'Mass vs weight', 'Free fall'],
        'Density': ['Density formula', 'Measuring density', 'Floating & sinking', 'Relative density'],
        'Forces': ['Newton\'s laws', 'Balanced forces', 'Friction', 'Turning effects'],
        'Momentum': ['Momentum concept', 'Conservation', 'Impulse', 'Collisions'],
        'Energy, Work & Power': ['Energy forms', 'Conservation', 'Work done', 'Power calculations'],
        'Pressure': ['Pressure formula', 'Liquid pressure', 'Atmospheric pressure', 'Hydraulics']
      }
    },
    'Thermal Physics': {
      color: 'from-orange-500 to-red-500',
      icon: <Thermometer className="w-8 h-8" />,
      iconBg: 'bg-orange-500',
      mainTopics: [
        { name: 'Kinetic Theory', icon: '🔬' },
        { name: 'Thermal Properties', icon: '🌡️' },
        { name: 'Transfer of Energy', icon: '🔥' }
      ],
      subtopics: {
        'Kinetic Theory': ['States of matter', 'Molecular motion', 'Brownian motion', 'Gas pressure'],
        'Thermal Properties': ['Temperature scales', 'Specific heat capacity', 'Latent heat', 'Melting & boiling'],
        'Transfer of Energy': ['Conduction', 'Convection', 'Radiation', 'Thermal insulation']
      }
    },
    'Waves': {
      color: 'from-teal-500 to-cyan-500',
      icon: <Waves className="w-8 h-8" />,
      iconBg: 'bg-teal-500',
      mainTopics: [
        { name: 'General Wave Properties', icon: '〰️' },
        { name: 'Light', icon: '💡' },
        { name: 'Electromagnetic Spectrum', icon: '🌈' },
        { name: 'Sound', icon: '🔊' }
      ],
      subtopics: {
        'General Wave Properties': ['Wave motion', 'Wavelength & frequency', 'Wave speed', 'Reflection & refraction'],
        'Light': ['Reflection laws', 'Mirrors', 'Refraction', 'Lenses', 'Total internal reflection'],
        'Electromagnetic Spectrum': ['EM waves', 'Wave types', 'Uses', 'Dangers'],
        'Sound': ['Sound production', 'Pitch & loudness', 'Ultrasound', 'Echo']
      }
    },
    'Electricity & Magnetism': {
      color: 'from-purple-500 to-pink-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-purple-500',
      mainTopics: [
        { name: 'Magnetism', icon: '🧲' },
        { name: 'Electrical Quantities', icon: '⚡' },
        { name: 'Electric Circuits', icon: '🔌' },
        { name: 'Electromagnetic Effects', icon: '🔄' }
      ],
      subtopics: {
        'Magnetism': ['Magnetic fields', 'Magnetic materials', 'Electromagnets', 'Applications'],
        'Electrical Quantities': ['Current', 'Voltage', 'Resistance', 'Power'],
        'Electric Circuits': ['Circuit symbols', 'Series & parallel', 'Ohm\'s law', 'Component behavior'],
        'Electromagnetic Effects': ['Motor effect', 'Electromagnetic induction', 'Transformers', 'AC/DC']
      }
    },
    'Nuclear Physics': {
      color: 'from-green-500 to-emerald-500',
      icon: <Atom className="w-8 h-8" />,
      iconBg: 'bg-green-500',
      mainTopics: [
        { name: 'Atomic Structure', icon: '⚛️' },
        { name: 'Radioactivity', icon: '☢️' }
      ],
      subtopics: {
        'Atomic Structure': ['Atomic model', 'Protons, neutrons, electrons', 'Isotopes', 'Nucleon number'],
        'Radioactivity': ['Radioactive decay', 'Alpha, beta, gamma', 'Half-life', 'Safety & uses']
      }
    }
  };

  const tools = [
    { name: 'Paper 6 Lab Simulator', icon: <Beaker className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600', desc: 'Virtual experiments with real measurements' },
    { name: 'Graph Plotting Assistant', icon: <TrendingUp className="w-6 h-6" />, color: 'from-purple-500 to-pink-600', desc: 'Auto-grade your graphs & detect errors' },
    { name: 'MCQ Eliminator', icon: <Target className="w-6 h-6" />, color: 'from-orange-500 to-red-600', desc: 'Identify trick questions instantly' },
    { name: 'Formula Quick Sheet', icon: <BookOpen className="w-6 h-6" />, color: 'from-teal-500 to-cyan-600', desc: 'All formulas at your fingertips' },
    { name: 'Mock Test Engine', icon: <Clock className="w-6 h-6" />, color: 'from-green-500 to-emerald-600', desc: 'Full-length timed practice tests' },
    { name: 'Progress Tracker', icon: <Award className="w-6 h-6" />, color: 'from-yellow-500 to-orange-600', desc: 'Track mastery across all topics' }
  ];

  const toggleSubtopic = (topic: string) => {
    setExpandedSubtopic(expandedSubtopic === topic ? null : topic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
      <CourseNavigation />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-blue-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Cambridge International Examination</span>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
              IGCSE Physics
            </h1>
            <p className="text-xl text-slate-300">(0625/0972)</p>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Global-standard Physics mastered with clarity & intuition
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                <Globe className="w-5 h-5 text-green-400" />
                <span className="text-green-300">Recognized Worldwide</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
                <Star className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300">Trusted by 2,500+ Students</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300">Grades 9-10</span>
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
            About IGCSE Physics
          </h2>
          <div className="space-y-4 text-lg text-slate-300">
            <p>
              IGCSE Physics (0625/0972) is the
              <span className="text-blue-400 font-semibold"> internationally recognized foundation</span> course for students in Grades 9-10, preparing them for advanced studies in A-Level, IB, or AP Physics.
            </p>
            <p>
              Accepted by universities worldwide, this course develops
              <span className="text-purple-400 font-semibold"> critical thinking</span> and
              <span className="text-teal-400 font-semibold"> problem-solving skills</span> through rigorous scientific inquiry.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {[
                'Builds strong foundation for advanced physics',
                'Globally accepted as Grade 9-10 standard',
                'Develops STEM thinking and problem-solving',
                'Smooth transition to A-Level/IB/AP pathways'
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
        <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
          Exam Pattern & Structure
        </h2>
        <p className="text-center text-slate-400 text-lg mb-12">Understand the exam format and prepare strategically</p>

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
                    <div className="text-gray-600 mb-2">Marks</div>
                    <div className="text-6xl font-bold text-gray-900">{paper.marks}</div>
                  </div>

                  <div>
                    <div className="text-gray-600 mb-2">Duration</div>
                    <div className="text-3xl font-bold text-blue-600">{paper.duration}</div>
                  </div>

                  <div>
                    <div className="text-gray-600 mb-2">Weight</div>
                    <div className="text-3xl font-bold text-green-600">{paper.weight}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
            Complete IGCSE Physics Syllabus
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
            IGCSE Physics Prep Tools
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
          <h2 className="text-4xl font-bold mb-4">Ready to Master IGCSE Physics?</h2>
          <p className="text-xl text-blue-100 mb-8">Build a world-class physics foundation for your future</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                localStorage.setItem('selectedCourse', 'igcse');
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

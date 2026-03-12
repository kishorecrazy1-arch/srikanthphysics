import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Star, Users, BookOpen, TrendingUp, CheckCircle, Target, Award, Download, Play, Clock, Activity, GraduationCap, Brain, Atom, Calendar, Lightbulb, Gauge, Magnet, Waves, Thermometer, Eye, ArrowLeft } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function APPhysics2() {
  const navigate = useNavigate();
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);

  const examPattern = [
    {
      section: 'Section 1',
      subtitle: 'Multiple Choice',
      marks: '50 Questions',
      duration: '90 min',
      weight: '50%',
      iconBg: 'bg-blue-500'
    },
    {
      section: 'Section 2',
      subtitle: 'Free Response',
      marks: '4 Questions',
      duration: '90 min',
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
    'Thermodynamics': {
      color: 'from-red-500 to-orange-400',
      icon: <Thermometer className="w-8 h-8" />,
      iconBg: 'bg-red-500',
      mainTopics: [
        { name: 'Thermal Systems', icon: '🌡️' },
        { name: 'Heat Transfer', icon: '🔥' },
        { name: 'Laws of Thermodynamics', icon: '♻️' },
        { name: 'Work & Energy', icon: '⚙️' },
        { name: 'Entropy', icon: '🌀' }
      ],
      subtopics: {
        'Thermal Systems': ['Temperature scales', 'Thermal equilibrium', 'Heat capacity', 'Specific heat'],
        'Heat Transfer': ['Conduction', 'Convection', 'Radiation', 'Heat engines'],
        'Laws of Thermodynamics': ['First law (energy conservation)', 'Second law (entropy)', 'Third law', 'Thermodynamic processes'],
        'Work & Energy': ['PV diagrams', 'Work in thermodynamics', 'Internal energy', 'Heat engines efficiency'],
        'Entropy': ['Entropy definition', 'Entropy change', 'Statistical mechanics', 'Heat death']
      }
    },
    'Electric Force, Field, and Potential': {
      color: 'from-blue-500 to-indigo-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-blue-500',
      mainTopics: [
        { name: 'Electric Charge', icon: '⚛️' },
        { name: 'Electric Field', icon: '⚡' },
        { name: 'Potential Energy', icon: '📐' },
        { name: 'Conductors', icon: '🔋' },
        { name: 'Capacitors', icon: '🧩' }
      ],
      subtopics: {
        'Electric Charge': ['Charge properties', 'Coulomb\'s law', 'Charge distribution', 'Conservation of charge'],
        'Electric Field': ['Field definition', 'Field lines', 'Field due to charges', 'Gauss\'s law'],
        'Potential Energy': ['Electric potential', 'Potential difference', 'Equipotential surfaces', 'Potential energy'],
        'Conductors': ['Electrostatic equilibrium', 'Field inside conductors', 'Charge distribution', 'Shielding'],
        'Capacitors': ['Capacitance', 'Parallel plate capacitor', 'Energy storage', 'Dielectrics']
      }
    },
    'Electric Circuits': {
      color: 'from-green-500 to-emerald-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-green-500',
      mainTopics: [
        { name: 'Current', icon: '🔋' },
        { name: 'Resistance', icon: '⚙️' },
        { name: 'Series & Parallel', icon: '🔗' },
        { name: 'Kirchhoff\'s Laws', icon: '♻️' },
        { name: 'Power', icon: '⚡' },
        { name: 'RC Circuits', icon: '⏱️' }
      ],
      subtopics: {
        'Current': ['Current definition', 'Drift velocity', 'Current density', 'Ohm\'s law'],
        'Resistance': ['Resistivity', 'Resistance calculations', 'Temperature dependence', 'Superconductors'],
        'Series & Parallel': ['Series circuits', 'Parallel circuits', 'Equivalent resistance', 'Circuit analysis'],
        'Kirchhoff\'s Laws': ['Junction rule', 'Loop rule', 'Circuit solving', 'Complex circuits'],
        'Power': ['Electrical power', 'Energy dissipation', 'Power in circuits', 'Efficiency'],
        'RC Circuits': ['Charging circuits', 'Discharging circuits', 'Time constant', 'RC filters']
      }
    },
    'Magnetism & Electromagnetic Induction': {
      color: 'from-purple-500 to-pink-500',
      icon: <Magnet className="w-8 h-8" />,
      iconBg: 'bg-purple-500',
      mainTopics: [
        { name: 'Magnetic Fields', icon: '🧲' },
        { name: 'Moving Charges', icon: '🚀' },
        { name: 'Faraday\'s Law', icon: '🔁' },
        { name: 'Induced EMF', icon: '⚡' },
        { name: 'Generators', icon: '⚙️' }
      ],
      subtopics: {
        'Magnetic Fields': ['Magnetic field definition', 'Field lines', 'Field due to currents', 'Magnetic force'],
        'Moving Charges': ['Force on moving charges', 'Lorentz force', 'Motion in magnetic fields', 'Hall effect'],
        'Faraday\'s Law': ['Electromagnetic induction', 'Lenz\'s law', 'Motional EMF', 'Induced currents'],
        'Induced EMF': ['EMF definition', 'Induced EMF calculations', 'Self-inductance', 'Mutual inductance'],
        'Generators': ['AC generators', 'DC generators', 'Transformers', 'Electromagnetic applications']
      }
    },
    'Geometric Optics': {
      color: 'from-cyan-500 to-teal-500',
      icon: <Eye className="w-8 h-8" />,
      iconBg: 'bg-cyan-500',
      mainTopics: [
        { name: 'Reflection', icon: '🔦' },
        { name: 'Refraction', icon: '💎' },
        { name: 'Snell\'s Law', icon: '📐' },
        { name: 'Lenses & Mirrors', icon: '🔭' },
        { name: 'Image Formation', icon: '🔍' }
      ],
      subtopics: {
        'Reflection': ['Law of reflection', 'Plane mirrors', 'Spherical mirrors', 'Mirror equations'],
        'Refraction': ['Refraction definition', 'Index of refraction', 'Total internal reflection', 'Dispersion'],
        'Snell\'s Law': ['Snell\'s law equation', 'Critical angle', 'Prism refraction', 'Applications'],
        'Lenses & Mirrors': ['Convex lenses', 'Concave lenses', 'Lens equations', 'Optical instruments'],
        'Image Formation': ['Real vs virtual images', 'Image characteristics', 'Ray diagrams', 'Magnification']
      }
    },
    'Waves & Physical Optics': {
      color: 'from-yellow-500 to-orange-500',
      icon: <Waves className="w-8 h-8" />,
      iconBg: 'bg-yellow-500',
      mainTopics: [
        { name: 'Wave Motion', icon: '🌊' },
        { name: 'Sound', icon: '🔉' },
        { name: 'Doppler Effect', icon: '🚗' },
        { name: 'Interference', icon: '🌈' },
        { name: 'Standing Waves', icon: '🪈' },
        { name: 'Diffraction', icon: '💥' }
      ],
      subtopics: {
        'Wave Motion': ['Wave properties', 'Wave equation', 'Wave speed', 'Wave types'],
        'Sound': ['Sound waves', 'Sound speed', 'Sound intensity', 'Resonance'],
        'Doppler Effect': ['Doppler shift', 'Moving source', 'Moving observer', 'Applications'],
        'Interference': ['Constructive interference', 'Destructive interference', 'Double-slit experiment', 'Interference patterns'],
        'Standing Waves': ['Standing wave formation', 'Nodes and antinodes', 'Resonant frequencies', 'String instruments'],
        'Diffraction': ['Single-slit diffraction', 'Diffraction gratings', 'Resolution', 'X-ray diffraction']
      }
    },
    'Modern Physics': {
      color: 'from-indigo-500 to-purple-500',
      icon: <Atom className="w-8 h-8" />,
      iconBg: 'bg-indigo-500',
      mainTopics: [
        { name: 'Photoelectric Effect', icon: '☀️' },
        { name: 'Wave–Particle Duality', icon: '🔬' },
        { name: 'Atomic Spectra', icon: '🌈' },
        { name: 'Nuclear Physics', icon: '☢️' },
        { name: 'Fission & Fusion', icon: '💥' },
        { name: 'Relativity', icon: '🧩' }
      ],
      subtopics: {
        'Photoelectric Effect': ['Photoelectric effect', 'Work function', 'Threshold frequency', 'Einstein\'s explanation'],
        'Wave–Particle Duality': ['De Broglie wavelength', 'Matter waves', 'Uncertainty principle', 'Quantum mechanics'],
        'Atomic Spectra': ['Emission spectra', 'Absorption spectra', 'Bohr model', 'Energy levels'],
        'Nuclear Physics': ['Nuclear structure', 'Radioactive decay', 'Half-life', 'Nuclear reactions'],
        'Fission & Fusion': ['Nuclear fission', 'Nuclear fusion', 'Binding energy', 'Nuclear power'],
        'Relativity': ['Special relativity', 'Time dilation', 'Length contraction', 'Mass-energy equivalence']
      }
    }
  };

  const tools = [
    { name: 'FRQ Practice Engine', icon: <BookOpen className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600', desc: 'Master free response with step-by-step solutions' },
    { name: 'MCQ Drill Master', icon: <Target className="w-6 h-6" />, color: 'from-purple-500 to-pink-600', desc: 'Practice 1000+ AP Physics 2-style questions' },
    { name: 'Formula Sheet Pro', icon: <Brain className="w-6 h-6" />, color: 'from-orange-500 to-red-600', desc: 'All equations organized by topic' },
    { name: 'Circuit Simulator', icon: <Gauge className="w-6 h-6" />, color: 'from-green-500 to-emerald-600', desc: 'Simulate and analyze electric circuits' },
    { name: 'Mock Test Simulator', icon: <Clock className="w-6 h-6" />, color: 'from-cyan-500 to-teal-600', desc: 'Full 3-hour AP Physics 2 exam simulations' },
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
          className="flex items-center gap-2 text-purple-300 hover:text-white mb-4 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-orange-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">College Board Advanced Placement</span>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              AP Physics 2
            </h1>
            <p className="text-xl text-slate-300">Algebra-Based Electricity, Magnetism, Fluids, Thermodynamics, Optics, and Modern Physics</p>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Master advanced physics concepts & earn college credit with a perfect 5
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
                <span className="text-purple-300">Grades 10-12</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300">98% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-400" />
            About AP Physics 2
          </h2>
          <div className="space-y-4 text-lg text-slate-300">
            <p>
              AP Physics 2 is an
              <span className="text-purple-400 font-semibold"> algebra-based college-level physics course</span> that covers fluids, thermodynamics, electricity, magnetism, optics, and modern physics. This course builds upon concepts from AP Physics 1 and is equivalent to a second-semester college physics course.
            </p>
            <p>
              Scoring a 5 on the AP Physics 2 exam can
              <span className="text-pink-400 font-semibold"> earn you college credit worth thousands of dollars</span> and demonstrate your readiness for advanced STEM studies at top universities worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {[
                'Earn college credit & save tuition costs',
                'Boost your college application profile',
                'Master advanced physics concepts',
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
            Who Should Take AP Physics 2?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            {[
              'Grade 10-12 students who completed AP Physics 1',
              'Students aiming for US, Canada & International university admissions',
              'Future engineers, physicists, and STEM majors',
              'CBSE/ICSE/IGCSE and other students preparing for SAT/ACT + AP exams',
              'Students interested in advanced physics concepts',
              'Those looking to earn college credit in high school'
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
            Exam Pattern & Structure (AP Physics 2)
          </h2>
          <p className="text-slate-300 text-lg mb-8">The AP Physics 2 exam follows this format</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examPattern.map((paper, index) => (
              <div key={index} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 ${paper.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{paper.section}</h3>
                  <p className="text-lg text-purple-400 mb-6">{paper.subtitle}</p>

                  <div className="w-full space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-slate-400 mb-1">Questions</div>
                        <div className="text-xl font-bold text-white">{paper.marks}</div>
                      </div>

                      <div>
                        <div className="text-sm text-slate-400 mb-1">Duration</div>
                        <div className="text-lg font-bold text-purple-400">{paper.duration}</div>
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
              Total Duration: 3 Hours
            </h3>
            <p className="text-slate-300 text-lg">
              The exam tests both your problem-solving skills (MCQs) and your ability to explain physics concepts (FRQs)
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Complete AP Physics 2 Syllabus
          </h2>
          <p className="text-slate-400 text-lg">Click topics to explore detailed concepts</p>
        </div>

        <div className="space-y-8">
          {(() => {
            const topics = Object.entries(syllabusData);
            const groupedTopics: Array<[string, typeof syllabusData[string], string, typeof syllabusData[string]]> = [];
            
            // Group topics in pairs
            for (let i = 0; i < topics.length; i += 2) {
              if (i + 1 < topics.length) {
                groupedTopics.push([topics[i][0], topics[i][1], topics[i + 1][0], topics[i + 1][1]]);
              } else {
                // If odd number, add single topic
                groupedTopics.push([topics[i][0], topics[i][1], '', null as any]);
              }
            }

            return groupedTopics.map((group, groupIndex) => {
              const [topic1Name, topic1Data, topic2Name, topic2Data] = group;
              const topic1Index = Object.keys(syllabusData).indexOf(topic1Name);
              const topic2Index = topic2Name ? Object.keys(syllabusData).indexOf(topic2Name) : -1;
              
              // Use the first topic's color for the box border
              const boxColor = topic1Data.color;

              return (
                <div key={groupIndex} className="relative">
                  <div className={`relative rounded-3xl border border-transparent bg-gradient-to-r ${boxColor} p-1`}>
                    <div className="bg-slate-900 rounded-2xl p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* First Topic */}
                        <div className="space-y-6 md:border-r md:border-slate-700 md:pr-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 ${topic1Data.iconBg} rounded-xl flex items-center justify-center text-white shadow-xl`}>
                              {topic1Data.icon}
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 font-semibold">UNIT {topic1Index + 1}</div>
                              <h3 className="text-2xl font-bold">{topic1Name}</h3>
                            </div>
                          </div>

                          <div className="relative">
                            <div className="overflow-x-auto pb-4">
                              <div className="flex gap-3 min-w-max pb-4">
                                {topic1Data.mainTopics.map((topic, index) => (
                                  <div key={index} className="flex-shrink-0">
                                    <button
                                      onClick={() => toggleSubtopic(`${topic1Index}-${index}`)}
                                      className="group relative"
                                    >
                                      <div className={`px-6 py-3 rounded-xl font-bold text-white text-sm transition-all ${
                                        expandedSubtopic === `${topic1Index}-${index}`
                                          ? `bg-gradient-to-r ${topic1Data.color} shadow-xl scale-105`
                                          : 'bg-slate-800 hover:bg-slate-700'
                                      }`}>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xl">{topic.icon}</span>
                                          <span>{topic.name}</span>
                                        </div>
                                      </div>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className={`h-1 rounded-full bg-gradient-to-r ${topic1Data.color} mx-4`} />
                          </div>

                          {topic1Data.mainTopics.map((topic, index) => (
                            expandedSubtopic === `${topic1Index}-${index}` && (
                              <div key={`detail-${index}`} className="mt-6 animate-in fade-in duration-300">
                                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                  <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    <span className="text-2xl">{topic.icon}</span>
                                    {topic.name}
                                  </h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {topic1Data.subtopics[topic.name].map((concept, conceptIndex) => (
                                      <div
                                        key={conceptIndex}
                                        className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600 transition-all"
                                      >
                                        <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                        <span className="text-sm text-slate-300">{concept}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                        </div>

                        {/* Second Topic */}
                        {topic2Data && (
                          <div className="space-y-6 md:pl-8">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 ${topic2Data.iconBg} rounded-xl flex items-center justify-center text-white shadow-xl`}>
                                {topic2Data.icon}
                              </div>
                              <div>
                                <div className="text-xs text-slate-400 font-semibold">UNIT {topic2Index + 1}</div>
                                <h3 className="text-2xl font-bold">{topic2Name}</h3>
                              </div>
                            </div>

                            <div className="relative">
                              <div className="overflow-x-auto pb-4">
                                <div className="flex gap-3 min-w-max pb-4">
                                  {topic2Data.mainTopics.map((topic, index) => (
                                    <div key={index} className="flex-shrink-0">
                                      <button
                                        onClick={() => toggleSubtopic(`${topic2Index}-${index}`)}
                                        className="group relative"
                                      >
                                        <div className={`px-6 py-3 rounded-xl font-bold text-white text-sm transition-all ${
                                          expandedSubtopic === `${topic2Index}-${index}`
                                            ? `bg-gradient-to-r ${topic2Data.color} shadow-xl scale-105`
                                            : 'bg-slate-800 hover:bg-slate-700'
                                        }`}>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xl">{topic.icon}</span>
                                            <span>{topic.name}</span>
                                          </div>
                                        </div>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className={`h-1 rounded-full bg-gradient-to-r ${topic2Data.color} mx-4`} />
                            </div>

                            {topic2Data.mainTopics.map((topic, index) => (
                              expandedSubtopic === `${topic2Index}-${index}` && (
                                <div key={`detail-${index}`} className="mt-6 animate-in fade-in duration-300">
                                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                    <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                                      <span className="text-2xl">{topic.icon}</span>
                                      {topic.name}
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2">
                                      {topic2Data.subtopics[topic.name].map((concept, conceptIndex) => (
                                        <div
                                          key={conceptIndex}
                                          className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 hover:border-slate-600 transition-all"
                                        >
                                          <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                          <span className="text-sm text-slate-300">{concept}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-4">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Exclusive to Srikanth's Academy</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            AP Physics 2 Prep Tools
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Score a Perfect 5?</h2>
          <p className="text-xl text-purple-100 mb-8">Start your journey to AP Physics 2 mastery and earn college credit</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
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


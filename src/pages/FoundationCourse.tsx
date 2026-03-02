import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Star, Users, BookOpen, TrendingUp, CheckCircle, Target, Award, Download, Play, Clock, Activity, GraduationCap, Brain, Calendar, Lightbulb, Waves, Gauge, Atom, Magnet, X } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function FoundationCourse() {
  const navigate = useNavigate();
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<{ name: string; email: string; batch: string; batchName: string } | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    // Check if user just registered for a foundation batch
    const stored = sessionStorage.getItem('foundationRegistration');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setRegistrationData(data);
        setShowSuccessBanner(true);
        // Clear the registration data from sessionStorage after displaying
        sessionStorage.removeItem('foundationRegistration');
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  const stats = [
    { label: 'Perfect Foundation', value: '100%', icon: <Star />, color: 'text-yellow-500' },
    { label: 'Total Duration', value: '50+ hrs', icon: <Clock />, color: 'text-blue-500' },
    { label: 'Students Enrolled', value: '5K+', icon: <Users />, color: 'text-purple-500' },
    { label: 'Success Rate', value: '95%', icon: <TrendingUp />, color: 'text-green-500' }
  ];

  const syllabusData: Record<string, {
    color: string;
    icon: JSX.Element;
    iconBg: string;
    duration: string;
    mainTopics: Array<{ name: string; icon: string }>;
    subtopics: Record<string, string[]>;
  }> = {
    'Units & Measurements': {
      color: 'from-blue-500 to-cyan-400',
      icon: <Gauge className="w-8 h-8" />,
      iconBg: 'bg-blue-500',
      duration: '1 hour',
      mainTopics: [
        { name: 'Fundamental Quantities', icon: '📏' },
        { name: 'Derived Quantities', icon: '🔢' }
      ],
      subtopics: {
        'Fundamental Quantities': ['Length, Mass, Time', 'SI units', 'Base quantities', 'Dimensional analysis'],
        'Derived Quantities': ['Area, Volume, Speed', 'Acceleration, Force', 'Energy, Power', 'Unit conversions']
      }
    },
    'Kinematics': {
      color: 'from-purple-500 to-pink-500',
      icon: <Activity className="w-8 h-8" />,
      iconBg: 'bg-purple-500',
      duration: '2 hours',
      mainTopics: [
        { name: 'Motion Basics', icon: '🏃' },
        { name: 'Equations', icon: '📐' },
        { name: 'Graphs', icon: '📊' }
      ],
      subtopics: {
        'Motion Basics': ['Average Speed', 'Average Velocity', 'Acceleration', 'Instantaneous values'],
        'Equations': ['Kinematic equations', 'Motion under constant acceleration', 'Free fall', 'Projectile basics'],
        'Graphs': ['Position-time graphs', 'Velocity-time graphs', 'Acceleration-time graphs', 'Area under curves']
      }
    },
    'Laws of Motion': {
      color: 'from-orange-500 to-red-500',
      icon: <Target className="w-8 h-8" />,
      iconBg: 'bg-orange-500',
      duration: '3 hours',
      mainTopics: [
        { name: 'Newton\'s Laws', icon: '⚖️' },
        { name: 'Force Diagrams', icon: '📋' },
        { name: 'Impulse & Momentum', icon: '💥' }
      ],
      subtopics: {
        'Newton\'s Laws': ['First law (Inertia)', 'Second law (F=ma)', 'Third law (Action-Reaction)', 'Applications'],
        'Force Diagrams': ['Free body diagrams', 'Force components', 'Net force calculations', 'Equilibrium'],
        'Impulse & Momentum': ['Impulse-momentum principle', 'Momentum conservation', 'Collision basics', 'Force-time graphs']
      }
    },
    'Work, Energy and Power': {
      color: 'from-green-500 to-emerald-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-green-500',
      duration: '4 hours',
      mainTopics: [
        { name: 'Work', icon: '⚡' },
        { name: 'Energy Types', icon: '🔋' },
        { name: 'Conservation', icon: '♻️' },
        { name: 'Power', icon: '💡' }
      ],
      subtopics: {
        'Work': ['Work done definition', 'Area under force-displacement graph', 'Work-energy theorem', 'Variable forces'],
        'Energy Types': ['Kinetic energy', 'Potential energy (gravitational)', 'Potential energy (elastic)', 'Internal energy'],
        'Conservation': ['Conservation of energy', 'Energy transformations', 'Mechanical energy', 'Problem solving'],
        'Power': ['Power definition', 'Average power', 'Instantaneous power', 'Power calculations']
      }
    },
    'Rotational Motion': {
      color: 'from-yellow-500 to-orange-500',
      icon: <Activity className="w-8 h-8" />,
      iconBg: 'bg-yellow-500',
      duration: '5 hours',
      mainTopics: [
        { name: 'Center of Mass', icon: '🎯' },
        { name: 'Torque', icon: '⚙️' },
        { name: 'Angular Momentum', icon: '🌀' },
        { name: 'Moment of Inertia', icon: '🔄' }
      ],
      subtopics: {
        'Center of Mass': ['Center of mass definition', 'CM calculations', 'CM motion', 'System of particles'],
        'Torque': ['Moment of force', 'Torque definition', 'Torque calculations', 'Equilibrium conditions'],
        'Angular Momentum': ['Angular momentum definition', 'Conservation of angular momentum', 'L = Iω', 'Applications'],
        'Moment of Inertia': ['Moment of inertia concept', 'Parallel axis theorem', 'Perpendicular axis theorem', 'Common shapes']
      }
    },
    'Gravitation': {
      color: 'from-cyan-500 to-teal-500',
      icon: <Atom className="w-8 h-8" />,
      iconBg: 'bg-cyan-500',
      duration: '4 hours',
      mainTopics: [
        { name: 'Law of Gravitation', icon: '🌍' },
        { name: 'Gravity Variations', icon: '📉' },
        { name: 'Kepler\'s Laws', icon: '🛸' },
        { name: 'Orbital Motion', icon: '🚀' }
      ],
      subtopics: {
        'Law of Gravitation': ['Newton\'s law of gravitation', 'Gravitational constant', 'Gravitational field', 'Field strength'],
        'Gravity Variations': ['Acceleration due to gravity', 'Variation with altitude', 'Variation with depth', 'g vs G'],
        'Kepler\'s Laws': ['First law (Elliptical orbits)', 'Second law (Equal areas)', 'Third law (Period-square)', 'Applications'],
        'Orbital Motion': ['Orbital velocity', 'Escape velocity', 'Satellite motion', 'Geostationary satellites']
      }
    },
    'Properties of Solids & Liquids': {
      color: 'from-indigo-500 to-blue-500',
      icon: <Waves className="w-8 h-8" />,
      iconBg: 'bg-indigo-500',
      duration: '5 hours',
      mainTopics: [
        { name: 'Elasticity', icon: '🔗' },
        { name: 'Moduli', icon: '📏' },
        { name: 'Pressure', icon: '💧' },
        { name: 'Fluid Dynamics', icon: '🌊' }
      ],
      subtopics: {
        'Elasticity': ['Hooke\'s law', 'Elastic limit', 'Stress and strain', 'Elastic behavior'],
        'Moduli': ['Young\'s modulus', 'Bulk modulus', 'Rigidity modulus', 'Poisson\'s ratio'],
        'Pressure': ['Pressure definition', 'Pressure measurement', 'Pascal\'s law', 'Atmospheric pressure'],
        'Fluid Dynamics': ['Bernoulli\'s principle', 'Continuity equation', 'Venturi effect', 'Applications']
      }
    },
    'Thermodynamics & Kinetic Theory of Gases': {
      color: 'from-red-500 to-pink-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-red-500',
      duration: '5 hours',
      mainTopics: [
        { name: 'Gas Laws', icon: '💨' },
        { name: 'Thermodynamic Processes', icon: '🌡️' },
        { name: 'Work & Heat', icon: '⚡' },
        { name: 'Specific Heats', icon: '🔥' }
      ],
      subtopics: {
        'Gas Laws': ['Ideal gas equation', 'Boyle\'s law', 'Charles\' law', 'Avogadro\'s law'],
        'Thermodynamic Processes': ['Isobaric process', 'Isochoric process', 'Isothermal process', 'Adiabatic process'],
        'Work & Heat': ['Work done by gas', 'First law of thermodynamics', 'Heat transfer', 'Internal energy'],
        'Specific Heats': ['Specific heat capacity', 'Molar specific heat', 'CP and CV', 'Heat capacity ratio']
      }
    },
    'Oscillations': {
      color: 'from-pink-500 to-purple-500',
      icon: <Waves className="w-8 h-8" />,
      iconBg: 'bg-pink-500',
      duration: '4 hours',
      mainTopics: [
        { name: 'Simple Harmonic Motion', icon: '〰️' },
        { name: 'Motion Parameters', icon: '📊' },
        { name: 'Simple Pendulum', icon: '⏱️' },
        { name: 'Energy in SHM', icon: '⚡' }
      ],
      subtopics: {
        'Simple Harmonic Motion': ['SHM definition', 'Characteristics of SHM', 'Restoring force', 'SHM equations'],
        'Motion Parameters': ['Time period', 'Frequency', 'Displacement', 'Velocity & Acceleration in SHM'],
        'Simple Pendulum': ['Simple pendulum', 'Period formula', 'Small angle approximation', 'Physical pendulum'],
        'Energy in SHM': ['Potential energy', 'Kinetic energy', 'Total energy', 'Energy conservation']
      }
    },
    'Electrostatics': {
      color: 'from-blue-500 to-indigo-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-blue-500',
      duration: '5 hours',
      mainTopics: [
        { name: 'Electric Charge', icon: '⚡' },
        { name: 'Coulomb\'s Law', icon: '🔋' },
        { name: 'Electric Field', icon: '🌐' },
        { name: 'Electric Flux', icon: '💫' }
      ],
      subtopics: {
        'Electric Charge': ['Electric charges', 'Conservation of charge', 'Types of charges', 'Charging methods'],
        'Coulomb\'s Law': ['Coulomb\'s law', 'Force between charges', 'Superposition principle', 'Applications'],
        'Electric Field': ['Electric field definition', 'Field due to point charge', 'Field lines', 'Field strength'],
        'Electric Flux': ['Electric flux concept', 'Gauss\'s law basics', 'Flux calculations', 'Applications']
      }
    },
    'Current Electricity': {
      color: 'from-yellow-500 to-amber-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-yellow-500',
      duration: '4 hours',
      mainTopics: [
        { name: 'Current Basics', icon: '⚡' },
        { name: 'Ohm\'s Law', icon: '🔌' },
        { name: 'Resistance', icon: '🔋' },
        { name: 'Circuits', icon: '📡' }
      ],
      subtopics: {
        'Current Basics': ['Drift velocity', 'Mobility', 'Current definition', 'Current density'],
        'Ohm\'s Law': ['Ohm\'s law', 'Resistance definition', 'Resistivity', 'Conductivity'],
        'Resistance': ['Resistance calculations', 'Temperature dependence', 'Resistivity', 'Superconductors'],
        'Circuits': ['Resistors in series', 'Resistors in parallel', 'Combination circuits', 'Power in circuits']
      }
    },
    'Dual Nature of Matter, Atoms and Nuclei': {
      color: 'from-purple-500 to-indigo-500',
      icon: <Atom className="w-8 h-8" />,
      iconBg: 'bg-purple-500',
      duration: '5 hours',
      mainTopics: [
        { name: 'Dual Nature', icon: '🌊' },
        { name: 'Photoelectric Effect', icon: '💡' },
        { name: 'de Broglie Relation', icon: '🔬' },
        { name: 'Bohr\'s Model', icon: '⚛️' }
      ],
      subtopics: {
        'Dual Nature': ['Dual nature of radiation', 'Wave-particle duality', 'Electromagnetic spectrum', 'Photon concept'],
        'Photoelectric Effect': ['Photoelectric effect', 'Einstein\'s equation', 'Threshold frequency', 'Applications'],
        'de Broglie Relation': ['de Broglie wavelength', 'Matter waves', 'Wave nature of particles', 'Applications'],
        'Bohr\'s Model': ['Bohr\'s atomic model', 'Energy levels', 'Spectral lines', 'Hydrogen spectrum']
      }
    },
    'Optics': {
      color: 'from-cyan-500 to-blue-500',
      icon: <Lightbulb className="w-8 h-8" />,
      iconBg: 'bg-cyan-500',
      duration: '5 hours',
      mainTopics: [
        { name: 'Reflection', icon: '🪞' },
        { name: 'Spherical Mirrors', icon: '🔍' },
        { name: 'Refraction', icon: '💎' },
        { name: 'Total Internal Reflection', icon: '✨' }
      ],
      subtopics: {
        'Reflection': ['Laws of reflection', 'Plane mirrors', 'Image formation', 'Mirror applications'],
        'Spherical Mirrors': ['Concave mirrors', 'Convex mirrors', 'Mirror formula', 'Magnification'],
        'Refraction': ['Refraction of light', 'Refraction at plane surfaces', 'Refraction at spherical surfaces', 'Lens formula'],
        'Total Internal Reflection': ['Total internal reflection', 'Critical angle', 'Optical fibers', 'Applications']
      }
    }
  };

  const toggleSubtopic = (topic: string) => {
    setExpandedSubtopic(expandedSubtopic === topic ? null : topic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white">
      <CourseNavigation />

      {/* Success Banner */}
      {showSuccessBanner && registrationData && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl border border-green-500/30 relative">
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Registration Successful! 🎉</h3>
                <p className="text-green-50 mb-1">
                  Thanks, <span className="font-semibold">{registrationData.name}</span>! You've successfully registered for <span className="font-semibold">{registrationData.batchName}</span>.
                </p>
                <p className="text-green-100 text-sm">
                  We'll reach out to <span className="font-semibold">{registrationData.email}</span> within 24 hours with further details.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-orange-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full border border-orange-500/30">
              <GraduationCap className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-300">Foundation Course for Physics</span>
            </div>

            <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
              Foundation Course
            </h1>
            <p className="text-xl text-slate-300">Complete Physics Fundamentals</p>
            <p className="text-2xl text-slate-400 max-w-3xl mx-auto">
              Build a strong foundation in physics concepts from basics to advanced topics
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                <BookOpen className="w-5 h-5 text-green-400" />
                <span className="text-green-300">13 Comprehensive Units</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300">50+ Hours</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300">All Grade Levels</span>
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
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
            Complete Foundation Course Syllabus
          </h2>
          <p className="text-slate-400 text-lg">Click topics to explore detailed concepts</p>
        </div>

        <div className="space-y-8">
          {Object.entries(syllabusData).map(([topicName, data], topicIndex) => (
            <div key={topicIndex} className="relative">
              <div className={`relative rounded-3xl border-4 border-transparent bg-gradient-to-r ${data.color} p-1`}>
                <div className="bg-slate-900 rounded-2xl p-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className={`w-16 h-16 ${data.iconBg} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
                      {data.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-slate-400 font-semibold">UNIT {topicIndex + 1}</div>
                        <div className="text-sm text-slate-400 font-semibold bg-slate-800 px-3 py-1 rounded-lg">
                          {data.duration}
                        </div>
                      </div>
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
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Your Physics Foundation?</h2>
          <p className="text-xl text-orange-100 mb-8">Start your journey with comprehensive fundamentals</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                localStorage.setItem('selectedCourse', 'foundation');
                navigate('/demo');
              }}
              className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all flex items-center gap-2"
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

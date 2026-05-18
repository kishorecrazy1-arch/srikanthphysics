import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Play,
  Clock,
  GraduationCap,
  Lightbulb,
  X,
  Atom,
  FlaskConical,
  Beaker,
  Droplets,
  Layers,
  Wind,
} from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function ChemistryFoundationCourse() {
  const navigate = useNavigate();
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<{
    name: string;
    email: string;
    batch: string;
    batchName: string;
  } | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('foundationRegistration');
    if (stored) {
      try {
        const data = JSON.parse(stored) as {
          name: string;
          email: string;
          batch: string;
          batchName: string;
        };
        setRegistrationData(data);
        setShowSuccessBanner(true);
        sessionStorage.removeItem('foundationRegistration');
      } catch {
        /* ignore */
      }
    }
  }, []);

  const stats = [
    { label: 'IIT foundation focus', value: '100%', icon: <Star />, color: 'text-emerald-400' },
    { label: 'Program length', value: '15 days', icon: <Clock />, color: 'text-teal-400' },
    { label: 'Core modules', value: '7', icon: <TrendingUp />, color: 'text-cyan-400' },
  ];

  /** IIT Foundation crash course — Chemistry */
  const syllabusData: Record<
    string,
    {
      color: string;
      icon: JSX.Element;
      iconBg: string;
      duration: string;
      mainTopics: Array<{ name: string; icon: string }>;
      subtopics: Record<string, string[]>;
    }
  > = {
    'Basic Concepts of Chemistry': {
      color: 'from-emerald-500 to-teal-500',
      icon: <Atom className="w-8 h-8" />,
      iconBg: 'bg-emerald-600',
      duration: 'Module 1',
      mainTopics: [
        { name: 'Nature of Matter', icon: '🧪' },
        { name: 'Atomic Structure', icon: '⚛️' },
        { name: 'Mole Concept', icon: '⚖️' },
      ],
      subtopics: {
        'Nature of Matter': [
          'Classification of matter',
          'Physical and chemical properties',
          'Intensive and extensive properties',
          'States of matter and intermolecular forces',
          'Plasma and Bose–Einstein condensate (intro)',
          'Diffusion and Brownian motion',
        ],
        'Atomic Structure': [
          'Atomic number and mass number',
          'Isotopes and isobars',
          'Electronic configuration',
          'Quantum numbers (intro)',
          'Aufbau principle',
          "Hund's rule",
          'Pauli exclusion principle',
          'Orbitals: s, p, d, f basics',
        ],
        'Mole Concept': [
          'Relative atomic and molecular mass',
          'Avogadro number',
          'Percentage composition',
          'Empirical and molecular formula',
        ],
      },
    },
    'Chemical Reactions & Energetics': {
      color: 'from-teal-500 to-cyan-500',
      icon: <FlaskConical className="w-8 h-8" />,
      iconBg: 'bg-teal-600',
      duration: 'Module 2',
      mainTopics: [
        { name: 'Chemical Reactions', icon: '🔥' },
        { name: 'Thermochemistry', icon: '🌡️' },
      ],
      subtopics: {
        'Chemical Reactions': [
          'Balancing equations',
          'Redox reactions',
          'Oxidation number method',
          'Types of reactions',
        ],
        Thermochemistry: [
          'Exothermic and endothermic reactions',
          'Heat of reaction',
          'Calorimetry basics',
          "Hess's law (intro)",
          'Bond energy calculations',
        ],
      },
    },
    'Periodic Table & Chemical Bonding': {
      color: 'from-cyan-500 to-blue-500',
      icon: <Layers className="w-8 h-8" />,
      iconBg: 'bg-cyan-600',
      duration: 'Module 3',
      mainTopics: [
        { name: 'Periodic Classification', icon: '📋' },
        { name: 'Chemical Bonding', icon: '🔗' },
      ],
      subtopics: {
        'Periodic Classification': [
          'Dobereiner triads',
          'Newlands law of octaves',
          'Mendeleev periodic table',
          'Modern periodic table',
          'Atomic radius',
          'Ionization energy',
          'Electron affinity',
          'Electronegativity',
          'Metallic/non-metallic character',
        ],
        'Chemical Bonding': [
          'Valency',
          'Ionic and covalent bonds',
          'Coordinate bond basics',
          'Octet rule',
          'Lewis structures',
          'Polar and non-polar molecules',
          'Hydrogen bonding',
        ],
      },
    },
    'Acids, Bases & Salt Chemistry': {
      color: 'from-lime-500 to-green-500',
      icon: <Droplets className="w-8 h-8" />,
      iconBg: 'bg-lime-600',
      duration: 'Module 4',
      mainTopics: [{ name: 'Acids, bases & salts', icon: '🧫' }],
      subtopics: {
        'Acids, bases & salts': [
          'Arrhenius concept',
          'pH scale',
          'Neutralization reactions',
          'Indicators',
          'Bronsted–Lowry acids and bases',
          'Lewis acids and bases (intro)',
        ],
      },
    },
    'Metals, Non-Metals & Metallurgy': {
      color: 'from-amber-500 to-orange-500',
      icon: <Beaker className="w-8 h-8" />,
      iconBg: 'bg-amber-600',
      duration: 'Module 5',
      mainTopics: [{ name: 'Metals & non-metals', icon: '⚙️' }],
      subtopics: {
        'Metals & non-metals': [
          'Physical and chemical properties',
          'Reactivity series',
          'Corrosion',
          'Metallurgy basics',
          'Alloys and applications',
        ],
      },
    },
    'Carbon & Organic Chemistry Foundation': {
      color: 'from-green-500 to-emerald-500',
      icon: <BookOpen className="w-8 h-8" />,
      iconBg: 'bg-green-600',
      duration: 'Module 6',
      mainTopics: [
        { name: 'Hydrocarbons', icon: '🛢️' },
        { name: 'Functional Groups', icon: '🧬' },
      ],
      subtopics: {
        Hydrocarbons: [
          'Saturated and unsaturated hydrocarbons',
          'Alkanes, alkenes, alkynes',
          'Isomerism basics',
        ],
        'Functional Groups': [
          'Alcohols',
          'Aldehydes',
          'Ketones',
          'Carboxylic acids',
          'IUPAC nomenclature',
          'Homologous series',
        ],
      },
    },
    'States of Matter & Gas Laws': {
      color: 'from-sky-500 to-indigo-500',
      icon: <Wind className="w-8 h-8" />,
      iconBg: 'bg-sky-600',
      duration: 'Module 7',
      mainTopics: [{ name: 'Gases & kinetic theory', icon: '💨' }],
      subtopics: {
        'Gases & kinetic theory': [
          'Kinetic theory of gases',
          "Boyle's law",
          "Charles' law",
          'Gay-Lussac law',
          'Ideal gas equation',
          "Dalton's law of partial pressure",
        ],
      },
    },
  };

  const toggleSubtopic = (topic: string) => {
    setExpandedSubtopic(expandedSubtopic === topic ? null : topic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white">
      <CourseNavigation />

      {showSuccessBanner && registrationData && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 shadow-xl border border-emerald-500/30 relative">
            <button
              type="button"
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
                <h3 className="text-2xl font-bold mb-2">Registration successful</h3>
                <p className="text-emerald-50 mb-1">
                  Thanks, <span className="font-semibold">{registrationData.name}</span>! You registered for{' '}
                  <span className="font-semibold">{registrationData.batchName}</span>.
                </p>
                <p className="text-fuchsia-100 text-sm">
                  We will contact <span className="font-semibold">{registrationData.email}</span> within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-500/20 rounded-full border border-emerald-500/30">
              <GraduationCap className="w-4 h-4 text-fuchsia-300" />
              <span className="text-sm text-fuchsia-200">IIT Foundation crash course</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Chemistry Foundation
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Starts <span className="text-emerald-300 font-medium">19 May 2026 · 8:00 PM IST</span> — 15-day intensive foundation
              for Class 9–12 (IIT JEE / NEET chemistry).
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-violet-500/20 rounded-xl border border-violet-500/30">
                <BookOpen className="w-5 h-5 text-violet-300" />
                <span className="text-emerald-200">7 modules</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-fuchsia-500/20 rounded-xl border border-emerald-500/30">
                <Clock className="w-5 h-5 text-fuchsia-300" />
                <span className="text-teal-200">15 days · from 19 May</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                <Clock className="w-5 h-5 text-cyan-300" />
                <span className="text-cyan-200">8:00 PM IST</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-6">
                <div className={stat.color}>{stat.icon && <div className="w-12 h-12">{stat.icon}</div>}</div>
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
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
            Syllabus — IIT Foundation crash course
          </h2>
          <p className="text-slate-400 text-lg">Click a topic chip to expand subtopics (edit this page when your final syllabus is fixed).</p>
        </div>

        <div className="space-y-8">
          {Object.entries(syllabusData).map(([topicName, data], topicIndex) => (
            <div key={topicName} className="relative">
              <div className={`relative rounded-3xl border-4 border-transparent bg-gradient-to-r ${data.color} p-1`}>
                <div className="bg-slate-900 rounded-2xl p-8">
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div
                      className={`w-16 h-16 ${data.iconBg} rounded-2xl flex items-center justify-center text-white shadow-xl`}
                    >
                      {data.icon}
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 font-semibold">MODULE {topicIndex + 1}</div>
                      <h3 className="text-3xl font-bold">{topicName}</h3>
                      <p className="text-slate-500 text-sm mt-1">{data.duration}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4 min-w-max pb-4">
                      {data.mainTopics.map((topic, index) => (
                        <div key={topic.name} className="flex-shrink-0">
                          <button type="button" onClick={() => toggleSubtopic(`${topicIndex}-${index}`)} className="group relative">
                            <div
                              className={`px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all ${
                                expandedSubtopic === `${topicIndex}-${index}`
                                  ? `bg-gradient-to-r ${data.color} shadow-xl scale-105`
                                  : 'bg-slate-800 hover:bg-slate-700'
                              }`}
                            >
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

                  {data.mainTopics.map((topic, index) =>
                    expandedSubtopic === `${topicIndex}-${index}` ? (
                      <div key={`detail-${topic.name}`} className="mt-8">
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                          <h4 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <span className="text-3xl">{topic.icon}</span>
                            {topic.name}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.subtopics[topic.name].map((concept, conceptIndex) => (
                              <div
                                key={conceptIndex}
                                className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50"
                              >
                                <Lightbulb className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                <span className="text-slate-300">{concept}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for Chemistry Foundation?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Starts 19 May 2026 at 8:00 PM IST — 15-day IIT foundation crash course. Register to secure your seat.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('selectedCourse', 'chemistry-foundation');
                localStorage.setItem('selectedBatch', 'chemistry-foundation-batch');
                navigate('/demo');
              }}
              className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

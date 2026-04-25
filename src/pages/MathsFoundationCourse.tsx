import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Download,
  Play,
  Clock,
  GraduationCap,
  Lightbulb,
  X,
  Sigma,
  LineChart,
  Shapes,
  Grid3x3,
} from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

/** Syllabus PDF (static asset) */
const MATHS_SYLLABUS_PDF = '/maths%20syllabus.pdf';

export function MathsFoundationCourse() {
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
    { label: 'Strong numeracy', value: '100%', icon: <Star />, color: 'text-fuchsia-400' },
    { label: 'Program length', value: '1 month', icon: <Clock />, color: 'text-violet-400' },
    { label: 'Success rate', value: '95%', icon: <TrendingUp />, color: 'text-emerald-400' },
  ];

  /** Maths syllabus mapped from uploaded PDF in public/maths syllabus.pdf */
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
    'Quadratic Equations': {
      color: 'from-fuchsia-500 to-pink-500',
      icon: <Sigma className="w-8 h-8" />,
      iconBg: 'bg-fuchsia-600',
      duration: '12 hours',
      mainTopics: [
        { name: 'Polynomials & roots', icon: '📝' },
        { name: 'Root behavior', icon: '📈' },
      ],
      subtopics: {
        'Polynomials & roots': [
          'Polynomials',
          'Relations between roots and coefficient',
          'Formation of quadratic equations with given roots',
          'Nature of roots',
        ],
        'Root behavior': ['Transformation of equations', 'Common roots', 'Analysis of graph of quadratic', 'Location of roots'],
      },
    },
    'Sequence and Series': {
      color: 'from-purple-500 to-indigo-500',
      icon: <LineChart className="w-8 h-8" />,
      iconBg: 'bg-indigo-600',
      duration: '8 hours',
      mainTopics: [
        { name: 'Progressions', icon: '🔁' },
        { name: 'Means & special series', icon: '📊' },
      ],
      subtopics: {
        Progressions: ['Nth term of a sequence', 'Arithmetic progression', 'Sum of terms in A.P.', 'Geometric progression'],
        'Means & special series': ['Arithmetic mean', 'Sum of terms in G.P.', 'Geometric mean', 'Arithmetico-geometric & harmonic progression'],
      },
    },
    Trigonometry: {
      color: 'from-violet-500 to-purple-500',
      icon: <Shapes className="w-8 h-8" />,
      iconBg: 'bg-violet-600',
      duration: '6 hours',
      mainTopics: [
        { name: 'Angles & polygons', icon: '📐' },
        { name: 'Trig functions', icon: '⚖️' },
      ],
      subtopics: {
        'Angles & polygons': ['System of measuring an angle', 'Regular polygon'],
        'Trig functions': ['Trigonometric functions', 'Compound angles formulae'],
      },
    },
    Sets: {
      color: 'from-cyan-500 to-blue-500',
      icon: <Grid3x3 className="w-8 h-8" />,
      iconBg: 'bg-cyan-600',
      duration: '5 hours',
      mainTopics: [
        { name: 'Set basics', icon: '📦' },
        { name: 'Set operations', icon: '🧩' },
      ],
      subtopics: {
        'Set basics': ['Definition and description of sets', 'Types of sets', 'Subset & power set'],
        'Set operations': ['Operation on sets', 'Cardinality based problems'],
      },
    },
    'Relations & Functions': {
      color: 'from-blue-500 to-indigo-500',
      icon: <TrendingUp className="w-8 h-8" />,
      iconBg: 'bg-blue-600',
      duration: '8 hours',
      mainTopics: [
        { name: 'Relations', icon: '🔗' },
        { name: 'Functions', icon: '📈' },
      ],
      subtopics: {
        Relations: ['Cartesian product of sets', 'Relation', 'Inverse relation'],
        Functions: ['Definition & associated terms of a function', 'Classification of function', 'Domain of a function', 'Modulus and greatest integer functions'],
      },
    },
    Lines: {
      color: 'from-rose-500 to-orange-500',
      icon: <LineChart className="w-8 h-8" />,
      iconBg: 'bg-rose-600',
      duration: '8 hours',
      mainTopics: [
        { name: 'Coordinate geometry basics', icon: '📍' },
        { name: 'Line equations', icon: '📏' },
      ],
      subtopics: {
        'Coordinate geometry basics': [
          'Cartesian system of rectangular coordinates in a plane',
          'Section formula',
          'Centres of a triangle',
          'Area of a triangle and collinearity',
        ],
        'Line equations': ['Line equation', 'The slope of a line'],
      },
    },
    Probability: {
      color: 'from-emerald-500 to-teal-500',
      icon: <Shapes className="w-8 h-8" />,
      iconBg: 'bg-teal-600',
      duration: '6 hours',
      mainTopics: [
        { name: 'Probability basics', icon: '🎲' },
        { name: 'Combinatorics tools', icon: '🧮' },
      ],
      subtopics: {
        'Probability basics': ['Probability of an event', 'Probability of non occurrence of an event', 'Classification of pack of cards'],
        'Combinatorics tools': ['Factorial notation', 'nCr and nPr notation', 'Problems based on nCr and nPr'],
      },
    },
    Logarithms: {
      color: 'from-lime-500 to-green-500',
      icon: <BookOpen className="w-8 h-8" />,
      iconBg: 'bg-lime-600',
      duration: '4 hours',
      mainTopics: [
        { name: 'Log basics', icon: '📘' },
        { name: 'Log rules', icon: '➕' },
      ],
      subtopics: {
        'Log basics': ['Conversion of exponential form into logarithmic form'],
        'Log rules': ['Addition and subtraction rules of logarithm'],
      },
    },
    Statistics: {
      color: 'from-amber-500 to-yellow-500',
      icon: <Grid3x3 className="w-8 h-8" />,
      iconBg: 'bg-amber-600',
      duration: '5 hours',
      mainTopics: [
        { name: 'Data types & central tendency', icon: '📊' },
        { name: 'Dispersion', icon: '📉' },
      ],
      subtopics: {
        'Data types & central tendency': ['Types of Data', 'Mean of grouped data', 'Mean, Mode and Median'],
        Dispersion: ['Standard Deviation and Variance'],
      },
    },
  };

  const toggleSubtopic = (topic: string) => {
    setExpandedSubtopic(expandedSubtopic === topic ? null : topic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white">
      <CourseNavigation />

      {showSuccessBanner && registrationData && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-6 shadow-xl border border-fuchsia-500/30 relative">
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
                <p className="text-fuchsia-50 mb-1">
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
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-purple-500/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-500/20 rounded-full border border-fuchsia-500/30">
              <GraduationCap className="w-4 h-4 text-fuchsia-300" />
              <span className="text-sm text-fuchsia-200">Foundation course for Mathematics</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-fuchsia-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">
              Maths Foundation
            </h1>
            <p className="text-xl text-slate-300">Please give some time to change the today it self.</p>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Suitable for all grades. IITJEE/ CBSE/ ICSE / CBSE / AQA / IB / ADVANCED PLACEMENT
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-violet-500/20 rounded-xl border border-violet-500/30">
                <BookOpen className="w-5 h-5 text-violet-300" />
                <span className="text-violet-200">9 core units (expandable)</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/30">
                <Clock className="w-5 h-5 text-fuchsia-300" />
                <span className="text-fuchsia-200">1 month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
            Maths Foundation syllabus
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
                      <div className="text-sm text-slate-400 font-semibold">UNIT {topicIndex + 1}</div>
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
                                <Lightbulb className="w-5 h-5 text-fuchsia-400 flex-shrink-0" />
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
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for Maths Foundation?</h2>
          <p className="text-xl text-fuchsia-100 mb-8">Book demo or download the syllabus PDF.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('selectedCourse', 'maths-foundation');
                navigate('/demo');
              }}
              className="px-8 py-4 bg-white text-violet-700 rounded-xl font-bold hover:bg-fuchsia-50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Register / Demo
            </button>
            <button
              type="button"
              onClick={() => {
                const link = document.createElement('a');
                link.href = MATHS_SYLLABUS_PDF;
                link.download = 'maths syllabus.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download syllabus PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

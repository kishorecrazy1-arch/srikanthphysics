import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  TrendingUp,
  CheckCircle,
  Play,
  Clock,
  Lightbulb,
  X,
  Atom,
  Cpu,
  Waves,
  Zap,
  Brain,
  Users,
  Video,
  Calendar,
} from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function QuantumPhysicsCourse() {
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
    localStorage.setItem('selectedCourse', 'quantum');
    localStorage.setItem('selectedBatch', 'quantum-webinar-batch');
  }, []);

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

  const openRegistration = () => {
    localStorage.setItem('selectedCourse', 'quantum');
    localStorage.setItem('selectedBatch', 'quantum-webinar-batch');
    navigate('/demo', { state: { selectedBatch: 'quantum-webinar-batch' } });
  };

  const stats = [
    { label: 'Live webinar', value: 'Free', icon: <Star />, color: 'text-indigo-400' },
    { label: 'Duration', value: '60 mins', icon: <Clock />, color: 'text-purple-400' },
    { label: 'Core modules', value: '5', icon: <TrendingUp />, color: 'text-violet-400' },
  ];

  const audience = [
    'B.Tech Students (CSE / ECE / EEE / IT / Data Science)',
    'Engineering Graduates',
    'Working Professionals',
    'Quantum Computing Enthusiasts',
    'Anyone interested in next-generation computing',
  ];

  const takeaways = [
    'Strong foundation in Quantum Computing',
    'Clear understanding of Superposition',
    'Clear understanding of Interference',
    'Physics intuition behind Quantum Algorithms',
    'Career guidance in Quantum Computing',
  ];

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
    'Introduction to Quantum Computing': {
      color: 'from-indigo-500 to-purple-500',
      icon: <Cpu className="w-8 h-8" />,
      iconBg: 'bg-indigo-600',
      duration: '0–10 mins',
      mainTopics: [
        { name: 'Why Quantum Computing matters', icon: '🌐' },
        { name: 'Classical vs Quantum Computing', icon: '⚖️' },
        { name: 'Real-world applications', icon: '🚀' },
      ],
      subtopics: {
        'Why Quantum Computing matters': [
          'Why Quantum Computing matters',
          'The next frontier of computation',
          'Impact on science, industry, and technology',
        ],
        'Classical vs Quantum Computing': [
          'Classical Computing vs Quantum Computing',
          'Limits of classical algorithms',
          'Where quantum approaches offer advantage',
        ],
        'Real-world applications': [
          'Real-world applications of Quantum Computing',
          'Cryptography, drug discovery, optimization',
          'Current industry and research landscape',
        ],
      },
    },
    'Understanding Superposition': {
      color: 'from-purple-500 to-violet-500',
      icon: <Atom className="w-8 h-8" />,
      iconBg: 'bg-purple-600',
      duration: '10–25 mins',
      mainTopics: [
        { name: 'Classical Bits vs Qubits', icon: '🔢' },
        { name: 'What is Superposition?', icon: '⚛️' },
        { name: 'Computational advantage', icon: '💡' },
      ],
      subtopics: {
        'Classical Bits vs Qubits': [
          'Classical Bits vs Qubits',
          'Binary states vs quantum states',
          'The qubit as the basic unit of quantum information',
        ],
        'What is Superposition?': [
          'What is Superposition?',
          'Mathematical intuition behind quantum states',
          'Visualising superposition conceptually',
        ],
        'Computational advantage': [
          'Why Superposition gives computational advantage',
          'Exploring multiple possibilities simultaneously',
          'From physics intuition to algorithm design',
        ],
      },
    },
    'Understanding Interference': {
      color: 'from-violet-500 to-fuchsia-500',
      icon: <Waves className="w-8 h-8" />,
      iconBg: 'bg-violet-600',
      duration: '25–40 mins',
      mainTopics: [
        { name: 'Constructive Interference', icon: '📈' },
        { name: 'Destructive Interference', icon: '📉' },
        { name: 'Probability amplitudes', icon: '🎯' },
      ],
      subtopics: {
        'Constructive Interference': [
          'Constructive Interference',
          'How waves combine to amplify outcomes',
          'Building up the correct answer',
        ],
        'Destructive Interference': [
          'Destructive Interference',
          'Canceling wrong possibilities',
          'Filtering incorrect solutions',
        ],
        'Probability amplitudes': [
          'Probability amplitudes',
          'How interference helps identify correct solutions',
          'From amplitudes to measurement probabilities',
        ],
      },
    },
    'How Quantum Algorithms Work': {
      color: 'from-fuchsia-500 to-pink-500',
      icon: <Zap className="w-8 h-8" />,
      iconBg: 'bg-fuchsia-600',
      duration: '40–55 mins',
      mainTopics: [
        { name: 'Superposition in algorithms', icon: '🔀' },
        { name: 'Interference in algorithms', icon: '🌊' },
        { name: "Grover's Algorithm", icon: '🔍' },
      ],
      subtopics: {
        'Superposition in algorithms': [
          'How Superposition creates multiple possibilities',
          'Searching solution spaces in parallel',
          'The role of superposition in quantum speedup',
        ],
        'Interference in algorithms': [
          'How Interference amplifies correct answers',
          'Combining both to build powerful quantum algorithms',
          'The superposition + interference recipe',
        ],
        "Grover's Algorithm": [
          "Conceptual understanding using Grover's Algorithm",
          'How Grover combines superposition and interference',
          'Building intuition without heavy mathematics',
        ],
      },
    },
    'Live Q&A + Career Guidance': {
      color: 'from-pink-500 to-rose-500',
      icon: <Brain className="w-8 h-8" />,
      iconBg: 'bg-pink-600',
      duration: '55–60 mins',
      mainTopics: [
        { name: 'Career opportunities', icon: '💼' },
        { name: 'Learning roadmap', icon: '🗺️' },
        { name: 'Live Q&A', icon: '💬' },
      ],
      subtopics: {
        'Career opportunities': [
          'Career opportunities in Quantum Computing',
          'Roles in research, software, and hardware',
          'Industry trends and hiring landscape',
        ],
        'Learning roadmap': [
          'Learning roadmap for beginners',
          'Physics first, then programming',
          'Recommended next steps after the webinar',
        ],
        'Live Q&A': [
          'Live Q&A session',
          'Ask your questions directly',
          'Personalised guidance from the instructor',
        ],
      },
    },
  };

  const toggleSubtopic = (topic: string) => {
    setExpandedSubtopic(expandedSubtopic === topic ? null : topic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <CourseNavigation />

      {showSuccessBanner && registrationData && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl border border-indigo-500/30 relative">
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
                <p className="text-indigo-50 mb-1">
                  Thanks, <span className="font-semibold">{registrationData.name}</span>! You registered for{' '}
                  <span className="font-semibold">{registrationData.batchName}</span>.
                </p>
                <p className="text-purple-100 text-sm">
                  We will contact <span className="font-semibold">{registrationData.email}</span> with webinar
                  details.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-violet-500/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-400/40 text-indigo-200 text-sm font-semibold uppercase tracking-wide">
              <Video className="w-4 h-4" />
              Live Webinar on Quantum Computing
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 bg-clip-text text-transparent leading-tight">
              How Superposition + Interference Build Quantum Algorithms
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Quantum Computing is not just about coding. It begins with understanding the physics behind
              computation. Join this free live webinar to build strong conceptual clarity on the two principles
              that power almost every quantum algorithm.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-6 py-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                <Calendar className="w-5 h-5 text-indigo-300" />
                <span className="text-indigo-200">Sunday, 28th June 2026</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <Clock className="w-5 h-5 text-purple-300" />
                <span className="text-purple-200">11:00 AM – 12:00 PM IST</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-violet-500/20 rounded-xl border border-violet-500/30">
                <Video className="w-5 h-5 text-violet-300" />
                <span className="text-violet-200">Online Live Webinar · 60 Minutes</span>
              </div>
            </div>
            <button
              type="button"
              onClick={openRegistration}
              className="text-amber-300 font-semibold text-lg pt-2 hover:text-amber-200 transition-colors underline-offset-4 hover:underline"
            >
              🚀 Limited Seats | Free Registration | Reserve Your Spot Now
            </button>
            <div className="pt-4">
              <button
                type="button"
                onClick={openRegistration}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-400 hover:to-purple-500 transition-all flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                Register for Free
              </button>
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

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              About the Webinar
            </h2>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Quantum Computing is one of the most exciting technologies shaping the future of computing.
              </p>
              <p>
                Today, many students and professionals can write quantum code using modern tools and frameworks.
                However, very few truly understand the physics behind quantum algorithms.
              </p>
              <p>
                This webinar is designed to help participants understand the two most fundamental principles
                behind Quantum Computing: <span className="text-indigo-300 font-medium">Superposition</span> and{' '}
                <span className="text-purple-300 font-medium">Interference</span>. These two concepts form the
                foundation of almost every quantum algorithm.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
              <Users className="w-6 h-6 text-purple-400" />
              Who Should Attend?
            </h2>
            <ul className="space-y-3">
              {audience.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Webinar Syllabus (60 Minutes)
          </h2>
          <p className="text-slate-400 text-lg">
            5 modules covering Superposition, Interference, and how they combine to build quantum algorithms —
            click a topic chip to expand subtopics.
          </p>
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
                          <button
                            type="button"
                            onClick={() => toggleSubtopic(`${topicIndex}-${index}`)}
                            className="group relative"
                          >
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
                                <Lightbulb className="w-5 h-5 text-indigo-400 flex-shrink-0" />
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

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            Key Takeaways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {takeaways.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 mt-8 italic max-w-2xl mx-auto">
            Quantum Computing is not just about coding. It begins with understanding the physics behind
            computation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Reserve Your Free Spot</h2>
          <p className="text-xl text-indigo-100 mb-2">
            Sunday, 28th June 2026 · 11:00 AM – 12:00 PM IST · Online Live Webinar
          </p>
          <p className="text-lg text-purple-200 mb-8 font-semibold">
            🚀 Limited Seats | Free Registration
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={openRegistration}
              className="px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Register for Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

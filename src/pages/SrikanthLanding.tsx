import { useNavigate } from 'react-router-dom';
import {
  Award, TrendingUp, Target, Zap, CheckCircle, Star,
  Flame, Users, Trophy, ArrowRight, Play, Facebook, Instagram,
  Youtube, Linkedin, Mail, Phone, MapPin, Clock, Brain, Rocket,
  BarChart3, Medal, Activity, Lightbulb, FileText, Globe
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useEffect, useState } from 'react';
import { CourseNavigation } from '../components/CourseNavigation';

export function SrikanthLanding() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      text: "I scored 156/180 in NEET Physics thanks to Srikanth's Academy. The daily quizzes kept me consistent, and the AI adapted perfectly to my learning pace. Best decision ever!",
      name: "Priya Sharma",
      rank: "NEET 2024, AIR 234",
      rating: 5
    },
    {
      text: "Perfect 5/5 in AP Physics C! The spaced repetition and adaptive difficulty made complex topics like rotational dynamics crystal clear. Srikanth Sir's explanations are unmatched.",
      name: "Arjun Reddy",
      rank: "AP Physics C 5/5, MIT Class of 2028",
      rating: 5
    },
    {
      text: "From struggling with Newton's Laws to scoring 98.17% in JEE Mains! The gamification kept me motivated, and the progress tracking helped me focus on weak areas. Highly recommended!",
      name: "Rahul Kumar",
      rank: "JEE Mains 2024, 98.17 percentile, IIT Bombay",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <CourseNavigation />

      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-white text-8xl physics-formula animate-float-slow">E=mc²</div>
          <div className="absolute top-40 right-20 text-white text-6xl physics-formula animate-float-slow" style={{ animationDelay: '1s' }}>F=ma</div>
          <div className="absolute bottom-40 left-1/4 text-white text-7xl physics-formula animate-float-slow" style={{ animationDelay: '2s' }}>KE=½mv²</div>
          <div className="absolute bottom-20 right-1/3 text-white text-5xl physics-formula animate-float-slow" style={{ animationDelay: '1.5s' }}>P=mgh</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-6">
                <div className="flex items-center gap-3 bg-blue-600 px-6 py-3 rounded-xl text-white font-semibold shadow-lg">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-base">Trusted by Students Worldwide</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Master Physics.<br/>
                Ace Your Exam.<br/>
                <span className="text-yellow-400">Transform Your Future.</span>
              </h1>

              <p className="text-xl text-blue-100 mb-4">
                AI-powered daily practice for IIT JEE, NEET, and AP Physics students
              </p>
              <p className="text-lg text-blue-200 mb-8">
                Join students who achieved top ranks with Srikanth's Academy
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => {
                    localStorage.setItem('selectedCourse', 'ap-physics');
                    navigate('/signup');
                  }}
                  className="px-8 py-4 bg-white text-blue-800 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl animate-pulse-glow flex items-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  className="px-8 py-4 bg-blue-700 bg-opacity-50 text-white rounded-xl font-bold text-lg hover:bg-opacity-70 transition-all border-2 border-white border-opacity-30 flex items-center gap-2"
                >
                  <Play className="w-5 h-5" /> Watch Demo
                </button>
              </div>

              <div className="flex flex-wrap gap-6 text-white text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No credit card required</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-white font-semibold">from students</span>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative w-full h-[600px]">
                <svg className="w-full h-full" viewBox="0 0 500 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>

                  <g className="animate-float-slow">
                    <circle cx="250" cy="300" r="150" fill="url(#brainGradient)" opacity="0.1" />
                    <circle cx="250" cy="300" r="130" fill="url(#brainGradient)" opacity="0.15" />
                    <circle cx="250" cy="300" r="110" fill="url(#brainGradient)" opacity="0.2" />
                  </g>

                  <g className="animate-float" style={{ animationDelay: '0.5s' }}>
                    <circle cx="250" cy="300" r="80" fill="rgba(96, 165, 250, 0.3)" filter="url(#glow)" />
                  </g>

                  <g>
                    <circle cx="200" cy="150" r="8" fill="#fbbf24" filter="url(#glow)">
                      <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="300" cy="170" r="8" fill="#60a5fa" filter="url(#glow)">
                      <animate attributeName="r" values="8;12;8" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="350" cy="280" r="8" fill="#10b981" filter="url(#glow)">
                      <animate attributeName="r" values="8;12;8" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="320" cy="400" r="8" fill="#f59e0b" filter="url(#glow)">
                      <animate attributeName="r" values="8;12;8" dur="2.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="180" cy="420" r="8" fill="#a78bfa" filter="url(#glow)">
                      <animate attributeName="r" values="8;12;8" dur="2.3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="150" cy="300" r="8" fill="#ec4899" filter="url(#glow)">
                      <animate attributeName="r" values="8;12;8" dur="2.6s" repeatCount="indefinite" />
                    </circle>
                  </g>

                  <g stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                    <line x1="200" y1="150" x2="250" y2="300">
                      <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
                    </line>
                    <line x1="300" y1="170" x2="250" y2="300">
                      <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite" />
                    </line>
                    <line x1="350" y1="280" x2="250" y2="300">
                      <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3.2s" repeatCount="indefinite" />
                    </line>
                    <line x1="320" y1="400" x2="250" y2="300">
                      <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3.8s" repeatCount="indefinite" />
                    </line>
                    <line x1="180" y1="420" x2="250" y2="300">
                      <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3.3s" repeatCount="indefinite" />
                    </line>
                    <line x1="150" y1="300" x2="250" y2="300">
                      <animate attributeName="stroke-opacity" values="0.2;0.6;0.2" dur="3.6s" repeatCount="indefinite" />
                    </line>
                  </g>

                  <g className="animate-pulse-glow">
                    <circle cx="250" cy="300" r="60" fill="rgba(59, 130, 246, 0.3)" />
                    <path d="M 240 280 Q 250 290 260 280 Q 250 285 240 280" fill="white" opacity="0.9" />
                    <circle cx="245" cy="285" r="2" fill="white" />
                    <circle cx="255" cy="285" r="2" fill="white" />
                    <path d="M 240 310 Q 250 305 260 310" stroke="white" strokeWidth="2" fill="none" opacity="0.9" />
                    <ellipse cx="250" cy="300" rx="50" ry="55" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" />
                  </g>
                </svg>

                <div className="absolute top-8 right-8 text-white text-sm physics-formula opacity-60 animate-float">
                  F = ma
                </div>
                <div className="absolute bottom-32 left-8 text-white text-sm physics-formula opacity-60 animate-float" style={{ animationDelay: '1s' }}>
                  E = mc²
                </div>
                <div className="absolute top-24 left-12 text-white text-sm physics-formula opacity-60 animate-float" style={{ animationDelay: '0.5s' }}>
                  KE = ½mv²
                </div>
                <div className="absolute bottom-24 right-16 text-white text-sm physics-formula opacity-60 animate-float" style={{ animationDelay: '1.5s' }}>
                  P = mgh
                </div>
                <div className="absolute top-1/2 right-4 text-white text-xs physics-formula opacity-60 animate-float" style={{ animationDelay: '0.8s' }}>
                  v = u + at
                </div>
                <div className="absolute top-1/3 left-4 text-white text-xs physics-formula opacity-60 animate-float" style={{ animationDelay: '1.2s' }}>
                  τ = Iα
                </div>

                <div className="absolute bottom-0 left-0 right-0 text-center">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl px-6 py-4 inline-block border border-white border-opacity-20">
                    <p className="text-white text-lg font-bold mb-1">AI-Powered Physics Learning</p>
                    <p className="text-blue-200 text-sm">Personalized. Adaptive. Effective.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" id="courses">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Students Choose Srikanth's Academy
            </h2>
            <p className="text-xl text-gray-600">
              Master Physics with clarity, confidence, and speed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: 'Physics That Finally Makes Sense',
                description: 'Teaches Physics with intuition, logic, and real-world meaning — not rote formulas. Students finally understand concepts instead of memorizing them.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: FileText,
                title: 'Derivations That Build Confidence',
                description: 'Every formula is broken down from first principles. Knowing why it works gives students the confidence to solve any problem — from JEE Mains to AP Physics.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Zap,
                title: 'Exam-Speed Thinking (1–2 Minute Problem Mastery)',
                description: 'Learn how toppers think during competitive exams. Pattern recognition + rapid reasoning + smart shortcuts = faster, more accurate answers.',
                gradient: 'from-orange-500 to-red-500'
              },
              {
                icon: Brain,
                title: 'Class Learning Reinforced by AI Daily Practice',
                description: 'Whatever is taught in class is strengthened through personalized AI practice — Morning Pulse → Daily Homework → Challenge Mode → Revision Sets. AI adapts to the student\'s pace and performance.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: BarChart3,
                title: 'Smart Progress Tracking',
                description: 'Real-time analytics across all Physics topics. Track mastery in Kinematics, Dynamics, Energy, Momentum, Modern Physics, and more. Identify weak areas instantly and improve with precision.',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: Globe,
                title: 'Complete Course Ecosystem — One Platform',
                description: 'IIT JEE, NEET, AP Physics, CBSE, ICSE — all delivered through a structured learning path: Concept → Derivation → Examples → Exam Problems → AI Practice → Mastery.',
                gradient: 'from-blue-600 to-blue-800'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Real Results from Real Students
            </h2>
            <p className="text-xl text-blue-200">
              Join thousands who transformed their physics scores
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {[
              { icon: Users, number: '80K+', label: 'Students Trained', color: 'from-blue-400 to-cyan-400' },
              { icon: Award, number: '98.17%', label: 'Top Score IIT JEE', color: 'from-green-400 to-emerald-400' },
              { icon: Medal, number: 'Numerous', label: 'First 100 Ranks', color: 'from-yellow-400 to-orange-400' },
              { icon: Star, number: '4.9/5', label: 'Rating (450 Reviews)', color: 'from-purple-400 to-pink-400' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white border-opacity-20">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" id="success">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Success Stories from Srikanth's Academy
            </h2>
            <p className="text-xl text-gray-600">
              Hear from students who achieved their dream ranks
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12 shadow-xl border-2 border-blue-200">
              <div className="text-center mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 inline fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-2xl text-gray-800 mb-8 italic leading-relaxed">
                "{testimonials[activeTestimonial].text}"
              </p>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{testimonials[activeTestimonial].name}</p>
                <p className="text-lg text-gray-600">{testimonials[activeTestimonial].rank}</p>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-700" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 to-cyan-500">
                <img 
                  src="/media/srikanth-sir.jpg" 
                  alt="Srikanth Padavala - Physics Mentor"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Try alternative image paths
                    const img = e.currentTarget;
                    const alternatives = [
                      '/media/srikanth-sir.png', 
                      '/media/srikanth-sir.webp', 
                      '/media/srikanth.jpg', 
                      '/media/srikanth.png',
                      '/srikanth-sir.jpg',
                      '/srikanth-sir.png'
                    ];
                    let currentIndex = alternatives.indexOf(img.src);
                    
                    if (currentIndex < alternatives.length - 1) {
                      img.src = alternatives[currentIndex + 1];
                    } else {
                      // All alternatives failed, show placeholder
                      img.style.display = 'none';
                      const parent = img.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <div class="text-center text-white">
                              <svg class="w-32 h-32 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                              </svg>
                              <p class="text-xl">Srikanth Sir Photo</p>
                              <p class="text-sm opacity-75">(Please add image to public/media folder)</p>
                            </div>
                          </div>
                        `;
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-4">Meet Your Physics Mentor</h2>
              <h3 className="text-3xl font-bold text-yellow-400 mb-2">Srikanth Padavala</h3>
              <p className="text-xl text-blue-200 mb-6">M.Tech | 13+ Years Experience</p>

              <div className="mb-6">
                <h4 className="text-xl font-bold mb-3">Former Faculty at:</h4>
                <ul className="space-y-2 text-lg">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    ACE Engineering Academy
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Unacademy (Star Educator)
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-bold mb-3">Achievements:</h4>
                <ul className="space-y-2 text-lg">
                  <li className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Trained 80000+ students globally
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Numerous in the first 100 ranks
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    98%+ success rate in competitive exams
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Top students are placed in top institutions worldwide
                  </li>
                </ul>
              </div>

              <div className="bg-blue-800 bg-opacity-50 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-bold mb-3">Teaching Philosophy:</h4>
                <p className="text-blue-100 italic leading-relaxed">
                  "Physics is not about memorizing formulas—it's about understanding the universe.
                  I focus on concept clarity, practical applications, and problem-solving techniques
                  that make physics intuitive and enjoyable."
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Learning Journey in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              From signup to exam success
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                number: '1',
                title: 'Sign Up Free',
                description: 'Create your account in 30 seconds. Choose your exam (IIT JEE/NEET/AP). Set your target exam date.',
                icon: Rocket
              },
              {
                number: '2',
                title: 'Daily Practice',
                description: 'Get personalized quizzes every day: Morning Pulse (3 questions), Daily Homework (10 questions). Track progress in real-time.',
                icon: Target
              },
              {
                number: '3',
                title: 'Master & Excel',
                description: 'Build streaks, earn badges. Achieve 95%+ mastery in all topics. Predict your exam score. Ace your physics exam!',
                icon: Trophy
              }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className="w-8 h-8 text-blue-600" />
                    <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-xl text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-800 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Rocket className="w-20 h-20 text-white mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Physics Scores?
          </h2>
          <p className="text-2xl text-blue-100 mb-8">
            Join 80,000+ students achieving their dream ranks globally<br/>
            Start your free 7-day trial today
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => navigate('/signup')}
              className="px-10 py-4 bg-white text-blue-800 rounded-xl font-bold text-xl hover:bg-blue-50 transition-all shadow-2xl flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-6 h-6" />
            </button>
            <button className="px-10 py-4 bg-blue-700 text-white rounded-xl font-bold text-xl hover:bg-blue-600 transition-all border-2 border-white">
              Talk to Expert
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16" id="support">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="mb-4">
                <Logo size="md" showText={true} textColor="white" />
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Empowering students to master physics and achieve their academic dreams through AI-powered personalized learning.
              </p>
              <div className="flex gap-3">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Youtube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">IIT JEE Physics</li>
                <li className="hover:text-white cursor-pointer">NEET Physics</li>
                <li className="hover:text-white cursor-pointer">AP Physics 1</li>
                <li className="hover:text-white cursor-pointer">AP Physics 2</li>
                <li className="hover:text-white cursor-pointer">AP Physics C</li>
                <li className="hover:text-white cursor-pointer">CBSE Physics</li>
                <li className="hover:text-white cursor-pointer">Practice Tests</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Meet Srikanth Sir</li>
                <li className="hover:text-white cursor-pointer">Success Stories</li>
                <li className="hover:text-white cursor-pointer">Blog & Articles</li>
                <li className="hover:text-white cursor-pointer">Contact Us</li>
                <li className="hover:text-white cursor-pointer">FAQ</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Get in Touch</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Vijayawada, Andhra Pradesh</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>+91 9492937716</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">srikanthsacademyforphysics@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span>24/7 Doubt Resolution</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 Srikanth's Academy. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">Refund Policy</a>
                <a href="#" className="hover:text-white">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

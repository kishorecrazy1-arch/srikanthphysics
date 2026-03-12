import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Award, GraduationCap, BookOpen } from 'lucide-react';
import { CourseNavigation } from '../components/CourseNavigation';

export function APPhysicsSelector() {
  const navigate = useNavigate();

  const courses = [
    {
      id: 'ap-physics-1',
      title: 'AP Physics 1',
      subtitle: 'Algebra-Based Mechanics & Waves',
      description: 'Build a strong foundation in mechanics, energy, momentum, and waves using algebra-based approaches.',
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-blue-500/30',
      icon: '⚛️',
      difficulty: 'Intermediate',
      prerequisites: 'Algebra I & II',
      route: '/ap-physics'
    },
    {
      id: 'ap-physics-2',
      title: 'AP Physics 2',
      subtitle: 'Algebra-Based Electricity & Modern Physics',
      description: 'Explore fluid mechanics, thermodynamics, electricity, magnetism, optics, and modern physics.',
      color: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500/30',
      icon: '🔬',
      difficulty: 'Intermediate',
      prerequisites: 'AP Physics 1',
      route: '/ap-physics'
    },
    {
      id: 'ap-physics-c-mechanics',
      title: 'AP Physics C: Mechanics',
      subtitle: 'Calculus-Based Classical Mechanics',
      description: 'Advanced mechanics using calculus, including kinematics, Newton\'s laws, work-energy, and rotational motion.',
      color: 'from-emerald-600 to-teal-600',
      borderColor: 'border-emerald-500/30',
      icon: '📐',
      difficulty: 'Advanced',
      prerequisites: 'Calculus AB/BC',
      route: '/ap-physics'
    },
    {
      id: 'ap-physics-c-em',
      title: 'AP Physics C: E&M',
      subtitle: 'Calculus-Based Electricity & Magnetism',
      description: 'Calculus-based study of electrostatics, circuits, magnetism, and electromagnetic induction.',
      color: 'from-amber-600 to-orange-600',
      borderColor: 'border-amber-500/30',
      icon: '⚡',
      difficulty: 'Advanced',
      prerequisites: 'Calculus AB/BC',
      route: '/ap-physics'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <CourseNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/course/ap-physics')}
          className="flex items-center gap-2 text-blue-300 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Overview</span>
        </button>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 mb-6">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Advanced Placement Physics</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Choose Your AP Physics Course
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Select the course that matches your academic level and goals. All courses lead to college credit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-2 ${course.borderColor} rounded-3xl p-8 hover:scale-[1.02] transition-all cursor-pointer group`}
              onClick={() => navigate(course.route)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center text-4xl shadow-xl`}>
                  {course.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/30">
                    {course.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-xs font-semibold">
                    {course.prerequisites}
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-2">{course.title}</h3>
              <p className={`text-lg font-semibold bg-gradient-to-r ${course.color} bg-clip-text text-transparent mb-4`}>
                {course.subtitle}
              </p>
              <p className="text-slate-300 leading-relaxed mb-6">
                {course.description}
              </p>

              <button
                className={`w-full py-4 bg-gradient-to-r ${course.color} text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2 group-hover:scale-105`}
              >
                <BookOpen className="w-5 h-5" />
                Start {course.title}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-12 text-center">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Why AP Physics?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">$2,000+</div>
              <p className="text-slate-300">Save on college tuition with earned credits</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
              <p className="text-slate-300">Student success rate achieving 3+ scores</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">10K+</div>
              <p className="text-slate-300">Students have mastered AP Physics with us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { CourseNavigation } from '../components/CourseNavigation';
import { BookOpen, ArrowRight, GraduationCap } from 'lucide-react';

export function Courses() {
  const navigate = useNavigate();

  const courses = [
    { id: 'foundation', label: 'Foundation Course', icon: '🏗️', description: 'Complete physics fundamentals from basics to advanced topics - 13 comprehensive units', color: 'from-orange-600 to-amber-500' },
    { id: 'ap-physics', label: 'AP Physics 1', icon: '⚡', description: 'Master algebra-based mechanics & waves for college credit', color: 'from-blue-600 to-cyan-500' },
    { id: 'ap-physics-2', label: 'AP Physics 2', icon: '🔬', description: 'Advanced algebra-based physics covering thermodynamics, fluids, and more', color: 'from-purple-600 to-pink-500' },
    { id: 'ap-physics-mechanics', label: 'AP Physics C: Mechanics', icon: '📐', description: 'Calculus-based mechanics for engineering-focused students', color: 'from-indigo-600 to-purple-500' },
    { id: 'ap-physics-em', label: 'AP Physics C: E&M', icon: '⚡', description: 'Electricity and magnetism with calculus-based problem solving', color: 'from-blue-600 to-indigo-500' },
    { id: 'iit-jee', label: 'IIT JEE', icon: '🎯', description: 'Comprehensive preparation for IIT Joint Entrance Examination', color: 'from-orange-600 to-red-500' },
    { id: 'neet', label: 'NEET', icon: '🏥', description: 'Physics preparation for National Eligibility cum Entrance Test', color: 'from-green-600 to-emerald-500' },
    { id: 'igcse', label: 'IGCSE', icon: '🎓', description: 'International General Certificate of Secondary Education Physics', color: 'from-teal-600 to-cyan-500' },
    { id: 'sat', label: 'SAT Physics', icon: '📊', description: 'SAT Subject Test Physics preparation', color: 'from-yellow-600 to-orange-500' },
    { id: 'ib-physics', label: 'IB Physics', icon: '🌍', description: 'International Baccalaureate Physics program', color: 'from-pink-600 to-rose-500' },
    { id: 'cbse', label: 'CBSE', icon: '📖', description: 'Central Board of Secondary Education Physics curriculum', color: 'from-blue-500 to-blue-700' },
    { id: 'icse', label: 'ICSE', icon: '📘', description: 'Indian Certificate of Secondary Education Physics', color: 'from-violet-600 to-purple-600' },
    { id: 'aqa-physics', label: 'AQA Physics', icon: '📚', description: 'AQA Physics qualification preparation', color: 'from-slate-600 to-gray-700' },
    { id: 'imat', label: 'IMAT', icon: '🇮🇹', description: 'International Medical Admissions Test Physics', color: 'from-emerald-600 to-teal-600' },
    { id: 'quantum', label: 'Quantum Mechanics', icon: '⚛️', description: 'Advanced quantum mechanics and modern physics', color: 'from-indigo-700 to-purple-800' },
  ];

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <CourseNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Physics Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect course for your exam preparation. All courses include AI-powered daily practice, personalized learning, and expert guidance from Srikanth Sir.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer group border border-gray-200 hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {course.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {course.label}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {course.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-xl p-8 text-center text-white">
          <BookOpen className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Not Sure Which Course is Right for You?
          </h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Book a free demo session and get personalized recommendations from our expert team.
          </p>
          <button
            onClick={() => navigate('/demo')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            Book Free Demo <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

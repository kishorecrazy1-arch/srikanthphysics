import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, GraduationCap, Sparkles, HeadphonesIcon, ChevronDown, Brain } from 'lucide-react';
import { Logo } from './Logo';

export function CourseNavigation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ap-physics');
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);

  const mainTabs = [
    { id: 'about', label: 'About', icon: Info, path: '#about' },
    { id: 'success', label: 'Success Stories', icon: Sparkles, path: '#success' },
    { id: 'support', label: 'Support', icon: HeadphonesIcon, path: '#support' },
    { id: 'ai-tutor', label: 'AI Physics Tutor (FREE)', icon: Brain, path: '/ai-tutor.html' }
  ];

  const courses = [
    { id: 'foundation', label: 'Foundation Course', icon: '🏗️' },
    { id: 'ap-physics', label: 'AP Physics 1', icon: '⚡' },
    { id: 'ap-physics-2', label: 'AP Physics 2', icon: '🔬' },
    { id: 'ap-physics-mechanics', label: 'AP Physics C: Mechanics', icon: '📐' },
    { id: 'ap-physics-em', label: 'AP Physics C: E&M', icon: '⚡' },
    { id: 'ib-physics', label: 'IB Physics', icon: '🌍' },
    { id: 'aqa-physics', label: 'AQA Physics', icon: '📚' },
    { id: 'igcse', label: 'IGCSE', icon: '🎓' },
    { id: 'sat', label: 'SAT Physics', icon: '📊' },
    { id: 'iit-jee', label: 'IIT JEE', icon: '🎯' },
    { id: 'neet', label: 'NEET', icon: '🏥' },
    { id: 'imat', label: 'IMAT', icon: '🇮🇹' },
    { id: 'cbse', label: 'CBSE', icon: '📖' },
    { id: 'icse', label: 'ICSE', icon: '📘' },
    { id: 'quantum', label: 'Quantum Mechanics', icon: '⚛️' }
  ];

  const courseTabs = [
    { id: 'ap-physics', label: 'AP Physics', icon: '⚡', color: 'from-blue-600 to-cyan-500' }
  ];

  const handleCourseClick = (courseId: string) => {
    setActiveTab(courseId);
    setShowCoursesDropdown(false);
    localStorage.setItem('selectedCourse', courseId);
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="w-full">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Totally Left Corner */}
            <div className="cursor-pointer flex-shrink-0 pl-4 sm:pl-6 lg:pl-8" onClick={() => navigate('/')}>
              <Logo size="md" showText={true} />
            </div>

            {/* Main Navigation Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {mainTabs.map((tab) => (
                <a
                  key={tab.id}
                  href={tab.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-white hover:text-blue-600 transition-all font-medium"
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </a>
              ))}

              {/* Courses Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCoursesDropdown(!showCoursesDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-white hover:text-blue-600 transition-all font-medium"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Courses</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCoursesDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCoursesDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowCoursesDropdown(false)}
                    ></div>
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                      {courses.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => handleCourseClick(course.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left"
                        >
                          <span className="text-2xl">{course.icon}</span>
                          <span className="text-gray-800 font-medium">{course.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 pr-4 sm:pr-6 lg:pr-8">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors hidden sm:block"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/demo')}
                className="px-6 py-2 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden bg-blue-50 border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-around text-xs">
            {mainTabs.map((tab) => (
              <a
                key={tab.id}
                href={tab.path}
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600"
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-center">{tab.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Calendar, Clock, Bell, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Schedule() {
  const user = useAuthStore(state => state.user);
  const [showToast, setShowToast] = useState(false);

  const weeklyTopics = [
    { day: 'Monday', time: '15:00', topic: 'Kinematics Review' },
    { day: 'Tuesday', time: '15:00', topic: "Newton's Laws Practice" },
    { day: 'Wednesday', time: '15:00', topic: 'Energy & Work Problems' },
    { day: 'Thursday', time: '15:00', topic: 'Momentum & Collisions' },
    { day: 'Friday', time: '15:00', topic: 'Circular Motion' },
  ];

  const dailySchedule = [
    { time: '07:00', task: 'Morning Pulse', description: '3 quick questions' },
    { time: user?.preferredStudyTime || '18:00', task: 'Main Study Session', description: 'Daily homework' },
    { time: '21:00', task: 'Challenge Problem', description: 'Optional difficult question' },
  ];

  const handleSetReminder = (item: string) => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Study Schedule 📅</h1>
        <p className="text-gray-600">Plan your study time and stay on track</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Weekly Class Schedule</h2>
          </div>

          <div className="space-y-4">
            {weeklyTopics.map((item, idx) => (
              <div
                key={idx}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.day}</p>
                    <p className="text-sm text-gray-600">{item.topic}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.time}</span>
                    </div>
                    <button
                      onClick={() => handleSetReminder(item.topic)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Bell className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Daily Study Plan</h2>
          </div>

          <div className="space-y-4">
            {dailySchedule.map((item, idx) => (
              <div
                key={idx}
                className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {item.time}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{item.task}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSetReminder(item.task)}
                    className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5 text-green-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Upcoming Topics 📚</h3>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {[
                'Rotational Dynamics',
                'Gravitation',
                'Simple Harmonic Motion',
                'Fluid Mechanics',
                'Thermodynamics',
                'Electric Fields',
              ].map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-white bg-opacity-50 p-3 rounded-lg border border-yellow-200"
                >
                  <p className="text-gray-800 font-medium">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up">
          <CheckCircle className="w-6 h-6" />
          <p className="font-semibold">Reminder set successfully! 🔔</p>
        </div>
      )}
    </div>
  );
}

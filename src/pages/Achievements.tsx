import { Flame, Award, Target, Zap, TrendingUp, Star, Trophy, Medal } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Badge } from '../types';

export function Achievements() {
  const user = useAuthStore(state => state.user);

  const allBadges: Badge[] = [
    {
      id: '1',
      name: 'Speed Demon',
      description: 'Complete 10 questions in under 1 minute each',
      icon: 'Zap',
      earned: user && user.totalQuestions >= 10,
      earnedDate: user && user.totalQuestions >= 10 ? '2025-10-15' : undefined,
    },
    {
      id: '2',
      name: 'Accuracy Pro',
      description: 'Achieve 90% accuracy on 20 questions',
      icon: 'Target',
      earned: user && user.totalQuestions >= 20 && (user.correctAnswers / user.totalQuestions) >= 0.9,
      earnedDate: user && user.totalQuestions >= 20 && (user.correctAnswers / user.totalQuestions) >= 0.9 ? '2025-10-16' : undefined,
    },
    {
      id: '3',
      name: 'Bookworm',
      description: 'Answer 100 questions total',
      icon: 'Star',
      earned: user && user.totalQuestions >= 100,
      earnedDate: user && user.totalQuestions >= 100 ? '2025-10-14' : undefined,
    },
    {
      id: '4',
      name: 'Momentum Master',
      description: 'Master the Momentum topic (85%+)',
      icon: 'TrendingUp',
      earned: false,
    },
    {
      id: '5',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'Flame',
      earned: user && user.currentStreak >= 7,
      earnedDate: user && user.currentStreak >= 7 ? '2025-10-10' : undefined,
    },
    {
      id: '6',
      name: 'Perfect Score',
      description: 'Get 100% on a quiz',
      icon: 'Award',
      earned: false,
    },
    {
      id: '7',
      name: 'Early Bird',
      description: 'Complete 5 Morning Pulse quizzes',
      icon: 'Trophy',
      earned: false,
    },
    {
      id: '8',
      name: 'Challenge Accepted',
      description: 'Complete 10 Challenge Problems',
      icon: 'Medal',
      earned: false,
    },
    {
      id: '9',
      name: 'Marathon Runner',
      description: 'Maintain a 30-day streak',
      icon: 'Flame',
      earned: user && user.currentStreak >= 30,
      earnedDate: user && user.currentStreak >= 30 ? '2025-10-01' : undefined,
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', score: 2450, streak: 45 },
    { rank: 2, name: 'Sarah Johnson', score: 2180, streak: 32 },
    { rank: 3, name: 'Mike Williams', score: 1950, streak: 28 },
    { rank: 4, name: user?.name || 'You', score: user?.totalQuestions || 0, streak: user?.currentStreak || 0 },
  ];

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Zap, Target, Star, TrendingUp, Flame, Award, Trophy, Medal
    };
    return icons[iconName] || Star;
  };

  const earnedBadges = allBadges.filter(b => b.earned);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Achievements 🏆</h1>
        <p className="text-gray-600">Your badges and rankings</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-6 border-2 border-orange-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-3">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Current Streak</p>
            <p className="text-4xl font-bold text-gray-800">{user?.currentStreak || 0}</p>
            <p className="text-sm text-gray-600">days 🔥</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-3">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Longest Streak</p>
            <p className="text-4xl font-bold text-gray-800">{user?.longestStreak || 0}</p>
            <p className="text-sm text-gray-600">days</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-3">
              <Award className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Badges Earned</p>
            <p className="text-4xl font-bold text-gray-800">{earnedBadges.length}</p>
            <p className="text-sm text-gray-600">of {allBadges.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Badge Collection</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {allBadges.map((badge) => {
            const Icon = getIconComponent(badge.icon);
            return (
              <div
                key={badge.id}
                className={`rounded-xl p-6 border-2 transition-all ${
                  badge.earned
                    ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-400'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      badge.earned
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                        : 'bg-gray-400'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 mb-1">{badge.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                    {badge.earned && badge.earnedDate && (
                      <p className="text-xs text-green-600 font-medium">
                        Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Leaderboard 🥇</h2>
        <div className="space-y-3">
          {leaderboard.map((entry) => {
            const isCurrentUser = entry.name === user?.name;
            return (
              <div
                key={entry.rank}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  isCurrentUser
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  {entry.rank === 1 && <span className="text-4xl">🥇</span>}
                  {entry.rank === 2 && <span className="text-4xl">🥈</span>}
                  {entry.rank === 3 && <span className="text-4xl">🥉</span>}
                  {entry.rank > 3 && (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="font-bold text-gray-700">{entry.rank}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">
                    {entry.name}
                    {isCurrentUser && <span className="ml-2 text-sm text-blue-600">(You)</span>}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{entry.score} points</span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      {entry.streak} day streak
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Keep Going! ⭐</h3>
            <p className="text-gray-700">
              You're making great progress! Continue your daily practice to unlock more badges
              and climb the leaderboard. Every question brings you closer to that perfect 5/5!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

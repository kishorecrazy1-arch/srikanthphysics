import { Zap, Target, Trophy } from 'lucide-react';

interface DifficultySelectorProps {
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  showStats?: boolean;
  stats?: {
    level_1_completed: number;
    level_1_correct: number;
    level_2_completed: number;
    level_2_correct: number;
    level_3_completed: number;
    level_3_correct: number;
  };
  children?: React.ReactNode;
}

export function DifficultySelector({ selectedLevel, onLevelChange, showStats = false, stats, children }: DifficultySelectorProps) {
  const levels = [
    {
      id: 'level_1',
      label: 'Level 1',
      subtitle: 'Foundation',
      description: 'Basic concepts and simple problems',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      iconColor: 'text-green-500',
      hoverBg: 'hover:bg-green-50'
    },
    {
      id: 'level_2',
      label: 'Level 2',
      subtitle: 'Intermediate',
      description: 'Multi-step application problems',
      icon: Zap,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-500',
      hoverBg: 'hover:bg-orange-50'
    },
    {
      id: 'level_3',
      label: 'Level 3',
      subtitle: 'Advanced',
      description: 'Complex problem-solving and synthesis',
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-500',
      hoverBg: 'hover:bg-purple-50'
    }
  ];

  const getAccuracy = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-white mb-2">Choose your challenge level</h3>
        <p className="text-slate-300">Select a difficulty level to begin practice</p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl backdrop-blur-sm border-2 border-slate-700/50">
        <div className="flex flex-col md:flex-row border-b-2 border-slate-700/50">
          {levels.map((level, index) => {
            const isSelected = selectedLevel === level.id;
            const levelStats = stats ? {
              completed: stats[`${level.id}_completed` as keyof typeof stats] as number,
              correct: stats[`${level.id}_correct` as keyof typeof stats] as number
            } : null;

            return (
              <button
                key={level.id}
                onClick={() => onLevelChange(level.id)}
                className={`flex-1 px-6 py-6 transition-all relative ${
                  index !== 0 ? 'md:border-l-2 border-slate-700/50' : ''
                } ${
                  isSelected
                    ? `bg-gradient-to-br ${level.color.replace('from-', 'from-')}/20 border-b-4`
                    : `bg-slate-900/30 hover:bg-slate-800/50`
                }`}
                style={isSelected ? {
                  borderBottomColor: level.color.includes('green') ? '#10b981' :
                                    level.color.includes('orange') ? '#f97316' : '#a855f7'
                } : {}}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center shadow-lg`}>
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    isSelected ? `bg-gradient-to-br ${level.color}/30` : 'bg-slate-800/50'
                  }`}>
                    <level.icon className={`w-8 h-8 ${isSelected ? level.iconColor : 'text-slate-400'}`} />
                  </div>

                  <div className="text-center">
                    <h4 className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {level.label}
                    </h4>
                    <p className={`text-sm ${isSelected ? level.textColor.replace('text-', 'text-') + '-300' : 'text-slate-400'}`}>
                      {level.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    {level.description}
                  </p>

                  {showStats && levelStats && levelStats.completed > 0 && (
                    <div className="w-full pt-3 border-t border-slate-700/50">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">Progress:</span>
                        <span className={`font-bold text-white`}>
                          {levelStats.completed} questions
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Accuracy:</span>
                        <span className={`font-bold text-white`}>
                          {getAccuracy(levelStats.correct, levelStats.completed)}%
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${level.color} transition-all`}
                          style={{ width: `${getAccuracy(levelStats.correct, levelStats.completed)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {showStats && stats && (
          <div className="px-6 py-4 bg-slate-900/30 rounded-b-2xl">
            <h4 className="text-base font-bold text-white mb-3 text-center">Overall Progress</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {stats.level_1_completed}
                </div>
                <div className="text-xs text-slate-400">Level 1 Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {stats.level_2_completed}
                </div>
                <div className="text-xs text-slate-400">Level 2 Done</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {stats.level_3_completed}
                </div>
                <div className="text-xs text-slate-400">Level 3 Done</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {children && (
        <div className="mt-8">
          {children}
        </div>
      )}
    </div>
  );
}

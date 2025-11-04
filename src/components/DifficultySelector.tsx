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
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Choose your challenge level</h3>
          <p className="text-sm text-slate-400">Select a difficulty level to begin practice</p>
        </div>

        {/* Tab-style level selector */}
        <div className="flex gap-2 border-b border-slate-700/50">
        {levels.map((level) => {
          const isSelected = selectedLevel === level.id;
          const levelStats = stats ? {
            completed: stats[`${level.id}_completed` as keyof typeof stats] as number,
            correct: stats[`${level.id}_correct` as keyof typeof stats] as number
          } : null;

          return (
            <button
              key={level.id}
              onClick={() => onLevelChange(level.id)}
              className={`flex flex-col items-start gap-1 px-4 py-3 rounded-t-xl font-semibold transition-all relative ${
                isSelected
                  ? `bg-gradient-to-br ${level.color} text-white shadow-lg`
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <level.icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{level.label}</span>
                <span className="text-xs opacity-80">({level.subtitle})</span>
                {showStats && levelStats && levelStats.completed > 0 && (
                  <span className={`ml-auto text-xs ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    ({getAccuracy(levelStats.correct, levelStats.completed)}%)
                  </span>
                )}
              </div>
              {isSelected && (
                <>
                  <p className="text-xs text-white/90 mt-1">{level.description}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
                </>
              )}
            </button>
          );
        })}
        </div>
      </div>


      {showStats && stats && (
        <div className="px-6 py-4 bg-slate-900/30 rounded-xl backdrop-blur-sm border border-slate-700/50">
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

      {children && (
        <div className="mt-8">
          {children}
        </div>
      )}
    </div>
  );
}

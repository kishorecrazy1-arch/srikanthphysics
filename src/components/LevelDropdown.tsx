import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface LevelDropdownProps {
  selectedLevel: string;
  onLevelChange: (level: string) => void;
}

export function LevelDropdown({ selectedLevel, onLevelChange }: LevelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const levels = [
    { id: 'level_1', label: 'Level 1', subtitle: 'Foundation', color: 'text-green-400' },
    { id: 'level_2', label: 'Level 2', subtitle: 'Intermediate', color: 'text-orange-400' },
    { id: 'level_3', label: 'Level 3', subtitle: 'Advanced', color: 'text-purple-400' }
  ];

  const selectedLevelData = levels.find(l => l.id === selectedLevel) || levels[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 transition-colors"
      >
        <span className="text-white font-semibold text-sm">
          {selectedLevelData.label} ({selectedLevelData.subtitle})
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
          <div className="py-2">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => {
                  onLevelChange(level.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-slate-700/50 transition-colors ${
                  selectedLevel === level.id ? 'bg-slate-700/30' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-semibold ${level.color}`}>{level.label}</div>
                    <div className="text-xs text-slate-400">{level.subtitle}</div>
                  </div>
                  {selectedLevel === level.id && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}













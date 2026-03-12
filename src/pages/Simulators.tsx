import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Target } from 'lucide-react';
import { MotionSimulator } from './MotionSimulator';
import { BasketballSimulator } from '../components/BasketballSimulator';

type SimulatorType = 'projectile' | 'basketball';

export function Simulators() {
  const navigate = useNavigate();
  const [activeSimulator, setActiveSimulator] = useState<SimulatorType>('projectile');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => navigate('/ap-physics')}
          className="flex items-center gap-2 text-purple-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Physics Simulators</h1>
          <p className="text-purple-200">Interactive Physics Visualization Tools</p>
        </div>

        {/* Simulator Tabs */}
        <div className="flex gap-4 mb-6 border-b border-purple-500/20">
          <button
            onClick={() => setActiveSimulator('projectile')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
              activeSimulator === 'projectile'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <Zap className="w-5 h-5" />
            Projectile Motion
          </button>
          <button
            onClick={() => setActiveSimulator('basketball')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
              activeSimulator === 'basketball'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <Target className="w-5 h-5" />
            Basketball Free Throw
          </button>
        </div>

        {/* Simulator Content */}
        <div className="mt-6">
          {activeSimulator === 'projectile' && <MotionSimulator />}
          {activeSimulator === 'basketball' && <BasketballSimulator />}
        </div>
      </div>
    </div>
  );
}


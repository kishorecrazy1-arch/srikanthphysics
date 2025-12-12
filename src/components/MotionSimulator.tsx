import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Download, Settings } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SimulationData {
  time: number;
  height: number;
  velocity: number;
}

export function MotionSimulator() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [initialVelocity, setInitialVelocity] = useState(15);
  const [launchAngle, setLaunchAngle] = useState(35);
  const [gravity, setGravity] = useState(9.8);
  const [time, setTime] = useState(0);
  const [simulationData, setSimulationData] = useState<SimulationData[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Calculate projectile motion
  const angleRad = (launchAngle * Math.PI) / 180;
  const v0x = initialVelocity * Math.cos(angleRad);
  const v0y = initialVelocity * Math.sin(angleRad);
  const totalTime = (2 * v0y) / gravity;
  const maxHeight = (v0y * v0y) / (2 * gravity);
  const range = (initialVelocity * initialVelocity * Math.sin(2 * angleRad)) / gravity;

  useEffect(() => {
    if (playing && time < totalTime) {
      animationFrameRef.current = requestAnimationFrame(() => {
        setTime((prev) => {
          const newTime = prev + 0.016 * speed;
          if (newTime >= totalTime) {
            setPlaying(false);
            return totalTime;
          }
          return newTime;
        });
      });
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [playing, time, totalTime, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = Math.min(width / range, (height - 100) / maxHeight);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw ground
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 50);
    ctx.lineTo(width, height - 50);
    ctx.stroke();

    // Calculate current position
    const currentX = v0x * time;
    const currentY = v0y * time - 0.5 * gravity * time * time;

    // Draw trajectory
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let t = 0; t <= time; t += 0.1) {
      const x = v0x * t;
      const y = v0y * t - 0.5 * gravity * t * t;
      if (t === 0) {
        ctx.moveTo(x * scale, height - 50 - y * scale);
      } else {
        ctx.lineTo(x * scale, height - 50 - y * scale);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw projectile
    if (time <= totalTime && currentY >= 0) {
      const x = currentX * scale;
      const y = height - 50 - currentY * scale;

      // Draw ball with glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
      gradient.addColorStop(0, '#fbbf24');
      gradient.addColorStop(1, '#f59e0b');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#fbbf24';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw velocity vectors
    if (time <= totalTime && currentY >= 0) {
      const x = currentX * scale;
      const y = height - 50 - currentY * scale;
      const vx = v0x;
      const vy = v0y - gravity * time;

      // Horizontal velocity (cyan)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + vx * scale * 0.5, y);
      ctx.stroke();
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(x + vx * scale * 0.5, y);
      ctx.lineTo(x + vx * scale * 0.5 - 5, y - 3);
      ctx.lineTo(x + vx * scale * 0.5 - 5, y + 3);
      ctx.closePath();
      ctx.fill();

      // Vertical velocity (pink)
      ctx.strokeStyle = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - vy * scale * 0.5);
      ctx.stroke();
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(x, y - vy * scale * 0.5);
      ctx.lineTo(x - 3, y - vy * scale * 0.5 + 5);
      ctx.lineTo(x + 3, y - vy * scale * 0.5 + 5);
      ctx.closePath();
      ctx.fill();
    }
  }, [time, initialVelocity, launchAngle, gravity, v0x, v0y, maxHeight, range, totalTime]);

  // Generate chart data
  useEffect(() => {
    const data: SimulationData[] = [];
    for (let t = 0; t <= totalTime; t += 0.1) {
      const h = v0y * t - 0.5 * gravity * t * t;
      const v = Math.sqrt(v0x * v0x + (v0y - gravity * t) * (v0y - gravity * t));
      if (h >= 0) {
        data.push({ time: t, height: h, velocity: v });
      }
    }
    setSimulationData(data);
  }, [initialVelocity, launchAngle, gravity, v0x, v0y, totalTime]);

  const currentHeight = time <= totalTime ? v0y * time - 0.5 * gravity * time * time : 0;
  const currentDistance = time <= totalTime ? v0x * time : range;

  const handleReset = () => {
    setTime(0);
    setPlaying(false);
  };

  const handleApply = () => {
    setTime(0);
    setPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 mb-6">
          {/* Left: Canvas Area (60%) */}
          <div className="flex-1" style={{ flex: '0 0 60%' }}>
            <div className="bg-gradient-to-br from-blue-900/20 to-green-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50"
                />
                
                {/* Stats Box */}
                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
                  <div className="text-xs text-slate-400 mb-1">Time</div>
                  <div className="text-white font-bold">{time.toFixed(2)}s</div>
                  <div className="text-xs text-slate-400 mt-2 mb-1">Height</div>
                  <div className="text-white font-bold">{Math.max(0, currentHeight).toFixed(2)}m</div>
                  <div className="text-xs text-slate-400 mt-2 mb-1">Distance</div>
                  <div className="text-white font-bold">{currentDistance.toFixed(2)}m</div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setPlaying(!playing)}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                >
                  {playing ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <div className="flex gap-2">
                  {[0.5, 1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                        speed === s
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Controls Panel (40%) */}
          <div className="flex-1" style={{ flex: '0 0 40%' }}>
            {/* Input Parameters Card */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Input Parameters</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Initial Velocity: {initialVelocity} m/s
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={initialVelocity}
                      onChange={(e) => setInitialVelocity(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      value={initialVelocity}
                      onChange={(e) => setInitialVelocity(Number(e.target.value))}
                      className="w-20 px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                    />
                    <span className="text-slate-400 self-center">m/s</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Launch Angle: {launchAngle}°
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={launchAngle}
                      onChange={(e) => setLaunchAngle(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      value={launchAngle}
                      onChange={(e) => setLaunchAngle(Number(e.target.value))}
                      className="w-20 px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                    />
                    <span className="text-slate-400 self-center">°</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Gravity: {gravity} m/s²
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.1"
                      value={gravity}
                      onChange={(e) => setGravity(Number(e.target.value))}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      step="0.1"
                      value={gravity}
                      onChange={(e) => setGravity(Number(e.target.value))}
                      className="w-20 px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600"
                    />
                    <span className="text-slate-400 self-center">m/s²</span>
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  Apply Changes
                </button>
              </div>
            </div>

            {/* Live Calculations Card */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Live Calculations</h3>
              
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-sm text-cyan-300 mb-1">Max Height</div>
                  <div className="text-2xl font-bold text-white">{(maxHeight).toFixed(2)} m</div>
                  <div className="text-xs text-cyan-400 mt-1">(v₀sinθ)²/2g</div>
                </div>

                <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 mb-1">Total Time</div>
                  <div className="text-2xl font-bold text-white">{(totalTime).toFixed(2)} s</div>
                  <div className="text-xs text-purple-400 mt-1">2v₀sinθ/g</div>
                </div>

                <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 mb-1">Range</div>
                  <div className="text-2xl font-bold text-white">{(range).toFixed(2)} m</div>
                  <div className="text-xs text-green-400 mt-1">v₀²sin(2θ)/g</div>
                </div>

                <div className="bg-gradient-to-r from-orange-600/20 to-orange-500/20 rounded-lg p-4 border border-orange-500/30">
                  <div className="text-sm text-orange-300 mb-1">Horizontal Velocity</div>
                  <div className="text-2xl font-bold text-white">{(v0x).toFixed(2)} m/s</div>
                  <div className="text-xs text-orange-400 mt-1">v₀cosθ</div>
                </div>

                <div className="bg-gradient-to-r from-pink-600/20 to-pink-500/20 rounded-lg p-4 border border-pink-500/30">
                  <div className="text-sm text-pink-300 mb-1">Vertical Velocity (initial)</div>
                  <div className="text-2xl font-bold text-white">{(v0y).toFixed(2)} m/s</div>
                  <div className="text-xs text-pink-400 mt-1">v₀sinθ</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Graphs */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Height vs Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.2)" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', border: '1px solid #a855f7' }}
                />
                <Area
                  type="monotone"
                  dataKey="height"
                  stroke="#a855f7"
                  fill="url(#colorHeight)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Velocity vs Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.2)" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', border: '1px solid #a855f7' }}
                />
                <Line
                  type="monotone"
                  dataKey="velocity"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={{ fill: '#ec4899', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

























import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Download, Settings, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MotionSimulator() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const [velocity, setVelocity] = useState(15);
  const [angle, setAngle] = useState(35);
  const [gravity, setGravity] = useState(9.8);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);

  const [tempVelocity, setTempVelocity] = useState(15);
  const [tempAngle, setTempAngle] = useState(35);
  const [tempGravity, setTempGravity] = useState(9.8);

  const angleRad = (angle * Math.PI) / 180;
  const v0x = velocity * Math.cos(angleRad);
  const v0y = velocity * Math.sin(angleRad);

  const maxHeight = (v0y * v0y) / (2 * gravity);
  const totalTime = (2 * v0y) / gravity;
  const range = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;

  const currentHeight = Math.max(0, v0y * currentTime - 0.5 * gravity * currentTime * currentTime);
  const currentDistance = v0x * currentTime;

  const heightData = Array.from({ length: 50 }, (_, i) => {
    const t = (totalTime * i) / 49;
    const h = Math.max(0, v0y * t - 0.5 * gravity * t * t);
    return { time: t.toFixed(2), height: h.toFixed(2) };
  });

  const velocityData = Array.from({ length: 50 }, (_, i) => {
    const t = (totalTime * i) / 49;
    const vy = v0y - gravity * t;
    const v = Math.sqrt(v0x * v0x + vy * vy);
    return { time: t.toFixed(2), velocity: v.toFixed(2) };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 20;
    const originX = 50;
    const originY = canvas.height - 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(167, 139, 250, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(canvas.width, originY);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let t = 0; t <= totalTime; t += 0.05) {
      const x = originX + v0x * t * scale;
      const y = originY - (v0y * t - 0.5 * gravity * t * t) * scale;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    if (currentTime <= totalTime) {
      const ballX = originX + currentDistance * scale;
      const ballY = originY - currentHeight * scale;

      const gradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, 12);
      gradient.addColorStop(0, '#fb923c');
      gradient.addColorStop(1, '#f97316');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
      ctx.fill();

      const currentVy = v0y - gravity * currentTime;
      const vScale = 2;

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX + v0x * vScale, ballY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ballX + v0x * vScale, ballY);
      ctx.lineTo(ballX + v0x * vScale - 5, ballY - 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ballX + v0x * vScale, ballY);
      ctx.lineTo(ballX + v0x * vScale - 5, ballY + 3);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX, ballY - currentVy * vScale);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ballX, ballY - currentVy * vScale);
      ctx.lineTo(ballX - 3, ballY - currentVy * vScale + 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ballX, ballY - currentVy * vScale);
      ctx.lineTo(ballX + 3, ballY - currentVy * vScale + 5);
      ctx.stroke();

      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.font = '12px sans-serif';
      ctx.fillText('vₓ', ballX + v0x * vScale + 5, ballY + 5);

      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.fillText('vᵧ', ballX + 5, ballY - currentVy * vScale - 5);
    }
  }, [currentTime, velocity, angle, gravity, v0x, v0y, totalTime, currentHeight, currentDistance]);

  useEffect(() => {
    if (isPlaying && currentTime < totalTime) {
      const animate = () => {
        setCurrentTime(t => {
          const newTime = t + 0.016 * speed;
          if (newTime >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return newTime;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, totalTime, currentTime]);

  const handlePlayPause = () => {
    if (currentTime >= totalTime) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleApplyChanges = () => {
    setVelocity(tempVelocity);
    setAngle(tempAngle);
    setGravity(tempGravity);
    handleReset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/ap-physics')}
          className="flex items-center gap-2 text-purple-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Motion Simulator</h1>
            <p className="text-purple-200">Interactive Physics Visualization</p>
          </div>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition-colors">
            <Download className="w-5 h-5" />
            Export Video
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={450}
                  className="w-full rounded-xl bg-gradient-to-br from-slate-900/50 to-purple-900/20"
                />
                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-400">Time:</span>
                      <span className="font-mono text-cyan-400">{currentTime.toFixed(2)} s</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-400">Height:</span>
                      <span className="font-mono text-cyan-400">{currentHeight.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-400">Distance:</span>
                      <span className="font-mono text-cyan-400">{currentDistance.toFixed(2)} m</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center transition-all hover:scale-105 shadow-lg shadow-purple-500/50"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
                <button
                  onClick={handleReset}
                  className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm text-gray-400">Speed:</span>
                  {[0.5, 1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        speed === s
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {s}×
                    </button>
                  ))}
                </div>

                <button className="ml-auto w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold mb-4">Height vs Time</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={heightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="height" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold mb-4">Velocity vs Time</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={velocityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="velocity" stroke="#ec4899" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold">Input Parameters</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Initial Velocity (v₀)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={tempVelocity}
                      onChange={(e) => setTempVelocity(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      value={tempVelocity}
                      onChange={(e) => setTempVelocity(Number(e.target.value))}
                      className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                    />
                    <span className="text-sm text-gray-400 w-12">m/s</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Launch Angle (θ)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={tempAngle}
                      onChange={(e) => setTempAngle(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      value={tempAngle}
                      onChange={(e) => setTempAngle(Number(e.target.value))}
                      className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                    />
                    <span className="text-sm text-gray-400 w-12">°</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Gravity (g)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.1"
                      value={tempGravity}
                      onChange={(e) => setTempGravity(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      value={tempGravity}
                      onChange={(e) => setTempGravity(Number(e.target.value))}
                      step="0.1"
                      className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                    />
                    <span className="text-sm text-gray-400 w-12">m/s²</span>
                  </div>
                </div>

                <button
                  onClick={handleApplyChanges}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/30"
                >
                  Apply Changes
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold">Calculations</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-cyan-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Max Height</span>
                    <span className="text-lg font-bold text-cyan-400">{maxHeight.toFixed(2)} m</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Time</span>
                    <span className="text-lg font-bold text-purple-400">{totalTime.toFixed(2)} s</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Range</span>
                    <span className="text-lg font-bold text-green-400">{range.toFixed(2)} m</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-orange-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">vₓ (horizontal)</span>
                    <span className="text-lg font-bold text-orange-400">{v0x.toFixed(2)} m/s</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-pink-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">vᵧ (initial vertical)</span>
                    <span className="text-lg font-bold text-pink-400">{v0y.toFixed(2)} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

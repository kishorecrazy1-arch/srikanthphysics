import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  path: Array<{ x: number; y: number }>;
  alive: boolean;
  t: number;
}

const WORLD = { xmin: 0, xmax: 7, ymin: 0, ymax: 4.5 };
const hoopX = 4.2;
const hoopY = 3.0;
const releaseY = 2.0;
const rimRadius = 0.23;
const ballRadius = 0.12;
const backboardX = 4.35;

export function BasketballSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTsRef = useRef<number>(0);

  const [velocity, setVelocity] = useState(7.2);
  const [angle, setAngle] = useState(52);
  const [gravity, setGravity] = useState(9.8);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');

  const [ball, setBall] = useState<Ball>({
    x: 0,
    y: releaseY,
    vx: 0,
    vy: 0,
    path: [],
    alive: false,
    t: 0,
  });

  // Scale helpers (meters → pixels)
  const sx = (x: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    return (x - WORLD.xmin) * (canvas.width / (WORLD.xmax - WORLD.xmin));
  };

  const sy = (y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    return canvas.height - (y - WORLD.ymin) * (canvas.height / (WORLD.ymax - WORLD.ymin));
  };

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  const resetBall = () => {
    const thetaRad = toRad(angle);
    const v0x = velocity * Math.cos(thetaRad);
    const v0y = velocity * Math.sin(thetaRad);

    setBall({
      x: 0.0,
      y: releaseY,
      vx: v0x,
      vy: v0y,
      t: 0,
      path: [{ x: 0, y: releaseY }],
      alive: true,
    });
    setMessage('');
  };

  const handleBackboardCollision = (b: Ball): Ball => {
    let newBall = { ...b };
    if (newBall.x + ballRadius > backboardX && newBall.vx > 0) {
      newBall.x = backboardX - ballRadius;
      newBall.vx = -0.7 * newBall.vx;
      newBall.vy = 0.95 * newBall.vy;
    }
    return newBall;
  };

  const handleRimCollision = (b: Ball): Ball => {
    let newBall = { ...b };
    const dx = newBall.x - hoopX;
    const dy = newBall.y - hoopY;
    const d = Math.hypot(dx, dy);
    const minDist = rimRadius + ballRadius;

    if (d < minDist) {
      const nx = dx / (d || 1e-6);
      const ny = dy / (d || 1e-6);
      const penetration = minDist - d;
      newBall.x += nx * penetration;
      newBall.y += ny * penetration;

      const vdotn = newBall.vx * nx + newBall.vy * ny;
      const e = 0.6;
      newBall.vx -= (1 + e) * vdotn * nx;
      newBall.vy -= (1 + e) * vdotn * ny;
    }
    return newBall;
  };

  const applyNetFeel = (b: Ball): Ball => {
    let newBall = { ...b };
    const insideX = Math.abs(newBall.x - hoopX) < 0.9 * rimRadius;
    if (newBall.y < hoopY && insideX) {
      newBall.vy -= 1.5 * (1 / 60);
    }
    return newBall;
  };



  // Drawing functions
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';

    for (let x = WORLD.xmin; x <= WORLD.xmax; x += 0.5) {
      ctx.beginPath();
      ctx.moveTo(sx(x), sy(WORLD.ymin));
      ctx.lineTo(sx(x), sy(WORLD.ymax));
      ctx.stroke();
    }

    for (let y = WORLD.ymin; y <= WORLD.ymax; y += 0.5) {
      ctx.beginPath();
      ctx.moveTo(sx(WORLD.xmin), sy(y));
      ctx.lineTo(sx(WORLD.xmax), sy(y));
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawHoop = (ctx: CanvasRenderingContext2D) => {
    // Backboard
    ctx.fillStyle = '#999';
    ctx.fillRect(sx(backboardX), sy(hoopY + 0.8), 5, sy(hoopY - 0.8) - sy(hoopY + 0.8));

    // Rim (half-circle)
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const rimPxRadius = rimRadius * (ctx.canvas.width / (WORLD.xmax - WORLD.xmin));
    ctx.arc(sx(hoopX), sy(hoopY), rimPxRadius, Math.PI, 0);
    ctx.stroke();

    // Simple net lines
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(sx(hoopX + i * 0.05), sy(hoopY));
      ctx.lineTo(sx(hoopX + i * 0.02), sy(hoopY - 0.35));
      ctx.stroke();
    }
  };

  const drawBall = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.save();
    ctx.fillStyle = '#ff8a00';
    const ballPxRadius = ballRadius * (ctx.canvas.width / (WORLD.xmax - WORLD.xmin));
    ctx.beginPath();
    ctx.arc(sx(x), sy(y), ballPxRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawPath = (ctx: CanvasRenderingContext2D, path: Array<{ x: number; y: number }>) => {
    if (!path || path.length < 2) return;

    ctx.save();
    ctx.strokeStyle = 'rgba(200,150,255,0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(sx(path[0].x), sy(path[0].y));
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(sx(path[i].x), sy(path[i].y));
    }
    ctx.stroke();
    ctx.restore();
  };

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx);

    // Draw ground
    ctx.strokeStyle = '#28cc77';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx(WORLD.xmin), sy(0));
    ctx.lineTo(sx(WORLD.xmax), sy(0));
    ctx.stroke();

    // Draw hoop
    drawHoop(ctx);

    // Draw trajectory
    drawPath(ctx, ball.path);

    // Draw ball
    if (ball.alive) {
      drawBall(ctx, ball.x, ball.y);
    }
  }, [ball, velocity, angle, gravity]);

  // Animation loop
  useEffect(() => {
    if (!running) return;

    const loop = (ts: number) => {
      const dt = Math.min(0.033, (ts - (lastTsRef.current || ts)) / 1000);
      lastTsRef.current = ts;

      setBall((prevBall) => {
        if (!prevBall.alive) {
          setRunning(false);
          return prevBall;
        }

        let newBall = { ...prevBall };

        // Gravity
        newBall.vy += gravity * dt * -1;

        // Integrate
        newBall.x += newBall.vx * dt;
        newBall.y += newBall.vy * dt;
        newBall.t += dt;

        // Record trail
        if (
          newBall.path.length === 0 ||
          distance(newBall.path[newBall.path.length - 1], newBall) > 0.03
        ) {
          newBall.path = [...newBall.path, { x: newBall.x, y: newBall.y }];
        }

        // Collisions
        newBall = handleBackboardCollision(newBall);
        newBall = handleRimCollision(newBall);
        newBall = applyNetFeel(newBall);

        // Check for score
        const dx = newBall.x - hoopX;
        const dy = newBall.y - hoopY;
        const distCenter = Math.hypot(dx, dy);
        const goingDown = newBall.vy < 0;
        if (distCenter < rimRadius * 0.92 && goingDown) {
          setMessage('🏀 SWISH! Perfect shot!');
        }

        // Stop if below ground or out of bounds
        if (newBall.y - ballRadius <= WORLD.ymin || newBall.x > WORLD.xmax + 0.2) {
          newBall.alive = false;
        }

        return newBall;
      });

      if (running) {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [running, gravity]);

  // Reset ball when parameters change (but not on initial mount to avoid double reset)
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    resetBall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [velocity, angle, gravity]);

  const handleApply = () => {
    resetBall();
    setRunning(false);
  };

  const handleLaunch = () => {
    resetBall();
    setRunning(true);
    setMessage('');
  };

  const handleReset = () => {
    setRunning(false);
    resetBall();
  };

  const getPerfectShot = () => {
    const x = hoopX;
    const dy = hoopY - releaseY;
    const R = Math.hypot(x, dy);
    const v0min = Math.sqrt(gravity * (dy + R));
    const theta = (Math.atan((dy + R) / x) * 180) / Math.PI;
    return { v0: v0min, thetaDeg: theta };
  };

  const handleAutoSolve = () => {
    const { v0, thetaDeg } = getPerfectShot();
    setVelocity(v0);
    setAngle(thetaDeg);
    resetBall();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (running) {
          setRunning(false);
        } else {
          handleLaunch();
        }
      }
      if (e.key.toLowerCase() === 'r') {
        handleReset();
      }
      if (e.key.toLowerCase() === 'a') {
        handleAutoSolve();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [running]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Basketball Free Throw Simulator</h1>
          <p className="text-purple-200">Interactive Physics Visualization</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={450}
                  className="w-full rounded-xl bg-gradient-to-br from-slate-900/50 to-purple-900/20"
                />
                {message && (
                  <div className="absolute top-4 left-4 bg-green-600/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-green-400/30">
                    <div className="text-lg font-bold">{message}</div>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-400">Time:</span>
                      <span className="font-mono text-cyan-400">{ball.t.toFixed(2)} s</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-400">X Position:</span>
                      <span className="font-mono text-cyan-400">{ball.x.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-400">Y Position:</span>
                      <span className="font-mono text-cyan-400">{ball.y.toFixed(2)} m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={handleLaunch}
                  disabled={running}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center transition-all hover:scale-105 shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-8 h-8 ml-1" />
                </button>
                <button
                  onClick={() => setRunning(!running)}
                  disabled={!ball.alive}
                  className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleReset}
                  className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleAutoSolve}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Auto Solve
                </button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-400">
                <p>Press <kbd className="px-2 py-1 bg-slate-700 rounded">Space</kbd> to launch/pause, <kbd className="px-2 py-1 bg-slate-700 rounded">R</kbd> to reset, <kbd className="px-2 py-1 bg-slate-700 rounded">A</kbd> for auto-solve</p>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4">Input Parameters</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Initial Velocity: {velocity.toFixed(2)} m/s
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="3"
                      max="15"
                      step="0.1"
                      value={velocity}
                      onChange={(e) => setVelocity(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      value={velocity}
                      onChange={(e) => setVelocity(Number(e.target.value))}
                      step="0.1"
                      className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                    />
                    <span className="text-sm text-gray-400 w-12">m/s</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Launch Angle: {angle.toFixed(1)}°
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                    />
                    <span className="text-sm text-gray-400 w-12">°</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Gravity: {gravity.toFixed(1)} m/s²
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.1"
                      value={gravity}
                      onChange={(e) => setGravity(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <input
                      type="number"
                      value={gravity}
                      onChange={(e) => setGravity(Number(e.target.value))}
                      step="0.1"
                      className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
                    />
                    <span className="text-sm text-gray-400 w-12">m/s²</span>
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-purple-500/30"
                >
                  Apply Changes
                </button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4">Basketball Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Hoop Position:</span>
                  <span className="text-white">({hoopX.toFixed(1)}m, {hoopY.toFixed(1)}m)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Release Height:</span>
                  <span className="text-white">{releaseY.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rim Radius:</span>
                  <span className="text-white">{rimRadius.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ball Radius:</span>
                  <span className="text-white">{ballRadius.toFixed(2)} m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


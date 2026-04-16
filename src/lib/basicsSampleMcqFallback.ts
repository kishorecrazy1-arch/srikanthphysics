/**
 * Fallback MCQs when AI generation is unavailable. Each entry is self-consistent:
 * question text, four options, correct letter, and worked steps (not a generic template).
 */
export type SampleMcqDef = {
  questionText: string;
  optionsObj: Record<'A' | 'B' | 'C' | 'D', string>;
  correctLetter: 'A' | 'B' | 'C' | 'D';
  solutionSteps: string[];
};

const L1: SampleMcqDef[] = [
  {
    questionText:
      'A ball is thrown vertically upward with an initial velocity of 20 m/s. What is its velocity after 2 seconds? (g = 10 m/s²)',
    optionsObj: { A: '0 m/s', B: '10 m/s upward', C: '20 m/s upward', D: '40 m/s downward' },
    correctLetter: 'A',
    solutionSteps: [
      'Use v = u − gt with u = +20 m/s, g = 10 m/s², t = 2 s.',
      'v = 20 − 20 = 0 m/s (instantaneously at the top).',
    ],
  },
  {
    questionText:
      'An object moves with constant acceleration of 5 m/s² from rest. What distance does it cover in 4 seconds?',
    optionsObj: { A: '20 m', B: '30 m', C: '40 m', D: '80 m' },
    correctLetter: 'C',
    solutionSteps: ['s = ½ a t² = ½ × 5 × 16 = 40 m.'],
  },
  {
    questionText: 'A car accelerates from 10 m/s to 30 m/s in 5 seconds. What is its acceleration?',
    optionsObj: { A: '2 m/s²', B: '3 m/s²', C: '4 m/s²', D: '8 m/s²' },
    correctLetter: 'C',
    solutionSteps: ['a = (30 − 10) / 5 = 4 m/s².'],
  },
  {
    questionText: 'An object moves from x₁ = 5 m to x₂ = 15 m. What is its displacement?',
    optionsObj: { A: '5 m', B: '10 m', C: '15 m', D: '20 m' },
    correctLetter: 'B',
    solutionSteps: ['Δx = 15 − 5 = 10 m.'],
  },
  {
    questionText: 'A car travels 60 km in 1 hour. What is its average speed in m/s?',
    optionsObj: { A: '≈ 16.7 m/s', B: '60 m/s', C: '10 m/s', D: '100 m/s' },
    correctLetter: 'A',
    solutionSteps: ['60 km/h = 60000 m / 3600 s ≈ 16.67 m/s.'],
  },
  {
    questionText:
      'A ball is thrown upward with velocity 15 m/s. What is the maximum height? (g = 10 m/s²)',
    optionsObj: { A: '8.0 m', B: '11.25 m', C: '15 m', D: '22.5 m' },
    correctLetter: 'B',
    solutionSteps: ['h = u²/(2g) = 225/20 = 11.25 m.'],
  },
  {
    questionText: 'From rest, an object covers 50 m in 5 s with uniform acceleration. Find a.',
    optionsObj: { A: '2 m/s²', B: '3 m/s²', C: '4 m/s²', D: '10 m/s²' },
    correctLetter: 'C',
    solutionSteps: ['a = 2s/t² = 100/25 = 4 m/s².'],
  },
  {
    questionText: 'A stone is dropped from 45 m. Time to ground? (g = 10 m/s²)',
    optionsObj: { A: '2.0 s', B: '3.0 s', C: '4.5 s', D: '9.0 s' },
    correctLetter: 'B',
    solutionSteps: ['t = √(2h/g) = √(90/10) = 3 s.'],
  },
  {
    questionText: 'u = 5 m/s, a = 2 m/s², t = 3 s (same direction). Find v.',
    optionsObj: { A: '8 m/s', B: '11 m/s', C: '15 m/s', D: '6 m/s' },
    correctLetter: 'B',
    solutionSteps: ['v = u + at = 5 + 6 = 11 m/s.'],
  },
  {
    questionText: '100 m in 10 s in a straight line. Average velocity?',
    optionsObj: { A: '5 m/s', B: '10 m/s', C: '15 m/s', D: '1000 m/s' },
    correctLetter: 'B',
    solutionSteps: ['v_avg = 100/10 = 10 m/s.'],
  },
];

const L2: SampleMcqDef[] = [
  {
    questionText: 'x = 2t² + 3t (m). Velocity at t = 2 s?',
    optionsObj: { A: '7 m/s', B: '11 m/s', C: '14 m/s', D: '19 m/s' },
    correctLetter: 'B',
    solutionSteps: ['v = dx/dt = 4t + 3 → v(2) = 11 m/s.'],
  },
  {
    questionText: 'Two objects approach at 10 m/s and 5 m/s. Relative speed of approach?',
    optionsObj: { A: '5 m/s', B: '10 m/s', C: '15 m/s', D: '2 m/s' },
    correctLetter: 'C',
    solutionSteps: ['Add speeds: 10 + 5 = 15 m/s.'],
  },
  {
    questionText: 'Thrown up at 20 m/s. Time to max height? (g = 10)',
    optionsObj: { A: '1.0 s', B: '2.0 s', C: '3.0 s', D: '4.0 s' },
    correctLetter: 'B',
    solutionSteps: ['t = u/g = 20/10 = 2 s.'],
  },
  {
    questionText: 'Rest, a = 2 m/s² for 4 s, then constant v for 2 s. Total distance?',
    optionsObj: { A: '24 m', B: '28 m', C: '32 m', D: '40 m' },
    correctLetter: 'C',
    solutionSteps: ['s₁ = ½×2×16 = 16 m, v = 8 m/s; s₂ = 8×2 = 16 m; total 32 m.'],
  },
  {
    questionText: '0→20 m/s in 10 s, then 20→10 m/s in 5 s. Average a over 0–15 s?',
    optionsObj: { A: '≈ 0.67 m/s²', B: '1.5 m/s²', C: '2.0 m/s²', D: '3.0 m/s²' },
    correctLetter: 'A',
    solutionSteps: ['a_avg = (10 − 0)/15 ≈ 0.67 m/s².'],
  },
  {
    questionText: 'Thrown up 25 m/s. Velocity when back at launch height? (no drag)',
    optionsObj: { A: '0 m/s', B: '25 m/s downward', C: '50 m/s down', D: '25 m/s up' },
    correctLetter: 'B',
    solutionSteps: ['Same height → same speed, opposite direction: 25 m/s down.'],
  },
  {
    questionText: 'v = 3t + 2 m/s. Displacement 0 to 4 s?',
    optionsObj: { A: '20 m', B: '32 m', C: '40 m', D: '48 m' },
    correctLetter: 'B',
    solutionSteps: ['x = 1.5t² + 2t → x(4) = 24 + 8 = 32 m.'],
  },
  {
    questionText: 'Cars: A east 15 m/s, B north 20 m/s. |v_B − v_A|?',
    optionsObj: { A: '15 m/s', B: '20 m/s', C: '25 m/s', D: '35 m/s' },
    correctLetter: 'C',
    solutionSteps: ['√(15² + 20²) = 25 m/s.'],
  },
  {
    questionText: 'a = 2t from rest. v at t = 3 s?',
    optionsObj: { A: '6 m/s', B: '9 m/s', C: '12 m/s', D: '18 m/s' },
    correctLetter: 'B',
    solutionSteps: ['v = ∫2t dt = t² → v(3) = 9 m/s.'],
  },
  {
    questionText: 'Up at 30 m/s. Height after 2 s? (g = 10)',
    optionsObj: { A: '20 m', B: '40 m', C: '45 m', D: '60 m' },
    correctLetter: 'B',
    solutionSteps: ['y = ut − ½gt² = 60 − 20 = 40 m.'],
  },
];

const L3: SampleMcqDef[] = [
  {
    questionText: 'Projectile 40 m/s at 30°. Max height? (g = 10)',
    optionsObj: { A: '10 m', B: '20 m', C: '40 m', D: '80 m' },
    correctLetter: 'B',
    solutionSteps: ['u_y = 40 sin30° = 20 m/s; H = u_y²/(2g) = 20 m.'],
  },
  {
    questionText: 'a(t)=2t−4, v(0)=5 m/s. v(2)?',
    optionsObj: { A: '1 m/s', B: '3 m/s', C: '5 m/s', D: '9 m/s' },
    correctLetter: 'A',
    solutionSteps: ['v = 5 + t² − 4t → v(2)=5+4−8=1 m/s.'],
  },
  {
    questionText:
      'Ball dropped from 20 m; another thrown up from ground at 15 m/s. When do they meet? (g = 10 m/s²)',
    optionsObj: { A: '0.80 s', B: '4/3 s (≈1.33 s)', C: '1.50 s', D: '2.00 s' },
    correctLetter: 'B',
    solutionSteps: [
      'Positions: y₁ = 20 − ½gt², y₂ = 15t − ½gt². Meeting: 20 − 5t² = 15t − 5t² ⇒ 20 = 15t ⇒ t = 4/3 s.',
    ],
  },
  {
    questionText: 'x(t) = t³ − 6t² + 9t (m). When is v(t) = 0 (other than t=0)?',
    optionsObj: { A: 't = 1 s and t = 3 s', B: 't = 2 s only', C: 't = 4 s', D: 't = 0 s only' },
    correctLetter: 'A',
    solutionSteps: [
      'v = 3t² − 12t + 9 = 3(t−1)(t−3).',
      'v = 0 at t = 1 s and t = 3 s (direction changes).',
    ],
  },
  {
    questionText: 'Horizontal projectile v₀ = 30 m/s from height 45 m. Time of flight? (g = 10)',
    optionsObj: { A: '1.5 s', B: '2.0 s', C: '3.0 s', D: '4.5 s' },
    correctLetter: 'C',
    solutionSteps: ['Vertical: 45 = ½ g t² ⇒ t = √(90/10) = 3 s (horizontal does not change time to fall from that height if launched horizontally from that vertical drop — actually from 45m drop t=3s).'],
  },
  {
    questionText: 'Relative speed: one train 25 m/s east, another 15 m/s west. Relative speed magnitude?',
    optionsObj: { A: '10 m/s', B: '25 m/s', C: '40 m/s', D: '375 m/s' },
    correctLetter: 'C',
    solutionSteps: ['Opposite directions: 25 + 15 = 40 m/s.'],
  },
  {
    questionText: 'Uniform circular motion: r = 2 m, period T = 4 s. Magnitude of centripetal acceleration?',
    optionsObj: { A: 'π²/2 m/s²', B: 'π²/4 m/s²', C: '2π m/s²', D: 'π m/s²' },
    correctLetter: 'A',
    solutionSteps: [
      'ω = 2π/T = π/2 rad/s.',
      'a = ω² r = (π²/4) × 2 = π²/2 m/s².',
    ],
  },
  {
    questionText: 'A 200 J amount of work is done in 4 s. Average power?',
    optionsObj: { A: '25 W', B: '40 W', C: '50 W', D: '800 W' },
    correctLetter: 'C',
    solutionSteps: ['P = W/t = 200/4 = 50 W.'],
  },
  {
    questionText: 'u = 10 m/s, a = −2 m/s² for 3 s along a straight line. Displacement?',
    optionsObj: { A: '18 m', B: '21 m', C: '24 m', D: '30 m' },
    correctLetter: 'B',
    solutionSteps: ['s = ut + ½at² = 30 − 9 = 21 m.'],
  },
  {
    questionText: 'Boat crosses river at 4 m/s (relative to water) perpendicular to current 3 m/s. Speed relative to ground?',
    optionsObj: { A: '1 m/s', B: '5 m/s', C: '7 m/s', D: '12 m/s' },
    correctLetter: 'B',
    solutionSteps: ['Ground speed magnitude = √(3² + 4²) = 5 m/s.'],
  },
];

export function getSampleMcqDefsForLevel(level: string): SampleMcqDef[] {
  if (level === 'level_3') return [...L3];
  if (level === 'level_2') return [...L2];
  return [...L1];
}

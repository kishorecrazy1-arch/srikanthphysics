import { Question } from '../types';

export const sampleQuestions: Question[] = [
  {
    id: 1,
    topic: 'Kinematics',
    difficulty: 2,
    questionText: 'A car accelerates uniformly from rest to a speed of 30 m/s in 6 seconds. What is the acceleration of the car?',
    options: [
      { id: 'A', text: '3 m/s²' },
      { id: 'B', text: '5 m/s²' },
      { id: 'C', text: '6 m/s²' },
      { id: 'D', text: '180 m/s²' }
    ],
    correctAnswer: 'B',
    explanation: 'Using the equation a = (v_f - v_i) / t, where v_f = 30 m/s, v_i = 0 m/s (from rest), and t = 6 s: a = (30 - 0) / 6 = 5 m/s²',
    keyConcept: 'Uniform acceleration: a = Δv / Δt'
  },
  {
    id: 2,
    topic: 'Kinematics',
    difficulty: 3,
    questionText: 'A ball is thrown vertically upward with an initial velocity of 20 m/s. Ignoring air resistance, what is the maximum height reached? (g = 10 m/s²)',
    options: [
      { id: 'A', text: '10 m' },
      { id: 'B', text: '20 m' },
      { id: 'C', text: '40 m' },
      { id: 'D', text: '200 m' }
    ],
    correctAnswer: 'B',
    explanation: 'At maximum height, final velocity = 0. Using v² = v₀² + 2aΔy: 0 = (20)² + 2(-10)Δy → 0 = 400 - 20Δy → Δy = 20 m',
    keyConcept: 'At maximum height, vertical velocity equals zero'
  },
  {
    id: 3,
    topic: 'Kinematics',
    difficulty: 4,
    questionText: 'A projectile is launched at 25 m/s at an angle of 37° above horizontal. What is the horizontal component of its velocity? (sin 37° = 0.6, cos 37° = 0.8)',
    options: [
      { id: 'A', text: '15 m/s' },
      { id: 'B', text: '20 m/s' },
      { id: 'C', text: '25 m/s' },
      { id: 'D', text: '30 m/s' }
    ],
    correctAnswer: 'B',
    explanation: 'The horizontal component is v_x = v cos θ = 25 × cos(37°) = 25 × 0.8 = 20 m/s',
    keyConcept: 'Resolve velocity vectors: v_x = v cos θ, v_y = v sin θ'
  },
  {
    id: 4,
    topic: 'Kinematics',
    difficulty: 3,
    questionText: 'An object travels 100 meters in 5 seconds, then 150 meters in the next 10 seconds. What is its average speed for the entire trip?',
    options: [
      { id: 'A', text: '12.5 m/s' },
      { id: 'B', text: '15 m/s' },
      { id: 'C', text: '16.7 m/s' },
      { id: 'D', text: '20 m/s' }
    ],
    correctAnswer: 'C',
    explanation: 'Average speed = total distance / total time = (100 + 150) / (5 + 10) = 250 / 15 = 16.7 m/s',
    keyConcept: 'Average speed = total distance divided by total time'
  },
  {
    id: 5,
    topic: 'Kinematics',
    difficulty: 2,
    questionText: 'A train moving at constant velocity travels 240 meters in 12 seconds. What is its velocity?',
    options: [
      { id: 'A', text: '15 m/s' },
      { id: 'B', text: '20 m/s' },
      { id: 'C', text: '24 m/s' },
      { id: 'D', text: '30 m/s' }
    ],
    correctAnswer: 'B',
    explanation: 'For constant velocity: v = d / t = 240 m / 12 s = 20 m/s',
    keyConcept: 'Constant velocity means speed and direction remain unchanged'
  },
  {
    id: 6,
    topic: "Newton's Laws",
    difficulty: 3,
    questionText: 'A 5 kg block is pushed with a force of 20 N on a frictionless surface. What is the acceleration of the block?',
    options: [
      { id: 'A', text: '2 m/s²' },
      { id: 'B', text: '4 m/s²' },
      { id: 'C', text: '5 m/s²' },
      { id: 'D', text: '10 m/s²' }
    ],
    correctAnswer: 'B',
    explanation: 'Using Newton\'s Second Law: F = ma → a = F/m = 20 N / 5 kg = 4 m/s²',
    keyConcept: 'Newton\'s Second Law: F = ma, or a = F/m'
  },
  {
    id: 7,
    topic: "Newton's Laws",
    difficulty: 4,
    questionText: 'A 10 kg block is pulled across a surface with a coefficient of kinetic friction of 0.3 by a horizontal force of 50 N. What is the acceleration? (g = 10 m/s²)',
    options: [
      { id: 'A', text: '2 m/s²' },
      { id: 'B', text: '3 m/s²' },
      { id: 'C', text: '4 m/s²' },
      { id: 'D', text: '5 m/s²' }
    ],
    correctAnswer: 'A',
    explanation: 'Friction force: f = μN = 0.3 × 10 × 10 = 30 N. Net force: F_net = 50 - 30 = 20 N. Acceleration: a = F_net/m = 20/10 = 2 m/s²',
    keyConcept: 'Net force accounts for all forces including friction: F_net = F_applied - f_friction'
  },
  {
    id: 8,
    topic: "Newton's Laws",
    difficulty: 3,
    questionText: 'Two blocks of masses 2 kg and 3 kg are in contact on a frictionless surface. A force of 10 N is applied to the 2 kg block. What is the acceleration of the system?',
    options: [
      { id: 'A', text: '1 m/s²' },
      { id: 'B', text: '2 m/s²' },
      { id: 'C', text: '3.33 m/s²' },
      { id: 'D', text: '5 m/s²' }
    ],
    correctAnswer: 'B',
    explanation: 'Both blocks move together as one system. Total mass = 2 + 3 = 5 kg. Using F = ma: a = F/m = 10/5 = 2 m/s²',
    keyConcept: 'For connected objects, treat as a system with combined mass'
  },
  {
    id: 9,
    topic: "Newton's Laws",
    difficulty: 5,
    questionText: 'A 3 kg block hangs from a rope attached to a 5 kg block on a frictionless table. What is the acceleration of the system? (g = 10 m/s²)',
    options: [
      { id: 'A', text: '2.5 m/s²' },
      { id: 'B', text: '3.0 m/s²' },
      { id: 'C', text: '3.75 m/s²' },
      { id: 'D', text: '6.0 m/s²' }
    ],
    correctAnswer: 'C',
    explanation: 'The hanging mass pulls the system. F = m_hanging × g = 3 × 10 = 30 N. Total mass = 3 + 5 = 8 kg. a = F/m_total = 30/8 = 3.75 m/s²',
    keyConcept: 'For pulley systems, the driving force is the weight of the hanging mass'
  },
  {
    id: 10,
    topic: "Newton's Laws",
    difficulty: 2,
    questionText: 'An object at rest remains at rest unless acted upon by an unbalanced force. This is a statement of which law?',
    options: [
      { id: 'A', text: "Newton's First Law (Inertia)" },
      { id: 'B', text: "Newton's Second Law (F=ma)" },
      { id: 'C', text: "Newton's Third Law (Action-Reaction)" },
      { id: 'D', text: 'Law of Conservation of Energy' }
    ],
    correctAnswer: 'A',
    explanation: 'This describes Newton\'s First Law, also known as the Law of Inertia, which states that objects maintain their state of motion unless acted upon by a net external force.',
    keyConcept: 'Newton\'s First Law: Objects resist changes in motion (inertia)'
  },
  {
    id: 11,
    topic: 'Energy & Work',
    difficulty: 3,
    questionText: 'A 2 kg object is lifted vertically 5 meters. How much work is done against gravity? (g = 10 m/s²)',
    options: [
      { id: 'A', text: '10 J' },
      { id: 'B', text: '50 J' },
      { id: 'C', text: '100 J' },
      { id: 'D', text: '200 J' }
    ],
    correctAnswer: 'C',
    explanation: 'Work = Force × Distance = (mg) × h = (2 × 10) × 5 = 100 J',
    keyConcept: 'Work against gravity: W = mgh'
  },
  {
    id: 12,
    topic: 'Energy & Work',
    difficulty: 4,
    questionText: 'A spring with spring constant k = 200 N/m is compressed by 0.5 m. How much elastic potential energy is stored?',
    options: [
      { id: 'A', text: '12.5 J' },
      { id: 'B', text: '25 J' },
      { id: 'C', text: '50 J' },
      { id: 'D', text: '100 J' }
    ],
    correctAnswer: 'B',
    explanation: 'Elastic potential energy: PE = (1/2)kx² = (1/2)(200)(0.5)² = (1/2)(200)(0.25) = 25 J',
    keyConcept: 'Spring potential energy: PE = (1/2)kx²'
  },
  {
    id: 13,
    topic: 'Energy & Work',
    difficulty: 3,
    questionText: 'A 1 kg object falls from rest through a height of 20 m. What is its speed just before hitting the ground? (g = 10 m/s²)',
    options: [
      { id: 'A', text: '10 m/s' },
      { id: 'B', text: '14.1 m/s' },
      { id: 'C', text: '20 m/s' },
      { id: 'D', text: '200 m/s' }
    ],
    correctAnswer: 'C',
    explanation: 'Using conservation of energy: mgh = (1/2)mv² → gh = (1/2)v² → v = √(2gh) = √(2×10×20) = √400 = 20 m/s',
    keyConcept: 'Conservation of energy: PE converts to KE as object falls'
  },
  {
    id: 14,
    topic: 'Energy & Work',
    difficulty: 4,
    questionText: 'A 5 kg box is pushed 10 m across a floor by a 30 N force. If the coefficient of friction is 0.2, how much net work is done? (g = 10 m/s²)',
    options: [
      { id: 'A', text: '100 J' },
      { id: 'B', text: '200 J' },
      { id: 'C', text: '300 J' },
      { id: 'D', text: '400 J' }
    ],
    correctAnswer: 'B',
    explanation: 'Work by applied force: W_app = 30 × 10 = 300 J. Friction force: f = μmg = 0.2 × 5 × 10 = 10 N. Work by friction: W_f = -10 × 10 = -100 J. Net work = 300 - 100 = 200 J.',
    keyConcept: 'Net work = Work by all forces = W_applied - W_friction'
  },
  {
    id: 15,
    topic: 'Energy & Work',
    difficulty: 2,
    questionText: 'What is the kinetic energy of a 4 kg object moving at 5 m/s?',
    options: [
      { id: 'A', text: '10 J' },
      { id: 'B', text: '20 J' },
      { id: 'C', text: '50 J' },
      { id: 'D', text: '100 J' }
    ],
    correctAnswer: 'C',
    explanation: 'Kinetic energy: KE = (1/2)mv² = (1/2)(4)(5)² = (1/2)(4)(25) = 50 J',
    keyConcept: 'Kinetic energy: KE = (1/2)mv²'
  },
  {
    id: 16,
    topic: 'Momentum',
    difficulty: 3,
    questionText: 'A 2 kg object moving at 10 m/s collides with a 3 kg object at rest. They stick together. What is their final velocity?',
    options: [
      { id: 'A', text: '2 m/s' },
      { id: 'B', text: '4 m/s' },
      { id: 'C', text: '5 m/s' },
      { id: 'D', text: '6.67 m/s' }
    ],
    correctAnswer: 'B',
    explanation: 'Conservation of momentum: m₁v₁ + m₂v₂ = (m₁+m₂)v_f → 2(10) + 3(0) = (2+3)v_f → 20 = 5v_f → v_f = 4 m/s',
    keyConcept: 'Inelastic collision: momentum is conserved, objects stick together'
  },
  {
    id: 17,
    topic: 'Momentum',
    difficulty: 4,
    questionText: 'A 1 kg ball moving at 8 m/s collides elastically with a 1 kg ball at rest. What is the velocity of the first ball after collision?',
    options: [
      { id: 'A', text: '0 m/s' },
      { id: 'B', text: '4 m/s' },
      { id: 'C', text: '6 m/s' },
      { id: 'D', text: '8 m/s' }
    ],
    correctAnswer: 'A',
    explanation: 'In an elastic collision between equal masses where one is at rest, the moving ball stops and the stationary ball moves with the original velocity. First ball: 0 m/s, Second ball: 8 m/s.',
    keyConcept: 'Elastic collision with equal masses: velocities are exchanged'
  },
  {
    id: 18,
    topic: 'Momentum',
    difficulty: 3,
    questionText: 'What is the momentum of a 5 kg object moving at 12 m/s?',
    options: [
      { id: 'A', text: '17 kg⋅m/s' },
      { id: 'B', text: '60 kg⋅m/s' },
      { id: 'C', text: '72 kg⋅m/s' },
      { id: 'D', text: '120 kg⋅m/s' }
    ],
    correctAnswer: 'B',
    explanation: 'Momentum: p = mv = 5 kg × 12 m/s = 60 kg⋅m/s',
    keyConcept: 'Momentum: p = mv (mass times velocity)'
  },
  {
    id: 19,
    topic: 'Momentum',
    difficulty: 4,
    questionText: 'A 0.5 kg ball moving at 20 m/s strikes a wall and bounces back at 15 m/s. What is the change in momentum?',
    options: [
      { id: 'A', text: '2.5 kg⋅m/s' },
      { id: 'B', text: '10 kg⋅m/s' },
      { id: 'C', text: '17.5 kg⋅m/s' },
      { id: 'D', text: '35 kg⋅m/s' }
    ],
    correctAnswer: 'C',
    explanation: 'Initial momentum: p_i = 0.5 × 20 = 10 kg⋅m/s. Final momentum: p_f = 0.5 × (-15) = -7.5 kg⋅m/s (negative because opposite direction). Change: Δp = p_f - p_i = -7.5 - 10 = -17.5 kg⋅m/s. Magnitude: 17.5 kg⋅m/s',
    keyConcept: 'Change in momentum accounts for direction: Δp = p_f - p_i'
  },
  {
    id: 20,
    topic: 'Momentum',
    difficulty: 2,
    questionText: 'Which quantity is conserved in all collisions?',
    options: [
      { id: 'A', text: 'Kinetic Energy' },
      { id: 'B', text: 'Momentum' },
      { id: 'C', text: 'Velocity' },
      { id: 'D', text: 'Speed' }
    ],
    correctAnswer: 'B',
    explanation: 'Momentum is always conserved in collisions (in the absence of external forces). Kinetic energy is only conserved in elastic collisions.',
    keyConcept: 'Momentum is conserved in all collisions; KE only in elastic collisions'
  },
  {
    id: 21,
    topic: 'Circular Motion',
    difficulty: 3,
    questionText: 'A 2 kg object moves in a circle of radius 4 m at constant speed 8 m/s. What is the centripetal force?',
    options: [
      { id: 'A', text: '16 N' },
      { id: 'B', text: '32 N' },
      { id: 'C', text: '64 N' },
      { id: 'D', text: '128 N' }
    ],
    correctAnswer: 'B',
    explanation: 'Centripetal force: F_c = mv²/r = 2 × (8)² / 4 = 2 × 64 / 4 = 128 / 4 = 32 N',
    keyConcept: 'Centripetal force: F_c = mv²/r'
  },
  {
    id: 22,
    topic: 'Circular Motion',
    difficulty: 4,
    questionText: 'A car goes around a flat curve of radius 50 m at 20 m/s. What is the minimum coefficient of friction needed? (g = 10 m/s²)',
    options: [
      { id: 'A', text: '0.4' },
      { id: 'B', text: '0.6' },
      { id: 'C', text: '0.8' },
      { id: 'D', text: '1.0' }
    ],
    correctAnswer: 'C',
    explanation: 'Friction provides centripetal force: μmg = mv²/r → μg = v²/r → μ = v²/(rg) = (20)²/(50×10) = 400/500 = 0.8',
    keyConcept: 'On flat curves, friction provides the centripetal force'
  },
  {
    id: 23,
    topic: 'Circular Motion',
    difficulty: 3,
    questionText: 'An object moves in a circle at constant speed. Which statement is true?',
    options: [
      { id: 'A', text: 'Velocity is constant' },
      { id: 'B', text: 'Acceleration is zero' },
      { id: 'C', text: 'Speed is changing' },
      { id: 'D', text: 'Direction is changing' }
    ],
    correctAnswer: 'D',
    explanation: 'In circular motion at constant speed, the direction is continuously changing, which means velocity (a vector) is changing even though speed (magnitude) is constant. This requires centripetal acceleration.',
    keyConcept: 'Circular motion involves changing direction, hence changing velocity'
  },
  {
    id: 24,
    topic: 'Circular Motion',
    difficulty: 4,
    questionText: 'A 0.5 kg ball on a 2 m string swings in a horizontal circle making one revolution per second. What is the tension in the string?',
    options: [
      { id: 'A', text: '10π² N' },
      { id: 'B', text: '20π² N' },
      { id: 'C', text: '4π² N' },
      { id: 'D', text: '8π² N' }
    ],
    correctAnswer: 'C',
    explanation: 'Period T = 1 s, so ω = 2π/T = 2π rad/s. Centripetal force = tension: T = mω²r = 0.5 × (2π)² × 2 = 0.5 × 4π² × 2 = 4π² N',
    keyConcept: 'Tension provides centripetal force in circular motion'
  },
  {
    id: 25,
    topic: 'Circular Motion',
    difficulty: 2,
    questionText: 'What is the direction of centripetal acceleration?',
    options: [
      { id: 'A', text: 'Tangent to the circle' },
      { id: 'B', text: 'Toward the center' },
      { id: 'C', text: 'Away from the center' },
      { id: 'D', text: 'Perpendicular to the plane of motion' }
    ],
    correctAnswer: 'B',
    explanation: 'Centripetal acceleration always points toward the center of the circular path, causing the change in direction of velocity.',
    keyConcept: 'Centripetal acceleration always points toward the center of the circle'
  },
  {
    id: 26,
    topic: 'Rotational Motion',
    difficulty: 3,
    questionText: 'A wheel rotates at 120 rpm. What is its angular velocity in rad/s?',
    options: [
      { id: 'A', text: '2π rad/s' },
      { id: 'B', text: '4π rad/s' },
      { id: 'C', text: '6π rad/s' },
      { id: 'D', text: '8π rad/s' }
    ],
    correctAnswer: 'B',
    explanation: 'Convert rpm to rad/s: ω = 120 rev/min × (2π rad/rev) × (1 min/60 s) = 120 × 2π / 60 = 4π rad/s',
    keyConcept: 'Angular velocity conversion: multiply rpm by 2π/60'
  },
  {
    id: 27,
    topic: 'Rotational Motion',
    difficulty: 4,
    questionText: 'A solid disk of mass 4 kg and radius 0.5 m rotates at 10 rad/s. What is its rotational kinetic energy? (I_disk = ½mr²)',
    options: [
      { id: 'A', text: '12.5 J' },
      { id: 'B', text: '25 J' },
      { id: 'C', text: '50 J' },
      { id: 'D', text: '100 J' }
    ],
    correctAnswer: 'B',
    explanation: 'Moment of inertia: I = ½mr² = ½(4)(0.5)² = 0.5 kg⋅m². Rotational KE: KE_rot = ½Iω² = ½(0.5)(10)² = 0.25 × 100 = 25 J',
    keyConcept: 'Rotational kinetic energy: KE_rot = ½Iω²'
  },
  {
    id: 28,
    topic: 'Rotational Motion',
    difficulty: 3,
    questionText: 'A torque of 20 N⋅m is applied to a wheel with moment of inertia 5 kg⋅m². What is the angular acceleration?',
    options: [
      { id: 'A', text: '2 rad/s²' },
      { id: 'B', text: '4 rad/s²' },
      { id: 'C', text: '10 rad/s²' },
      { id: 'D', text: '100 rad/s²' }
    ],
    correctAnswer: 'B',
    explanation: 'Using τ = Iα (rotational analog of F = ma): α = τ/I = 20 / 5 = 4 rad/s²',
    keyConcept: 'Rotational analog of Newton\'s 2nd Law: τ = Iα'
  },
  {
    id: 29,
    topic: 'Rotational Motion',
    difficulty: 4,
    questionText: 'A force of 10 N is applied tangentially to a wheel of radius 2 m. What is the torque?',
    options: [
      { id: 'A', text: '5 N⋅m' },
      { id: 'B', text: '10 N⋅m' },
      { id: 'C', text: '20 N⋅m' },
      { id: 'D', text: '40 N⋅m' }
    ],
    correctAnswer: 'C',
    explanation: 'Torque: τ = rF sin θ. When force is tangential, θ = 90° and sin θ = 1, so τ = rF = 2 × 10 = 20 N⋅m',
    keyConcept: 'Torque: τ = rF (when force is perpendicular to radius)'
  },
  {
    id: 30,
    topic: 'Rotational Motion',
    difficulty: 2,
    questionText: 'What is the SI unit of angular velocity?',
    options: [
      { id: 'A', text: 'rad/s' },
      { id: 'B', text: 'rad/s²' },
      { id: 'C', text: 'm/s' },
      { id: 'D', text: 'rpm' }
    ],
    correctAnswer: 'A',
    explanation: 'Angular velocity is measured in radians per second (rad/s) in SI units. RPM is a common unit but not SI.',
    keyConcept: 'Angular velocity unit: rad/s (radians per second)'
  }
];

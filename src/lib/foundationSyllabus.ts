export type FoundationUnit = {
  id: number;
  name: string;
  icon: string;
  topics: string[];
};

/** Foundation course — 13 units (aligned with official Foundation syllabus PDF) */
export const FOUNDATION_SYLLABUS: FoundationUnit[] = [
  {
    id: 1,
    name: 'Units & Measurements',
    icon: '📏',
    topics: [
      'Fundamental and Derived Quantities',
      'SI Units and Measurement',
      'Dimensional Analysis',
      'Significant Figures',
      'Measurement Errors',
    ],
  },
  {
    id: 2,
    name: 'Kinematics',
    icon: '🏃',
    topics: [
      'Average Speed and Average Velocity',
      'Acceleration',
      'Kinematic Equations of Motion',
      'Position-Time Graphs',
      'Velocity-Time Graphs',
      'Acceleration-Time Graphs',
    ],
  },
  {
    id: 3,
    name: 'Laws of Motion',
    icon: '⚙️',
    topics: [
      "Newton's First Law of Motion",
      "Newton's Second Law (F=ma)",
      "Newton's Third Law of Motion",
      'Free Body Diagrams',
      'Impulse-Momentum Principle',
    ],
  },
  {
    id: 4,
    name: 'Work, Energy and Power',
    icon: '⚡',
    topics: [
      'Work Done by a Force',
      'Area Under Force-Displacement Graph',
      'Kinetic and Potential Energy',
      'Conservation of Energy',
      'Power and Its Units',
    ],
  },
  {
    id: 5,
    name: 'Rotational Motion',
    icon: '🌀',
    topics: [
      'Centre of Mass',
      'Moment of Force and Torque',
      'Angular Momentum',
      'Equilibrium',
      'Moment of Inertia',
    ],
  },
  {
    id: 6,
    name: 'Gravitation',
    icon: '🌍',
    topics: [
      "Newton's Law of Gravitation",
      'Acceleration Due to Gravity',
      'Variation with Altitude and Depth',
      "Kepler's Laws",
      'Escape Velocity and Orbital Velocity',
    ],
  },
  {
    id: 7,
    name: 'Properties of Matter',
    icon: '🔬',
    topics: [
      "Hooke's Law",
      "Young's Modulus",
      'Bulk and Rigidity Modulus',
      'Pressure and Its Measurement',
      "Bernoulli's Principle",
    ],
  },
  {
    id: 8,
    name: 'Thermodynamics',
    icon: '🌡️',
    topics: [
      'Gas Equation',
      'Types of Thermodynamic Processes',
      'Work Done in Thermodynamics',
      'Specific Heats of Gases',
    ],
  },
  {
    id: 9,
    name: 'Oscillations',
    icon: '〰️',
    topics: [
      'Simple Harmonic Motion',
      'Time Period and Frequency',
      'Displacement, Velocity and Acceleration in SHM',
      'Simple Pendulum',
      'Potential and Kinetic Energy in SHM',
    ],
  },
  {
    id: 10,
    name: 'Electrostatics',
    icon: '⚡',
    topics: [
      'Electric Charges and Conservation',
      "Coulomb's Law",
      'Electric Field',
      'Electric Flux',
    ],
  },
  {
    id: 11,
    name: 'Current Electricity',
    icon: '🔌',
    topics: [
      'Drift Velocity and Mobility',
      "Ohm's Law",
      'Resistance',
      'Resistors in Series and Parallel',
    ],
  },
  {
    id: 12,
    name: 'Dual Nature, Atoms & Nuclei',
    icon: '⚛️',
    topics: [
      'Dual Nature of Radiation',
      'Photoelectric Effect',
      'de Broglie Relation',
      "Bohr's Atomic Model",
    ],
  },
  {
    id: 13,
    name: 'Optics',
    icon: '🔭',
    topics: [
      'Reflection and Spherical Mirrors',
      'Mirror Formula',
      'Refraction at Plane and Spherical Surfaces',
      'Total Internal Reflection',
    ],
  },
];

export const UNIT_ACCENTS = [
  '#22d3ee', '#a78bfa', '#34d399', '#60a5fa', '#f472b6', '#38bdf8', '#c084fc', '#4ade80',
  '#2dd4bf', '#818cf8', '#fb923c', '#facc15', '#94a3b8', '#a855f7',
];

export function randomFoundationTopic(): { unit: FoundationUnit; topic: string } {
  const unit = FOUNDATION_SYLLABUS[Math.floor(Math.random() * FOUNDATION_SYLLABUS.length)];
  const topic = unit.topics[Math.floor(Math.random() * unit.topics.length)];
  return { unit, topic };
}

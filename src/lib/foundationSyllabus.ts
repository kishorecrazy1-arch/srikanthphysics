export type FoundationUnit = {
  id: number;
  name: string;
  icon: string;
  topics: string[];
};

/** Foundation course — 13 units (matches dashboard / practice / mock test) */
export const FOUNDATION_SYLLABUS: FoundationUnit[] = [
  { id: 1, name: 'Units & Measurements', icon: '📏', topics: ['Fundamental and Derived Quantities', 'SI Units and Their Symbols', 'Dimensional Analysis', 'Measurement Errors', 'Significant Figures'] },
  { id: 2, name: 'Kinematics', icon: '🏃', topics: ['Average Speed and Average Velocity', 'Acceleration', 'Kinematic Equations of Motion', 'Position-Time Graphs', 'Velocity-Time Graphs', 'Acceleration-Time Graphs'] },
  { id: 3, name: 'Laws of Motion', icon: '⚙️', topics: ["Newton's First Law", "Newton's Second Law (F=ma)", "Newton's Third Law", 'Free Body Diagrams', 'Impulse-Momentum Principle'] },
  { id: 4, name: 'Work, Energy and Power', icon: '⚡', topics: ['Work Done by a Force', 'Area Under Force-Displacement Graph', 'Types of Energy (KE, PE)', 'Conservation of Energy', 'Power and Its Units'] },
  { id: 5, name: 'Rotational Motion', icon: '🌀', topics: ['Centre of Mass', 'Torque', 'Moment of Inertia', 'Angular Momentum', 'Conservation of Angular Momentum'] },
  { id: 6, name: 'Gravitation', icon: '🌍', topics: ["Newton's Law of Gravitation", 'Gravitational Field', 'Escape Velocity', 'Orbital Motion', "Kepler's Laws"] },
  { id: 7, name: 'Properties of Matter', icon: '🔬', topics: ['Elasticity', 'Stress and Strain', "Young's Modulus", 'Fluid Pressure', 'Surface Tension', 'Viscosity'] },
  { id: 8, name: 'Thermodynamics', icon: '🌡️', topics: ['Temperature and Heat', 'Zeroth and First Law', 'Second Law', 'Carnot Engine', 'Heat Transfer'] },
  { id: 9, name: 'Waves & Oscillations', icon: '〰️', topics: ['Simple Harmonic Motion', 'Wave Properties', 'Speed of Sound', 'Doppler Effect', 'Standing Waves'] },
  { id: 10, name: 'Electricity & Magnetism', icon: '⚡', topics: ["Coulomb's Law", 'Electric Field', "Ohm's Law", 'Series & Parallel Circuits', "Kirchhoff's Laws", 'Magnetic Force'] },
  { id: 11, name: 'Electromagnetic Induction', icon: '🔄', topics: ["Faraday's Law", "Lenz's Law", 'AC and DC', 'Transformers', 'Eddy Currents'] },
  { id: 12, name: 'Dual Nature, Atoms & Nuclei', icon: '⚛️', topics: ['Photoelectric Effect', 'de Broglie Relation', "Bohr's Model", 'Nuclear Structure', 'Radioactivity'] },
  { id: 13, name: 'Optics', icon: '🔭', topics: ['Reflection', 'Spherical Mirrors', 'Refraction', 'Total Internal Reflection', 'Lenses and Lens Formula'] },
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
